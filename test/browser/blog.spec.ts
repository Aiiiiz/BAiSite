import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const routes = ['/', '/archive/', '/posts/everyday-space/', '/about/'];
test('home groups writing into confirmed columns with an alternating layout', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('此间 · 个人博客');
  await expect(page.locator('.post-row')).toHaveCount(6);
  await expect(page.locator('.post-row.is-reversed')).toHaveCount(3);
  await page.getByRole('complementary', { name: '博客栏目' }).getByRole('link', { name: '学习笔记 02' }).click();
  await expect(page).toHaveURL(/#notes$/);
  await expect(page.locator('[data-section-link="notes"]')).toHaveAttribute('aria-current', 'location');
});
test('reading includes real article content, section navigation and a next article', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: '给日常留一点空白', exact: true }).click();
  await expect(page).toHaveURL(/\/posts\/everyday-space\/$/);
  await expect(page.locator('.reading-copy').getByRole('heading', { name: '留意微小的事' })).toBeVisible();
  await page.getByRole('complementary', { name: '文章目录' }).getByRole('link', { name: '把观察写下来' }).click();
  await expect(page.locator('[data-section-link="把观察写下来"]')).toHaveAttribute('aria-current', 'location');
  await expect.poll(() => page.locator('[data-reading-progress]').evaluate(e => parseFloat((e as HTMLElement).style.width))).toBeGreaterThan(10);
  await page.locator('.next-reading').click();
  await expect(page).toHaveURL(/\/posts\/small-observations\/$/);
});
test('search works with keyboard, text, empty results and result navigation', async ({ page }) => {
  await page.goto('/'); await page.keyboard.press('/');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('searchbox').fill('笔记');
  await expect(dialog.locator('.search-results li')).not.toHaveCount(0);
  await dialog.getByRole('searchbox').fill('没有这样的词abcxyz');
  await expect(dialog.getByRole('status')).toHaveText('没有找到相关内容，换个词试试。');
  await dialog.getByRole('searchbox').fill('给日常留一点空白');
  await expect(dialog.locator('.search-results li')).toHaveCount(1);
  await dialog.locator('.search-results a').click();
  await expect(page).toHaveURL(/\/posts\/everyday-space\/$/);
  await page.getByRole('button', { name: '搜索文章' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: '搜索文章' })).toBeFocused();
});
test('failed search loading has a retry that recovers', async ({ page }) => {
  await page.route('**/search.json', route => route.abort());
  await page.goto('/'); await page.getByRole('button', { name: '搜索文章' }).click();
  await expect(page.getByRole('dialog').getByRole('status')).toHaveText('搜索暂时不可用，请稍后重试。');
  await page.unroute('**/search.json');
  await page.getByRole('button', { name: '重新加载搜索' }).click();
  await expect(page.locator('.search-results li')).toHaveCount(6);
});
test('archive filters and saved articles survive navigation and reload', async ({ page }) => {
  await page.goto('/archive/');
  await page.getByRole('button', { name: /学习笔记\s*2/, exact: true }).click();
  await expect(page.locator('[data-archive-entry]:visible')).toHaveCount(2);
  await expect(page).toHaveURL(/category=notes/);
  await page.reload();
  await expect(page.locator('[data-archive-entry]:visible')).toHaveCount(2);
  await page.getByRole('button', { name: '稍后读：一篇笔记，如何变得好读', exact: true }).click();
  await page.getByRole('button', { name: '稍后读 1', exact: true }).click();
  await expect(page.locator('[data-archive-entry]:visible')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('[data-archive-entry]:visible')).toHaveCount(1);
  await page.getByRole('button', { name: '取消稍后读：一篇笔记，如何变得好读', exact: true }).click();
  await expect(page.locator('[data-archive-empty]')).toBeVisible();
  await page.getByRole('button', { name: '查看全部文章' }).click();
  await expect(page.locator('[data-archive-entry]:visible')).toHaveCount(6);
});
test('article bookmark appears in the archive', async ({ page }) => {
  await page.goto('/posts/everyday-space/');
  await page.getByRole('button', { name: '稍后读', exact: true }).click();
  await expect(page.locator('[data-reader-status]')).toHaveText('已加入稍后读，可在归档中找到。');
  await page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '归档' }).click();
  await page.getByRole('button', { name: '稍后读 1', exact: true }).click();
  await expect(page.locator('[data-archive-entry]:visible')).toHaveCount(1);
  await expect(page.locator('[data-archive-entry]:visible h3')).toHaveText('给日常留一点空白');
});
test('copy article link writes the actual URL to the clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/posts/everyday-space/');
  await page.getByRole('button', { name: '复制链接', exact: true }).click();
  await expect(page.locator('[data-reader-status]')).toHaveText('文章链接已复制。');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('http://127.0.0.1:4321/posts/everyday-space/');
});

for (const width of [320, 390, 768, 1440]) {
  test(`blog page types work without overflow at ${width}px`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 960 });
    await mkdir('.qa', { recursive: true });
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const route of routes) {
      expect((await page.goto(route))?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const img of await page.locator('main img:visible').all()) {
        expect((await request.get((await img.getAttribute('src'))!)).status()).toBe(200);
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
      }
      await page.evaluate(() => { (document.activeElement as HTMLElement | null)?.blur(); scrollTo({ top: 0, behavior: 'instant' }); });
      if (width === 390 || width === 1440) {
        const name = route === '/' ? 'blog-home' : route.split('/').filter(Boolean).join('-');
        await page.screenshot({ path: `.qa/${name}-${width}.png`, fullPage: route !== '/' });
        if (route === '/' && width === 1440) await page.screenshot({ path: '.qa/blog-preview.png' });
      }
    }
    expect(errors).toEqual([]);
  });
}
test('keyboard skip link and reduced motion remain available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/');
  await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: '跳转到内容' })).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.locator('#main')).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await page.locator('.post-cover').first().hover();
  expect(await page.locator('.post-cover img').first().evaluate(e => getComputedStyle(e).transform)).toBe('none');
});
test('200% type size does not cause page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 960 });
  for (const route of routes) {
    await page.goto(route); await page.addStyleTag({ content: 'html{font-size:200%!important}' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
