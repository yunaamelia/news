import prisma from "@/app/lib/prisma";
import { ArticleCategory, ArticleStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const author = searchParams.get("author");
    const tags = searchParams.get("tags");
    const premium = searchParams.get("premium");
    const sortBy = searchParams.get("sortBy") || "relevance"; // relevance, date, views
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      status: ArticleStatus.PUBLISHED,
      ...(category && { category: category as ArticleCategory }),
      ...(author && {
        author: {
          contains: author,
          mode: "insensitive",
        },
      }),
      ...(premium === "true" && { isPremium: true }),
      ...(premium === "false" && { isPremium: false }),
    };

    // Full-text search on title, excerpt, content
    if (query) {
      where.OR = [
        {
          title: {
            search: query.split(" ").join(" & "), // PostgreSQL full-text search
          },
        },
        {
          excerpt: {
            search: query.split(" ").join(" & "),
          },
        },
        {
          content: {
            search: query.split(" ").join(" & "),
          },
        },
      ];
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim());
      where.tags = {
        hasSome: tagArray,
      };
    }

    // Build orderBy clause
    let orderBy: Record<string, unknown> = {};
    switch (sortBy) {
      case "date":
        orderBy = { publishedAt: "desc" };
        break;
      case "views":
        orderBy = { views: "desc" };
        break;
      case "relevance":
        // For relevance, we'll use _relevance when query exists
        if (query) {
          orderBy = {
            _relevance: {
              fields: ["title", "excerpt", "content"],
              search: query.split(" ").join(" & "),
              sort: "desc",
            },
          };
        } else {
          orderBy = { publishedAt: "desc" };
        }
        break;
      default:
        orderBy = { publishedAt: "desc" };
    }

    // Execute query
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy,
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
      }),
      prisma.article.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      filters: {
        query,
        category,
        author,
        tags,
        premium,
        sortBy,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Gagal melakukan pencarian" },
      { status: 500 }
    );
  }
}
