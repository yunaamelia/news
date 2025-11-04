"use client";

import { getCryptoPrices, type CryptoPrice } from "@/app/lib/api/coingecko";
import { useEffect, useState } from "react";
import CryptoTicker from "../market/CryptoTicker";
import { SkeletonTickerItem } from "../ui/Skeleton";

// Mock stock data (masih mock, nanti bisa diganti dengan API stocks)
const idxStocks = [
  {
    symbol: "BBCA",
    name: "Bank Central Asia",
    price: 9850,
    change: 1.55,
  },
  {
    symbol: "BBRI",
    name: "Bank Rakyat Indonesia",
    price: 5125,
    change: -0.49,
  },
  {
    symbol: "TLKM",
    name: "Telkom Indonesia",
    price: 3890,
    change: 1.3,
  },
  {
    symbol: "ASII",
    name: "Astra International",
    price: 4725,
    change: 0.85,
  },
];

export default function MarketTicker() {
  const [cryptoData, setCryptoData] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getCryptoPrices();
        if (mounted) {
          setCryptoData(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError("Gagal memuat data kripto");
          console.error("Fetch error:", err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Gabungkan crypto real-time + stocks mock
  const allAssets = [
    ...cryptoData.map((crypto) => ({
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      icon: crypto.image,
      price: crypto.current_price,
      change: crypto.price_change_percentage_24h,
      type: "crypto" as const,
    })),
    ...idxStocks.map((stock) => ({
      ...stock,
      type: "stock" as const,
      icon: undefined,
    })),
  ];

  return (
    <div className="w-screen overflow-hidden border border-slate-200/60 bg-slate-50/50 shadow-md backdrop-blur-sm md:py-6 md:text-lg lg:py-8 lg:text-xl dark:border-slate-700/50 dark:bg-slate-800/50">
      <div className="py-3 md:py-0">
        {/* Loading State */}
        {isLoading && (
          <div className="flex gap-4 px-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonTickerItem key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="px-4 py-2 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Scrolling Container */}
        {!isLoading && !error && allAssets.length > 0 && (
          <div className="relative flex overflow-visible">
            <div className="animate-scroll flex gap-4 md:gap-6">
              {allAssets.map((asset, idx) => (
                <CryptoTicker
                  key={`${asset.symbol}-${idx}`}
                  symbol={asset.symbol}
                  name={asset.name}
                  icon={asset.icon}
                  price={asset.price}
                  change={asset.change}
                  showPrice
                />
              ))}
              {/* Duplicate untuk seamless loop */}
              {allAssets.map((asset, idx) => (
                <CryptoTicker
                  key={`${asset.symbol}-dup-${idx}`}
                  symbol={asset.symbol}
                  name={asset.name}
                  icon={asset.icon}
                  price={asset.price}
                  change={asset.change}
                  showPrice
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 90s linear infinite;
          will-change: transform;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
