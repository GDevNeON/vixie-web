import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Phase 2 Task 2-4 (FOUN-09/12, covers V5/V8): axe matrix + skip-link.
// Runs against build + preview (NOT dev) via playwright.config webServer,
// in all 3 viewport projects (phone/tablet/desktop).
//
// - 8 shell samples × light + dark = 16 AxeBuilder runs (wcag2a + wcag2aa):
//   0 critical/serious to pass; moderate/minor are LOGGED, never gated.
//   (Task 2-5 sweep: 2-4's 5 samples + /vi/docs + /en/404 + /vi/404 — the
//   404s carry the Task 2-5 `.miss a` underline-always-on fix.)
// - skip-link (V7): first Tab stop, visible on focus, Enter moves focus to #main.

const SAMPLES = ['/en/', '/vi/', '/en/tokens', '/vi/tokens', '/en/docs', '/vi/docs', '/en/404', '/vi/404'];

for (const theme of ['light', 'dark'] as const) {
  for (const url of SAMPLES) {
    test(`V8: axe wcag2a+wcag2aa ${url} [${theme}] → 0 critical/serious`, async ({ page }) => {
      await page.addInitScript((mode) => {
        try {
          localStorage.setItem('vixie-theme', mode);
        } catch {
          // Private mode: OS default applies; axe still runs the page as-is.
        }
      }, theme);
      await page.goto(url);
      if (theme === 'dark') await expect(page.locator('html')).toHaveClass(/dark/);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );
      const advisory = results.violations.filter(
        (v) => v.impact !== 'critical' && v.impact !== 'serious',
      );
      // Moderate + minor are logged for the 2-5 sweep, never gated here.
      if (advisory.length > 0) {
        console.log(
          `[axe advisory] ${url} [${theme}]: ` +
            advisory.map((v) => `${v.impact}:${v.id}`).join(', '),
        );
      }
      expect(
        blocking.map((v) => `${v.impact}:${v.id} (${v.nodes.length} nodes)`),
        `axe critical/serious on ${url} [${theme}]`,
      ).toEqual([]);
    });
  }
}

test('V7: skip-link is first Tab stop and moves focus to #main', async ({ page }) => {
  await page.goto('/en/');
  const skip = page.locator('.skip-link');
  await expect(skip).toHaveAttribute('href', '#main');

  await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
  // Focus-visible style: pinned into view with the cyan 3px ring.
  expect(await skip.evaluate((el) => getComputedStyle(el).top)).toBe('12px');

  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('main');
  await expect(page.locator('#main')).toBeFocused();
});
