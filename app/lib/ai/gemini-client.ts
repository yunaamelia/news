/**
 * Google Gemini 1.5 Flash Client
 * 
 * GRATIS untuk 1.500 requests/hari
 * Perfect untuk budget terbatas!
 * 
 * Pricing:
 * - Free tier: 15 RPM, 1.5K RPD, 1M RPD
 * - Paid: $0.075 input, $0.30 output per 1M tokens
 * 
 * Get API Key: https://aistudio.google.com/apikey
 */

import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY not set. Get free key: https://aistudio.google.com/apikey');
}

export interface GeminiGenerateOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

export interface GeminiResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private modelName: string;

  constructor(modelName: 'gemini-1.5-flash' | 'gemini-1.5-pro' = 'gemini-1.5-flash') {
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.modelName = modelName;
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  /**
   * Generate content with Gemini
   */
  async generate(options: GeminiGenerateOptions): Promise<GeminiResponse> {
    const {
      prompt,
      systemPrompt,
      temperature = 0.7,
      maxTokens = 2048,
      topP,
      topK,
    } = options;

    try {
      const generationConfig: GenerationConfig = {
        temperature,
        maxOutputTokens: maxTokens,
        ...(topP && { topP }),
        ...(topK && { topK }),
      };

      // Combine system prompt with user prompt
      const fullPrompt = systemPrompt 
        ? `${systemPrompt}\n\n${prompt}`
        : prompt;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig,
      });

      const response = result.response;
      const text = response.text();

      // Gemini doesn't always provide usage stats
      const usage = {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      };

      return {
        content: text,
        usage,
        model: this.modelName,
      };
    } catch (error: any) {
      console.error('Gemini generation error:', error);
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  /**
   * Generate financial news headline
   * Optimized for Indonesian financial news
   */
  async generateHeadline(topic: string): Promise<string> {
    const response = await this.generate({
      systemPrompt: `Anda adalah jurnalis keuangan profesional Indonesia.
Tugas: Buat headline berita yang singkat, informatif, dan menarik.
Format: Langsung berikan headline tanpa penjelasan tambahan.
Bahasa: Indonesia formal.
Panjang: Maksimal 15 kata.`,
      prompt: `Buatkan headline berita finansial tentang: ${topic}`,
      temperature: 0.7,
      maxTokens: 100,
    });

    return response.content.trim().replace(/^["']|["']$/g, '');
  }

  /**
   * Generate full financial article
   * Optimized for 150-300 word articles
   */
  async generateArticle(params: {
    topic: string;
    category: 'SAHAM' | 'KRIPTO' | 'ANALISIS' | 'EDUKASI' | 'REGULASI';
    targetWords?: number;
    includeData?: string;
  }): Promise<{ headline: string; content: string }> {
    const { topic, category, targetWords = 200, includeData } = params;

    const systemPrompt = `Anda adalah jurnalis keuangan profesional Indonesia.

Tugas: Tulis artikel berita kategori ${category} yang:
- Informatif dan objektif
- Menggunakan bahasa Indonesia formal tapi mudah dipahami
- Menyertakan data dan fakta jika tersedia
- Struktur: Piramida terbalik (info penting di awal)
- Panjang: ${targetWords} kata

Format output:
# [Headline]

[Paragraf 1: Lead - ringkasan 5W1H]

[Paragraf 2-3: Detail dan context]

[Paragraf 4: Analisis/implikasi]

Jangan tambahkan catatan atau komentar di luar artikel.`;

    const prompt = includeData
      ? `Topik: ${topic}\n\nData: ${includeData}\n\nTulis artikel lengkap.`
      : `Topik: ${topic}\n\nTulis artikel lengkap.`;

    const response = await this.generate({
      systemPrompt,
      prompt,
      temperature: 0.8,
      maxTokens: 1500,
    });

    // Parse headline and content
    const text = response.content.trim();
    const headlineMatch = text.match(/^#\s*(.+)$/m);
    const headline = headlineMatch 
      ? headlineMatch[1].trim() 
      : text.split('\n')[0].replace(/^#+\s*/, '').trim();
    
    const content = text
      .replace(/^#\s*.+$/m, '')
      .trim();

    return { headline, content };
  }

  /**
   * Generate multiple headlines and pick the best
   * Good for A/B testing
   */
  async generateMultipleHeadlines(topic: string, count: number = 3): Promise<string[]> {
    const response = await this.generate({
      systemPrompt: `Anda adalah jurnalis keuangan profesional.
Tugas: Buat ${count} variasi headline berita yang berbeda untuk topik yang sama.
Format: Satu headline per baris, tanpa nomor atau bullet.
Panjang: Maksimal 15 kata per headline.`,
      prompt: `Topik: ${topic}\n\nBuat ${count} headline berbeda:`,
      temperature: 0.9, // Higher for diversity
      maxTokens: 200,
    });

    const headlines = response.content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.match(/^\d+\./)) // Remove numbered lines
      .map(line => line.replace(/^[-•*]\s*/, '')) // Remove bullets
      .slice(0, count);

    return headlines;
  }

  /**
   * Batch generate articles (efficient for multiple topics)
   */
  async batchGenerate(topics: string[], category: string): Promise<Array<{ topic: string; headline: string; content: string }>> {
    const prompt = `Buat artikel singkat (100 kata) untuk setiap topik berikut:

${topics.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

Format setiap artikel:
---
# [Headline]
[Konten artikel]
---

Pisahkan dengan "---" antar artikel.`;

    const response = await this.generate({
      systemPrompt: `Anda adalah jurnalis keuangan. Tulis artikel kategori ${category}.`,
      prompt,
      temperature: 0.8,
      maxTokens: 4000,
    });

    // Parse batch response
    const articles = response.content
      .split('---')
      .map(article => article.trim())
      .filter(article => article.length > 10);

    return topics.map((topic, i) => {
      const article = articles[i] || '';
      const headlineMatch = article.match(/^#\s*(.+)$/m);
      const headline = headlineMatch ? headlineMatch[1].trim() : `Berita ${category}`;
      const content = article.replace(/^#\s*.+$/m, '').trim();

      return { topic, headline, content };
    });
  }

  /**
   * Calculate estimated cost (for paid usage)
   */
  calculateCost(promptTokens: number, completionTokens: number): number {
    const INPUT_COST = 0.075 / 1_000_000; // $0.075 per 1M tokens
    const OUTPUT_COST = 0.30 / 1_000_000; // $0.30 per 1M tokens
    
    return (promptTokens * INPUT_COST) + (completionTokens * OUTPUT_COST);
  }

  /**
   * Get model information
   */
  getModelInfo() {
    const pricing = this.modelName === 'gemini-1.5-flash'
      ? {
          input: '$0.075 per 1M tokens',
          output: '$0.30 per 1M tokens',
          freeTier: '15 RPM, 1.5K RPD, 1M RPD',
        }
      : {
          input: '$1.25 per 1M tokens',
          output: '$5.00 per 1M tokens',
          freeTier: '2 RPM, 50 RPD',
        };

    return {
      model: this.modelName,
      provider: 'Google AI Studio',
      contextWindow: 1_000_000, // 1M tokens!
      features: ['Fast', 'Cheap', 'Multilingual', 'Long Context'],
      pricing,
      apiKeyUrl: 'https://aistudio.google.com/apikey',
    };
  }
}

// Export singleton instances
export const geminiFlash = new GeminiClient('gemini-1.5-flash'); // RECOMMENDED for budget
export const geminiPro = new GeminiClient('gemini-1.5-pro'); // For complex analysis
