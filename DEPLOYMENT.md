# 🚀 Deployment Guide - Berita Finansial

Panduan lengkap untuk deploy aplikasi Berita Finansial ke production.

## 📋 Pre-Deployment Checklist

- [ ] Semua tests passed
- [ ] Environment variables sudah disiapkan
- [ ] Database production sudah setup
- [ ] API keys sudah didapatkan (production keys)
- [ ] Domain sudah disiapkan (jika ada)
- [ ] SSL certificate (akan otomatis di Vercel)

## 🌐 Option 1: Deploy to Vercel (Recommended)

Vercel adalah platform terbaik untuk Next.js dengan setup yang sangat mudah.

### Step 1: Prepare Repository

```bash
# Pastikan kode sudah di-push ke GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub account
3. Click "New Project"
4. Import repository `berita-finansial`
5. Vercel akan otomatis detect Next.js

### Step 3: Configure Environment Variables

Di Vercel dashboard, tambahkan environment variables:

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
ALPHA_VANTAGE_API_KEY=your-key
COINGECKO_API_KEY=your-key
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Step 4: Setup Database

Recommended: **Vercel Postgres** atau **Supabase**

#### Vercel Postgres:

1. Di Vercel project → Storage → Create Database
2. Pilih Postgres
3. Copy connection string
4. Paste ke `DATABASE_URL`

#### Supabase:

1. Buka [supabase.com](https://supabase.com)
2. Create new project
3. Di Settings → Database → Connection string
4. Copy connection string
5. Paste ke `DATABASE_URL`

### Step 5: Deploy

```bash
# Vercel akan otomatis deploy saat push ke main branch
# Atau manual deploy:
vercel --prod
```

### Step 6: Post-Deploy

```bash
# Run Prisma migrations di production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## 🐳 Option 2: Deploy with Docker

### Create Dockerfile

File sudah tersedia di project.

### Build and Run

```bash
# Build image
docker build -t berita-finansial .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  berita-finansial
```

### Deploy to Cloud Provider

#### DigitalOcean:

```bash
# Create droplet
doctl compute droplet create berita-finansial \
  --size s-1vcpu-1gb \
  --image docker-20-04

# Deploy using Docker
```

#### AWS EC2:

```bash
# Launch EC2 instance
# Install Docker
# Pull and run image
```

## ☁️ Option 3: Deploy to VPS (Manual)

### Server Requirements

- Ubuntu 20.04+ atau Debian 11+
- Node.js 18+
- PostgreSQL 14+
- Nginx (reverse proxy)
- PM2 (process manager)

### Step 1: Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Step 2: Setup Database

```bash
# Login ke PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE berita_finansial;
CREATE USER bf_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE berita_finansial TO bf_user;
\q
```

### Step 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/berita-finansial.git
cd berita-finansial

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
nano .env.local  # Edit dengan production values

# Build application
npm run build

# Setup Prisma
npx prisma generate
npx prisma migrate deploy

# Start with PM2
pm2 start npm --name "berita-finansial" -- start
pm2 save
pm2 startup
```

### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/berita-finansial
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/berita-finansial /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## 📊 Post-Deployment Tasks

### 1. Monitor Application

```bash
# With PM2
pm2 logs berita-finansial
pm2 monit

# Check status
pm2 status
```

### 2. Setup Monitoring

Recommended tools:

- **Sentry** - Error tracking
- **Google Analytics** - User analytics
- **Uptime Robot** - Uptime monitoring
- **LogRocket** - Session replay

### 3. Performance Optimization

```bash
# Enable Gzip in Nginx
sudo nano /etc/nginx/nginx.conf
```

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### 4. Security Hardening

```bash
# Setup firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Install fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 5. Backup Strategy

```bash
# Database backup
pg_dump berita_finansial > backup.sql

# Automated daily backup
crontab -e
```

```cron
0 2 * * * pg_dump berita_finansial > /backups/db-$(date +\%Y\%m\%d).sql
```

## 🔄 CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

## 🌍 CDN Setup

### Cloudflare (Recommended)

1. Buka [cloudflare.com](https://cloudflare.com)
2. Add site
3. Update nameservers di domain registrar
4. Enable:
   - Auto Minify (JS, CSS, HTML)
   - Brotli compression
   - Browser Cache TTL: 4 hours
   - Always Use HTTPS

## 📈 Performance Monitoring

### Setup New Relic

```bash
npm install newrelic

# Create newrelic.js configuration
```

### Setup Google Analytics

Add to `app/layout.tsx`:

```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
```

## 🔒 Environment Variables Security

### Using Vercel

All env vars automatically encrypted.

### Using VPS

```bash
# Use environment file with restricted permissions
chmod 600 .env.local
chown www-data:www-data .env.local
```

## 📱 Testing Deployment

### Performance Testing

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=https://yourdomain.com
```

### Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 https://yourdomain.com/
```

## 🆘 Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db push
```

### Performance Issues

```bash
# Check PM2 logs
pm2 logs

# Check Nginx logs
tail -f /var/log/nginx/error.log
```

## ✅ Deployment Checklist

- [ ] Code pushed to repository
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Application built successfully
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Monitoring setup
- [ ] Backups configured
- [ ] Performance tested
- [ ] Security audit passed

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

Selamat! Aplikasi Anda sudah production-ready! 🎉
