import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";
import { validateAssetData, validateId } from "@/app/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const watchlists = await prisma.watchlist.findMany({
      where: { userId: session.user.id },
      orderBy: { addedAt: "desc" },
    });

    return NextResponse.json({ watchlist: watchlists });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json(
      { error: "Gagal mengambil watchlist" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawData = await req.json();
    const validatedData = validateAssetData(rawData);

    // Check if already exists
    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_symbol_assetType: {
          userId: session.user.id,
          symbol: validatedData.symbol,
          assetType: validatedData.assetType,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Aset sudah ada di watchlist" },
        { status: 400 }
      );
    }

    const watchlist = await prisma.watchlist.create({
      data: {
        userId: session.user.id,
        ...validatedData,
      },
    });

    return NextResponse.json(watchlist, { status: 201 });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Gagal menambahkan ke watchlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = validateId(searchParams.get("id"));

    // Verify ownership before deleting
    const watchlist = await prisma.watchlist.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!watchlist) {
      return NextResponse.json(
        { error: "Watchlist item tidak ditemukan" },
        { status: 404 }
      );
    }

    if (watchlist.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: Anda tidak memiliki akses" },
        { status: 403 }
      );
    }

    await prisma.watchlist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berhasil dihapus dari watchlist" });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Gagal menghapus dari watchlist" },
      { status: 500 }
    );
  }
}
