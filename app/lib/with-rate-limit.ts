/**
 * Rate Limiting Middleware for API Routes
 *
 * Wraps API route handlers with automatic rate limiting
 * Returns 429 Too Many Requests with retry info when limit exceeded
 */

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./auth";
import {
  checkRateLimit,
  getClientIP,
  getRateLimitIdentifier,
  getRateLimitTier,
  type RateLimitType,
} from "./rate-limit";

type RouteHandler = (
  req: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse> | NextResponse;

interface RateLimitOptions {
  /**
   * Type of operation (read, write, comment, auth)
   * Defaults to 'read' for GET, 'write' for POST/PUT/PATCH/DELETE
   */
  type?: RateLimitType;

  /**
   * Skip rate limiting for admin users
   * @default true
   */
  skipForAdmin?: boolean;
}

/**
 * Wraps an API route handler with rate limiting
 *
 * @example
 * ```typescript
 * export const POST = withRateLimit(
 *   async (req) => {
 *     // Your handler logic
 *     return NextResponse.json({ success: true });
 *   },
 *   { type: "comment" }
 * );
 * ```
 */
export function withRateLimit(
  handler: RouteHandler,
  options: RateLimitOptions = {}
): RouteHandler {
  return async (
    req: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    const { type, skipForAdmin = true } = options;

    // Get session for user identification
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;
    const userRole =
      session?.user && "role" in session.user
        ? (session.user.role as string)
        : null;

    // Skip rate limiting for admins if configured
    if (skipForAdmin && userRole === "ADMIN") {
      return handler(req, context);
    }

    // Get client identifier (user ID or IP)
    const ip = getClientIP(req.headers);
    const identifier = getRateLimitIdentifier(userId, ip);

    // Determine tier based on user role
    const tier = getRateLimitTier(userRole);

    // Determine operation type if not specified
    let operationType = type;
    if (!operationType) {
      const method = req.method;
      if (method === "GET" || method === "HEAD") {
        operationType = "read";
      } else {
        operationType = "write";
      }
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(
      identifier,
      tier,
      operationType
    );

    // If rate limit exceeded, return 429
    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.reset);
      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan",
          message: `Anda telah mencapai batas rate limit. Silakan coba lagi dalam ${retryAfter} detik.`,
          retryAfter,
          resetAt: resetDate.toISOString(),
        },
        {
          status: 429,
          headers: {
            ...rateLimitResult.headers,
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }

    // Rate limit passed, call the handler
    const response = await handler(req, context);

    // Add rate limit headers to successful responses
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

/**
 * Check rate limit without wrapping handler
 * Useful for manual rate limit checks
 */
export async function checkApiRateLimit(
  req: NextRequest,
  type?: RateLimitType
): Promise<{
  allowed: boolean;
  response?: NextResponse;
  headers: Record<string, string>;
}> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;
  const userRole =
    session?.user && "role" in session.user
      ? (session.user.role as string)
      : null;
  const ip = getClientIP(req.headers);
  const identifier = getRateLimitIdentifier(userId, ip);
  const tier = getRateLimitTier(userRole);

  const result = await checkRateLimit(identifier, tier, type);

  if (!result.allowed) {
    const resetDate = new Date(result.reset);
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);

    return {
      allowed: false,
      headers: result.headers,
      response: NextResponse.json(
        {
          error: "Terlalu banyak permintaan",
          message: `Anda telah mencapai batas rate limit. Silakan coba lagi dalam ${retryAfter} detik.`,
          retryAfter,
          resetAt: resetDate.toISOString(),
        },
        {
          status: 429,
          headers: {
            ...result.headers,
            "Retry-After": retryAfter.toString(),
          },
        }
      ),
    };
  }

  return {
    allowed: true,
    headers: result.headers,
  };
}
