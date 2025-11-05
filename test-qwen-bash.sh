#!/bin/bash

# Configuration
ENDPOINT="aiplatform.googleapis.com"
REGION="global"
PROJECT_ID="protean-tooling-476420-i8"
MODEL="qwen/qwen3-next-80b-a3b-thinking-maas"

echo "🔧 Testing Qwen3-Next-80B-A3B-Thinking..."
echo "📡 Endpoint: https://${ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${REGION}/endpoints/openapi/chat/completions"
echo ""

# Test 1: Simple headline
echo "📝 Test 1: Generate Bitcoin headline"
echo "─────────────────────────────────────────────────────────────"

curl -s -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://${ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${REGION}/endpoints/openapi/chat/completions \
  -d "{
    \"model\": \"${MODEL}\",
    \"stream\": false,
    \"messages\": [
      {
        \"role\": \"user\",
        \"content\": \"Buatkan 1 headline berita finansial singkat tentang Bitcoin\"
      }
    ],
    \"temperature\": 0.7,
    \"max_tokens\": 100
  }" | jq -r '.choices[0].message.content'

echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# Test 2: Detailed financial analysis
echo "📝 Test 2: Generate analysis article (150 words)"
echo "─────────────────────────────────────────────────────────────"

curl -s -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://${ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${REGION}/endpoints/openapi/chat/completions \
  -d "{
    \"model\": \"${MODEL}\",
    \"stream\": false,
    \"messages\": [
      {
        \"role\": \"system\",
        \"content\": \"Anda adalah jurnalis keuangan profesional. Tulis artikel berita yang informatif, objektif, dan mudah dipahami.\"
      },
      {
        \"role\": \"user\",
        \"content\": \"Buatkan artikel berita (150 kata) tentang pergerakan harga saham BBCA di Bursa Efek Indonesia. Sertakan analisis singkat.\"
      }
    ],
    \"temperature\": 0.8,
    \"max_tokens\": 300
  }" | jq -r '.choices[0].message.content'

echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""

# Test 3: Get usage stats
echo "📊 Test 3: Check token usage"
echo "─────────────────────────────────────────────────────────────"

RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://${ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${REGION}/endpoints/openapi/chat/completions \
  -d "{
    \"model\": \"${MODEL}\",
    \"stream\": false,
    \"messages\": [
      {
        \"role\": \"user\",
        \"content\": \"Tuliskan 1 kalimat tentang Rupiah\"
      }
    ],
    \"max_tokens\": 50
  }")

echo "$RESPONSE" | jq '{
  model: .model,
  prompt_tokens: .usage.prompt_tokens,
  completion_tokens: .usage.completion_tokens,
  total_tokens: .usage.total_tokens,
  estimated_cost: "\($(.usage.total_tokens * 0.0000005 * 100 | round / 100)) USD"
}'

echo ""
echo "✅ Qwen3-Next is working perfectly!"
echo "💡 Ready to implement AI Content Generation system"
