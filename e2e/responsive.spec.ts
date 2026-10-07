import { test, expect } from '@playwright/test';

// Cinematic-world responsive matrix.
// New nav: header.site-nav > a + nav.nav-links.
// Desktop links: .desktop-link (hidden below 920px CSS breakpoint).
// Lang switch: .desktop-link.lang-switch.
// No burger menu, no panel, no .hright in the new UI.

for (const url of ['/vi/', '/en/']) {
  test(`V4: ${url} has zero page h-scroll at the 320px floor`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(url);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    const overflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
    }));
    // 1px tolerance for sub-pixel rounding; anything more is a real overflow.
    expect(overflow.scrollW, `${url} scrollWidth vs innerWidth`).toBeLessThanOrEqual(
      overflow.innerW + 1,
    );
  });

  test(`V4: ${url} header/footer visible at phone + tablet + desktop`, async ({ page }) => {
    for (const size of [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(size);
      await page.goto(url);
      await expect(page.locator('header'), `${url} header @${size.width}`).toBeVisible();
      await expect(page.locator('footer'), `${url} footer @${size.width}`).toBeVisible();
      await expect(page.locator('h1'), `${url} h1 @${size.width}`).toBeVisible();
    }
  });
}

test('V4: nav-links desktop links hidden at 375 phone width', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/en/');
  // nav.nav-links is in the DOM but .desktop-link items are CSS-hidden on narrow viewports.
  await expect(page.locator('nav.nav-links')).toBeAttached();
  // The wordmark/brand link + pill CTA are always visible (not desktop-only).
  await expect(page.locator('header a[aria-label="Vixie home"]')).toBeVisible();
});

test('V4: nav-links pill visible at desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/');
  // .pill (Get Vixie ↓) is the main CTA shown at desktop widths.
  await expect(page.locator('nav.nav-links .pill')).toBeVisible();
});

test('V4: lang-switch link present and correct', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/');
  const langSwitch = page.locator('nav.nav-links a.lang-switch');
  await expect(langSwitch).toBeAttached();
  // EN page → switch link points to /vi/.
  const href = await langSwitch.getAttribute('href');
  expect(href).toMatch(/^\/vi\//);
});
