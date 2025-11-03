import Link from "next/link";
import { FiTrendingUp, FiActivity, FiBook, FiAward } from "react-icons/fi";
import ArticleCard from "./components/articles/ArticleCard";
import MarketCard from "./components/market/MarketCard";

// Mock data untuk demo
const featuredArticle = {
  id: "1",
  title: "Bitcoin Menembus $50,000: Analisis Lengkap Rally Terbaru",
  slug: "bitcoin-menembus-50000-analisis-lengkap",
  excerpt:
    "Setelah melewati masa koreksi yang cukup panjang, Bitcoin akhirnya berhasil menembus level psikologis $50,000. Apa yang menyebabkan rally ini dan bagaimana prospek ke depannya?",
  content: "",
  coverImage: "/images/bitcoin-rally.jpg",
  category: "KRIPTO" as const,
  tags: ["bitcoin", "cryptocurrency", "market-analysis"],
  author: "Andi Wijaya",
  authorImage: "/images/author-1.jpg",
  status: "PUBLISHED" as const,
  isPremium: false,
  views: 1523,
  publishedAt: new Date("2025-11-02"),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const recentArticles = [
  {
    id: "2",
    title: "Saham Bank BCA Mencapai All-Time High: Analisis Fundamental",
    slug: "saham-bca-all-time-high",
    excerpt:
      "Kinerja solid dan ekspansi digital mendorong saham BBCA mencapai rekor tertinggi.",
    coverImage: "/images/bca-stock.jpg",
    category: "SAHAM" as const,
    tags: ["saham", "banking", "bca"],
    author: "Siti Nurhaliza",
    authorImage: "/images/author-2.jpg",
    status: "PUBLISHED" as const,
    isPremium: false,
    views: 890,
    publishedAt: new Date("2025-11-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Panduan Lengkap: Cara Memulai Investasi Saham untuk Pemula",
    slug: "panduan-investasi-saham-pemula",
    excerpt:
      "Pelajari langkah-langkah dasar untuk memulai perjalanan investasi saham Anda dengan aman.",
    coverImage: "/images/stock-education.jpg",
    category: "EDUKASI" as const,
    tags: ["edukasi", "pemula", "investasi"],
    author: "Budi Santoso",
    authorImage: "/images/author-3.jpg",
    status: "PUBLISHED" as const,
    isPremium: false,
    views: 2341,
    publishedAt: new Date("2025-10-31"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Regulasi Baru Bappebti: Dampaknya untuk Trader Crypto Indonesia",
    slug: "regulasi-bappebti-crypto",
    excerpt:
      "Memahami implikasi regulasi terbaru dan bagaimana mempersiapkan diri sebagai trader.",
    coverImage: "/images/regulation.jpg",
    category: "REGULASI" as const,
    tags: ["regulasi", "bappebti", "crypto"],
    author: "Dewi Lestari",
    authorImage: "/images/author-4.jpg",
    status: "PUBLISHED" as const,
    isPremium: true,
    views: 567,
    publishedAt: new Date("2025-10-30"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const topStocks = [
  {
    symbol: "BBCA",
    name: "Bank Central Asia",
    price: 9850,
    change: 150,
    changePercent: 1.55,
    volume: 45230000,
  },
  {
    symbol: "BBRI",
    name: "Bank Rakyat Indonesia",
    price: 5125,
    change: -25,
    changePercent: -0.49,
    volume: 67890000,
  },
  {
    symbol: "TLKM",
    name: "Telkom Indonesia",
    price: 3890,
    change: 50,
    changePercent: 1.3,
    volume: 23450000,
  },
];

const topCryptos = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 768500000,
    change: 12500000,
    changePercent: 1.65,
    image: "/images/btc.png",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 42300000,
    change: -350000,
    changePercent: -0.82,
    image: "/images/eth.png",
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    price: 8750000,
    change: 125000,
    changePercent: 1.45,
    image: "/images/bnb.png",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Berita & Data Finansial Terpercaya
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Platform terlengkap untuk investor dan trader Indonesia. Dapatkan
              berita real-time, analisis mendalam, dan data pasar saham & kripto
              dalam satu tempat.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Daftar Gratis
              </Link>
              <Link
                href="/premium"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition border-2 border-white"
              >
                Upgrade ke Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Data Real-Time</h3>
              <p className="text-gray-600 text-sm">
                Pantau pergerakan harga saham dan kripto secara real-time
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiActivity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Analisis Mendalam</h3>
              <p className="text-gray-600 text-sm">
                Laporan dan analisis dari para ahli industri
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBook className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Edukasi Lengkap</h3>
              <p className="text-gray-600 text-sm">
                Pelajari investasi dari dasar hingga mahir
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Terpercaya</h3>
              <p className="text-gray-600 text-sm">
                Berita akurat tanpa bias dari sumber terpercaya
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Berita Utama</h2>
          <ArticleCard article={featuredArticle} />
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Pasar Hari Ini</h2>
            <Link
              href="/market"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Saham */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg mr-2">
                  Saham
                </span>
                Top Movers
              </h3>
              <div className="space-y-4">
                {topStocks.map((stock) => (
                  <MarketCard
                    key={stock.symbol}
                    data={{
                      symbol: stock.symbol,
                      name: stock.name,
                      price: stock.price,
                      change24h: stock.change,
                      changePercent: stock.changePercent,
                      volume: stock.volume,
                      lastUpdated: new Date().toISOString(),
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Kripto */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg mr-2">
                  Kripto
                </span>
                Top Gainers
              </h3>
              <div className="space-y-4">
                {topCryptos.map((crypto) => (
                  <MarketCard
                    key={crypto.symbol}
                    data={{
                      symbol: crypto.symbol,
                      name: crypto.name,
                      price: crypto.price,
                      change24h: crypto.change,
                      changePercent: crypto.changePercent,
                      volume: 0,
                      lastUpdated: new Date().toISOString(),
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Artikel Terbaru</h2>
            <Link
              href="/artikel"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Meningkatkan Strategi Investasi Anda?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Bergabunglah dengan ribuan investor cerdas yang sudah mempercayai
            kami untuk mendapatkan informasi finansial terbaik.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            Mulai Sekarang - Gratis!
          </Link>
        </div>
      </section>
    </div>
  );
}
