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
      <div className="group relative flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-300/40 bg-white/95 px-5 py-3 whitespace-nowrap shadow-md transition-all duration-300 hover:scale-105 hover:border-slate-400/60 hover:shadow-lg md:gap-4 md:rounded-3xl md:px-6 md:py-4 dark:border-slate-700/50 dark:bg-slate-800/95 dark:shadow-lg dark:hover:border-slate-500/60 dark:hover:shadow-xl">
        {/* Icon Container */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-all duration-300 group-hover:bg-slate-200 md:h-12 md:w-12 dark:bg-slate-700 dark:group-hover:bg-slate-600">
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
            <FiActivity className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          )}
        </div>

        {/* Info Container */}
        <div className="flex flex-col">
          <div className="text-sm font-bold text-slate-900 md:text-base dark:text-slate-50">
            {symbol}
          </div>
          {showPrice && price !== undefined && (
            <div className="text-xs font-medium text-slate-600 md:text-sm dark:text-slate-400">
              {formatPrice(price)}
            </div>
          )}
        </div>

        {/* Change Badge */}
        {showPrice && change !== undefined && (
          <div
            className={`ml-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold md:px-3 md:py-1.5 md:text-sm ${
              isPositive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
            }`}
          >
            {isPositive ? (
              <FiTrendingUp className="h-3 w-3 md:h-4 md:w-4" />
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
