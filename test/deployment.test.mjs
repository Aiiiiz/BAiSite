import test from 'node:test';
import assert from 'node:assert/strict';
import { deploymentConfig } from '../tools/deployment.mjs';
import { withBase } from '../src/lib/paths.ts';
import markdownPaths from '../tools/markdown-paths.mjs';

test('user pages use the root even when the GitHub account has mixed case', () => {
  assert.deepEqual(deploymentConfig('SomeUser/SomeUser.github.io'), { site: 'https://someuser.github.io', base: '/' });
});
test('project pages prefix assets and detail routes while leaving external links intact', () => {
  const { base } = deploymentConfig('SomeUser/portfolio');
  assert.equal(withBase('/images/paper-study.svg', base), '/portfolio/images/paper-study.svg');
  assert.equal(withBase('/projects/paper-study/', base), '/portfolio/projects/paper-study/');
  assert.equal(withBase('/#contact', base), '/portfolio/#contact');
  assert.equal(withBase('https://example.com/', base), 'https://example.com/');
  assert.equal(withBase('mailto:hello@example.com', base), 'mailto:hello@example.com');
  assert.equal(withBase('/projects/', '/'), '/projects/');
});
test('custom-domain root deployment can override a project repository prefix', () => {
  assert.deepEqual(deploymentConfig('SomeUser/portfolio', 'https://portfolio.example', '/'), { site: 'https://portfolio.example', base: '/' });
});
test('deployment rejects invalid host URLs and unsafe base paths', () => {
  assert.throws(() => deploymentConfig('SomeUser/portfolio', 'http://example.com'));
  assert.throws(() => deploymentConfig('SomeUser/portfolio', 'https://example.com/sub/'));
  assert.throws(() => deploymentConfig('SomeUser/portfolio', '', '/../'));
  assert.throws(() => deploymentConfig('missing-repository'));
});
test('Markdown image and link references work beneath a repository path', () => {
  const tree = { type: 'root', children: [
    { type: 'image', url: '/images/process.svg' },
    { type: 'definition', url: '/files/project.pdf' },
    { type: 'link', url: 'https://example.com/work' },
    { type: 'image', url: '/portfolio/images/already-prefixed.svg' },
  ] };
  markdownPaths({ base: '/portfolio/' })(tree);
  assert.deepEqual(tree.children.map(n => n.url), ['/portfolio/images/process.svg', '/portfolio/files/project.pdf', 'https://example.com/work', '/portfolio/images/already-prefixed.svg']);
});
