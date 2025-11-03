"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiTrendingUp, FiTrendingDown, FiActivity } from "react-icons/fi";

export const dynamic = "force-dynamic";

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  assetType: "SAHAM" | "KRIPTO";
  currentPrice?: number;
  changePercent?: number;
  addedAt: string;
}

export default function WatchlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    assetType: "SAHAM" as "SAHAM" | "KRIPTO",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchWatchlist();
    }
  }, [status, router]);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch("/api/watchlist");
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data.watchlist || []);
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowAddModal(false);
        setFormData({ symbol: "", name: "", assetType: "SAHAM" });
        fetchWatchlist();
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus dari watchlist?")) return;

    try {
      const res = await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchWatchlist();
      }
    } catch (error) {
      console.error("Error deleting from watchlist:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiActivity className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Watchlist Saya</h1>
            <p className="text-lg text-gray-600">
              Pantau aset favorit Anda dalam satu tempat
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <FiPlus className="w-5 h-5" />
            <span>Tambah Aset</span>
          </button>
        </div>

        {/* Watchlist Grid */}
        {watchlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiActivity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Watchlist masih kosong
            </h3>
            <p className="text-gray-600 mb-6">
              Tambahkan saham atau crypto untuk mulai memantau pergerakannya
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              <FiPlus className="w-5 h-5" />
              <span>Tambah Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {item.symbol}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          item.assetType === "SAHAM"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {item.assetType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.name}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  Ditambahkan {new Date(item.addedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                {item.currentPrice && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Harga Saat Ini</div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {item.assetType === "SAHAM"
                          ? `Rp ${item.currentPrice.toLocaleString("id-ID")}`
                          : `Rp ${(item.currentPrice / 1000000).toFixed(2)}M`}
                      </span>
                      {item.changePercent !== undefined && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
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
                          {item.changePercent >= 0 ? "+" : ""}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Tambah ke Watchlist
              </h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Aset
                  </label>
                  <select
                    value={formData.assetType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assetType: e.target.value as "SAHAM" | "KRIPTO",
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SAHAM">Saham</option>
                    <option value="KRIPTO">Cryptocurrency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={formData.symbol}
                    onChange={(e) =>
                      setFormData({ ...formData, symbol: e.target.value.toUpperCase() })
                    }
                    placeholder="Contoh: BBCA, BTC"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Aset
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Bank Central Asia"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                  >
                    Tambah
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
