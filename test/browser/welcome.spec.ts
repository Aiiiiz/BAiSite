import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { welcome as config } from '../../src/config/site';

test('first visit can enter, remembers the visit, and can reopen from the footer', async ({ page }) => {
  await page.goto('/');
  const welcome = page.getByRole('dialog', { name: config.title, exact: true });
  await expect(welcome).toBeVisible();
  await expect(welcome.getByRole('button', { name: '进入博客', exact: true })).toBeFocused();
  await page.keyboard.press('/');
  await expect(page.locator('[data-search-dialog]')).not.toBeVisible();
  await welcome.getByRole('button', { name: '进入博客', exact: true }).click();
  await expect(welcome).not.toBeVisible();
  await expect(page.locator('#main')).toBeFocused();
  await page.reload(); await expect(welcome).not.toBeVisible();
  await page.getByRole('button', { name: '重看欢迎页' }).click(); await expect(welcome).toBeVisible();
  await page.keyboard.press('Escape'); await expect(welcome).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.classList.contains('has-welcome'))).toBe(false);
});

test('welcome links use real pages and back navigation does not trap the reader', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('dialog').getByRole('link', { name: '关于我', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await page.goBack(); await expect(page.locator('[data-welcome]')).not.toBeVisible();
  await page.getByRole('button', { name: '重看欢迎页' }).click();
  await page.getByRole('dialog').getByRole('link', { name: '直接浏览全部文章' }).click();
  await expect(page).toHaveURL(/\/archive\/$/);
});

test('article and anchored links stay direct, and no JavaScript still permits reading', async ({ page, browser }) => {
  await page.goto('/posts/everyday-space/'); await expect(page.getByRole('heading', { level: 1 })).toHaveText('给日常留一点空白');
  await page.goto('/#notes'); await expect(page.locator('[data-welcome]')).not.toBeVisible();
  const noJs = await browser.newContext({ javaScriptEnabled: false }); const fallback = await noJs.newPage();
  await fallback.goto('/'); await expect(fallback.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(fallback.locator('[data-welcome]')).not.toBeVisible(); await noJs.close();
});

test('mist wiping is available immediately without an editor and survives resizing', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 }); await page.goto('/');
  const welcome = page.getByRole('dialog'); const fog = page.locator('[data-welcome-fog]');
  await expect(welcome.locator('.welcome-heading,.welcome-description,.welcome-tools,[data-welcome-board],[data-welcome-ink]')).toHaveCount(0);
  await expect(welcome.getByRole('slider')).toHaveCount(0);
  const bounds = (await fog.boundingBox())!; const x = bounds.x + bounds.width * .73; const y = bounds.y + bounds.height * .35;
  const fogAlpha = () => fog.evaluate((e: HTMLCanvasElement) => e.getContext('2d')!.getImageData(Math.round(e.width * .73), Math.round(e.height * .35), 1, 1).data[3]);
  expect(await fogAlpha()).toBe(255);
  await page.mouse.move(x - 35, y); await page.mouse.down(); await page.mouse.move(x + 35, y, { steps: 10 }); await page.mouse.up();
  expect(await fogAlpha()).toBeLessThan(20);
  await page.setViewportSize({ width: 1400, height: 900 }); await expect.poll(fogAlpha).toBeLessThan(20);
});

test('mist responds to touch without selecting a tool', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage(); await page.goto('/');
  const fog = page.locator('[data-welcome-fog]'); const bounds = (await fog.boundingBox())!;
  const alpha = () => fog.evaluate((e: HTMLCanvasElement) => e.getContext('2d')!.getImageData(Math.round(e.width * .8), Math.round(e.height * .25), 1, 1).data[3]);
  expect(await alpha()).toBe(255);
  await page.touchscreen.tap(bounds.x + bounds.width * .8, bounds.y + bounds.height * .25);
  expect(await alpha()).toBeLessThan(20);
  await page.getByRole('button', { name: '进入博客', exact: true }).tap(); await expect(page.getByRole('dialog')).not.toBeVisible();
  await context.close();
});

test('welcome works when storage is unavailable and motion is reduced', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Unavailable'); } }));
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: '进入博客', exact: true }).click(); await expect(page.getByRole('dialog')).not.toBeVisible();
});

for (const width of [320, 390, 768, 1440]) test(`welcome fits ${width}px with readable controls`, async ({ page }) => {
  await page.setViewportSize({ width, height: 960 }); await page.goto('/');
  const dialog = page.getByRole('dialog'); await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(e => e.scrollWidth <= e.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(dialog.getByRole('button', { name: '进入博客', exact: true })).toBeInViewport();
  await page.locator('.welcome-image').evaluate((e: HTMLImageElement) => e.decode());
  await expect(dialog).toHaveCSS('opacity', '1');
  await mkdir('.qa', { recursive: true }); await page.screenshot({ path: `.qa/welcome-${width}.png` });
});
