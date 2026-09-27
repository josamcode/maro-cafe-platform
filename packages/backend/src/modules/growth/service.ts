import { randomUUID } from 'node:crypto';
import { and, count, eq, gte, lte, sql } from 'drizzle-orm';
import { offers, offerAudit, intentEvents, type Database } from '@maro/database';
import { offerSchema, insightSchema, type OfferWrite, type Intent } from '@maro/contracts';
import { CatalogEditError, type CatalogEditor } from '../catalog/editor.js';

export function cairoDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}
export function createGrowthService(db: Database, catalog: CatalogEditor) {
  function dto(row: typeof offers.$inferSelect) {
    return offerSchema.parse({
      ...row.content,
      id: row.id,
      version: row.version,
      startsOn: row.startsOn,
      endsOn: row.endsOn,
      context: row.context,
      published: row.published,
    });
  }
  async function list(context?: 'outside' | 'inside', branch?: string) {
    if (context === 'inside' && !branch) return [];
    const today = cairoDate();
    const rows = await db
      .select()
      .from(offers)
      .where(
        context
          ? and(eq(offers.published, true), gte(offers.endsOn, today), lte(offers.startsOn, today))
          : undefined,
      )
      .orderBy(offers.startsOn, offers.id);
    const activeBranches = new Set((await catalog.read()).branches.map((b) => b.slug));
    return rows
      .map(dto)
      .filter(
        (o) =>
          !context ||
          ((o.context === context || o.context === 'both') &&
            o.branchSlugs.some((b) => activeBranches.has(b) && (!branch || branch === b))),
      );
  }
  return {
    list,
    async save(id: string | null, input: OfferWrite, actorId: string) {
      const data = await catalog.read();
      if (input.branchSlugs.some((slug) => !data.branches.some((b) => b.slug === slug)))
        throw new CatalogEditError(400, 'Invalid branch.');
      const offerId = id ?? randomUUID();
      await db.transaction(async (tx) => {
        const [before] = id ? await tx.select().from(offers).where(eq(offers.id, id)) : [];
        if (id && !before) throw new CatalogEditError(404, 'Offer not found.');
        const values = {
          content: {
            title: input.title,
            terms: input.terms,
            branchSlugs: [...new Set(input.branchSlugs)],
          },
          context: input.context,
          startsOn: input.startsOn,
          endsOn: input.endsOn,
          published: input.published,
          approvedBy: input.published ? actorId : null,
          approvedAt: input.published ? new Date() : null,
          version: id ? input.version + 1 : 1,
        };
        if (id) {
          const updated = await tx
            .update(offers)
            .set(values)
            .where(and(eq(offers.id, id), eq(offers.version, input.version)))
            .returning({ id: offers.id });
          if (!updated.length) throw new CatalogEditError(409, 'Offer changed elsewhere.');
        } else await tx.insert(offers).values({ id: offerId, ...values });
        await tx
          .insert(offerAudit)
          .values({ offerId, actorId, before: before ?? null, after: input });
      });
      return offerId;
    },
    async record(input: Intent) {
      const data = await catalog.read();
      if (input.branchSlug && !data.branches.some((b) => b.slug === input.branchSlug))
        throw new CatalogEditError(400, 'Invalid branch.');
      if (
        input.productId &&
        !data.products.some(
          (p) =>
            p.id === input.productId &&
            (!input.branchSlug || p.branchSlugs.includes(input.branchSlug)),
        )
      )
        throw new CatalogEditError(400, 'Invalid product.');
      if (
        input.offerId &&
        !(await list(input.context, input.branchSlug)).some((o) => o.id === input.offerId)
      )
        throw new CatalogEditError(400, 'Inactive offer.');
      await db.insert(intentEvents).values(input).onConflictDoNothing();
    },
    async insights(days: number, context: string, branch?: string) {
      const until = new Date();
      const since = new Date(until.valueOf() - days * 86400000);
      const rows = await db
        .select({
          kind: intentEvents.kind,
          count: count(),
          withResults:
            sql<number>`count(*) filter (where ${intentEvents.hasResults} = true)`.mapWith(Number),
        })
        .from(intentEvents)
        .where(
          and(
            gte(intentEvents.createdAt, since),
            context === 'all' ? undefined : eq(intentEvents.context, context),
            branch ? eq(intentEvents.branchSlug, branch) : undefined,
          ),
        )
        .groupBy(intentEvents.kind);
      return insightSchema.parse({
        since: since.toISOString(),
        until: until.toISOString(),
        counts: rows,
      });
    },
  };
}
export type GrowthService = ReturnType<typeof createGrowthService>;
