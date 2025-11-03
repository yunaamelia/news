# Database Setup Guide - Vercel Postgres

Complete guide untuk setup production database dengan **Vercel Postgres** + **Prisma ORM**.

## 🎯 Mengapa Vercel Postgres?

Berdasarkan best practices dari Context7 documentation:

✅ **Built-in Connection Pooling** via PgBouncer  
✅ **Automatic Environment Variables** injection  
✅ **Serverless-Optimized** dengan Prisma adapter  
✅ **Zero-Config** deployment via Vercel integration  
✅ **Regional Deployment** untuk low latency  

## 📋 Prerequisites

- Vercel account (sudah ada)
- Project deployed ke Vercel (sudah ada)
- Vercel CLI installed: `npm i -g vercel`

---

## 🚀 Step 1: Install Dependencies

```bash
# Install Prisma adapter for Vercel Postgres (uses Neon under the hood)
npm install @prisma/adapter-neon

# Install Neon serverless driver
npm install @neondatabase/serverless

# Install WebSocket polyfill for Node.js environment (if needed)
npm install ws
```

**Why these packages?**
- `@prisma/adapter-neon`: Prisma adapter for Vercel Postgres/Neon
- `@neondatabase/serverless`: Serverless driver for connection pooling
- `ws`: WebSocket support for Node.js runtime

---

## 🗄️ Step 2: Create Vercel Postgres Database

### Option A: Via Vercel Dashboard (Recommended)

1. Go to **Vercel Dashboard** → Your Project
2. Click **Storage** tab
3. Click **Create Database**
4. Select **Postgres (Powered by Neon)**
5. Choose database name: `berita-finansial-db`
6. Select region: `Singapore (sin1)` atau terdekat dengan target user
7. Click **Create**

**Environment variables akan otomatis ter-inject:**
```bash
POSTGRES_URL="postgres://username:password@host.region.neon.tech:5432/database?sslmode=require"
POSTGRES_PRISMA_URL="postgres://username:password@host-pooler.region.neon.tech:5432/database?sslmode=require&pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://username:password@host.region.neon.tech:5432/database?sslmode=require"
POSTGRES_USER="username"
POSTGRES_HOST="host.region.neon.tech"
POSTGRES_PASSWORD="password"
POSTGRES_DATABASE="database"
```

### Option B: Via Vercel CLI

```bash
# Link project jika belum
vercel link

# Create database
vercel storage create postgres berita-finansial-db --region sin1
```

---

## 🔧 Step 3: Update Local Environment Variables

Copy environment variables dari Vercel dashboard ke `.env.local`:

```bash
# Go to Vercel Dashboard → Project → Settings → Environment Variables
# Copy semua POSTGRES_* variables

# Atau via CLI:
vercel env pull .env.local
```

Update `.env.local`:

```bash
# Vercel Postgres (Pooled connection for queries)
POSTGRES_PRISMA_URL="postgres://username:password@host-pooler.region.neon.tech:5432/database?sslmode=require&pgbouncer=true&connect_timeout=15"

# Vercel Postgres (Direct connection for migrations)
POSTGRES_URL_NON_POOLING="postgres://username:password@host.region.neon.tech:5432/database?sslmode=require"

# Keep other variables...
```

**⚠️ Important:**
- `POSTGRES_PRISMA_URL`: Pooled connection (port 5432 dengan `pgbouncer=true`)
- `POSTGRES_URL_NON_POOLING`: Direct connection untuk migrations

---

## 🔄 Step 4: Update Prisma Client Instantiation

Create file `lib/prisma.ts` untuk serverless-optimized Prisma client:

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

// Prevent multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    // Use pooled connection for serverless
    const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL })
    const adapter = new PrismaNeon(pool)
    
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  })()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

**Key Benefits:**
- ✅ Connection pooling via Neon adapter
- ✅ Singleton pattern prevents multiple instances
- ✅ No Rust engine binaries (smaller bundle)
- ✅ Optimized for serverless/edge functions

---

## 📦 Step 5: Generate Prisma Client

```bash
# Generate Prisma client with new adapter
npx prisma generate

# Should see output:
# ✔ Generated Prisma Client (v5.x.x) to ./node_modules/@prisma/client
```

---

## 🚀 Step 6: Run Database Migrations

### Development Migration

```bash
# Create and apply migration
npx prisma migrate dev --name init

# This will:
# 1. Create migration files in prisma/migrations/
# 2. Apply migration to POSTGRES_URL_NON_POOLING
# 3. Generate Prisma Client
```

### Production Deployment

```bash
# Deploy migrations (uses POSTGRES_URL_NON_POOLING)
npx prisma migrate deploy

# Or add to package.json scripts:
# "vercel-build": "prisma generate && prisma migrate deploy && next build"
```

**Update `package.json`:**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "prisma generate && next build",
    "vercel-build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

**Why `vercel-build`?**
- Runs migrations before build on Vercel
- Ensures database schema is up-to-date
- Uses direct (non-pooled) connection for migrations

---

## ✅ Step 7: Verify Database Connection

Create `scripts/test-db-connection.ts`:

```typescript
import { prisma } from '../app/lib/prisma'

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...')
    
    // Test query
    const result = await prisma.$queryRaw`SELECT 1 as connected`
    console.log('✅ Database connected:', result)
    
    // Test model query
    const userCount = await prisma.user.count()
    console.log(`✅ Users in database: ${userCount}`)
    
    // Check connection pool metrics
    const metrics = await prisma.$metrics.json()
    console.log('📊 Connection pool metrics:', {
      activeConnections: metrics.counters.find((c: any) => c.key === 'prisma_client_queries_active')?.value || 0
    })
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
```

Run test:

```bash
# Add to package.json scripts:
# "test:db": "tsx scripts/test-db-connection.ts"

npm install -D tsx
npm run test:db
```

---

## 🔒 Step 8: Setup Environment Variables di Vercel

Environment variables sudah otomatis ter-inject saat create database, tapi pastikan semua ada:

```bash
# Check via CLI
vercel env ls

# Should see:
# POSTGRES_URL
# POSTGRES_PRISMA_URL
# POSTGRES_URL_NON_POOLING
# POSTGRES_USER
# POSTGRES_HOST
# POSTGRES_PASSWORD
# POSTGRES_DATABASE
```

Jika ada yang kurang, tambahkan manual:

```bash
# Add missing variables
vercel env add POSTGRES_PRISMA_URL
# Paste value when prompted
# Select environments: Production, Preview, Development
```

---

## 📊 Step 9: Monitor Database Performance

### Via Vercel Dashboard

1. Go to **Storage** → **berita-finansial-db**
2. Check **Usage** tab:
   - Active connections
   - Query performance
   - Storage usage
   - Connection pool stats

### Via Prisma Studio

```bash
# Open Prisma Studio
npx prisma studio

# Access at: http://localhost:5555
```

### Connection Pool Best Practices

**From Context7 documentation:**

```typescript
// ✅ Good: Reuse single Prisma instance (already done in lib/prisma.ts)
import { prisma } from '@/lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany()
  return Response.json(users)
}

// ❌ Bad: Create new instance per request
export async function GET() {
  const prisma = new PrismaClient() // DON'T DO THIS
  const users = await prisma.user.findMany()
  await prisma.$disconnect()
  return Response.json(users)
}
```

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**Solution:**

```bash
# Increase connection timeout in .env.local
POSTGRES_PRISMA_URL="...?connect_timeout=30"
```

### Error: "Timed out fetching from connection pool"

**Solution:**

```bash
# Add pool_timeout parameter
POSTGRES_PRISMA_URL="...&pool_timeout=30"
```

### Error: "Too many connections"

**Cause:** Using direct connection (`POSTGRES_URL_NON_POOLING`) in application code

**Solution:** Always use `POSTGRES_PRISMA_URL` (pooled) for queries:

```typescript
// ✅ Correct
const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL })

// ❌ Wrong for serverless
const pool = new Pool({ connectionString: process.env.POSTGRES_URL_NON_POOLING })
```

### Error: "Module not found: @prisma/adapter-neon"

**Solution:**

```bash
npm install @prisma/adapter-neon @neondatabase/serverless
npx prisma generate
```

---

## 📈 Performance Tips

### 1. Connection Pooling Configuration

```typescript
// lib/prisma.ts
const pool = new Pool({
  connectionString: process.env.POSTGRES_PRISMA_URL,
  max: 20,                    // Max connections (default: 10)
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Timeout if can't get connection
})
```

### 2. Enable Query Caching (ISR)

```typescript
// app/api/articles/route.ts
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    take: 10,
    orderBy: { publishedAt: 'desc' }
  })
  
  return Response.json(articles)
}
```

### 3. Use Prisma Accelerate (Optional)

For even better performance:

```bash
# Enable Accelerate extension
npm install @prisma/extension-accelerate

# In lib/prisma.ts
import { withAccelerate } from '@prisma/extension-accelerate'
export const prisma = new PrismaClient().$extends(withAccelerate())
```

---

## 🔄 Migration Workflow

### Development

```bash
# 1. Make schema changes in prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_user_bio

# 3. Test locally
npm run dev
```

### Production

```bash
# 1. Push changes to git
git add prisma/
git commit -m "feat: add user bio field"
git push

# 2. Vercel will automatically:
#    - Run prisma generate
#    - Run prisma migrate deploy
#    - Build application
#    - Deploy
```

---

## 📚 Additional Resources

- [Prisma + Vercel Postgres Guide](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-vercel)
- [Neon Serverless Driver](https://neon.tech/docs/serverless/serverless-driver)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Connection Pooling Best Practices](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections)

---

## ✨ Next Steps

1. ✅ Database created & configured
2. ✅ Prisma schema updated for serverless
3. ✅ Migrations applied
4. ⏳ Deploy to Vercel
5. ⏳ Monitor performance
6. ⏳ Setup backups (Vercel provides automatic backups)

**Setelah setup selesai:**
- Database siap untuk production
- Connection pooling aktif
- Optimized untuk serverless
- Auto-scaling enabled
