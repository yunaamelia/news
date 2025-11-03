import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

// Prevent multiple instances in development (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Serverless-optimized Prisma Client with connection pooling
 * 
 * Uses Neon adapter for:
 * - Connection pooling via PgBouncer
 * - WebSocket connections for edge functions
 * - No Rust engine binaries (smaller bundle)
 * - Better cold start performance
 */
export const prisma =
  globalForPrisma.prisma ??
  (() => {
    // Check if pooled URL is available
    const connectionString = 
      process.env.POSTGRES_PRISMA_URL || // Vercel Postgres (pooled)
      process.env.DATABASE_URL;          // Fallback for local dev

    if (!connectionString) {
      throw new Error(
        "Database connection string not found. Please set POSTGRES_PRISMA_URL or DATABASE_URL"
      );
    }

    // Create connection pool for serverless
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);

    return new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
