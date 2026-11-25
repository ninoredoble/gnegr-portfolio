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
  headline: 'Designer & developer',
  location: 'Cagayan de Oro, Philippines',
  links: [
    { label: 'ninoredoble.is-a.dev', href: 'https://ninoredoble.is-a.dev/' },
    { label: 'github.com/ninoredoble', href: 'https://github.com/ninoredoble' },
    { label: 'linkedin.com/in/g-redoble', href: 'https://linkedin.com/in/g-redoble' },
    { label: 'redoble.gninoemmanuel@gmail.com', href: 'mailto:redoble.gninoemmanuel@gmail.com' },
  ],
  summary:
    'I design and build web and mobile apps for businesses, from the first sketch to the version customers use, and I test what I ship. Co-founder of MixCortex, where I built Kivora, now live on the App Store.',
  experience: [
    {
      title: 'Co-founder · UI/UX designer and QA',
      org: 'MixCortex IT Solutions',
      period: 'July 2026 to now',
      link: '/work/kivora/',
      bullets: [
        'Designed, built and tested Kivora, menu software for restaurants: a Flutter staff app, now live on the App Store, a guest web page that opens from a table tag, and a Supabase backend that keeps each restaurant\'s data separate.',
        'Built a menu assistant that drafts a menu from a photo, spreadsheet or text; the owner reviews every suggestion before it is applied.',
        'Set up the quality process every change passes before merging: written specs, test-first bug fixes, hundreds of automated tests and a strict pre-merge check.',
        'Made any brand colour a restaurant picks stay readable, by adjusting the colours around it to meet WCAG AA contrast.',
      ],
    },
    {
      title: 'UI/UX and system development intern',
      org: 'CEPALCO',
      period: 'February to May 2026',
      link: '/work/cepalco/',
      bullets: [
        'Helped build the complaint ticketing system the utility ran in production, with FastAPI, PostgreSQL and Tailwind.',
        'Wrote a rule-based ticket classifier with fuzzy matching for local spellings, so staff can see the words behind every routing decision.',
        'Fixed misrouted outage tickets and alert emails that failed silently; moved ticket filtering to the server with indexes and cursor pagination.',
        "Built FuelTrack, a fuel analytics dashboard for staff that reads the utility's Excel records, computes totals on the server and exports the official report.",
      ],
    },
    {
      title: 'Team lead',
      org: 'BuyNaBay, campus marketplace (capstone)',
      period: '2024 to 2026',
      bullets: [
        'Led a five-person remote team building a marketplace where USTP students buy, sell and rent pre-loved items, from proposal to capstone testing with students.',
        'Designed the mobile app in Figma and built the admin dashboard (Next.js, Supabase) for verifications, reports and appeals, bans with reasons, and sales exports.',
      ],
    },
  ] satisfies Role[],
  studies: [
    { label: 'Webhook signing simulator', note: 'HMAC signing and retry backoff, in the browser', href: '/work/webhook-signing/' },
    { label: 'Grid mesh', note: 'DC load flow and cascades on an illustrative grid', href: '/work/grid-mesh/' },
    { label: 'The Lab', note: 'Smaller interactive studies, each labelled for what is real and what is sample data', href: '/lab/' },
  ],
  skills: [
    { group: 'Build', items: 'TypeScript, JavaScript, Dart, Python, SQL · Flutter, React, Astro, FastAPI · Supabase, PostgreSQL' },
    { group: 'Design', items: 'Product and UI design · Design systems and tokens · Accessibility (WCAG AA)' },
    { group: 'Quality', items: 'Test-first fixes · Automated tests and pre-merge checks · Code review · AI-assisted development with Claude Code' },
  ],
  education: [
    {
      title: 'BS Information Technology, magna cum laude',
      org: 'University of Science and Technology of Southern Philippines',
      period: '2022 to 2026',
    },
  ],
  honours: ["Dean's Lister, 2022 to 2026", 'CCNA: Enterprise Networking, Security, and Automation (2024)'],
};
