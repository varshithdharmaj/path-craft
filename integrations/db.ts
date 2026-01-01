/**
 * Database Integration (Neon Postgres + Drizzle ORM)
 * 
 * Requires: DATABASE_URL or NEON_DATABASE_URL (Neon Postgres connection string)
 * 
 * This module provides database access using Drizzle ORM with Neon serverless Postgres.
 * The connection is initialized lazily to prevent errors during build time.
 */
import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// Lazy initialization to avoid connection during build time
let _db = null;
let _sql = null;

function getConnectionString() {
  return (
    process.env.DATABASE_URL ??
    process.env.NEON_DATABASE_URL ??
    process.env.NEXT_PUBLIC_DB_CONNECTION_STRING
  );
}

function getDb() {
  // Only initialize during runtime, not build time
  if (typeof window !== "undefined") {
    throw new Error("Database can only be accessed on the server");
  }

  if (!_db) {
    const connectionString = getConnectionString();
    
    if (!connectionString) {
      // Don't throw during build - only during runtime
      if (process.env.NODE_ENV === "production" || process.env.NEXT_PHASE === "phase-production-build") {
        // During build, return a mock that will fail gracefully
        console.warn("DATABASE_URL not set during build - this is expected if building without DB");
        return null;
      }
      throw new Error(
        "DATABASE_URL (or NEON_DATABASE_URL) is not set. Add it to your .env.local."
      );
    }

    _sql = neon(connectionString);
    _db = drizzle({ client: _sql });
  }

  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    try {
      const dbInstance = getDb();
      if (!dbInstance) {
        const connectionString = getConnectionString();
        if (!connectionString) {
          throw new Error("DATABASE_URL (or NEON_DATABASE_URL) is not set. Add it to your environment variables.");
        }
        throw new Error("Database connection failed. Check your DATABASE_URL connection string.");
      }
      return dbInstance[prop];
    } catch (error) {
      console.error("Database access error:", error);
      throw error;
    }
  },
});