import { expect, it, vi } from 'vitest';
import { processMaintenanceJob } from './processor.js';

it('rejects unknown jobs without performing a database operation', async () => {
  const check = vi.fn();
  await expect(processMaintenanceJob({ name: 'send-message', data: {} }, check)).rejects.toThrow(
    'Unsupported',
  );
  expect(check).not.toHaveBeenCalled();
});
it('validates job payloads before executing', async () => {
  const check = vi.fn();
  await expect(
    processMaintenanceJob({ name: 'database-check', data: { requestedAt: 'invalid' } }, check),
  ).rejects.toThrow();
  expect(check).not.toHaveBeenCalled();
});
it('propagates dependency failures for queue retry', async () => {
  await expect(
    processMaintenanceJob(
      { name: 'database-check', data: { requestedAt: new Date().toISOString() } },
      async () => {
        throw new Error('Database offline');
      },
    ),
  ).rejects.toThrow('Database offline');
});
