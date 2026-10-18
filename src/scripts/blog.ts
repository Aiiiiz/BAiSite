export {};
type SearchPost = { title: string; summary: string; category: string; tags: string[]; text: string; url: string };
const dialog = document.querySelector<HTMLDialogElement>('[data-search-dialog]');
const opener = document.querySelector<HTMLButtonElement>('[data-search-open]');
const input = document.querySelector<HTMLInputElement>('[data-search-input]');
const results = document.querySelector<HTMLUListElement>('[data-search-results]');
const status = document.querySelector<HTMLElement>('[data-search-status]');
const retry = document.querySelector<HTMLButtonElement>('[data-search-retry]');
let searchPromise: Promise<SearchPost[]> | null = null;
let searchVersion = 0;
async function search() {
  if (!input || !results || !status || !opener) return;
  const version = ++searchVersion;
  status.textContent = '正在查找文章…';
  retry!.hidden = true;
  try {
    searchPromise ??= fetch(opener.dataset.searchUrl!).then(response => {
      if (!response.ok) throw new Error('Search unavailable');
      return response.json() as Promise<SearchPost[]>;
    });
    const posts = await searchPromise;
    if (version !== searchVersion) return;
    const tokens = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const matches = posts.filter(p => tokens.every(t => [p.title, p.summary, p.category, ...p.tags, p.text].join(' ').toLocaleLowerCase().includes(t)));
    results.replaceChildren();
    matches.forEach(post => {
      const li = document.createElement('li');
      const a = document.createElement('a'); a.href = post.url;
      const category = document.createElement('span'); category.textContent = post.category;
      const title = document.createElement('strong'); title.textContent = post.title;
      const excerpt = document.createElement('p'); excerpt.textContent = post.summary;
      a.append(category, title, excerpt); li.append(a); results.append(li);
    });
    status.textContent = matches.length ? `找到 ${matches.length} 篇文章` : '没有找到相关内容，换个词试试。';
  } catch {
    if (version !== searchVersion) return;
    searchPromise = null; results.replaceChildren();
    status.textContent = '搜索暂时不可用，请稍后重试。'; retry!.hidden = false;
  }
}
function openSearch() {
  if (!dialog || dialog.open) return;
  dialog.showModal(); input?.focus(); void search();
}
opener?.addEventListener('click', openSearch);
document.querySelector('[data-search-close]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('close', () => opener?.focus());
dialog?.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
input?.addEventListener('input', () => void search());
retry?.addEventListener('click', () => void search());
document.addEventListener('keydown', event => {
  const target = event.target as HTMLElement;
  if (event.key === '/' && !target.matches('input, textarea, select') && !target.isContentEditable && !event.metaKey && !event.ctrlKey && !event.altKey) { event.preventDefault(); openSearch(); }
});

const storageKey = 'cijian:read-later:v1';
let saved = new Set<string>();
try { const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]'); if (Array.isArray(value)) saved = new Set(value.filter((v): v is string => typeof v === 'string')); } catch { /* Reading still works when storage is unavailable. */ }
const bookmarkButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-bookmark]')];
bookmarkButtons.forEach(b => { b.dataset.bookmarkTitle = b.getAttribute('aria-label')?.replace(/^稍后读：/, '') ?? ''; });
function updateSaved() {
  bookmarkButtons.forEach(button => {
    const active = saved.has(button.dataset.bookmark!);
    button.setAttribute('aria-pressed', String(active));
    const label = button.querySelector('[data-bookmark-label]'); if (label) label.textContent = active ? '已留待阅读' : '稍后读';
    const title = button.dataset.bookmarkTitle; if (title) button.setAttribute('aria-label', `${active ? '取消稍后读' : '稍后读'}：${title}`);
  });
  document.querySelectorAll('[data-saved-count]').forEach(el => { el.textContent = String([...document.querySelectorAll<HTMLElement>('[data-archive-entry]')].filter(e => saved.has(e.dataset.postSlug!)).length); });
}
bookmarkButtons.forEach(button => button.addEventListener('click', () => {
  const slug = button.dataset.bookmark!;
  if (saved.has(slug)) saved.delete(slug); else saved.add(slug);
  let persistent = true;
  try { localStorage.setItem(storageKey, JSON.stringify([...saved])); } catch { persistent = false; }
  updateSaved(); filterArchive();
  const notice = document.querySelector('[data-reader-status]');
  if (notice) notice.textContent = saved.has(slug) ? (persistent ? '已加入稍后读，可在归档中找到。' : '已加入本次阅读列表；浏览器未允许保存。') : '已从稍后读移除。';
}));
updateSaved();

const filterButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-category-filter]')];
const savedFilter = document.querySelector<HTMLButtonElement>('[data-saved-filter]');
let category = new URL(location.href).searchParams.get('category') ?? 'all';
if (!filterButtons.some(b => b.dataset.categoryFilter === category)) category = 'all';
let savedOnly = new URL(location.href).searchParams.get('saved') === '1';
function filterArchive() {
  const rows = [...document.querySelectorAll<HTMLElement>('[data-archive-entry]')];
  if (!rows.length) return;
  let count = 0;
  rows.forEach(row => { const visible = (category === 'all' || row.dataset.category === category) && (!savedOnly || saved.has(row.dataset.postSlug!)); row.hidden = !visible; if (visible) count++; });
  document.querySelectorAll<HTMLElement>('[data-archive-year]').forEach(year => { year.hidden = !year.querySelector('[data-archive-entry]:not([hidden])'); });
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.categoryFilter === category)));
  savedFilter?.setAttribute('aria-pressed', String(savedOnly));
  const notice = document.querySelector('[data-archive-status]'); if (notice) notice.textContent = `共 ${count} 篇${savedOnly ? '稍后读' : ''}文章`;
  const empty = document.querySelector<HTMLElement>('[data-archive-empty]'); if (empty) empty.hidden = count !== 0;
}
function saveFilters() { const url = new URL(location.href); category === 'all' ? url.searchParams.delete('category') : url.searchParams.set('category', category); savedOnly ? url.searchParams.set('saved', '1') : url.searchParams.delete('saved'); history.replaceState(null, '', url); filterArchive(); }
filterButtons.forEach(button => button.addEventListener('click', () => { category = button.dataset.categoryFilter!; saveFilters(); }));
savedFilter?.addEventListener('click', () => { savedOnly = !savedOnly; saveFilters(); });
document.querySelector('[data-reset-filters]')?.addEventListener('click', () => { category = 'all'; savedOnly = false; saveFilters(); });
filterArchive();

const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-section-link]')];
const sections = sectionLinks.map(link => document.getElementById(link.dataset.sectionLink!)).filter((el): el is HTMLElement => el !== null);
const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
const content = document.querySelector<HTMLElement>('[data-reading-content]');
let queued = false;
function updateReading() {
  queued = false;
  let active = sections[0];
  const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  for (const section of sections) {
    const anchorOffset = scrollPadding + (parseFloat(getComputedStyle(section).scrollMarginTop) || 0) + 4;
    if (section.getBoundingClientRect().top <= anchorOffset) active = section;
  }
  if (active) sectionLinks.forEach(link => { const current = link.dataset.sectionLink === active.id; link.classList.toggle('is-current', current); if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  if (progress && content) {
    const r = content.getBoundingClientRect();
    const readableScroll = Math.max(1, r.bottom + scrollY - innerHeight);
    progress.style.width = `${Math.max(0, Math.min(100, scrollY / readableScroll * 100))}%`;
  }
}
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateReading); } }, { passive: true });
addEventListener('resize', updateReading);
document.fonts.ready.then(updateReading);
updateReading();
document.querySelector<HTMLButtonElement>('[data-copy-link]')?.addEventListener('click', async () => {
  const notice = document.querySelector('[data-reader-status]');
  try { await navigator.clipboard.writeText(location.href.split('#')[0]); if (notice) notice.textContent = '文章链接已复制。'; }
  catch { if (notice) notice.textContent = '暂时无法复制，请复制浏览器地址栏中的链接。'; }
});
