# 🚀 Quick Start Guide - Berita Finansial

Panduan lengkap untuk menjalankan project Berita Finansial di local development.

## 📋 Prerequisites

Pastikan sistem Anda sudah memiliki:

- **Node.js** 18.x atau lebih tinggi ([Download](https://nodejs.org/))
- **PostgreSQL** 14.x atau lebih tinggi ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **npm** atau **yarn** (termasuk dalam Node.js)

## 🛠️ Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/berita-finansial.git
cd berita-finansial
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

#### Membuat Database PostgreSQL

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database baru
CREATE DATABASE berita_finansial;

# Keluar dari PostgreSQL
\q
```

### 4. Setup Environment Variables

```bash
# Copy file .env.example menjadi .env.local
cp .env.example .env.local
```

Edit file `.env.local` dan isi dengan konfigurasi Anda:

```env
# Database (sesuaikan username dan password)
DATABASE_URL="postgresql://postgres:password@localhost:5432/berita_finansial?schema=public"

# NextAuth (generate secret dengan: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Google OAuth (optional, dapatkan di Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# API Keys (daftar gratis di website masing-masing)
ALPHA_VANTAGE_API_KEY="demo"
COINGECKO_API_KEY=""

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Berita Finansial Indonesia"
```

### 5. Setup Prisma & Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# (Optional) Seed database dengan data contoh
npx prisma db seed
```

### 6. Run Development Server

```bash
npm run dev
```

Buka browser dan akses [http://localhost:3000](http://localhost:3000)

## 🔑 Getting API Keys

### Alpha Vantage (Stock Data)

1. Kunjungi [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. Daftar gratis untuk mendapatkan API key
3. Copy API key ke `.env.local`

### CoinGecko (Crypto Data)

1. Kunjungi [https://www.coingecko.com/en/api](https://www.coingecko.com/en/api)
2. Daftar untuk API key (optional, bisa menggunakan public API)
3. Copy API key ke `.env.local`

### Google OAuth (Optional)

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru
3. Enable Google+ API
4. Buat OAuth 2.0 credentials
5. Tambahkan authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID dan Client Secret ke `.env.local`

## 🗄️ Database Management

### Prisma Studio (GUI untuk Database)

```bash
npx prisma studio
```

Akan membuka GUI di [http://localhost:5555](http://localhost:5555)

### Reset Database

```bash
npx prisma migrate reset
npx prisma db push
```

### Generate New Migration

```bash
npx prisma migrate dev --name your_migration_name
```

## 🔧 Common Issues & Solutions

### Error: Connection refused (PostgreSQL)

**Solusi:**

```bash
# Cek status PostgreSQL
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start

# Atau di macOS dengan Homebrew
brew services start postgresql
```

### Error: Prisma Client tidak ditemukan

**Solusi:**

```bash
npx prisma generate
```

### Error: Port 3000 sudah digunakan

**Solusi:**

```bash
# Gunakan port lain
npm run dev -- -p 3001
```

### Error: Cannot find module

**Solusi:**

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema to database
npx prisma migrate dev  # Create and run migrations

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
```

## 🎨 Project Structure

```
berita-finansial/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── components/        # React Components
│   ├── lib/              # Utility functions
│   ├── types/            # TypeScript types
│   └── (pages)/          # Page files
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── .env.local            # Environment variables (create this)
└── package.json          # Dependencies
```

## 🚀 Next Steps

Setelah instalasi berhasil:

1. **Pelajari struktur project** - Lihat file-file di folder `app/`
2. **Tambah artikel dummy** - Gunakan Prisma Studio atau API
3. **Kustomisasi tampilan** - Edit components di `app/components/`
4. **Setup API keys** - Dapatkan data real-time dari Alpha Vantage & CoinGecko
5. **Explore fitur** - Coba semua fitur yang tersedia

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Need Help?

- Check [README.md](README.md) untuk dokumentasi lengkap
- Buka issue di GitHub repository
- Email: info@beritafinansial.id

## ✅ Checklist

- [ ] Node.js installed
- [ ] PostgreSQL installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` configured
- [ ] Database setup (`npx prisma db push`)
- [ ] Development server running (`npm run dev`)
- [ ] Can access http://localhost:3000

Selamat coding! 🎉
