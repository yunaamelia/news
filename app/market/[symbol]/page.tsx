import TradingViewChart from "@/app/components/charts";
import { getCryptoData, getMarketData } from "@/app/lib/market-data";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { symbol } = await params;

  return {
    title: `${symbol.toUpperCase()} - Market Detail | Berita Finansial`,
    description: `Lihat harga real-time dan chart untuk ${symbol.toUpperCase()}`,
  };
}

export default async function MarketSymbolPage({
  params,
  searchParams,
}: PageProps) {
  const { symbol } = await params;
  const { type } = await searchParams;
  const assetType = (type?.toUpperCase() === "SAHAM" ? "SAHAM" : "KRIPTO") as
    | "SAHAM"
    | "KRIPTO";

  // Fetch market data
  let marketData = null;

  try {
    if (assetType === "KRIPTO") {
      marketData = await getCryptoData(symbol.toLowerCase());
    } else {
      marketData = await getMarketData(symbol.toUpperCase(), "SAHAM");
    }
  } catch (error) {
    console.error("Error fetching market data:", error);
  }

  if (!marketData) {
    notFound();
  }

  const changeColor =
    marketData.changePercent >= 0 ? "text-green-400" : "text-red-400";
  const changeIcon = marketData.changePercent >= 0 ? "▲" : "▼";

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-4xl font-bold text-white">
                  {marketData.symbol}
                </h1>
                <span className="rounded-lg bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400">
                  {assetType}
                </span>
              </div>
              <p className="text-xl text-gray-400">{marketData.name}</p>
            </div>

            <div className="text-right">
              <div className="mb-1 text-3xl font-bold text-white">
                Rp {marketData.price.toLocaleString("id-ID")}
              </div>
              <div className={`text-lg font-semibold ${changeColor}`}>
                {changeIcon} {marketData.change24h > 0 ? "+" : ""}
                {marketData.change24h.toLocaleString("id-ID")} (
                {marketData.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="mb-1 text-sm text-gray-400">Volume 24h</div>
              <div className="text-lg font-bold text-white">
                {marketData.volume.toLocaleString("id-ID")}
              </div>
            </div>
            {marketData.high24h && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-1 text-sm text-gray-400">High 24h</div>
                <div className="text-lg font-bold text-green-400">
                  Rp {marketData.high24h.toLocaleString("id-ID")}
                </div>
              </div>
            )}
            {marketData.low24h && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-1 text-sm text-gray-400">Low 24h</div>
                <div className="text-lg font-bold text-red-400">
                  Rp {marketData.low24h.toLocaleString("id-ID")}
                </div>
              </div>
            )}
            {marketData.marketCap && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-1 text-sm text-gray-400">Market Cap</div>
                <div className="text-lg font-bold text-white">
                  Rp {(marketData.marketCap / 1e12).toFixed(2)}T
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <TradingViewChart
            symbol={marketData.symbol}
            assetType={assetType}
            theme="dark"
            interval="1D"
            height={500}
            showToolbar={true}
          />
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          Terakhir diperbarui:{" "}
          {new Date(marketData.lastUpdated).toLocaleString("id-ID")}
        </div>
      </div>
    </div>
  );
}
