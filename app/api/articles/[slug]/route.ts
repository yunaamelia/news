import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        comments: {
          where: { parentId: null },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Gagal mengambil artikel" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params;
    const data = await req.json();

    const article = await prisma.article.update({
      where: { slug },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui artikel" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params;

    await prisma.article.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Artikel berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Gagal menghapus artikel" },
      { status: 500 }
    );
  }
}
