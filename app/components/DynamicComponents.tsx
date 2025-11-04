"use client";

import dynamic from "next/dynamic";

// Lazy load non-critical components (client-only)
export const MarketStatusBanner = dynamic(
  () => import("./market/MarketStatusBanner"),
  {
    ssr: false, // Client-only, bottom-right fixed position
  }
);

export const OfflineDetector = dynamic(() => import("./OfflineDetector"), {
  ssr: false, // Client-only feature detection
});
