import { getCollection, type CollectionEntry } from 'astro:content';
import { columns } from '../config/site';
export async function getPosts() {
  return (await getCollection('posts')).filter(p => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.order - b.data.order || a.data.slug.localeCompare(b.data.slug));
}
export function columnFor(id: string) { return columns.find(c => c.id === id)!; }
export function readingMinutes(post: CollectionEntry<'posts'>) {
  return Math.max(1, Math.ceil((post.body ?? '').replace(/[#*`>\[\]]/g, '').length / 380));
}
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }).format(date).replaceAll('/', '.');
}
