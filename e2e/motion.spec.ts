import { test, expect } from '@playwright/test';

// V5 reduced-motion kill switch (build + preview, NOT dev).
test.use({ reducedMotion: 'reduce' });

test('reduced motion skips lenis, content settled + native scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-lenis-island]')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__lenis)).toBeUndefined();
  await page.evaluate(() => window.scrollTo(0, 600));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});
