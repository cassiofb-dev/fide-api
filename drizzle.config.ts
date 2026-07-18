import { defineConfig } from 'drizzle-kit';
import fs from 'node:fs';
import path from 'node:path';

function getLocalD1DBPath() {
  const d1Dir = path.resolve(process.cwd(), '.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
  if (fs.existsSync(d1Dir)) {
    const files = fs.readdirSync(d1Dir);
    const dbFile = files.find((f) => f.endsWith('.sqlite') && f !== 'metadata.sqlite');
    if (dbFile) {
      return path.join(d1Dir, dbFile);
    }
  }
  return '';
}

export default defineConfig({
  schema: './lib/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: getLocalD1DBPath(),
  },
});
