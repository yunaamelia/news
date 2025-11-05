/**
 * Qwen3-Next-80B-A3B-Thinking Client for Vertex AI
 *
 * OpenAI-compatible API wrapper for Qwen3-Next model via Google Vertex AI
 * Model: qwen/qwen3-next-80b-a3b-thinking-maas (MaaS endpoint)
 *
 * Features:
 * - Thinking/Reasoning model (80B params, 3B activated per inference)
 * - 256K context window
 * - Global multi-region endpoint
 * - Cost: ~$0.50-1.00 per million tokens
 */

import { GoogleAuth } from "google-auth-library";

// Configuration
const ENDPOINT = process.env.VERTEX_AI_ENDPOINT || "aiplatform.googleapis.com";
const REGION = process.env.VERTEX_AI_REGION || "global";
const PROJECT_ID =
  process.env.GOOGLE_CLOUD_PROJECT || "protean-tooling-476420-i8";
const MODEL_ID = "qwen/qwen3-next-80b-a3b-thinking-maas";

export interface QwenMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface QwenGenerateOptions {
  messages: QwenMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface QwenResponse {
  content: string;
  reasoningContent?: string;
  finishReason: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  id: string;
}

export class QwenVertexAIClient {
  private auth: GoogleAuth;
  private endpoint: string;

  constructor() {
    this.auth = new GoogleAuth({
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });
    this.endpoint = `https://${ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${REGION}/endpoints/openapi/chat/completions`;
  }

  /**
   * Generate content using Qwen3-Next model
   *
   * @param options - Generation options
   * @returns Generated content and metadata
   */
  async generate(options: QwenGenerateOptions): Promise<QwenResponse> {
    const {
      messages,
      temperature = 0.7,
      maxTokens = 5000, // High default for A3B Thinking model (reasoning overhead)
      stream = false,
      topP,
      frequencyPenalty,
      presencePenalty,
    } = options;

    try {
      const client = await this.auth.getClient();
      const accessToken = await client.getAccessToken();

      if (!accessToken.token) {
        throw new Error("Failed to get access token");
      }

      const requestBody: any = {
        model: MODEL_ID,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream,
      };

      // Add optional parameters if provided
      if (topP !== undefined) requestBody.top_p = topP;
      if (frequencyPenalty !== undefined)
        requestBody.frequency_penalty = frequencyPenalty;
      if (presencePenalty !== undefined)
        requestBody.presence_penalty = presencePenalty;

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Qwen API error ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      // Extract response data
      const choice = result.choices?.[0];
      if (!choice) {
        throw new Error("No response from Qwen model");
      }

      return {
        content: choice.message?.content || "",
        reasoningContent: choice.message?.reasoning_content,
        finishReason: choice.finish_reason || "unknown",
        usage: {
          promptTokens: result.usage?.prompt_tokens || 0,
          completionTokens: result.usage?.completion_tokens || 0,
          totalTokens: result.usage?.total_tokens || 0,
        },
        model: result.model || MODEL_ID,
        id: result.id || "",
      };
    } catch (error) {
      console.error("Qwen generation error:", error);
      throw error;
    }
  }

  /**
   * Generate financial news headline
   * Optimized prompt for Indonesian financial news
   */
  async generateHeadline(topic: string): Promise<string> {
    const response = await this.generate({
      messages: [
        {
          role: "system",
          content:
            "Anda adalah jurnalis keuangan profesional. Buat headline berita yang singkat, informatif, dan menarik. Langsung berikan headline tanpa penjelasan.",
        },
        {
          role: "user",
          content: `Buatkan 1 headline berita finansial tentang: ${topic}. Maksimal 15 kata.`,
        },
      ],
      temperature: 0.7,
      maxTokens: 5000,
    });

    return response.content.trim();
  }

  /**
   * Generate full financial article
   * Optimized for 150-300 word financial analysis
   */
  async generateArticle(params: {
    topic: string;
    category: string;
    targetWords?: number;
  }): Promise<{
    headline: string;
    content: string;
    usage: QwenResponse["usage"];
  }> {
    const { topic, category, targetWords = 200 } = params;

    const response = await this.generate({
      messages: [
        {
          role: "system",
          content: `Anda adalah jurnalis keuangan profesional Indonesia. Tulis artikel berita yang:
- Informatif dan objektif
- Menggunakan bahasa Indonesia formal
- Menyertakan data dan fakta
- Mudah dipahami pembaca awam
- Format: Headline diikuti konten artikel`,
        },
        {
          role: "user",
          content: `Buatkan artikel berita kategori ${category} tentang: ${topic}. 
Target ${targetWords} kata. 
Format:
# [Headline]

[Konten artikel]`,
        },
      ],
      temperature: 0.8,
      maxTokens: 8000,
    });

    // Parse headline and content
    const text = response.content.trim();
    const lines = text.split("\n");
    const headlineMatch = text.match(/^#\s*(.+)$/m);
    const headline = headlineMatch
      ? headlineMatch[1].trim()
      : lines[0].replace("#", "").trim();
    const content = text.replace(/^#\s*.+$/m, "").trim();

    return {
      headline,
      content,
      usage: response.usage,
    };
  }

  /**
   * Calculate estimated cost for token usage
   * Based on Qwen3-Next pricing: ~$0.50-1.00 per million tokens
   */
  calculateCost(totalTokens: number): number {
    const COST_PER_MILLION = 0.75; // Average estimate
    return (totalTokens / 1_000_000) * COST_PER_MILLION;
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      model: MODEL_ID,
      endpoint: this.endpoint,
      region: REGION,
      project: PROJECT_ID,
      contextWindow: 256000,
      architecture: "Ultra-Sparse MoE (80B/3B)",
      features: ["Reasoning/Thinking", "Long Context", "Multilingual"],
      costEstimate: "$0.50-1.00 per million tokens",
    };
  }
}

// Export singleton instance
export const qwenClient = new QwenVertexAIClient();
