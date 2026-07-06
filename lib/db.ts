import { drizzle } from 'drizzle-orm/d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import * as schema from './schema';
import { ERROR_MESSAGES } from './errors';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  let d1: any = null;

  // 1. Try to get D1 database from OpenNext Cloudflare Context
  try {
    const context = getCloudflareContext();
    if (context && context.env) {
      d1 = context.env["fide-db"] || (context.env as any).DB;
    }
  } catch (error) {
    console.warn("[Drizzle] getCloudflareContext not available or failed:", error);
  }

  // 2. Fall back to process.env if needed (e.g., some scripts/local tools)
  if (!d1) {
    d1 = (process.env as any)["fide-db"] || (process.env as any).DB;
  }

  if (!d1) {
    throw new Error(ERROR_MESSAGES.DB_BINDING_MISSING);
  }

  dbInstance = drizzle(d1, { schema });
  return dbInstance;
}

// Export a Proxy that behaves like the db instance but resolves lazily
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(target, prop, receiver) {
    const client = getDb();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});
