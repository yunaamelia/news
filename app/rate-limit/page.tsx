import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "429 - Terlalu Banyak Permintaan",
  description: "Anda telah mencapai batas rate limit",
};

export default function RateLimitError() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6">
          <h1 className="mb-2 text-6xl font-bold text-gray-900 dark:text-white">
            429
          </h1>
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Terlalu Banyak Permintaan
          </p>
        </div>

        <div className="mb-8 rounded-lg bg-amber-50 p-6 dark:bg-amber-900/20">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Anda telah mencapai batas maksimal permintaan. Silakan tunggu
            beberapa saat sebelum mencoba lagi.
          </p>

          <div className="space-y-2 text-left text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>💡 Tips:</strong>
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Tunggu beberapa menit sebelum mencoba kembali</li>
              <li>Login untuk mendapatkan limit yang lebih tinggi</li>
              <li>
                Upgrade ke akun Premium untuk akses unlimited (segera hadir)
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Kembali ke Beranda
          </Link>

          <Link
            href="/auth/signin"
            className="inline-block w-full rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Login untuk Limit Lebih Tinggi
          </Link>
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Rate Limits:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <li>
              🔓 <strong>Tanpa Login:</strong> 10 req/menit
            </li>
            <li>
              👤 <strong>User Gratis:</strong> 60 req/menit
            </li>
            <li>
              ⭐ <strong>User Premium:</strong> 300 req/menit
            </li>
            <li>
              🔒 <strong>Write Operations:</strong> 20 req/jam
            </li>
            <li>
              💬 <strong>Komentar:</strong> 10 req/jam
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
