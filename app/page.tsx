import Link from "next/link";
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiBook,
  FiClock,
  FiShield,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import ArticleCard from "./components/articles/ArticleCard";
import MarketCard from "./components/market/MarketCard";
import MarketTicker from "./components/market/MarketTicker";

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
      {/* Hero Section - Bold crypto-themed */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#0a0e27] via-[#121b3a] to-[#0a0e27] pt-32 pb-32 text-white">
        {/* SVG Decorative Shapes */}
        <div className="pointer-events-none absolute top-0 left-0 -z-10 opacity-50">
          <svg
            width="590"
            height="666"
            viewBox="0 0 590 666"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              opacity="0.4"
              cx="333"
              cy="333"
              r="333"
              fill="url(#paint0_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="333"
                y1="0"
                x2="333"
                y2="666"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3E7DFF" stopOpacity="0.8" />
                <stop offset="1" stopColor="#3E7DFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="pointer-events-none absolute top-20 right-0 -z-10 opacity-40">
          <svg
            width="443"
            height="524"
            viewBox="0 0 443 524"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              opacity="0.3"
              cx="221.5"
              cy="262"
              r="262"
              fill="url(#paint0_radial)"
            />
            <defs>
              <radialGradient
                id="paint0_radial"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(221.5 262) rotate(90) scale(262)"
              >
                <stop stopColor="#7C3AED" stopOpacity="0.6" />
                <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 h-[500px] w-[500px] animate-pulse rounded-full bg-blue-600 opacity-40 mix-blend-multiply blur-[128px]"></div>
          <div className="absolute top-40 right-10 h-[600px] w-[600px] animate-pulse rounded-full bg-purple-600 opacity-40 mix-blend-multiply blur-[128px]"></div>
          <div className="absolute bottom-20 left-1/3 h-[550px] w-[550px] animate-pulse rounded-full bg-cyan-600 opacity-30 mix-blend-multiply blur-[128px]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main heading with massive gradient text */}
            <h1 className="animate-fade-in-up mb-8 text-6xl leading-[1.1] font-black tracking-tight md:text-8xl lg:text-9xl">
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
                Berita & Data
              </span>
              <br />
              <span className="bg-linear-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Finansial Terpercaya
              </span>
            </h1>

            <p className="animation-delay-200 animate-fade-in-up mx-auto mb-14 max-w-4xl text-xl leading-relaxed text-gray-300 md:text-2xl">
              Platform terlengkap untuk investor dan trader Indonesia. Dapatkan
              berita real-time, analisis mendalam, dan data pasar saham & kripto
              dalam satu tempat.
            </p>
          </div>
        </div>

        {/* Market Ticker - Full Width */}
        <div className="mb-8">
          <MarketTicker />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* CTA Buttons */}
            <div className="animation-delay-300 animate-fade-in-up mb-16 flex flex-col justify-center gap-6 sm:flex-row">
              <Link
                href="/auth/signup"
                className="group bg-gradient-crypto relative inline-flex items-center justify-center gap-3 rounded-xl px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-500/40"
              >
                <span>Mulai Gratis</span>
                <FiArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
              <Link
                href="/premium"
                className="group inline-flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-10 py-5 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:bg-white/10 hover:shadow-xl hover:shadow-yellow-500/20"
              >
                <FiStar className="h-6 w-6 text-yellow-400 transition-transform group-hover:rotate-12" />
                <span>Lihat Premium</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="animation-delay-500 animate-fade-in-up mx-auto grid max-w-3xl grid-cols-3 gap-12 border-t border-white/10 pt-12">
              <div className="group text-center transition-transform duration-300 hover:scale-110">
                <div className="gradient-text-crypto mb-2 text-4xl font-black md:text-5xl">
                  10K+
                </div>
                <div className="text-sm font-medium text-gray-400">
                  Pengguna Aktif
                </div>
              </div>
              <div className="group text-center transition-transform duration-300 hover:scale-110">
                <div className="gradient-text-crypto mb-2 text-4xl font-black md:text-5xl">
                  500+
                </div>
                <div className="text-sm font-medium text-gray-400">
                  Artikel Premium
                </div>
              </div>
              <div className="group text-center transition-transform duration-300 hover:scale-110">
                <div className="gradient-text-crypto mb-2 text-4xl font-black md:text-5xl">
                  24/7
                </div>
                <div className="text-sm font-medium text-gray-400">
                  Data Real-time
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            className="fill-gray-50 dark:fill-slate-900"
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section - Modern cards with hover effects */}
      <section className="relative bg-linear-to-b from-gray-50 to-white py-20 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              Kenapa Memilih BeritaFinansial?
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Platform all-in-one dengan fitur lengkap untuk mendukung keputusan
              investasi Anda
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature Card 1 */}
            <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-900/30"></div>
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 transition-transform group-hover:scale-110">
                  <FiBarChart2 className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                  Data Real-Time
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Pantau pergerakan harga saham dan kripto secara real-time
                  dengan akurasi tinggi
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-green-500">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-green-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-green-900/30"></div>
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-green-500 to-green-600 transition-transform group-hover:scale-110">
                  <FiActivity className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                  Analisis Expert
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Dapatkan insight dan analisis mendalam dari para ahli
                  finansial berpengalaman
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-purple-500">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-purple-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-purple-900/30"></div>
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-purple-600 transition-transform group-hover:scale-110">
                  <FiBook className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                  Edukasi Lengkap
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Tingkatkan skill trading Anda dengan panduan lengkap dari
                  pemula hingga mahir
                </p>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-500">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-orange-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-orange-900/30"></div>
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-orange-600 transition-transform group-hover:scale-110">
                  <FiShield className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                  100% Terpercaya
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  Berita akurat dan terverifikasi dari sumber terpercaya tanpa
                  bias
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="bg-white py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-900/40 dark:text-red-400">
                <FiClock className="h-4 w-4" />
                <span>Trending Now</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                Berita Utama
              </h2>
            </div>
            <Link
              href="/artikel"
              className="group hidden items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 md:inline-flex dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>Lihat Semua</span>
              <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <ArticleCard article={featuredArticle} />
        </div>
      </section>

      {/* Market Overview - Glassmorphism design */}
      <section className="relative overflow-hidden bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 py-20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 h-96 w-96 animate-pulse rounded-full bg-blue-300 opacity-20 mix-blend-multiply blur-3xl filter dark:bg-blue-600 dark:opacity-10"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 animate-pulse rounded-full bg-purple-300 opacity-20 mix-blend-multiply blur-3xl filter delay-75 dark:bg-purple-600 dark:opacity-10"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                Pasar Hari Ini
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Pantau pergerakan harga terkini dari pasar saham dan kripto
              </p>
            </div>
            <Link
              href="/market"
              className="group mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 shadow-md transition-all hover:text-blue-700 hover:shadow-lg md:mt-0"
            >
              <span>Lihat Semua Pasar</span>
              <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Saham Card */}
            <div className="rounded-3xl border border-white/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl dark:border-slate-700/50 dark:bg-slate-800/70">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600">
                    <FiTrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Saham IDX
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Top Movers Today
                    </p>
                  </div>
                </div>
                <span className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
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
            <div className="rounded-3xl border border-white/50 bg-white/70 p-8 shadow-xl backdrop-blur-xl transition-all hover:shadow-2xl dark:border-slate-700/50 dark:bg-slate-800/70">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-purple-600">
                    <FiActivity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Cryptocurrency
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Top Gainers 24h
                    </p>
                  </div>
                </div>
                <span className="rounded-lg bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
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
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                Artikel Pilihan
              </h2>
              <p className="text-gray-600">
                Baca artikel terbaru dari berbagai kategori finansial
              </p>
            </div>
            <Link
              href="/artikel"
              className="group mt-4 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 md:mt-0"
            >
              <span>Jelajahi Semua Artikel</span>
              <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern with glassmorphism */}
      <section className="relative overflow-hidden py-24">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        {/* Animated blobs */}
        <div className="absolute top-0 left-0 h-96 w-96 animate-pulse rounded-full bg-blue-400 opacity-30 mix-blend-multiply blur-3xl filter"></div>
        <div className="absolute right-0 bottom-0 h-96 w-96 animate-pulse rounded-full bg-purple-400 opacity-30 mix-blend-multiply blur-3xl filter delay-75"></div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-12 shadow-2xl backdrop-blur-xl md:p-16">
            <div className="text-center text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 backdrop-blur-sm">
                <FiStar className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium">
                  Lebih dari 10.000+ investor bergabung
                </span>
              </div>

              <h2 className="mb-6 text-4xl leading-tight font-bold md:text-5xl">
                Siap Meningkatkan Strategi
                <br />
                <span className="bg-linear-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                  Investasi Anda?
                </span>
              </h2>

              <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-blue-100 md:text-2xl">
                Bergabunglah dengan komunitas investor cerdas yang sudah
                mempercayai kami untuk mendapatkan informasi finansial terbaik.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="group inline-flex transform items-center justify-center gap-2 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-blue-600 shadow-xl transition-all hover:scale-105 hover:bg-blue-50 hover:shadow-2xl"
                >
                  <span>Mulai Gratis Sekarang</span>
                  <FiArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/premium"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/50 bg-transparent px-10 py-5 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <FiStar className="h-6 w-6" />
                  <span>Lihat Paket Premium</span>
                </Link>
              </div>

              <p className="mt-8 text-sm text-blue-200">
                Tanpa kartu kredit • Setup 2 menit • Batalkan kapan saja
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
