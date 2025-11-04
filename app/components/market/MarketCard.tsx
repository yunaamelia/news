import { MarketData } from "@/app/types";
import { FiInfo, FiTrendingDown, FiTrendingUp } from "react-icons/fi";

interface MarketCardProps {
  data?: MarketData; // Legacy support
  // New direct props for stock data
  symbol?: string;
  name?: string;
  price?: number;
  change?: number;
  volume?: string;
  marketCap?: string;
  additionalData?: {
    peRatio?: number;
    dividendYield?: number;
    week52High?: number;
    week52Low?: number;
    marketState?: "OPEN" | "CLOSED" | "PRE" | "POST" | "BREAK";
  };
}

export default function MarketCard({
  data,
  symbol,
  name,
  price,
  change,
  volume,
  marketCap,
  additionalData,
}: MarketCardProps) {
  // Support both legacy data prop and new direct props
  const displaySymbol = symbol || data?.symbol || "";
  const displayName = name || data?.name || "";
  const displayPrice = price ?? data?.price ?? 0;
  const displayChange = change ?? data?.changePercent ?? 0;
  const displayVolume =
    volume ||
    (data?.volume
      ? new Intl.NumberFormat("id-ID", { notation: "compact" }).format(
          data.volume
        )
      : "");
  const displayMarketCap =
    marketCap ||
    (data?.marketCap
      ? new Intl.NumberFormat("id-ID", { notation: "compact" }).format(
          data.marketCap
        )
      : "");

  const isPositive = displayChange >= 0;

  return (
    <div
      className={`group glass-card animate-fade-in relative overflow-hidden rounded-2xl p-5 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${
        isPositive
          ? "border border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/20"
          : "border border-red-500/30 hover:border-red-400/50 hover:shadow-red-500/20"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="mb-1 text-xl font-black text-white">
              {displaySymbol}
            </h3>
            {additionalData?.marketState && (
              <span
                className={`text-xs font-bold ${
                  additionalData.marketState === "OPEN"
                    ? "text-green-400"
                    : additionalData.marketState === "PRE" ||
                        additionalData.marketState === "POST"
                      ? "text-yellow-400"
                      : additionalData.marketState === "BREAK"
                        ? "text-blue-400"
                        : "text-gray-500"
                }`}
              >
                {additionalData.marketState === "OPEN" && "🟢"}
                {additionalData.marketState === "PRE" && "🟡"}
                {additionalData.marketState === "POST" && "🟠"}
                {additionalData.marketState === "BREAK" && "🔵"}
                {additionalData.marketState === "CLOSED" && "🔴"}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-400">{displayName}</p>
        </div>
        <div
          className={`rounded-xl p-2 transition-all duration-300 group-hover:scale-110 ${
            isPositive
              ? "bg-linear-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30"
              : "bg-linear-to-br from-red-500 to-rose-500 shadow-lg shadow-red-500/30"
          }`}
        >
          {isPositive ? (
            <FiTrendingUp className="h-6 w-6 text-white" />
          ) : (
            <FiTrendingDown className="h-6 w-6 text-white" />
          )}
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="gradient-text text-3xl font-black transition-all duration-300 group-hover:scale-105">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(displayPrice)}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold transition-all duration-300 ${
              isPositive
                ? "bg-green-500/20 text-green-400 shadow-md shadow-green-500/20"
                : "bg-red-500/20 text-red-400 shadow-md shadow-red-500/20"
            }`}
          >
            {isPositive ? "+" : ""}
            {displayChange.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-4">
        <div className="flex justify-between text-xs font-medium">
          <div className="flex flex-col gap-1">
            <span className="tracking-wide text-gray-500 uppercase">
              Volume
            </span>
            <span className="font-bold text-white">{displayVolume}</span>
          </div>
          {displayMarketCap && (
            <div className="flex flex-col gap-1 text-right">
              <span className="tracking-wide text-gray-500 uppercase">
                Market Cap
              </span>
              <span className="font-bold text-white">{displayMarketCap}</span>
            </div>
          )}
        </div>

        {/* Stock-specific data */}
        {additionalData &&
          (additionalData.peRatio || additionalData.dividendYield) && (
            <div className="flex justify-between border-t border-white/5 pt-3 text-xs">
              {additionalData.peRatio && (
                <div className="flex flex-col gap-1">
                  <span className="tracking-wide text-gray-500 uppercase">
                    P/E Ratio
                  </span>
                  <span className="font-bold text-white">
                    {additionalData.peRatio.toFixed(2)}
                  </span>
                </div>
              )}
              {additionalData.dividendYield && (
                <div className="flex flex-col gap-1 text-right">
                  <span className="tracking-wide text-gray-500 uppercase">
                    Dividend
                  </span>
                  <span className="font-bold text-white">
                    {additionalData.dividendYield.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          )}

        {/* 52-week range */}
        {additionalData &&
          additionalData.week52High &&
          additionalData.week52Low && (
            <div className="border-t border-white/5 pt-3 text-xs">
              <div className="mb-1 flex items-center gap-1 text-gray-500">
                <FiInfo className="h-3 w-3" />
                <span className="tracking-wide uppercase">52-Week Range</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-red-400">
                  {new Intl.NumberFormat("id-ID").format(
                    additionalData.week52Low
                  )}
                </span>
                <div className="h-1 flex-1 rounded-full bg-linear-to-r from-red-500 via-yellow-500 to-green-500"></div>
                <span className="font-semibold text-green-400">
                  {new Intl.NumberFormat("id-ID").format(
                    additionalData.week52High
                  )}
                </span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
