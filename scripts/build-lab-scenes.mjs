// Builds the Lab's scene pages (/lab/<slug>/) from four MIT-licensed openlanding.page templates
// by Famanias. The templates' art and animation are untouched; this script swaps the head
// (title, description, icon), hides the template's debug toolbar, drops the template's credit
// line and adds my notes layer (public/lab/lab.css + public/lab/<slug>/notes.js).
// The MIT notice at the top of each file is kept, as the licence requires.
//
//   node scripts/build-lab-scenes.mjs [path/to/templates]   (default: ../reference/templates)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const src = process.argv[2] ?? '../reference/templates';

const scenes = [
  {
    slug: 'light-travel',
    template: 'celestial-horizon',
    title: 'Light Travel',
    description: 'A ringed giant in deep space, and a live timer for the sunlight that left the Sun when you arrived.',
    theme: '#04070f',
  },
  {
    slug: 'sun-at-8n',
    template: 'solstice',
    title: 'Sun at 8°N',
    description: "A painted desert, and the sun's year in Cagayan de Oro: today's daylight, and the two noons with no shadow.",
    theme: '#F3E9DA',
  },
  {
    slug: 'field-notes',
    template: 'bloom-decay',
    title: 'Field Notes',
    description: "An ink-and-pigment flower that paints itself in 18 seconds, with a botanist's note for every stage.",
    theme: '#E9E1D3',
  },
  {
    slug: 'twenty-four-seasons',
    template: 'asagiri',
    title: '24 Seasons',
    description: "A misty lake at dawn, and which of Japan's 24 solar seasons it is right now.",
    theme: '#1E2B3C',
  },
];

function once(s, from, to, label) {
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error(`${label}: expected 1 match, found ${n}`);
  return s.replace(from, to);
}

for (const sc of scenes) {
  let s = readFileSync(join(src, `${sc.template}.html`), 'utf8');
  if (!s.includes('MIT License') || !s.includes('Copyright (c) 2026 Famanias')) throw new Error(`${sc.template}: licence header missing`);

  s = s.replace(/<title>[^<]*<\/title>/, `<title>${sc.title} · Niño Redoble Lab</title>`);
  s = s.replace(/<meta name="description" content="[^"]*"\/?>/, `<meta name="description" content="${sc.description}"/>`);
  s = s.replace(/<meta name="theme-color" content="[^"]*"\/?>/, `<meta name="theme-color" content="${sc.theme}"/>`);
  s = s.replace(/<meta name="generator" content="openlanding.page">/, '');
  s = s.replace(/<link rel="icon" href="data:[^"]*">/, '<link rel="icon" href="/favicon.svg" type="image/svg+xml">');
  s = once(
    s,
    '</head>',
    `<meta property="og:title" content="${sc.title} · Niño Redoble Lab"/>
<meta property="og:description" content="${sc.description}"/>
<meta property="og:image" content="https://ninoredoble.is-a.dev/lab/${sc.slug}/og.jpg"/>
<link rel="preload" href="/fonts/empanada/empanada-bold.otf" as="font" type="font/otf" crossorigin>
<link rel="stylesheet" href="/lab/lab.css">
</head>`,
    `${sc.template} head`,
  );
  s = s.replace(/\n?<p data-olp-credit[\s\S]*?<\/p>\n?/, '\n');
  s = once(s, '</body>', `<script src="/lab/lab.js" defer></script>\n<script src="/lab/${sc.slug}/notes.js" defer></script>\n</body>`, `${sc.template} body`);
  s = once(s, '<body class="', `<body data-lab="${sc.slug}" class="`, `${sc.template} body tag`);

  mkdirSync(`public/lab/${sc.slug}`, { recursive: true });
  writeFileSync(`public/lab/${sc.slug}/index.html`, s);
  console.log(`lab/${sc.slug}: ${(s.length / 1024 / 1024).toFixed(2)} MB`);
}
