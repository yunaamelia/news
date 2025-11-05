/**
 * Test Qwen3-Next Production Client
 */

import { qwenClient } from "./app/lib/ai/qwen-client";

async function main() {
  console.log("🧪 Testing Qwen3-Next Production Client\n");
  console.log("📊 Model Info:");
  console.log(qwenClient.getModelInfo());
  console.log("\n" + "=".repeat(70) + "\n");

  // Test 1: Generate headline
  console.log("📝 Test 1: Generate Bitcoin headline");
  console.log("─".repeat(70));
  try {
    const headline = await qwenClient.generateHeadline(
      "Bitcoin mencapai harga tertinggi baru di $68,000"
    );
    console.log("✅ Headline:", headline);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
  console.log("\n");

  // Test 2: Generate full article
  console.log("📝 Test 2: Generate BBCA stock analysis article");
  console.log("─".repeat(70));
  try {
    const article = await qwenClient.generateArticle({
      topic: "Saham BBCA naik 3.5% mencapai Rp 9.850 per lembar",
      category: "SAHAM",
      targetWords: 150,
    });

    console.log("✅ Headline:", article.headline);
    console.log("\n📰 Content:");
    console.log(article.content);
    console.log("\n💰 Usage:");
    console.log("  Prompt tokens:", article.usage.promptTokens);
    console.log("  Completion tokens:", article.usage.completionTokens);
    console.log("  Total tokens:", article.usage.totalTokens);
    console.log(
      "  Estimated cost: $" +
        qwenClient.calculateCost(article.usage.totalTokens).toFixed(4)
    );
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
  console.log("\n");

  // Test 3: Custom generation
  console.log("📝 Test 3: Generate crypto analysis");
  console.log("─".repeat(70));
  try {
    const response = await qwenClient.generate({
      messages: [
        {
          role: "system",
          content:
            "Anda adalah analis kripto. Berikan analisis singkat dan jelas.",
        },
        {
          role: "user",
          content:
            "Analisis pergerakan harga Ethereum minggu ini dalam 3 poin utama.",
        },
      ],
      temperature: 0.7,
      maxTokens: 6000,
    });

    console.log("✅ Content:", response.content);
    console.log("\n📊 Finish reason:", response.finishReason);
    console.log(
      "💰 Cost: $" +
        qwenClient.calculateCost(response.usage.totalTokens).toFixed(4)
    );

    if (response.reasoningContent) {
      console.log(
        "\n🧠 Model had reasoning (length):",
        response.reasoningContent.length,
        "chars"
      );
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }

  console.log("\n" + "=".repeat(70));
  console.log("✅ All tests completed!");
}

main().catch(console.error);
