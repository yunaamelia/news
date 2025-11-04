"use client";

import {
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";

interface TradingViewChartProps {
  symbol: string;
  assetType: "SAHAM" | "KRIPTO";
  theme?: "light" | "dark";
  interval?: "1D" | "1W" | "1M";
  height?: number;
  showToolbar?: boolean;
}

interface ChartData {
  time: string;
  value: number;
}

export default function TradingViewChart({
  symbol,
  assetType,
  theme = "dark",
  interval = "1D",
  height = 400,
  showToolbar = true,
}: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Chart configuration based on theme
    const chartColors = {
      dark: {
        backgroundColor: "#1a1a1a",
        textColor: "#d1d4dc",
        gridColor: "rgba(255, 255, 255, 0.05)",
        areaTopColor: "rgba(67, 83, 255, 0.4)",
        areaBottomColor: "rgba(67, 83, 255, 0.04)",
        lineColor: "#4353ff",
      },
      light: {
        backgroundColor: "#ffffff",
        textColor: "#333333",
        gridColor: "rgba(0, 0, 0, 0.05)",
        areaTopColor: "rgba(67, 83, 255, 0.4)",
        areaBottomColor: "rgba(67, 83, 255, 0.04)",
        lineColor: "#4353ff",
      },
    };

    const colors = chartColors[theme];

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor,
      },
      grid: {
        vertLines: { color: colors.gridColor },
        horzLines: { color: colors.gridColor },
      },
      width: chartContainerRef.current.clientWidth,
      height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: colors.gridColor,
      },
      rightPriceScale: {
        borderColor: colors.gridColor,
      },
      crosshair: {
        vertLine: {
          color: colors.textColor,
          width: 1,
          style: 3, // LineStyle.Dashed
          labelBackgroundColor: colors.lineColor,
        },
        horzLine: {
          color: colors.textColor,
          width: 1,
          style: 3, // LineStyle.Dashed
          labelBackgroundColor: colors.lineColor,
        },
      },
    });

    // Create area series (v4 API)
    const series = chart.addAreaSeries({
      topColor: colors.areaTopColor,
      bottomColor: colors.areaBottomColor,
      lineColor: colors.lineColor,
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    // Fetch and set data
    fetchChartData();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, assetType, theme, interval, height]);

  const fetchChartData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate mock data for now (replace with real API later)
      const mockData = generateMockData(interval);

      if (seriesRef.current) {
        seriesRef.current.setData(mockData);
        chartRef.current?.timeScale().fitContent();
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setError("Gagal memuat data chart");
      setIsLoading(false);
    }
  };

  // Generate mock data based on interval
  const generateMockData = (interval: string): ChartData[] => {
    const data: ChartData[] = [];
    const now = new Date();
    const daysMap = { "1D": 30, "1W": 90, "1M": 365 };
    const days = daysMap[interval as keyof typeof daysMap] || 30;

    let basePrice = 50000 + Math.random() * 50000;

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Random walk for realistic price movement
      const change = (Math.random() - 0.5) * basePrice * 0.05;
      basePrice = Math.max(basePrice + change, 1000);

      data.push({
        time: date.toISOString().split("T")[0],
        value: Math.round(basePrice),
      });
    }

    return data;
  };

  if (error) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-white/10 bg-gray-900"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <p className="mb-2 font-medium text-red-400">❌ {error}</p>
          <button
            onClick={fetchChartData}
            className="rounded-lg bg-blue-500/20 px-4 py-2 text-blue-400 transition-colors hover:bg-blue-500/30"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {showToolbar && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{symbol}</h3>
            <span className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-400">
              {assetType}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchChartData()}
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                interval === "1D"
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-gray-400 hover:bg-white/20"
              }`}
            >
              1D
            </button>
            <button
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                interval === "1W"
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-gray-400 hover:bg-white/20"
              }`}
            >
              1W
            </button>
            <button
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                interval === "1M"
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-gray-400 hover:bg-white/20"
              }`}
            >
              1M
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-900/50 backdrop-blur-sm"
          style={{ height: `${height}px` }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="text-sm text-gray-400">Memuat chart...</p>
          </div>
        </div>
      )}

      <div ref={chartContainerRef} className="overflow-hidden rounded-lg" />
    </div>
  );
}
