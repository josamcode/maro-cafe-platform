import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

export function createDatabase(connectionString: string) {
  const pool = new pg.Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 30000,
    statement_timeout: 5000,
  });
  const db = drizzle(pool, { schema });
  return { db, pool, close: () => pool.end() };
}

export type Database = ReturnType<typeof createDatabase>['db'];
export * from './schema.js';
