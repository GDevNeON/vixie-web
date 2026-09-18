import { test, expect } from '@playwright/test';

// V1/V4/V5 shell + motion + meta invariants (build + preview, NOT dev).

test('landmarks + island hydration on /', async ({ page }) => {
  await page.goto('/');
  for (const sel of ['header', 'main', 'footer', 'nav']) {
    await expect(page.locator(sel).first()).toBeVisible();
  }
  await expect(page.locator('[data-hydrated="true"]')).toBeVisible({ timeout: 15000 });
});

test('mobile burger toggles + escape closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const burger = page.locator('.burger');
  await burger.click();
  await expect(page.locator('#site-nav')).toHaveClass(/open/);
  await expect(burger).toHaveAttribute('aria-expanded', 'true');
  await expect(burger).toContainText('ĐÓNG');
  await page.keyboard.press('Escape');
  await expect(page.locator('#site-nav')).not.toHaveClass(/open/);
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
});

test('lenis singleton + progressbar advance on scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-hydrated="true"]')).toBeVisible({ timeout: 15000 });
  await page.waitForFunction(() => (window as any).__lenis !== undefined, null, {
    timeout: 15000,
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(1800);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
  const now = await page.locator('#scroll-progress').getAttribute('aria-valuenow');
  expect(Number(now)).toBeGreaterThan(0);
});

test('font preloads exactly 2, zero remote font/analytics strings', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(2);
  const html = await page.content();
  expect(html).not.toMatch(/googleapis|gstatic|googletagmanager|gtag\.js|partytown/i);
});
