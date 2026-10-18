import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { columns } from './config/site';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    order: z.number().int().nonnegative(),
    year: z.number().int().min(1900).max(2100).nullable(),
    category: z.string().min(1),
    summary: z.string().min(1),
    role: z.string().min(1),
    cover: z.string().regex(/^\/images\//),
    coverAlt: z.string().min(1),
    featured: z.boolean().default(false),
    demo: z.boolean().default(false),
    tone: z.enum(['sky', 'lime', 'paper']).default('paper'),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.string().refine(value => columns.some(column => column.id === value), 'Unknown blog column'),
    summary: z.string().min(1),
    date: z.coerce.date(),
    cover: z.string().regex(/^\/images\//),
    coverAlt: z.string().min(1),
    tags: z.array(z.string()).default([]),
    demo: z.boolean().default(false),
    order: z.number().int().default(0),
    draft: z.boolean().default(false),
  }),
});
export const collections = { projects, posts };
