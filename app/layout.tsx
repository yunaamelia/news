import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import NextAuthProvider from "./components/providers/NextAuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
                  // Read both 'theme' and legacy 'darkMode' to avoid flicker and ensure consistency
                  var t = localStorage.getItem('theme');
                  var d = localStorage.getItem('darkMode');
                  var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = t === 'dark' || (t === null && (d === 'true' || (d === null && prefers)));
                  if (isDark) document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextAuthProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
