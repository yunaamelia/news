# 🚀 Supabase Database Setup Guide

## 📋 Overview

Project ini menggunakan **Supabase Postgres** sebagai production database dengan best practices:

- ✅ **Connection Pooling**: Supavisor (PgBouncer) untuk pooled connections
- ✅ **Prisma ORM**: Type-safe database queries
- ✅ **Auto-detection**: Prisma client otomatis detect pooled vs direct connection
- ✅ **Serverless-optimized**: Neon adapter untuk edge functions
- ✅ **Production-ready**: Enterprise-grade reliability

---

## 🎯 Step-by-Step Setup

### Step 1: Create Supabase Project

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/projects
   ```

2. **Click "New Project"**

3. **Configure Project:**
   - **Name**: `berita-finansial` atau nama lain
   - **Database Password**: Simpan password ini (akan digunakan di connection string)
   - **Region**: **Singapore (Southeast Asia)** atau region terdekat
   - **Pricing Plan**: Start dengan **Free** tier (500MB database, 500MB storage)

4. **Click "Create new project"**
   - Wait 2-3 menit untuk database provisioning

---

### Step 2: Get Connection Strings

1. **Di Supabase Dashboard, go to:**
   ```
   Settings → Database → Connection string
   ```

2. **Copy Connection Strings:**

   **A. Transaction Mode (Pooled - untuk queries):**
   ```
   Format: postgres://postgres.PROJECT_REF:[YOUR-PASSWORD]@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

   **B. Session Mode (Direct - untuk migrations):**
   ```
   Format: postgres://postgres.PROJECT_REF:[YOUR-PASSWORD]@aws-0-REGION.pooler.supabase.com:5432/postgres
   ```

3. **Replace `[YOUR-PASSWORD]`** dengan database password yang dibuat di Step 1

---

### Step 3: Update Environment Variables

1. **Edit `.env.local` file:**

```bash
# Supabase Database Connection
# Transaction Mode (Pooled) - digunakan untuk queries
POSTGRES_PRISMA_URL="postgres://postgres.YOUR-PROJECT-REF:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Session Mode (Direct) - digunakan untuk migrations
POSTGRES_URL_NON_POOLING="postgres://postgres.YOUR-PROJECT-REF:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Fallback untuk Prisma CLI (opsional, bisa sama dengan POSTGRES_URL_NON_POOLING)
DATABASE_URL="postgres://postgres.YOUR-PROJECT-REF:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase API (untuk auth & realtime - opsional untuk sekarang)
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
# SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" # Untuk server-side admin operations
```

2. **Get Supabase API Keys:**
   - Go to: `Settings → API`
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

### Step 4: Test Connection

```bash
# 1. Test database connection
npm run test:db

# Expected output:
# ✅ Test 1: Raw SQL query - PASSED
# ✅ Test 2: Count users - 0 users found
# ✅ Test 3: Count articles - 0 articles found
# ✅ Test 4: Database info - PostgreSQL 15.x
```

---

### Step 5: Run Migrations

```bash
# Apply database schema ke Supabase
npm run db:migrate

# Prisma akan:
# 1. Create migration files di prisma/migrations/
# 2. Apply schema ke Supabase database
# 3. Generate Prisma Client
```

---

### Step 6: Verify Database

1. **Check di Supabase Dashboard:**
   ```
   Table Editor → View Tables
   ```

2. **Expected tables:**
   - User
   - Account
   - Session
   - VerificationToken
   - Article
   - Comment
   - Watchlist
   - Portfolio
   - Newsletter
   - MarketDataCache

---

## 🔧 Technical Details

### Connection Strategy

**Prisma Schema (`prisma/schema.prisma`):**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")      // Pooled (Transaction Mode)
  directUrl = env("POSTGRES_URL_NON_POOLING") // Direct (Session Mode)
}
```

**Prisma Client (`app/lib/prisma.ts`):**
- ✅ Auto-detects Supabase pooler (checks for `pooler` or `pgbouncer=true` in URL)
- ✅ Uses Neon adapter untuk pooled connections
- ✅ Falls back to standard PrismaClient untuk direct connections
- ✅ Singleton pattern untuk prevent multiple instances

### Connection Modes

| Mode | Port | Use Case | Environment Variable |
|------|------|----------|---------------------|
| **Transaction (Pooled)** | 6543 | Queries, serverless functions | `POSTGRES_PRISMA_URL` |
| **Session (Direct)** | 5432 | Migrations, long transactions | `POSTGRES_URL_NON_POOLING` |

### Why Supabase?

1. **Built-in Pooling**: Supavisor (PgBouncer) included
2. **Free Tier**: 500MB database, 500MB file storage, 2GB bandwidth
3. **Auto Backups**: Daily backups untuk Postgres database
4. **PostgreSQL 15**: Latest features & performance
5. **Real-time**: Built-in realtime subscriptions (opsional)
6. **Auth**: Built-in authentication system (opsional)
7. **Storage**: Built-in file storage (untuk images, etc)

---

## 🌐 Deploy to Vercel

### Option 1: Vercel Environment Variables (Recommended)

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/yunas-projects-41aee3c2/berita-finansial/settings/environment-variables
   ```

2. **Add Environment Variables:**
   - `POSTGRES_PRISMA_URL` → [Transaction Mode connection string]
   - `POSTGRES_URL_NON_POOLING` → [Session Mode connection string]
   - `DATABASE_URL` → [Same as POSTGRES_URL_NON_POOLING]
   - `NEXT_PUBLIC_SUPABASE_URL` → [Project URL]
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → [Anon key]

3. **Set Environment:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Redeploy:**
   ```bash
   git push
   # Vercel akan auto-deploy dengan env vars baru
   ```

### Option 2: Vercel CLI

```bash
# Set environment variables via CLI
vercel env add POSTGRES_PRISMA_URL production
vercel env add POSTGRES_URL_NON_POOLING production
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Pull to local
vercel env pull .env.local
```

---

## 🔒 Security Best Practices

### Environment Variables

- ✅ **NEVER commit** `.env.local` ke git
- ✅ **Use `.env.example`** untuk template
- ✅ **Service Role Key** hanya untuk server-side (never expose to client)
- ✅ **Anon Key** aman untuk client-side (protected by Row Level Security)

### Row Level Security (RLS)

Supabase menggunakan Postgres RLS untuk security. Example:

```sql
-- Enable RLS on Article table
ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Public articles are viewable by everyone"
ON "Article" FOR SELECT
USING (status = 'PUBLISHED');

-- Policy: Only admins can insert articles
CREATE POLICY "Admins can insert articles"
ON "Article" FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);
```

**Note:** RLS policies opsional - bisa diatur nanti sesuai kebutuhan.

---

## 🎯 Common Commands

```bash
# Test database connection
npm run test:db

# Generate Prisma Client (after schema changes)
npm run db:generate

# Create & apply migration
npm run db:migrate

# Reset database (DANGER - development only!)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Check migration status
npx prisma migrate status

# Seed database (if seed script exists)
npx prisma db seed
```

---

## 📊 Supabase Dashboard Features

### Database
- **Table Editor**: GUI untuk view/edit data
- **SQL Editor**: Run custom SQL queries
- **Extensions**: Enable Postgres extensions (pg_cron, pgvector, etc)

### Auth (Optional - untuk nanti)
- Email/Password authentication
- OAuth providers (Google, GitHub, etc)
- Magic link authentication
- JWT tokens

### Storage (Optional - untuk images)
- File upload API
- Image transformations
- CDN delivery
- Access control

### Realtime (Optional - untuk live updates)
- Database changes subscriptions
- Presence (online users)
- Broadcast (pub/sub)

---

## ❓ Troubleshooting

### Connection Error

```bash
Error: Can't reach database server
```

**Solutions:**
1. Check connection string format (pastikan replace `[YOUR-PASSWORD]`)
2. Verify database password correct
3. Check Supabase project status (Dashboard → Settings)
4. Try direct connection (Session Mode) instead of pooled

### Migration Error

```bash
Error: Direct connection string required for migrations
```

**Solution:**
Pastikan `POSTGRES_URL_NON_POOLING` atau `DATABASE_URL` set (port 5432, bukan 6543)

### SSL/TLS Error

```bash
Error: SSL certificate verification failed
```

**Solution:**
Add `?sslmode=require` to connection string:
```
postgres://...?sslmode=require
```

### IPv4 Error

```bash
Error: getaddrinfo ENOTFOUND
```

**Solution:**
Supabase Pooler supports IPv4 by default. If issue persists:
1. Check internet connection
2. Try direct connection instead of pooler
3. Check Supabase status page

---

## 🚀 Next Steps

After database setup:

1. ✅ **Seed Data**: Create initial articles, users
2. ✅ **Setup Auth**: Configure NextAuth with Supabase
3. ✅ **File Storage**: Setup Supabase Storage untuk images
4. ✅ **Realtime**: Enable realtime untuk comments (opsional)
5. ✅ **Backups**: Configure backup schedule
6. ✅ **Monitoring**: Setup error tracking (Sentry)

---

## 📚 Resources

- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase + Prisma**: https://supabase.com/docs/guides/integrations/prisma
- **Connection Pooling**: https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
- **Supabase CLI**: https://supabase.com/docs/guides/cli

---

## 💡 Tips

1. **Use Transaction Mode** (port 6543) untuk semua queries - lebih cepat & efficient
2. **Use Session Mode** (port 5432) hanya untuk migrations & long-running transactions
3. **Enable pgbouncer=true** parameter untuk optimal pooling
4. **Monitor usage** di Supabase Dashboard → Settings → Usage
5. **Upgrade plan** jika hit limits (Free: 500MB database, Pro: 8GB+)
6. **Use connection_limit=1** parameter untuk serverless environments
7. **Enable extensions** as needed: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

---

**🎉 Database setup complete! Ready untuk development & production deployment.**
