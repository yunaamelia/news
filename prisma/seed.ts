import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create demo users
  const passwordHash = await hash("demo123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@berita-finansial.com" },
    update: {},
    create: {
      email: "admin@berita-finansial.com",
      name: "Admin User",
      password: passwordHash,
      role: "ADMIN",
      isPremium: true,
      emailVerified: new Date(),
    },
  });

  const premiumUser = await prisma.user.upsert({
    where: { email: "premium@example.com" },
    update: {},
    create: {
      email: "premium@example.com",
      name: "Premium User",
      password: passwordHash,
      role: "USER",
      isPremium: true,
      premiumUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      emailVerified: new Date(),
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Regular User",
      password: passwordHash,
      role: "USER",
      isPremium: false,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created demo users");

  // Create sample articles
  const articles = [
    {
      title: "Bitcoin Tembus $100,000, Analisis Teknikal Menunjukkan Potensi Rally Lebih Lanjut",
      slug: "bitcoin-tembus-100000-analisis-teknikal",
      excerpt: "Bitcoin mencapai milestone bersejarah dengan menembus level $100,000 untuk pertama kalinya. Analisis menunjukkan momentum bullish masih kuat.",
      content: `Bitcoin (BTC) telah membuat sejarah dengan menembus level psikologis $100,000 pada perdagangan hari ini. Pencapaian ini menandai era baru untuk cryptocurrency terbesar di dunia.

## Analisis Teknikal

Indikator teknikal menunjukkan sinyal positif:
- RSI berada di zona 68, menunjukkan momentum bullish yang sehat
- MACD menunjukkan golden cross baru-baru ini
- Volume trading meningkat 45% dalam 24 jam terakhir

## Faktor Pendorong

Beberapa faktor yang mendorong rally ini:
1. Adopsi institusional yang meningkat
2. Bitcoin ETF spot yang mencatat inflow rekor
3. Berkurangnya supply di exchange
4. Sentimen positif menjelang halving berikutnya

## Target Price

Analis memproyeksikan target berikutnya di $120,000 jika momentum terjaga.`,
      coverImage: "/images/bitcoin-rally.jpg",
      category: "KRIPTO",
      tags: ["Bitcoin", "Cryptocurrency", "Analisis Teknikal", "Bull Market"],
      author: "Budi Santoso",
      authorImage: "/images/authors/budi.jpg",
      status: "PUBLISHED",
      isPremium: false,
      views: 1523,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      title: "BBCA Rilis Laporan Keuangan Q4: Laba Bersih Naik 15% YoY",
      slug: "bbca-laporan-keuangan-q4-2024",
      excerpt: "Bank BCA melaporkan kinerja keuangan yang solid di Q4 2024 dengan pertumbuhan laba bersih mencapai 15% secara tahunan.",
      content: `PT Bank Central Asia Tbk (BBCA) mengumumkan hasil laporan keuangan Q4 2024 yang menunjukkan pertumbuhan solid di semua lini bisnis.

## Highlight Kinerja

- **Laba Bersih**: Rp 12,5 triliun (+15% YoY)
- **Total Aset**: Rp 1.250 triliun (+12% YoY)
- **NPL Ratio**: 0,4% (membaik dari 0,5%)
- **ROE**: 18,5%

## Dividen

Direksi mengusulkan dividen final sebesar Rp 250 per saham, yield ~3,2%.

## Outlook 2025

Manajemen optimis dengan target pertumbuhan kredit 10-12% di 2025, didorong oleh:
- Ekspansi digital banking
- Penetrasi UMKM
- Pertumbuhan wealth management`,
      coverImage: "/images/bca-stock.jpg",
      category: "SAHAM",
      tags: ["BBCA", "Perbankan", "Laporan Keuangan", "Dividen"],
      author: "Siti Rahayu",
      authorImage: "/images/authors/siti.jpg",
      status: "PUBLISHED",
      isPremium: false,
      views: 892,
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      title: "Panduan Lengkap Trading Saham untuk Pemula: Dari Nol Hingga Profit",
      slug: "panduan-trading-saham-pemula",
      excerpt: "Pelajari dasar-dasar trading saham dari nol. Artikel ini membahas strategi, manajemen risiko, dan tips praktis untuk investor pemula.",
      content: `Trading saham bisa menjadi cara yang menguntungkan untuk membangun wealth, tapi memerlukan pengetahuan dan disiplin yang tepat.

## 1. Memahami Dasar-Dasar

**Apa itu Saham?**
Saham adalah bukti kepemilikan perusahaan. Ketika Anda membeli saham, Anda menjadi pemilik sebagian perusahaan tersebut.

**Jenis Order:**
- Market Order: Eksekusi langsung di harga pasar
- Limit Order: Eksekusi di harga yang Anda tentukan
- Stop Loss: Order otomatis untuk membatasi kerugian

## 2. Analisis Fundamental

Pelajari cara membaca:
- Laporan keuangan (neraca, laba rugi, cash flow)
- Rasio keuangan (P/E, P/B, ROE, DER)
- Industri dan kompetitor

## 3. Analisis Teknikal

Tools yang perlu dikuasai:
- Candlestick patterns
- Support & resistance
- Moving averages
- Indikator (RSI, MACD, Bollinger Bands)

## 4. Manajemen Risiko

**Golden Rules:**
- Jangan investasikan uang yang tidak mampu Anda rugikan
- Diversifikasi portfolio (minimal 5-10 saham)
- Set stop loss di setiap posisi
- Risk per trade maksimal 2-3% dari modal

## 5. Psikologi Trading

- Kendalikan emosi
- Hindari FOMO (Fear of Missing Out)
- Jangan revenge trading
- Stick to your trading plan

## Resources

- Buku: "The Intelligent Investor" by Benjamin Graham
- Platform simulasi: investopedia.com/simulator
- Community: Forum diskusi saham Indonesia

Mulai dengan akun demo dulu untuk latihan sebelum trading dengan uang sungguhan.`,
      coverImage: "/images/stock-education.jpg",
      category: "EDUKASI",
      tags: ["Trading", "Saham", "Pemula", "Investasi", "Edukasi"],
      author: "Ahmad Wijaya",
      authorImage: "/images/authors/ahmad.jpg",
      status: "PUBLISHED",
      isPremium: false,
      views: 2156,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      title: "[PREMIUM] Strategi Options Trading: Maksimalkan Return dengan Risiko Terkendali",
      slug: "strategi-options-trading-advanced",
      excerpt: "Pelajari strategi options trading tingkat lanjut seperti covered calls, protective puts, dan iron condor untuk mengoptimalkan portfolio Anda.",
      content: `Options trading memberikan fleksibilitas untuk profit di berbagai kondisi pasar. Artikel premium ini membahas strategi advanced yang telah terbukti efektif.

## 1. Covered Call Strategy

**Kapan Digunakan:** Saat Anda hold saham dan ingin generate income tambahan.

**Cara Kerja:**
- Hold 100 saham XYZ @ Rp 1000
- Jual 1 contract call option strike Rp 1100
- Collect premium Rp 50/saham
- Max profit: (1100-1000) + 50 = Rp 150/saham

**Risk:** Limited upside jika saham rally melewati strike price.

## 2. Protective Put (Insurance)

Strategi ini seperti asuransi untuk portfolio Anda.

**Setup:**
- Hold 100 saham @ Rp 1000
- Beli 1 put option strike Rp 950
- Cost: Rp 30/saham

**Benefit:** Maksimal loss terbatas di Rp 80/saham (Rp 50 + Rp 30 premium)

## 3. Iron Condor

Strategi neutral untuk pasar sideways.

**Setup:**
- Sell 1 call @ strike 1100
- Buy 1 call @ strike 1150
- Sell 1 put @ strike 900
- Buy 1 put @ strike 850

**Profit Zone:** Selama harga berada di range 900-1100.

## 4. Bull Call Spread

Bullish strategy dengan risiko terbatas.

**Example:**
- Buy 1 call @ strike 1000 (Rp 100)
- Sell 1 call @ strike 1050 (Rp 60)
- Net debit: Rp 40
- Max profit: Rp 10 (50-40)
- Risk/Reward: 40/10 = 1:0.25

## Advanced Tips

1. **Implied Volatility:** Jual options saat IV tinggi, beli saat IV rendah
2. **Time Decay:** Theta bekerja untuk option sellers
3. **Greeks:** Master Delta, Gamma, Theta, Vega
4. **Position Sizing:** Max 5% portfolio per trade

## Risk Management

- Gunakan stop loss di 50% dari premium collected
- Close winners di 50-70% max profit
- Jangan hold sampai expiration
- Monitor posisi daily

Strategi ini memerlukan pemahaman mendalam tentang options. Praktikkan di paper trading terlebih dahulu.`,
      coverImage: "/images/options-trading.jpg",
      category: "ANALISIS",
      tags: ["Options", "Trading", "Advanced", "Strategi", "Premium"],
      author: "Dr. Financial Expert",
      authorImage: "/images/authors/expert.jpg",
      status: "PUBLISHED",
      isPremium: true, // Premium content
      views: 445,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      title: "OJK Keluarkan Regulasi Baru untuk Crypto Exchange: Apa Dampaknya?",
      slug: "ojk-regulasi-crypto-exchange-2024",
      excerpt: "Otoritas Jasa Keuangan merilis aturan baru yang mengatur operasional crypto exchange di Indonesia. Ini yang perlu Anda ketahui.",
      content: `Otoritas Jasa Keuangan (OJK) secara resmi mengeluarkan peraturan baru mengenai cryptocurrency exchange yang beroperasi di Indonesia.

## Poin-Poin Penting Regulasi

### 1. Lisensi Wajib
- Semua exchange harus terdaftar di Bappebti
- Modal minimal Rp 50 miliar
- Kantor operasional di Indonesia

### 2. Perlindungan Konsumen
- Wajib cold wallet 80% dari aset nasabah
- Insurance fund minimal 10% dari aset under custody
- Transparansi proof of reserves bulanan

### 3. KYC & AML
- Enhanced KYC untuk transaksi > Rp 100 juta
- Pelaporan transaksi mencurigakan ke PPATK
- Larangan anonymous trading

### 4. Aset yang Diizinkan
- Hanya crypto yang terdaftar di whitelist Bappebti
- Review berkala setiap 6 bulan
- Kriteria: market cap, likuiditas, teknologi

## Dampak ke Industri

**Positif:**
- Meningkatkan kepercayaan investor
- Standarisasi operasional
- Perlindungan konsumen lebih baik

**Negatif:**
- Biaya compliance meningkat
- Beberapa exchange kecil mungkin tutup
- Pilihan aset mungkin berkurang

## Timeline Implementasi

- Q1 2025: Periode transisi
- Q2 2025: Audit mandatory
- Q3 2025: Full compliance deadline

Exchange yang tidak comply akan diblokir akses.

## Saran untuk Trader

1. Pastikan exchange Anda terdaftar
2. Backup private keys
3. Diversifikasi ke beberapa exchange
4. Stay updated dengan perkembangan regulasi`,
      coverImage: "/images/regulation.jpg",
      category: "REGULASI",
      tags: ["OJK", "Regulasi", "Cryptocurrency", "Bappebti", "Compliance"],
      author: "Legal Analyst Team",
      authorImage: "/images/authors/team.jpg",
      status: "PUBLISHED",
      isPremium: false,
      views: 1234,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  console.log("✅ Created sample articles");

  // Create sample watchlist
  await prisma.watchlist.createMany({
    data: [
      {
        userId: regularUser.id,
        symbol: "BBCA",
        assetType: "SAHAM",
        name: "Bank Central Asia",
      },
      {
        userId: regularUser.id,
        symbol: "BBRI",
        assetType: "SAHAM",
        name: "Bank Rakyat Indonesia",
      },
      {
        userId: regularUser.id,
        symbol: "BTC",
        assetType: "KRIPTO",
        name: "Bitcoin",
      },
      {
        userId: premiumUser.id,
        symbol: "ETH",
        assetType: "KRIPTO",
        name: "Ethereum",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Created sample watchlists");

  // Create sample portfolio
  await prisma.portfolio.createMany({
    data: [
      {
        userId: premiumUser.id,
        symbol: "BBCA",
        assetType: "SAHAM",
        name: "Bank Central Asia",
        quantity: 100,
        buyPrice: 9500,
        buyDate: new Date("2024-01-15"),
        notes: "Blue chip banking stock",
      },
      {
        userId: premiumUser.id,
        symbol: "BTC",
        assetType: "KRIPTO",
        name: "Bitcoin",
        quantity: 0.5,
        buyPrice: 600000000,
        buyDate: new Date("2024-03-10"),
        notes: "Long term hold",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Created sample portfolios");

  // Create newsletter subscribers
  await prisma.newsletter.createMany({
    data: [
      {
        email: "subscriber1@example.com",
        frequency: "DAILY",
      },
      {
        email: "subscriber2@example.com",
        frequency: "WEEKLY",
      },
      {
        email: premiumUser.email,
        userId: premiumUser.id,
        frequency: "DAILY",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Created newsletter subscribers");

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- Users: 3 (1 admin, 1 premium, 1 regular)`);
  console.log(`- Articles: ${articles.length} (${articles.filter(a => a.isPremium).length} premium)`);
  console.log(`- Watchlists: 4 items`);
  console.log(`- Portfolios: 2 items`);
  console.log(`- Newsletter subscribers: 3`);
  console.log("\n🔐 Demo credentials:");
  console.log("Admin: admin@berita-finansial.com / demo123");
  console.log("Premium: premium@example.com / demo123");
  console.log("User: user@example.com / demo123");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
