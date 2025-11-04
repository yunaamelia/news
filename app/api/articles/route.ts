import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/app/lib/prisma";
import type { Prisma } from "@prisma/client";
import { validatePagination, validateSearchQuery, validateArticleData } from "@/app/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const { page, limit } = validatePagination(
      searchParams.get("page") ?? undefined,
      searchParams.get("limit") ?? undefined
    );
    const isPremium = searchParams.get("premium") === "true";
    const search = validateSearchQuery(searchParams.get("search"));

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ArticleWhereInput = {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
      ...(category && { category: category as Prisma.ArticleWhereInput["category"] }),
      ...(isPremium !== null && { isPremium }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { tags: { has: search } },
        ],
      }),
    };

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
    const rawData = await req.json();
    const validatedData = validateArticleData(rawData);

    const article = await prisma.article.create({
      data: {
        ...validatedData,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
      },
    });

    // On-demand ISR: Revalidate artikel pages (Best practice: revalidateTag dengan stale-while-revalidate)
    if (article.status === "PUBLISHED") {
      revalidateTag("articles", "max"); // Invalidate all articles cache with stale-while-revalidate
      revalidatePath("/artikel"); // Revalidate artikel listing page
      revalidatePath(`/${article.category.toLowerCase()}`); // Revalidate category page
      
      console.log("[ISR] Cache invalidated for new article:", article.slug);
    }

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Gagal membuat artikel" },
      { status: 500 }
    );
  }
}
