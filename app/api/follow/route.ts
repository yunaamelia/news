import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { withRateLimit } from "@/app/lib/with-rate-limit";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/follow
 * Get followers or following list for a user
 * Query params:
 *   - userId: User ID to get followers/following for (defaults to current user)
 *   - type: 'followers' | 'following'
 *   - page: Page number (default 1)
 *   - limit: Items per page (default 20, max 50)
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const targetUserId = searchParams.get("userId");
  const type = searchParams.get("type") || "followers";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  const skip = (page - 1) * limit;

  try {
    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use targetUserId if provided, otherwise current user
    const userId = targetUserId || currentUser.id;

    // Validate type
    if (type !== "followers" && type !== "following") {
      return NextResponse.json(
        { error: "Invalid type. Must be 'followers' or 'following'" },
        { status: 400 }
      );
    }

    // Build query based on type
    const where =
      type === "followers"
        ? { followingId: userId } // People following this user
        : { followerId: userId }; // People this user follows

    // Get total count
    const total = await prisma.userFollow.count({ where });

    // Get follows with user details
    const follows = await prisma.userFollow.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Extract user data based on type
    const users = follows.map(
      (follow: {
        follower: {
          id: string;
          name: string | null;
          email: string;
          image: string | null;
        };
        following: {
          id: string;
          name: string | null;
          email: string;
          image: string | null;
        };
      }) => (type === "followers" ? follow.follower : follow.following)
    );

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching follows:", error);
    return NextResponse.json(
      { error: "Failed to fetch follows" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/follow
 * Follow a user
 * Body: { userId: string }
 */
async function followUser(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId: targetUserId } = body;

    // Validation
    if (!targetUserId || typeof targetUserId !== "string") {
      return NextResponse.json(
        { error: "Target user ID is required" },
        { status: 400 }
      );
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if trying to follow self
    if (currentUser.id === targetUserId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        idx_follow_unique: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: "Already following this user" },
        { status: 400 }
      );
    }

    // Create follow relationship
    const follow = await prisma.userFollow.create({
      data: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Successfully followed user",
        data: follow,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(followUser, { type: "write" });

/**
 * DELETE /api/follow
 * Unfollow a user
 * Query param: userId
 */
async function unfollowUser(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId");

    // Validation
    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID is required" },
        { status: 400 }
      );
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if following
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        idx_follow_unique: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    });

    if (!existingFollow) {
      return NextResponse.json(
        { error: "Not following this user" },
        { status: 400 }
      );
    }

    // Delete follow relationship
    await prisma.userFollow.delete({
      where: {
        idx_follow_unique: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    });

    return NextResponse.json({
      message: "Successfully unfollowed user",
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}

export const DELETE = withRateLimit(unfollowUser, { type: "write" });
