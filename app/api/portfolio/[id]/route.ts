import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

// PUT - Update portfolio item
export async function PUT(
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
    const body = await request.json();
    const { symbol, assetType, name, quantity, buyPrice, purchaseDate, notes } = body;

    // Check if item exists and belongs to user
    const portfolioItem = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolioItem) {
      return NextResponse.json(
        { error: "Item tidak ditemukan" },
        { status: 404 }
      );
    }

    if (portfolioItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk mengubah item ini" },
        { status: 403 }
      );
    }

    // Update item
    const updated = await prisma.portfolio.update({
      where: { id },
      data: {
        symbol,
        assetType,
        name,
        quantity: parseFloat(quantity),
        buyPrice: parseFloat(buyPrice),
        buyDate: new Date(purchaseDate),
        notes: notes || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Berhasil diperbarui", portfolio: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui portfolio" },
      { status: 500 }
    );
  }
}

// DELETE - Remove from portfolio
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
    const portfolioItem = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolioItem) {
      return NextResponse.json(
        { error: "Item tidak ditemukan" },
        { status: 404 }
      );
    }

    if (portfolioItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk menghapus item ini" },
        { status: 403 }
      );
    }

    // Delete item
    await prisma.portfolio.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Berhasil dihapus dari portfolio" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting from portfolio:", error);
    return NextResponse.json(
      { error: "Gagal menghapus dari portfolio" },
      { status: 500 }
    );
  }
}
