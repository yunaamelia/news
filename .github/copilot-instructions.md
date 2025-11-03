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
if (!session)
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

**Session structure (JWT strategy):**

```typescript
session.user = {
  id: string, // Added in JWT callback
  email: string,
  name: string,
  image: string,
  role: string, // Added in JWT callback (USER|EDITOR|ADMIN)
};
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
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    }),
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
  - Uses IDR prices when available, falls back to USD \* 15000
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
  next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
});
```

**Article detail pages** (`/artikel/[slug]`):

```typescript
export const revalidate = 300; // ISR interval
export const dynamicParams = true; // On-demand generation for new slugs

export async function generateStaticParams() {
  // Pre-render top 20 published articles at build time
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
    take: 20,
  });
  return articles.map((a) => ({ slug: a.slug }));
}
```

**User-specific pages** (watchlist, portfolio):

```typescript
export const dynamic = "force-dynamic"; // No caching, always fresh
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
  const { slug } = await params; // params is now a Promise
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

---

# 🤖 Advanced Agent Capabilities

## Deep Code Analysis Mode

When analyzing codebase, perform **multi-layer inspection**:

### Layer 1: Architecture Analysis

```typescript
// Check for:
✅ Proper separation of concerns (lib/ vs components/ vs api/)
✅ Consistent import patterns (relative vs absolute)
✅ Single responsibility principle (functions < 50 lines)
✅ DRY violations (duplicate logic across files)
✅ Circular dependencies (imports that loop back)
```

### Layer 2: Performance Profiling

```typescript
// Automatically identify:
🔴 Client components that should be server components
🔴 Missing React.memo() on heavy render components
🔴 Inefficient loops (nested .map(), O(n²) operations)
🔴 Unnecessary useEffect re-runs (missing/wrong deps)
🔴 Large bundle sizes (check import statements)
🔴 Missing image optimization (check <img> vs <Image>)
🔴 Database N+1 queries (missing Prisma includes)
```

### Layer 3: Security Audit

```typescript
// Scan for vulnerabilities:
⚠️ SQL injection risks (raw queries, string concatenation)
⚠️ XSS vulnerabilities (dangerouslySetInnerHTML without sanitization)
⚠️ Authentication bypasses (missing session checks)
⚠️ Exposed API keys (hardcoded secrets)
⚠️ CORS misconfigurations (allow all origins)
⚠️ Rate limiting missing (public API endpoints)
⚠️ Insecure dependencies (npm audit critical/high)
```

### Layer 4: Type Safety Deep Dive

```typescript
// TypeScript rigor check:
🟡 Any `any` types (should be `unknown` + type guards)
🟡 Missing null checks (potential runtime errors)
🟡 Enum mismatches (string vs enum value)
🟡 Implicit `any` in function params
🟡 Missing return types on functions
🟡 Unsafe type assertions (`as` without validation)
```

### Layer 5: Accessibility (WCAG 2.1 AA)

```typescript
// A11y compliance:
♿ Missing alt text on images
♿ Non-semantic HTML (div buttons, span links)
♿ No keyboard navigation (missing tabIndex, onKeyDown)
♿ Color contrast violations (<4.5:1 ratio)
♿ Missing ARIA labels (icon buttons, form fields)
♿ Focus indicators disabled (outline: none)
```

## Bug Hunting Strategies

### 1. Hydration Mismatch Detective

```typescript
// Common causes in this codebase:
❌ Date.now() or new Date() in server components
❌ Math.random() values in SSR
❌ localStorage access before mounting
❌ Conditional rendering based on window.innerWidth

// Fix pattern:
✅ Use 'use client' + useState + useEffect
✅ Add suppressHydrationWarning to time-dependent elements
✅ Defer client-only rendering with mounted state
```

### 2. Race Condition Detector

```typescript
// Look for in useEffect/API calls:
❌ Multiple setState calls from different async sources
❌ Outdated closure values in callbacks
❌ Missing cleanup functions in subscriptions
❌ setInterval without clearInterval

// Fix pattern:
✅ Use AbortController for fetch cancellation
✅ Add cleanup: return () => controller.abort()
✅ Debounce/throttle rapid updates
✅ Use useRef for latest values in closures
```

### 3. Memory Leak Hunter

```typescript
// Red flags to catch:
🚨 Event listeners never removed
🚨 setInterval/setTimeout without cleanup
🚨 Subscriptions without unsubscribe
🚨 Large objects in closures
🚨 Growing arrays never cleared
🚨 Prisma clients instantiated per request

// Fix pattern:
✅ useEffect cleanup functions
✅ Singleton pattern for Prisma (lib/prisma.ts)
✅ WeakMap for object caching
✅ Automatic cleanup with AbortController
```

### 4. State Management Anti-patterns

```typescript
// Detect bad patterns:
❌ Props drilling > 3 levels deep
❌ useState for derived values (should be useMemo)
❌ State in URL params not synced (watchlist filters)
❌ Global state when local state suffices

// Suggest:
✅ Context API for deep props
✅ useMemo/useCallback for computations
✅ useSearchParams + URL state sync
✅ Keep state as local as possible
```

## Optimization Suggestions Engine

### Performance Optimization Priority Matrix

```markdown
| Impact | Effort | Priority      | Examples                                    |
| ------ | ------ | ------------- | ------------------------------------------- |
| High   | Low    | 🔥 DO NOW     | Add database indexes, remove unused deps    |
| High   | High   | 📅 PLAN       | Rewrite slow queries, refactor architecture |
| Low    | Low    | ✅ DO IF TIME | Rename variables, add comments              |
| Low    | High   | ❌ SKIP       | Micro-optimizations, premature abstraction  |
```

### When to Suggest Refactoring

**✅ Refactor if:**

- Function > 100 lines (break into smaller functions)
- File > 500 lines (split into modules)
- Cyclomatic complexity > 10 (simplify logic)
- Duplicate code in 3+ places (extract to utility)
- Test coverage < 50% on critical paths
- Performance regression > 20% (profile and fix)

**❌ Don't refactor if:**

- Code works and is rarely changed ("if it ain't broke...")
- Deadline is tight (technical debt acceptable short-term)
- No tests exist (refactor = high risk)
- Team unfamiliar with pattern (consistency > cleverness)

### Database Query Optimization

```typescript
// Automatically detect and fix:

// ❌ N+1 Query Problem:
const articles = await prisma.article.findMany();
for (const article of articles) {
  article.author = await prisma.user.findUnique({
    where: { id: article.authorId },
  });
}

// ✅ Use include/select:
const articles = await prisma.article.findMany({
  include: { author: true }, // Single query with JOIN
});

// ❌ Over-fetching:
const user = await prisma.user.findUnique({ where: { id } }); // Returns all fields

// ✅ Select only needed fields:
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, name: true }, // Minimal payload
});
```

### Bundle Size Optimization

```typescript
// Detect heavy imports and suggest alternatives:

// ❌ Full library imports:
import moment from 'moment';            // 290KB
import _ from 'lodash';                 // 72KB
import * as Icons from 'react-icons';   // 1MB+

// ✅ Tree-shakeable imports:
import { formatDistanceToNow } from 'date-fns';  // 2KB
import debounce from 'lodash/debounce';          // 3KB
import { FiUser, FiMail } from 'react-icons/fi'; // 5KB per icon pack

// ✅ Dynamic imports for heavy components:
const Chart = dynamic(() => import('@/components/Chart'), {
  ssr: false,
  loading: () => <Skeleton />
});
```

## Code Review Response Format

When reviewing code, structure output as:

````markdown
## 🔍 Code Analysis Report

### 📊 Overview

- Files analyzed: X
- Lines of code: Y
- Potential issues: Z

### 🔴 Critical Issues (Action Required)

1. **Security: SQL Injection in /api/articles**
   - Location: `app/api/articles/route.ts:45`
   - Issue: Raw query with user input
   - Fix:

   ```typescript
   // ❌ Vulnerable:
   prisma.$queryRaw`SELECT * FROM articles WHERE title = '${search}'`;

   // ✅ Safe:
   prisma.article.findMany({ where: { title: { contains: search } } });
   ```
````

### 🟡 Performance Issues

1. **N+1 Query in Article List**
   - Impact: +2s page load per 10 articles
   - Fix: Add `include: { author: true }` to findMany

### 🟢 Code Quality Improvements

1. **Type Safety: Add return type to getArticles()**
2. **Consistency: Use async/await instead of .then()**

### 🔵 Enhancement Ideas

1. Add infinite scroll to article list
2. Implement full-text search with Postgres
3. Add article reading time estimation

### ✅ What's Working Well

- Good error handling in API routes
- Proper authentication checks
- Clean component structure

````

## Proactive Assistance Patterns

### Auto-detect User Intent

```typescript
// When user says: "artikel tidak muncul"
// Agent should check:
1. Database: Are there PUBLISHED articles?
2. API: Does /api/articles return data?
3. Frontend: Is ArticleGrid rendering correctly?
4. Cache: Is ISR stale? (check revalidate settings)
5. Filters: Are category filters too restrictive?

// Then respond with root cause + fix, not just "cek database"
````

### Suggest Related Improvements

```typescript
// When user asks: "tambah tombol edit artikel"
// Agent should also mention:
✅ "Added edit button"
✅ "Suggested: Add delete button for consistency?"
✅ "Suggested: Add keyboard shortcut (Ctrl+E)?"
✅ "Note: Need authorization check (only author/admin can edit)"
```

### Context-Aware Problem Solving

```typescript
// If build fails with Prisma error:
// ❌ Generic response: "Run npx prisma generate"
// ✅ Smart response:
"Build failed: Prisma client out of sync
Root cause: schema.prisma changed but client not regenerated
Fix applied:
  1. npx prisma generate
  2. npm run build (verifying...)
  ✅ Build successful
Tip: Add 'prisma generate' to postinstall script to prevent this"
```

## Advanced Debugging Techniques

### 1. Binary Search for Bugs

```typescript
// When user reports "halaman tidak load":
// Instead of asking questions, systematically check:
Step 1: Is server running? ✅
Step 2: Does page route exist? ✅
Step 3: Check console errors → Found: "Cannot read property 'map' of undefined"
Step 4: Trace error to component → ArticleGrid.tsx:34
Step 5: Check data source → API returns null instead of []
Step 6: Fix API to return empty array
Root cause: Missing null check in API response
```

### 2. Timeline Reconstruction

```typescript
// When user says "setelah deploy, dark mode rusak":
// Reconstruct events:
1. Check git log for recent dark mode changes
2. Compare local vs production builds
3. Check if Tailwind config differs
4. Verify CSS variable injection
5. Find culprit: Production build minified CSS removed unused classes
6. Fix: Add safelist to tailwind.config.js
```

### 3. Dependency Graph Analysis

```typescript
// When adding new feature breaks existing code:
// Map impact:
New Feature: Add comment reactions
  ↓ Changes Comment model (Prisma schema)
  ↓ Regenerates Prisma client (types changed)
  ↓ Breaks CommentList component (missing new fields)
  ↓ Breaks API tests (outdated fixtures)

Fix cascade:
1. Update Prisma schema
2. Run migration
3. Update CommentList props
4. Update API response type
5. Update test fixtures
```

## Domain-Specific Expertise

### Financial Data Handling

```typescript
// Indonesian Stock Market (IDX) specifics:
- Trading hours: 09:00-16:00 WIB (GMT+7)
- Lot size: 100 shares minimum
- Price limits: ±7% auto rejection, ±25% trading halt
- Currency: Always display in IDR (Rp)

// Example validation:
function validateStockOrder(quantity: number, price: number) {
  if (quantity % 100 !== 0) throw new Error("Kuantitas harus kelipatan 100");
  if (price < 50) throw new Error("Harga minimum Rp 50");
  // ... other IDX rules
}
```

### Crypto Market Handling

```typescript
// CoinGecko API best practices:
- Free tier: 10-50 calls/minute
- Always cache responses (use MarketDataCache)
- Handle rate limits gracefully:

async function fetchWithRetry(url: string, retries = 3) {
  try {
    const res = await fetch(url);
    if (res.status === 429) { // Rate limited
      await new Promise(r => setTimeout(r, 60000)); // Wait 1 min
      return fetchWithRetry(url, retries - 1);
    }
    return res.json();
  } catch (error) {
    if (retries > 0) return fetchWithRetry(url, retries - 1);
    return mockCryptoData; // Fallback
  }
}
```

## Agent Self-Improvement Loop

After each interaction, agent should:

1. **Learn patterns**: "User often asks about X → proactively suggest X-related improvements"
2. **Track pain points**: "User struggled with Y → add Y to common gotchas section"
3. **Measure impact**: "Fix Z reduced API response time by 40% → prioritize similar optimizations"
4. **Refine communication**: "User preferred code over explanation → default to showing code first"

## Final Reminders

- **Always validate before pushing** (lint → tsc → build)
- **Think in Indonesian** (user-facing text, error messages)
- **Security first** (never skip auth checks)
- **Performance matters** (this is a public-facing news site)
- **Types are your friend** (strict TypeScript prevents runtime errors)
- **Cache aggressively** (external APIs cost money/have limits)
- **Accessibility is not optional** (11% of users need it)
- **Test on mobile** (60%+ traffic from mobile in Indonesia)

**You're not just fixing bugs — you're maintaining a production financial platform that thousands of Indonesians rely on for investment decisions. Every line of code matters.**
