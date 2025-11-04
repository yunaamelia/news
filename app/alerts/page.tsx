"use client";

import Button from "@/app/components/ui/Button";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { useToast } from "@/app/providers/ToastProvider";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiBell,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";

interface PriceAlert {
  id: string;
  symbol: string;
  assetType: "SAHAM" | "KRIPTO";
  targetPrice: number;
  condition: "ABOVE" | "BELOW" | "EQUALS";
  isActive: boolean;
  triggered: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export default function AlertsPage() {
  const { status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "triggered">("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAlerts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, filter]);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === "active") params.append("isActive", "true");
      if (filter === "triggered") params.append("isActive", "false");

      const response = await fetch(`/api/alerts?${params}`);
      const data = await response.json();

      if (response.ok) {
        setAlerts(data.alerts);
      } else {
        showToast("error", data.error || "Gagal memuat alerts");
      }
    } catch {
      showToast("error", "Gagal memuat alerts");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAlert = async (id: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentState }),
      });

      if (response.ok) {
        showToast(
          "success",
          `Alert ${!currentState ? "diaktifkan" : "dinonaktifkan"}`
        );
        fetchAlerts();
      } else {
        const data = await response.json();
        showToast("error", data.error || "Gagal mengupdate alert");
      }
    } catch {
      showToast("error", "Gagal mengupdate alert");
    }
  };

  const deleteAlert = async (id: string) => {
    if (!confirm("Yakin ingin menghapus alert ini?")) return;

    try {
      const response = await fetch(`/api/alerts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("success", "Alert berhasil dihapus");
        fetchAlerts();
      } else {
        const data = await response.json();
        showToast("error", data.error || "Gagal menghapus alert");
      }
    } catch {
      showToast("error", "Gagal menghapus alert");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "active") return alert.isActive && !alert.triggered;
    if (filter === "triggered") return alert.triggered;
    return true;
  });

  const conditionIcon = (condition: string) => {
    if (condition === "ABOVE")
      return <FiTrendingUp className="text-green-400" />;
    if (condition === "BELOW")
      return <FiTrendingDown className="text-red-400" />;
    return <span className="text-blue-400">=</span>;
  };

  const conditionText = (condition: string) => {
    if (condition === "ABOVE") return "Di Atas";
    if (condition === "BELOW") return "Di Bawah";
    return "Sama Dengan";
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/20 p-3">
              <FiBell className="size-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Price Alerts</h1>
              <p className="text-gray-400">
                Kelola notifikasi harga untuk aset Anda
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex gap-2"
        >
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            Semua ({alerts.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              filter === "active"
                ? "bg-green-500 text-white"
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            Aktif ({alerts.filter((a) => a.isActive && !a.triggered).length})
          </button>
          <button
            onClick={() => setFilter("triggered")}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              filter === "triggered"
                ? "bg-yellow-500 text-white"
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            Tercapai ({alerts.filter((a) => a.triggered).length})
          </button>
        </motion.div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <FiBell className="mx-auto mb-4 size-16 text-gray-600" />
            <h3 className="mb-2 text-xl font-semibold text-gray-400">
              Belum ada alert
            </h3>
            <p className="mb-6 text-gray-500">
              Buat alert dari halaman watchlist atau market
            </p>
            <Button variant="primary" onClick={() => router.push("/watchlist")}>
              Ke Watchlist
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-white/10 bg-linear-to-br from-gray-800 to-gray-900 p-6 transition-all hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Symbol & Asset Type */}
                    <div className="mb-3 flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-white">
                        {alert.symbol}
                      </h3>
                      <span className="rounded bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400">
                        {alert.assetType}
                      </span>
                      {alert.triggered && (
                        <span className="rounded bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                          ✓ Tercapai
                        </span>
                      )}
                      {alert.isActive && !alert.triggered && (
                        <span className="rounded bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400">
                          ● Aktif
                        </span>
                      )}
                    </div>

                    {/* Condition & Price */}
                    <div className="mb-2 flex items-center gap-2 text-gray-300">
                      {conditionIcon(alert.condition)}
                      <span className="font-medium">
                        {conditionText(alert.condition)}
                      </span>
                      <span className="text-2xl font-bold text-white">
                        Rp {alert.targetPrice.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>
                        Dibuat:{" "}
                        {new Date(alert.createdAt).toLocaleDateString("id-ID")}
                      </span>
                      {alert.triggeredAt && (
                        <span>
                          Tercapai:{" "}
                          {new Date(alert.triggeredAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!alert.triggered && (
                      <button
                        onClick={() => toggleAlert(alert.id, alert.isActive)}
                        className="rounded-lg p-2 transition-colors hover:bg-white/10"
                        title={alert.isActive ? "Nonaktifkan" : "Aktifkan"}
                      >
                        {alert.isActive ? (
                          <FiToggleRight className="size-6 text-green-400" />
                        ) : (
                          <FiToggleLeft className="size-6 text-gray-500" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="rounded-lg p-2 transition-colors hover:bg-red-500/20"
                      title="Hapus"
                    >
                      <FiTrash2 className="size-6 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
