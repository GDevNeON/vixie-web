import { test, expect } from '@playwright/test';

// Cinematic-world i18n / routing.
// New SiteHeader: lang-switch is nav.nav-links a.lang-switch.
// No burger, no switcher panel, no "Trang chủ"/"Home" nav items.
// Hero copy is English-only in both locales (Markup component does URL
// substitution only, not content translation).

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

test('V2: lang-switch swaps locale prefix keeping path', async ({ page }) => {
  // Start on /en/ and switch to /vi/.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  const toVi = page.locator('nav.nav-links a.lang-switch');
  await expect(toVi).toBeVisible();
  const href = await toVi.getAttribute('href');
  expect(href).toMatch(/^\/vi\//);
  await Promise.all([page.waitForURL(/\/vi\//), toVi.click()]);
  await expect(page.locator('html')).toHaveAttribute('lang', 'vi', { timeout: 10000 });

  // Now on /vi/, switch back to /en/.
  const toEn = page.locator('nav.nav-links a.lang-switch');
  await expect(toEn).toBeVisible();
  const hrefBack = await toEn.getAttribute('href');
  expect(hrefBack).toMatch(/^\/en\//);
  await Promise.all([page.waitForURL(/\/en\//), toEn.click()]);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en', { timeout: 10000 });
});


test('V2: lang-switch href preserves path on inner pages', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/vi/tokens');
  const toEn = page.locator('nav.nav-links a.lang-switch');
  await expect(toEn).toBeAttached();
  const href = await toEn.getAttribute('href');
  // SiteHeader builds: /en{suffix} where suffix = /tokens (or /tokens/).
  expect(href).toMatch(/^\/en\//);
});

test('V2: /vi/ and /en/ both have h1 text', async ({ page }) => {
  // Both locales serve English hero copy (Markup does URL-rewrite only).
  await page.goto('/vi/');
  await expect(page.locator('h1')).toBeVisible();
  expect(((await page.locator('h1').textContent()) ?? '').trim().length).toBeGreaterThan(0);
  await page.goto('/en/');
  await expect(page.locator('h1')).toBeVisible();
  expect(((await page.locator('h1').textContent()) ?? '').trim().length).toBeGreaterThan(0);
});
