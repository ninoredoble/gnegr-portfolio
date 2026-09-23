import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One entry per project. `featured` (1–5) puts it on the home page with a full case study;
// entries without it are Lab studies, listed on /lab/ and linked straight to the demo.
// Facts only (reference/facts/*.md). Anything unverified carries a double-bracket "confirm"
// marker, and the deploy workflow refuses to ship while any is left (scripts/check-confirm.mjs).
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      kind: z.enum(['product', 'process', 'production', 'systems', 'study']),
      featured: z.number().int().min(1).max(5).optional(),
      role: z.string(),
      period: z.string(),
      stack: z.array(z.string()).min(1),
      /** Honest status line, e.g. "Live on the App Store", "Study: sample data". */
      status: z.string(),
      live: z.url().optional(),
      repo: z.url().optional(),
      /** Store and product links shown as buttons on the case study. */
      links: z.array(z.object({ label: z.string(), href: z.url(), primary: z.boolean().default(false) })).optional(),
      credit: z.string().optional(),
      /** The company the work was done at, shown with its logo. */
      org: z.object({ name: z.string(), href: z.url().optional(), logo: image().optional() }).optional(),
      cover: z.object({ src: image(), alt: z.string() }).optional(),
      /** Phone screens, shown as a strip. */
      screens: z.array(z.object({ src: image(), alt: z.string() })).optional(),
      /** Desktop screenshots, each shown in a browser frame. */
      shots: z.array(z.object({ src: image(), alt: z.string(), caption: z.string() })).optional(),
      /** A real page shown in a browser frame. */
      preview: z.object({ src: image(), alt: z.string(), url: z.string() }).optional(),
      /** Needs an outside sign-off before launch (co-founder, former employer). */
      sensitive: z.boolean().default(false),
    }),
});

export const collections = { work };
