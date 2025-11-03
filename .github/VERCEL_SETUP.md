# 🚀 Vercel Deployment Setup Guide

Panduan lengkap untuk mengkonfigurasi GitHub Actions dengan Vercel deployment.

## 📋 Prerequisites

- Akun Vercel (gratis): [vercel.com](https://vercel.com)
- Repository sudah terhubung ke GitHub
- Akses ke repository settings

## 🔑 Step 1: Dapatkan Vercel Credentials

### 1.1 Vercel Token

1. Login ke [vercel.com](https://vercel.com)
2. Klik avatar → **Settings** → **Tokens**
3. Klik **Create Token**
4. Beri nama: `GitHub Actions`
5. Pilih scope: **Full Account**
6. Klik **Create**
7. **Copy token** (hanya muncul sekali!)

### 1.2 Vercel Organization ID

**Cara 1: Via CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Get credentials
cat .vercel/project.json
```

Output akan seperti ini:
```json
{
  "orgId": "team_xxxxxxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxx"
}
```

**Cara 2: Via Web**
1. Buka [vercel.com](https://vercel.com)
2. Pilih project Anda
3. Klik **Settings**
4. URL akan seperti: `vercel.com/[ORG_ID]/[PROJECT_NAME]/settings`
5. Copy `ORG_ID` dari URL

### 1.3 Vercel Project ID

**Via Settings Page:**
1. Di project settings
2. Scroll ke bawah ke **Project ID**
3. Copy Project ID

## 🔐 Step 2: Tambahkan GitHub Secrets

### 2.1 Buka Repository Settings

```bash
# Atau buka langsung via browser:
https://github.com/yunaamelia/news/settings/secrets/actions
```

### 2.2 Tambahkan Secrets

Klik **New repository secret** dan tambahkan:

| Name | Value | Keterangan |
|------|-------|------------|
| `VERCEL_TOKEN` | Token dari step 1.1 | Authentication ke Vercel API |
| `VERCEL_ORG_ID` | Org ID dari step 1.2 | Organization/Team ID |
| `VERCEL_PROJECT_ID` | Project ID dari step 1.3 | Project identifier |

### 2.3 Tambahkan Environment Secrets (untuk Preview)

1. Buka **Settings** → **Environments**
2. Klik **New environment**
3. Nama: `preview`
4. Tambahkan secrets yang sama di environment ini

## 📦 Step 3: Setup Vercel Project

### 3.1 Import Project ke Vercel

```bash
# Via CLI
vercel

# Atau via web:
# https://vercel.com/new
```

### 3.2 Configure Build Settings

Di Vercel Dashboard → Project Settings:

**Framework Preset:** Next.js

**Build Command:**
```bash
npx prisma generate && npm run build
```

**Output Directory:** `.next`

**Install Command:**
```bash
npm install
```

### 3.3 Configure Environment Variables

Di Vercel → Settings → Environment Variables, tambahkan:

```env
# Database (gunakan Vercel Postgres atau Supabase)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# NextAuth
NEXTAUTH_URL=https://yourdomain.vercel.app
NEXTAUTH_SECRET=generate-dengan-openssl-rand-base64-32

# API Keys
ALPHA_VANTAGE_API_KEY=your-key
COINGECKO_API_KEY=your-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret

# Site Config
NEXT_PUBLIC_SITE_URL=https://yourdomain.vercel.app
NEXT_PUBLIC_SITE_NAME=Berita Finansial Indonesia
```

**Environment pilihan untuk setiap variable:**
- ✅ Production
- ✅ Preview
- ✅ Development

## 🧪 Step 4: Test Deployment

### 4.1 Verifikasi Secrets

```bash
# Check via gh CLI
gh secret list

# Expected output:
# VERCEL_TOKEN         Updated 2025-11-03
# VERCEL_ORG_ID        Updated 2025-11-03
# VERCEL_PROJECT_ID    Updated 2025-11-03
```

### 4.2 Trigger Manual Workflow

```bash
# Push ke branch baru untuk test preview
git checkout -b test-vercel-deploy
git commit --allow-empty -m "test: trigger vercel preview deployment"
git push origin test-vercel-deploy

# Buat PR
gh pr create --title "Test Vercel Deployment" --body "Testing preview deployment"
```

### 4.3 Monitor Workflow

```bash
# Check workflow runs
gh run list -w "Deploy Preview"

# Watch logs
gh run watch
```

## ✅ Step 5: Verifikasi

### Checklist Deployment

- [ ] Vercel token dibuat dan disimpan
- [ ] GitHub secrets ditambahkan (3 secrets)
- [ ] Vercel project ter-import
- [ ] Environment variables dikonfigurasi di Vercel
- [ ] Preview environment dibuat di GitHub
- [ ] Test PR berhasil deploy
- [ ] Preview URL accessible
- [ ] Database connection berhasil

## 🔧 Troubleshooting

### Error: "Invalid token"

**Solusi:**
- Token expired, generate token baru
- Pastikan scope token adalah "Full Account"
- Re-create secret di GitHub

### Error: "Project not found"

**Solusi:**
```bash
# Re-link project
vercel link --yes

# Verify IDs
cat .vercel/project.json
```

### Error: "Build failed"

**Solusi:**
1. Check environment variables di Vercel
2. Pastikan `DATABASE_URL` valid
3. Run build locally:
```bash
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run build
```

### Error: "Prisma generate failed"

**Solusi:**
- Tambahkan `npx prisma generate` ke build command
- Vercel Settings → Build & Development Settings → Build Command:
```bash
npx prisma generate && npm run build
```

## 🚀 Workflow yang Sudah Terkonfigurasi

### 1. CI Workflow (main branch)
**File:** `.github/workflows/ci.yml`
- ✅ Sudah berjalan
- Security audit, lint, type check, build test

### 2. Deploy Preview (Pull Requests)
**File:** `.github/workflows/deploy-preview.yml`
- Menunggu secrets dikonfigurasi
- Auto-deploy preview untuk setiap PR

### 3. Code Review (Pull Requests)
**File:** `.github/workflows/code-review.yml`
- ✅ Sudah siap
- Auto review: console.log check, bundle size

### 4. Performance & Optimization
**File:** `.github/workflows/performance.yml`
- Scheduled/manual trigger
- Lighthouse CI, bundle analysis

## 📊 Expected Results

Setelah setup selesai, setiap PR akan:

1. ✅ Run CI tests
2. ✅ Deploy preview ke Vercel
3. ✅ Comment PR dengan preview URL
4. ✅ Run code review checks

Example PR comment:
```
🚀 **Preview Deployed**

✅ Preview URL: https://news-git-feature-xyz-yunaamelia.vercel.app

Changes are live and ready for review!
```

## 🔐 Security Notes

- **NEVER** commit secrets ke repository
- **NEVER** push `.vercel/` folder (sudah ada di `.gitignore`)
- Rotate tokens setiap 3-6 bulan
- Use environment-specific secrets
- Enable Vercel's automatic HTTPS

## 📚 Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Vercel Deployment](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

## 🆘 Need Help?

Jika mengalami masalah:

1. Check workflow logs: `gh run view --log-failed`
2. Verify secrets: `gh secret list`
3. Test locally: `vercel dev`
4. Check Vercel dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)

---

**Status:** 🟡 Menunggu konfigurasi secrets

**Next Step:** Tambahkan GitHub secrets sesuai Step 2
