import { branchesResponseSchema, menuResponseSchema, catalogResponseSchema } from '@maro/contracts';
import type { z } from 'zod';

export class ApiError extends Error {
  constructor(public readonly status: number) {
    super(`API request failed (${status}).`);
  }
}

export function createApiClient(baseUrl: string, fetcher: typeof fetch = fetch) {
  async function get<T>(path: string, schema: z.ZodType<T>): Promise<T> {
    const response = await fetcher(new URL(path, baseUrl), {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new ApiError(response.status);
    return schema.parse(await response.json());
  }
  return {
    getCatalog: () => get('/v1/catalog', catalogResponseSchema),
    listBranches: () => get('/v1/branches', branchesResponseSchema),
    getMenu: (slug: string) =>
      get(`/v1/branches/${encodeURIComponent(slug)}/menu`, menuResponseSchema),
  };
}
