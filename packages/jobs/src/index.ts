import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { z } from 'zod';

export const maintenanceQueueName = 'maro-maintenance';
export const maintenanceJobName = 'database-check';
export const maintenancePayloadSchema = z.object({ requestedAt: z.iso.datetime() }).strict();
export type MaintenancePayload = z.infer<typeof maintenancePayloadSchema>;

export function createRedis(url: string, role: 'producer' | 'worker' = 'producer') {
  return new Redis(url, {
    maxRetriesPerRequest: role === 'worker' ? null : 1,
    enableOfflineQueue: role === 'worker',
    connectTimeout: 3000,
    ...(role === 'producer' ? { commandTimeout: 3000 } : {}),
  });
}

export function createMaintenanceQueue(connection: Redis) {
  return new Queue<MaintenancePayload>(maintenanceQueueName, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 500 },
    },
  });
}
