import { QueueEvents } from 'bullmq';
import {
  createMaintenanceQueue,
  createRedis,
  maintenanceQueueName,
  maintenanceJobName,
} from '@maro/jobs';

const url = process.env.REDIS_URL;
if (!url) throw new Error('REDIS_URL is required.');
const redis = createRedis(url);
const eventRedis = createRedis(url, 'worker');
redis.on('error', (error) => console.error(error.message));
eventRedis.on('error', (error) => console.error(error.message));
const queue = createMaintenanceQueue(redis);
const events = new QueueEvents(maintenanceQueueName, { connection: eventRedis });
try {
  await events.waitUntilReady();
  const job = await queue.add(maintenanceJobName, { requestedAt: new Date().toISOString() });
  const result: unknown = await job.waitUntilFinished(events, 15000);
  console.log('Worker smoke check completed:', result);
} finally {
  await events.close();
  await queue.close();
  redis.disconnect();
  eventRedis.disconnect();
}
