import { test, expect } from '@playwright/test';

// V1/V2/V4 route coverage (runs against build + preview, NOT dev).

test('/tokens renders lab page in shared shell', async ({ page }) => {
  await page.goto('/tokens');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.locator('h1')).toContainText('tokens');
});

test('/docs renders stub in shared shell', async ({ page }) => {
  await page.goto('/docs');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.locator('h1')).toContainText('Docs');
});

test('unknown route serves 404 with live home link', async ({ page }) => {
  const res = await page.goto('/duong-dan-khong-ton-tai-xyz');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('404');
  await expect(page.locator('a:has-text("Về trang chủ")')).toBeVisible();
});
