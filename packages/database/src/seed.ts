import {
  createDatabase,
  branches,
  categories,
  products,
  productVariants,
  branchVariants,
} from './index.js';

if (process.env.NODE_ENV === 'production')
  throw new Error('Demo seeding is disabled in production.');
const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required.');
const database = createDatabase(url);
const ids = {
  branch: '00000000-0000-4000-8000-000000000001',
  category: '00000000-0000-4000-8000-000000000002',
  product: '00000000-0000-4000-8000-000000000003',
  variant: '00000000-0000-4000-8000-000000000004',
};
try {
  await database.db.transaction(async (tx) => {
    await tx
      .insert(branches)
      .values({
        id: ids.branch,
        slug: 'demo',
        name: 'MARO Demo Branch',
        address: 'Demo location — not a real branch address',
      })
      .onConflictDoNothing();
    await tx
      .insert(categories)
      .values({ id: ids.category, slug: 'demo-coffee', name: 'Coffee' })
      .onConflictDoNothing();
    await tx
      .insert(products)
      .values({
        id: ids.product,
        slug: 'demo-latte',
        categoryId: ids.category,
        name: 'Demo Iced Latte',
        description: 'Sample product for development. Menu and price require business approval.',
      })
      .onConflictDoNothing();
    await tx
      .insert(productVariants)
      .values({ id: ids.variant, productId: ids.product, name: 'Regular' })
      .onConflictDoNothing();
    await tx
      .insert(branchVariants)
      .values({ branchId: ids.branch, variantId: ids.variant, priceMinor: 10000 })
      .onConflictDoNothing();
  });
  console.log('Development sample records inserted; existing records were left unchanged.');
} finally {
  await database.close();
}
