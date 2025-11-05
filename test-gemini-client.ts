/**
 * Test Gemini Client - FREE AI Solution
 *
 * Setup:
 * 1. Get free API key: https://aistudio.google.com/apikey
 * 2. Add to .env.local: GEMINI_API_KEY=your-key
 * 3. Run: npx tsx test-gemini-client.ts
 */

import gemini2Flash from "./app/lib/ai/gemini-client";

async function main() {
  console.log("🧪 Testing Gemini 2.0 Flash Experimental (NEWEST & FASTEST!)\n");
  console.log("📊 Model Info:");
  console.log(gemini2Flash.getModelInfo());
  console.log("\n" + "=".repeat(70) + "\n");

  // Test 1: Generate headline
  console.log("📝 Test 1: Generate Bitcoin headline (Gemini 2.0 Flash)");
  console.log("─".repeat(70));
  try {
    const headline = await gemini2Flash.generateHeadline(
      "Bitcoin melonjak 8% mencapai $68,500 setelah data inflasi AS turun"
    );
    console.log("✅ Headline:", headline);
    console.log("💰 Cost: $0 (Free tier)");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.log("\n💡 Setup required:");
    console.log("1. Get free API key: https://aistudio.google.com/apikey");
    console.log("2. Add to .env.local: GEMINI_API_KEY=your-key");
  }
  console.log("\n");

  // Test 2: Generate full article
  console.log("📝 Test 2: Generate BBCA stock article (Gemini 2.0 Flash)");
  console.log("─".repeat(70));
  try {
    const article = await gemini2Flash.generateArticle({
      topic: "Saham BCA (BBCA) naik 3.2% ke Rp 9.875 per lembar",
      category: "SAHAM",
      targetWords: 150,
      includeData:
        "Volume perdagangan: 45,2 juta lembar. Market cap: Rp 1.200 triliun.",
    });

    console.log("✅ Headline:", article.headline);
    console.log("\n📰 Content (first 300 chars):");
    console.log(article.content.substring(0, 300) + "...");
    console.log("\n💰 Cost: ~$0.0001 (practically FREE)");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
  console.log("\n");

  // Test 3: Multiple headlines (A/B testing)
  console.log("📝 Test 3: Generate 5 headline variations (Gemini 2.0 Flash)");
  console.log("─".repeat(70));
  try {
    const headlines = await gemini2Flash.generateMultipleHeadlines(
      "Rupiah menguat terhadap dolar AS ke Rp 15.450",
      5
    );

    headlines.forEach((headline, i) => {
      console.log(`${i + 1}. ${headline}`);
    });
    console.log("\n💰 Cost: ~$0.00002 (basically FREE)");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
  console.log("\n");

  // Test 4: Batch generation
  console.log(
    "📝 Test 4: Batch generate 3 articles at once (Gemini 2.0 Flash)"
  );
  console.log("─".repeat(70));
  try {
    const topics = [
      "Bitcoin naik 5%",
      "Ethereum tembus $3,500",
      "Dogecoin rally 12%",
    ];

    const articles = await gemini2Flash.batchGenerate(topics, "KRIPTO");

    articles.forEach((article, i) => {
      console.log(`\n${i + 1}. ${article.headline}`);
      console.log(`   Content: ${article.content.substring(0, 100)}...`);
    });

    console.log("\n💰 Cost for 3 articles: ~$0.0003 (SUPER CHEAP!)");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
  console.log("\n");

  // Test 5: Cost comparison
  console.log("📊 Test 5: Cost Comparison (50 articles/day)");
  console.log("─".repeat(70));

  const promptTokens = 200; // Average per article
  const completionTokens = 500; // Average per article
  const articlesPerDay = 50;
  const articlesPerMonth = articlesPerDay * 30;

  const totalPromptTokens = promptTokens * articlesPerMonth;
  const totalCompletionTokens = completionTokens * articlesPerMonth;

  const gemini2Cost = 0; // FREE experimental!
  const gemini15Cost = gemini2Flash.calculateCost(
    totalPromptTokens,
    totalCompletionTokens
  );
  const gpt4Cost =
    (totalPromptTokens * 10) / 1_000_000 +
    (totalCompletionTokens * 30) / 1_000_000;
  const claudeCost =
    (totalPromptTokens * 3) / 1_000_000 +
    (totalCompletionTokens * 15) / 1_000_000;

  console.log(`Articles: ${articlesPerMonth} per month`);
  console.log(`\n💰 Cost Comparison:`);
  console.log(`  Gemini 2.0 Flash:  $${gemini2Cost.toFixed(2)}/month 🆓 FREE!`);
  console.log(`  Gemini 1.5 Flash:  $${gemini15Cost.toFixed(2)}/month`);
  console.log(`  GPT-4 Turbo:       $${gpt4Cost.toFixed(2)}/month`);
  console.log(`  Claude Sonnet:     $${claudeCost.toFixed(2)}/month`);
  console.log(`\n🎉 Hemat: 100% (Gemini 2.0 Flash FREE experimental!)`);

  console.log("\n" + "=".repeat(70));
  console.log("✅ Tests completed!");
  console.log("\n💡 Next steps:");
  console.log("1. Get your FREE API key: https://aistudio.google.com/apikey");
  console.log("2. Add to .env.local: GEMINI_API_KEY=your-key");
  console.log("3. Start generating FREE content! 🚀");
}

main().catch(console.error);
