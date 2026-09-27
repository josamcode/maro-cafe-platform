import { expect, it, vi } from 'vitest';
import { createApiClient } from './index.js';

it('rejects malformed successful API responses', async () => {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValue(
      new Response(JSON.stringify({ data: [{ id: 'not-a-uuid' }] }), { status: 200 }),
    );
  await expect(createApiClient('http://localhost:4000', fetcher).listBranches()).rejects.toThrow();
});
it('preserves an HTTP failure as a typed error', async () => {
  const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status: 404 }));
  await expect(
    createApiClient('http://localhost:4000', fetcher).getMenu('missing'),
  ).rejects.toMatchObject({ status: 404 });
});
