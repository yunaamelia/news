"use client";

import CryptoTicker from "../market/CryptoTicker";

const cryptoAssets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    icon: "/images/crypto/btc.svg",
    price: 768500000,
    change: 1.65,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "/images/crypto/eth.svg",
    price: 42300000,
    change: -0.82,
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    icon: "/images/crypto/bnb.svg",
    price: 8750000,
    change: 1.45,
  },
  {
    symbol: "SOL",
    name: "Solana",
    icon: "/images/crypto/sol.svg",
    price: 3250000,
    change: 3.24,
  },
  {
    symbol: "XRP",
    name: "Ripple",
    icon: "/images/crypto/xrp.svg",
    price: 8500,
    change: -1.12,
  },
  {
    symbol: "ADA",
    name: "Cardano",
    icon: "/images/crypto/ada.svg",
    price: 7800,
    change: 0.56,
  },
];

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
  // Gabungkan semua asset jadi satu array untuk infinite scroll
  const allAssets = [
    ...cryptoAssets.map((a) => ({ ...a, type: "crypto" as const })),
    ...idxStocks.map((a) => ({
      ...a,
      type: "stock" as const,
      icon: undefined,
    })),
  ];

  return (
    <div className="w-screen overflow-hidden border border-gray-200/50 bg-linear-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 shadow-lg backdrop-blur-sm md:py-6 md:text-lg lg:py-8 lg:text-xl dark:border-[#2A3B7D]/50 dark:bg-linear-to-r dark:from-[#1a1f4d]/90 dark:via-[#1E2763]/90 dark:to-[#2A3B7D]/90">
      <div className="py-3 md:py-0">
        {/* Scrolling Container */}
        <div className="relative flex">
          {/* Animate infinite scroll - duplicate content for seamless loop */}
          <div className="animate-scroll flex gap-4">
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
