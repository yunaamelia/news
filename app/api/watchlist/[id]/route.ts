import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

// DELETE - Remove from watchlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if item exists and belongs to user
    const watchlistItem = await prisma.watchlist.findUnique({
      where: { id },
    });

    if (!watchlistItem) {
      return NextResponse.json(
        { error: "Item tidak ditemukan" },
        { status: 404 }
      );
    }

    if (watchlistItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk menghapus item ini" },
        { status: 403 }
      );
    }

    // Delete item
    await prisma.watchlist.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Berhasil dihapus dari watchlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting from watchlist:", error);
    return NextResponse.json(
      { error: "Gagal menghapus dari watchlist" },
      { status: 500 }
    );
  }
}
