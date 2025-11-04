#!/bin/bash

# ==============================================
# GitHub Agent Environment Setup Script
# ==============================================
# This script configures GitHub repository for optimal AI Agent performance
# by setting up repository variables and guiding secret configuration.

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
  echo -e "${BLUE}================================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}================================================${NC}"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

# Start
print_header "🤖 GitHub Agent Environment Setup"
echo ""

# 1. Check prerequisites
print_info "Checking prerequisites..."

if [ ! -f .env.example ]; then
  print_error ".env.example not found!"
  exit 1
fi
print_success ".env.example found"

if ! command -v gh &> /dev/null; then
  print_error "GitHub CLI not installed!"
  echo "Install with: brew install gh (macOS) or https://cli.github.com/"
  exit 1
fi
print_success "GitHub CLI installed"

if ! command -v node &> /dev/null; then
  print_error "Node.js not installed!"
  exit 1
fi
print_success "Node.js installed ($(node --version))"

echo ""

# 2. Check GitHub authentication
print_info "Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
  print_warning "Not authenticated with GitHub CLI"
  echo "Run: gh auth login"
  exit 1
fi
print_success "Authenticated with GitHub"

echo ""

# 3. Get repository info
REPO_OWNER=$(gh repo view --json owner -q .owner.login)
REPO_NAME=$(gh repo view --json name -q .name)
print_info "Repository: $REPO_OWNER/$REPO_NAME"

echo ""

# 4. Set repository variables
print_header "📝 Setting Repository Variables"
echo ""

declare -A VARIABLES=(
  ["PROJECT_NAME"]="berita-finansial"
  ["PROJECT_TYPE"]="nextjs-fintech"
  ["STACK"]="nextjs16-react19-typescript-tailwindv4"
  ["FRAMEWORK"]="Next.js 16.0.1 (App Router)"
  ["RUNTIME"]="React 19"
  ["LANGUAGE"]="TypeScript 5+"
  ["STYLING"]="Tailwind CSS v4"
  ["DATABASE"]="PostgreSQL + Prisma 6"
  ["AUTH"]="NextAuth.js"
  ["DEPLOYMENT"]="Vercel"
  ["CODING_STYLE"]="airbnb-typescript"
  ["PRETTIER_CONFIG"]="enabled"
  ["ESLINT_CONFIG"]="next/core-web-vitals"
  ["TYPESCRIPT_STRICT"]="true"
  ["TEST_FRAMEWORK"]="jest+playwright"
  ["TEST_COVERAGE_TARGET"]="70"
  ["E2E_ENABLED"]="true"
  ["LIGHTHOUSE_PERFORMANCE"]="95"
  ["LIGHTHOUSE_ACCESSIBILITY"]="95"
  ["BUNDLE_SIZE_LIMIT"]="300KB"
)

for key in "${!VARIABLES[@]}"; do
  value="${VARIABLES[$key]}"
  print_info "Setting $key = $value"
  
  if gh variable set "$key" -b "$value" 2>/dev/null; then
    print_success "$key set"
  else
    print_warning "$key might already exist (this is OK)"
  fi
done

echo ""
print_success "All repository variables configured!"

echo ""

# 5. Guide for secrets
print_header "🔐 Secret Configuration Guide"
echo ""

print_warning "Secrets CANNOT be set automatically (security)"
print_info "Set them manually using GitHub CLI or Web UI"
echo ""

echo "Required secrets:"
echo ""
echo "1. NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
echo "   gh secret set NEXTAUTH_SECRET"
echo ""
echo "2. POSTGRES_PRISMA_URL (from Neon console)"
echo "   gh secret set POSTGRES_PRISMA_URL"
echo ""
echo "3. POSTGRES_URL_NON_POOLING (from Neon console)"
echo "   gh secret set POSTGRES_URL_NON_POOLING"
echo ""
echo "Optional secrets:"
echo ""
echo "4. GOOGLE_CLIENT_ID (if using Google OAuth)"
echo "   gh secret set GOOGLE_CLIENT_ID"
echo ""
echo "5. GOOGLE_CLIENT_SECRET (if using Google OAuth)"
echo "   gh secret set GOOGLE_CLIENT_SECRET"
echo ""
echo "6. COINGECKO_API_KEY (for crypto prices)"
echo "   gh secret set COINGECKO_API_KEY"
echo ""

read -p "Do you want to set secrets now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  print_info "Setting NEXTAUTH_SECRET..."
  
  # Generate secret
  SECRET=$(openssl rand -base64 32)
  echo "Generated secret: $SECRET"
  echo "$SECRET" | gh secret set NEXTAUTH_SECRET
  print_success "NEXTAUTH_SECRET set!"
  
  echo ""
  print_info "For other secrets, run:"
  echo "  gh secret set POSTGRES_PRISMA_URL"
  echo "  gh secret set POSTGRES_URL_NON_POOLING"
  echo ""
  
  read -p "Press Enter to continue..."
fi

echo ""

# 6. Verify setup
print_header "✅ Verifying Setup"
echo ""

print_info "Repository Variables:"
gh variable list
echo ""

print_info "Repository Secrets (names only):"
gh secret list
echo ""

# 7. Create local .env.local
if [ ! -f .env.local ]; then
  read -p "Create .env.local from template? (y/n) " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    cp .env.example .env.local
    print_success ".env.local created from .env.example"
    print_warning "Edit .env.local with your actual values!"
    echo ""
  fi
fi

# 8. Summary
print_header "🎉 Setup Complete!"
echo ""

echo "What was configured:"
echo "  ✅ 20+ repository variables for Agent context"
echo "  ✅ Instructions for setting secrets"
echo "  ✅ Local environment template"
echo ""

echo "Next steps:"
echo ""
echo "1. Set secrets (if not done):"
echo "   gh secret set POSTGRES_PRISMA_URL"
echo "   gh secret set POSTGRES_URL_NON_POOLING"
echo ""
echo "2. Edit .env.local with real values:"
echo "   nano .env.local"
echo ""
echo "3. Test environment:"
echo "   npm run dev"
echo ""
echo "4. Verify Agent context:"
echo "   Open GitHub Copilot and ask:"
echo "   'What is the tech stack of this project?'"
echo ""

print_success "GitHub Agent is now configured for maximum output! 🚀"
echo ""
