/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis or similar
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    });
  }, 5 * 60 * 1000);
}

interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number;
  
  /**
   * Time window in seconds
   */
  window: number;
}

interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;
  
  /**
   * Remaining requests in the current window
   */
  remaining: number;
  
  /**
   * Time until the rate limit resets (in seconds)
   */
  resetIn: number;
}

/**
 * Rate limit a request based on identifier (IP, user ID, etc.)
 * 
 * @param identifier - Unique identifier for the client (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 * 
 * @example
 * ```typescript
 * const result = rateLimit(req.ip, { limit: 10, window: 60 });
 * if (!result.allowed) {
 *   return NextResponse.json(
 *     { error: "Too many requests" },
 *     { status: 429 }
 *   );
 * }
 * ```
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, window: 60 }
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.window * 1000;
  const key = `${identifier}:${config.limit}:${config.window}`;

  // Initialize or get existing entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  // Increment count
  store[key].count++;

  const allowed = store[key].count <= config.limit;
  const remaining = Math.max(0, config.limit - store[key].count);
  const resetIn = Math.ceil((store[key].resetTime - now) / 1000);

  return {
    allowed,
    remaining,
    resetIn,
  };
}

/**
 * Get the client identifier from request
 * Prioritizes: User ID > IP address > Random
 */
export function getClientIdentifier(
  req: Request,
  userId?: string
): string {
  // Use user ID if authenticated
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get IP from headers
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             req.headers.get('x-real-ip') || 
             'unknown';

  return `ip:${ip}`;
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /**
   * Strict rate limit for authentication endpoints
   * 5 requests per 15 minutes
   */
  AUTH: { limit: 5, window: 15 * 60 },

  /**
   * Standard rate limit for API endpoints
   * 100 requests per minute
   */
  API: { limit: 100, window: 60 },

  /**
   * Relaxed rate limit for public endpoints
   * 300 requests per minute
   */
  PUBLIC: { limit: 300, window: 60 },

  /**
   * Strict rate limit for write operations
   * 20 requests per minute
   */
  WRITE: { limit: 20, window: 60 },

  /**
   * Very strict for sensitive operations
   * 3 requests per 5 minutes
   */
  SENSITIVE: { limit: 3, window: 5 * 60 },
};
