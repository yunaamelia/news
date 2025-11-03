import Link from "next/link";
import {
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiTrendingUp,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <FiTrendingUp className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">
                Berita<span className="text-blue-500">Finansial</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Platform berita dan data finansial terpercaya untuk investor dan
              trader Indonesia.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@beritafinansial.id"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kategori</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/saham" className="hover:text-blue-400 transition">
                  Berita Saham
                </Link>
              </li>
              <li>
                <Link href="/kripto" className="hover:text-blue-400 transition">
                  Berita Kripto
                </Link>
              </li>
              <li>
                <Link
                  href="/analisis"
                  className="hover:text-blue-400 transition"
                >
                  Analisis Pasar
                </Link>
              </li>
              <li>
                <Link
                  href="/edukasi"
                  className="hover:text-blue-400 transition"
                >
                  Edukasi
                </Link>
              </li>
              <li>
                <Link
                  href="/regulasi"
                  className="hover:text-blue-400 transition"
                >
                  Regulasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Fitur */}
          <div>
            <h3 className="text-white font-semibold mb-4">Fitur</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/watchlist"
                  className="hover:text-blue-400 transition"
                >
                  Watchlist
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="hover:text-blue-400 transition"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/market" className="hover:text-blue-400 transition">
                  Data Pasar
                </Link>
              </li>
              <li>
                <Link
                  href="/premium"
                  className="hover:text-blue-400 transition"
                >
                  Premium
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-blue-400 transition">
                  API Dokumentasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h3 className="text-white font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tentang"
                  className="hover:text-blue-400 transition"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-blue-400 transition">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/karir" className="hover:text-blue-400 transition">
                  Karir
                </Link>
              </li>
              <li>
                <Link
                  href="/kebijakan-privasi"
                  className="hover:text-blue-400 transition"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/syarat-ketentuan"
                  className="hover:text-blue-400 transition"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
            <p className="text-xs text-yellow-300">
              <strong>Disclaimer:</strong> Informasi yang tersedia di platform
              ini hanya untuk tujuan edukasi dan informasi. Bukan merupakan
              nasihat investasi atau rekomendasi untuk membeli/menjual aset
              finansial. Segala keputusan investasi adalah tanggung jawab
              masing-masing individu. Selalu lakukan riset sendiri (DYOR) dan
              konsultasikan dengan penasihat keuangan profesional sebelum
              melakukan investasi.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} Berita Finansial Indonesia. All
              rights reserved.
            </p>
            <p className="mt-2 md:mt-0">
              Made with ❤️ for Indonesian investors
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
