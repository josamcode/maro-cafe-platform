import { randomUUID } from 'node:crypto';
import { eq, inArray } from 'drizzle-orm';
import { expect, it } from 'vitest';
import { createDatabase, offers, offerAudit, intentEvents, staffUsers } from '@maro/database';
import {
  createCatalogEditor,
  createGrowthService,
  createBranchRepository,
  createCatalogRepository,
  createStaffAuth,
} from '@maro/backend';
import { buildApp } from '../../apps/api/src/app.js';
import { offerWriteSchema, type OfferWrite } from '@maro/contracts';

it('publishes only eligible offers, rejects stale writes and records idempotent anonymous intent', async () => {
  const db = createDatabase(process.env.DATABASE_URL!);
  const actor = randomUUID();
  const eventId = randomUUID();
  const added: string[] = [];
  const editor = createCatalogEditor(db.db);
  const service = createGrowthService(db.db, editor);
  const app = await buildApp(
    {
      branches: createBranchRepository(db.db),
      catalog: createCatalogRepository(db.db),
      growth: service,
      staffAuth: createStaffAuth(db.db),
      checkReady: async () => {},
    },
    { logger: false },
  );
  try {
    await db.db
      .insert(staffUsers)
      .values({ id: actor, username: actor, passwordHash: 'disabled-test-account', active: false });
    const draft: OfferWrite = {
      title: { ar: 'اختبار', en: 'Test offer' },
      terms: { ar: 'شروط الاختبار', en: 'Test terms' },
      startsOn: '2020-01-01',
      endsOn: '2099-01-01',
      context: 'inside',
      branchSlugs: ['faisal'],
      published: false,
      approved: false,
      version: 1,
    };
    expect(offerWriteSchema.safeParse({ ...draft, startsOn: '2026-02-30' }).success).toBe(false);
    expect(offerWriteSchema.safeParse({ ...draft, published: true }).success).toBe(false);
    expect(offerWriteSchema.safeParse({ ...draft, endsOn: '2019-01-01' }).success).toBe(false);
    const id = await service.save(null, draft, actor);
    added.push(id);
    expect((await service.list('inside', 'faisal')).some((o) => o.id === id)).toBe(false);
    await service.save(id, { ...draft, published: true, approved: true }, actor);
    expect((await service.list('inside', 'faisal')).some((o) => o.id === id)).toBe(true);
    expect((await service.list('outside', 'faisal')).some((o) => o.id === id)).toBe(false);
    expect((await service.list('inside', 'sahl-hamza')).some((o) => o.id === id)).toBe(false);
    await expect(service.save(id, draft, actor)).rejects.toMatchObject({ statusCode: 409 });
    const expired = await service.save(
      null,
      { ...draft, published: true, approved: true, endsOn: '2020-01-02' },
      actor,
    );
    added.push(expired);
    expect((await service.list('inside', 'faisal')).some((o) => o.id === expired)).toBe(false);
    const future = await service.save(
      null,
      { ...draft, published: true, approved: true, startsOn: '2098-01-01' },
      actor,
    );
    added.push(future);
    expect((await service.list('inside', 'faisal')).some((o) => o.id === future)).toBe(false);
    expect((await app.inject('/v1/staff/insights')).statusCode).toBe(401);
    expect(
      (await app.inject({ method: 'POST', url: '/v1/staff/offers', payload: draft })).statusCode,
    ).toBe(401);
    const event = {
      id: eventId,
      kind: 'offer_click',
      context: 'inside',
      branchSlug: 'faisal',
      offerId: id,
    };
    for (let i = 0; i < 2; i++)
      expect(
        (await app.inject({ method: 'POST', url: '/v1/intent', payload: event })).statusCode,
      ).toBe(204);
    expect(
      await db.db.select().from(intentEvents).where(eq(intentEvents.id, eventId)),
    ).toHaveLength(1);
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/v1/intent',
          payload: { ...event, query: 'private text' },
        })
      ).statusCode,
    ).toBe(400);
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/v1/intent',
          payload: { ...event, branchSlug: 'sahl-hamza' },
        })
      ).statusCode,
    ).toBe(400);
    expect(
      (await service.insights(7, 'inside', 'faisal')).counts.find(
        (row) => row.kind === 'offer_click',
      )!.count,
    ).toBeGreaterThanOrEqual(1);
    await service.save(id, { ...draft, version: 2 }, actor);
    expect((await service.list('inside', 'faisal')).some((o) => o.id === id)).toBe(false);
  } finally {
    await app.close();
    await db.db.delete(intentEvents).where(eq(intentEvents.id, eventId));
    if (added.length) {
      await db.db.delete(offerAudit).where(inArray(offerAudit.offerId, added));
      await db.db.delete(offers).where(inArray(offers.id, added));
    }
    await db.db.delete(staffUsers).where(eq(staffUsers.id, actor));
    await db.close();
  }
});
