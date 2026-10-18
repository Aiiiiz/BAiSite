import type { APIRoute } from 'astro';
import { getPosts, columnFor } from '../lib/posts';
import { withBase } from '../lib/paths';
export const GET: APIRoute = async () => new Response(JSON.stringify((await getPosts()).map(post => ({
  title: post.data.title, summary: post.data.summary, category: columnFor(post.data.category).title,
  tags: post.data.tags, text: post.body ?? '', url: withBase(`/posts/${post.data.slug}/`),
}))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
