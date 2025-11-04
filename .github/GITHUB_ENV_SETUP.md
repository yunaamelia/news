# 🔐 GitHub Environment Setup untuk AI Agent

Panduan lengkap untuk mengkonfigurasi environment variables dan context agar GitHub Copilot Agent memberikan output maksimal.

---

## 📋 Table of Contents

1. [GitHub Repository Settings](#github-repository-settings)
2. [GitHub Copilot Configuration](#github-copilot-configuration)
3. [Environment Variables](#environment-variables)
4. [GitHub Actions Integration](#github-actions-integration)
5. [Best Practices](#best-practices)

---

## 1️⃣ GitHub Repository Settings

### A. Repository Variables (Public Context)

Variables ini **AMAN** untuk dibagikan dan akan dibaca oleh Agent:

#### Setup via GitHub UI:

1. **Go to Repository Settings**

   ```
   Repository → Settings → Secrets and variables → Actions → Variables
   ```

2. **Click "New repository variable"**

3. **Add These Variables**:

```bash
# Project Context
PROJECT_NAME=berita-finansial
PROJECT_TYPE=nextjs-fintech
STACK=nextjs16-react19-typescript-tailwindv4

# Architecture Info
FRAMEWORK=Next.js 16.0.1 (App Router)
RUNTIME=React 19
LANGUAGE=TypeScript 5+
STYLING=Tailwind CSS v4
DATABASE=PostgreSQL + Prisma 6
AUTH=NextAuth.js
DEPLOYMENT=Vercel

# Code Standards
CODING_STYLE=airbnb-typescript
PRETTIER_CONFIG=enabled
ESLINT_CONFIG=next/core-web-vitals
TYPESCRIPT_STRICT=true

# Testing Config
TEST_FRAMEWORK=jest+playwright
TEST_COVERAGE_TARGET=70
E2E_ENABLED=true

# Performance Targets
LIGHTHOUSE_PERFORMANCE=95
LIGHTHOUSE_ACCESSIBILITY=95
BUNDLE_SIZE_LIMIT=300KB
```

#### Setup via GitHub CLI:

```bash
# Install GitHub CLI
brew install gh  # macOS
# atau
sudo apt install gh  # Linux

# Login
gh auth login

# Set variables
gh variable set PROJECT_NAME -b "berita-finansial"
gh variable set STACK -b "nextjs16-react19-typescript-tailwindv4"
gh variable set FRAMEWORK -b "Next.js 16.0.1 (App Router)"
gh variable set DATABASE -b "PostgreSQL + Prisma 6"
gh variable set TEST_COVERAGE_TARGET -b "70"
gh variable set LIGHTHOUSE_PERFORMANCE -b "95"
```

---

### B. Repository Secrets (Sensitive Data)

Secrets untuk CI/CD dan Agent (tidak langsung terekspos):

```bash
# Database (gunakan connection pooling URL)
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://yourdomain.com

# OAuth (jika diperlukan)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# API Keys (eksternal services)
COINGECKO_API_KEY=your-api-key
# Tambahkan API keys lain yang diperlukan
```

#### Setup Secrets:

```bash
# Via GitHub UI
Repository → Settings → Secrets and variables → Actions → Secrets → New repository secret

# Via GitHub CLI
gh secret set NEXTAUTH_SECRET -b "your-secret-value"
gh secret set POSTGRES_PRISMA_URL -b "postgresql://..."
gh secret set GOOGLE_CLIENT_ID -b "your-client-id"
```

---

## 2️⃣ GitHub Copilot Configuration

### A. Copilot Instructions File

File `.github/copilot-instructions.md` sudah ada, tapi perlu diperkaya dengan env context:

````markdown
## Environment & Configuration Context

### Current Environment

- **Framework**: Next.js 16.0.1 with App Router
- **Runtime**: React 19 (with React Compiler)
- **Language**: TypeScript 5+ (strict mode enabled)
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (Neon) + Prisma 6
- **Auth**: NextAuth.js with Prisma Adapter
- **Deployment**: Vercel (production) + Preview environments

### Environment Variables Structure

```bash
# Required for build
POSTGRES_PRISMA_URL=           # Pooled connection (Prisma queries)
POSTGRES_URL_NON_POOLING=      # Direct connection (migrations)
NEXTAUTH_URL=                   # Application URL
NEXTAUTH_SECRET=                # Auth secret key

# Optional
GOOGLE_CLIENT_ID=               # OAuth
GOOGLE_CLIENT_SECRET=           # OAuth
COINGECKO_API_KEY=             # Market data
```
````

### Code Quality Standards

- ESLint: `next/core-web-vitals` (0 errors required)
- TypeScript: Strict mode, 0 errors required
- Prettier: Enabled, auto-format on save
- Test Coverage: Target 70%+
- Lighthouse: Performance > 95, Accessibility > 95

### Performance Targets

- Bundle size: < 300KB first load
- Page load: < 2s
- Time to Interactive: < 3s
- No console errors in production

````

---

### B. Enhanced `.github/copilot-instructions.md`

Update file existing dengan menambahkan section baru:

```markdown
## Agent Context & Capabilities

When analyzing this codebase, you have access to:

### 1. Project Structure
````

app/ # Next.js App Router
├── api/ # API routes (server-side)
├── components/ # React components
├── lib/ # Utilities (auth, prisma, market-data)
└── types/ # TypeScript interfaces

prisma/ # Database schema & migrations
public/ # Static assets

````

### 2. Key Dependencies
- **next**: 16.0.1 (App Router, React 19)
- **react**: 19.0.0 (with React Compiler)
- **typescript**: 5+
- **tailwindcss**: 4.x (v4 syntax: bg-linear-to-r)
- **prisma**: 6.x (Neon adapter)
- **next-auth**: Latest (Prisma adapter)

### 3. Critical Files to Reference
- `app/lib/auth.ts` - Authentication logic (DO NOT import authOptions from route handlers)
- `app/lib/prisma.ts` - Database singleton (Neon adapter)
- `app/lib/market-data.ts` - Market data with 5-min cache
- `prisma/schema.prisma` - Database schema (use proper enums)
- `next.config.ts` - React Compiler enabled

### 4. Common Patterns

**Server Components (Default)**:
```typescript
// Direct database access, async/await
export default async function Page() {
  const articles = await prisma.article.findMany();
  return <ArticleList articles={articles} />;
}
````

**Client Components (When Needed)**:

```typescript
"use client";
// Only for hooks, events, browser APIs
import { useState } from "react";
export default function InteractiveComponent() {}
```

**API Routes with Auth**:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // ...
}
```

### 5. Testing Requirements

Before suggesting changes:

- ✅ Run `npm run lint` (must pass)
- ✅ Run `npx tsc --noEmit` (must pass)
- ✅ Run `npm run build` (must succeed)
- ✅ Verify no console errors
- ✅ Test dark mode consistency

### 6. Performance Considerations

Always consider:

- Server vs Client Components (minimize client JS)
- ISR configuration (use `revalidate = 300` for category pages)
- Image optimization (use Next/Image)
- Database query optimization (avoid N+1)
- Bundle size impact (check import size)

### 7. Security Checklist

For any code suggestion:

- [ ] User input validated?
- [ ] Authentication checked (protected routes)?
- [ ] No sensitive data exposed?
- [ ] Prisma parameterization (SQL injection safe)?
- [ ] Environment variables properly scoped?

````

---

## 3️⃣ Environment Variables

### A. Development Environment (.env.local)

**PENTING**: File ini di `.gitignore`, **JANGAN** commit!

```bash
# .env.local (local development only)

# Database
POSTGRES_PRISMA_URL="postgresql://user:pass@localhost:5432/berita_finansial"
POSTGRES_URL_NON_POOLING="postgresql://user:pass@localhost:5432/berita_finansial"
DATABASE_URL="postgresql://user:pass@localhost:5432/berita_finansial"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-change-in-production"

# OAuth (Development)
GOOGLE_CLIENT_ID="your-dev-client-id"
GOOGLE_CLIENT_SECRET="your-dev-secret"

# External APIs
COINGECKO_API_KEY="your-api-key"

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PREMIUM=true
````

---

### B. Example Environment File (.env.example)

**Commit ini ke repository** sebagai template:

```bash
# .env.example - Template for environment variables

# ======================
# DATABASE
# ======================
# Get from: https://console.neon.tech/
POSTGRES_PRISMA_URL="postgresql://user:password@host/database?sslmode=require&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host/database?sslmode=require"
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# ======================
# AUTHENTICATION
# ======================
# Generate secret: openssl rand -base64 32
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-random-secret-here"

# ======================
# OAUTH PROVIDERS
# ======================
# Google Console: https://console.cloud.google.com/
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ======================
# EXTERNAL APIs
# ======================
# CoinGecko: https://www.coingecko.com/en/api
COINGECKO_API_KEY="your-coingecko-api-key"

# ======================
# FEATURE FLAGS (Public)
# ======================
# These are exposed to browser (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PREMIUM=true
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"

# ======================
# DEVELOPMENT ONLY
# ======================
# Prisma
DATABASE_URL="postgresql://localhost:5432/dev"

# Debug flags
DEBUG=false
VERBOSE_LOGGING=false
```

---

### C. Vercel Environment Variables

Setup via Vercel Dashboard atau CLI:

#### Via Vercel Dashboard:

1. Go to: `https://vercel.com/your-org/berita-finansial/settings/environment-variables`

2. Add variables dengan environment-specific values:

| Variable              | Production        | Preview        | Development    |
| --------------------- | ----------------- | -------------- | -------------- |
| `POSTGRES_PRISMA_URL` | ✅ Production DB  | ✅ Staging DB  | ❌ (local)     |
| `NEXTAUTH_SECRET`     | ✅ Unique         | ✅ Unique      | ❌ (local)     |
| `NEXTAUTH_URL`        | ✅ yourdomain.com | ✅ preview URL | ❌ (localhost) |
| `GOOGLE_CLIENT_ID`    | ✅ Prod keys      | ✅ Dev keys    | ❌ (local)     |

#### Via Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Set environment variables
vercel env add POSTGRES_PRISMA_URL production
# Paste value when prompted

vercel env add NEXTAUTH_SECRET production preview
# Paste value when prompted

vercel env add GOOGLE_CLIENT_ID production preview development
# Paste value when prompted

# Pull env to local (for testing)
vercel env pull .env.local
```

---

## 4️⃣ GitHub Actions Integration

### A. CI/CD Workflow dengan Env Access

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  # Repository variables (public context)
  PROJECT_NAME: ${{ vars.PROJECT_NAME }}
  STACK: ${{ vars.STACK }}
  TEST_COVERAGE_TARGET: ${{ vars.TEST_COVERAGE_TARGET }}

jobs:
  # Job 1: Code Quality
  quality:
    name: Code Quality Checks
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npx tsc --noEmit

      - name: Check formatting
        run: npx prettier --check .

  # Job 2: Build Test
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: quality

    env:
      # Use dummy values for build (no real DB needed)
      DATABASE_URL: postgresql://dummy:dummy@localhost:5432/dummy
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Build application
        run: npm run build

      - name: Check bundle size
        run: |
          BUNDLE_SIZE=$(du -sh .next | cut -f1)
          echo "Bundle size: $BUNDLE_SIZE"
          # Add size check logic here

  # Job 3: Tests (if you have tests)
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: quality

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage
        env:
          DATABASE_URL: postgresql://dummy:dummy@localhost:5432/dummy

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info

  # Job 4: Security Audit
  security:
    name: Security Audit
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=moderate

      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
```

---

### B. Deployment Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"

      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Deployed to production: https://berita-finansial.vercel.app'
            })
```

---

## 5️⃣ Best Practices

### A. Environment Variable Security

**DO's** ✅

```bash
# Use proper naming
NEXTAUTH_SECRET=xxx          # Server-only (secure)
NEXT_PUBLIC_API_URL=xxx      # Client-exposed (public)

# Scope properly
VERCEL_ENV=production        # Platform-provided
NODE_ENV=production          # Standard

# Use strong secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Different secrets per environment
NEXTAUTH_SECRET_PROD=xxx
NEXTAUTH_SECRET_STAGING=xxx
```

**DON'Ts** ❌

```bash
# Never commit secrets
# ❌ .env in git
# ❌ Hardcoded in code
const apiKey = "sk-123...";

# Don't expose server secrets to client
# ❌ Missing NEXT_PUBLIC_ prefix for client vars
# ❌ Using NEXT_PUBLIC_ for secrets

# Don't use weak secrets
NEXTAUTH_SECRET="password123"  # ❌

# Don't share production secrets
# ❌ Using prod DB in development
# ❌ Sharing .env.local files
```

---

### B. Agent Context Enhancement

Create `.github/agent-context.json` for structured context:

```json
{
  "project": {
    "name": "Berita Finansial",
    "type": "fintech-news-platform",
    "version": "1.0.0",
    "status": "production"
  },
  "stack": {
    "framework": "Next.js 16.0.1",
    "runtime": "React 19",
    "language": "TypeScript 5+",
    "styling": "Tailwind CSS v4",
    "database": "PostgreSQL + Prisma 6",
    "auth": "NextAuth.js",
    "deployment": "Vercel"
  },
  "architecture": {
    "pattern": "App Router (Server-first)",
    "api": "Next.js API Routes",
    "ssr": "React Server Components",
    "caching": "ISR (5 min revalidate)",
    "state": "Server State + URL State"
  },
  "standards": {
    "linting": "ESLint (next/core-web-vitals)",
    "formatting": "Prettier",
    "typing": "TypeScript Strict Mode",
    "testing": "Jest + Playwright",
    "coverage": "70%+ target"
  },
  "performance": {
    "lighthouse": {
      "performance": 95,
      "accessibility": 95,
      "best_practices": 100,
      "seo": 100
    },
    "bundle_size": "< 300KB",
    "page_load": "< 2s",
    "tti": "< 3s"
  },
  "features": {
    "articles": "News articles with categories",
    "market": "Real-time market data (stocks + crypto)",
    "watchlist": "User watchlist (auth required)",
    "portfolio": "Portfolio tracking (auth required)",
    "premium": "Premium membership tiers",
    "dark_mode": "Full dark mode support"
  },
  "api_endpoints": {
    "articles": "/api/articles",
    "market": "/api/market",
    "watchlist": "/api/watchlist",
    "portfolio": "/api/portfolio",
    "auth": "/api/auth/[...nextauth]"
  },
  "database": {
    "models": [
      "User",
      "Article",
      "Category",
      "Watchlist",
      "Portfolio",
      "MarketDataCache"
    ],
    "enums": ["AssetType", "ArticleCategory", "ArticleStatus"]
  }
}
```

---

### C. VS Code Settings untuk Team

Create `.vscode/settings.json` (commit to repo):

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": true,
    "typescript": true,
    "typescriptreact": true
  }
}
```

---

### D. Documentation Checklist

Ensure these files exist dan up-to-date:

```bash
✅ README.md                          # Project overview
✅ .env.example                       # Env template
✅ .github/copilot-instructions.md   # Copilot config
✅ .github/agent-instructions.md     # Agent capabilities
✅ .github/agent-context.json        # Structured context
✅ CONTRIBUTING.md                    # Contribution guide
✅ docs/ARCHITECTURE.md               # Architecture docs
✅ docs/API.md                        # API documentation
```

---

## 🚀 Quick Setup Script

Save as `scripts/setup-agent-env.sh`:

```bash
#!/bin/bash

echo "🤖 Setting up GitHub Agent Environment..."

# 1. Check if .env.example exists
if [ ! -f .env.example ]; then
  echo "❌ .env.example not found!"
  exit 1
fi

# 2. Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI not installed. Install: brew install gh"
  exit 1
fi

# 3. Set repository variables
echo "📝 Setting repository variables..."
gh variable set PROJECT_NAME -b "berita-finansial"
gh variable set STACK -b "nextjs16-react19-typescript-tailwindv4"
gh variable set FRAMEWORK -b "Next.js 16.0.1 (App Router)"
gh variable set DATABASE -b "PostgreSQL + Prisma 6"
gh variable set TEST_COVERAGE_TARGET -b "70"
gh variable set LIGHTHOUSE_PERFORMANCE -b "95"

echo "✅ Repository variables set!"

# 4. Prompt for secrets
echo ""
echo "🔐 Now set your secrets manually:"
echo "   gh secret set NEXTAUTH_SECRET"
echo "   gh secret set POSTGRES_PRISMA_URL"
echo "   gh secret set GOOGLE_CLIENT_ID"
echo "   gh secret set GOOGLE_CLIENT_SECRET"

echo ""
echo "✅ Setup complete! Agent now has full context."
```

Make it executable:

```bash
chmod +x scripts/setup-agent-env.sh
./scripts/setup-agent-env.sh
```

---

## 📊 Verify Setup

Run this checklist:

```bash
# 1. Check GitHub variables
gh variable list

# 2. Check GitHub secrets (names only)
gh secret list

# 3. Verify Copilot has instructions
cat .github/copilot-instructions.md

# 4. Test local environment
cp .env.example .env.local
# Edit .env.local with real values
npm run dev

# 5. Test build with env
npm run build

# 6. Verify Agent context
# Open GitHub Copilot Chat and ask:
# "What is the tech stack of this project?"
# "Show me the authentication flow"
```

---

## 🎯 Result: Maximum Agent Output

Dengan setup ini, Agent akan:

✅ **Understand full context** - Stack, architecture, patterns  
✅ **Follow project standards** - Linting, formatting, types  
✅ **Access documentation** - Instructions, templates, examples  
✅ **Know performance targets** - Bundle size, Lighthouse scores  
✅ **Respect security** - Proper env scoping, validation  
✅ **Provide better suggestions** - Context-aware recommendations  
✅ **Generate accurate code** - Following project conventions  
✅ **Catch issues early** - CI/CD with proper env setup

---

**Version**: 1.0  
**Last Updated**: November 4, 2025  
**Maintained By**: Berita Finansial Team
