import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Premium Membership - Berita Finansial",
  description: "Akses konten eksklusif, analisis mendalam, dan fitur premium dengan berlangganan membership.",
};

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Premium Membership
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tingkatkan pengalaman trading Anda dengan akses ke analisis mendalam,
            strategi eksklusif, dan fitur-fitur premium
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Free
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Rp 0
              </div>
              <p className="text-gray-600 dark:text-gray-400">Gratis selamanya</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Akses artikel reguler</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Data pasar real-time</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Watchlist dasar (5 aset)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Newsletter mingguan</span>
              </li>
            </ul>

            <Link
              href="/auth/signup"
              className="block w-full text-center py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Mulai Gratis
            </Link>
          </div>

          {/* Premium Plan - Most Popular */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 border-4 border-yellow-400 relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
              PALING POPULER
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="text-4xl font-bold text-white mb-2">
                Rp 199K
              </div>
              <p className="text-blue-100">Per bulan</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-white font-semibold">Semua fitur Free</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-white">Analisis teknikal mendalam</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-white">Trading signals eksklusif</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-white">Portfolio tracker unlimited</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-white">Watchlist unlimited</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-white">Newsletter harian</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-white">Akses webinar bulanan</span>
              </li>
            </ul>

            <Link
              href="/auth/signup?plan=premium"
              className="block w-full text-center py-3 px-6 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
            >
              Upgrade ke Premium
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-indigo-500">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Pro
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Rp 499K
              </div>
              <p className="text-gray-600 dark:text-gray-400">Per bulan</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-900 dark:text-white font-semibold">Semua fitur Premium</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">AI-powered recommendations</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">API access untuk algo trading</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">1-on-1 consultation (2x/bulan)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Private Discord community</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Priority support 24/7</span>
              </li>
            </ul>

            <Link
              href="/auth/signup?plan=pro"
              className="block w-full text-center py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Upgrade ke Pro
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Mengapa Upgrade ke Premium?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Analisis Mendalam
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dapatkan analisis teknikal dan fundamental yang detail untuk setiap aset,
                membantu Anda membuat keputusan trading yang lebih baik.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Trading Signals
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Terima notifikasi real-time untuk peluang trading terbaik berdasarkan
                strategi yang terbukti menguntungkan.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Portfolio Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track performance portfolio Anda dengan tools advanced termasuk
                profit/loss calculator dan risk analyzer.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Exclusive Education
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Akses ke webinar, workshop, dan kelas trading eksklusif dari expert
                untuk meningkatkan skill trading Anda.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                Apakah saya bisa cancel kapan saja?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Ya, Anda bisa cancel subscription kapan saja tanpa penalty. Premium access
                akan tetap aktif hingga akhir periode billing.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                Metode pembayaran apa yang diterima?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Kami menerima berbagai metode pembayaran termasuk kartu kredit/debit,
                transfer bank, e-wallet (GoPay, OVO, Dana), dan cryptocurrency.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                Apakah ada garansi uang kembali?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Ya, kami memberikan 14 hari money-back guarantee. Jika tidak puas,
                hubungi support untuk full refund.
              </p>
            </details>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Masih ada pertanyaan?
          </p>
          <Link
            href="mailto:support@berita-finansial.com"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Hubungi Tim Support →
          </Link>
        </div>
      </div>
    </div>
  );
}
