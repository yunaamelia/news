import Link from "next/link";
import {
  FiTrendingUp,
  FiActivity,
  FiBook,
  FiBarChart2,
  FiZap,
  FiShield,
  FiClock,
  FiArrowRight,
  FiStar,
} from "react-icons/fi";
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
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section - Modern with gradient animation */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-purple-800 text-white pt-32 pb-24">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-75"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-150"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <FiZap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Platform #1 untuk Investor Indonesia</span>
            </div>

            {/* Main heading with gradient text */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-linear-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Berita & Data Finansial
              </span>
              <br />
              <span className="text-white">Terpercaya</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Platform terlengkap untuk investor dan trader Indonesia. Dapatkan
              berita real-time, analisis mendalam, dan data pasar saham & kripto
              dalam satu tempat.
            </p>

            {/* CTA Buttons with improved styling */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span>Mulai Gratis</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/premium"
                className="group inline-flex items-center justify-center gap-2 bg-transparent text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all border-2 border-white/30 backdrop-blur-sm"
              >
                <FiStar className="w-5 h-5" />
                <span>Lihat Premium</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl md:text-4xl font-bold">10K+</div>
                <div className="text-blue-200 text-sm mt-1">Pengguna Aktif</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">500+</div>
                <div className="text-blue-200 text-sm mt-1">Artikel Premium</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">24/7</div>
                <div className="text-blue-200 text-sm mt-1">Data Real-time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg className="fill-gray-50" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section - Modern cards with hover effects */}
      <section className="py-20 bg-linear-to-b from-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kenapa Memilih BeritaFinansial?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Platform all-in-one dengan fitur lengkap untuk mendukung keputusan investasi Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="bg-linear-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiBarChart2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">Data Real-Time</h3>
                <p className="text-gray-600 leading-relaxed">
                  Pantau pergerakan harga saham dan kripto secara real-time dengan akurasi tinggi
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2">
              <div className="absolute inset-0 bg-linear-to-br from-green-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="bg-linear-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiActivity className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">Analisis Expert</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dapatkan insight dan analisis mendalam dari para ahli finansial berpengalaman
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2">
              <div className="absolute inset-0 bg-linear-to-br from-purple-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="bg-linear-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiBook className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">Edukasi Lengkap</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tingkatkan skill trading Anda dengan panduan lengkap dari pemula hingga mahir
                </p>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-2">
              <div className="absolute inset-0 bg-linear-to-br from-orange-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="bg-linear-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiShield className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900">100% Terpercaya</h3>
                <p className="text-gray-600 leading-relaxed">
                  Berita akurat dan terverifikasi dari sumber terpercaya tanpa bias
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                <FiClock className="w-4 h-4" />
                <span>Trending Now</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Berita Utama</h2>
            </div>
            <Link
              href="/artikel"
              className="hidden md:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group"
            >
              <span>Lihat Semua</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ArticleCard article={featuredArticle} />
        </div>
      </section>

      {/* Market Overview - Glassmorphism design */}
      <section className="py-20 bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-75"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Pasar Hari Ini</h2>
              <p className="text-gray-600">Pantau pergerakan harga terkini dari pasar saham dan kripto</p>
            </div>
            <Link
              href="/market"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-blue-600 hover:text-blue-700 group"
            >
              <span>Lihat Semua Pasar</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Saham Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Saham IDX</h3>
                    <p className="text-sm text-gray-600">Top Movers Today</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold">
                  IHSG +0.8%
                </span>
              </div>
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

            {/* Kripto Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FiActivity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Cryptocurrency</h3>
                    <p className="text-sm text-gray-600">Top Gainers 24h</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-semibold">
                  Market Cap $2.1T
                </span>
              </div>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Artikel Pilihan</h2>
              <p className="text-gray-600">Baca artikel terbaru dari berbagai kategori finansial</p>
            </div>
            <Link
              href="/artikel"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group"
            >
              <span>Jelajahi Semua Artikel</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern with glassmorphism */}
      <section className="relative py-24 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        {/* Animated blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-75"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/20 shadow-2xl">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <FiStar className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">Lebih dari 10.000+ investor bergabung</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Siap Meningkatkan Strategi
                <br />
                <span className="bg-linear-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                  Investasi Anda?
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                Bergabunglah dengan komunitas investor cerdas yang sudah mempercayai
                kami untuk mendapatkan informasi finansial terbaik.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <span>Mulai Gratis Sekarang</span>
                  <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/premium"
                  className="group inline-flex items-center justify-center gap-2 bg-transparent text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border-2 border-white/50 backdrop-blur-sm"
                >
                  <FiStar className="w-6 h-6" />
                  <span>Lihat Paket Premium</span>
                </Link>
              </div>

              <p className="mt-8 text-blue-200 text-sm">
                Tanpa kartu kredit • Setup 2 menit • Batalkan kapan saja
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
