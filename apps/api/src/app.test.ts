import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildApp, type AppDependencies } from './app.js';

const branch = {
  id: '00000000-0000-4000-8000-000000000001',
  slug: 'demo',
  name: 'Demo',
  address: 'Sample address',
  timezone: 'Africa/Cairo',
};
const apps: Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});
async function setup(overrides: Partial<AppDependencies> = {}) {
  const deps: AppDependencies = {
    branches: {
      list: vi.fn().mockResolvedValue([branch]),
      findBySlug: vi
        .fn()
        .mockImplementation(async (slug) => (slug === 'demo' ? branch : undefined)),
    },
    catalog: { listForBranch: vi.fn().mockResolvedValue([]) },
    checkReady: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  const app = await buildApp(deps, { logger: false, docs: true });
  apps.push(app);
  return { app, deps };
}

describe('public API boundaries', () => {
  it('returns only public branch fields', async () => {
    const { app } = await setup({
      branches: {
        list: async () => [{ ...branch, internalSecret: 'private' }],
        findBySlug: async () => branch,
      },
    });
    const result = await app.inject('/v1/branches');
    expect(result.statusCode).toBe(200);
    expect(result.json()).toEqual({ data: [branch] });
  });
  it('resolves the branch before reading its menu', async () => {
    const { app, deps } = await setup();
    const result = await app.inject('/v1/branches/demo/menu');
    expect(result.json()).toEqual({ branch, items: [] });
    expect(deps.catalog.listForBranch).toHaveBeenCalledWith(branch.id);
  });
  it('does not read a menu for an unknown branch', async () => {
    const { app, deps } = await setup();
    expect((await app.inject('/v1/branches/missing/menu')).statusCode).toBe(404);
    expect(deps.catalog.listForBranch).not.toHaveBeenCalled();
  });
  it('rejects invalid slugs before calling the repository', async () => {
    const { app, deps } = await setup();
    expect((await app.inject('/v1/branches/INVALID/menu')).statusCode).toBe(400);
    expect(deps.branches.findBySlug).not.toHaveBeenCalled();
  });
  it('keeps liveness healthy but reports failed dependencies as not ready', async () => {
    const { app } = await setup({
      checkReady: async () => {
        throw new Error('Unavailable dependency');
      },
    });
    expect((await app.inject('/health/live')).statusCode).toBe(200);
    expect((await app.inject('/health/ready')).statusCode).toBe(503);
  });
  it('does not expose internal database error details', async () => {
    const { app } = await setup({
      branches: {
        list: async () => {
          throw new Error('password=private');
        },
        findBySlug: async () => undefined,
      },
    });
    const result = await app.inject('/v1/branches');
    expect(result.statusCode).toBe(500);
    expect(result.body).not.toContain('private');
  });
  it('does not allow an arbitrary browser origin', async () => {
    const { app } = await setup();
    const result = await app.inject({
      url: '/v1/branches',
      headers: { origin: 'https://untrusted.example' },
    });
    expect(result.headers['access-control-allow-origin']).not.toBe('https://untrusted.example');
  });
  it('publishes schema-backed OpenAPI documentation in development', async () => {
    const { app } = await setup();
    const result = await app.inject('/docs/json');
    expect(result.statusCode).toBe(200);
    expect(result.json().paths).toHaveProperty('/v1/branches/{slug}/menu');
  });
});
