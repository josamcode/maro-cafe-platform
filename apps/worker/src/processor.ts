import { maintenanceJobName, maintenancePayloadSchema } from '@maro/jobs';

export async function processMaintenanceJob(
  job: { name: string; data: unknown },
  checkDatabase: () => Promise<void>,
) {
  if (job.name !== maintenanceJobName) throw new Error('Unsupported maintenance job.');
  maintenancePayloadSchema.parse(job.data);
  await checkDatabase();
  return { status: 'ok' as const };
}
