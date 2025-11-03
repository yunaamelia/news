# Quick Start: Database Setup

## 🚀 5-Minute Setup

### 1. Install Dependencies (if not done)

```bash
npm install @prisma/adapter-neon @neondatabase/serverless ws
```

### 2. Create Vercel Postgres Database

**Via Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your project → **Storage** tab
3. Click **Create Database** → **Postgres**
4. Name: `berita-finansial-db`
5. Region: `Singapore (sin1)` or closest to users
6. Click **Create**

**Via CLI:**
```bash
vercel storage create postgres berita-finansial-db --region sin1
```

### 3. Pull Environment Variables

```bash
# Download env vars from Vercel
vercel env pull .env.local

# Verify POSTGRES_* variables are present
cat .env.local | grep POSTGRES
```

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Run Migrations

**Development:**
```bash
npm run db:migrate
```

**Production (Vercel will do this automatically):**
```bash
npm run db:deploy
```

### 6. Test Connection

```bash
npm run test:db
```

Expected output:
```
✅ Database connected: ...
✅ Users in database: 0
✅ Articles in database: 0
✅ All database tests passed!
```

### 7. Open Prisma Studio (Optional)

```bash
npm run db:studio
```

Access at http://localhost:5555

---

## 📋 Environment Variables Checklist

Required in `.env.local`:

```bash
✅ POSTGRES_PRISMA_URL          # Pooled connection
✅ POSTGRES_URL_NON_POOLING      # Direct connection for migrations
✅ NEXTAUTH_URL                  # Your site URL
✅ NEXTAUTH_SECRET               # Auth secret (keep existing)
✅ GOOGLE_CLIENT_ID              # Keep existing
✅ GOOGLE_CLIENT_SECRET          # Keep existing
```

---

## 🔄 Common Commands

```bash
# Development
npm run dev                  # Start dev server with Turbopack
npm run db:studio           # Open Prisma Studio

# Database
npm run db:generate         # Generate Prisma Client
npm run db:migrate          # Create & apply migration
npm run db:push             # Push schema changes (dev only)
npm run test:db             # Test database connection

# Deployment
npm run build               # Build for production
npm run vercel-build        # Build with migrations (Vercel uses this)
```

---

## ⚡ Troubleshooting

### Error: "Can't reach database server"

```bash
# Check if env vars are set
cat .env.local | grep POSTGRES

# Pull latest from Vercel
vercel env pull .env.local --force
```

### Error: "Module not found: @prisma/adapter-neon"

```bash
# Reinstall dependencies
npm install @prisma/adapter-neon @neondatabase/serverless
npm run db:generate
```

### Error: "Too many connections"

You're using wrong connection string. Check `lib/prisma.ts` uses:
```typescript
const connectionString = process.env.POSTGRES_PRISMA_URL // ✅ Pooled
// NOT process.env.POSTGRES_URL_NON_POOLING             // ❌ Direct
```

---

## 🎯 Next Steps

1. ✅ Database created
2. ✅ Environment variables configured
3. ✅ Prisma Client generated
4. ✅ Migrations applied
5. ⏳ **Deploy to Vercel**: `git push`
6. ⏳ **Seed database**: Create seed script (optional)
7. ⏳ **Setup monitoring**: Check Vercel Storage dashboard

---

## 📚 Full Documentation

For detailed explanation and best practices, see:
- [DATABASE_SETUP.md](.github/DATABASE_SETUP.md)
- [Prisma + Vercel Postgres Guide](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-vercel)
