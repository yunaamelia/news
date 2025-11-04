"use client";

import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import dynamic from "next/dynamic";

const TradingViewChart = dynamic(() => import("./TradingViewChart"), {
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-lg border border-white/10 bg-gray-900">
      <LoadingSpinner size="lg" />
    </div>
  ),
  ssr: false, // Disable SSR for chart (client-only)
});

export default TradingViewChart;
