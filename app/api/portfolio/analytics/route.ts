import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { AssetType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercentage: number;
  bestPerformer: {
    symbol: string;
    gain: number;
    gainPercentage: number;
  } | null;
  worstPerformer: {
    symbol: string;
    loss: number;
    lossPercentage: number;
  } | null;
}

interface AllocationData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface PerformanceDataPoint {
  date: string;
  value: number;
  profit: number;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all portfolio holdings
    const holdings = await prisma.portfolio.findMany({
      where: {
        userId: session.user.id,
      },
    });

    if (holdings.length === 0) {
      return NextResponse.json({
        metrics: {
          totalValue: 0,
          totalCost: 0,
          totalGain: 0,
          totalGainPercentage: 0,
          bestPerformer: null,
          worstPerformer: null,
        },
        allocation: [],
        performance: [],
      });
    }

    // Calculate metrics for each holding
    const holdingsWithMetrics = holdings.map(
      (holding: (typeof holdings)[0]) => {
        // Note: In production, fetch current prices from market data
        // For now, use buyPrice as currentPrice (mock)
        const currentPrice = holding.buyPrice; // TODO: Fetch from market data API
        const currentValue = currentPrice * holding.quantity;
        const cost = holding.buyPrice * holding.quantity;
        const gain = currentValue - cost;
        const gainPercentage = (gain / cost) * 100;

        return {
          ...holding,
          currentPrice,
          currentValue,
          cost,
          gain,
          gainPercentage,
        };
      }
    );

    // Calculate overall metrics
    const totalValue = holdingsWithMetrics.reduce(
      (sum: number, h: (typeof holdingsWithMetrics)[0]) => sum + h.currentValue,
      0
    );
    const totalCost = holdingsWithMetrics.reduce(
      (sum: number, h: (typeof holdingsWithMetrics)[0]) => sum + h.cost,
      0
    );
    const totalGain = totalValue - totalCost;
    const totalGainPercentage = (totalGain / totalCost) * 100;

    // Find best and worst performers
    const sortedByGain = [...holdingsWithMetrics].sort(
      (a, b) => b.gain - a.gain
    );
    const bestPerformer =
      sortedByGain[0].gain > 0
        ? {
            symbol: sortedByGain[0].symbol,
            gain: sortedByGain[0].gain,
            gainPercentage: sortedByGain[0].gainPercentage,
          }
        : null;

    const worstPerformer =
      sortedByGain[sortedByGain.length - 1].gain < 0
        ? {
            symbol: sortedByGain[sortedByGain.length - 1].symbol,
            loss: sortedByGain[sortedByGain.length - 1].gain,
            lossPercentage:
              sortedByGain[sortedByGain.length - 1].gainPercentage,
          }
        : null;

    const metrics: PortfolioMetrics = {
      totalValue,
      totalCost,
      totalGain,
      totalGainPercentage,
      bestPerformer,
      worstPerformer,
    };

    // Calculate asset allocation
    const assetTypes = new Map<string, number>();
    holdingsWithMetrics.forEach((holding: (typeof holdingsWithMetrics)[0]) => {
      const typeName =
        holding.assetType === AssetType.SAHAM ? "Saham" : "Kripto";
      const current = assetTypes.get(typeName) || 0;
      assetTypes.set(typeName, current + holding.currentValue);
    });

    const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];
    const allocation: AllocationData[] = Array.from(assetTypes.entries()).map(
      ([name, value], index) => ({
        name,
        value,
        percentage: (value / totalValue) * 100,
        color: COLORS[index % COLORS.length],
      })
    );

    // Generate historical performance data (mock for now - in production, store daily snapshots)
    // This simulates 30 days of portfolio value changes
    const performance: PerformanceDataPoint[] = [];
    const today = new Date();
    const dailyGrowthRate = Math.pow(1 + totalGainPercentage / 100, 1 / 30); // Compound daily rate

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Calculate value at this point (working backwards from current value)
      const daysFromStart = 30 - i;
      const valueAtDate = totalCost * Math.pow(dailyGrowthRate, daysFromStart);
      const profitAtDate = valueAtDate - totalCost;

      performance.push({
        date: date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        value: Math.round(valueAtDate),
        profit: Math.round(profitAtDate),
      });
    }

    return NextResponse.json({
      metrics,
      allocation,
      performance,
    });
  } catch (error) {
    console.error("Error calculating portfolio analytics:", error);
    return NextResponse.json(
      { error: "Failed to calculate analytics" },
      { status: 500 }
    );
  }
}
