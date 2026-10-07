import { test, expect } from '@playwright/test';

// Cinematic-world reduced-motion kill switch (build + preview, NOT dev).
// app.js: lenis is a module-local var (never window.__lenis).
// Under prefers-reduced-motion: reduce, scrollSetup() early-returns
// before constructing lenis → window.__lenis stays undefined (as always).
// No .rv / .armed reveal classes in the new cinematic UI.
test.use({ reducedMotion: 'reduce' });

test('reduced motion: content visible, native scroll works', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('h1')).toBeVisible();
  // lenis is a local var in app.js — never on window in either motion state.
  expect(await page.evaluate(() => (window as any).__lenis)).toBeUndefined();
  await page.evaluate(() => window.scrollTo(0, 600));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test('reduced motion settles with zero console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));

  for (const url of ['/en/', '/vi/']) {
    await page.goto(url);
    await expect(page.locator('h1')).toBeVisible();
    // lenis local var — always undefined on window.
    expect(await page.evaluate(() => (window as any).__lenis)).toBeUndefined();
    // No .rv reveal classes in cinematic-world.
    expect(await page.evaluate(() => document.querySelectorAll('.rv.armed').length)).toBe(0);
    await page.evaluate(() => window.scrollTo(0, 600));
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});

test('reduced motion: page loads without JS errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  await page.goto('/en/');
  await expect(page.locator('h1')).toBeVisible();
  expect(errors).toEqual([]);
});
