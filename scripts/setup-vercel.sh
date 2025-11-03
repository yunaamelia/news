#!/bin/bash

# 🚀 Vercel Setup Helper Script
# Membantu mengkonfigurasi Vercel deployment untuk GitHub Actions

set -e

echo "🚀 Vercel Setup Helper"
echo "====================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) not installed${NC}"
    echo "Install: https://cli.github.com/"
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

echo -e "${BLUE}Step 1: Vercel Authentication${NC}"
echo "================================"
echo ""

# Check if already logged in
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
else
    echo -e "${GREEN}✓ Already logged in to Vercel${NC}"
    vercel whoami
fi

echo ""
echo -e "${BLUE}Step 2: Link Project${NC}"
echo "===================="
echo ""

# Check if project already linked
if [ -f ".vercel/project.json" ]; then
    echo -e "${GREEN}✓ Project already linked${NC}"
    cat .vercel/project.json | jq '.'
else
    echo "Linking project to Vercel..."
    vercel link
fi

echo ""
echo -e "${BLUE}Step 3: Extract Credentials${NC}"
echo "============================"
echo ""

if [ ! -f ".vercel/project.json" ]; then
    echo -e "${RED}❌ Project not linked. Please run 'vercel link' first.${NC}"
    exit 1
fi

# Extract values
ORG_ID=$(cat .vercel/project.json | jq -r '.orgId')
PROJECT_ID=$(cat .vercel/project.json | jq -r '.projectId')

echo "Organization ID: $ORG_ID"
echo "Project ID: $PROJECT_ID"
echo ""

echo -e "${BLUE}Step 4: Get Vercel Token${NC}"
echo "========================"
echo ""
echo "1. Open: https://vercel.com/account/tokens"
echo "2. Create new token with name: 'GitHub Actions'"
echo "3. Scope: Full Account"
echo "4. Copy the token"
echo ""
read -p "Paste your Vercel token: " -s VERCEL_TOKEN
echo ""

if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}❌ Token cannot be empty${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Token received${NC}"
echo ""

echo -e "${BLUE}Step 5: Configure GitHub Secrets${NC}"
echo "================================="
echo ""

# Check if logged in to GitHub
if ! gh auth status &> /dev/null; then
    echo "Please login to GitHub:"
    gh auth login
fi

echo "Setting secrets..."
echo ""

# Set secrets
echo "$VERCEL_TOKEN" | gh secret set VERCEL_TOKEN
echo "$ORG_ID" | gh secret set VERCEL_ORG_ID
echo "$PROJECT_ID" | gh secret set VERCEL_PROJECT_ID

echo -e "${GREEN}✓ GitHub secrets configured${NC}"
echo ""

echo -e "${BLUE}Step 6: Verify Configuration${NC}"
echo "============================"
echo ""

echo "GitHub Secrets:"
gh secret list | grep VERCEL

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure environment variables in Vercel dashboard"
echo "2. Create a test PR to trigger preview deployment"
echo "3. Check workflow: gh run list -w 'Deploy Preview'"
echo ""
echo "📚 Full documentation: .github/VERCEL_SETUP.md"
