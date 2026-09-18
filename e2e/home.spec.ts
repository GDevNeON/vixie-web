import { test, expect } from '@playwright/test';

// Task 2-4 smoke (V8): runs against build + preview (NOT dev) via playwright.config webServer.
test('homepage renders header + footer + h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.locator('h1')).toContainText('hình nền');
});
