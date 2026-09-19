import { test, expect } from '@playwright/test';

// Phase 2 Task 2-4 (FOUN-10, covers V6): theme system matrix.
// Runs against build + preview (NOT dev) via playwright.config webServer,
// in all 3 viewport projects (phone/tablet/desktop).
//
// Contract under test (Task 2-1, BaseLayout anti-FOUC + Header toggle):
// - storage key is exactly `vixie-theme` ('dark' | 'light')
// - explicit choice persists across reload; otherwise OS decides
// - toggle is sun/moon + aria-pressed, in .hright AND the burger panel
// - body theme switch runs on the 180ms token (var(--dur)), never instant

const THEME_KEY = 'vixie-theme';
// Toggle under test: .hright owns the desktop toggle (this spec pins 1280px,
// so .hright is always visible here); the --panel duplicate lives inside the
// burger dropdown ≤920px (hidden until open, covered by responsive.spec).
const TOGGLE = '.hright [data-theme-toggle]';

test('V6: toggle persists across reload + vixie-theme key assert', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/en/');
  const toggle = page.locator(TOGGLE);
  await expect(toggle).toBeVisible();

  await toggle.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBe('dark');

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator(TOGGLE)).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBe('dark');

  await page.locator(TOGGLE).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBe('light');

  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBe('light');
});

test('V6: OS dark sets initial theme with no stored choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveClass(/dark/);
  expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBeNull();
});

test('V6: OS light sets initial theme with no stored choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/en/');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBeNull();
});

test('V6: theme switch runs on the 180ms token, never instant', async ({ page }) => {
  await page.goto('/en/');
  const durations: string[] = await page.evaluate(
    () => getComputedStyle(document.body).transitionDuration.split(',').map((s) => s.trim()),
  );
  // body declares background-color + color on var(--dur) = 180ms = 0.18s.
  expect(durations.length).toBeGreaterThan(0);
  for (const d of durations) {
    expect(d, `body transition ${d} must be the 180ms token, not instant`).toBe('0.18s');
  }
});
