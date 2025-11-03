# 🔐 GitHub Secrets Configuration Template

Template untuk GitHub Actions secrets yang diperlukan.

## 📋 Required Secrets

### Vercel Deployment

```bash
# Cara menambahkan via gh CLI:

# 1. Vercel Token
gh secret set VERCEL_TOKEN
# Paste token, tekan Enter

# 2. Organization ID
gh secret set VERCEL_ORG_ID
# Paste org ID, tekan Enter

# 3. Project ID
gh secret set VERCEL_PROJECT_ID
# Paste project ID, tekan Enter
```

### Atau via Web UI:

```
https://github.com/yunaamelia/news/settings/secrets/actions/new
```

## 🔍 Cara Mendapatkan Values

### VERCEL_TOKEN
```bash
# 1. Login ke vercel.com
# 2. Settings → Tokens → Create Token
# 3. Name: "GitHub Actions"
# 4. Scope: "Full Account"
# 5. Copy token
```

### VERCEL_ORG_ID & VERCEL_PROJECT_ID
```bash
# Via CLI (Recommended):
npm i -g vercel
vercel login
vercel link
cat .vercel/project.json

# Output:
# {
#   "orgId": "team_xxxxxxxxxxxxxxxxxxxx",
#   "projectId": "prj_xxxxxxxxxxxxxxxxxxxx"
# }
```

## ✅ Verification

```bash
# List all secrets
gh secret list

# Expected output:
# VERCEL_TOKEN         Updated YYYY-MM-DD
# VERCEL_ORG_ID        Updated YYYY-MM-DD
# VERCEL_PROJECT_ID    Updated YYYY-MM-DD
```

## 🚨 Security

- ✅ Secrets are encrypted
- ✅ Not visible after creation
- ✅ Only accessible in workflows
- ❌ Never commit secrets
- ❌ Never log secrets

## 📝 Notes

- Secrets case-sensitive
- Update secrets jika token expired
- Rotate tokens every 6 months
- Keep backup tokens in secure location
