import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import markdownPaths from './tools/markdown-paths.mjs';

// Local preview needs no GitHub identity. The workflow supplies these at deployment.
const configuredSite = process.env.SITE_URL?.trim();
const configuredBase = process.env.BASE_PATH?.trim() || '/';
const base = `/${configuredBase.split('/').filter(Boolean).join('/')}`;
if (configuredSite && new URL(configuredSite).protocol !== 'https:') {
  throw new Error('SITE_URL must be an absolute HTTPS URL.');
}

export default defineConfig({
  ...(configuredSite ? { site: configuredSite } : {}),
  base: base === '/' ? '/' : `${base}/`,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: { processor: unified({ remarkPlugins: [[markdownPaths, { base }]] }) },
});
