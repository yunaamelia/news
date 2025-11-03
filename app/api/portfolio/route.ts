import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { userId: session.user.id },
      orderBy: { buyDate: "desc" },
    });

    return NextResponse.json(portfolios);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Gagal mengambil portfolio" },
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

    const { symbol, assetType, name, quantity, buyPrice, buyDate, notes } =
      await req.json();

    const portfolio = await prisma.portfolio.create({
      data: {
        userId: session.user.id,
        symbol,
        assetType,
        name,
        quantity: parseFloat(quantity),
        buyPrice: parseFloat(buyPrice),
        buyDate: new Date(buyDate),
        notes,
      },
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error("Error adding to portfolio:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan ke portfolio" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...data } = await req.json();

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui portfolio" },
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

    await prisma.portfolio.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berhasil dihapus dari portfolio" });
  } catch (error) {
    console.error("Error removing from portfolio:", error);
    return NextResponse.json(
      { error: "Gagal menghapus dari portfolio" },
      { status: 500 }
    );
  }
}
