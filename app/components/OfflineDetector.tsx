"use client";

import { useEffect, useState } from "react";
import { FiWifi, FiWifiOff } from "react-icons/fi";

export default function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(() => {
    // Initialize from navigator.onLine if available (client-side)
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      // Hide notification after 3 seconds
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-9999 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        isOnline
          ? "animate-[slide-in-left_0.3s_ease-out] border-green-500/50 bg-green-500/10"
          : "animate-[slide-in-left_0.3s_ease-out] border-red-500/50 bg-red-500/10"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-white ${
          isOnline
            ? "bg-[linear-gradient(to_right,rgb(34,197,94),rgb(16,185,129))]"
            : "bg-[linear-gradient(to_right,rgb(239,68,68),rgb(244,63,94))]"
        }`}
      >
        {isOnline ? (
          <FiWifi className="h-4 w-4" />
        ) : (
          <FiWifiOff className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">
          {isOnline ? "Koneksi Kembali" : "Tidak Ada Koneksi"}
        </p>
        <p className="text-xs text-gray-300">
          {isOnline ? "Anda kembali online" : "Periksa koneksi internet Anda"}
        </p>
      </div>
      {isOnline && (
        <button
          onClick={() => setShowNotification(false)}
          className="shrink-0 text-gray-400 transition hover:text-white"
          aria-label="Tutup"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
