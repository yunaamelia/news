import {
  formatIDR,
  getIHSGIndex,
  getStockPrices,
} from "@/app/lib/api/stock-data";
import { FiArrowDown, FiArrowUp, FiTrendingUp } from "react-icons/fi";
import MarketCard from "./MarketCard";

interface StockMarketGridProps {
  symbols: string[];
  title?: string;
  subtitle?: string;
}

export default async function StockMarketGrid({
  symbols,
  title = "Pasar Saham IDX",
  subtitle = "Data real-time dari Bursa Efek Indonesia",
}: StockMarketGridProps) {
  // Fetch stock data
  const stocks = await getStockPrices(symbols);
  const ihsgIndex = await getIHSGIndex();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2">
          <FiTrendingUp className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-semibold text-blue-400">{title}</span>
        </div>
        <p className="text-lg text-gray-400">{subtitle}</p>
      </div>

      {/* IHSG Index Card */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 backdrop-blur-sm">
        <div className="p-6">
          <div className="mb-2 flex items-center gap-2">
            <FiTrendingUp className="h-6 w-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">
              IHSG (IDX Composite)
            </h3>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-4xl font-black text-white">
                {ihsgIndex.value.toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {ihsgIndex.change >= 0 ? (
                  <FiArrowUp className="h-5 w-5 text-green-400" />
                ) : (
                  <FiArrowDown className="h-5 w-5 text-red-400" />
                )}
                <span
                  className={`text-lg font-bold ${
                    ihsgIndex.change >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {ihsgIndex.change >= 0 ? "+" : ""}
                  {ihsgIndex.change.toFixed(2)} (
                  {ihsgIndex.change_percentage >= 0 ? "+" : ""}
                  {ihsgIndex.change_percentage.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                  ihsgIndex.market_state === "OPEN"
                    ? "bg-green-500/20 text-green-400"
                    : ihsgIndex.market_state === "PRE"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : ihsgIndex.market_state === "POST"
                        ? "bg-orange-500/20 text-orange-400"
                        : ihsgIndex.market_state === "BREAK"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {ihsgIndex.market_state === "OPEN" && "🟢 Market Open"}
                {ihsgIndex.market_state === "PRE" && "🟡 Pre-Market"}
                {ihsgIndex.market_state === "POST" && "🟠 After Hours"}
                {ihsgIndex.market_state === "BREAK" && "🔵 Trading Break"}
                {ihsgIndex.market_state === "CLOSED" && "🔴 Market Closed"}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Update:{" "}
                {new Date(ihsgIndex.last_updated).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WIB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stocks.map((stock) => (
          <MarketCard
            key={stock.symbol}
            symbol={stock.symbol}
            name={stock.name}
            price={stock.current_price}
            change={stock.price_change_percentage_24h}
            volume={formatIDR(stock.total_volume)}
            marketCap={formatIDR(stock.market_cap)}
            additionalData={{
              peRatio: stock.pe_ratio,
              dividendYield: stock.dividend_yield,
              week52High: stock.week_52_high,
              week52Low: stock.week_52_low,
              marketState: stock.market_state,
            }}
          />
        ))}
      </div>

      {/* Data Disclaimer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>
          Data saham dari Yahoo Finance. Update setiap 5 menit saat market buka.
        </p>
        <p className="mt-1">
          Harga ditampilkan dalam IDR. Tidak untuk tujuan trading resmi.
        </p>
      </div>
    </div>
  );
}
