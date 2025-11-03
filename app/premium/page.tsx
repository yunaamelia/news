import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Premium Membership - Berita Finansial",
  description:
    "Akses konten eksklusif, analisis mendalam, dan fitur premium dengan berlangganan membership.",
};

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16">
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-20 left-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-blue-600 mix-blend-multiply blur-[120px] filter" />
        <div className="absolute top-40 right-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-indigo-600 mix-blend-multiply blur-[120px] filter delay-700" />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="animate-fade-in-up mb-20 text-center">
          <h1 className="mb-6 text-6xl leading-tight font-black md:text-7xl lg:text-8xl">
            <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
              Premium Membership
            </span>
          </h1>
          <p className="mx-auto max-w-4xl text-xl leading-relaxed font-light text-gray-400 md:text-2xl">
            Tingkatkan pengalaman trading Anda dengan akses ke analisis
            mendalam, strategi eksklusif, dan fitur-fitur premium
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mb-16 grid max-w-6xl gap-8 md:grid-cols-3">
          {/* Free Plan */}
          <div
            className="glass-card animate-fade-in-up rounded-3xl border border-gray-500/30 p-8 transition-all duration-300 hover:border-gray-400/50"
            style={{ animationDelay: "0s" }}
          >
            <div className="mb-8 text-center">
              <h3 className="mb-4 text-3xl font-black text-white">Free</h3>
              <div className="mb-2 text-5xl font-black text-white">Rp 0</div>
              <p className="font-medium text-gray-400">Gratis selamanya</p>
            </div>

            <ul className="mb-10 space-y-4">
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-gray-300">
                  Akses artikel reguler
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-gray-300">
                  Data pasar real-time
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-gray-300">
                  Watchlist dasar (5 aset)
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-gray-300">
                  Newsletter mingguan
                </span>
              </li>
            </ul>

            <Link
              href="/auth/signup"
              className="block w-full rounded-2xl bg-gray-700 px-6 py-4 text-center text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-600"
            >
              Mulai Gratis
            </Link>
          </div>

          {/* Premium Plan - Most Popular */}
          <div
            className="glass-card hover:shadow-3xl animate-fade-in-up relative scale-105 transform rounded-3xl border-4 border-yellow-400 p-8 shadow-2xl shadow-yellow-500/20 transition-all duration-300 hover:shadow-yellow-500/30"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 transform animate-pulse rounded-full bg-linear-to-r from-yellow-400 to-amber-500 px-8 py-2 text-sm font-black text-gray-900 shadow-2xl shadow-yellow-500/50">
              PALING POPULER
            </div>

            <div className="mb-8 pt-2 text-center">
              <h3 className="gradient-text mb-4 text-3xl font-black">
                Premium
              </h3>
              <div className="mb-2 text-5xl font-black text-white">Rp 199K</div>
              <p className="font-medium text-gray-300">Per bulan</p>
            </div>

            <ul className="mb-10 space-y-4">
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-bold text-white">Semua fitur Free</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-white">
                  Analisis teknikal mendalam
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-white">
                  Trading signals eksklusif
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-white">
                  Portfolio tracker unlimited
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-white">
                  Watchlist unlimited
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-white">
                  Newsletter harian
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-white">
                  Akses webinar bulanan
                </span>
              </li>
            </ul>

            <Link
              href="/auth/signup?plan=premium"
              className="block w-full rounded-2xl bg-linear-to-r from-yellow-400 to-amber-500 px-6 py-4 text-center text-lg font-black text-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50"
            >
              Upgrade ke Premium
            </Link>
          </div>

          {/* Pro Plan */}
          <div
            className="glass-card animate-fade-in-up rounded-3xl border border-indigo-500/30 p-8 transition-all duration-300 hover:border-indigo-400/50"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="mb-8 text-center">
              <h3 className="mb-4 text-3xl font-black text-white">Pro</h3>
              <div className="mb-2 text-5xl font-black text-white">Rp 499K</div>
              <p className="font-medium text-gray-400">Per bulan</p>
            </div>

            <ul className="mb-10 space-y-4">
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-6 w-6 shrink-0 text-indigo-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-bold text-white">
                  Semua fitur Premium
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-5 w-5 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  AI-powered recommendations
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-5 w-5 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  API access untuk algo trading
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-5 w-5 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  1-on-1 consultation (2x/bulan)
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-5 w-5 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  Private Discord community
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mt-0.5 mr-3 h-5 w-5 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  Priority support 24/7
                </span>
              </li>
            </ul>

            <Link
              href="/auth/signup?plan=pro"
              className="block w-full rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Upgrade ke Pro
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Mengapa Upgrade ke Premium?
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-4 text-4xl">📊</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                Analisis Mendalam
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dapatkan analisis teknikal dan fundamental yang detail untuk
                setiap aset, membantu Anda membuat keputusan trading yang lebih
                baik.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                Trading Signals
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Terima notifikasi real-time untuk peluang trading terbaik
                berdasarkan strategi yang terbukti menguntungkan.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-4 text-4xl">💼</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                Portfolio Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track performance portfolio Anda dengan tools advanced termasuk
                profit/loss calculator dan risk analyzer.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-4 text-4xl">🎓</div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                Exclusive Education
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Akses ke webinar, workshop, dan kelas trading eksklusif dari
                expert untuk meningkatkan skill trading Anda.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <details className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                Apakah saya bisa cancel kapan saja?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Ya, Anda bisa cancel subscription kapan saja tanpa penalty.
                Premium access akan tetap aktif hingga akhir periode billing.
              </p>
            </details>

            <details className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                Metode pembayaran apa yang diterima?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Kami menerima berbagai metode pembayaran termasuk kartu
                kredit/debit, transfer bank, e-wallet (GoPay, OVO, Dana), dan
                cryptocurrency.
              </p>
            </details>

            <details className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                Apakah ada garansi uang kembali?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Ya, kami memberikan 14 hari money-back guarantee. Jika tidak
                puas, hubungi support untuk full refund.
              </p>
            </details>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Masih ada pertanyaan?
          </p>
          <Link
            href="mailto:support@berita-finansial.com"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Hubungi Tim Support →
          </Link>
        </div>
      </div>
    </div>
  );
}
