# Berita Finansial - AI Agent Instructions

## IMPORTANT INSTRUCTIONS

# AI Agent Response Guidelines

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

## 🚨 CRITICAL: Pre-Push Validation Workflow (HIGH PRIORITY)

**⚠️ MANDATORY BEFORE EVERY `git push`:**

This workflow is **NON-NEGOTIABLE** and must be executed in order for **ALL** code changes:

### Validation Pipeline (Required Steps):

```bash
# 1. ESLint Check
npm run lint
# ✅ Must pass with 0 errors (warnings acceptable if minor)
# ❌ Fix all errors before proceeding

# 2. TypeScript Type Check  
npx tsc --noEmit
# ✅ Must pass with 0 type errors
# ❌ Fix all type errors before proceeding

# 3. Production Build Test
npm run build
# ✅ Must compile successfully
# ❌ Fix build errors before proceeding

# 4. Security Audit (Optional - can have warnings)
npm audit --production --audit-level=moderate
# ⚠️ Note: Can proceed with low severity warnings
# ❌ Critical/High vulnerabilities should be addressed

# 5. Only after ALL checks pass:
git add -A
git commit -m "feat: descriptive message"
git push
```

### Why This Matters:

- **Prevents CI Failures:** GitHub Actions will run these same checks
- **Maintains Code Quality:** Catches errors before they reach production
- **Saves Time:** Local validation is faster than waiting for CI to fail
- **Team Efficiency:** Clean main branch = happy developers

### Common Validation Errors & Fixes:

**ESLint Errors:**
- Unused imports: Remove them
- Unused variables: Use them or prefix with `_`
- Missing dependencies: Add to useEffect deps array

**TypeScript Errors:**
- Type mismatches: Add proper type annotations
- Enum assignments: Use `ArticleCategory.SAHAM` not `"SAHAM"`
- Missing props: Add required props or make optional with `?`

**Build Errors:**
- Import errors: Check file paths and exports
- Module not found: Verify package.json dependencies
- Type errors: Same as TypeScript check above

### Agent Behavior:

**When validation fails:**
1. Show specific error messages
2. Fix errors immediately
3. Re-run validation
4. Only push when all checks pass

**When validation passes:**
```
✅ ESLint: Pass
✅ TypeScript: Pass  
✅ Build: Pass
✅ Pushed (commit abc123)
```

### Never Skip This:

❌ **NEVER** push code that hasn't passed all validations
❌ **NEVER** commit with `--no-verify` to bypass checks
❌ **NEVER** push with the mentality "CI will catch it"

✅ **ALWAYS** run full validation pipeline
✅ **ALWAYS** fix errors locally first
✅ **ALWAYS** ensure clean commits

**This is the #1 priority rule for maintaining codebase quality.**

## Architecture Overview

**Indonesian Financial News Platform** - Next.js 16 with App Router, React 19, PostgreSQL via Prisma 6, focused on Indonesian stocks (saham) & crypto news.

**Critical Stack Decisions:**
- **Next.js 16**: App Router with React Compiler enabled (`reactCompiler: true` in next.config.ts)
- **Auth**: NextAuth 4.24.13 + Prisma Adapter, centralized in `app/lib/auth.ts` (never import from route handlers)
- **Database**: Prisma 6.18 singleton in `app/lib/prisma.ts` with global caching for dev (prevents connection pool exhaustion)
- **Caching Strategy**: `MarketDataCache` model (5min TTL) + ISR for article pages (300s revalidate)
- **Middleware**: `withAuth` from NextAuth protects `/watchlist`, `/portfolio`, `/dashboard/:path*`

## Database Schema Architecture

**10 Models in 4 domains:**

1. **Auth Domain** (NextAuth spec):
   - `User` (role: USER|EDITOR|ADMIN, isPremium flag)
   - `Account`, `Session`, `VerificationToken`

2. **Content Domain**:
   - `Article` (status: DRAFT|PUBLISHED|ARCHIVED, category enum, tags array)
   - `Comment` (self-referencing for nested replies via `parentId`)

3. **Finance Domain**:
   - `Watchlist` (composite unique: userId + symbol + assetType)
   - `Portfolio` (tracks buys with quantity, buyPrice, buyDate)
   - `MarketDataCache` (composite unique: symbol + assetType, expires in 5min)

4. **Marketing Domain**:
   - `Newsletter` (frequency: DAILY|WEEKLY|MONTHLY)

**Critical relationships:**
- `User` 1:N `Watchlist`, `Portfolio`, `Comment`, `Newsletter`
- `Article` 1:N `Comment` (nested via `Comment.parentId` self-reference)
- `MarketDataCache` uses composite unique key `symbol_assetType` for upserts

**Key enums:**
- `AssetType`: `SAHAM` | `KRIPTO` (used across Watchlist, Portfolio, MarketDataCache)
- `ArticleCategory`: `SAHAM` | `KRIPTO` | `ANALISIS` | `EDUKASI` | `REGULASI` | `TEKNOLOGI`
- `ArticleStatus`: `DRAFT` | `PUBLISHED` | `ARCHIVED` (filter by PUBLISHED for public pages)
- `UserRole`: `USER` | `EDITOR` | `ADMIN`

## Authentication Pattern (Critical)

**ALWAYS import from centralized config to avoid circular dependencies:**
```typescript
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";

const session = await getServerSession(authOptions);
if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

**Session structure (JWT strategy):**
```typescript
session.user = { 
  id: string,      // Added in JWT callback
  email: string, 
  name: string, 
  image: string,
  role: string     // Added in JWT callback (USER|EDITOR|ADMIN)
}
```

**Why centralized?** NextAuth route handler (`/api/auth/[...nextauth]/route.ts`) would create circular imports if imported elsewhere. Always use `app/lib/auth.ts`.

## API Route Patterns

**Standard structure for protected routes:**
```typescript
export const dynamic = "force-dynamic"; // REQUIRED for real-time data

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Query params: req.nextUrl.searchParams.get('param')
  // Body (POST/PUT): const body = await req.json()
  
  // Use session.user.id for user-specific queries
}
```

**Pagination convention (`/api/articles`):**
```typescript
// Query params: ?page=1&limit=10
const page = parseInt(searchParams.get('page') || '1');
const limit = parseInt(searchParams.get('limit') || '10');
const skip = (page - 1) * limit;

// Response shape:
{
  articles: Article[],
  pagination: { page, limit, total, totalPages }
}
```

**Filter patterns in use:**
- Articles: `?category=SAHAM&search=keyword&premium=true`
- Watchlist: `?assetType=KRIPTO`
- Build dynamic Prisma `where` with conditional spreads:
  ```typescript
  const where = {
    status: "PUBLISHED",
    ...(category && { category: category as ArticleCategory }),
    ...(search && { 
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    })
  };
  ```

## Market Data Integration (2-Tier Caching)

**Critical flow (app/lib/market-data.ts):**
1. **Check DB cache first**: Query `MarketDataCache` by composite key `{symbol, assetType}`
2. **If cache valid** (expiresAt > now): Return cached JSON data
3. **If expired/missing**: Fetch from external API
4. **Upsert cache**: Store with `expiresAt = now + 5min`
5. **Fallback**: Return mock data if API fails (dev safety)

**APIs in use:**
- **Stocks (SAHAM)**: Mock data (IDX API integration pending) - see `getMarketData()`
- **Crypto (KRIPTO)**: CoinGecko free tier (`/api/v3/coins/{coinId}`) - see `getCryptoData()`
  - Uses IDR prices when available, falls back to USD * 15000
  - Params: `localization=false`, `tickers=false` to minimize payload

**Helper functions:**
- `getMarketData(symbol, assetType)` - Generic fetcher with DB cache layer
- `getCryptoData(coinId)` - CoinGecko-specific wrapper
- `formatIDR(amount)` - Indonesian Rupiah formatter (id-ID locale)
- `formatNumber(num, decimals)` - Indonesian number format

**Why composite unique key?** Same symbol can exist as both SAHAM and KRIPTO (e.g., "BTC" might be stock ticker elsewhere).

## ISR & Caching Strategy

**Category pages** (`/saham`, `/kripto`, `/analisis`, etc.):
```typescript
// In async function getArticles():
fetch(`/api/articles?category=SAHAM`, { 
  next: { revalidate: 300 }  // ISR: revalidate every 5 minutes
});
```

**Article detail pages** (`/artikel/[slug]`):
```typescript
export const revalidate = 300;           // ISR interval
export const dynamicParams = true;       // On-demand generation for new slugs

export async function generateStaticParams() {
  // Pre-render top 20 published articles at build time
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
    take: 20,
  });
  return articles.map(a => ({ slug: a.slug }));
}
```

**User-specific pages** (watchlist, portfolio):
```typescript
export const dynamic = "force-dynamic";  // No caching, always fresh
```

## Next.js 15+ Breaking Changes

**Async params pattern:**
```typescript
// ❌ OLD (Next.js 14):
export default function Page({ params }) {
  const { slug } = params;
}

// ✅ NEW (Next.js 15+):
export default async function Page({ params }) {
  const { slug } = await params;  // params is now a Promise
}
```

## Component Patterns

**Dark mode** (manual toggle, no persistent storage):
- Class-based: `dark:bg-gray-900`, `dark:text-white`
- Toggle via `document.documentElement.classList.toggle('dark')`

**Indonesian locale**:
- All UI text in Bahasa Indonesia
- Error messages: "Email dan password harus diisi" (not English)
- Number/currency: Use `formatIDR()` and `formatNumber()` from `market-data.ts`

**Icon library**: `react-icons/fi` (Feather Icons) used consistently across app

## Development Workflow

```bash
# Essential commands:
npx prisma generate              # Regenerate client after schema changes
npx prisma db push              # Sync schema to DB (dev only, skips migrations)
npx prisma studio               # Visual DB editor (localhost:5555)
npx prisma migrate dev --name   # Create migration (production approach)
npm run dev                     # Dev server with Turbopack

# Seed database:
npx prisma db seed              # Runs prisma/seed.ts (tsx required)
```

**Environment variables (required):**
```bash
DATABASE_URL                    # PostgreSQL connection string
NEXTAUTH_URL                    # http://localhost:3000 (dev)
NEXTAUTH_SECRET                 # openssl rand -base64 32
GOOGLE_CLIENT_ID                # OAuth (optional)
GOOGLE_CLIENT_SECRET            # OAuth (optional)
ALPHA_VANTAGE_API_KEY          # Stock data (currently unused, mock fallback)
COINGECKO_API_KEY              # Crypto data (optional, public API used)
```

## Project Structure (Key Directories)

```
app/
├── lib/                     # 🔧 CRITICAL: Import from here, not API routes
│   ├── auth.ts             # NextAuth config - import authOptions from here
│   ├── prisma.ts           # Prisma singleton - import prisma from here
│   ├── market-data.ts      # Market API + cache logic
│   └── utils.ts            # Shared utilities
├── types/
│   └── index.ts            # NextAuth augmentation + shared types
├── api/                    # API routes (export const dynamic = "force-dynamic")
│   ├── articles/          # CRUD + comments
│   ├── auth/[...nextauth] # NextAuth handler (don't import authOptions from here!)
│   ├── market/            # Market data endpoints
│   ├── watchlist/         # User watchlist CRUD
│   └── portfolio/         # User portfolio CRUD
├── components/
│   ├── articles/          # ArticleCard, ArticleGrid
│   ├── market/            # MarketCard, MarketOverview
│   ├── layout/            # Navbar, Footer
│   └── ui/                # Reusable UI components
└── (pages)/               # Route segments: saham/, kripto/, artikel/[slug], etc.
```

## GitHub Actions CI/CD

**Workflows in `.github/workflows/`:**
1. **ci.yml** - Runs on push to main (lint, tsc, build, audit)
2. **code-review.yml** - Runs on PRs (console.log detection, bundle size)
3. **deploy-preview.yml** - Vercel preview (requires secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
4. **performance.yml** - Lighthouse CI + bundle analysis

**Deployment setup:**
- Run `./scripts/setup-vercel.sh` for automated Vercel configuration
- Or follow `.github/QUICK_START_VERCEL.md` for manual setup
- Secrets configured via `gh secret set` or GitHub UI

## Critical Gotchas

❌ **Circular imports**: Never import `authOptions` from `/api/auth/[...nextauth]/route.ts`
✅ Always import from `@/app/lib/auth`

❌ **Missing dynamic export**: Forgetting `export const dynamic = "force-dynamic"` on user-specific API routes
✅ Add it to all routes that need fresh data (watchlist, portfolio, etc.)

❌ **Market data without cache**: Directly calling external APIs
✅ Use `getMarketData()` or `getCryptoData()` which handle caching

❌ **English error messages**: `throw new Error("Invalid email")`
✅ Use Indonesian: `throw new Error("Email tidak valid")`

❌ **Wrong enum casing**: `category: "saham"` (lowercase)
✅ Use proper enum: `category: ArticleCategory.SAHAM` or cast `as ArticleCategory`

❌ **Prisma client not generated**: TypeScript errors after schema changes
✅ Run `npx prisma generate` after any `schema.prisma` modifications

❌ **Build-time database connection**: `generateStaticParams` fails if DB unreachable during build
✅ Wrap in try-catch, return empty array on error (see `artikel/[slug]/page.tsx`)

## Package-Specific Notes

**npm overrides**: `"preact": "10.24.3"` in package.json resolves nested dependency conflict between @auth/core versions (fixes CI npm ci errors)

**React Compiler**: Enabled via `babel-plugin-react-compiler@1.0.0` and `reactCompiler: true` in next.config.ts (automatic memoization)