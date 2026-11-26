// Builds the footer landscape from the hero's own art (KIRIGAMI, MIT © 2026 Famanias): the sky,
// the sun, the far and mid mountains, cropped into a wide strip. The clouds go in a separate file
// so the page can drift them with a cheap CSS transform instead of redrawing the whole drawing.
//   node scripts/build-footer-scene.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const scene = readFileSync('src/kirigami/scene.html', 'utf8');
const layer = (n) => {
  const start = scene.indexOf(`<g data-depth-layer="${n}"`);
  const end = scene.indexOf(`<g data-depth-layer="${n + 1}"`);
  if (start < 0 || end < 0) throw new Error(`layer ${n} not found`);
  return scene.slice(start, end);
};
const defs = scene.slice(scene.indexOf('<defs>'), scene.indexOf('</defs>') + 7);

// Strip what only made sense inside the live React scene: ARIA roles, inline transitions.
const clean = (s) =>
  s
    .replace(/ role="button"| tabindex="-?\d+"| aria-[a-z]+="[^"]*"/g, '')
    .replace(/ class="kirigami-interactive-cloud"/g, '')
    .replace(/style="transition:[^"]*"/g, '');

const far = layer(2);
const cs = far.indexOf('<g id="kirigami-clouds">');
if (cs < 0) throw new Error('clouds not found');
// The clouds group runs to the end of layer 2 (closing the layer's own <g>).
const farOnly = far.slice(0, cs) + '</g>';
const clouds = far.slice(cs, far.lastIndexOf('</g>'));

// The valley the hero's river runs through hides the flat feet of the forests; here it's a
// strip of the same paper, then the footer's own teal ridge in front, with the hero's paper
// shadow (three offset copies at falling opacity).
const shadowed = (d, fill, tint, offs = [[5.9, 9], [3.2, 5.1], [1.5, 2.4]], ops = [0.047, 0.09, 0.151]) =>
  offs.map(([x, y], i) => `<path d="${d}" fill="${tint}" opacity="${ops[i]}" transform="translate(${x}, ${y})"></path>`).join('') +
  `<path d="${d}" fill="${fill}"></path>`;
const wave = (y0, amp, step, seed, bottom) => {
  let d = `M -40 ${bottom} L -40 ${y0}`;
  let k = seed;
  for (let x = -40; x < 1660; x += step) {
    k = (k * 9301 + 49297) % 233280;
    const r = k / 233280;
    d += ` C ${x + step * 0.3} ${y0 - amp * r}, ${x + step * 0.7} ${y0 + amp * (0.5 - r)}, ${x + step} ${y0 + amp * (r - 0.5) * 0.6}`;
  }
  return d + ` L 1660 ${bottom} Z`;
};
// Soft rolling hills (the teal footer rises out of these).
const hills = (y0, amp, step, seed, bottom) => {
  let d = `M -60 ${bottom} L -60 ${y0}`;
  let k = seed;
  let x = -60;
  while (x < 1680) {
    k = (k * 9301 + 49297) % 233280;
    const r = k / 233280;
    const w = step * (0.7 + r * 0.6);
    d += ` Q ${x + w / 2} ${y0 - amp * (0.4 + r)} ${x + w} ${y0 + (r - 0.5) * 6}`;
    x += w;
  }
  return d + ` L 1680 ${bottom} Z`;
};
// A paper pine like the hero's: three stacked tiers and a trunk, with its own offset shadow.
const pine = (x, y, h, tone) => {
  const w = h * 0.46;
  const tiers = [0, 0.3, 0.56].map((t, i) => {
    const top = y - h + t * h;
    const half = (w / 2) * (0.62 + i * 0.19);
    return `M ${x} ${top} L ${x + half} ${top + h * 0.42} L ${x - half} ${top + h * 0.42} Z`;
  });
  const shade = tiers.map((d) => `<path d="${d}" fill="#22301F" opacity="0.16" transform="translate(2.5, 3.5)"></path>`).join('');
  const body = tiers.map((d, i) => `<path d="${d}" fill="${tone[i % tone.length]}"></path>`).join('');
  return `<rect x="${x - h * 0.03}" y="${y - h * 0.06}" width="${h * 0.06}" height="${h * 0.1}" fill="#5C4330"></rect>` + shade + body;
};
const TONES = [
  ['#3E4F37', '#49614F', '#56684A'],
  ['#49614F', '#56684A', '#62755A'],
  ['#2F4232', '#3E4F37', '#49614F'],
];
// Clusters that cover where the hero's forests end, plus a few loose trees along the valley.
const trees = [
  [112, 450, 96, 2], [140, 452, 150, 0], [172, 450, 118, 1], [200, 452, 132, 2], [228, 450, 84, 0],
  [598, 450, 70, 1], [626, 452, 92, 0], [654, 448, 64, 2],
  [770, 452, 60, 1], [990, 452, 56, 2],
  [1282, 450, 96, 1], [1306, 452, 138, 2], [1336, 450, 116, 0], [1364, 452, 150, 1], [1394, 450, 104, 2], [1420, 452, 78, 0],
]
  .map(([x, y, h, t]) => pine(x, y, h, TONES[t]))
  .join('');

const foreground =
  shadowed(wave(422, 10, 160, 7, 600), '#D5DAB4', '#4E5B3C') +
  trees +
  shadowed(wave(452, 7, 140, 3, 600), '#C3CBA0', '#4E5B3C') +
  shadowed(hills(474, 22, 260, 5, 600), '#3F6E70', '#162B2E', [[0, -3], [0, -6], [0, -10]], [0.14, 0.08, 0.04]) +
  shadowed(hills(492, 16, 330, 13, 600), '#2B4F55', '#162B2E', [[0, -3], [0, -6], [0, -10]], [0.16, 0.09, 0.05]);

const VIEW = process.env.VIEW ?? '0 -20 1600 520';
const head = (extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW}" preserveAspectRatio="xMidYMax slice"${extra}>\n<!-- From KIRIGAMI by Famanias (openlanding.page), MIT License. -->\n`;

writeFileSync('public/img/paper/footer-landscape.svg', head() + defs + clean(layer(0) + layer(1) + farOnly + layer(3)) + foreground + '</svg>\n');
writeFileSync('public/img/paper/footer-clouds.svg', head() + clean(clouds) + '</svg>\n');
console.log('footer landscape written');
