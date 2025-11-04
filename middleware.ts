import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Get the response
    const response = NextResponse.next();

    // Security Headers
    const securityHeaders = {
      // Content Security Policy
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https://api.coingecko.com https://*.upstash.io",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),

      // Prevent XSS attacks
      "X-XSS-Protection": "1; mode=block",

      // Prevent clickjacking
      "X-Frame-Options": "DENY",

      // Prevent MIME type sniffing
      "X-Content-Type-Options": "nosniff",

      // Referrer Policy
      "Referrer-Policy": "strict-origin-when-cross-origin",

      // Permissions Policy
      "Permissions-Policy":
        "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    };

    // Apply security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // CORS headers for API routes
    if (req.nextUrl.pathname.startsWith("/api/")) {
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With"
      );
      response.headers.set("Access-Control-Max-Age", "86400");

      // Handle OPTIONS preflight
      if (req.method === "OPTIONS") {
        return new NextResponse(null, { status: 200, headers: response.headers });
      }
    }

    return response;
  },
  {
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    // Auth-protected routes
    "/watchlist",
    "/portfolio",
    "/dashboard/:path*",
    // API routes for security headers
    "/api/:path*",
  ],
};
