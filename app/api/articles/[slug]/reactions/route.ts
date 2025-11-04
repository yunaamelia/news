import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { withRateLimit } from "@/app/lib/with-rate-limit";
import type { ReactionType } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/articles/[slug]/reactions
 * Get reaction counts for an article
 */
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) {
  if (!context?.params) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const { slug } = await context.params;

    // Get article
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Get reaction counts grouped by type
    const reactions = await prisma.articleReaction.groupBy({
      by: ["type"],
      where: { articleId: article.id },
      _count: { type: true },
    });

    // Transform to object format
    const counts: Record<ReactionType, number> = {
      LIKE: 0,
      LOVE: 0,
      INSIGHTFUL: 0,
      BULLISH: 0,
      BEARISH: 0,
    };

    reactions.forEach((r: { type: ReactionType; _count: { type: number } }) => {
      counts[r.type] = r._count.type;
    });

    // Get current user's reaction if authenticated
    let userReaction = null;
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });

      if (user) {
        const reaction = await prisma.articleReaction.findUnique({
          where: {
            idx_reaction_user_article_unique: {
              userId: user.id,
              articleId: article.id,
            },
          },
          select: { type: true },
        });

        userReaction = reaction?.type || null;
      }
    }

    return NextResponse.json({
      counts,
      userReaction,
      total: Object.values(counts).reduce((sum, count) => sum + count, 0),
    });
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/articles/[slug]/reactions
 * Add or update a reaction to an article
 * Body: { type: ReactionType }
 */
async function addReaction(
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) {
  if (!context?.params) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await context.params;
    const body = await request.json();
    const { type } = body;

    // Validation
    const validTypes: ReactionType[] = [
      "LIKE",
      "LOVE",
      "INSIGHTFUL",
      "BULLISH",
      "BEARISH",
    ];
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: `Invalid reaction type. Must be one of: ${validTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get article
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Upsert reaction (create or update)
    const reaction = await prisma.articleReaction.upsert({
      where: {
        idx_reaction_user_article_unique: {
          userId: user.id,
          articleId: article.id,
        },
      },
      update: {
        type,
      },
      create: {
        userId: user.id,
        articleId: article.id,
        type,
      },
    });

    return NextResponse.json({
      message: "Reaction added successfully",
      data: reaction,
    });
  } catch (error) {
    console.error("Error adding reaction:", error);
    return NextResponse.json(
      { error: "Failed to add reaction" },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(addReaction, { type: "comment" });

/**
 * DELETE /api/articles/[slug]/reactions
 * Remove a reaction from an article
 */
async function removeReaction(
  request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) {
  if (!context?.params) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await context.params;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get article
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Check if reaction exists
    const existingReaction = await prisma.articleReaction.findUnique({
      where: {
        idx_reaction_user_article_unique: {
          userId: user.id,
          articleId: article.id,
        },
      },
    });

    if (!existingReaction) {
      return NextResponse.json(
        { error: "No reaction found to remove" },
        { status: 404 }
      );
    }

    // Delete reaction
    await prisma.articleReaction.delete({
      where: {
        idx_reaction_user_article_unique: {
          userId: user.id,
          articleId: article.id,
        },
      },
    });

    return NextResponse.json({
      message: "Reaction removed successfully",
    });
  } catch (error) {
    console.error("Error removing reaction:", error);
    return NextResponse.json(
      { error: "Failed to remove reaction" },
      { status: 500 }
    );
  }
}

export const DELETE = withRateLimit(removeReaction, { type: "write" });
