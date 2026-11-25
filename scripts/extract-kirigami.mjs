// Extracts the KIRIGAMI scene (openlanding.page, MIT, © 2026 Famanias) into src/kirigami/.
// The art is copied byte for byte; the engine gets three small, checked patches.
//
//   npm run kirigami -- <path to kirigami.html>
//
// Outputs (all committed):
//   src/kirigami/scene.html   server-rendered markup React hydrates (#standalone-root contents)
//   public/kirigami/kirigami.js  the patched React + GSAP bundle (served as-is, deferred)
//   src/kirigami/LICENSE.md   the template's MIT notice
// public/kirigami/mindanao.js (the Mindanao additions) is ours and hand-written, not generated.
// The template's 450 KB stylesheet is dropped on purpose: the scene styles itself inline,
// and the stylesheet only served the demo control panel, which we never show.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = process.argv[2];
if (!src) {
  console.error('usage: npm run kirigami -- <path to kirigami.html>');
  process.exit(1);
}
const html = readFileSync(src, 'utf8');
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'kirigami');
mkdirSync(out, { recursive: true });

// --- licence -------------------------------------------------------------
const lic = html.match(/<!-- openlanding\.page:license\s*([\s\S]*?)-->/);
if (!lic) throw new Error('MIT notice not found');
writeFileSync(join(out, 'LICENSE.md'),
  '# KIRIGAMI scene licence\n\nThe hero scene is adapted from KIRIGAMI on openlanding.page.\n' +
  'Our changes: three engine patches (see scripts/extract-kirigami.mjs) and the Mindanao additions in public/kirigami/mindanao.js.\n\n```\n' +
  lic[1].trim() + '\n```\n');

// --- markup --------------------------------------------------------------
const open = '<div id="standalone-root" style="display:contents">';
const start = html.indexOf(open);
const scriptAt = html.indexOf('<script', start);
if (start < 0 || scriptAt < 0) throw new Error('scene markup not found');
const root = html.slice(start, scriptAt).trimEnd();
if (!root.endsWith('</div>')) throw new Error('unexpected root markup end');
// The demo control panel's launcher is server-rendered, but we start with the UI hidden,
// so React would render nothing there. Drop it here too, or hydration fails (React #418).
let scene = root.slice(open.length, -'</div>'.length);
const ctl = scene.lastIndexOf('<div class="pointer-events-none fixed right-4 top-4 z-50');
if (ctl < 0 || !scene.endsWith('</button></div></main>')) throw new Error('control panel markup not found');
scene = scene.slice(0, ctl) + '</main>';
// Clouds and houses are decorative toys: keep them clickable but out of the Tab order.
const tabbable = (scene.match(/tabindex="0"/g) ?? []).length;
if (tabbable === 0) throw new Error('expected tabbable clouds/houses in the scene markup');
scene = scene.replaceAll('tabindex="0"', 'tabindex="-1"');
writeFileSync(join(out, 'scene.html'), scene);

// --- engine --------------------------------------------------------------
const body = html.slice(html.indexOf('<body'));
let js = body.match(/<script>([\s\S]*?)<\/script>/)[1];
function patch(name, from, to) {
  const n = js.split(from).length - 1;
  if (n !== 1) throw new Error(`patch "${name}": expected 1 match, found ${n}`);
  js = js.replace(from, to);
}
// 1. Demo control panel: hidden, and the H shortcut no longer opens it.
patch('hide panel',
  '[t,l]=(0,Pe.useState)(!1),[u,o]=(0,Pe.useState)(!1)',
  '[t,l]=(0,Pe.useState)(!1),[u,o]=(0,Pe.useState)(!0)');
// 2. Unfold on arrival. React must hydrate the same unfolded tree the server rendered
//    (starting folded renders different elements and fails hydration), so the replay
//    starts in an effect right after hydration, which also fires `kirigami:ready` so add-ons
//    (public/kirigami/mindanao.js) only touch the DOM once React owns it. Reduced motion stays unfolded.
patch('no H toggle + unfold on load',
  '(0,Pe.useEffect)(()=>{let g=h=>{if(h.key==="h"||h.key==="H"){',
  '(0,Pe.useEffect)(()=>{window.__kirigamiReady=!0,window.dispatchEvent(new Event("kirigami:ready")),window.matchMedia("(prefers-reduced-motion: reduce)").matches||window.scrollY>8||a(S=>({...S,unfoldProgress:0,isPlayingUnfold:!0}))},[]),(0,Pe.useEffect)(()=>{let g=h=>{if(!1){');
// 3. No wheel hijack (it blocked page scrolling). The scene keeps animating while it's on
//    screen and pauses (ambient motion and petals) once it isn't. This uses an
//    IntersectionObserver, not scroll events: re-rendering the whole scene on every scroll
//    event made the background flicker.
patch('pause off screen',
  'let g=h=>{if(h.target?.closest("aside"))return;h.preventDefault();let C=h.deltaY*55e-5;a(S=>({...S,isPlayingUnfold:!1,unfoldProgress:Xt(S.unfoldProgress+C)}))};return window.addEventListener("wheel",g,{passive:!1}),()=>window.removeEventListener("wheel",g)',
  'let g=new IntersectionObserver(([en])=>{let on=en.isIntersecting;a(S=>S.ambientMotion===on&&S.petalsEnabled===on?S:({...S,ambientMotion:on,petalsEnabled:on}))}),el=document.querySelector(".kirigami-stage");return el&&g.observe(el),()=>g.disconnect()');

// 4. No pointer parallax. It shifts eight full-size paper layers on every pointer frame,
//    which forces a full SVG redraw and made the scene flicker on hover (also in the
//    original template). Wind, petals, cloud hover and house clicks all stay.
patch('no parallax',
  'var dL={unfoldProgress:1,isPlayingUnfold:!1,ambientMotion:!0,parallaxEnabled:!0',
  'var dL={unfoldProgress:1,isPlayingUnfold:!1,ambientMotion:!0,parallaxEnabled:!1');
// 5. Clouds and houses out of the Tab order (matches the markup change above).
patch('cloud tabindex', 'tabIndex:l?0:void 0', 'tabIndex:l?-1:void 0');
patch('house tabindex', 'tabIndex:t?0:void 0', 'tabIndex:t?-1:void 0');
// 6. Ignore resizes from a phone's address bar showing and hiding while you scroll:
//    re-fit the camera only when the width changes or the height changes a lot.
patch('stable camera on scroll',
  '(0,Te.useEffect)(()=>{let E=()=>{let F=Dc(window.innerWidth,window.innerHeight);C(F),L?.(F)};',
  '(0,Te.useEffect)(()=>{let W0=0,H0=0,E=()=>{let w=window.innerWidth,hh=window.innerHeight;if(w===W0&&Math.abs(hh-H0)<hh*.25)return;W0=w,H0=hh;let F=Dc(w,hh);C(F),L?.(F)};');

const pub = join(out, '..', '..', 'public', 'kirigami');
mkdirSync(pub, { recursive: true });
writeFileSync(join(pub, 'kirigami.js'),
  '/*! KIRIGAMI scene, openlanding.page, MIT © 2026 Famanias. Patched for ninoredoble.is-a.dev; see LICENSE.md. */\n' + js);
console.log('kirigami: scene.html %d KB, kirigami.js %d KB', Math.round(root.length / 1024), Math.round(js.length / 1024));
