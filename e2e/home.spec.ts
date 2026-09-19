import { test, expect } from '@playwright/test';

// Task 2-4 smoke (V8): runs against build + preview (NOT dev) via playwright.config webServer.
// Phase 2 Task 1-1: `/` is a redirect stub to `/en/`, so homepage asserts target `/vi/` directly
// (`/` → `/en/` is covered in e2e/i18n.spec.ts).
test('homepage renders header + footer + h1', async ({ page }) => {
  await page.goto('/vi/');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.locator('h1')).toContainText('hình nền');
});
