import { expect, test } from '@playwright/test';

test('Arabic controls support selection, explicit consent, modal focus and LTR switching', async ({
  page,
}) => {
  await page.goto('/design-system');
  const preview = page.getByTestId('localized-preview');
  await expect(preview).toHaveAttribute('dir', 'rtl');
  await expect(preview).toHaveAttribute('lang', 'ar');
  const select = page.getByRole('combobox');
  await select.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.getByRole('option', { name: 'فيصل', exact: true }).click();
  await expect(select).toContainText('فيصل');
  await expect(page.getByRole('listbox')).not.toBeVisible();
  await expect(select).toBeFocused();
  const consent = page.getByRole('checkbox');
  await expect(consent).not.toBeChecked();
  await consent.focus();
  await expect(consent).toBeFocused();
  await page.keyboard.press('Space');
  await expect(consent).toBeChecked();
  await page.getByRole('switch').check();
  await expect(page.getByRole('switch')).toBeChecked();
  await page.getByRole('radio', { name: 'كبير', exact: true }).check();
  await expect(page.getByRole('radio', { name: 'كبير', exact: true })).toBeChecked();
  const details = page.getByRole('button', { name: 'شوف التفاصيل', exact: true }).first();
  await details.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveAttribute('dir', 'rtl');
  await expect(dialog).toHaveAttribute('lang', 'ar');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(details).toBeFocused();
  await page.getByRole('button', { name: 'Switch preview to English' }).click();
  await expect(preview).toHaveAttribute('dir', 'ltr');
  await expect(preview).toHaveAttribute('lang', 'en');
  await page.getByRole('tab', { name: 'Your visit' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Choose a branch');
  await page.getByRole('button', { name: 'Matcha', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Nothing here just yet' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await page.getByRole('button', { name: 'Save to My Picks', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Saved to My Picks' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByLabel('Validation example')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Coming soon', { exact: true })).toBeDisabled();
});

for (const width of [360, 768, 1440]) {
  test(`workbench fits ${width}px in both languages`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/design-system');
    for (const locale of ['ar', 'en']) {
      if (locale === 'en')
        await page.getByRole('button', { name: 'Switch preview to English' }).click();
      await expect(page.getByTestId('localized-preview')).toHaveAttribute('lang', locale);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }
  });
}
