import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isPremium = searchParams.get("premium") === "true";
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      status: string;
      publishedAt: { lte: Date };
      category?: string;
      isPremium?: boolean;
      OR?: Array<{
        title?: { contains: string; mode: string };
        content?: { contains: string; mode: string };
        tags?: { has: string };
      }>;
    } = {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
    };

    if (category) {
      where.category = category;
    }

    if (isPremium !== null) {
      where.isPremium = isPremium;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    // Get total count
    const total = await prisma.article.count({ where });

    // Get articles
    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
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
    });

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Gagal mengambil artikel" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        category: data.category,
        tags: data.tags || [],
        author: data.author,
        authorImage: data.authorImage,
        status: data.status || "DRAFT",
        isPremium: data.isPremium || false,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Gagal membuat artikel" },
      { status: 500 }
    );
  }
}
