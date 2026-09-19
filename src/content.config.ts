import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One entry per project. `featured` (1–5) puts it on the home page with a full case study;
// entries without it are Lab studies, listed on /lab/ and linked straight to the demo.
// Facts only (reference/facts/*.md). Anything unverified carries a double-bracket "confirm" marker, and the
// deploy workflow refuses to ship while any marker is left (scripts/check-confirm.mjs).
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    kind: z.enum(['product', 'ai-workflow', 'production', 'systems', 'study']),
    featured: z.number().int().min(1).max(5).optional(),
    role: z.string(),
    period: z.string(),
    stack: z.array(z.string()).min(1),
    /** Honest status line, e.g. "In pilot", "Study · sample data". */
    status: z.string(),
    live: z.url().optional(),
    repo: z.url().optional(),
    credit: z.string().optional(),
    /** Needs an outside sign-off before launch (co-founder, former employer). */
    sensitive: z.boolean().default(false),
  }),
});

export const collections = { work };
