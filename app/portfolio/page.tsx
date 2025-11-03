"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiActivity,
} from "react-icons/fi";

export const dynamic = "force-dynamic";

interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  assetType: "SAHAM" | "KRIPTO";
  quantity: number;
  buyPrice: number;
  currentPrice?: number;
  totalValue?: number;
  profitLoss?: number;
  profitLossPercent?: number;
  purchaseDate: string;
}

interface PortfolioStats {
  totalInvestment: number;
  currentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
}

export default function PortfolioPage() {
  const { status } = useSession();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    totalInvestment: 0,
    currentValue: 0,
    totalProfitLoss: 0,
    totalProfitLossPercent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    assetType: "SAHAM" as "SAHAM" | "KRIPTO",
    quantity: "",
    buyPrice: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchPortfolio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/portfolio/${editingId}` : "/api/portfolio";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity),
          buyPrice: parseFloat(formData.buyPrice),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingId(null);
        setFormData({
          symbol: "",
          name: "",
          assetType: "SAHAM",
          quantity: "",
          buyPrice: "",
          purchaseDate: new Date().toISOString().split("T")[0],
        });
        fetchPortfolio();
      }
    } catch (error) {
      console.error("Error saving portfolio:", error);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setFormData({
      symbol: item.symbol,
      name: item.name,
      assetType: item.assetType,
      quantity: item.quantity.toString(),
      buyPrice: item.buyPrice.toString(),
      purchaseDate: item.purchaseDate.split("T")[0],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus dari portfolio?")) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPortfolio();
      }
    } catch (error) {
      console.error("Error deleting from portfolio:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiActivity className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Portfolio Saya</h1>
            <p className="text-lg text-gray-600">
              Kelola dan pantau investasi Anda
            </p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                symbol: "",
                name: "",
                assetType: "SAHAM",
                quantity: "",
                buyPrice: "",
                purchaseDate: new Date().toISOString().split("T")[0],
              });
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <FiPlus className="w-5 h-5" />
            <span>Tambah Posisi</span>
          </button>
        </div>

        {/* Stats Cards */}
        {portfolio.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiDollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Total Investasi</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalInvestment)}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiActivity className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Nilai Saat Ini</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.currentValue)}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    stats.totalProfitLoss >= 0 ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {stats.totalProfitLoss >= 0 ? (
                    <FiTrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <FiTrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <span className="text-sm text-gray-600 font-medium">Total P&L</span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  stats.totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(stats.totalProfitLoss)}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    stats.totalProfitLossPercent >= 0 ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {stats.totalProfitLossPercent >= 0 ? (
                    <FiTrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <FiTrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <span className="text-sm text-gray-600 font-medium">Return</span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  stats.totalProfitLossPercent >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.totalProfitLossPercent >= 0 ? "+" : ""}
                {stats.totalProfitLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        )}

        {/* Portfolio Table */}
        {portfolio.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiActivity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Portfolio masih kosong
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai catat investasi Anda untuk memantau performa
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              <FiPlus className="w-5 h-5" />
              <span>Tambah Posisi</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Aset
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                      Jumlah
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                      Harga Beli
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                      Harga Saat Ini
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                      Total Nilai
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                      P&L
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {portfolio.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{item.symbol}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-semibold ${
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
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        {item.quantity.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900">
                        {formatCurrency(item.buyPrice)}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900">
                        {item.currentPrice ? formatCurrency(item.currentPrice) : "-"}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        {item.totalValue ? formatCurrency(item.totalValue) : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.profitLoss !== undefined ? (
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`font-bold ${
                                item.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {formatCurrency(item.profitLoss)}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 text-sm font-semibold ${
                                item.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {item.profitLoss >= 0 ? (
                                <FiTrendingUp className="w-4 h-4" />
                              ) : (
                                <FiTrendingDown className="w-4 h-4" />
                              )}
                              {item.profitLossPercent?.toFixed(2)}%
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? "Edit Posisi" : "Tambah Posisi Baru"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
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
                      placeholder="BBCA"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Bank BCA"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      placeholder="100"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Beli
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.buyPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, buyPrice: e.target.value })
                      }
                      placeholder="8500"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Beli
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                  >
                    {editingId ? "Simpan" : "Tambah"}
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
