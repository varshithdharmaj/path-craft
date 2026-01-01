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
    const dbInstance = getDb();
    if (!dbInstance) {
      throw new Error("Database not initialized. Make sure DATABASE_URL is set in your .env.local file.");
    }
    return dbInstance[prop];
  },
});