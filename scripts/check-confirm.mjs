// Refuses to ship placeholder facts. Every unverified claim in the content is marked
// [[confirm ...]]; the deploy workflow runs this before building, so nothing marked can go live.
//   node scripts/check-confirm.mjs        exit 1 and list every marker
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = join(import.meta.dirname, '..', 'src');
const hits = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(md|mdx|astro|ts)$/.test(name)) {
      readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        for (const m of line.matchAll(/\[\[confirm[^\]]*\]\]/g)) hits.push(`${relative(root, p)}:${i + 1}  ${m[0]}`);
      });
    }
  }
})(root);

if (hits.length) {
  console.error(`${hits.length} unconfirmed fact(s) left. Answer them in the content before deploying:\n`);
  console.error(hits.join('\n'));
  process.exit(1);
}
console.log('No [[confirm]] markers left.');
