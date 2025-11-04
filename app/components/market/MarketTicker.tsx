"use client";

import { getCryptoPrices, type CryptoPrice } from "@/app/lib/api/coingecko";
import { useEffect, useState } from "react";
import CryptoTicker from "../market/CryptoTicker";
import { SkeletonTickerItem } from "../ui/Skeleton";

// Top stocks untuk ticker
const TICKER_STOCKS = ["BBCA", "BBRI", "TLKM", "ASII"];

interface StockPrice {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function MarketTicker() {
  const [cryptoData, setCryptoData] = useState<CryptoPrice[]>([]);
  const [stockData, setStockData] = useState<StockPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);

        // Always fetch crypto (24/7 market)
        // Only fetch stocks during market hours or use cached data
        const cryptoPromise = getCryptoPrices();
        const stockPromise = fetch(
          `/api/stocks?symbols=${TICKER_STOCKS.join(",")}`
        ).then((r) => r.json());

        const [cryptoResponse, stockResponse] = await Promise.all([
          cryptoPromise,
          stockPromise,
        ]);

        if (mounted) {
          setCryptoData(cryptoResponse);
          setStockData(stockResponse.stocks || []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError("Gagal memuat data pasar");
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
    // Stock API will use cached data when market closed
    const interval = setInterval(fetchData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Gabungkan crypto real-time + stocks real-time
  const allAssets = [
    ...cryptoData.map((crypto) => ({
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      icon: crypto.image,
      price: crypto.current_price,
      change: crypto.price_change_percentage_24h,
      type: "crypto" as const,
    })),
    ...stockData.map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      icon: undefined,
      price: stock.current_price,
      change: stock.price_change_percentage_24h,
      type: "stock" as const,
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
