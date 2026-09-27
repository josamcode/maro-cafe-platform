import { expect, test } from '@playwright/test';

test.use({ locale: 'ar-EG' });

test('outside journey supports bilingual discovery, menu search and real directions', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('قهوتك المفضلة');
  const menu = page.getByRole('button', { name: 'شوف المنيو', exact: true });
  await menu.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveAttribute('dir', 'rtl');
  await dialog.getByRole('searchbox').fill('سبانيش');
  await expect(dialog.locator('.home-menu-list li')).toHaveCount(1);
  await expect(dialog.locator('.home-menu-list')).toContainText('سبانيش');
  await dialog.getByRole('searchbox').fill('no such drink');
  await expect(dialog.getByRole('heading', { name: 'مفيش نتائج للاختيار ده' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your coffee.');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'Iced coffee', exact: true }).click();
  await expect(dialog).toHaveAttribute('dir', 'ltr');
  await expect(dialog.getByRole('button', { name: 'Iced Coffee', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await dialog.getByRole('searchbox').fill('spanish');
  await expect(dialog.locator('.home-menu-list')).toContainText('Spanish');
  await page.keyboard.press('Escape');
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
  test(`homepage and menu fit ${width}px in both languages`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const locale of ['ar', 'en']) {
      if (locale === 'en') await page.getByRole('button', { name: 'Switch to English' }).click();
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      await page
        .getByRole('button', {
          name: locale === 'ar' ? 'شوف المنيو' : 'Explore the menu',
          exact: true,
        })
        .click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      const body = dialog.locator('.maro-dialog-body');
      expect(await body.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      await dialog.locator('.home-menu-list li').last().scrollIntoViewIfNeeded();
      await expect(
        dialog.getByRole('button', { name: locale === 'ar' ? 'إغلاق' : 'Close', exact: true }),
      ).toBeInViewport();
      await page.keyboard.press('Escape');
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
