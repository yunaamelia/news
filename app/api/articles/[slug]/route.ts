import prisma from "@/app/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

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
    const { slug } = await params;
    const data = await req.json();

    const article = await prisma.article.update({
      where: { slug },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    // On-demand ISR: Revalidate after update
    revalidateTag("articles", "max"); // Stale-while-revalidate behavior
    revalidatePath(`/artikel/${article.slug}`);
    revalidatePath("/artikel");
    revalidatePath(`/${article.category.toLowerCase()}`);

    console.log("[ISR] Cache invalidated after update:", article.slug);
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
    const { slug } = await params;

    const article = await prisma.article.findUnique({ where: { slug } });

    await prisma.article.delete({
      where: { slug },
    });

    // On-demand ISR: Revalidate after delete
    if (article) {
      revalidateTag("articles", "max"); // Stale-while-revalidate behavior
      revalidatePath("/artikel");
      revalidatePath(`/${article.category.toLowerCase()}`);

      console.log("[ISR] Cache invalidated after delete:", slug);
    }

    return NextResponse.json({ message: "Artikel berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Gagal menghapus artikel" },
      { status: 500 }
    );
  }
}
