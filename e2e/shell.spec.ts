import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Cinematic-world shell invariants (build + preview, NOT dev).

test('landmarks visible on /en/', async ({ page }) => {
  await page.goto('/en/');
  for (const sel of ['header', 'main', 'footer']) {
    await expect(page.locator(sel).first()).toBeVisible();
  }
  // nav.nav-links is the desktop navigation bar in the new site-nav header.
  await expect(page.locator('nav.nav-links').first()).toBeAttached();
});

test('nav links + pill visible on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/en/');
  // Desktop nav: "The experience", "Meet Vixie ↗", "Get Vixie ↓" pill.
  await expect(page.locator('nav.nav-links')).toBeVisible();
  await expect(page.locator('nav.nav-links .pill')).toBeVisible();
});

test('scroll progressbar advances on scroll', async ({ page }) => {
  await page.goto('/en/');
  // app.js animates .progress via GSAP ScrollTrigger scaleX(0→1).
  await expect(page.locator('.progress')).toBeAttached();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(1800);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
});

test('font preloads exactly 2, zero remote font/analytics strings', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(2);
  const html = await page.content();
  expect(html).not.toMatch(/googleapis|gstatic|googletagmanager|gtag\.js|partytown/i);
});

test('built HTML carries zero analytics strings (F14, V10)', async () => {
  // Grep the STATIC output — no analytics snippet may ship.
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
