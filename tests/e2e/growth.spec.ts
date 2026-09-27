import { randomUUID } from 'node:crypto';
import { eq, inArray } from 'drizzle-orm';
import { test, expect } from '@playwright/test';
import {
  createDatabase,
  staffUsers,
  staffSessions,
  offers,
  offerAudit,
  intentEvents,
} from '@maro/database';
import { hashPassword } from '@maro/backend';
test.use({ locale: 'en-US' });
test('staff publish an eligible offer and inspect anonymous engagement in both languages', async ({
  page,
  context,
}) => {
  test.setTimeout(120000);
  const db = createDatabase(process.env.DATABASE_URL!);
  const userId = randomUUID(),
    password = randomUUID(),
    title = `Offer ${userId.slice(0, 8)}`;
  const captured: Record<string, unknown>[] = [];
  context.on('request', (request) => {
    if (request.url().endsWith('/api/intent') && request.method() === 'POST')
      captured.push(request.postDataJSON());
  });
  try {
    await db.db
      .insert(staffUsers)
      .values({ id: userId, username: userId, passwordHash: await hashPassword(password) });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/admin');
    await page.getByLabel('Username', { exact: true }).fill(userId);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.getByRole('link', { name: 'Offers', exact: true }).click();
    await page.getByRole('link', { name: 'New offer', exact: true }).click();
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page.locator('form').getByRole('alert').last()).toContainText('Check both titles');
    await page.getByLabel('Arabic title', { exact: true }).fill('عرض تجريبي');
    await page.getByLabel('English title', { exact: true }).fill(title);
    await page
      .getByLabel('Arabic details & terms', { exact: true })
      .fill('عرض اختبار فقط، غير مخصص للاستخدام الحقيقي.');
    await page
      .getByLabel('English details & terms', { exact: true })
      .fill('Test fixture only. Not redeemable.');
    await page.getByLabel('Starts on', { exact: true }).pressSequentially('01012026');
    await expect(page.getByLabel('Starts on', { exact: true })).toHaveValue('01/01/2026');
    await page.getByLabel('Ends on', { exact: true }).fill('01/01/2099');
    await page.getByRole('checkbox', { name: 'Sahl Hamza', exact: true }).uncheck();
    await page.getByRole('checkbox', { name: 'Main Haram', exact: true }).uncheck();
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page).toHaveURL('/admin/offers?saved=1');
    const guest = await context.newPage();
    await guest.setViewportSize({ width: 390, height: 844 });
    await guest.goto('/');
    await expect(guest.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
    await page.getByRole('link', { name: new RegExp(title) }).click();
    await page.getByRole('switch', { name: 'Publish offer', exact: true }).check();
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page.locator('form').getByRole('alert').last()).toContainText('requires approval');
    await page
      .getByRole('checkbox', {
        name: 'MARO approved these terms, dates and participating branches',
        exact: true,
      })
      .check();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: 'test-results/offers-mobile-form.png', fullPage: true });
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page).toHaveURL('/admin/offers?saved=1');
    await guest.reload();
    const offer = guest.locator('.offer-row');
    await expect(offer).toContainText(title);
    await offer.scrollIntoViewIfNeeded();
    await expect.poll(() => captured.some((event) => event.kind === 'offer_view')).toBe(true);
    await guest.screenshot({ path: 'test-results/offers-public.png' });
    await offer.getByRole('link', { name: 'Choose your branch' }).click();
    await expect(guest).toHaveURL('/branches/faisal');
    await guest.goto('/in/sahl-hamza');
    await expect(guest.locator('.offer-row')).toHaveCount(0);
    await guest.goto('/in/faisal?q=espresso');
    await expect(guest.locator('.offer-row')).toContainText(title);
    await guest
      .getByRole('button', { name: 'Add to My Picks — Espresso · Single', exact: true })
      .click();
    await expect.poll(() => captured.some((event) => event.kind === 'pick_add')).toBe(true);
    await expect.poll(() => captured.some((event) => event.kind === 'search_results')).toBe(true);
    expect(
      captured.every(
        (event) => !('query' in event) && !('email' in event) && !('sessionId' in event),
      ),
    ).toBe(true);
    await page.getByRole('link', { name: 'Engagement', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Customer engagement' })).toBeVisible();
    await expect(page.locator('.admin-metrics')).toContainText('Offer interactions');
    await page.getByRole('combobox', { name: 'Experience', exact: true }).click();
    await page.getByRole('option', { name: 'Inside MARO', exact: true }).click();
    await expect(page).toHaveURL(/context=inside/);
    await page.getByRole('button', { name: 'Switch to Arabic' }).click();
    await page.getByRole('button', { name: 'تبديل المظهر الفاتح والداكن' }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.locator('.admin-navigation a').first()).toHaveCSS(
      'color',
      'rgb(244, 236, 223)',
    );
    await page.screenshot({ path: 'test-results/insights-arabic-dark.png', fullPage: true });
    await guest.close();
  } finally {
    const rows = await db.db.select().from(offerAudit).where(eq(offerAudit.actorId, userId));
    const ids = [...new Set(rows.map((r) => r.offerId))];
    if (ids.length) {
      await db.db.delete(offerAudit).where(inArray(offerAudit.offerId, ids));
      await db.db.delete(offers).where(inArray(offers.id, ids));
    }
    const eventIds = captured.map((e) => e.id).filter((id): id is string => typeof id === 'string');
    if (eventIds.length) await db.db.delete(intentEvents).where(inArray(intentEvents.id, eventIds));
    await db.db.delete(staffSessions).where(eq(staffSessions.userId, userId));
    await db.db.delete(staffUsers).where(eq(staffUsers.id, userId));
    await db.close();
  }
});

test('privacy preference prevents browser measurement without interrupting browsing', async ({
  page,
}) => {
  let sent = 0;
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'doNotTrack', { get: () => '1' }),
  );
  page.on('request', (request) => {
    if (request.url().endsWith('/api/intent')) sent++;
  });
  await page.goto('/menu?q=espresso');
  await page
    .getByRole('button', { name: 'Add to My Picks — Espresso · Single', exact: true })
    .click();
  await expect(page.getByRole('button', { name: 'My Picks', exact: true })).toBeVisible();
  expect(sent).toBe(0);
});
