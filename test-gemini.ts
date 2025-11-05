import { VertexAI } from "@google-cloud/vertexai";

async function testGemini() {
  try {
    console.log("🔧 Initializing Vertex AI...");

    const vertex_ai = new VertexAI({
      project: "protean-tooling-476420-i8",
      location: "us-central1",
    });

    console.log("✅ Vertex AI initialized");
    console.log("📡 Testing with Gemini Pro (built-in model)...\n");

    const model = vertex_ai.preview.getGenerativeModel({
      model: "gemini-pro",
    });

    const prompt =
      "Buatkan 1 headline berita finansial singkat tentang pergerakan harga Bitcoin hari ini.";

    console.log("📝 Prompt:", prompt);
    console.log("⏳ Generating content...\n");

    const result = await model.generateContent(prompt);

    console.log("✅ SUCCESS! Gemini Pro response:");
    console.log("─".repeat(60));
    console.log(
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response"
    );
    console.log("─".repeat(60));

    console.log("\n📊 Vertex AI connection is working!");
    console.log("Now need to enable Qwen3-Next from Model Garden");
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Error:", err.message);
    console.error("\nFull error:", err);
  }
}

testGemini();
