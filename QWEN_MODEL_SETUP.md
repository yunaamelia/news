# ⚠️ Qwen3-Next Model Setup - IMPORTANT STEP

## 🚨 Current Issue: Model Not Found

**Error:** `Publisher Model was not found or your project does not have access to it`

**Root Cause:** Model Qwen3-Next belum di-enable/deploy dari Vertex AI Model Garden

---

## ✅ Solution: Enable Model dari Console

### Step 1: Buka Model Garden

Klik link ini untuk langsung ke Qwen3-Next model page:

```
https://console.cloud.google.com/vertex-ai/publishers/qwen/model-garden/qwen3-next-80b-a3b-thinking-maas?project=protean-tooling-476420-i8
```

### Step 2: Enable Model

1. Pada halaman model, cari tombol **"Enable"** atau **"Deploy"**
2. Pilih region: **us-central1** (atau global jika tersedia)
3. Klik **"Enable"** atau **"Continue"**
4. Tunggu proses enablement selesai (biasanya 1-5 menit)

### Step 3: Verify Enabled

Setelah model enabled, test dengan curl:

```bash
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://us-central1-aiplatform.googleapis.com/v1/projects/protean-tooling-476420-i8/locations/us-central1/endpoints/openapi/chat/completions \
  -d '{
    "model": "qwen/qwen3-next-80b-a3b-thinking-maas",
    "messages": [
      {
        "role": "user",
        "content": "Buatkan 1 headline berita finansial tentang Bitcoin"
      }
    ]
  }'
```

---

## 🎯 Alternative: Use Gemini API First

Jika Qwen3-Next belum tersedia, kita bisa mulai dengan Gemini (Google's model):

### Enable Gemini API:

```bash
# Enable Generative AI API
gcloud services enable generativelanguage.googleapis.com
```

### Test Gemini with OpenAI-compatible format:

```typescript
// test-gemini-openai.ts
import { GoogleAuth } from "google-auth-library";

async function testGemini() {
  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });

  const client = await auth.getClient();
  const projectId = await auth.getProjectId();
  const accessToken = await client.getAccessToken();

  const response = await fetch(
    `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/endpoints/openapi/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-1.5-flash",
        messages: [
          {
            role: "user",
            content: "Buatkan headline berita Bitcoin",
          },
        ],
      }),
    }
  );

  const result = await response.json();
  console.log(result);
}

testGemini();
```

---

## 📋 Checklist Troubleshooting

- [x] gcloud CLI installed and authenticated ✅
- [x] Project set to protean-tooling-476420-i8 ✅
- [x] Vertex AI API enabled ✅
- [x] IAM roles granted (aiplatform.admin) ✅
- [ ] **Qwen3-Next model enabled from Model Garden** ⚠️ **PERLU DILAKUKAN**
- [ ] Verify model accessible via API

---

## 🔍 How to Check Available Models

### Via gcloud CLI:

```bash
# List all available models in Model Garden
gcloud ai models list --region=us-central1 2>/dev/null | grep -i qwen

# Or check if model is accessible
gcloud ai models describe \
  publishers/qwen/models/qwen3-next-80b-a3b-thinking-maas \
  --region=us-central1
```

### Via REST API:

```bash
# Get model info
curl -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://us-central1-aiplatform.googleapis.com/v1/publishers/qwen/models/qwen3-next-80b-a3b-thinking-maas?region=us-central1"
```

---

## 💡 Expected Response After Model Enabled

When model is successfully enabled, you should get response like:

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Bitcoin Melonjak 5% Tembus $67,000 di Tengah Optimisme Pasar Kripto"
      },
      "finish_reason": "stop",
      "index": 0
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 20,
    "total_tokens": 35
  },
  "model": "qwen/qwen3-next-80b-a3b-thinking-maas"
}
```

---

## 🚀 Next Steps

1. **PRIORITY:** Enable Qwen3-Next from Model Garden console
2. Test API access dengan curl
3. Jika works, update test script
4. Implement multi-provider AI client
5. Start MVP Breaking News Bot

---

## 📞 Support Links

- **Model Garden Console:** https://console.cloud.google.com/vertex-ai/model-garden?project=protean-tooling-476420-i8
- **Qwen3-Next Page:** https://console.cloud.google.com/vertex-ai/publishers/qwen/model-garden/qwen3-next-80b-a3b-thinking-maas?project=protean-tooling-476420-i8
- **Vertex AI Docs:** https://cloud.google.com/vertex-ai/docs/start/use-models
- **Model Versions:** https://cloud.google.com/vertex-ai/generative-ai/docs/learn/model-versions

---

**Status:** Waiting for model enablement  
**Last Updated:** November 5, 2025
