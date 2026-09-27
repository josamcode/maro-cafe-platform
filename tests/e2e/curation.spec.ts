import { expect, test } from '@playwright/test';
test.use({ locale: 'en-US' });

test('featured products use exact variants and optional pairings survive the inside journey', async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.featured-products .maro-product')).toHaveCount(3);
  await page.getByRole('button', { name: 'Details & sizes — Espresso', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radio', { name: /Double/ }).check();
  const pairing = dialog.getByRole('region', { name: 'Something alongside?' });
  await expect(pairing).toContainText('optional extra');
  const water = pairing.getByRole('button', {
    name: 'Add to My Picks — Water · Small',
    exact: true,
  });
  await expect(water).toContainText('10');
  await expect(water).toHaveAccessibleDescription(/10/);
  await water.press('Enter');
  await expect(water).toBeFocused();
  await expect(pairing.getByRole('status')).toHaveText('Added to your picks — Water');
  // Choosing an optional extra must not silently add the drink.
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'My Picks', exact: true }).click();
  await expect(dialog.locator('.picks-item')).toHaveCount(1);
  await expect(dialog.locator('.picks-item')).toContainText('Water');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Details & sizes — Espresso', exact: true }).click();
  await expect(dialog.getByRole('radio', { name: /Double/ })).toBeChecked();
  await dialog.getByRole('button', { name: 'Add to My Picks', exact: true }).click();
  await page
    .getByRole('button', { name: 'Add to My Picks — Iced Spanish Latte · Large', exact: true })
    .click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.goto('/in/faisal?q=espresso');
  await page.getByRole('button', { name: 'My Picks', exact: true }).click();
  await expect(dialog.locator('.picks-item')).toHaveCount(3);
  await expect(dialog.locator('.picks-total .maro-price')).toContainText('175');
  await dialog.getByRole('button', { name: 'Show to cashier' }).click();
  await expect(dialog).toContainText('not a submitted order');
  await expect(dialog).toContainText('Double');
  await expect(dialog).toContainText('Large');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Details & sizes — Espresso', exact: true }).click();
  await expect(dialog.getByRole('region', { name: 'Something alongside?' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.reload();
  await page.getByRole('button', { name: 'My Picks', exact: true }).click();
  await expect(dialog.locator('.picks-item')).toHaveCount(3);
});

for (const width of [360, 768, 1440]) {
  test(`curated products and pairing controls fit ${width}px in both languages and appearances`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const locale of ['en', 'ar']) {
      if (locale === 'ar') {
        await page.getByRole('button', { name: 'Switch to Arabic' }).click();
        await page.getByRole('button', { name: 'تبديل المظهر الفاتح والداكن' }).click();
      }
      const card = page.locator('.featured-products .maro-product').first();
      await card
        .getByRole('button', { name: locale === 'en' ? /Details/ : /التفاصيل/ })
        .press('Enter');
      const dialog = page.getByRole('dialog');
      const region = dialog.locator('.product-pairing');
      await expect(region.getByRole('button')).toHaveCount(2);
      await region.getByRole('button').first().click();
      expect(await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
      await page.keyboard.press('Escape');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      // Unconfigured drinks do not receive a generic or invented recommendation.
      await page
        .locator('.featured-products .maro-product')
        .last()
        .getByRole('button', { name: locale === 'en' ? /Details/ : /التفاصيل/ })
        .click();
      await expect(dialog.locator('.product-pairing')).toHaveCount(0);
      await page.keyboard.press('Escape');
    }
  });
}
