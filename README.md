# 📰 Berita Finansial Indonesia

Platform berita finansial modern untuk pasar saham dan cryptocurrency Indonesia.

## 🚀 Quick Start

```bash
# Setup project
./setup.sh

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

### Setup & Development
- **[SETUP.md](SETUP.md)** - Panduan setup lengkap
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Getting started guide
- **[COMMANDS.md](COMMANDS.md)** - Quick command reference

### Deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[.github/QUICK_START_VERCEL.md](.github/QUICK_START_VERCEL.md)** - ⚡ **Vercel setup (5 menit)**
- **[.github/VERCEL_SETUP.md](.github/VERCEL_SETUP.md)** - Panduan lengkap Vercel
- **[.github/SECRETS_TEMPLATE.md](.github/SECRETS_TEMPLATE.md)** - GitHub secrets template

### Project Info
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview

## 🔐 Setup Vercel Deployment

**Quick setup (5 menit):**

```bash
# Automated setup
./scripts/setup-vercel.sh

# Or manual:
# 1. Get credentials: vercel link
# 2. Set secrets: gh secret set VERCEL_TOKEN
# 3. Test: ./scripts/test-vercel-deployment.sh
```

See: [.github/QUICK_START_VERCEL.md](.github/QUICK_START_VERCEL.md)

## ✨ Features

- 📊 Real-time market data (stocks & crypto)
- 📰 Financial news & analysis
- 💼 Portfolio management
- 👁️ Watchlist tracking
- 🔐 Authentication (NextAuth.js)
- 📱 Responsive design
- ⚡ ISR & performance optimized

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## 🏃 Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start dev server
npm run dev
```

## 🧪 Testing & CI

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build
npm run build

# All checks (pre-push)
npm run lint && npx tsc --noEmit && npm run build
```

## 📦 GitHub Actions Workflows

- ✅ **CI** - Lint, type check, build (on push to main)
- ✅ **Code Review** - Auto code review (on PR)
- 🔧 **Deploy Preview** - Vercel preview (on PR) - *needs secrets*
- 📊 **Performance** - Lighthouse & bundle analysis

## 🌐 Deploy to Vercel

The easiest way to deploy:

1. **Quick setup:**
   ```bash
   ./scripts/setup-vercel.sh
   ```

2. **Configure environment variables** in Vercel dashboard

3. **Create PR** to test preview deployment:
   ```bash
   ./scripts/test-vercel-deployment.sh
   ```

See [DEPLOYMENT.md](DEPLOYMENT.md) for other deployment options (Docker, VPS).

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please read contributing guidelines first.
