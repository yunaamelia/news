import { MarketData } from "@/app/types";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

interface MarketCardProps {
  data: MarketData;
}

export default function MarketCard({ data }: MarketCardProps) {
  const isPositive = data.changePercent >= 0;

  return (
    <div
      className={`group glass-card animate-fade-in relative overflow-hidden rounded-2xl p-5 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${
        isPositive
          ? "border border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/20"
          : "border border-red-500/30 hover:border-red-400/50 hover:shadow-red-500/20"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-xl font-black text-white">{data.symbol}</h3>
          <p className="text-sm font-medium text-gray-400">{data.name}</p>
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
          }).format(data.price)}
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
            {data.changePercent.toFixed(2)}%
          </span>
          <span
            className={`text-sm font-semibold ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            ({isPositive ? "+" : ""}
            {new Intl.NumberFormat("id-ID").format(data.change24h)})
          </span>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between text-xs font-medium">
          <div className="flex flex-col gap-1">
            <span className="tracking-wide text-gray-500 uppercase">
              Volume
            </span>
            <span className="font-bold text-white">
              {new Intl.NumberFormat("id-ID", { notation: "compact" }).format(
                data.volume
              )}
            </span>
          </div>
          {data.marketCap && (
            <div className="flex flex-col gap-1 text-right">
              <span className="tracking-wide text-gray-500 uppercase">
                Market Cap
              </span>
              <span className="font-bold text-white">
                {new Intl.NumberFormat("id-ID", { notation: "compact" }).format(
                  data.marketCap
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
