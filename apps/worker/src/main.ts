import { Worker } from 'bullmq';
import { pino } from 'pino';
import { z } from 'zod';
import { createDatabase } from '@maro/database';
import { createRedis, maintenanceQueueName } from '@maro/jobs';
import { processMaintenanceJob } from './processor.js';

const parsed = z
  .object({
    DATABASE_URL: z.url(),
    REDIS_URL: z.url(),
    WORKER_CONCURRENCY: z.coerce.number().int().min(1).max(20).default(2),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
  })
  .safeParse(process.env);
if (!parsed.success)
  throw new Error(
    `Invalid worker configuration: ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`,
  );
const env = parsed.data;
const logger = pino({ level: env.LOG_LEVEL });
const database = createDatabase(env.DATABASE_URL);
const redis = createRedis(env.REDIS_URL, 'worker');
redis.on('error', (error) => logger.error({ err: error }, 'Redis connection error'));
database.pool.on('error', (error) => logger.error({ err: error }, 'PostgreSQL pool error'));
const worker = new Worker(
  maintenanceQueueName,
  (job) =>
    processMaintenanceJob(job, async () => {
      await database.pool.query('SELECT 1');
    }),
  { connection: redis, concurrency: env.WORKER_CONCURRENCY },
);
worker.on('completed', (job) => logger.info({ jobId: job.id, name: job.name }, 'Job completed'));
worker.on('failed', (job, error) => logger.error({ jobId: job?.id, err: error }, 'Job failed'));
worker.on('error', (error) => logger.error({ err: error }, 'Worker error'));
worker.on('ready', () => logger.info({ queue: maintenanceQueueName }, 'Worker ready'));

let closing = false;
async function shutdown() {
  if (closing) return;
  closing = true;
  const timeout = setTimeout(() => process.exit(1), 15000).unref();
  try {
    await worker.close();
    redis.disconnect();
    await database.close();
  } finally {
    clearTimeout(timeout);
  }
}
process.once('SIGINT', () => void shutdown());
process.once('SIGTERM', () => void shutdown());
