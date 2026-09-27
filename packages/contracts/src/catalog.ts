import { z } from 'zod';

export const localizedSchema = z
  .object({ ar: z.string().trim().min(1).max(160), en: z.string().trim().min(1).max(160) })
  .strict();
export const variantLabelSchema = z.enum(['standard', 'small', 'large', 'single', 'double']);
export const mediaSchema = z
  .object({
    src: z
      .string()
      .regex(/^\/(?:home|menu|design-system|media)\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)$/),
    alt: localizedSchema,
    status: z.enum(['reference', 'verified']),
    source: z.string().max(500),
    position: z.string().max(30).optional(),
  })
  .strict();
export const catalogPriceSchema = z
  .object({
    label: variantLabelSchema,
    amount: z
      .number()
      .min(0.01)
      .max(100000)
      .refine((n) => Math.abs(n * 100 - Math.round(n * 100)) < 0.00001),
  })
  .strict();
export const catalogProductSchema = z
  .object({
    id: z.uuid(),
    legacyId: z.string().nullable(),
    name: localizedSchema,
    categoryId: z.string(),
    prices: z.array(catalogPriceSchema).min(1).max(5),
    media: mediaSchema,
    active: z.boolean(),
    version: z.number().int().positive(),
    featuredOrder: z.number().int().min(1).max(20).nullable(),
    pairingIds: z.array(z.uuid()).max(1),
    branchSlugs: z.array(z.string()).max(50),
  })
  .strict();
export const catalogCategorySchema = z.object({
  id: z.string(),
  name: localizedSchema,
  media: mediaSchema,
});
export const catalogBranchSchema = z.object({
  slug: z.string(),
  name: localizedSchema,
  area: localizedSchema,
  address: localizedSchema,
  maps: z.url(),
  addressConflict: z.boolean(),
});
export const catalogResponseSchema = z.object({
  categories: z.array(catalogCategorySchema),
  products: z.array(catalogProductSchema),
  branches: z.array(catalogBranchSchema),
});
export const productWriteSchema = catalogProductSchema
  .omit({ id: true, legacyId: true })
  .superRefine((value, ctx) => {
    if (new Set(value.prices.map((p) => p.label)).size !== value.prices.length)
      ctx.addIssue({ code: 'custom', path: ['prices'], message: 'Duplicate sizes.' });
    if (value.prices.length > 1 && value.prices.some((p) => p.label === 'standard'))
      ctx.addIssue({
        code: 'custom',
        path: ['prices'],
        message: 'A single price cannot be mixed with sizes.',
      });
  });
export const loginSchema = z
  .object({ username: z.string().trim().min(1).max(80), password: z.string().min(1).max(256) })
  .strict();
export const sessionSchema = z.object({ token: z.string(), expiresAt: z.string() });
export const staffSchema = z.object({ id: z.uuid(), username: z.string() });
export type CatalogProduct = z.infer<typeof catalogProductSchema>;
export type CatalogCategory = z.infer<typeof catalogCategorySchema>;
export type CatalogBranch = z.infer<typeof catalogBranchSchema>;
export type CatalogData = z.infer<typeof catalogResponseSchema>;
export type ProductWrite = z.infer<typeof productWriteSchema>;
export type CatalogMedia = z.infer<typeof mediaSchema>;
