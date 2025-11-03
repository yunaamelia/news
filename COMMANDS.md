# ⚡ Quick Reference - Berita Finansial

Panduan cepat untuk command-command yang sering digunakan.

## 🚀 Development

```bash
# Start development server
npm run dev

# Start on different port
npm run dev -- -p 3001

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🗄️ Database Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npx prisma db seed

# Pull schema from existing database
npx prisma db pull

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

## 🔐 Generate Secrets

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate random password
openssl rand -hex 16
```

## 📦 Package Management

```bash
# Install all dependencies
npm install

# Install specific package
npm install package-name

# Install as dev dependency
npm install -D package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated

# Clean install (remove node_modules first)
rm -rf node_modules package-lock.json
npm install

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 🐳 Docker Commands

```bash
# Build Docker image
docker build -t berita-finansial .

# Run Docker container
docker run -p 3000:3000 berita-finansial

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  berita-finansial

# Docker Compose
docker-compose up
docker-compose down
docker-compose logs
```

## 🌐 Deployment

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Pull environment variables from Vercel
vercel env pull

# Link to Vercel project
vercel link
```

## 🧹 Cleanup

```bash
# Remove Next.js cache
rm -rf .next

# Remove node_modules
rm -rf node_modules

# Clean install
rm -rf node_modules package-lock.json .next
npm install

# Clear Prisma generated files
rm -rf node_modules/.prisma node_modules/@prisma
npx prisma generate
```

## 🔍 Testing & Debugging

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check for unused dependencies
npx depcheck

# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Run Lighthouse audit
npx lighthouse http://localhost:3000

# Check for security issues
npm audit
```

## 📊 Performance

```bash
# Analyze bundle
ANALYZE=true npm run build

# Check Next.js info
npx next info

# Profile startup time
node --prof node_modules/.bin/next dev

# Memory usage
node --trace-warnings node_modules/.bin/next dev
```

## 🐛 Common Fixes

```bash
# Fix: Module not found
rm -rf node_modules package-lock.json
npm install
npx prisma generate

# Fix: Port already in use
lsof -ti:3000 | xargs kill -9
# Or use different port
npm run dev -- -p 3001

# Fix: Database connection
sudo service postgresql restart

# Fix: Prisma Client not generated
npx prisma generate

# Fix: TypeScript errors
npx tsc --noEmit

# Fix: ESLint errors
npm run lint -- --fix
```

## 🔄 Git Commands

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/username/repo.git
git push -u origin main

# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Pull latest changes
git pull origin main

# Stash changes
git stash
git stash pop

# View status
git status

# View commit history
git log --oneline
```

## 📝 Create New Pages

```bash
# Create new page in app directory
mkdir -p app/new-page
touch app/new-page/page.tsx

# Create API route
mkdir -p app/api/new-route
touch app/api/new-route/route.ts

# Create component
touch app/components/NewComponent.tsx
```

## 🎨 Tailwind

```bash
# Generate full Tailwind config
npx tailwindcss init --full

# Update Tailwind config
# Edit tailwind.config.ts
```

## 📱 PWA

```bash
# Generate PWA icons (using imagemagick)
convert icon.png -resize 192x192 public/icons/icon-192x192.png
convert icon.png -resize 512x512 public/icons/icon-512x512.png

# Test PWA
# 1. Build production
npm run build
npm start

# 2. Open Chrome DevTools > Application > Service Workers
# 3. Check manifest.json
```

## 🔒 Security

```bash
# Check for known vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Force fix (may cause breaking changes)
npm audit fix --force

# Update specific package
npm update package-name

# Check outdated packages
npm outdated
```

## 📊 Monitoring

```bash
# Monitor development server
pm2 start npm --name "berita-finansial" -- run dev

# Monitor logs
pm2 logs berita-finansial

# Monitor status
pm2 status

# Restart
pm2 restart berita-finansial

# Stop
pm2 stop berita-finansial

# Remove from PM2
pm2 delete berita-finansial
```

## 🌍 Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment
nano .env.local
# or
code .env.local

# Check environment variables
npm run dev
# Press 'o' to see configuration
```

## 📚 Documentation

```bash
# Generate TypeDoc documentation
npx typedoc --out docs

# Serve documentation locally
npx http-server docs
```

## 💡 Quick Tips

```bash
# Open project in VS Code
code .

# Open Prisma Studio
npx prisma studio

# Open in browser
open http://localhost:3000

# Check Node version
node -v

# Check npm version
npm -v

# Check PostgreSQL version
psql --version

# List all npm scripts
npm run

# Get help for any command
npx prisma --help
next --help
npm --help
```

## 🚨 Emergency

```bash
# Full reset (⚠️ destructive)
rm -rf node_modules package-lock.json .next
npm install
npx prisma generate
npx prisma db push
npm run dev

# Database only reset
npx prisma migrate reset
npx prisma db push

# Fresh start (keep database)
rm -rf node_modules package-lock.json .next
npm install
npx prisma generate
npm run dev
```

---

## 📞 Need Help?

- Check **SETUP.md** for installation issues
- Check **DEPLOYMENT.md** for deployment issues
- Check **PROJECT_SUMMARY.md** for feature overview
- Open GitHub issue for bugs

---

**Bookmark this page for quick reference!** 🔖
