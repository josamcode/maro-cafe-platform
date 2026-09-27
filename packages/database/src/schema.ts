import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const branches = pgTable('branches', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  timezone: text('timezone').notNull().default('Africa/Cairo'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull().unique(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id),
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('products_category_idx').on(table.categoryId)],
);

export const productVariants = pgTable(
  'product_variants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),
    name: text('name').notNull(),
  },
  (table) => [index('variants_product_idx').on(table.productId)],
);

export const branchVariants = pgTable(
  'branch_variants',
  {
    branchId: uuid('branch_id')
      .notNull()
      .references(() => branches.id),
    variantId: uuid('variant_id')
      .notNull()
      .references(() => productVariants.id),
    priceMinor: integer('price_minor').notNull(),
    currency: text('currency').notNull().default('EGP'),
    available: boolean('available').notNull().default(true),
  },
  (table) => [
    primaryKey({ columns: [table.branchId, table.variantId] }),
    index('branch_variants_variant_idx').on(table.variantId),
    check('price_nonnegative', sql`${table.priceMinor} >= 0`),
    check('currency_egp', sql`${table.currency} = 'EGP'`),
  ],
);
