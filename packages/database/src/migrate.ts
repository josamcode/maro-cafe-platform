import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { createDatabase } from './index.js';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required. Run from the root with pnpm db:migrate.');
const database = createDatabase(url);
try {
  await migrate(database.db, {
    migrationsFolder: fileURLToPath(new URL('../migrations', import.meta.url)),
  });
  console.log('Database migrations applied.');
} finally {
  await database.close();
}
