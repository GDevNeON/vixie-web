import { test, expect } from '@playwright/test';

// Cinematic-world homepage smoke.
// Both /en/ and /vi/ serve the same English hero copy (Markup does URL
// substitution only, not content translation). Assert h1 is visible and
// non-empty rather than specific copy.

test('homepage renders header + footer + h1', async ({ page }) => {
  await page.goto('/vi/');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  const h1 = page.locator('h1');
  await expect(h1).toBeVisible();
  expect(((await h1.textContent()) ?? '').trim().length).toBeGreaterThan(0);
});
