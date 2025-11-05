# 🚀 Quick Start - FREE AI Content Generation

**Setup waktu: 5 menit | Cost: $0 (GRATIS!)**

---

## Step 1: Get FREE Gemini API Key (2 menit)

1. Buka: **https://aistudio.google.com/apikey**
2. Login dengan Google account
3. Klik **"Get API key"** → **"Create API key"**
4. Copy API key yang muncul

**✅ NO CREDIT CARD REQUIRED!**

---

## Step 2: Setup Environment (1 menit)

```bash
cd /home/senarokalie/Desktop/berita-finansial

# Add API key to .env.local
echo "GEMINI_API_KEY=your-api-key-here" >> .env.local

# Or edit manually:
nano .env.local
```

Tambahkan baris ini:
```env
GEMINI_API_KEY=AIzaSy...your-key-here
```

---

## Step 3: Test (2 menit)

```bash
# Run test
npx tsx test-gemini-client.ts
```

**Expected output:**
```
✅ Headline: Bitcoin Melonjak 8% Capai $68.500 Pasca Data Inflasi AS Turun
💰 Cost: $0 (Free tier)
```

---

## Step 4: Generate Your First Article (1 menit)

```typescript
import { geminiFlash } from './app/lib/ai/gemini-client';

// Generate headline
const headline = await geminiFlash.generateHeadline(
  'Saham BBRI naik 4% ke Rp 5.200'
);
console.log(headline);

// Generate full article
const article = await geminiFlash.generateArticle({
  topic: 'Saham BBRI naik 4% mencapai Rp 5.200 per lembar',
  category: 'SAHAM',
  targetWords: 150,
});
console.log(article.headline);
console.log(article.content);
```

---

## 💰 What You Get (FREE):

- ✅ **1,500 requests/day** (cukup untuk 1,500 artikel/hari!)
- ✅ **15 requests/minute**
- ✅ **No credit card** required
- ✅ **No expiration** (gratis selamanya selama dalam limit)
- ✅ **1M token context window** (super panjang!)

---

## 📊 Cost Examples:

| Articles/Day | Requests/Day | Cost/Month |
|--------------|--------------|------------|
| 10 | 10 | **$0** (free) |
| 50 | 50 | **$0** (free) |
| 100 | 100 | **$0** (free) |
| 200 | 200 | **$0** (free) |
| 1,500 | 1,500 | **$0** (free) |
| 3,000 | 3,000 | **$0.30** (paid) |

**🎉 Sampai 1,500 artikel/hari = 100% GRATIS!**

---

## 🔥 Pro Tips:

### 1. Batch Processing (hemat API calls)
```typescript
const topics = ['Bitcoin naik', 'Ethereum rally', 'Dogecoin pump'];
const articles = await geminiFlash.batchGenerate(topics, 'KRIPTO');
// 3 articles in 1 API call!
```

### 2. A/B Test Headlines
```typescript
const headlines = await geminiFlash.generateMultipleHeadlines(
  'Bitcoin tembus $70K',
  5 // Get 5 variations
);
// Pick the best one!
```

### 3. Caching (save tokens)
```typescript
// Cache responses for similar topics
const cache = new Map();
const cacheKey = 'bitcoin-rally';

if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}

const article = await geminiFlash.generateArticle({...});
cache.set(cacheKey, article);
```

---

## 🆚 Comparison vs Paid Solutions:

| Feature | Gemini Flash (FREE) | GPT-4 ($90/mo) | Qwen3 ($50/mo) |
|---------|---------------------|----------------|----------------|
| **Cost for 50 articles/day** | **$0** ✅ | $90/month | $50/month |
| Speed | Fast (2-5s) | Medium (5-10s) | Fast (3-6s) |
| Quality (ID) | ⭐⭐⭐⭐½ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Context | 1M tokens | 128K tokens | 256K tokens |
| Setup | 5 min | 10 min + CC | 30 min + CC |

**🏆 Winner untuk budget terbatas: Gemini Flash!**

---

## ⚙️ Production Setup (Optional):

### Rate Limiting (prevent quota exceeded)
```typescript
import pLimit from 'p-limit';

const limit = pLimit(15); // 15 requests/minute

const promises = topics.map(topic => 
  limit(() => geminiFlash.generateArticle({ topic, category: 'SAHAM' }))
);

const articles = await Promise.all(promises);
```

### Error Handling + Retry
```typescript
async function generateWithRetry(topic: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await geminiFlash.generateArticle({ topic, category: 'SAHAM' });
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
    }
  }
}
```

### Cost Tracking
```typescript
let totalCost = 0;

async function trackGeneration(topic: string) {
  const article = await geminiFlash.generateArticle({ topic, category: 'SAHAM' });
  
  const cost = geminiFlash.calculateCost(200, 500); // Estimate
  totalCost += cost;
  
  console.log(`Total cost so far: $${totalCost.toFixed(4)}`);
  return article;
}
```

---

## 🚨 Troubleshooting:

### Error: "API key not valid"
**Fix:** Check .env.local file, pastikan format:
```
GEMINI_API_KEY=AIzaSy...your-key
```

### Error: "Resource exhausted"
**Fix:** You hit rate limit (15 RPM). Wait 1 minute or implement rate limiting.

### Error: "GEMINI_API_KEY not set"
**Fix:**
```bash
# Check if .env.local exists
cat .env.local

# If not, create it
echo "GEMINI_API_KEY=your-key" > .env.local
```

---

## 📞 Support:

- **Get API Key:** https://aistudio.google.com/apikey
- **Documentation:** https://ai.google.dev/docs
- **Pricing:** https://ai.google.dev/pricing
- **Rate Limits:** https://ai.google.dev/gemini-api/docs/rate-limits

---

## ✅ Checklist:

- [ ] Get Gemini API key (https://aistudio.google.com/apikey)
- [ ] Add to .env.local
- [ ] Run test: `npx tsx test-gemini-client.ts`
- [ ] Generate first article
- [ ] Celebrate FREE content! 🎉

---

**Total Setup Time:** 5 minutes  
**Total Cost:** $0  
**ROI:** ∞ (infinite!)  

**🚀 Ready to generate 1,500 FREE articles per day!**
