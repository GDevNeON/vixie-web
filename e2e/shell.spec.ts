import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// V1/V4/V5 shell + motion + meta invariants (build + preview, NOT dev).

test('landmarks + island hydration on /en/', async ({ page }) => {
  await page.goto('/en/');
  for (const sel of ['header', 'main', 'footer']) {
    await expect(page.locator(sel).first()).toBeVisible();
  }
  // nav.main is burger-collapsed (display:none) on ≤920px viewports by design —
  // attached in all viewports, visible-open covered by the burger test below.
  await expect(page.locator('nav').first()).toBeAttached();
  await expect(page.locator('[data-hydrated="true"]')).toBeVisible({ timeout: 15000 });
});

test('mobile burger toggles + escape closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/vi/');
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
  await page.goto('/en/');
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
  await page.goto('/en/');
  await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(2);
  const html = await page.content();
  expect(html).not.toMatch(/googleapis|gstatic|googletagmanager|gtag\.js|partytown/i);
});

test('built HTML carries zero analytics strings (F14, V10)', async () => {
  // Task 2-4: grep the STATIC output, not just the live DOM — no analytics
  // snippet may ship in any locale page, the redirect stub, or any 404.
  const dist = join(process.cwd(), 'dist');
  const files = [
    'index.html',
    '404.html',
    'en/index.html',
    'vi/index.html',
    'en/tokens/index.html',
    'vi/tokens/index.html',
    'en/docs/index.html',
    'vi/docs/index.html',
    'en/404/index.html',
    'vi/404/index.html',
  ];
  const re =
    /googleapis|gstatic|googletagmanager|gtag\.js|google-analytics|analytics\.js|partytown|plausible|umami|hotjar|segment\.io|mixpanel/i;
  for (const f of files) {
    const html = readFileSync(join(dist, f), 'utf8');
    expect(html, `${f} must ship zero analytics strings`).not.toMatch(re);
  }
});
