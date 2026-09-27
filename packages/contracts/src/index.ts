import { z } from 'zod';
export * from './catalog.js';

export const branchSchema = z.object({
  id: z.uuid(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string(),
  address: z.string(),
  timezone: z.string(),
});

export const menuItemSchema = z.object({
  productId: z.uuid(),
  variantId: z.uuid(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  variant: z.string(),
  priceMinor: z.number().int().nonnegative(),
  currency: z.literal('EGP'),
});

export const branchesResponseSchema = z.object({ data: z.array(branchSchema) });
export const menuResponseSchema = z.object({
  branch: branchSchema,
  items: z.array(menuItemSchema),
});
export const branchParamsSchema = z.object({ slug: branchSchema.shape.slug });
export const errorResponseSchema = z.object({
  error: z.object({ code: z.string(), message: z.string(), requestId: z.string() }),
});
export const healthSchema = z.object({ status: z.enum(['ok', 'unavailable']) });

export type Branch = z.infer<typeof branchSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuResponse = z.infer<typeof menuResponseSchema>;
export * from './growth.js';
