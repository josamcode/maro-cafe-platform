import { expect, test } from '@playwright/test';
test.use({ locale: 'en-US', colorScheme: 'dark' });

test('device preferences apply initially and the one-click theme choice persists', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'system');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(23, 21, 18)');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(251, 248, 242)');
  const toggle = page.getByRole('button', { name: 'Toggle light and dark appearance' });
  await toggle.click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(23, 21, 18)');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Switch to Arabic' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'تبديل المظهر الفاتح والداكن' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(251, 248, 242)');
});

test('featured image and keyboard action open the same product; mobile hero actions share one row', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const actions = page.locator('.home-hero-actions');
  const [menuY, visitY] = await actions
    .getByRole('link')
    .evaluateAll((links) => links.map((link) => link.getBoundingClientRect().y));
  expect(menuY!).toBeCloseTo(visitY!, 0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const card = page.locator('.featured-products .maro-product').first();
  await card.click({ position: { x: 24, y: 24 } });
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Espresso', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  const trigger = card.getByRole('button', { name: 'Details & sizes — Espresso', exact: true });
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Espresso', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Switch to Arabic' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  // Read both positions in one frame; smooth scrolling changes viewport coordinates.
  const [arMenuY, arVisitY] = await actions
    .getByRole('link')
    .evaluateAll((links) => links.map((link) => link.getBoundingClientRect().y));
  expect(arMenuY!).toBeCloseTo(arVisitY!, 0);
});

test('Arabic browser language and a saved light theme override device darkness', async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: 'ar-EG', colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('http://localhost:3100');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await page.getByRole('button', { name: 'تبديل المظهر الفاتح والداكن' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(251, 248, 242)');
  await context.close();
});
