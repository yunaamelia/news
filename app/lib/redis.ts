/**
 * Redis Client Configuration
 *
 * Best practices from Context7:
 * - Use Redis.fromEnv() for automatic environment variable detection
 * - No connection pooling needed (HTTP-based)
 * - Automatic retry with exponential backoff
 *
 * Environment variables required:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

import { Redis } from "@upstash/redis";

// Initialize Redis client with environment variables
export const redis = Redis.fromEnv();

// Cache configuration
export const CACHE_CONFIG = {
  // Market data TTL: 5 minutes (300 seconds)
  MARKET_TTL: 300,

  // Article cache TTL: 5 minutes
  ARTICLE_TTL: 300,

  // Session cache TTL: 30 minutes
  SESSION_TTL: 1800,
} as const;

// Cache key generators
export const getCacheKey = {
  cryptoPrices: (symbols: string[]) =>
    `crypto:prices:${symbols.sort().join(",")}`,

  stockPrices: (symbols: string[]) =>
    `stock:prices:${symbols.sort().join(",")}`,

  article: (slug: string) => `article:${slug}`,

  articleList: (category?: string, page: number = 1) =>
    category
      ? `articles:${category}:page:${page}`
      : `articles:all:page:${page}`,
};
