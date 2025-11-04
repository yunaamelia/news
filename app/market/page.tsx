"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiRefreshCw,
  FiSearch,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume: number;
  high24h?: number;
  low24h?: number;
  marketCap?: number;
}

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState<"stocks" | "crypto">("stocks");
  const [stocks, setStocks] = useState<MarketData[]>([]);
  const [crypto, setCrypto] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/market?type=all");
      const data = await res.json();
      setStocks(data.stocks || []);
      setCrypto(data.crypto || []);
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return price >= 1000000
      ? `Rp ${(price / 1000000).toFixed(2)}jt`
      : `Rp ${price.toLocaleString("id-ID")}`;
  };

  const formatCryptoPrice = (price: number) => {
    return price >= 1000000
      ? `Rp ${(price / 1000000).toFixed(2)}M`
      : `Rp ${price.toLocaleString("id-ID")}`;
  };

  const filteredData = (activeTab === "stocks" ? stocks : crypto).filter(
    (item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            Data Pasar Real-Time
          </h1>
          <p className="text-lg text-gray-600">
            Pantau pergerakan harga saham Indonesia dan cryptocurrency terkini
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("stocks")}
                className={`rounded-xl px-6 py-3 font-semibold transition-all ${
                  activeTab === "stocks"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Saham IDX
              </button>
              <button
                onClick={() => setActiveTab("crypto")}
                className={`rounded-xl px-6 py-3 font-semibold transition-all ${
                  activeTab === "crypto"
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cryptocurrency
              </button>
            </div>

            {/* Search & Refresh */}
            <div className="flex w-full gap-3 md:w-auto">
              <div className="relative flex-1 md:w-64">
                <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari symbol atau nama..."
                  className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={fetchMarketData}
                disabled={loading}
                className="rounded-xl bg-gray-100 px-4 py-3 transition-all hover:bg-gray-200 disabled:opacity-50"
              >
                <FiRefreshCw
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Market Data Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FiRefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Symbol
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Nama
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Harga
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Perubahan 24j
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Volume
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr
                      key={item.symbol}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/market/${item.symbol.toLowerCase()}?type=${activeTab === "stocks" ? "saham" : "kripto"}`}
                          className="font-bold text-blue-600 hover:text-blue-800"
                        >
                          {item.symbol}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-semibold text-gray-900">
                          {activeTab === "stocks"
                            ? formatPrice(item.price)
                            : formatCryptoPrice(item.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 font-semibold ${
                            item.changePercent >= 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.changePercent >= 0 ? (
                            <FiTrendingUp className="h-4 w-4" />
                          ) : (
                            <FiTrendingDown className="h-4 w-4" />
                          )}
                          <span>
                            {item.changePercent >= 0 ? "+" : ""}
                            {item.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-gray-600">
                          {item.volume.toLocaleString("id-ID")}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  Tidak ada data yang cocok dengan pencarian
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            <strong>Catatan:</strong> Data harga diperbarui setiap 60 detik.
            Gunakan untuk referensi saja, bukan sebagai rekomendasi investasi.
          </p>
        </div>
      </div>
    </div>
  );
}
