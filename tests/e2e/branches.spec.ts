import { expect, test } from '@playwright/test';
test.use({ locale: 'en-US' });

test('public branch journey provides source-listed directions, menu context and inside entry', async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore location — Faisal', exact: true }).click();
  await expect(page).toHaveURL('/branches/faisal');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Faisal');
  await expect(page.locator('address')).toContainText('6 Al-Omara Street');
  await expect(page.getByRole('link', { name: 'Get directions — Faisal' })).toHaveAttribute(
    'href',
    'https://maps.app.goo.gl/ZaSq4xeTkhSkxjcN6',
  );
  await expect(page.getByRole('link', { name: 'Call MARO', exact: true })).toHaveAttribute(
    'href',
    'tel:+201158750004',
  );
  await expect(
    page.getByText('Call us to confirm this branch’s hours before visiting.'),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Explore menu & prices', exact: true }).click();
  await expect(page).toHaveURL('/menu?branch=faisal');
  await page.getByRole('searchbox').fill('espresso');
  await page
    .getByRole('button', { name: 'Add to My Picks — Espresso · Single', exact: true })
    .click();
  await page
    .getByRole('link', { name: 'At MARO right now? Open branch menu', exact: true })
    .click();
  await expect(page).toHaveURL('/in/faisal?q=espresso');
  await page.getByRole('button', { name: 'My Picks', exact: true }).click();
  await expect(page.locator('.picks-item')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await page.goto('/branches/main-haram');
  await expect(page.locator('address')).toHaveText('El Haram Street, Giza');
  await expect(page.locator('main')).not.toContainText(/427|430|24 hours/);
  await expect(page.getByRole('link', { name: 'Get directions — Main Haram' })).toHaveAttribute(
    'href',
    'https://maps.app.goo.gl/7dMZ25kGE4Evoz8i7',
  );
  await page.goto('/branches/unknown');
  await expect(page.getByRole('heading', { name: 'We couldn’t find that location' })).toBeVisible();
  await page.getByRole('link', { name: 'All locations', exact: true }).click();
  await expect(page).toHaveURL('/branches');
  await expect(page.locator('.branch-list-row')).toHaveCount(3);
});

test('manual inside entry is optional, keyboard accessible and preserves menu filters', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 844 });
  await page.goto('/menu?category=iced&q=latte');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  const trigger = page.getByRole('button', { name: 'At MARO right now?', exact: true });
  await trigger.press('Enter');
  await expect(page.getByRole('dialog')).toHaveAttribute('dir', 'ltr');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('dialog').getByRole('link', { name: 'Sahl Hamza', exact: true }).click();
  await expect(page).toHaveURL('/in/sahl-hamza?q=latte&category=iced');
  await expect(page.getByRole('searchbox')).toHaveValue('latte');
  await expect(page.getByRole('combobox', { name: 'Your branch' })).toHaveText('Sahl Hamza');
  await page.goto('/');
  await expect(page.locator('.inside-header')).toHaveCount(0);
});

for (const width of [360, 768, 1440]) {
  test(`branch pages and context dialog fit ${width}px in both languages and themes`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/branches');
    for (const locale of ['en', 'ar']) {
      if (locale === 'ar') await page.getByRole('button', { name: 'Switch to Arabic' }).click();
      await page
        .getByRole('button', {
          name:
            locale === 'ar' ? 'تبديل المظهر الفاتح والداكن' : 'Toggle light and dark appearance',
        })
        .click();
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      const trigger = page.getByRole('button', {
        name: locale === 'ar' ? 'أنت في MARO دلوقتي؟' : 'At MARO right now?',
        exact: true,
      });
      await trigger.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      await expect(dialog.getByRole('link')).toHaveCount(3);
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      await page
        .getByRole('link', {
          name: locale === 'ar' ? 'شوف الفرع — سهل حمزة' : 'Explore location — Sahl Hamza',
          exact: true,
        })
        .click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        locale === 'ar' ? 'سهل حمزة' : 'Sahl Hamza',
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(page.locator('.branch-hero .branch-actions a').first()).toBeInViewport();
      await page.reload();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        locale === 'ar' ? 'سهل حمزة' : 'Sahl Hamza',
      );
      await page
        .getByRole('link', { name: locale === 'ar' ? 'كل الفروع' : 'All locations', exact: true })
        .click();
    }
  });
}
