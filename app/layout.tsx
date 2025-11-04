import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  MarketStatusBanner,
  OfflineDetector,
} from "./components/DynamicComponents";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import NextAuthProvider from "./components/providers/NextAuthProvider";
import "./globals.css";
import { ClientErrorBoundary } from "./providers/ClientErrorBoundary";
import { ToastProvider } from "./providers/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  fallback: ["system-ui", "arial"], // Better fallback
});

export const metadata: Metadata = {
  title: "BeritaFinansial - Platform Berita Saham & Kripto Indonesia",
  description:
    "Platform berita dan data finansial terpercaya untuk investor dan trader saham serta kripto di Indonesia. Dapatkan berita real-time, analisis mendalam, dan data pasar terkini.",
  keywords:
    "berita saham, berita kripto, investasi indonesia, trading, analisis pasar, bitcoin, ethereum, IHSG, bursa efek",
  authors: [{ name: "BeritaFinansial Team" }],
  openGraph: {
    title: "BeritaFinansial - Platform Berita Saham & Kripto Indonesia",
    description:
      "Platform berita dan data finansial terpercaya untuk investor dan trader Indonesia",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeritaFinansial - Platform Berita Saham & Kripto Indonesia",
    description:
      "Platform berita dan data finansial terpercaya untuk investor dan trader Indonesia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  var d = localStorage.getItem('darkMode');
                  var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = t === 'dark' || (t === null && (d === 'true' || (d === null && prefers)));
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Dark mode init error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ClientErrorBoundary>
          <ToastProvider>
            <NextAuthProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <OfflineDetector />
              <MarketStatusBanner />
            </NextAuthProvider>
          </ToastProvider>
        </ClientErrorBoundary>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
