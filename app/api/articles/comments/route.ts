import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId, content, parentId } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Komentar tidak boleh kosong" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        userId: session.user.id,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Gagal membuat komentar" },
      { status: 500 }
    );
  }
}
