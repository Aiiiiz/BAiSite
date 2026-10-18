import { appendFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export function deploymentConfig(repository, siteOverride = '', baseOverride = '') {
  const parts = repository.split('/');
  if (parts.length !== 2 || !parts.every(p => /^[A-Za-z0-9_.-]+$/.test(p))) throw new Error('Expected GITHUB_REPOSITORY in owner/repository format.');
  const [owner, name] = parts;
  const site = siteOverride.trim() || `https://${owner.toLowerCase()}.github.io`;
  const url = new URL(site);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw new Error('SITE_URL must be an HTTPS origin without a path or credentials.');
  const base = baseOverride.trim() || (name.toLowerCase() === `${owner.toLowerCase()}.github.io` ? '/' : `/${name}/`);
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base)) throw new Error('BASE_PATH must be / or a slash-delimited repository path ending in /.');
  return { site: url.origin, base };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { site, base } = deploymentConfig(process.env.GITHUB_REPOSITORY ?? '', process.env.SITE_URL, process.env.BASE_PATH);
  const output = `site=${site}\nbase=${base}\n`;
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, output);
  else process.stdout.write(output);
}
