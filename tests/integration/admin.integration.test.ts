import { randomUUID } from 'node:crypto';
import { mkdir, rmdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';
import { eq, inArray } from 'drizzle-orm';
import {
  createDatabase,
  staffUsers,
  staffSessions,
  products,
  productVariants,
  branchVariants,
  catalogAudit,
  productPairings,
} from '@maro/database';
import {
  createBranchRepository,
  createCatalogRepository,
  createCatalogEditor,
  createStaffAuth,
  hashPassword,
} from '@maro/backend';
import { buildApp } from '../../apps/api/src/app.js';

it('protects edits, persists prices atomically, rejects stale saves and revokes sessions', async () => {
  const db = createDatabase(process.env.DATABASE_URL!);
  const userId = randomUUID();
  const password = randomUUID();
  const uploads = resolve('.local', `test-uploads-${userId}`);
  await mkdir(uploads, { recursive: true });
  const editor = createCatalogEditor(db.db);
  const auth = createStaffAuth(db.db);
  const app = await buildApp(
    {
      branches: createBranchRepository(db.db),
      catalog: createCatalogRepository(db.db),
      editor,
      staffAuth: auth,
      uploadDir: uploads,
      checkReady: async () => {},
    },
    { logger: false },
  );
  let id: string | undefined;
  try {
    await db.db
      .insert(staffUsers)
      .values({ id: userId, username: userId, passwordHash: await hashPassword(password) });
    expect((await app.inject('/v1/staff/catalog')).statusCode).toBe(401);
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/v1/staff/login',
          payload: { username: userId, password: 'wrong' },
        })
      ).statusCode,
    ).toBe(401);
    const login = await app.inject({
      method: 'POST',
      url: '/v1/staff/login',
      payload: { username: userId, password },
    });
    expect(login.statusCode).toBe(200);
    const headers = { authorization: `Bearer ${login.json().token}` };
    const base = (await editor.read(true)).products[0]!;
    const payload = {
      name: { ar: 'منتج اختبار', en: 'Integration product' },
      categoryId: base.categoryId,
      prices: [{ label: 'standard', amount: 12.5 }],
      media: base.media,
      active: true,
      version: 1,
      featuredOrder: null,
      pairingIds: [],
      branchSlugs: ['faisal'],
    };
    expect(
      (await app.inject({ method: 'POST', url: '/v1/staff/products', payload })).statusCode,
    ).toBe(401);
    const created = await app.inject({
      method: 'POST',
      url: '/v1/staff/products',
      headers,
      payload,
    });
    expect(created.statusCode).toBe(200);
    id = created.json().id;
    expect((await editor.read()).products.find((p) => p.id === id)?.prices[0]?.amount).toBe(12.5);
    expect(
      (
        await app.inject({
          method: 'PUT',
          url: `/v1/staff/products/${id}`,
          headers,
          payload: { ...payload, prices: [{ label: 'standard', amount: -1 }] },
        })
      ).statusCode,
    ).toBe(400);
    const writes = await Promise.all(
      [13, 14].map((amount) =>
        app.inject({
          method: 'PUT',
          url: `/v1/staff/products/${id}`,
          headers,
          payload: { ...payload, prices: [{ label: 'standard', amount }] },
        }),
      ),
    );
    expect(writes.map((r) => r.statusCode).sort()).toEqual([200, 409]);
    const current = (await editor.read(true)).products.find((p) => p.id === id)!;
    expect(current.version).toBe(2);
    expect([13, 14]).toContain(current.prices[0]!.amount);
    const audit = await db.db.select().from(catalogAudit).where(eq(catalogAudit.productId, id!));
    expect(audit).toHaveLength(2);
    expect(
      (
        await app.inject({
          method: 'PUT',
          url: `/v1/staff/products/${id}`,
          headers,
          payload: { ...payload, version: 2, active: false },
        })
      ).statusCode,
    ).toBe(200);
    expect((await editor.read()).products.some((p) => p.id === id)).toBe(false);
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/v1/staff/images',
          headers,
          payload: { data: Buffer.from('<svg/>').toString('base64') },
        })
      ).statusCode,
    ).toBe(400);
    await app.inject({ method: 'POST', url: '/v1/staff/logout', headers });
    expect((await app.inject({ url: '/v1/staff/catalog', headers })).statusCode).toBe(401);
  } finally {
    await app.close();
    if (id)
      await db.db.transaction(async (tx) => {
        const variants = await tx
          .select()
          .from(productVariants)
          .where(eq(productVariants.productId, id!));
        await tx.delete(catalogAudit).where(eq(catalogAudit.productId, id!));
        await tx.delete(productPairings).where(eq(productPairings.productId, id!));
        if (variants.length)
          await tx.delete(branchVariants).where(
            inArray(
              branchVariants.variantId,
              variants.map((v) => v.id),
            ),
          );
        await tx.delete(productVariants).where(eq(productVariants.productId, id!));
        await tx.delete(products).where(eq(products.id, id!));
      });
    await db.db.delete(staffSessions).where(eq(staffSessions.userId, userId));
    await db.db.delete(staffUsers).where(eq(staffUsers.id, userId));
    await db.close();
    // Exact test-owned directory, never a computed parent or shared upload directory.
    await rmdir(uploads);
  }
});
