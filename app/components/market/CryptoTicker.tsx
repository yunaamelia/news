"use client";

import Image from "next/image";
import { FiActivity, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import Tooltip from "../ui/Tooltip";

interface CryptoTickerProps {
  symbol: string;
  name: string;
  icon?: string;
  price?: number;
  change?: number;
  showPrice?: boolean;
}

export default function CryptoTicker({
  symbol,
  name,
  icon,
  price,
  change,
  showPrice = false,
}: CryptoTickerProps) {
  const isPositive = change ? change >= 0 : true;

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(2)}jt`;
    }
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  const tooltipContent = (
    <div className="text-left">
      <div className="mb-1 font-semibold">{name}</div>
      <div className="text-xs text-gray-300">
        {symbol}
        {price && (
          <>
            <br />
            <span className="font-mono">
              Rp {price.toLocaleString("id-ID")}
            </span>
          </>
        )}
        {change !== undefined && (
          <>
            <br />
            <span className={isPositive ? "text-green-400" : "text-red-400"}>
              {isPositive ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="top" delay={100}>
      <div className="group relative flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200/50 bg-linear-to-br from-white via-blue-50/30 to-indigo-50/30 px-4 py-2 whitespace-nowrap transition-all duration-300 hover:scale-110 hover:border-[#3e7dff]/50 hover:shadow-xl dark:border-[#2A3B7D]/50 dark:bg-linear-to-br dark:from-[#1E2763]/90 dark:via-[#2A3B7D]/90 dark:to-[#1a1f4d]/90 dark:hover:border-[#3e7dff]/50">
        {/* Icon Container */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200 transition-all duration-300 group-hover:from-[#3e7dff]/20 group-hover:to-[#5B8DEF]/20 dark:from-[#2A3B7D] dark:to-[#1E2763]">
          {icon ? (
            <Image
              src={icon}
              alt={name}
              width={24}
              height={24}
              className="h-6 w-6"
              unoptimized
            />
          ) : (
            <FiActivity className="h-5 w-5 text-[#3e7dff]" />
          )}
        </div>

        {/* Info Container */}
        <div className="flex flex-col">
          <div className="text-sm font-bold text-gray-900 dark:text-white">
            {symbol}
          </div>
          {showPrice && price !== undefined && (
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {formatPrice(price)}
            </div>
          )}
        </div>

        {/* Change Badge */}
        {showPrice && change !== undefined && (
          <div
            className={`ml-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
              isPositive
                ? "bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400"
                : "bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-400"
            }`}
          >
            {isPositive ? (
              <FiTrendingUp className="h-3 w-3" />
            ) : (
              <FiTrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </Tooltip>
  );
}
