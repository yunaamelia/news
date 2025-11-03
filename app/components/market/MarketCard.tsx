import { MarketData } from "@/app/types";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

interface MarketCardProps {
  data: MarketData;
}

export default function MarketCard({ data }: MarketCardProps) {
  const isPositive = data.changePercent >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {data.symbol}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{data.name}</p>
        </div>
        {isPositive ? (
          <FiTrendingUp className="w-6 h-6 text-green-500" />
        ) : (
          <FiTrendingDown className="w-6 h-6 text-red-500" />
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(data.price)}
        </div>
        
        <div
          className={`flex items-center text-sm font-semibold ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          <span>{isPositive ? "+" : ""}{data.changePercent.toFixed(2)}%</span>
          <span className="ml-2">
            ({isPositive ? "+" : ""}
            {new Intl.NumberFormat("id-ID").format(data.change24h)})
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Volume: {new Intl.NumberFormat("id-ID", { notation: "compact" }).format(data.volume)}</span>
          {data.marketCap && (
            <span>Cap: {new Intl.NumberFormat("id-ID", { notation: "compact" }).format(data.marketCap)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
