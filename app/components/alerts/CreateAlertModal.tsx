"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiBell, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import Button from "@/app/components/ui/Button";
import { useToast } from "@/app/providers/ToastProvider";

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
  const [condition, setCondition] = useState<"ABOVE" | "BELOW" | "EQUALS">("ABOVE");
  const [targetPrice, setTargetPrice] = useState<string>(currentPrice?.toString() || "");
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
              className="relative w-full max-w-md rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 p-6 shadow-2xl border border-white/10"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="size-6" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FiBell className="size-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Buat Price Alert
                  </h2>
                </div>
                <p className="text-gray-400 text-sm">
                  Dapatkan notifikasi email saat target harga tercapai
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Symbol Display */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Simbol</div>
                  <div className="text-lg font-bold text-white">
                    {symbol}
                    <span className="ml-2 text-sm text-gray-400">
                      ({assetType})
                    </span>
                  </div>
                  {currentPrice && (
                    <div className="text-sm text-gray-400 mt-1">
                      Harga Saat Ini: Rp {currentPrice.toLocaleString("id-ID")}
                    </div>
                  )}
                </div>

                {/* Condition Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kondisi Alert
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCondition("ABOVE")}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        condition === "ABOVE"
                          ? "border-green-500 bg-green-500/20 text-green-400"
                          : "border-white/20 bg-white/5 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <FiTrendingUp className="size-5 mx-auto mb-1" />
                      <div className="text-xs font-medium">Di Atas</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition("BELOW")}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        condition === "BELOW"
                          ? "border-red-500 bg-red-500/20 text-red-400"
                          : "border-white/20 bg-white/5 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <FiTrendingDown className="size-5 mx-auto mb-1" />
                      <div className="text-xs font-medium">Di Bawah</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition("EQUALS")}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        condition === "EQUALS"
                          ? "border-blue-500 bg-blue-500/20 text-blue-400"
                          : "border-white/20 bg-white/5 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <div className="text-lg font-bold mx-auto mb-1">=</div>
                      <div className="text-xs font-medium">Sama Dengan</div>
                    </button>
                  </div>
                </div>

                {/* Target Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Info */}
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-blue-300">
                    💡 Alert akan otomatis dinonaktifkan setelah tercapai. Pengguna gratis dibatasi maksimal 10 active alerts.
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
