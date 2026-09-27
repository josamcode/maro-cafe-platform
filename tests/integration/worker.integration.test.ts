import { randomUUID } from 'node:crypto';
import { Queue, QueueEvents, Worker } from 'bullmq';
import { expect, it } from 'vitest';
import { createRedis, maintenanceJobName } from '@maro/jobs';
import { createDatabase } from '@maro/database';
import { processMaintenanceJob } from '../../apps/worker/src/processor.js';

it('executes a queued database check through a real Redis worker', async () => {
  if (!process.env.DATABASE_URL || !process.env.REDIS_URL)
    throw new Error('DATABASE_URL and REDIS_URL are required.');
  const name = `maro-integration-${randomUUID()}`;
  const producer = createRedis(process.env.REDIS_URL);
  const consumer = createRedis(process.env.REDIS_URL, 'worker');
  const database = createDatabase(process.env.DATABASE_URL);
  producer.on('error', () => {});
  consumer.on('error', () => {});
  const queue = new Queue(name, { connection: producer });
  const events = new QueueEvents(name, { connection: consumer });
  const worker = new Worker(
    name,
    (job) =>
      processMaintenanceJob(job, async () => {
        await database.pool.query('SELECT 1');
      }),
    { connection: consumer },
  );
  worker.on('error', () => {});
  events.on('error', () => {});
  try {
    await events.waitUntilReady();
    const job = await queue.add(maintenanceJobName, { requestedAt: new Date().toISOString() });
    await expect(job.waitUntilFinished(events, 10000)).resolves.toEqual({ status: 'ok' });
  } finally {
    await worker.close();
    await events.close();
    await queue.obliterate({ force: true });
    await queue.close();
    producer.disconnect();
    consumer.disconnect();
    await database.close();
  }
});
