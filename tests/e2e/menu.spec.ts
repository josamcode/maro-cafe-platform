import { expect, test } from '@playwright/test';
test.use({ locale: 'en-US' });

test('mobile categories start closed, support keyboard and reveal search matches', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 844 });
  await page.goto('/menu');
  for (const locale of ['en', 'ar']) {
    if (locale === 'ar') await page.getByRole('button', { name: 'Switch to Arabic' }).click();
    const groups = page.locator('.menu-group');
    await expect(groups).toHaveCount(6);
    await expect(page.locator('.maro-product:visible')).toHaveCount(0);
    expect((await page.locator('.menu-tools').boundingBox())!.height).toBeLessThan(75);
    const trigger = groups.first().getByRole('button').first();
    await trigger.focus();
    await trigger.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(groups.first().locator('.maro-product').first()).toBeVisible();
    await expect(groups.nth(1).locator('.maro-product').first()).not.toBeVisible();
    await trigger.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await page.getByRole('searchbox').fill('spanish');
    await expect(page.locator('.maro-product:visible')).toHaveCount(1);
    await page.getByRole('searchbox').fill('');
    await expect(page.locator('.maro-product:visible')).toHaveCount(0);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.maro-product:visible')).toHaveCount(126);
  await expect(page.locator('.menu-group .maro-disclosure-trigger:visible')).toHaveCount(0);
  await page.setViewportSize({ width: 360, height: 844 });
  await expect(page.locator('.maro-product:visible')).toHaveCount(0);
});

test('menu preserves search, categories and branch context across navigation and locale changes', async ({
  page,
}) => {
  await page.goto('/menu?category=iced&branch=faisal');
  await expect(page.locator('.menu-branch-context')).toContainText('Faisal');
  await page.getByRole('searchbox').fill('spanish');
  await expect(page.locator('.maro-product')).toHaveCount(1);
  await page.reload();
  await expect(page.getByRole('searchbox')).toHaveValue('spanish');
  await page.getByRole('button', { name: 'Switch to Arabic' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('.maro-product')).toHaveCount(1);
  await expect(page.locator('.menu-branch-context')).toContainText('فيصل');
  await page.getByRole('searchbox').fill('سـبَانيش');
  await expect(page.locator('.maro-product')).toHaveCount(1);
  await page.getByRole('searchbox').fill('nothing like this');
  await expect(page.getByRole('heading', { name: 'مفيش نتائج للاختيار ده' })).toBeVisible();
  await page.getByRole('button', { name: 'عرض المنيو كله', exact: true }).last().click();
  await expect(page.locator('.maro-product')).toHaveCount(126);
  await expect(page).toHaveURL(/branch=faisal$/);
  await page.goBack();
  await expect(page.getByRole('searchbox')).toHaveValue('nothing like this');
  await page.goto('/menu?category=unknown&branch=unknown');
  await expect(page.locator('.maro-product')).toHaveCount(126);
  await expect(page.locator('.menu-branch-context')).toHaveCount(0);
});

test('a whole product card opens real size prices and restores keyboard focus', async ({
  page,
}) => {
  await page.goto('/menu?category=hot&q=espresso');
  const card = page
    .locator('.maro-product')
    .filter({ has: page.getByRole('heading', { name: 'Espresso', exact: true }) });
  await card.click({ position: { x: 12, y: 12 } });
  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveAttribute('lang', 'en');
  await expect(dialog.getByRole('radio', { name: /Single/ })).toBeChecked();
  const before = await dialog.locator('.menu-selection .maro-price').innerText();
  await dialog.getByRole('radio', { name: /Double/ }).check();
  await expect(dialog.locator('.menu-selection .maro-price')).not.toHaveText(before);
  await expect(dialog.locator('.menu-selection')).toContainText('Double');
  await page.keyboard.press('Escape');
  const trigger = card.getByRole('button', { name: /Details/ });
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await expect(dialog.getByRole('radio', { name: /Double/ })).toBeChecked();
  await dialog.getByRole('button', { name: 'Back to the menu' }).click();
  await expect(trigger).toBeFocused();
  await page.goto('/menu?q=green%20tea');
  await page
    .locator('.maro-product')
    .getByRole('button', { name: /Details/ })
    .click();
  await expect(dialog.getByRole('radio')).toHaveCount(0);
  await expect(dialog.locator('.menu-selection')).toContainText('28');
});

for (const width of [360, 768, 1440]) {
  test(`menu and details fit ${width}px in both languages and themes`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/menu?category=hot');
    for (const locale of ['en', 'ar']) {
      if (locale === 'ar') await page.getByRole('button', { name: 'Switch to Arabic' }).click();
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await page
        .getByRole('button', {
          name:
            locale === 'ar' ? 'تبديل المظهر الفاتح والداكن' : 'Toggle light and dark appearance',
        })
        .click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      const card = page.locator('.maro-product').first();
      await card.click({ position: { x: 10, y: 10 } });
      const dialog = page.getByRole('dialog');
      await expect(dialog).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      await expect(
        dialog.getByRole('button', { name: locale === 'ar' ? 'إغلاق' : 'Close', exact: true }),
      ).toBeInViewport();
      await page.keyboard.press('Escape');
      await expect(
        card.getByRole('button', { name: locale === 'ar' ? /التفاصيل والمقاسات/ : /Details/ }),
      ).toBeFocused();
    }
  });
}
