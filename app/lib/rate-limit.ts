/**
 * Rate Limiting with Upstash Redis
 *
 * Tier-based rate limiting for production use
 * Best practices from Context7 (@upstash/ratelimit docs)
 *
 * Rate Limit Tiers:
 * - Anonymous: 10 requests/minute
 * - Free users: 60 requests/minute
 * - Premium users: 300 requests/minute
 * - Admin: Unlimited
 */

import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Create rate limiters for different tiers
export const rateLimiters = {
  // Anonymous users (by IP)
  anonymous: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "ratelimit:anon",
  }),

  // Free tier users
  free: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    analytics: true,
    prefix: "ratelimit:free",
  }),

  // Premium tier users
  premium: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(300, "1 m"),
    analytics: true,
    prefix: "ratelimit:premium",
  }),

  // Stricter limits for write operations
  write: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    analytics: true,
    prefix: "ratelimit:write",
  }),

  // Very strict for comment spam prevention
  comment: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
    prefix: "ratelimit:comment",
  }),

  // Authentication endpoints (strict)
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "ratelimit:auth",
  }),
};

export type RateLimitTier = "anonymous" | "free" | "premium";
export type RateLimitType = "read" | "write" | "comment" | "auth";

interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;

  /**
   * Maximum requests allowed
   */
  limit: number;

  /**
   * Remaining requests in the current window
   */
  remaining: number;

  /**
   * Timestamp when the rate limit resets
   */
  reset: number;

  /**
   * Rate limit headers to include in response
   */
  headers: Record<string, string>;
}

/**
 * Check rate limit for a user/IP
 * @param identifier - User ID or IP address
 * @param tier - Rate limit tier (anonymous, free, premium)
 * @param type - Type of operation (read, write, comment, auth)
 * @returns Rate limit result with success flag and headers
 */
export async function checkRateLimit(
  identifier: string,
  tier: RateLimitTier = "anonymous",
  type?: RateLimitType
): Promise<RateLimitResult> {
  // Select appropriate limiter
  let limiter = rateLimiters[tier];

  // Override with operation-specific limiter if specified
  if (type === "write") {
    limiter = rateLimiters.write;
  } else if (type === "comment") {
    limiter = rateLimiters.comment;
  } else if (type === "auth") {
    limiter = rateLimiters.auth;
  }

  // Check rate limit
  const result = await limiter.limit(identifier);

  return {
    allowed: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
    headers: {
      "X-RateLimit-Limit": result.limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": new Date(result.reset).toISOString(),
    },
  };
}

/**
 * Get rate limit identifier from request
 * Uses user ID if authenticated, otherwise IP address
 */
export function getRateLimitIdentifier(
  userId: string | null,
  ip: string | null
): string {
  if (userId) return `user:${userId}`;
  if (ip) return `ip:${ip}`;
  return "unknown";
}

/**
 * Get rate limit tier based on user role
 */
export function getRateLimitTier(userRole?: string | null): RateLimitTier {
  if (!userRole) return "anonymous";
  if (userRole === "PREMIUM") return "premium";
  return "free";
}

/**
 * Extract IP address from request headers
 * Checks x-forwarded-for (Vercel) first, then x-real-ip, then fallback
 */
export function getClientIP(headers: Headers): string | null {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return null;
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use checkRateLimit instead
 */
export function getClientIdentifier(req: Request, userId?: string): string {
  if (userId) return `user:${userId}`;

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : req.headers.get("x-real-ip") || "unknown";

  return `ip:${ip}`;
}

/**
 * Preset rate limit configurations (legacy)
 * @deprecated Use rateLimiters directly
 */
export const RateLimitPresets = {
  AUTH: { limit: 5, window: 15 * 60 },
  API: { limit: 100, window: 60 },
  PUBLIC: { limit: 300, window: 60 },
  WRITE: { limit: 20, window: 60 },
  SENSITIVE: { limit: 3, window: 5 * 60 },
};
