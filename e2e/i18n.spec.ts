import { test, expect } from '@playwright/test';

// Phase 2 Task 1-4 tracer gate (FOUN-06/07, covers V1/V2/V3).
// Runs against build + preview (NOT dev) via playwright.config webServer.
// Runs in all 3 viewport projects (phone/tablet/desktop) sharing ONE webServer:
// - copy asserts scope to `header` text (includes burger-collapsed nav on ≤920px)
// - switcher clicks are viewport-aware: full hamburger ≤920px hides the .hright
//   switcher into the burger panel, so open the burger and use the panel copy
//   when the burger is visible; desktop uses .hright directly.

test('V1: / redirects to /en/', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('V1: /en/ + /vi/ + /en/tokens + /vi/tokens + /en/docs + /vi/docs 200 with correct html[lang]', async ({
  page,
}) => {
  const cases: Array<[string, string]> = [
    ['/en/', 'en'],
    ['/vi/', 'vi'],
    ['/en/tokens', 'en'],
    ['/vi/tokens', 'vi'],
    ['/en/docs', 'en'],
    ['/vi/docs', 'vi'],
  ];
  for (const [url, lang] of cases) {
    const res = await page.goto(url);
    expect(res?.status(), `${url} status`).toBe(200);
    await expect(page.locator('html'), `${url} lang`).toHaveAttribute('lang', lang);
  }
});

test('V1: old unprefixed /tokens 404s', async ({ page }) => {
  const res = await page.goto('/tokens');
  expect(res?.status()).toBe(404);
});

test('V2: switcher swaps prefix keeping path+query+hash', async ({ page }) => {
  const burger = page.locator('.burger');
  const switcherLink = async () => {
    if (await burger.isVisible()) {
      await burger.click();
      await expect(page.locator('#site-nav')).toHaveClass(/open/);
      return page.locator('.switcher--panel a[data-switcher]');
    }
    return page.locator('.hright nav.switcher a[data-switcher]');
  };

  await page.goto('/vi/tokens?a=1#s');
  const toEn = await switcherLink();
  await expect(toEn).toHaveAttribute('href', '/en/tokens?a=1#s');
  await toEn.click();
  await expect(page).toHaveURL(/\/en\/tokens\?a=1#s/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  const toVi = await switcherLink();
  await expect(toVi).toHaveAttribute('href', '/vi/tokens?a=1#s');
  await toVi.click();
  await expect(page).toHaveURL(/\/vi\/tokens\?a=1#s/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
});

test('V2: /vi/ shows Trang chủ, /en/ shows Home', async ({ page }) => {
  await page.goto('/vi/');
  await expect(page.locator('header')).toContainText('Trang chủ');
  await page.goto('/en/');
  await expect(page.locator('header')).toContainText('Home');
});
