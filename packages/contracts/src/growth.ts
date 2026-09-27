import { z } from 'zod';
import { localizedSchema } from './catalog.js';

export const businessDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T12:00:00Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  });
export const experienceSchema = z.enum(['outside', 'inside']);
export const offerSchema = z
  .object({
    id: z.uuid(),
    version: z.number().int().positive(),
    title: localizedSchema,
    terms: z
      .object({ ar: z.string().trim().min(1).max(1200), en: z.string().trim().min(1).max(1200) })
      .strict(),
    startsOn: businessDateSchema,
    endsOn: businessDateSchema,
    context: z.enum(['outside', 'inside', 'both']),
    branchSlugs: z.array(z.string().min(1).max(80)).min(1).max(50),
    published: z.boolean(),
  })
  .strict();
export const offerWriteSchema = offerSchema
  .omit({ id: true })
  .extend({ approved: z.boolean() })
  .superRefine((value, ctx) => {
    if (value.endsOn < value.startsOn)
      ctx.addIssue({ code: 'custom', path: ['endsOn'], message: 'End precedes start.' });
    if (value.published && !value.approved)
      ctx.addIssue({
        code: 'custom',
        path: ['approved'],
        message: 'Confirm approval before publishing.',
      });
  });
export const offersSchema = z.array(offerSchema);
export const offerQuerySchema = z
  .object({ context: experienceSchema, branch: z.string().max(80).optional() })
  .refine((value) => value.context !== 'inside' || Boolean(value.branch), {
    message: 'Inside offers require a branch.',
  });
export const intentKindSchema = z.enum([
  'menu_view',
  'branch_view',
  'directions_click',
  'product_view',
  'pick_add',
  'pairing_add',
  'search_results',
  'offer_view',
  'offer_click',
]);
export const intentSchema = z
  .object({
    id: z.uuid(),
    kind: intentKindSchema,
    context: experienceSchema,
    branchSlug: z.string().min(1).max(80).optional(),
    productId: z.uuid().optional(),
    offerId: z.uuid().optional(),
    hasResults: z.boolean().optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    const product = ['product_view', 'pick_add', 'pairing_add'].includes(value.kind);
    const offer = ['offer_view', 'offer_click'].includes(value.kind);
    if (
      product !== Boolean(value.productId) ||
      offer !== Boolean(value.offerId) ||
      (value.kind === 'search_results') !== (value.hasResults !== undefined)
    )
      ctx.addIssue({ code: 'custom', message: 'Unexpected event fields.' });
    if (
      (value.context === 'inside' || ['branch_view', 'directions_click'].includes(value.kind)) &&
      !value.branchSlug
    )
      ctx.addIssue({ code: 'custom', path: ['branchSlug'], message: 'Branch required.' });
  });
export const insightQuerySchema = z.object({
  days: z.enum(['7', '30']).default('7'),
  context: z.enum(['all', 'outside', 'inside']).default('all'),
  branch: z.string().max(80).optional(),
});
export const insightSchema = z.object({
  since: z.string(),
  until: z.string(),
  counts: z.array(
    z.object({
      kind: intentKindSchema,
      count: z.number().int().nonnegative(),
      withResults: z.number().int().nonnegative(),
    }),
  ),
});
export type Offer = z.infer<typeof offerSchema>;
export type OfferWrite = z.infer<typeof offerWriteSchema>;
export type Intent = z.infer<typeof intentSchema>;
export type Insight = z.infer<typeof insightSchema>;
