"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

interface AllocationData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface AssetAllocationChartProps {
  data: AllocationData[];
}

export function AssetAllocationChart({ data }: AssetAllocationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data as never[]}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
