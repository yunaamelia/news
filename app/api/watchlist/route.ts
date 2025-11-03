import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";

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

    const { symbol, assetType, name } = await req.json();

    // Check if already exists
    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_symbol_assetType: {
          userId: session.user.id,
          symbol,
          assetType,
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
        symbol,
        assetType,
        name,
      },
    });

    return NextResponse.json(watchlist, { status: 201 });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    await prisma.watchlist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berhasil dihapus dari watchlist" });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return NextResponse.json(
      { error: "Gagal menghapus dari watchlist" },
      { status: 500 }
    );
  }
}
