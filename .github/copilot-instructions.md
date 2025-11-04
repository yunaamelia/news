# Berita Finansial – AI Agent Guidelines

Indonesian financial news platform. User-facing content in **Bahasa Indonesia**, code/comments in English.

## Core Architecture

**Stack:** Next.js 16 (App Router) + React 19 + Prisma 6 + PostgreSQL (Neon) + NextAuth + Tailwind v4  
**Key Config:** React Compiler enabled (`next.config.ts` → `reactCompiler: true`)

### Data Flow Pattern

```
Client Request → API Route → Prisma Singleton → PostgreSQL (Neon)
                          ↓
                  Redis Cache (Layer 1, 300s TTL)
                          ↓
                  DB Cache (Layer 2, MarketDataCache model, 5min TTL)
```

**Critical Files:**

- `app/lib/auth.ts` - Centralized NextAuth config (always import `authOptions` from here)
- `app/lib/prisma.ts` - Singleton Prisma client with Neon adapter
- `app/lib/market-data.ts` - 2-tier caching (Redis → DB → API)
- `prisma/schema.prisma` - 20+ optimized indexes for query performance

## Mandatory Pre-Push Validation

```bash
npm run lint && npx tsc --noEmit && npm run build
```

**All 3 must pass.** Report: "✅ Lint, ✅ TypeScript, ✅ Build, ✅ Push (commit abc123)"

## API Route Patterns

### User-Specific Data (Watchlist, Portfolio, Bookmarks)

```typescript
export const dynamic = "force-dynamic"; // Disable caching
const session = await getServerSession(authOptions);
if (!session)
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

### Public Data (Articles, Market Data)

Use ISR with on-demand revalidation:

```typescript
// Server Component
export const revalidate = 300; // 5 minutes

// After mutation (POST/PUT/DELETE)
revalidateTag("articles", "max"); // Stale-while-revalidate
revalidatePath("/artikel");
```

### Pagination Convention

```typescript
?page=1&limit=10 → skip = (page - 1) * limit
return { data, pagination: { page, limit, total, totalPages } }
```

### Prisma Filters (Conditional Spreads)

```typescript
const where: Prisma.ArticleWhereInput = {
  status: "PUBLISHED",
  ...(category && { category }), // Only if category exists
  ...(search && { OR: [{ title: { contains: search } }] }),
};
```

## Market Data Caching

**ALWAYS check cache before API calls:**

1. Redis (fastest, 300s TTL) → `getCacheKey.stockPrices([symbol])`
2. DB cache (`MarketDataCache` model, 5min TTL) → unique key: `{ symbol, assetType }`
3. External API (fallback to mock on error)

**Stock Data:** Yahoo Finance via `app/lib/api/stock-data.ts` (IDX suffix: `.JK`)  
**Crypto Data:** CoinGecko via `app/lib/market-data.ts` (IDR or USD×15000)

## Prisma Schema Rules

**Use enums, not strings:**

- `AssetType.SAHAM` | `AssetType.KRIPTO`
- `ArticleCategory.SAHAM` | `.KRIPTO` | `.ANALISIS` | `.EDUKASI` | `.REGULASI` | `.TEKNOLOGI`
- `ArticleStatus.DRAFT` | `.PUBLISHED` | `.ARCHIVED`

**After schema changes:**

```bash
prisma generate  # Auto-runs in build/postinstall
prisma db push   # Development
prisma migrate dev --name <name>  # Production migrations
```

## Testing Strategy (Vitest)

**Current:** 168 tests passing (100%), target 80% coverage

```bash
npm test              # Run all tests
npm run test:ui       # Vitest UI
npm run test:coverage # Coverage report
```

**Test patterns:**

- Unit: `__tests__/lib/**/*.test.ts` (market-hours, stock-data, utils)
- Components: `__tests__/components/**/*.test.tsx` (Button, Card, etc.)
- Path alias: `@/` → `./app/`, `@/lib` → `./app/lib/`

## Common Gotchas

1. **Circular Imports:** Always import `authOptions` from `app/lib/auth.ts`, never from route handlers
2. **Missing `force-dynamic`:** User-specific routes without this serve stale cached data
3. **Enum Case Sensitivity:** Use `ArticleCategory.SAHAM`, not `"saham"` or `"Saham"`
4. **Direct API Calls:** Always use cache layers (`getMarketData`, `getCryptoData`), never call CoinGecko/Yahoo directly
5. **Next.js 15+ Params:** Use `const { slug } = await params;` (params are async promises)
6. **Prisma Instantiation:** Never create new `PrismaClient()` in routes, always import singleton from `app/lib/prisma.ts`

## Project Structure

```
app/
├── lib/            # Core utilities (auth, prisma, market-data, redis, validators)
├── api/            # API routes (articles, watchlist, portfolio, market)
├── components/     # React components (articles, market, layout, ui)
├── types/          # TypeScript types
├── (auth routes)   # /auth/signin, /auth/signup
└── (content)       # /artikel, /saham, /kripto, /analisis, etc.

prisma/
├── schema.prisma   # Database schema (20+ optimized indexes)
└── seed.ts         # Database seeding (tsx prisma/seed.ts)

.dev-tools/         # Development-only tools (excluded from Git)
└── whatsapp-notifier/  # WhatsApp notification system
```

## Key Commands

```bash
# Development
npm run dev             # Turbopack dev server
npm run build           # Production build (auto-runs prisma generate)
npm run lint            # ESLint

# Database
npx prisma studio       # Visual database editor
npx prisma db push      # Sync schema (dev)
npx prisma migrate dev  # Create migration (prod)
npx prisma db seed      # Seed database

# Testing
npm test                # Vitest
npm run test:coverage   # Coverage report
```

## Environment Variables

**Required:**

- `POSTGRES_PRISMA_URL` (pooled, for queries)
- `POSTGRES_URL_NON_POOLING` (direct, for migrations)
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (Redis cache)

**Optional:**

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (OAuth)

## Priority System (DEV_ROADMAP.md)

5-level system: **P5 Critical** (1-3 days) → **P4 High** (1-2 weeks) → **P3 Medium** (2-4 weeks) → **P2 Low** (1-3 months) → **P1 Minimal** (3-6+ months)

**Current Focus:** P4 High (Phase 9: API Rate Limiting, Phase 6: Price Alerts)

**Reference Implementations:**

- API patterns: `app/api/articles/route.ts`
- Auth patterns: `app/lib/auth.ts`
- Caching: `app/lib/market-data.ts`, `app/lib/redis.ts`
- Testing: `__tests__/lib/market-hours.test.ts`

---

## AI Agent Memory Protocol

**Auto-Sync Location:** `.github/memory/`

**After completing ANY feature, ALWAYS:**

1. ✅ Update `.github/memory/session-progress.md` (current state)
2. ✅ Update `.github/copilot-instructions.md` (if patterns changed)
3. ✅ Commit both with descriptive message
4. ✅ Report sync status to user

**Memory Files:**

- `session-progress.md` - Latest session, completed work, next priorities
- `README.md` - Memory sync protocol documentation

**Read on session start:** `.github/memory/session-progress.md` for current state
