import { expect, test } from '@playwright/test';

test.use({ locale: 'ar-EG' });

test('outside discovery links to the menu and real directions', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.locator('.home-hero-actions a').first().click();
  await expect(page).toHaveURL(/\/menu$/);
  await expect(page.getByRole('searchbox')).toBeVisible();
  await page.getByRole('link', { name: 'MARO', exact: true }).click();
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('link', { name: 'Iced coffee', exact: true }).click();
  await expect(page).toHaveURL(/category=iced/);
  await expect(page.getByRole('button', { name: 'Iced Coffee', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('link', { name: 'MARO', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Get directions — Faisal' })).toHaveAttribute(
    'href',
    'https://maps.app.goo.gl/ZaSq4xeTkhSkxjcN6',
  );
  await expect(page.getByRole('link', { name: 'Get directions — Main Haram' })).toHaveAttribute(
    'href',
    'https://maps.app.goo.gl/7dMZ25kGE4Evoz8i7',
  );
});

for (const width of [360, 768, 1440]) {
  test(`homepage fits ${width}px in both languages`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const locale of ['ar', 'en']) {
      if (locale === 'en') await page.getByRole('button', { name: 'Switch to English' }).click();
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  });
}

test('mobile navigation closes on selection and preserves bilingual destinations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const locale of ['ar', 'en']) {
    if (locale === 'en') await page.getByRole('button', { name: 'Switch to English' }).click();
    const trigger = page.getByRole('button', {
      name: locale === 'ar' ? 'افتح قائمة التصفح' : 'Open navigation',
    });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog
      .getByRole('link', { name: locale === 'ar' ? 'الفروع' : 'Locations', exact: true })
      .click();
    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL(/#branches$/);
    await expect(page.locator('.home-locations-intro')).toBeInViewport();
    await expect(page.locator('.home-header')).toBeInViewport();
    await expect(
      page.getByRole('link', {
        name: locale === 'ar' ? 'افتح الاتجاهات — فيصل' : 'Get directions — Faisal',
      }),
    ).toHaveAttribute('href', 'https://maps.app.goo.gl/ZaSq4xeTkhSkxjcN6');
  }
});
