import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET - Fetch user's reading history
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      prisma.readingHistory.findMany({
        where: { userId: user.id },
        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              coverImage: true,
              category: true,
              tags: true,
              author: true,
              authorImage: true,
              isPremium: true,
              views: true,
              publishedAt: true,
            },
          },
        },
        orderBy: { readAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.readingHistory.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get reading history error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil riwayat bacaan" },
      { status: 500 }
    );
  }
}

// POST - Save/Update reading history
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { articleId, progress } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: "articleId diperlukan" },
        { status: 400 }
      );
    }

    // Validate progress (0-100)
    const validProgress = Math.max(0, Math.min(100, progress || 0));

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    // Upsert reading history
    const history = await prisma.readingHistory.upsert({
      where: {
        idx_reading_history_user_article_unique: {
          userId: user.id,
          articleId,
        },
      },
      update: {
        progress: validProgress,
        readAt: new Date(),
      },
      create: {
        userId: user.id,
        articleId,
        progress: validProgress,
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Save reading history error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan riwayat bacaan" },
      { status: 500 }
    );
  }
}
