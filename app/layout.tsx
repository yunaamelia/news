import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import NextAuthProvider from "./components/providers/NextAuthProvider";

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
    <html lang="id">
      <body className={inter.className}>
        <NextAuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
