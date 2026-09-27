import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import {
  createDatabase,
  branches,
  categories,
  products,
  productVariants,
  branchVariants,
  productPairings,
} from '@maro/database';
import { branches as sourceBranches } from './catalog-source/branches.ts';
import { categoryMedia, getMenuMedia } from './catalog-source/media.ts';
import { featuredProducts, pairingRules } from './catalog-source/curation.ts';

if (process.env.NODE_ENV === 'production')
  throw new Error('Preview import is disabled in production.');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const menu = JSON.parse(
  await readFile(new URL('./catalog-source/menu.snapshot.json', import.meta.url), 'utf8'),
);
const id = (key) => {
  const hex = createHash('sha256').update(`maro-preview:${key}`).digest('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
};
const database = createDatabase(process.env.DATABASE_URL);
try {
  let inserted = 0;
  await database.db.transaction(async (tx) => {
    for (const b of sourceBranches)
      await tx
        .insert(branches)
        .values({
          id: id(b.slug),
          slug: b.slug,
          name: b.name.en,
          address: b.address.en,
          content: b,
        })
        .onConflictDoNothing();
    const ids = new Map();
    const added = new Set();
    for (const [sortOrder, category] of menu.categories.entries()) {
      const categoryId = id(category.id);
      await tx
        .insert(categories)
        .values({
          id: categoryId,
          slug: category.id,
          name: category.name.en,
          sortOrder,
          content: { name: category.name, media: categoryMedia[category.id] },
        })
        .onConflictDoNothing();
      for (const item of category.items) {
        const productId = id(`${item.id}:${item.name.en}`);
        ids.set(item.id, productId);
        const rank = featuredProducts.findIndex((p) => p.id === item.id && p.name === item.name.en);
        const result = await tx
          .insert(products)
          .values({
            id: productId,
            slug: `product-${productId}`,
            legacyId: item.id,
            categoryId,
            name: item.name.en,
            content: { name: item.name, media: getMenuMedia(category.id, item.id) },
            featuredOrder: rank >= 0 ? rank + 1 : null,
          })
          .onConflictDoNothing()
          .returning({ id: products.id });
        if (!result.length) continue;
        inserted++;
        added.add(item.id);
        for (const price of item.prices) {
          const variantId = id(`${productId}:${price.label}`);
          const priceMinor = Math.round(price.amount * 100);
          await tx
            .insert(productVariants)
            .values({ id: variantId, productId, name: price.label, priceMinor });
          for (const b of sourceBranches)
            await tx.insert(branchVariants).values({ branchId: id(b.slug), variantId, priceMinor });
        }
      }
    }
    for (const rule of pairingRules)
      for (const source of rule.sources) {
        if (added.has(source.id))
          await tx
            .insert(productPairings)
            .values({ productId: ids.get(source.id), targetId: ids.get(rule.targets[0].id) });
      }
  });
  console.log(
    `Imported ${inserted} source-listed preview products. Existing edits were preserved.`,
  );
} finally {
  await database.close();
}
