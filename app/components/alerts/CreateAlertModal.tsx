"use client";

import Button from "@/app/components/ui/Button";
import { useToast } from "@/app/providers/ToastProvider";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiBell, FiTrendingDown, FiTrendingUp, FiX } from "react-icons/fi";

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  assetType: "SAHAM" | "KRIPTO";
  currentPrice?: number;
  onAlertCreated?: () => void;
}

export default function CreateAlertModal({
  isOpen,
  onClose,
  symbol,
  assetType,
  currentPrice,
  onAlertCreated,
}: CreateAlertModalProps) {
  const [condition, setCondition] = useState<"ABOVE" | "BELOW" | "EQUALS">(
    "ABOVE"
  );
  const [targetPrice, setTargetPrice] = useState<string>(
    currentPrice?.toString() || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      showToast("error", "Masukkan harga yang valid");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol,
          assetType,
          targetPrice: price,
          condition,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat alert");
      }

      showToast("success", "Alert berhasil dibuat!");
      onAlertCreated?.();
      onClose();
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Gagal membuat alert"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-linear-to-br from-gray-900 to-gray-800 p-6 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
              >
                <FiX className="size-6" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/20 p-2">
                    <FiBell className="size-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Buat Price Alert
                  </h2>
                </div>
                <p className="text-sm text-gray-400">
                  Dapatkan notifikasi email saat target harga tercapai
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Symbol Display */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="mb-1 text-sm text-gray-400">Simbol</div>
                  <div className="text-lg font-bold text-white">
                    {symbol}
                    <span className="ml-2 text-sm text-gray-400">
                      ({assetType})
                    </span>
                  </div>
                  {currentPrice && (
                    <div className="mt-1 text-sm text-gray-400">
                      Harga Saat Ini: Rp {currentPrice.toLocaleString("id-ID")}
                    </div>
                  )}
                </div>

                {/* Condition Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Kondisi Alert
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCondition("ABOVE")}
                      className={`rounded-lg border-2 p-3 transition-all ${
                        condition === "ABOVE"
                          ? "border-green-500 bg-green-500/20 text-green-400"
                          : "border-white/20 bg-white/5 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <FiTrendingUp className="mx-auto mb-1 size-5" />
                      <div className="text-xs font-medium">Di Atas</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition("BELOW")}
                      className={`rounded-lg border-2 p-3 transition-all ${
                        condition === "BELOW"
                          ? "border-red-500 bg-red-500/20 text-red-400"
                          : "border-white/20 bg-white/5 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <FiTrendingDown className="mx-auto mb-1 size-5" />
                      <div className="text-xs font-medium">Di Bawah</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition("EQUALS")}
                      className={`rounded-lg border-2 p-3 transition-all ${
                        condition === "EQUALS"
                          ? "border-blue-500 bg-blue-500/20 text-blue-400"
                          : "border-white/20 bg-white/5 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <div className="mx-auto mb-1 text-lg font-bold">=</div>
                      <div className="text-xs font-medium">Sama Dengan</div>
                    </button>
                  </div>
                </div>

                {/* Target Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Target Harga (IDR)
                  </label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="Masukkan target harga"
                    step="0.01"
                    min="0"
                    required
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Info */}
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                  <p className="text-xs text-blue-300">
                    💡 Alert akan otomatis dinonaktifkan setelah tercapai.
                    Pengguna gratis dibatasi maksimal 10 active alerts.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Buat Alert
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
