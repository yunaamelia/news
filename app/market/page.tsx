"use client";

import { useState, useEffect } from "react";
import { FiTrendingUp, FiTrendingDown, FiRefreshCw, FiSearch } from "react-icons/fi";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Data Pasar Real-Time</h1>
          <p className="text-lg text-gray-600">
            Pantau pergerakan harga saham Indonesia dan cryptocurrency terkini
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("stocks")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "stocks"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Saham IDX
              </button>
              <button
                onClick={() => setActiveTab("crypto")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "crypto"
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cryptocurrency
              </button>
            </div>

            {/* Search & Refresh */}
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari symbol atau nama..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={fetchMarketData}
                disabled={loading}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Market Data Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
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
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{item.symbol}</div>
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
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-semibold ${
                            item.changePercent >= 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.changePercent >= 0 ? (
                            <FiTrendingUp className="w-4 h-4" />
                          ) : (
                            <FiTrendingDown className="w-4 h-4" />
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
                <div className="text-center py-12 text-gray-500">
                  Tidak ada data yang cocok dengan pencarian
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            <strong>Catatan:</strong> Data harga diperbarui setiap 60 detik. Gunakan untuk
            referensi saja, bukan sebagai rekomendasi investasi.
          </p>
        </div>
      </div>
    </div>
  );
}
