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

test('category image and keyboard action open the same menu; mobile hero actions share one row', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const actions = page.locator('.home-hero-actions');
  const menuBox = await actions.getByRole('link').first().boundingBox();
  const visitBox = await actions.getByRole('link').last().boundingBox();
  expect(menuBox!.y).toBeCloseTo(visitBox!.y, 0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const card = page.locator('.maro-collection').first();
  await card.click({ position: { x: 24, y: 24 } });
  await expect(page).toHaveURL(/category=hot/);
  await expect(page.locator('.menu-group .maro-disclosure-trigger')).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await page.goBack();
  const trigger = card.getByRole('link');
  await trigger.focus();
  await trigger.press('Enter');
  await expect(page).toHaveURL(/category=hot/);
  await page.goBack();
  await page.getByRole('button', { name: 'Switch to Arabic' }).click();
  const arMenu = await actions.getByRole('link').first().boundingBox();
  const arVisit = await actions.getByRole('link').last().boundingBox();
  expect(arMenu!.y).toBeCloseTo(arVisit!.y, 0);
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
