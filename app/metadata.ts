export const metadata = {
  applicationName: "Berita Finansial Indonesia",
  title: {
    default: "Berita Finansial - Platform Berita Saham & Kripto Indonesia",
    template: "%s | Berita Finansial",
  },
  description:
    "Platform berita dan data finansial terpercaya untuk investor dan trader saham serta kripto di Indonesia. Dapatkan berita real-time, analisis mendalam, dan data pasar terkini.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Berita Finansial",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#2563eb",
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};
