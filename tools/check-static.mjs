import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const baseValue = process.env.BASE_PATH || '/';
const base = `/${baseValue.split('/').filter(Boolean).join('/')}${baseValue === '/' ? '' : '/'}`;
async function collect(folder) {
  return (await Promise.all((await readdir(folder, { withFileTypes: true })).map(e => e.isDirectory() ? collect(resolve(folder, e.name)) : e.name.endsWith('.html') ? [resolve(folder, e.name)] : []))).flat();
}
const errors = [];
let total = 0;
const pages = await collect(root);
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const localPath = page.slice(root.length + 1).split(sep).join('/').replace(/index\.html$/, '');
  for (const match of html.matchAll(/\b(?:href|src)="([^"\s]+)"/g)) {
    const href = match[1].replace(/&amp;/g, '&');
    if (/^(?:https?:|mailto:|tel:|data:|\/\/)/.test(href)) continue;
    const url = new URL(href, `https://verification.invalid${base}${localPath}`);
    total++;
    if (!url.pathname.startsWith(base)) { errors.push(`${page}: URL leaves deployment base: ${href}`); continue; }
    let file = resolve(root, decodeURIComponent(url.pathname.slice(base.length)) || '.');
    if (file !== root && !file.startsWith(`${root}${sep}`)) { errors.push(`${page}: URL leaves dist: ${href}`); continue; }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      await stat(file);
      if (url.hash && file.endsWith('.html')) {
        const target = await readFile(file, 'utf8');
        const id = decodeURIComponent(url.hash.slice(1));
        if (!target.includes(`id="${id}"`)) errors.push(`${page}: missing anchor ${href}`);
      }
    } catch { errors.push(`${page}: missing output ${href}`); }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Static output verified: ${pages.length} pages, ${total} local links/assets, base ${base}`);
