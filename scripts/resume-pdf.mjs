// Prints the built /resume/ page to dist/resume.pdf with headless Chrome, so the PDF is
// always the same content as the page (one source: src/data/resume.ts).
// Run after `astro build`:  node scripts/resume-pdf.mjs
// Also writes the old file name ("RESUME - REDOBLE.pdf") so old links get the new resume.
import { createServer } from 'node:http';
import { readFile, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, extname } from 'node:path';

const dist = join(import.meta.dirname, '..', 'dist');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.otf': 'font/otf' };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  try {
    const file = join(dist, p);
    if (!file.startsWith(dist)) throw new Error('outside dist');
    await stat(file);
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
}).listen(0, '127.0.0.1');
await new Promise((r) => server.once('listening', r));
const url = `http://127.0.0.1:${server.address().port}/resume/`;

const chrome = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].find((p) => p && existsSync(p));
if (!chrome) {
  server.close();
  throw new Error('No Chrome found. Set CHROME_PATH.');
}

const out = join(dist, 'resume.pdf');
try {
  // Async on purpose: a sync call would block this process's own server and deadlock Chrome.
  await promisify(execFile)(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer', '--virtual-time-budget=4000', `--print-to-pdf=${out}`, url], { timeout: 60_000 });
} finally {
  server.close();
}
await copyFile(out, join(dist, 'RESUME - REDOBLE.pdf'));
const pages = ((await readFile(out, 'latin1')).match(/\/Type\s*\/Page[^s]/g) ?? []).length;
console.log(`resume.pdf: ${pages} page(s)`);
if (pages !== 1) {
  console.error('The resume must fit on one A4 page. Tighten src/data/resume.ts or the print styles.');
  process.exit(1);
}
