// The one source for the resume: /resume/ renders it, and printing that page gives the PDF.
// Rules (BRIEF.md §6): every bullet is "did X, for whom, result"; no buzzwords; numbers only
// where a fact file backs them (reference/facts/); unknowns keep their double-bracket "confirm" marker.

export interface Role {
  title: string;
  org: string;
  period: string;
  bullets: string[];
  link?: string;
}

export const RESUME = {
  name: 'Niño Redoble',
  headline: 'AI product engineer',
  location: '[[confirm city]], Philippines',
  links: [
    { label: 'ninoredoble.is-a.dev', href: 'https://ninoredoble.is-a.dev/' },
    { label: 'github.com/ninoredoble', href: 'https://github.com/ninoredoble' },
    { label: 'linkedin.com/in/g-redoble', href: 'https://linkedin.com/in/g-redoble' },
    { label: '[[confirm-email]]', href: 'mailto:[[confirm-email]]' },
  ],
  summary:
    'I design, build and run software, lately by directing a crew of AI coding agents under strict quality gates. Co-founder of MixCortex, where I build Kivora, menu and storefront software for small restaurants.',
  experience: [
    {
      title: 'Co-founder',
      org: 'MixCortex IT Solutions',
      period: '[[confirm start]] to now',
      link: '/work/kivora/',
      bullets: [
        'Designed and built Kivora for small restaurants: a Flutter staff app for iOS and Android, a Flutter web guest page, and a Supabase backend with row-level security. It is now in pilot [[confirm]].',
        'Built an AI menu assistant that turns a photo, spreadsheet or text into a proposed menu. It runs on the server, and every proposal is validated before a person applies it.',
        'Set up an agent workflow that ran 784 tasks between October and November 2026. Every change passed a local gate (analyzer, 544 test files, architecture and contract checks) before a person merged it.',
        'Made any brand colour a restaurant picks readable, by solving the derived colours to WCAG AA contrast.',
      ],
    },
    {
      title: 'UI/UX and system development intern [[confirm title]]',
      org: 'CEPALCO',
      period: '[[confirm dates]]',
      link: '/work/cepalco/',
      bullets: [
        'Built most of the complaint ticketing system the utility ran in production (304 of 564 commits on a six-person team), with FastAPI, PostgreSQL and Tailwind.',
        'Wrote a rule-based ticket classifier with fuzzy matching for local spellings, so staff can see the words behind every routing decision.',
        'Fixed misrouted outage tickets and alert emails that failed silently; moved ticket filtering to the server with indexes and cursor pagination.',
        "Built FuelTrack, a fuel analytics dashboard for staff that reads the utility's Excel records, computes totals on the server and exports the official report.",
      ],
    },
    {
      title: 'Team lead [[confirm]]',
      org: 'BuyNaBay, campus marketplace',
      period: '[[confirm years]]',
      bullets: [
        'Built the admin dashboard (Next.js, Supabase) for user verification, reports and appeals, bans with reasons, and revenue charts and exports. [[confirm team size and what was live]]',
      ],
    },
  ] satisfies Role[],
  studies: [
    { label: 'Webhook signing simulator', note: 'HMAC signing and retry backoff, in the browser', href: '/work/webhook-signing/' },
    { label: 'Grid mesh', note: 'DC load flow and cascades on an illustrative grid', href: '/work/grid-mesh/' },
    { label: 'The Lab', note: 'Seven more interactive studies, each labelled for what is real', href: '/lab/' },
  ],
  skills: [
    { group: 'Build', items: 'TypeScript, JavaScript, Dart, Python, SQL · Flutter, React, Astro, FastAPI · Supabase, PostgreSQL' },
    { group: 'AI', items: 'Agent workflows with Claude Code · LLM features with server-side validation · Evaluating and routing models by evidence' },
    { group: 'Craft', items: 'Product and UI design · Accessibility (WCAG AA) · Design tokens · Test-first fixes and local quality gates' },
  ],
  education: [{ title: '[[confirm degree]]', org: '[[confirm school]]', period: '[[confirm year]]' }],
};
