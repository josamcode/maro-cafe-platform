import { expect, test } from '@playwright/test';
test('outside entry exposes the branch and inside journeys', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your next coffee.');
  await expect(page.getByRole('link', { name: 'Explore branches' })).toHaveAttribute(
    'href',
    '/branches',
  );
  await expect(page.getByRole('link', { name: 'Preview the in-store menu' })).toHaveAttribute(
    'href',
    '/in/demo',
  );
});
