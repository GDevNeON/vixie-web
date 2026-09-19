import { test, expect } from '@playwright/test';

// Phase 2 Task 2-4 (FOUN-08, covers V4): responsive matrix.
// Runs against build + preview (NOT dev) via playwright.config webServer.
// Every test below runs in all 3 viewport projects (phone/tablet/desktop);
// the 320px floor and 375 burger checks pin their own viewport explicitly,
// so they hold regardless of which project executes them.

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

test('V4: burger owns the nav at 375 (hidden list → open panel → Escape)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/vi/');
  const burger = page.locator('.burger');
  const nav = page.locator('#site-nav');
  await expect(burger).toBeVisible();
  // Burger-collapsed by design: attached but not visible until opened.
  await expect(nav).toBeAttached();
  await expect(nav).not.toBeVisible();
  // Full hamburger: topbar keeps brand + burger only; CTA, switcher and
  // theme toggle hide into the panel until opened.
  await expect(page.locator('.hright > .hcta')).toBeHidden();
  await expect(page.locator('.hright > nav.switcher')).toBeHidden();
  await expect(page.locator('.hright > .theme-toggle')).toBeHidden();

  await burger.click();
  await expect(nav).toHaveClass(/open/);
  await expect(nav).toBeVisible();
  await expect(burger).toHaveAttribute('aria-expanded', 'true');
  // Open panel carries CTA + switcher + theme toggle as stacked rows.
  await expect(nav.locator('.hcta--panel')).toBeVisible();
  await expect(nav.locator('.switcher--panel')).toBeVisible();
  await expect(nav.locator('.theme-toggle--panel')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(nav).not.toHaveClass(/open/);
  await expect(burger).toHaveAttribute('aria-expanded', 'false');
});
