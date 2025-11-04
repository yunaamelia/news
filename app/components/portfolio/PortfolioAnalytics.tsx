"use client";

import { useEffect, useState } from "react";
import Card from "../ui/Card";
import LoadingSpinner from "../ui/LoadingSpinner";
import { AssetAllocationChart } from "./AssetAllocationChart";
import { PortfolioPerformanceChart } from "./PortfolioPerformanceChart";

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

interface AnalyticsData {
  metrics: PortfolioMetrics;
  allocation: AllocationData[];
  performance: PerformanceDataPoint[];
}

export function PortfolioAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/portfolio/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const analytics = await response.json();
        setData(analytics);
      } catch (err) {
        console.error("Error fetching portfolio analytics:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-6">
        <p className="text-center text-red-400">
          {error || "Gagal memuat analitik portfolio"}
        </p>
      </Card>
    );
  }

  const { metrics, allocation, performance } = data;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Value */}
        <Card className="p-4">
          <p className="text-sm text-gray-400">Total Nilai Portfolio</p>
          <p className="mt-2 text-2xl font-bold text-white">
            Rp {metrics.totalValue.toLocaleString("id-ID")}
          </p>
          <p
            className={`mt-1 text-sm font-medium ${
              metrics.totalGain >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {metrics.totalGain >= 0 ? "+" : ""}
            Rp {metrics.totalGain.toLocaleString("id-ID")} (
            {metrics.totalGainPercentage.toFixed(2)}%)
          </p>
        </Card>

        {/* Total Cost */}
        <Card className="p-4">
          <p className="text-sm text-gray-400">Modal Investasi</p>
          <p className="mt-2 text-2xl font-bold text-white">
            Rp {metrics.totalCost.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-sm text-gray-500">Total biaya pembelian</p>
        </Card>

        {/* Best Performer */}
        <Card className="p-4">
          <p className="text-sm text-gray-400">Performa Terbaik</p>
          {metrics.bestPerformer ? (
            <>
              <p className="mt-2 text-2xl font-bold text-green-400">
                {metrics.bestPerformer.symbol}
              </p>
              <p className="mt-1 text-sm font-medium text-green-400">
                +Rp {metrics.bestPerformer.gain.toLocaleString("id-ID")} (
                {metrics.bestPerformer.gainPercentage.toFixed(2)}%)
              </p>
            </>
          ) : (
            <p className="mt-2 text-gray-500">Tidak ada aset dengan profit</p>
          )}
        </Card>

        {/* Worst Performer */}
        <Card className="p-4">
          <p className="text-sm text-gray-400">Performa Terburuk</p>
          {metrics.worstPerformer ? (
            <>
              <p className="mt-2 text-2xl font-bold text-red-400">
                {metrics.worstPerformer.symbol}
              </p>
              <p className="mt-1 text-sm font-medium text-red-400">
                Rp {metrics.worstPerformer.loss.toLocaleString("id-ID")} (
                {metrics.worstPerformer.lossPercentage.toFixed(2)}%)
              </p>
            </>
          ) : (
            <p className="mt-2 text-gray-500">Tidak ada aset dengan loss</p>
          )}
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Performance Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Performa Portfolio (30 Hari)
          </h3>
          {performance.length > 0 ? (
            <PortfolioPerformanceChart
              data={performance}
              type="area"
              showProfit={true}
            />
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-gray-500">Tidak ada data performa</p>
            </div>
          )}
        </Card>

        {/* Allocation Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Alokasi Aset
          </h3>
          {allocation.length > 0 ? (
            <AssetAllocationChart data={allocation} />
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-gray-500">Tidak ada data alokasi</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
