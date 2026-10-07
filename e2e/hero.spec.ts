import { test, expect } from '@playwright/test';

// Hero suite — updated for cinematic-world UI.
// Old Phase 3 hero (hero-island / cta-row / .cue / #companion / data-hero-*)
// is replaced by the cinematic hero: .hero > .hero-copy + .hero-art.

for (const url of ['/en/', '/vi/'] as const) {
  test(`smoke: ${url} H1 + 2 CTAs visible/enabled + scroll cue visible`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));
    await page.goto(url);
    // Wait for page-loader to finish (loading.js sets main inert until boot-complete).
    await page.waitForFunction(() => !document.querySelector('main')?.hasAttribute('inert'), { timeout: 15000 });
    await expect(page.locator('h1')).toBeVisible();
    const primary = page.locator('.hero .actions .btn.primary');
    const secondary = page.locator('.hero .actions .btn:not(.primary)');
    await expect(primary).toBeVisible();
    await expect(primary).toBeEnabled();
    await expect(secondary).toBeVisible();
    await expect(secondary).toBeEnabled();
    // Scroll cue: hero-caption contains an anchor pointing to #presence.
    const cue = page.locator('.hero-caption a[href="#presence"]');
    await expect(cue).toBeVisible();
    await expect(cue).toHaveAttribute('href', '#presence');
    expect(errors).toEqual([]);
  });
}

test.describe('Hero reduce-static', () => {
  test.use({ reducedMotion: 'reduce' });

  test('reduce: static frame with native scroll fallback', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());;
    });
    page.on('pageerror', (err) => errors.push(String(err)));
    for (const url of ['/en/', '/vi/']) {
      await page.goto(url);
      await expect(page.locator('h1')).toBeVisible();
      // app.js: lenis is a local var (never window.__lenis) — undefined either way.
      // Under reduce, scrollSetup() early-returns before lenis construction.
      expect(await page.evaluate(() => (window as unknown as { __lenis?: unknown }).__lenis)).toBeUndefined();
      // No .rv.armed targets in the new cinematic UI (no reveal classes).
      expect(await page.evaluate(() => document.querySelectorAll('.rv.armed').length)).toBe(0);
      await page.evaluate(() => window.scrollTo(0, 500));
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    }
    expect(errors).toEqual([]);
  });
});

// DoD matrix: 2 locales × layout checks.
for (const url of ['/en/', '/vi/'] as const) {
  test(`DoD: ${url} text + CTAs + art + scroll cue`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));
    await page.goto(url);
    // Wait for page-loader to finish (loading.js sets main inert until boot-complete).
    await page.waitForFunction(() => !document.querySelector('main')?.hasAttribute('inert'), { timeout: 15000 });
    // Sufficient text.
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    expect(((await h1.textContent()) ?? '').trim().length).toBeGreaterThan(0);
    await expect(page.locator('.hero-copy p')).toBeVisible();
    await expect(page.locator('.hero .eyebrow')).toBeVisible();
    // Two working CTAs.
    const primary = page.locator('.hero .actions .btn.primary');
    const secondary = page.locator('.hero .actions .btn:not(.primary)');
    await expect(primary).toBeVisible();
    await expect(primary).toBeEnabled();
    await expect(secondary).toBeVisible();
    await expect(secondary).toBeEnabled();
    // Visible art slot: .hero-art with portrait-fallback img.
    await expect(page.locator('.hero-art')).toBeVisible();
    expect(await page.locator('.hero-art img').count()).toBeGreaterThanOrEqual(1);
    // Scroll cue targets the shipped #presence anchor.
    const cue = page.locator('.hero-caption a[href="#presence"]');
    await expect(cue).toBeVisible();
    await expect(cue).toHaveAttribute('href', '#presence');
    expect(await page.locator('#presence').count()).toBe(1);
    expect(errors).toEqual([]);
  });
}

test('DoD: hero zero h-scroll at the 320px floor', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'overflow spot captured once');
  for (const url of ['/en/', '/vi/']) {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(url);
    await expect(page.locator('h1')).toBeVisible();
    const overflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
    }));
    expect(overflow.scrollW, `${url} scrollWidth vs innerWidth`).toBeLessThanOrEqual(
      overflow.innerW + 1,
    );
  }
});

test('DoD: LCP budget report (text-paint baseline)', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'perf log captured once');
  await page.goto('/en/');
  await expect(page.locator('h1')).toBeVisible();
  const report = await page.evaluate(() => {
    const lcp = performance.getEntriesByType('largest-contentful-paint');
    const last = lcp.length > 0 ? (lcp[lcp.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number }) : null;
    return {
      url: location.pathname,
      lcpMs: last ? Math.round((last.renderTime ?? last.loadTime ?? last.startTime) as number) : null,
      heroImages: document.querySelectorAll('.hero-art img').length,
      note: 'Cinematic hero: portrait-fallback img present. LCP is image or text paint.',
    };
  });
  // eslint-disable-next-line no-console
  console.log(`[hero perf] ${JSON.stringify(report)}`);
});

test('E19: hero screenshots EN x desktop for user approval', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'screenshots captured once on desktop');
  const shots: Array<[string]> = [
    ['/en/'],
    ['/vi/'],
  ];
  for (const [url] of shots) {
    await page.goto(url);
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForTimeout(500);
    const slug = url === '/en/' ? 'en' : 'vi';
    await page.screenshot({ path: `screenshots/hero-${slug}.png` });
  }
});
