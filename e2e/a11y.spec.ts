import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Cinematic-world a11y matrix.
// skip-link: class .skip (was .skip-link), href="#main", focus style.

const SAMPLES = ['/en/', '/vi/', '/en/tokens', '/vi/tokens', '/en/docs', '/vi/docs', '/en/404', '/vi/404'];

for (const url of SAMPLES) {
  test(`V8: axe wcag2a+wcag2aa ${url} → 0 critical/serious`, async ({ page }) => {
    await page.goto(url);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    const advisory = results.violations.filter(
      (v) => v.impact !== 'critical' && v.impact !== 'serious',
    );
    if (advisory.length > 0) {
      console.log(
        `[axe advisory] ${url}: ` +
          advisory.map((v) => `${v.impact}:${v.id}`).join(', '),
      );
    }
    expect(
      blocking.map((v) => `${v.impact}:${v.id} (${v.nodes.length} nodes)`),
      `axe critical/serious on ${url}`,
    ).toEqual([]);
  });
}

test('V7: skip-link (.skip) is first Tab stop and moves focus to #main', async ({ page }) => {
  await page.goto('/en/');
  // loading.js sets .skip as inert during boot; wait for it to clear.
  await page.waitForFunction(() => !document.querySelector('.skip')?.hasAttribute('inert'), { timeout: 15000 });
  // New SiteLayout uses class="skip" (was .skip-link).
  const skip = page.locator('.skip');
  await expect(skip).toHaveAttribute('href', '#main');

  await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();

  await page.keyboard.press('Enter');
  // SiteLayout inline script: document.getElementById('main').focus().
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('main');
  await expect(page.locator('#main')).toBeFocused();
});
