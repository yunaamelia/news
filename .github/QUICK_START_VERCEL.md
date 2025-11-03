# ⚡ Quick Start: Vercel Deployment

Panduan cepat untuk setup Vercel deployment dalam 5 menit.

## 🚀 Quick Setup (Automated)

```bash
# Run setup script
./scripts/setup-vercel.sh
```

Script akan otomatis:
1. ✅ Login ke Vercel
2. ✅ Link project
3. ✅ Extract credentials
4. ✅ Configure GitHub secrets

## 📝 Manual Setup (5 menit)

### 1. Get Vercel Credentials

```bash
# Install & login
npm i -g vercel
vercel login
vercel link

# Get IDs
cat .vercel/project.json
```

### 2. Get Vercel Token

1. Open: https://vercel.com/account/tokens
2. Create token: "GitHub Actions" (Full Account)
3. Copy token

### 3. Set GitHub Secrets

```bash
# Set secrets via gh CLI
gh secret set VERCEL_TOKEN        # Paste token
gh secret set VERCEL_ORG_ID       # Paste org ID
gh secret set VERCEL_PROJECT_ID   # Paste project ID
```

### 4. Configure Vercel Environment Variables

```bash
# Open Vercel dashboard
vercel --prod
# Or: https://vercel.com/yunaamelia/news/settings/environment-variables
```

Add these variables:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- Other env vars from `.env.example`

### 5. Test Deployment

```bash
# Create test PR
./scripts/test-vercel-deployment.sh

# Or manually:
git checkout -b test-deploy
git commit --allow-empty -m "test: vercel deployment"
git push origin test-deploy
gh pr create
```

## ✅ Verification

```bash
# Check secrets
gh secret list

# Expected:
# VERCEL_TOKEN         ✓
# VERCEL_ORG_ID        ✓
# VERCEL_PROJECT_ID    ✓

# Watch workflow
gh run watch
```

## 📊 What Happens Next

When you create a PR:

1. **CI Workflow** runs:
   - Security audit
   - Lint & type check
   - Build test

2. **Deploy Preview** workflow runs:
   - Builds project
   - Deploys to Vercel
   - Comments PR with URL

3. **Code Review** workflow runs:
   - Checks for console.log
   - Validates bundle size

## 🔧 Troubleshooting

### Secrets not working?
```bash
# Re-set secrets
gh secret set VERCEL_TOKEN --body "your-token"
```

### Build failing?
```bash
# Test locally
DATABASE_URL="postgresql://dummy@localhost/dummy" npm run build
```

### Can't link project?
```bash
# Force re-link
rm -rf .vercel
vercel link --yes
```

## 📚 Full Documentation

- `.github/VERCEL_SETUP.md` - Complete setup guide
- `.github/SECRETS_TEMPLATE.md` - Secrets template
- `DEPLOYMENT.md` - Deployment options

## 🆘 Need Help?

```bash
# Check workflow status
gh run list -w "Deploy Preview"

# View logs
gh run view --log-failed

# Check Vercel dashboard
vercel --prod
```

---

**Time estimate:** 5 minutes ⏱️

**Difficulty:** Easy ✅

**Next:** Configure environment variables in Vercel
