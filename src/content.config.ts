import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One entry per project. `featured` sets the home-page order (1–5); the rest go to the Lab.
// Facts only: anything unverified stays out of the copy or is marked [[confirm]] (BRIEF.md §8).
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    kind: z.enum(['product', 'ai-workflow', 'production', 'systems', 'study']),
    featured: z.number().int().min(1).max(5).optional(),
    live: z.url().optional(),
    repo: z.url().optional(),
    sensitive: z.boolean().default(false),
  }),
});

export const collections = { work };
