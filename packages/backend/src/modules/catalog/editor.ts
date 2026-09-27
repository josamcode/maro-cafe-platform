import { randomUUID } from 'node:crypto';
import { and, asc, eq, inArray, isNotNull } from 'drizzle-orm';
import {
  branches,
  branchVariants,
  categories,
  products,
  productVariants,
  productPairings,
  catalogAudit,
  type Database,
} from '@maro/database';
import { catalogResponseSchema, type CatalogData, type ProductWrite } from '@maro/contracts';

export class CatalogEditError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export function createCatalogEditor(db: Database) {
  return {
    async read(admin = false): Promise<CatalogData> {
      return db.transaction(
        async (tx) => {
          const branchRows = await tx
            .select()
            .from(branches)
            .where(and(eq(branches.active, true), isNotNull(branches.content)));
          const categoryRows = await tx
            .select()
            .from(categories)
            .where(isNotNull(categories.content))
            .orderBy(asc(categories.sortOrder));
          const productRows = await tx
            .select()
            .from(products)
            .where(isNotNull(products.content))
            .orderBy(asc(products.createdAt), asc(products.id));
          const variants = await tx
            .select()
            .from(productVariants)
            .where(eq(productVariants.active, true));
          const availability = await tx
            .select()
            .from(branchVariants)
            .where(eq(branchVariants.available, true));
          const pairings = await tx.select().from(productPairings);
          const data = catalogResponseSchema.parse({
            branches: branchRows.map((b) => b.content),
            categories: categoryRows.map((c) => ({ ...c.content, id: c.slug })),
            products: productRows.map((p) => {
              const order = ['standard', 'small', 'large', 'single', 'double'];
              const prices = variants
                .filter((v) => v.productId === p.id)
                .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
              return {
                ...p.content,
                id: p.id,
                legacyId: p.legacyId,
                categoryId: categoryRows.find((c) => c.id === p.categoryId)!.slug,
                active: p.active,
                version: p.version,
                featuredOrder: p.featuredOrder,
                prices: prices.map((v) => ({ label: v.name, amount: v.priceMinor / 100 })),
                pairingIds: pairings.filter((r) => r.productId === p.id).map((r) => r.targetId),
                branchSlugs: branchRows
                  .filter((b) =>
                    prices.some((v) =>
                      availability.some((a) => a.branchId === b.id && a.variantId === v.id),
                    ),
                  )
                  .map((b) => b.slug),
              };
            }),
          });
          if (!admin) {
            data.products = data.products.filter((p) => p.active && p.branchSlugs.length > 0);
            const ids = new Set(data.products.map((p) => p.id));
            data.products.forEach((p) => {
              p.pairingIds = p.pairingIds.filter((id) => ids.has(id));
            });
          }
          return data;
        },
        { isolationLevel: 'repeatable read', accessMode: 'read only' },
      );
    },
    async save(id: string | null, input: ProductWrite, actorId: string) {
      const productId = id ?? randomUUID();
      await db.transaction(async (tx) => {
        const [category] = await tx
          .select()
          .from(categories)
          .where(and(eq(categories.slug, input.categoryId), isNotNull(categories.content)));
        const branchRows = await tx
          .select()
          .from(branches)
          .where(and(eq(branches.active, true), isNotNull(branches.content)));
        if (!category || input.branchSlugs.some((slug) => !branchRows.some((b) => b.slug === slug)))
          throw new CatalogEditError(400, 'Invalid catalog reference.');
        const targetId = input.pairingIds[0];
        if (targetId) {
          const [target] = await tx
            .select()
            .from(products)
            .where(and(eq(products.id, targetId), isNotNull(products.content)));
          if (!target || targetId === productId)
            throw new CatalogEditError(400, 'Invalid pairing.');
        }
        const [before] = id ? await tx.select().from(products).where(eq(products.id, id)) : [];
        if (id && (!before || !before.content))
          throw new CatalogEditError(404, 'Product not found.');
        const oldVariants = id
          ? await tx.select().from(productVariants).where(eq(productVariants.productId, id))
          : [];
        const oldAvailability = oldVariants.length
          ? await tx
              .select()
              .from(branchVariants)
              .where(
                inArray(
                  branchVariants.variantId,
                  oldVariants.map((v) => v.id),
                ),
              )
          : [];
        const oldPairings = id
          ? await tx.select().from(productPairings).where(eq(productPairings.productId, id))
          : [];
        const values = {
          categoryId: category.id,
          name: input.name.en,
          content: { name: input.name, media: input.media },
          active: input.active,
          featuredOrder: input.featuredOrder,
          version: id ? input.version + 1 : 1,
        };
        if (id) {
          const changed = await tx
            .update(products)
            .set(values)
            .where(and(eq(products.id, id), eq(products.version, input.version)))
            .returning({ id: products.id });
          if (!changed.length)
            throw new CatalogEditError(
              409,
              'This product was changed elsewhere. Reload before saving.',
            );
          await tx
            .update(productVariants)
            .set({ active: false })
            .where(eq(productVariants.productId, id));
        } else
          await tx
            .insert(products)
            .values({ ...values, id: productId, slug: `product-${productId}` });
        for (const price of input.prices) {
          const existing = oldVariants.find((v) => v.name === price.label);
          const variantId = existing?.id ?? randomUUID();
          const priceMinor = Math.round(price.amount * 100);
          if (existing)
            await tx
              .update(productVariants)
              .set({ priceMinor, active: true })
              .where(eq(productVariants.id, variantId));
          else
            await tx
              .insert(productVariants)
              .values({ id: variantId, productId, name: price.label, priceMinor });
          for (const branch of branchRows)
            await tx
              .insert(branchVariants)
              .values({
                branchId: branch.id,
                variantId,
                priceMinor,
                available: input.branchSlugs.includes(branch.slug),
              })
              .onConflictDoUpdate({
                target: [branchVariants.branchId, branchVariants.variantId],
                set: { priceMinor, available: input.branchSlugs.includes(branch.slug) },
              });
        }
        await tx.delete(productPairings).where(eq(productPairings.productId, productId));
        if (targetId) await tx.insert(productPairings).values({ productId, targetId });
        await tx.insert(catalogAudit).values({
          actorId,
          productId,
          before: before
            ? {
                product: before,
                variants: oldVariants,
                availability: oldAvailability,
                pairings: oldPairings,
              }
            : null,
          after: input,
        });
      });
      return productId;
    },
  };
}
export type CatalogEditor = ReturnType<typeof createCatalogEditor>;
