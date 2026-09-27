import { randomUUID } from 'node:crypto';
import { expect, it } from 'vitest';
import { eq, inArray } from 'drizzle-orm';
import {
  createDatabase,
  branches,
  categories,
  products,
  productVariants,
  branchVariants,
} from '@maro/database';
import { createBranchRepository, createCatalogRepository } from '@maro/backend';

it('keeps branch pricing separate and excludes unavailable products', async () => {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for integration tests.');
  const database = createDatabase(process.env.DATABASE_URL);
  const ids = {
    a: randomUUID(),
    b: randomUUID(),
    category: randomUUID(),
    product: randomUUID(),
    variant: randomUUID(),
  };
  try {
    await database.db.transaction(async (tx) => {
      await tx.insert(branches).values([
        { id: ids.a, slug: `test-${ids.a}`, name: 'Integration A', address: 'Test only' },
        { id: ids.b, slug: `test-${ids.b}`, name: 'Integration B', address: 'Test only' },
      ]);
      await tx
        .insert(categories)
        .values({ id: ids.category, slug: `test-${ids.category}`, name: 'Integration category' });
      await tx.insert(products).values({
        id: ids.product,
        slug: `test-${ids.product}`,
        categoryId: ids.category,
        name: 'Integration drink',
      });
      await tx
        .insert(productVariants)
        .values({ id: ids.variant, productId: ids.product, name: 'Regular' });
      await tx.insert(branchVariants).values([
        { branchId: ids.a, variantId: ids.variant, priceMinor: 10000 },
        { branchId: ids.b, variantId: ids.variant, priceMinor: 12000 },
      ]);
    });
    const catalog = createCatalogRepository(database.db);
    expect((await catalog.listForBranch(ids.a))[0]?.priceMinor).toBe(10000);
    expect((await catalog.listForBranch(ids.b))[0]?.priceMinor).toBe(12000);
    await database.db
      .update(branchVariants)
      .set({ available: false })
      .where(eq(branchVariants.branchId, ids.a));
    expect(await catalog.listForBranch(ids.a)).toEqual([]);
    expect(await catalog.listForBranch(ids.b)).toHaveLength(1);
    await database.db.update(branches).set({ active: false }).where(eq(branches.id, ids.b));
    expect(await createBranchRepository(database.db).findBySlug(`test-${ids.b}`)).toBeUndefined();
    expect(await catalog.listForBranch(ids.b)).toEqual([]);
  } finally {
    await database.db.transaction(async (tx) => {
      await tx.delete(branchVariants).where(eq(branchVariants.variantId, ids.variant));
      await tx.delete(productVariants).where(eq(productVariants.id, ids.variant));
      await tx.delete(products).where(eq(products.id, ids.product));
      await tx.delete(categories).where(eq(categories.id, ids.category));
      await tx.delete(branches).where(inArray(branches.id, [ids.a, ids.b]));
    });
    await database.close();
  }
});
