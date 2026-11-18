import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL environment variable is missing. Set it in .env.local or in the deployment environment.',
    );
  }

  return url;
}

function createDatabase() {
  // `prepare: false` and `max: 1` keep the client compatible with Supabase's
  // transaction pooler (port 6543) and with serverless function instances.
  const client = postgres(getDatabaseUrl(), {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  return drizzle(client, { schema });
}

type Database = ReturnType<typeof createDatabase>;

// Cached on globalThis so hot-reloads and repeated imports reuse one pool.
const globalForDb = globalThis as unknown as {
  db: Database | undefined;
};

export function getDb() {
  // Created lazily: importing this module must not require DATABASE_URL, so
  // builds and unrelated routes keep working without database credentials.
  globalForDb.db ??= createDatabase();
  return globalForDb.db;
}
