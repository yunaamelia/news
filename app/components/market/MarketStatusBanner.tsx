"use client";

import {
  getMarketHoursInfo,
  getTimeUntilOpen,
  type MarketHoursInfo,
} from "@/app/lib/market-hours";
import { useEffect, useState } from "react";
import { FiActivity, FiClock } from "react-icons/fi";

export default function MarketStatusBanner() {
  const [marketInfo, setMarketInfo] = useState<MarketHoursInfo | null>(null);
  const [timeUntilOpen, setTimeUntilOpen] = useState<string>("");

  useEffect(() => {
    function updateMarketInfo() {
      const info = getMarketHoursInfo();
      setMarketInfo(info);

      if (!info.isOpen) {
        setTimeUntilOpen(getTimeUntilOpen());
      }
    }

    // Initial update
    updateMarketInfo();

    // Update every minute
    const interval = setInterval(updateMarketInfo, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!marketInfo) return null;

  const { status, message, isOpen } = marketInfo;

  return (
    <div
      className={`fixed right-6 bottom-6 z-50 rounded-2xl border p-4 shadow-2xl backdrop-blur-sm transition-all duration-300 ${
        isOpen
          ? "border-green-500/30 bg-green-500/10"
          : status === "PRE" || status === "POST"
            ? "border-yellow-500/30 bg-yellow-500/10"
            : status === "BREAK"
              ? "border-blue-500/30 bg-blue-500/10"
              : "border-gray-500/30 bg-gray-500/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`rounded-full p-2 ${
            isOpen
              ? "bg-green-500/20"
              : status === "PRE" || status === "POST"
                ? "bg-yellow-500/20"
                : status === "BREAK"
                  ? "bg-blue-500/20"
                  : "bg-gray-500/20"
          }`}
        >
          {isOpen ? (
            <FiActivity className="h-5 w-5 text-green-400" />
          ) : (
            <FiClock className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{message}</p>
          {!isOpen && timeUntilOpen && (
            <p className="text-xs text-gray-400">Opens in {timeUntilOpen}</p>
          )}
        </div>
      </div>
    </div>
  );
}
