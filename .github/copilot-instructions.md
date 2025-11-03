## Berita Finansial – Panduan Singkat untuk AI Agent

Ringkas, langsung eksekusi, dan gunakan Bahasa Indonesia untuk konten user-facing.

1) Gaya Respons
- Fokus aksi, minim narasi. Tampilkan hanya output/error penting.
- Contoh ringkas: "✅ Update komponen X, ✅ Lulus lint/tsc/build, ✅ Push (commit abc123)".

2) Validasi Wajib sebelum push
- npm run lint → perbaiki semua error
- npx tsc --noEmit → pastikan 0 type error
- npm run build → pastikan sukses build
- Baru git commit && git push. Laporkan ringkas status ketiganya.

3) Arsitektur Inti (lihat `app/` dan `prisma/`)
- Next.js 16 (App Router) + React 19, React Compiler aktif (`next.config.ts` → `reactCompiler: true`).
- Auth terpusat di `app/lib/auth.ts` (NextAuth + Prisma Adapter). Jangan impor `authOptions` dari route handler.
- Prisma 6 singleton di `app/lib/prisma.ts` (adapter Neon bila URL pooled). Jangan instansiasi Prisma per-request.
- Cache pasar: model `MarketDataCache` (TTL 5 menit) + ISR (umumnya 300s) untuk halaman artikel.

4) Pola API & Auth (server routes di `app/api/...`)
- Tambahkan `export const dynamic = "force-dynamic"` untuk data user-spesifik (watchlist/portfolio).
- Proteksi standar:
  `const session = await getServerSession(authOptions); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });`
- Paginasi konvensi: `?page=1&limit=10` → hitung `skip`, dan kembalikan `{ data, pagination }`.
- Filter Prisma gunakan spread kondisional (lihat `app/api/articles/route.ts`).

5) Data Pasar (lihat `app/lib/market-data.ts`)
- Cek DB cache dahulu (kunci komposit: `{ symbol, assetType }`). Jika valid, balikan cache.
- SAHAM: mock data sementara. KRIPTO: CoinGecko; harga IDR bila ada, fallback USD×15000.
- Upsert cache dengan `expiresAt = now + 5 menit`. Sediakan fallback mock saat API gagal.

6) ISR & Next.js 15+
- Kategori/artikel gunakan ISR `revalidate = 300`; user pages = `force-dynamic`.
- Params async (Next 15+): `const { slug } = await params;` pada Server Component.

7) Skema & Enums (lihat `prisma/schema.prisma`)
- Enums: `AssetType { SAHAM|KRIPTO }`, `ArticleCategory {...}`, `ArticleStatus {...}`.
- Gunakan enum, bukan string bebas (contoh: `ArticleCategory.SAHAM`).
- Setelah ubah skema: jalankan `prisma generate` (ada di script build/postinstall).

8) Perintah Penting
- Dev: `npm run dev`
- Prisma: `prisma generate | db push | migrate dev | studio`
- Seed: `prisma db seed` (di-define via `tsx prisma/seed.ts`).

9) ENV Wajib
- `POSTGRES_PRISMA_URL` (pooled) atau `DATABASE_URL`, `POSTGRES_URL_NON_POOLING` (migrasi)
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, opsional Google OAuth: `GOOGLE_CLIENT_ID/SECRET`

10) Gotchas yang sering terjadi
- Circular import: selalu impor `authOptions` dari `app/lib/auth.ts`.
- Lupa `force-dynamic` di route user-spesifik → data stale.
- Menggunakan string enum yang salah casing.
- Langsung call API pasar tanpa cache layer `getMarketData/getCryptoData`.

11) Struktur cepat
- `app/lib/` (auth, prisma, market-data, utils), `app/api/` (routes), `app/components/` (UI), `prisma/` (schema, seed).

Jika butuh detail lebih, rujuk contoh konkret di:
- `app/api/articles/route.ts`, `app/lib/market-data.ts`, `app/lib/auth.ts`, `app/lib/prisma.ts`.
