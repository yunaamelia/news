import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET - Fetch user's bookmarks
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

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
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
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.bookmark.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil bookmark" },
      { status: 500 }
    );
  }
}

// POST - Add bookmark
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
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: "articleId diperlukan" },
        { status: 400 }
      );
    }

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

    // Check if already bookmarked
    const existing = await prisma.bookmark.findUnique({
      where: {
        idx_bookmark_user_article_unique: {
          userId: user.id,
          articleId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Artikel sudah di-bookmark" },
        { status: 409 }
      );
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: user.id,
        articleId,
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

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Add bookmark error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan bookmark" },
      { status: 500 }
    );
  }
}

// DELETE - Remove bookmark
export async function DELETE(req: NextRequest) {
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

    const { searchParams } = req.nextUrl;
    const articleId = searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json(
        { error: "articleId diperlukan" },
        { status: 400 }
      );
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        idx_bookmark_user_article_unique: {
          userId: user.id,
          articleId,
        },
      },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.bookmark.delete({
      where: { id: bookmark.id },
    });

    return NextResponse.json({ message: "Bookmark berhasil dihapus" });
  } catch (error) {
    console.error("Delete bookmark error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus bookmark" },
      { status: 500 }
    );
  }
}
