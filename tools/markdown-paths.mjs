// Markdown images and local links must work on repository subpaths as well.
export default function markdownPaths({ base = '/' } = {}) {
  const prefix = base.replace(/\/$/, '');
  return function transform(tree) {
    function visit(node) {
      if ((node.type === 'image' || node.type === 'link' || node.type === 'definition') && typeof node.url === 'string' && /^\/(?!\/)/.test(node.url) && prefix && node.url !== prefix && !node.url.startsWith(`${prefix}/`)) {
        node.url = `${prefix}${node.url}`;
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
