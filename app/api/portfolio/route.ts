import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";
import { validatePortfolioData, validateId } from "@/app/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { userId: session.user.id },
      orderBy: { buyDate: "desc" },
    });

    // Calculate stats and P&L
    let totalInvestment = 0;
    let currentValue = 0;

    const portfolioWithPnL = portfolios.map((item) => {
      const investment = item.quantity * item.buyPrice;
      totalInvestment += investment;

      // Mock current price (in production, fetch from market API)
      const currentPrice = item.buyPrice * (1 + (Math.random() * 0.2 - 0.1));
      const itemValue = item.quantity * currentPrice;
      currentValue += itemValue;

      const profitLoss = itemValue - investment;
      const profitLossPercent = (profitLoss / investment) * 100;

      return {
        id: item.id,
        symbol: item.symbol,
        name: item.name,
        assetType: item.assetType,
        quantity: item.quantity,
        buyPrice: item.buyPrice,
        currentPrice,
        totalValue: itemValue,
        profitLoss,
        profitLossPercent,
        purchaseDate: item.buyDate.toISOString(),
      };
    });

    const totalProfitLoss = currentValue - totalInvestment;
    const totalProfitLossPercent =
      totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

    const stats = {
      totalInvestment,
      currentValue,
      totalProfitLoss,
      totalProfitLossPercent,
    };

    return NextResponse.json({ portfolio: portfolioWithPnL, stats });
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

    const rawData = await req.json();
    const validatedData = validatePortfolioData(rawData);

    const portfolio = await prisma.portfolio.create({
      data: {
        userId: session.user.id,
        symbol: validatedData.symbol,
        assetType: validatedData.assetType,
        name: validatedData.name,
        quantity: validatedData.quantity,
        buyPrice: validatedData.buyPrice,
        buyDate: validatedData.purchaseDate,
        notes: validatedData.notes,
      },
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error("Error adding to portfolio:", error);
    
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
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
    
    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership before updating
    const existing = await prisma.portfolio.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Portfolio item tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: Anda tidak memiliki akses" },
        { status: 403 }
      );
    }

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
    const id = validateId(searchParams.get("id"));

    // Verify ownership before deleting
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio item tidak ditemukan" },
        { status: 404 }
      );
    }

    if (portfolio.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: Anda tidak memiliki akses" },
        { status: 403 }
      );
    }

    await prisma.portfolio.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berhasil dihapus dari portfolio" });
  } catch (error) {
    console.error("Error removing from portfolio:", error);
    
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Gagal menghapus dari portfolio" },
      { status: 500 }
    );
  }
}
