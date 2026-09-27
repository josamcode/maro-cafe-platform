import { and, asc, eq } from 'drizzle-orm';
import {
  branches,
  branchVariants,
  categories,
  products,
  productVariants,
  type Database,
} from '@maro/database';
import { menuItemSchema, type MenuItem } from '@maro/contracts';

export interface CatalogRepository {
  listForBranch(branchId: string): Promise<MenuItem[]>;
}
export function createCatalogRepository(db: Database): CatalogRepository {
  return {
    async listForBranch(branchId) {
      const rows = await db
        .select({
          productId: products.id,
          variantId: productVariants.id,
          name: products.name,
          description: products.description,
          category: categories.name,
          variant: productVariants.name,
          priceMinor: branchVariants.priceMinor,
          currency: branchVariants.currency,
        })
        .from(branchVariants)
        .innerJoin(branches, eq(branches.id, branchVariants.branchId))
        .innerJoin(productVariants, eq(productVariants.id, branchVariants.variantId))
        .innerJoin(products, eq(products.id, productVariants.productId))
        .innerJoin(categories, eq(categories.id, products.categoryId))
        .where(
          and(
            eq(branchVariants.branchId, branchId),
            eq(branchVariants.available, true),
            eq(products.active, true),
            eq(productVariants.active, true),
            eq(branches.active, true),
          ),
        )
        .orderBy(asc(categories.sortOrder), asc(products.name), asc(productVariants.name));
      return rows.map((row) => menuItemSchema.parse(row));
    },
  };
}
