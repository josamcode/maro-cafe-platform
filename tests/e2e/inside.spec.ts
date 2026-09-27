import { expect, test } from '@playwright/test';

test.use({ locale: 'en-US' });

test('inside branch correction keeps search and picks across locale, reload and the public menu', async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 360, height: 844 });
  await page.goto('/in/faisal?q=espresso');
  await expect(page.getByRole('combobox', { name: 'Your branch' })).toHaveText('Faisal');
  await page
    .getByRole('button', { name: 'Add to My Picks — Espresso · Double', exact: true })
    .click();
  await page.getByRole('combobox', { name: 'Your branch' }).click();
  await page.getByRole('option', { name: 'Sahl Hamza', exact: true }).click();
  await expect(page).toHaveURL(/\/in\/sahl-hamza\?q=espresso/);
  await page.getByRole('button', { name: 'Search the menu', exact: true }).click();
  await expect(page.getByRole('searchbox')).toBeFocused();
  await page.getByRole('searchbox').fill('latte');
  await expect(page).toHaveURL(/\/in\/sahl-hamza\?q=latte/);
  await page.getByRole('button', { name: 'Switch to Arabic' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('combobox', { name: 'فرعك' })).toHaveText('سهل حمزة');
  await page.getByRole('button', { name: 'تبديل المظهر الفاتح والداكن' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'اختياراتي', exact: true }).click();
  await expect(page.locator('.picks-item')).toHaveCount(1);
  await expect(page.locator('.picks-item')).toContainText('دبل');
  await page.getByRole('button', { name: 'اعرض للكاشير', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('لسه مش طلب اتبعت');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'اختياراتي', exact: true })).toBeFocused();
  await page.getByRole('link', { name: 'موقع MARO والفروع' }).click();
  await expect(page).toHaveURL('/');
  await page.goto('/menu');
  await page.getByRole('button', { name: 'اختياراتي', exact: true }).click();
  await expect(page.locator('.picks-item')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await page.goto('/in/main-haram');
  await expect(page.getByRole('combobox', { name: 'فرعك' })).toHaveText('الهرم الرئيسي');
  await expect(page.locator('.picks-header-count')).toHaveText('١');
});

test('QR preview supplies three downloadable codes and rejects unknown branches', async ({
  page,
  request,
}) => {
  await page.goto('/preview/qr');
  await expect(page.locator('.qr-branch')).toHaveCount(3);
  for (const slug of ['faisal', 'sahl-hamza', 'main-haram']) {
    const response = await request.get(`/preview/qr/${slug}?download=1`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/svg+xml');
    expect(response.headers()['content-disposition']).toContain(
      `attachment; filename="maro-${slug}-qr.svg"`,
    );
    expect(await response.text()).toContain('<svg');
  }
  await page.getByRole('link', { name: 'Open menu', exact: true }).first().click();
  await expect(page).toHaveURL('/in/faisal');
  await expect(page.getByRole('combobox', { name: 'Your branch' })).toHaveText('Faisal');
  expect((await request.get('/preview/qr/unknown')).status()).toBe(404);
  await page.goto('/in/unknown');
  await expect(page.getByRole('heading', { name: 'We couldn’t find that branch' })).toBeVisible();
  await page.getByRole('link', { name: 'MARO menu' }).click();
  await expect(page).toHaveURL('/menu');
});

for (const width of [360, 1440]) {
  test(`inside navigation and branch selection fit ${width}px in both languages`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/in/faisal');
    for (const locale of ['en', 'ar']) {
      if (locale === 'ar') await page.getByRole('button', { name: 'Switch to Arabic' }).click();
      await page
        .getByRole('button', {
          name:
            locale === 'ar' ? 'تبديل المظهر الفاتح والداكن' : 'Toggle light and dark appearance',
        })
        .click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      const branch = page.getByRole('combobox', { name: locale === 'ar' ? 'فرعك' : 'Your branch' });
      await branch.press('Enter');
      await expect(page.getByRole('option')).toHaveCount(3);
      await page.keyboard.press('Escape');
      await expect(branch).toBeFocused();
      await page
        .getByRole('button', {
          name: locale === 'ar' ? 'ابحث في المنيو' : 'Search the menu',
          exact: true,
        })
        .click();
      await expect(page.getByRole('searchbox')).toBeFocused();
      await page.getByRole('searchbox').fill('espresso');
      await expect(page).toHaveURL(/\/in\/faisal\?q=espresso/);
      await page
        .getByRole('button', {
          name:
            locale === 'ar'
              ? 'ضيف لاختياراتي — اسبريسو · سنجل'
              : 'Add to My Picks — Espresso · Single',
          exact: true,
        })
        .click();
      await expect(page.locator('.picks-header-launcher')).toBeInViewport();
      await page
        .getByRole('button', { name: locale === 'ar' ? 'اختياراتي' : 'My Picks', exact: true })
        .click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      expect(await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
      await page.keyboard.press('Escape');
    }
  });
}
