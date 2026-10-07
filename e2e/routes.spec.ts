import { test, expect } from '@playwright/test';

// V1/V2/V4 route coverage (runs against build + preview, NOT dev).

test('/tokens renders lab page in shared shell', async ({ page }) => {
  await page.goto('/en/tokens');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.locator('h1')).toContainText('tokens');
});

test('/docs renders stub in shared shell', async ({ page }) => {
  await page.goto('/en/docs');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.locator('h1')).toContainText('Docs');
});

test('unknown route serves 404 with live home link', async ({ page }) => {
  const res = await page.goto('/duong-dan-khong-ton-tai-xyz');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('404');
  // Task 2-4 fix (A01): unprefixed unknown paths serve the root 404, which is
  // EN by default — the VI copy appears only on /vi/* paths (root 404.astro
  // swaps to VI client-side when the prefix is /vi).
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('a:has-text("Back to home.")')).toBeVisible();
});
