"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiDollarSign,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import { PortfolioAnalytics } from "../components/portfolio/PortfolioAnalytics";

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
      <div className="flex min-h-screen items-center justify-center">
        <FiActivity className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              Portfolio Saya
            </h1>
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
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            <FiPlus className="h-5 w-5" />
            <span>Tambah Posisi</span>
          </button>
        </div>

        {/* Portfolio Analytics */}
        {portfolio.length > 0 && (
          <div className="mb-8">
            <PortfolioAnalytics />
          </div>
        )}

        {/* Stats Cards */}
        {portfolio.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <FiDollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Total Investasi
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalInvestment)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <FiActivity className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Nilai Saat Ini
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.currentValue)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-2 flex items-center gap-3">
                <div
                  className={`rounded-lg p-2 ${
                    stats.totalProfitLoss >= 0 ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {stats.totalProfitLoss >= 0 ? (
                    <FiTrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <FiTrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Total P&L
                </span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  stats.totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(stats.totalProfitLoss)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-2 flex items-center gap-3">
                <div
                  className={`rounded-lg p-2 ${
                    stats.totalProfitLossPercent >= 0
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {stats.totalProfitLossPercent >= 0 ? (
                    <FiTrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <FiTrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Return
                </span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  stats.totalProfitLossPercent >= 0
                    ? "text-green-600"
                    : "text-red-600"
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
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <FiActivity className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Portfolio masih kosong
            </h3>
            <p className="mb-6 text-gray-600">
              Mulai catat investasi Anda untuk memantau performa
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
            >
              <FiPlus className="h-5 w-5" />
              <span>Tambah Posisi</span>
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
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
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">
                                {item.symbol}
                              </span>
                              <span
                                className={`rounded px-2 py-0.5 text-xs font-semibold ${
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
                        {item.currentPrice
                          ? formatCurrency(item.currentPrice)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        {item.totalValue
                          ? formatCurrency(item.totalValue)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.profitLoss !== undefined ? (
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`font-bold ${
                                item.profitLoss >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {formatCurrency(item.profitLoss)}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 text-sm font-semibold ${
                                item.profitLoss >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.profitLoss >= 0 ? (
                                <FiTrendingUp className="h-4 w-4" />
                              ) : (
                                <FiTrendingDown className="h-4 w-4" />
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
                            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                          >
                            <FiTrash2 className="h-4 w-4" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                {editingId ? "Edit Posisi" : "Tambah Posisi Baru"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
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
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SAHAM">Saham</option>
                    <option value="KRIPTO">Cryptocurrency</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Symbol
                    </label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          symbol: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="BBCA"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Nama
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Bank BCA"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tanggal Beli
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                    }}
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700"
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
