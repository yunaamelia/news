import { GoogleAuth } from "google-auth-library";

// Configuration
const ENDPOINT = "aiplatform.googleapis.com";
const REGION = "global";
const PROJECT_ID = "protean-tooling-476420-i8";

async function testVertexAI() {
  try {
    console.log("🔧 Getting authentication token...");

    const auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    console.log("✅ Authenticated with project:", PROJECT_ID);
    console.log("📡 Connecting to Qwen3-Next-80B-A3B-Thinking model...\n");

    // OpenAI-compatible endpoint format
    const endpoint = `https://${ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${REGION}/endpoints/openapi/chat/completions`;

    const prompt =
      "Buatkan 1 headline berita finansial singkat tentang pergerakan harga Bitcoin hari ini.";

    console.log("📝 Prompt:", prompt);
    console.log("⏳ Generating content...");
    console.log("🌐 Endpoint:", endpoint, "\n");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-next-80b-a3b-thinking-maas",
        stream: false,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    console.log("✅ SUCCESS! Model response:");
    console.log("─".repeat(60));
    console.log(result.choices?.[0]?.message?.content || "No response");
    console.log("─".repeat(60));

    console.log("\n📊 Usage Stats:");
    console.log("  Prompt tokens:", result.usage?.prompt_tokens || "N/A");
    console.log(
      "  Completion tokens:",
      result.usage?.completion_tokens || "N/A"
    );
    console.log("  Total tokens:", result.usage?.total_tokens || "N/A");
    console.log("  Model:", result.model);
    console.log("  Finish reason:", result.choices?.[0]?.finish_reason);

    // Show reasoning if available (A3B Thinking feature)
    if (result.choices?.[0]?.message?.reasoning_content) {
      console.log("\n🧠 Model Reasoning (first 500 chars):");
      console.log("─".repeat(60));
      const reasoning = result.choices[0].message.reasoning_content;
      console.log(reasoning.substring(0, 500) + "...");
      console.log("─".repeat(60));
    }

    console.log("\n✅ Qwen3-Next is ready to use!");
    console.log(
      "💡 Cost estimate: ~$" +
        ((result.usage?.total_tokens || 0) * 0.0000005).toFixed(4)
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Error:", err.message);
    console.error("\nFull error:", err);

    if (err.message?.includes("permission")) {
      console.log("\n💡 Tip: Make sure you have Vertex AI User role");
    }
    if (err.message?.includes("not found")) {
      console.log("\n💡 Tip: Check if model is available in your region");
    }
  }
}

testVertexAI();
