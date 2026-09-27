import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
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
  content: jsonb('content').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  content: jsonb('content').$type<Record<string, unknown>>(),
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
    legacyId: text('legacy_id').unique(),
    content: jsonb('content').$type<Record<string, unknown>>(),
    version: integer('version').notNull().default(1),
    featuredOrder: integer('featured_order'),
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
    priceMinor: integer('price_minor').notNull().default(0),
    active: boolean('active').notNull().default(true),
  },
  (table) => [index('variants_product_idx').on(table.productId)],
);

export const productPairings = pgTable(
  'product_pairings',
  {
    productId: uuid('product_id')
      .primaryKey()
      .references(() => products.id),
    targetId: uuid('target_id')
      .notNull()
      .references(() => products.id),
  },
  (table) => [check('pairing_not_self', sql`${table.productId} <> ${table.targetId}`)],
);

export const staffUsers = pgTable('staff_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  active: boolean('active').notNull().default(true),
});
export const staffSessions = pgTable('staff_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => staffUsers.id),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
export const catalogAudit = pgTable('catalog_audit', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorId: uuid('actor_id')
    .notNull()
    .references(() => staffUsers.id),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id),
  before: jsonb('before'),
  after: jsonb('after').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

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
