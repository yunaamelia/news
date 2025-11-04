"use client";

import { getCryptoPrices, type CryptoPrice } from "@/app/lib/api/coingecko";
import { useEffect, useState } from "react";
import { SkeletonMarketCard } from "../ui/Skeleton";
import MarketCard from "./MarketCard";

interface CryptoMarketGridProps {
  cryptoIds?: string[];
  title?: string;
  subtitle?: string;
}

export default function CryptoMarketGrid({
  cryptoIds = [
    "bitcoin",
    "ethereum",
    "binancecoin",
    "solana",
    "ripple",
    "cardano",
    "dogecoin",
    "tron",
    "polygon",
  ],
  title = "Harga Cryptocurrency Real-time",
  subtitle = "Data diperbarui setiap 30 detik dari CoinGecko",
}: CryptoMarketGridProps) {
  const [cryptoData, setCryptoData] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchCryptoData() {
      try {
        setIsLoading(true);
        const data = await getCryptoPrices(cryptoIds);
        if (mounted) {
          setCryptoData(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError("Gagal memuat data cryptocurrency");
          console.error("Fetch crypto error:", err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCryptoData();

    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchCryptoData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [cryptoIds]);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {title}
          </h2>
          <p className="text-gray-400">{subtitle}</p>
          {!isLoading && !error && (
            <p className="mt-2 text-sm text-purple-400">
              Terakhir diperbarui:{" "}
              {new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          )}
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <div className="glass-card rounded-2xl border border-red-500/30 p-8 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonMarketCard key={i} />
            ))}
          </div>
        )}

        {/* Data Grid */}
        {!isLoading && !error && cryptoData.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cryptoData.map((crypto) => (
              <div
                key={crypto.id}
                className="glass-card rounded-2xl border border-purple-500/20 p-6 transition-all hover:scale-[1.02] hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <MarketCard
                  data={{
                    symbol: crypto.symbol.toUpperCase(),
                    name: crypto.name,
                    price: crypto.current_price,
                    change24h:
                      (crypto.current_price *
                        crypto.price_change_percentage_24h) /
                      100,
                    changePercent: crypto.price_change_percentage_24h,
                    volume: crypto.total_volume,
                    lastUpdated: crypto.last_updated,
                  }}
                />
                {/* Additional Info */}
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Market Cap</p>
                    <p className="text-sm font-semibold text-white">
                      {formatIDR(crypto.market_cap)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">24h Volume</p>
                    <p className="text-sm font-semibold text-white">
                      {formatIDR(crypto.total_volume)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && cryptoData.length === 0 && (
          <div className="glass-card rounded-2xl border border-purple-500/30 p-16 text-center">
            <p className="text-xl text-gray-400">Tidak ada data tersedia</p>
          </div>
        )}
      </div>
    </section>
  );
}

function formatIDR(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `Rp ${(amount / 1_000_000_000_000).toFixed(2)}T`;
  } else if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(2)}M`;
  } else if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(2)}jt`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}
