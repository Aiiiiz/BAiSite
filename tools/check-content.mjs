import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = resolve(root, 'public');
async function collect(directory) {
  const paths = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(paths.map(p => p.isDirectory() ? collect(resolve(directory, p.name)) : p.name.endsWith('.md') ? [resolve(directory, p.name)] : []))).flat();
}
const errors = [];
let checked = 0;
for (const collection of ['projects', 'posts']) {
const files = await collect(resolve(root, `src/content/${collection}`));
const seen = new Set();
checked += files.length;
for (const file of files) {
  const text = await readFile(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) { errors.push(`${file}: missing YAML frontmatter`); continue; }
  let data;
  try { data = parse(match[1]); } catch (e) { errors.push(`${file}: ${e.message}`); continue; }
  if (seen.has(data.slug)) errors.push(`${file}: duplicate slug ${data.slug}`);
  seen.add(data.slug);
  if (!match[2].trim()) errors.push(`${file}: missing project body`);
  if (data.demo && !`${data.summary} ${match[2]}`.includes('示例') && !`${data.summary} ${match[2]}`.includes('示意')) errors.push(`${file}: demo content must be clearly marked`);
  const assets = [data.cover, ...[...match[2].matchAll(/!\[[^\]]*\]\((\/[^)\s]+)\)/g)].map(m => m[1])];
  for (const asset of assets) {
    if (typeof asset !== 'string') { errors.push(`${file}: invalid asset`); continue; }
    const path = resolve(publicRoot, `.${asset}`);
    if (!path.startsWith(`${publicRoot}${sep}`)) { errors.push(`${file}: asset escapes public folder`); continue; }
    try { await access(path); } catch { errors.push(`${file}: missing asset ${asset}`); }
  }
}
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Content verified: ${checked} articles/projects, unique routes, cover assets and demo labels.`);
