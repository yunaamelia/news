# Berita Finansial - AI Agent Instructions

## Architecture Overview

**Indonesian Financial News Platform** - Next.js 16 App Router with PostgreSQL, focused on stocks (saham) & crypto news.

**Critical Stack Decisions:**
- NextAuth + Prisma Adapter for auth (centralized in `app/lib/auth.ts` to prevent circular imports)
- Prisma Client singleton in `app/lib/prisma.ts` with global caching for dev
- Market data cached via `MarketDataCache` model (5min TTL) - check cache before external API calls
- All API routes use `export const dynamic = "force-dynamic"` for real-time data

## Database Schema (10 Models)

**Core relationships:**
- `User` → multiple `Watchlist`, `Portfolio`, `Comment`, `Newsletter`
- `Article` → multiple `Comment` (with nested replies via self-referencing `parentId`)
- `MarketDataCache` has composite unique key: `symbol_assetType`

**Key enums:**
- `AssetType`: `SAHAM` (stocks) | `KRIPTO` (crypto)
- `ArticleCategory`: `SAHAM` | `KRIPTO` | `ANALISIS` | `EDUKASI` | `REGULASI` | `TEKNOLOGI`
- `UserRole`: `USER` | `EDITOR` | `ADMIN`

## Authentication Pattern

**ALWAYS import from centralized config:**
```typescript
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";

const session = await getServerSession(authOptions);
```

**Session structure (JWT strategy):**
```typescript
session.user = { id, email, name, image, role }
```

**Protected routes:** Check `session` existence, handle 401 responses

## API Route Conventions

**Standard structure:**
```typescript
export const dynamic = "force-dynamic"; // Required for fresh data

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  // Query params: req.nextUrl.searchParams.get('param')
  // Body: await req.json()
}
```

**Pagination pattern (used in `/api/articles`):**
- Query params: `page` (default: 1), `limit` (default: 10)
- Response: `{ articles, pagination: { page, limit, total, totalPages } }`

**Filter pattern:** 
- Articles: `?category=SAHAM&search=keyword&premium=true`
- Use Prisma `where` with optional conditions

## Market Data Integration

**Flow:**
1. Check `MarketDataCache` table first (composite key: `symbol + assetType`)
2. If cache expired or missing, fetch from external API
3. Upsert cache with new `expiresAt` (5min from now)
4. Mock data fallback in dev (see `app/lib/market-data.ts`)

**APIs:**
- Stocks: Alpha Vantage (currently mock data for Indonesian stocks)
- Crypto: CoinGecko API (`/api/v3/coins/{coinId}`)

**Helper functions in `market-data.ts`:**
- `getMarketData(symbol, assetType)` - generic fetcher
- `getCryptoData(coinId)` - CoinGecko specific
- `formatIDR(amount)`, `formatNumber(num, decimals)` - Indonesian locale

## Component Patterns

**Dark mode:** Class-based (`dark:bg-gray-900`), toggled via `document.documentElement.classList`

**Indonesian text:** Use Bahasa Indonesia for UI text, error messages in Indonesian

**Common utilities:**
- Type imports from `@/app/types`
- Prisma client from `@/app/lib/prisma`
- NextAuth types augmented in `app/types/index.ts`

## Development Commands

```bash
npx prisma generate          # After schema changes
npx prisma db push          # Sync to database (dev)
npx prisma studio           # GUI for database
npm run dev                 # Start dev server
```

**Required env vars:**
- `DATABASE_URL` (PostgreSQL connection)
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `ALPHA_VANTAGE_API_KEY`, `NEXT_PUBLIC_COINGECKO_API_KEY`

## Key Files

- `app/lib/auth.ts` - NextAuth config (import authOptions from here)
- `app/lib/prisma.ts` - Prisma singleton
- `app/lib/market-data.ts` - Market data fetching & caching logic
- `prisma/schema.prisma` - Source of truth for database structure
- `app/types/index.ts` - NextAuth augmentation + shared types

## Common Pitfalls

❌ **Don't** import authOptions directly from `/api/auth/[...nextauth]/route.ts` (circular dependency)
✅ **Do** import from `@/app/lib/auth`

❌ **Don't** fetch market data without checking cache first
✅ **Do** use `getMarketData()` or `getCryptoData()` helpers

❌ **Don't** forget `export const dynamic = "force-dynamic"` on API routes
✅ **Do** add it for real-time data endpoints

❌ **Don't** use English error messages
✅ **Do** use Indonesian ("Email dan password harus diisi")

## AI Agent Response Guidelines

**Communication Style:**
- **Concise & Direct:** Keep responses short and to the point
- **Action-Focused:** Prioritize doing over explaining
- **No Redundancy:** Avoid repeating information or unnecessary summaries
- **Indonesian Context:** Use Bahasa Indonesia for user-facing content

**Response Format:**
✅ **Do:**
- Execute tasks immediately without lengthy preambles
- Provide brief status updates when running commands
- Use bullet points for multi-step operations
- Show only critical output/errors
- Confirm completion with minimal text (e.g., "✅ Done", "Selesai")

❌ **Don't:**
- Write lengthy explanations before taking action
- Create documentation files unless explicitly requested
- Repeat instructions back to user
- Provide extensive summaries after completing tasks
- Use verbose status messages

**Code Changes:**
- Make changes directly without announcing tools being used
- Validate with ESLint/TypeScript before committing
- Commit messages: concise, conventional commits format
- Only show errors if validation fails

**Examples:**

**Good Response:**
```
✅ Updated navbar dengan sticky scroll effect
✅ Added glassmorphism ke hero section
✅ Validated & pushed (commit a1b2c3d)
```

**Bad Response:**
```
I'll now use the replace_string_in_file tool to update the navbar component. 
Let me explain what I'm going to change...
[lengthy explanation of changes]
Now I'll run the linter...
[detailed lint output]
Let me create a summary document of all changes...
```

**Pre-Push Validation (Critical):**
1. Run `npm run lint` - fix all errors/warnings
2. Run `npx tsc --noEmit` - ensure no type errors
3. Run `npm run build` - verify production build works
4. Only push if all checks pass
5. Report briefly: "✅ All checks passed" or show specific errors

**Remember:** Users value efficiency over verbosity. Let the code speak.
