import { test, expect } from '@playwright/test';

// V5 reduced-motion kill switch (build + preview, NOT dev).
test.use({ reducedMotion: 'reduce' });

test('reduced motion skips lenis, content settled + native scroll', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-lenis-island]')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__lenis)).toBeUndefined();
  await page.evaluate(() => window.scrollTo(0, 600));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test('reduced motion settles reveals with zero console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));

  for (const url of ['/en/', '/vi/']) {
    await page.goto(url);
    await expect(page.locator('h1')).toBeVisible();
    // Lenis stays off under reduce: no singleton, no init claim attribute.
    expect(await page.evaluate(() => (window as any).__lenis)).toBeUndefined();
    expect(await page.evaluate(() => document.documentElement.hasAttribute('data-lenis-init'))).toBe(
      false,
    );
    // No .armed targets may remain: under reduce the reveal scripts settle
    // (.in) instead of arming, and CSS forces opacity 1 / transform none.
    expect(await page.evaluate(() => document.querySelectorAll('.rv.armed').length)).toBe(0);
    const opacities: string[] = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.rv')).map(
        (el) => getComputedStyle(el).opacity,
      ),
    );
    for (const o of opacities) expect(o).toBe('1');
    await page.evaluate(() => window.scrollTo(0, 600));
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});

test('reduced motion makes the theme transition instant', async ({ page }) => {
  await page.goto('/en/');
  // The global reduce reset kills ALL transitions (* { transition: none }),
  // so the 180ms theme switch on body collapses to 0s — no animation for
  // motion-sensitive users even when toggling theme.
  const durations: string[] = await page.evaluate(
    () => getComputedStyle(document.body).transitionDuration.split(',').map((s) => s.trim()),
  );
  expect(durations.length).toBeGreaterThan(0);
  for (const d of durations) expect(d).toBe('0s');
});
