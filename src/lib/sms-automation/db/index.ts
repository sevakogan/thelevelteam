import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

let _db: DbInstance | null = null;

/**
 * Get the database instance (lazy initialization).
 * DATABASE_URL is the only required environment variable for this widget.
 */
export function getDb(): DbInstance {
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL environment variable is required. This is the only env var needed for the SMS Automation widget.'
      );
    }
    const client = postgres(databaseUrl, { max: 10 });
    _db = drizzle(client, { schema });
  }
  return _db;
}

/**
 * Backward-compatible db export.
 * Lazily delegates to getDb() so importing this module never crashes.
 */
export const db = new Proxy({} as DbInstance, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});

export * from './schema';
