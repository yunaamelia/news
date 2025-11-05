# 🔧 Google Cloud Setup Guide - Vertex AI Qwen3-Next

**Project:** protean-tooling-476420-i8  
**Purpose:** Setup gcloud CLI untuk AI Content Generation dengan Qwen3-Next  
**Date:** November 5, 2025

---

## 📋 Current Status

✅ gcloud CLI installed (v546.0.0)  
⚠️ Service account authentication needs configuration  
⚠️ Vertex AI API needs to be enabled

---

## 🚀 Setup Steps

### Option A: User Account Authentication (Recommended untuk Development)

**1. Login dengan Google Account Anda:**

```bash
gcloud auth login
```

- Browser akan terbuka
- Login dengan Google account yang punya akses ke project
- Grant permissions

**2. Set Project:**

```bash
gcloud config set project protean-tooling-476420-i8
```

**3. Set Default Region:**

```bash
gcloud config set compute/region us-central1
```

**4. Verify Authentication:**

```bash
gcloud auth list
gcloud config list
```

---

### Option B: Service Account (Recommended untuk Production)

**1. Create Service Account (via Cloud Console atau gcloud):**

**Via gcloud:**

```bash
# Create service account
gcloud iam service-accounts create ai-content-generator \
  --display-name="AI Content Generator" \
  --description="Service account for AI content generation"

# Grant necessary roles
gcloud projects add-iam-policy-binding protean-tooling-476420-i8 \
  --member="serviceAccount:ai-content-generator@protean-tooling-476420-i8.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding protean-tooling-476420-i8 \
  --member="serviceAccount:ai-content-generator@protean-tooling-476420-i8.iam.gserviceaccount.com" \
  --role="roles/aiplatform.serviceAgent"
```

**Via Cloud Console:**

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=protean-tooling-476420-i8
2. Click "Create Service Account"
3. Name: `ai-content-generator`
4. Grant roles:
   - `Vertex AI User`
   - `Vertex AI Service Agent`
5. Click "Create Key" → JSON format
6. Download key file

**2. Use Service Account Key:**

```bash
# Set environment variable (temporary)
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/downloaded-key.json"

# Or authenticate with key file
gcloud auth activate-service-account \
  --key-file=/path/to/downloaded-key.json

# Set as active
gcloud config set account ai-content-generator@protean-tooling-476420-i8.iam.gserviceaccount.com
```

**3. Save key file to project:**

```bash
# Move key to project directory (gitignored)
cd /home/senarokalie/Desktop/berita-finansial
mkdir -p .credentials
mv ~/Downloads/protean-tooling-*.json .credentials/gcp-service-account.json
chmod 600 .credentials/gcp-service-account.json
```

**4. Add to .gitignore:**

```bash
echo ".credentials/" >> .gitignore
echo "*.json" >> .gitignore  # If not already there
```

---

## 🔌 Enable Required APIs

**1. Enable Vertex AI API:**

```bash
gcloud services enable aiplatform.googleapis.com
```

**2. Enable other required services:**

```bash
# Cloud Resource Manager (for project management)
gcloud services enable cloudresourcemanager.googleapis.com

# Compute Engine (if needed for endpoints)
gcloud services enable compute.googleapis.com

# Cloud Storage (for model artifacts)
gcloud services enable storage.googleapis.com
```

**3. Verify enabled services:**

```bash
gcloud services list --enabled | grep -E "(aiplatform|compute|storage)"
```

---

## 🧪 Test Vertex AI Access

**1. Test with gcloud:**

```bash
# List available models in Vertex AI
gcloud ai models list --region=us-central1

# Or test with global region
gcloud ai models list --region=global
```

**2. Test Qwen3-Next model availability:**

```bash
# Try to get model info
gcloud ai models describe publishers/qwen/models/qwen3-next-80b-a3b-thinking-maas \
  --region=global
```

**3. Test with curl (API call):**

```bash
# Get access token
ACCESS_TOKEN=$(gcloud auth application-default print-access-token)

# Test API endpoint
curl -X POST \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  https://global-aiplatform.googleapis.com/v1/projects/protean-tooling-476420-i8/locations/global/publishers/qwen/models/qwen3-next-80b-a3b-thinking-maas:predict \
  -d '{
    "instances": [
      {
        "prompt": "Write a short financial news headline about stock market."
      }
    ]
  }'
```

---

## 📦 Install Node.js Dependencies

```bash
cd /home/senarokalie/Desktop/berita-finansial

# Install Vertex AI SDK
npm install @google-cloud/vertexai

# Install other AI SDKs (if not already)
npm install openai anthropic
```

---

## 🔐 Environment Variables Setup

**1. Create/Update .env.local:**

```bash
cat >> .env.local << 'EOF'

# Google Cloud / Vertex AI
GOOGLE_CLOUD_PROJECT=protean-tooling-476420-i8
GOOGLE_CLOUD_LOCATION=global
GOOGLE_APPLICATION_CREDENTIALS=./.credentials/gcp-service-account.json

# Qwen3-Next Model
QWEN_MODEL_ID=publishers/qwen/models/qwen3-next-80b-a3b-thinking-maas

# Keep existing OpenAI, Anthropic keys
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
EOF
```

**2. Verify .env.local:**

```bash
cat .env.local | grep GOOGLE
```

---

## ✅ Verification Checklist

Run these commands to verify everything is setup correctly:

```bash
# 1. Check gcloud authentication
echo "1. Authentication Status:"
gcloud auth list

# 2. Check active project
echo -e "\n2. Active Project:"
gcloud config get-value project

# 3. Check enabled services
echo -e "\n3. Vertex AI API Status:"
gcloud services list --enabled | grep aiplatform

# 4. Test API access
echo -e "\n4. Testing Vertex AI Access:"
gcloud ai models list --region=global 2>&1 | head -n 5

# 5. Check Node.js package
echo -e "\n5. Vertex AI SDK Installed:"
npm list @google-cloud/vertexai

# 6. Check environment variables
echo -e "\n6. Environment Variables:"
grep GOOGLE .env.local
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "PERMISSION_DENIED" Error

**Problem:** Service account doesn't have required permissions

**Solution:**

```bash
# Grant Vertex AI User role
gcloud projects add-iam-policy-binding protean-tooling-476420-i8 \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT@protean-tooling-476420-i8.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### Issue 2: "API not enabled" Error

**Problem:** Vertex AI API not enabled for project

**Solution:**

```bash
gcloud services enable aiplatform.googleapis.com
```

### Issue 3: "Model not found" Error

**Problem:** Qwen3-Next model not available in your region

**Solution:**

- Use `global` region instead of specific region
- Or check model availability: https://console.cloud.google.com/vertex-ai/model-garden

### Issue 4: Authentication with Node.js fails

**Problem:** GOOGLE_APPLICATION_CREDENTIALS not set correctly

**Solution:**

```bash
# Make sure path is absolute or relative to project root
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/.credentials/gcp-service-account.json"

# Or set in .env.local with absolute path
echo "GOOGLE_APPLICATION_CREDENTIALS=/home/senarokalie/Desktop/berita-finansial/.credentials/gcp-service-account.json" >> .env.local
```

---

## 🧪 Quick Test Script

Create test file to verify everything works:

```typescript
// test-vertex-ai.ts
import { VertexAI } from "@google-cloud/vertexai";

async function testVertexAI() {
  try {
    const vertex_ai = new VertexAI({
      project: "protean-tooling-476420-i8",
      location: "global",
    });

    const model = vertex_ai.preview.getGenerativeModel({
      model: "publishers/qwen/models/qwen3-next-80b-a3b-thinking-maas",
    });

    const prompt = "Write a brief financial news headline about Bitcoin.";

    console.log("Testing Qwen3-Next model...");
    const result = await model.generateContent(prompt);

    console.log("Success! Response:");
    console.log(result.response.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Error:", error);
  }
}

testVertexAI();
```

**Run test:**

```bash
npx tsx test-vertex-ai.ts
```

---

## 📚 Next Steps After Setup

Once setup is complete:

1. ✅ Update `AI_CONTENT_GENERATION_RESEARCH.md` dengan Qwen3-Next details
2. ✅ Implement multi-provider AI client (`app/lib/ai/providers/`)
3. ✅ Create smart routing logic for model selection
4. ✅ Build prompt template system
5. ✅ Setup cost tracking per provider
6. ✅ Implement Breaking News Bot MVP

---

## 📞 Need Help?

**Google Cloud Documentation:**

- Vertex AI: https://cloud.google.com/vertex-ai/docs
- Authentication: https://cloud.google.com/docs/authentication
- IAM Roles: https://cloud.google.com/vertex-ai/docs/general/access-control

**Qwen Documentation:**

- Model Card: https://console.cloud.google.com/vertex-ai/publishers/qwen/model-garden
- Qwen Blog: https://qwenlm.github.io/

**Project-Specific:**

- Service Account Console: https://console.cloud.google.com/iam-admin/serviceaccounts?project=protean-tooling-476420-i8
- Vertex AI Console: https://console.cloud.google.com/vertex-ai?project=protean-tooling-476420-i8
- API Dashboard: https://console.cloud.google.com/apis/dashboard?project=protean-tooling-476420-i8

---

**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Status:** Ready for execution
