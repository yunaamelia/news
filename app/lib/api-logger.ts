/**
 * API Request Logger
 *
 * Logs API requests for monitoring and abuse detection
 * In production, this should be integrated with a proper logging service (Sentry, LogRocket, etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import { getClientIP } from "./rate-limit";

interface RequestLog {
  timestamp: string;
  method: string;
  path: string;
  ip: string | null;
  userId: string | null;
  userAgent: string | null;
  statusCode?: number;
  responseTime?: number;
  error?: string;
}

/**
 * Log API request with relevant details
 * In production, send to external logging service
 */
export function logApiRequest(
  req: NextRequest,
  data: {
    userId?: string | null;
    statusCode?: number;
    responseTime?: number;
    error?: string;
  }
) {
  const log: RequestLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.nextUrl.pathname,
    ip: getClientIP(req.headers),
    userId: data.userId || null,
    userAgent: req.headers.get("user-agent"),
    statusCode: data.statusCode,
    responseTime: data.responseTime,
    error: data.error,
  };

  // For now, just console.log
  // In production, send to Sentry, LogRocket, or custom logging service
  if (data.error || (data.statusCode && data.statusCode >= 400)) {
    console.error("[API Error]", JSON.stringify(log, null, 2));
  } else {
    console.log("[API Request]", JSON.stringify(log));
  }

  // TODO: Send to external logging service
  // Example: await sendToSentry(log);
  // Example: await sendToLogRocket(log);
}

/**
 * Measure response time for API requests
 */
export function createResponseTimer() {
  const start = Date.now();

  return {
    getElapsed: () => Date.now() - start,
  };
}

/**
 * Enhanced logging wrapper for API routes
 * Automatically logs request start, end, and errors
 *
 * @example
 * ```typescript
 * export const GET = withLogging(async (req) => {
 *   // Your handler logic
 *   return NextResponse.json({ data });
 * });
 * ```
 */
export function withLogging(
  handler: (req: NextRequest) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    const timer = createResponseTimer();

    try {
      const response = await handler(req);
      const responseTime = timer.getElapsed();

      // Log successful request
      logApiRequest(req, {
        statusCode: response.status,
        responseTime,
      });

      return response;
    } catch (error) {
      const responseTime = timer.getElapsed();

      // Log error
      logApiRequest(req, {
        statusCode: 500,
        responseTime,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  };
}

/**
 * Detect suspicious activity patterns
 * Returns true if activity looks suspicious
 */
export function detectSuspiciousActivity(
  ip: string | null,
  recentRequests: RequestLog[]
): {
  suspicious: boolean;
  reason?: string;
} {
  if (!ip) return { suspicious: false };

  const ipRequests = recentRequests.filter((r) => r.ip === ip);
  const last5Minutes = Date.now() - 5 * 60 * 1000;
  const recentIpRequests = ipRequests.filter(
    (r) => new Date(r.timestamp).getTime() > last5Minutes
  );

  // Check for rapid-fire requests
  if (recentIpRequests.length > 100) {
    return {
      suspicious: true,
      reason: "Excessive requests in 5 minutes",
    };
  }

  // Check for high error rate
  const errorCount = recentIpRequests.filter(
    (r) => r.statusCode && r.statusCode >= 400
  ).length;
  if (errorCount > 50) {
    return {
      suspicious: true,
      reason: "High error rate",
    };
  }

  // Check for rapid POST requests
  const postRequests = recentIpRequests.filter((r) => r.method === "POST");
  if (postRequests.length > 20) {
    return {
      suspicious: true,
      reason: "Excessive POST requests",
    };
  }

  return { suspicious: false };
}
