import { expect, test, type Page } from '@playwright/test';
test.use({ locale: 'en-US' });

async function addEspresso(page: Page, option: 'Single' | 'Double' = 'Single') {
  await page.goto('/menu?q=espresso');
  await page.locator('.maro-product').getByRole('button').click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radio', { name: new RegExp(option) }).check();
  await dialog.getByRole('button', { name: 'Add to My Picks', exact: true }).click();
  await expect(dialog).not.toBeVisible();
}

test('picks merge identical sizes, persist, update quantities and show a cashier summary', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 844 });
  await addEspresso(page);
  await addEspresso(page);
  await addEspresso(page, 'Double');
  await expect(page.locator('.picks-launcher')).toContainText('3 picks');
  await expect(page.locator('.picks-launcher')).toBeInViewport();
  await page.reload();
  await page.getByRole('button', { name: 'My Picks', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.picks-item')).toHaveCount(2);
  const single = dialog.locator('.picks-item').filter({ hasText: 'Single' });
  await expect(single.locator('output')).toHaveText('2');
  await single.getByRole('button', { name: /Increase quantity/ }).click();
  await expect(single.locator('output')).toHaveText('3');
  await single.getByRole('button', { name: /Decrease quantity/ }).click();
  await expect(single.locator('output')).toHaveText('2');
  const total = await dialog.locator('.picks-total .maro-price').innerText();
  await dialog.getByRole('button', { name: 'Show to cashier' }).click();
  await expect(dialog.getByRole('heading', { name: 'Picks for the cashier' })).toBeVisible();
  await expect(dialog).toContainText('not a submitted order');
  await expect(dialog.getByRole('button', { name: /Increase quantity/ })).toHaveCount(0);
  await expect(dialog.locator('.picks-total .maro-price')).toHaveText(total);
  expect(await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
  await dialog.getByRole('button', { name: 'Edit your picks' }).click();
  await single.getByRole('button', { name: /Remove/ }).click();
  await expect(dialog.locator('.picks-item')).toHaveCount(1);
  await dialog.getByRole('button', { name: /Remove/ }).click();
  await expect(dialog.getByRole('heading', { name: 'Still deciding?' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Keep exploring' }).click();
  await expect(page.getByRole('button', { name: 'My Picks', exact: true })).toBeFocused();
  await expect(page.locator('.picks-launcher')).toHaveAttribute('data-filled', 'false');
  await page.reload();
  await expect(page.locator('.picks-launcher')).toHaveAttribute('data-filled', 'false');
});

test('picks retain identity across language and theme changes and sync another tab', async ({
  page,
  context,
}) => {
  await addEspresso(page, 'Double');
  await page.getByRole('button', { name: 'Switch to Arabic' }).click();
  await page.getByRole('button', { name: 'تبديل المظهر الفاتح والداكن' }).click();
  await page.getByRole('button', { name: 'اختياراتي', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveAttribute('dir', 'rtl');
  await expect(dialog.locator('.picks-item')).toContainText('دبل');
  await expect(dialog.locator('output')).toHaveText('١');
  await page.keyboard.press('Escape');
  const other = await context.newPage();
  await other.goto('/menu');
  await other.getByRole('button', { name: 'اختياراتي', exact: true }).click();
  await other
    .getByRole('dialog')
    .getByRole('button', { name: /زوّد الكمية/ })
    .click();
  await expect(page.locator('.picks-launcher')).toContainText('٢');
  await other.close();
  await page.getByRole('button', { name: 'اختياراتي', exact: true }).click();
  await expect(dialog.locator('output')).toHaveText('٢');
});

test('blocked device storage keeps the feature usable and explains the session limit', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Blocked', 'QuotaExceededError');
    };
  });
  await addEspresso(page);
  await page.getByRole('button', { name: 'My Picks', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Device saving is unavailable');
  await expect(page.locator('.picks-item')).toHaveCount(1);
});
