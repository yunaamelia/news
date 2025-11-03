import Link from "next/link";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiTrendingUp,
  FiTwitter,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-linear-to-b from-[#0a0e27] via-[#121b3a] to-[#0a0e27] text-gray-300">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-600 opacity-20 mix-blend-multiply blur-[128px]" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-purple-600 opacity-20 mix-blend-multiply blur-[128px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="group mb-6 flex items-center space-x-3">
              <div className="bg-gradient-crypto rounded-xl p-2.5 shadow-xl shadow-blue-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-blue-500/50">
                <FiTrendingUp className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                Berita<span className="gradient-text-crypto">Finansial</span>
              </span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Platform berita dan data finansial terpercaya untuk investor dan
              trader Indonesia.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-blue-400 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <FiTwitter className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-400" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-blue-400 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <FiLinkedin className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-400" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-purple-400 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <FiGithub className="h-5 w-5 text-gray-400 transition-colors group-hover:text-purple-400" />
              </a>
              <a
                href="mailto:info@beritafinansial.id"
                className="group rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-cyan-400 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                <FiMail className="h-5 w-5 text-gray-400 transition-colors group-hover:text-cyan-400" />
              </a>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="gradient-text-crypto mb-6 text-lg font-bold">
              Kategori
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/saham"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-blue-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-blue-400" />
                  Berita Saham
                </Link>
              </li>
              <li>
                <Link
                  href="/kripto"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-purple-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-purple-400" />
                  Berita Kripto
                </Link>
              </li>
              <li>
                <Link
                  href="/analisis"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-green-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-green-400" />
                  Analisis Pasar
                </Link>
              </li>
              <li>
                <Link
                  href="/edukasi"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-orange-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-orange-400" />
                  Edukasi
                </Link>
              </li>
              <li>
                <Link
                  href="/regulasi"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-yellow-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-yellow-400" />
                  Regulasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Fitur */}
          <div>
            <h3 className="gradient-text-crypto mb-6 text-lg font-bold">
              Fitur
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/watchlist"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-blue-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-blue-400" />
                  Watchlist
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-purple-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-purple-400" />
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/market"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-green-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-green-400" />
                  Data Pasar
                </Link>
              </li>
              <li>
                <Link
                  href="/premium"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-yellow-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-yellow-400" />
                  Premium
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-cyan-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-cyan-400" />
                  API Dokumentasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h3 className="gradient-text-crypto mb-6 text-lg font-bold">
              Perusahaan
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/tentang"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-blue-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-blue-400" />
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/kontak"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-purple-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-purple-400" />
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/karir"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-green-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-green-400" />
                  Karir
                </Link>
              </li>
              <li>
                <Link
                  href="/kebijakan-privasi"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-orange-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-orange-400" />
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/syarat-ketentuan"
                  className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-yellow-400"
                >
                  <span className="h-1 w-1 rounded-full bg-gray-600 transition-all duration-300 group-hover:w-2 group-hover:bg-yellow-400" />
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 border-t border-white/5 pt-12">
          <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 shadow-xl shadow-yellow-500/10 backdrop-blur-sm">
            <p className="text-xs leading-relaxed text-yellow-200">
              <strong className="font-bold text-yellow-100">
                ⚠️ Disclaimer:
              </strong>{" "}
              Informasi yang tersedia di platform ini hanya untuk tujuan edukasi
              dan informasi. Bukan merupakan nasihat investasi atau rekomendasi
              untuk membeli/menjual aset finansial. Segala keputusan investasi
              adalah tanggung jawab masing-masing individu. Selalu lakukan riset
              sendiri (DYOR) dan konsultasikan dengan penasihat keuangan
              profesional sebelum melakukan investasi.
            </p>
          </div>

          <div className="flex flex-col items-center justify-between text-sm text-gray-500 md:flex-row">
            <p className="font-medium">
              © {new Date().getFullYear()}{" "}
              <span className="gradient-text-crypto font-bold">
                Berita Finansial Indonesia
              </span>
              . All rights reserved.
            </p>
            <p className="mt-4 font-medium md:mt-0">
              Made with <span className="animate-pulse text-red-400">❤️</span>{" "}
              for Indonesian investors
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
