import { createDatabase } from '@maro/database';
import {
  createBranchRepository,
  createCatalogRepository,
  createCatalogEditor,
  createStaffAuth,
  createGrowthService,
} from '@maro/backend';
import { resolve } from 'node:path';
import { createRedis } from '@maro/jobs';
import { buildApp } from './app.js';
import { apiEnvSchema } from './env.js';

const parsed = apiEnvSchema.safeParse(process.env);
if (!parsed.success)
  throw new Error(
    `Invalid API configuration: ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`,
  );
const env = parsed.data;
const database = createDatabase(env.DATABASE_URL);
const editor = createCatalogEditor(database.db);
const app = await buildApp(
  {
    branches: createBranchRepository(database.db),
    catalog: createCatalogRepository(database.db),
    editor,
    growth: createGrowthService(database.db, editor),
    staffAuth: createStaffAuth(database.db),
    uploadDir: resolve(env.UPLOAD_DIR),
    async checkReady() {
      await Promise.all([database.pool.query('SELECT 1'), redis.ping()]);
    },
  },
  { webOrigin: env.WEB_ORIGIN, docs: env.NODE_ENV !== 'production', logLevel: env.LOG_LEVEL },
);
const redis = createRedis(env.REDIS_URL);
redis.on('error', (error) => app.log.error({ err: error }, 'Redis connection error'));
database.pool.on('error', (error) => app.log.error({ err: error }, 'PostgreSQL pool error'));
app.addHook('onClose', async () => {
  redis.disconnect();
  await database.close();
});

let closing = false;
async function shutdown() {
  if (closing) return;
  closing = true;
  const timeout = setTimeout(() => process.exit(1), 10000).unref();
  try {
    await app.close();
  } finally {
    clearTimeout(timeout);
  }
}
process.once('SIGINT', () => void shutdown());
process.once('SIGTERM', () => void shutdown());
try {
  await app.listen({ port: env.PORT ?? env.API_PORT, host: env.API_HOST });
} catch (error) {
  app.log.error(error);
  await app.close();
  process.exitCode = 1;
}
