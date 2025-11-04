"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PerformanceDataPoint {
  date: string;
  value: number;
  profit: number;
}

interface PortfolioPerformanceChartProps {
  data: PerformanceDataPoint[];
  type?: "line" | "area";
  showProfit?: boolean;
}

// Custom tooltip component - moved outside to avoid React Compiler error
const CustomTooltip = ({
  active,
  payload,
  showProfit,
}: {
  active?: boolean;
  payload?: Array<{ payload: PerformanceDataPoint }>;
  showProfit?: boolean;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-white/10 bg-gray-900/95 p-3 shadow-xl">
        <p className="text-sm font-medium text-white">{data.date}</p>
        <p className="mt-1 text-lg font-bold text-blue-400">
          Rp {data.value.toLocaleString("id-ID")}
        </p>
        {showProfit && (
          <p
            className={
              data.profit >= 0
                ? "mt-1 text-sm font-medium text-green-400"
                : "mt-1 text-sm font-medium text-red-400"
            }
          >
            {data.profit >= 0 ? "+" : ""}
            Rp {data.profit.toLocaleString("id-ID")}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function PortfolioPerformanceChart({
  data,
  type = "area",
  showProfit = true,
}: PortfolioPerformanceChartProps) {
  // Calculate average for reference line
  const averageValue = useMemo(() => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    return Math.round(sum / data.length);
  }, [data]);

  // Gradient definitions for area chart
  const gradientId = "portfolioGradient";

  if (type === "area") {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`}
          />
          <Tooltip content={<CustomTooltip showProfit={showProfit} />} />
          <ReferenceLine
            y={averageValue}
            stroke="rgba(255,255,255,0.3)"
            strokeDasharray="3 3"
            label={{
              value: "Rata-rata",
              fill: "rgba(255,255,255,0.5)",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // Line chart
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="date"
          stroke="rgba(255,255,255,0.5)"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke="rgba(255,255,255,0.5)"
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`}
        />
        <Tooltip content={<CustomTooltip showProfit={showProfit} />} />
        <ReferenceLine
          y={averageValue}
          stroke="rgba(255,255,255,0.3)"
          strokeDasharray="3 3"
          label={{
            value: "Rata-rata",
            fill: "rgba(255,255,255,0.5)",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4, fill: "#3b82f6" }}
          activeDot={{ r: 6, fill: "#60a5fa" }}
          animationDuration={1000}
        />
        {showProfit && (
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            animationDuration={1000}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
