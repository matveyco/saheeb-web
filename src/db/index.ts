import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { getServerEnv } from '@/lib/env';

const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
};

function getPool() {
  if (globalForDb.pgPool) {
    return globalForDb.pgPool;
  }

  const { DATABASE_URL } = getServerEnv();
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForDb.pgPool = pool;
  }

  return pool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}

export * from './schema';
