import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { eq, inArray } from 'drizzle-orm';
import {
  createDatabase,
  staffUsers,
  staffSessions,
  products,
  productVariants,
  branchVariants,
  productPairings,
  catalogAudit,
} from '@maro/database';
import { hashPassword } from '@maro/backend';

test.use({ locale: 'en-US' });
test('admin edits reach both menus, support photos, preserve picks and keep mobile forms simple', async ({
  page,
  context,
}) => {
  test.setTimeout(120000);
  const db = createDatabase(process.env.DATABASE_URL!);
  const userId = randomUUID();
  const password = randomUUID();
  const name = `Review ${userId.slice(0, 8)}`;
  try {
    await db.db
      .insert(staffUsers)
      .values({ id: userId, username: userId, passwordHash: await hashPassword(password) });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/admin');
    await page.getByLabel('Username', { exact: true }).fill(userId);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Menu management' })).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: 'test-results/admin-desktop-list.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('link', { name: 'New product', exact: true }).click();
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page.locator('form').getByRole('alert').last()).toContainText(
      'Both names are required',
    );
    await page.getByLabel('Arabic name', { exact: true }).fill(`منتج ${name}`);
    await page.getByLabel('English name', { exact: true }).fill(name);
    await page.getByLabel('Price in EGP', { exact: true }).fill('42.5');
    await page.getByRole('switch', { name: 'Visible to customers', exact: true }).check();
    await expect(page.getByRole('button', { name: /Branches & recommendations/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await page.getByRole('button', { name: 'Choose photo', exact: true }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Upload photo', exact: true })
      .click({ trial: true });
    await page
      .locator('input[type=file]')
      .setInputFiles('apps/web/public/menu/strawberry-matcha.jpg');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: 'test-results/admin-mobile-form.png', fullPage: true });
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page).toHaveURL(/\/admin\?saved=1/);
    const guest = await context.newPage();
    await guest.goto(`/menu?q=${encodeURIComponent(name)}`);
    await expect(guest.locator('.maro-product')).toContainText('42.5');
    await expect(guest.locator('.maro-product img')).toHaveAttribute('src', /media/);
    await guest.getByRole('button', { name: `Add to My Picks — ${name}`, exact: true }).click();
    await page.getByLabel('Find a product', { exact: true }).fill(name);
    await page.getByRole('link', { name: `Edit — ${name}`, exact: true }).click();
    await page.getByLabel('Price in EGP', { exact: true }).clear();
    await page.getByLabel('Price in EGP', { exact: true }).pressSequentially('45.75');
    await page.getByRole('button', { name: /Branches & recommendations/ }).click();
    await page.getByRole('switch', { name: 'Feature on the homepage', exact: true }).check();
    await page.getByLabel('Complementary product', { exact: true }).fill('water');
    await page.getByRole('button', { name: 'Water', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Sahl Hamza', exact: true }).uncheck();
    await page.getByRole('checkbox', { name: 'Main Haram', exact: true }).uncheck();
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page).toHaveURL(/\/admin\?saved=1/);
    await guest.goto('/');
    await expect(guest.locator('.featured-products')).toContainText(name);
    await guest.getByRole('button', { name: `Details & sizes — ${name}`, exact: true }).click();
    await expect(guest.getByRole('dialog').locator('.product-pairing')).toContainText('Water');
    await guest.keyboard.press('Escape');
    await guest.goto(`/in/faisal?q=${encodeURIComponent(name)}`);
    await expect(guest.locator('.maro-product')).toContainText('45.75');
    await guest.getByRole('button', { name: 'My Picks', exact: true }).click();
    await expect(guest.locator('.picks-total .maro-price')).toContainText('45.75');
    await guest.keyboard.press('Escape');
    await guest.goto(`/in/sahl-hamza?q=${encodeURIComponent(name)}`);
    await expect(guest.locator('.maro-product')).toHaveCount(0);
    await guest.getByRole('button', { name: 'My Picks', exact: true }).click();
    await expect(guest.getByRole('dialog')).toContainText('Some saved choices are unavailable');
    await guest.close();
    await page.getByLabel('Find a product', { exact: true }).fill(name);
    await page.getByRole('link', { name: `Edit — ${name}`, exact: true }).click();
    await page.getByRole('button', { name: 'Switch to Arabic' }).click();
    await page.getByRole('button', { name: 'تبديل المظهر الفاتح والداكن' }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await page.getByLabel('الاسم بالعربي', { exact: true }).fill('تعديل غير محفوظ');
    await page.getByRole('button', { name: 'إلغاء', exact: true }).click();
    await expect(page.getByRole('dialog')).toContainText('فيه تعديلات لسه متحفظتش');
    await page.getByRole('button', { name: 'كمّل تعديل', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: 'test-results/admin-arabic-dark.png', fullPage: true });
    await page.getByRole('button', { name: 'إلغاء', exact: true }).click();
    await page.getByRole('button', { name: 'سيب التعديلات', exact: true }).click();
    await page.getByRole('button', { name: 'خروج', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'دخول الإدارة' })).toBeVisible();
  } finally {
    const rows = await db.db.select().from(products).where(eq(products.name, name));
    for (const row of rows)
      await db.db.transaction(async (tx) => {
        const variants = await tx
          .select()
          .from(productVariants)
          .where(eq(productVariants.productId, row.id));
        await tx.delete(catalogAudit).where(eq(catalogAudit.productId, row.id));
        await tx.delete(productPairings).where(eq(productPairings.productId, row.id));
        if (variants.length)
          await tx.delete(branchVariants).where(
            inArray(
              branchVariants.variantId,
              variants.map((v) => v.id),
            ),
          );
        await tx.delete(productVariants).where(eq(productVariants.productId, row.id));
        await tx.delete(products).where(eq(products.id, row.id));
      });
    await db.db.delete(staffSessions).where(eq(staffSessions.userId, userId));
    await db.db.delete(staffUsers).where(eq(staffUsers.id, userId));
    await db.close();
  }
});
