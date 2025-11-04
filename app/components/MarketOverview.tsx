"use client";

import { getCryptoPrices, type CryptoPrice } from "@/app/lib/api/coingecko";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiActivity, FiArrowRight, FiTrendingUp } from "react-icons/fi";
import MarketCard from "./market/MarketCard";
import { SkeletonMarketCard } from "./ui/Skeleton";

// Mock stock data - nanti bisa diganti dengan stock API
const topStocks = [
  {
    symbol: "BBCA",
    name: "Bank Central Asia",
    price: 9850,
    change: 150,
    changePercent: 1.55,
    volume: 45230000,
  },
  {
    symbol: "BBRI",
    name: "Bank Rakyat Indonesia",
    price: 5125,
    change: -25,
    changePercent: -0.49,
    volume: 67890000,
  },
  {
    symbol: "TLKM",
    name: "Telkom Indonesia",
    price: 3890,
    change: 50,
    changePercent: 1.3,
    volume: 23450000,
  },
];

export default function MarketOverview() {
  const [cryptoData, setCryptoData] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchCryptoData() {
      try {
        const data = await getCryptoPrices([
          "bitcoin",
          "ethereum",
          "binancecoin",
        ]);
        if (mounted) {
          setCryptoData(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching crypto:", error);
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
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 py-20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 h-96 w-96 animate-pulse rounded-full bg-blue-300 opacity-20 mix-blend-multiply blur-3xl filter dark:bg-blue-600 dark:opacity-10"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 animate-pulse rounded-full bg-purple-300 opacity-20 mix-blend-multiply blur-3xl filter delay-75 dark:bg-purple-600 dark:opacity-10"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              Pasar Hari Ini
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Pantau pergerakan harga terkini dari pasar saham dan kripto
            </p>
          </div>
          <Link
            href="/market"
            className="group mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 shadow-md transition-all hover:text-blue-700 hover:shadow-lg md:mt-0 dark:bg-slate-800 dark:text-blue-400"
          >
            <span>Lihat Semua Pasar</span>
            <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Saham Card */}
          <div className="rounded-3xl border border-white/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl dark:border-slate-700/50 dark:bg-slate-800/70">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600">
                  <FiTrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Saham IDX
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Top Movers Today
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                IHSG +0.8%
              </span>
            </div>
            <div className="space-y-4">
              {topStocks.map((stock) => (
                <MarketCard
                  key={stock.symbol}
                  data={{
                    symbol: stock.symbol,
                    name: stock.name,
                    price: stock.price,
                    change24h: stock.change,
                    changePercent: stock.changePercent,
                    volume: stock.volume,
                    lastUpdated: new Date().toISOString(),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Kripto Card - REAL-TIME DATA */}
          <div className="rounded-3xl border border-white/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl dark:border-slate-700/50 dark:bg-slate-800/70">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-purple-600">
                  <FiActivity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Cryptocurrency
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {isLoading ? "Loading..." : "Real-time Prices"}
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                Live Data
              </span>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <SkeletonMarketCard />
                  <SkeletonMarketCard />
                  <SkeletonMarketCard />
                </>
              ) : cryptoData.length > 0 ? (
                cryptoData.map((crypto) => (
                  <MarketCard
                    key={crypto.id}
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
                ))
              ) : (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada data tersedia
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
