#!/bin/bash

# Berita Finansial - Setup Script
# This script helps set up the development environment

echo "🚀 Berita Finansial - Setup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL command not found. Make sure PostgreSQL is installed and running."
else
    echo "✅ PostgreSQL is installed"
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your configuration!"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo ""

# Ask if user wants to setup database
read -p "Do you want to set up the database now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Setting up database..."
    npx prisma db push
    echo ""
    
    read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌱 Seeding database..."
        npx prisma db seed
        echo ""
    fi
fi

echo "✅ Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local and add your API keys and database URL"
echo "2. Make sure PostgreSQL is running"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "Happy coding! 🎉"
