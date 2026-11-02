/*
 Flat, layered landscapes for each stop on the ride. Pure functions that return SVG strings,
 so the art is rendered into the HTML at build time (see vite.config.ts) and the page shows its
 scenes before any script runs.

 Every scene has the same stack, back to front: sky (the scene's own background colour), sun,
 far ridge, middle ground, the road, and the near verge. Layers share one width (W) so the scroll
 parallax can move them by the same rules; their heights differ.
*/
import { PARTS, SHAPES, VIEW, type LogoPart } from './logo'

export const W = 2400
export const FAR_H = 520
export const MID_H = 420
export const NEAR_H = 300

type Pal = {
  sun: string
  far: string
  far2?: string
  mid: string
  mid2: string
  mid3: string
  verge: string
  verge2: string
  post: string
}

/* ——— small helpers ——— */

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const r1 = (n: number) => Math.round(n * 10) / 10

/** A soft mountain ridge: a sum of a few sines, closed along the bottom of the layer. */
function ridge(h: number, base: number, amp: number, seed: number, waves = 4, step = 40) {
  const rand = rng(seed)
  const ws = Array.from({ length: waves }, (_, i) => ({
    f: (0.6 + rand() * 1.4) * (i + 1) * (Math.PI * 2) / W,
    p: rand() * Math.PI * 2,
    a: amp / (i + 1.2),
  }))
  let d = `M0 ${h}`
  for (let x = 0; x <= W; x += step) {
    const y = base - ws.reduce((s, w) => s + Math.sin(x * w.f + w.p) * w.a, 0) - amp * 0.4
    d += ` L${x} ${r1(y)}`
  }
  return `${d} L${W} ${h} Z`
}

const rect = (x: number, y: number, w: number, h: number, fill: string, extra = '') =>
  `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${fill}"${extra}/>`

function svg(cls: string, h: number, body: string) {
  return `<svg class="layer ${cls}" viewBox="0 0 ${W} ${h}" preserveAspectRatio="xMinYMax meet" style="aspect-ratio:${W}/${h}" aria-hidden="true" focusable="false">${body}</svg>`
}

/** A round-canopy tree. */
function tree(x: number, ground: number, s: number, leaf: string, trunk: string) {
  return (
    rect(x - 4 * s, ground - 34 * s, 8 * s, 34 * s, trunk) +
    `<circle cx="${r1(x)}" cy="${r1(ground - 52 * s)}" r="${r1(30 * s)}" fill="${leaf}"/>` +
    `<circle cx="${r1(x - 20 * s)}" cy="${r1(ground - 38 * s)}" r="${r1(20 * s)}" fill="${leaf}"/>` +
    `<circle cx="${r1(x + 22 * s)}" cy="${r1(ground - 40 * s)}" r="${r1(19 * s)}" fill="${leaf}"/>`
  )
}

/** A coconut palm: a curved trunk and a fan of fronds. */
function palm(x: number, ground: number, s: number, c: string, lean = 1) {
  const tx = x + 26 * s * lean
  const ty = ground - 150 * s
  let fr = ''
  for (const a of [-160, -125, -90, -55, -20, 15]) {
    const rad = (a * Math.PI) / 180
    const ex = tx + Math.cos(rad) * 70 * s
    const ey = ty + Math.sin(rad) * 34 * s + 26 * s
    const cx = tx + Math.cos(rad) * 40 * s
    const cy = ty + Math.sin(rad) * 40 * s - 6 * s
    fr += `<path d="M${r1(tx)} ${r1(ty)} Q${r1(cx)} ${r1(cy)} ${r1(ex)} ${r1(ey)} Q${r1(cx)} ${r1(cy + 12 * s)} ${r1(tx)} ${r1(ty + 6 * s)}Z" fill="${c}"/>`
  }
  return `<path d="M${r1(x - 5 * s)} ${ground} Q${r1(x + 4 * s * lean)} ${r1(ground - 90 * s)} ${r1(tx - 3 * s)} ${r1(ty)} L${r1(tx + 4 * s)} ${r1(ty)} Q${r1(x + 12 * s * lean)} ${r1(ground - 90 * s)} ${r1(x + 5 * s)} ${ground}Z" fill="${c}"/>${fr}`
}

/** The near verge: a band of ground with a kerb line along the road. */
function verge(p: Pal, seed: number, extra = '') {
  const rand = rng(seed)
  let tufts = ''
  for (let x = 30; x < W; x += 70 + rand() * 120) {
    const h = 14 + rand() * 18
    tufts += `<path d="M${r1(x)} ${NEAR_H - 40} l${r1(6 + rand() * 4)} ${r1(-h)} l${r1(6 + rand() * 4)} ${r1(h)} l${r1(5)} ${r1(-h * 0.7)} l${r1(6)} ${r1(h * 0.7)}Z" fill="${p.verge2}"/>`
  }
  return rect(0, NEAR_H - 40, W, 40, p.verge) + tufts + extra
}

/** Concrete posts along the verge, regularly spaced. */
function posts(p: Pal, from: number, gap: number) {
  let s = ''
  for (let x = from; x < W; x += gap) s += rect(x, NEAR_H - 78, 14, 40, p.post) + rect(x - 2, NEAR_H - 82, 18, 8, p.post)
  return s
}

/* ——— the scenes ——— */

export type SceneId = 'hello' | 'ustp' | 'buynabay' | 'cepalco' | 'workshop' | 'now' | 'ahead'

const PAL: Record<SceneId, Pal> = {
  hello: { sun: '#F59E58', far: '#DDB09A', far2: '#CF9C88', mid: '#A9776A', mid2: '#8F6159', mid3: '#F8C98E', verge: '#6E4C43', verge2: '#5C3E37', post: '#E9D3BE' },
  ustp: { sun: '#FFF1C2', far: '#B4CFC2', far2: '#9EBFB1', mid: '#EDE2CC', mid2: '#C9B99B', mid3: '#4F7B5D', verge: '#5E7F4E', verge2: '#4C6A3F', post: '#EFE6D6' },
  buynabay: { sun: '#FFF6D8', far: '#93BFA8', far2: '#7DAE95', mid: '#E24E1B', mid2: '#2F7F7A', mid3: '#F4EBDD', verge: '#6A8A4C', verge2: '#56733D', post: '#EDE3D2' },
  cepalco: { sun: '#FFFBEA', far: '#79A7C2', far2: '#6795B2', mid: '#38434C', mid2: '#8AA86A', mid3: '#C7CFD4', verge: '#6F9550', verge2: '#5B7E41', post: '#E6E2DA' },
  workshop: { sun: '#F2B866', far: '#CDB89A', mid: '#8F7758', mid2: '#B49B7B', mid3: '#F6D9A0', verge: '#9C8C78', verge2: '#B3A38D', post: '#6E5643' },
  now: { sun: '#FCE3A2', far: '#C98450', far2: '#B5703F', mid: '#8C6B2E', mid2: '#6F5524', mid3: '#A7863D', verge: '#7A4A26', verge2: '#663C1E', post: '#F1D9B4' },
  ahead: { sun: '#F3A55B', far: '#2A3D49', far2: '#1E2E38', mid: '#16232B', mid2: '#E07A45', mid3: '#F4EBDD', verge: '#121C22', verge2: '#0D161B', post: '#3A4C57' },
}

function sun(p: Pal, cx: number, cy: number, r: number) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.sun}"/>`
}

/** Dawn over Cagayan de Oro: the river, the bridge and the low city. */
function hello(p: Pal) {
  const rand = rng(11)
  let city = ''
  let x = 120
  while (x < W - 60) {
    const w = 60 + rand() * 90
    const h = 70 + rand() * 170
    const top = MID_H - 70 - h
    city += rect(x, top, w, h + 4, rand() > 0.5 ? p.mid : p.mid2)
    // a few windows already lit at dawn
    for (let wy = top + 18; wy < MID_H - 90; wy += 26)
      for (let wx = x + 12; wx < x + w - 16; wx += 22) if (rand() > 0.78) city += rect(wx, wy, 9, 12, p.mid3)
    if (rand() > 0.8) city += rect(x + w * 0.5 - 3, top - 40, 6, 40, p.mid2)
    x += w + 6 + rand() * 30
  }
  // the river and a long bridge across it
  const river = rect(0, MID_H - 70, W, 70, '#E8B996') + rect(0, MID_H - 70, W, 8, '#F3CDA8')
  let bridge = rect(860, MID_H - 112, 980, 14, p.mid2)
  for (let bx = 880; bx < 1840; bx += 120) bridge += `<path d="M${bx} ${MID_H - 98} q60 -54 120 0" fill="none" stroke="${p.mid2}" stroke-width="8"/>` + rect(bx - 4, MID_H - 98, 8, 30, p.mid2)
  const far =
    sun(p, 1500, 330, 120) +
    `<path d="${ridge(FAR_H, 400, 60, 3)}" fill="${p.far}"/>` +
    `<path d="${ridge(FAR_H, 455, 40, 7)}" fill="${p.far2}"/>`
  const near = verge(p, 5, posts(p, 160, 420) + palm(520, NEAR_H - 40, 1, p.verge2) + palm(1980, NEAR_H - 40, 0.9, p.verge2, -1))
  return { far, mid: city + river + bridge, near }
}

/** Morning on campus: long academic blocks, trees, a flagpole. */
function ustp(p: Pal) {
  const rand = rng(21)
  let mid = ''
  const ground = MID_H
  let x = 60
  let i = 0
  while (x < W - 200) {
    const floors = 3 + Math.floor(rand() * 3)
    const w = 280 + rand() * 220
    const h = floors * 48 + 20
    const top = ground - h
    mid += rect(x, top, w, h, p.mid) + rect(x - 10, top - 14, w + 20, 16, p.mid2)
    for (let f = 0; f < floors; f++) for (let wx = x + 22; wx < x + w - 34; wx += 40) mid += rect(wx, top + 22 + f * 48, 24, 26, p.mid2)
    mid += tree(x + w + 46, ground, 1 + rand() * 0.3, p.mid3, '#3E5A45')
    if (i === 1) mid += rect(x + w + 120, ground - 230, 6, 230, '#6A6A60') + rect(x + w + 126, ground - 226, 54, 34, '#E24E1B')
    x += w + 130 + rand() * 60
    i++
  }
  const far = sun(p, 520, 150, 70) + `<path d="${ridge(FAR_H, 380, 70, 8)}" fill="${p.far}"/><path d="${ridge(FAR_H, 450, 36, 12)}" fill="${p.far2}"/>`
  const near = verge(p, 9, posts(p, 90, 260) + tree(1300, NEAR_H - 40, 1.3, p.verge2, '#344A2B'))
  return { far, mid, near }
}

/** The campus market: stalls under striped awnings, crates and hanging goods. */
function buynabay(p: Pal) {
  const rand = rng(31)
  let mid = ''
  const ground = MID_H
  const awn = [p.mid, p.mid2, '#E9A23B', p.mid]
  let x = 90
  let i = 0
  while (x < W - 160) {
    const w = 220 + rand() * 80
    const roof = ground - 190 - rand() * 30
    const c = awn[i % awn.length]!
    // posts, table, goods
    mid += rect(x + 8, roof, 10, ground - roof, '#5A4636') + rect(x + w - 18, roof, 10, ground - roof, '#5A4636')
    mid += rect(x, ground - 74, w, 14, '#7A5C44') + rect(x + 12, ground - 60, w - 24, 60, '#8E6E52')
    for (let gx = x + 18; gx < x + w - 40; gx += 34 + rand() * 10) {
      const gh = 18 + rand() * 30
      mid += rect(gx, ground - 74 - gh, 26, gh, rand() > 0.5 ? '#F4EBDD' : rand() > 0.5 ? '#E9A23B' : '#C9563A')
    }
    // a striped awning with a scalloped edge
    let stripes = ''
    for (let sx = 0; sx < w + 20; sx += 40) stripes += rect(x - 10 + sx, roof - 40, 20, 40, p.mid3)
    mid += rect(x - 10, roof - 40, w + 20, 40, c) + stripes
    let sc = ''
    for (let sx = x - 10; sx < x + w + 10; sx += 20) sc += `<circle cx="${sx + 10}" cy="${roof}" r="10" fill="${c}"/>`
    mid += sc
    // hanging goods
    for (let hx = x + 30; hx < x + w - 30; hx += 46) mid += `<line x1="${hx}" y1="${roof}" x2="${hx}" y2="${roof + 26}" stroke="#5A4636" stroke-width="3"/>` + rect(hx - 9, roof + 26, 18, 22, '#F4EBDD')
    x += w + 60 + rand() * 50
    i++
  }
  // string lights between the stalls
  mid += `<path d="M0 ${ground - 250} Q600 ${ground - 200} 1200 ${ground - 250} T2400 ${ground - 250}" fill="none" stroke="#3B3129" stroke-width="3"/>`
  for (let lx = 40; lx < W; lx += 80) mid += `<circle cx="${lx}" cy="${ground - 236 + Math.sin(lx / 190) * 12}" r="7" fill="#FFF1C2"/>`
  const far = sun(p, 1900, 120, 64) + `<path d="${ridge(FAR_H, 420, 50, 4)}" fill="${p.far}"/><path d="${ridge(FAR_H, 470, 26, 15, 5)}" fill="${p.far2}"/>`
  const near = verge(p, 13, posts(p, 210, 380))
  return { far, mid, near }
}

/** A lattice pylon, drawn with strokes. */
function pylon(x: number, ground: number, h: number, c: string) {
  const top = ground - h
  const half = h * 0.14
  let s = `<g fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round">`
  s += `<path d="M${x - half} ${ground} L${x - 8} ${top} L${x + 8} ${top} L${x + half} ${ground}"/>`
  const n = 7
  for (let k = 0; k < n; k++) {
    const t1 = k / n
    const t2 = (k + 1) / n
    const y1 = ground - h * t1
    const y2 = ground - h * t2
    const w1 = half - (half - 8) * t1
    const w2 = half - (half - 8) * t2
    s += `<path d="M${r1(x - w1)} ${r1(y1)} L${r1(x + w2)} ${r1(y2)} M${r1(x + w1)} ${r1(y1)} L${r1(x - w2)} ${r1(y2)}"/>`
  }
  // cross arms
  s += `<path d="M${x - 70} ${top + 40} L${x + 70} ${top + 40} M${x - 54} ${top + 90} L${x + 54} ${top + 90}"/>`
  s += '</g>'
  return s
}

/** Midday on the grid: pylons and wires, a substation behind a fence, fields. */
function cepalco(p: Pal) {
  const ground = MID_H
  let mid = rect(0, ground - 60, W, 60, p.mid2)
  const xs = [240, 1000, 1760]
  for (const x of xs) mid += pylon(x, ground - 30, 340, p.mid)
  // wires sag between the arms
  for (const dy of [70, 120]) {
    let d = ''
    for (let k = 0; k < xs.length - 1; k++) {
      const a = xs[k]!
      const b = xs[k + 1]!
      d += `M${a + 70} ${ground - 370 + dy} Q${(a + b) / 2} ${ground - 300 + dy} ${b - 70} ${ground - 370 + dy} `
      d += `M${a - 70} ${ground - 370 + dy} Q${(a + b) / 2} ${ground - 300 + dy} ${b + 70} ${ground - 370 + dy} `
    }
    mid += `<path d="${d}" fill="none" stroke="${p.mid}" stroke-width="2.5"/>`
  }
  // substation: transformers, insulators, a gantry
  const sx = 1220
  mid += rect(sx, ground - 170, 420, 10, p.mid) + rect(sx + 10, ground - 170, 10, 140, p.mid) + rect(sx + 400, ground - 170, 10, 140, p.mid)
  for (let k = 0; k < 3; k++) {
    const tx = sx + 50 + k * 120
    mid += rect(tx, ground - 110, 80, 80, p.mid3) + rect(tx + 8, ground - 120, 64, 10, p.mid)
    for (let b = 0; b < 3; b++) mid += rect(tx + 14 + b * 22, ground - 156, 8, 36, p.mid)
  }
  // a chain-link fence: posts and one rail
  for (let fx = sx - 80; fx < sx + 520; fx += 60) mid += rect(fx, ground - 64, 5, 50, p.mid)
  mid += rect(sx - 80, ground - 64, 600, 4, p.mid)
  // a few flat clouds
  const cloud = (cx: number, cy: number, s: number) =>
    `<g fill="#F7FAFB"><circle cx="${cx}" cy="${cy}" r="${30 * s}"/><circle cx="${cx + 36 * s}" cy="${cy - 14 * s}" r="${38 * s}"/><circle cx="${cx + 80 * s}" cy="${cy}" r="${28 * s}"/>${rect(cx, cy, 80 * s, 28 * s, '#F7FAFB')}</g>`
  const far =
    sun(p, 1700, 90, 56) +
    cloud(300, 150, 1.4) +
    cloud(1100, 100, 1) +
    cloud(2000, 190, 1.2) +
    `<path d="${ridge(FAR_H, 400, 80, 21)}" fill="${p.far}"/><path d="${ridge(FAR_H, 460, 40, 22)}" fill="${p.far2}"/>`
  // utility poles along the road, wired together
  let near = ''
  const poles = [180, 980, 1780]
  for (const x of poles) near += rect(x, NEAR_H - 270, 16, 232, '#C8C2B6') + rect(x - 50, NEAR_H - 250, 116, 10, '#8C857A') + rect(x - 40, NEAR_H - 264, 8, 14, '#5B5650') + rect(x + 48, NEAR_H - 264, 8, 14, '#5B5650')
  let wd = ''
  for (let k = 0; k < poles.length - 1; k++) wd += `M${poles[k]! + 52} ${NEAR_H - 262} Q${(poles[k]! + poles[k + 1]!) / 2} ${NEAR_H - 210} ${poles[k + 1]! - 36} ${NEAR_H - 262} `
  near += `<path d="${wd}" fill="none" stroke="#3B3F44" stroke-width="3"/>`
  return { far, mid, near: verge(p, 17, near) }
}

/** The workshop: a back wall with a window of afternoon light, a pegboard of tools, a bench. */
function workshop(p: Pal) {
  // the "far" layer is the back wall
  let far = rect(0, 0, W, FAR_H, p.far)
  for (let wx = 300; wx < W; wx += 900) {
    far += rect(wx, 90, 300, 220, '#5B4636') + rect(wx + 14, 104, 272, 192, p.mid3) + rect(wx + 146, 104, 8, 192, '#5B4636') + rect(wx + 14, 196, 272, 8, '#5B4636')
  }
  // pegboard with hanging tools
  let mid = ''
  const pegs = (x: number) => {
    let s = rect(x, 60, 560, 250, p.mid2)
    for (let py = 80; py < 300; py += 22) for (let px = x + 20; px < x + 550; px += 22) s += `<circle cx="${px}" cy="${py}" r="2.6" fill="${p.mid}"/>`
    // spanner, hammer, screwdriver and pliers, as flat silhouettes
    s += `<path d="M${x + 60} 110 h18 v120 h-18Z M${x + 52} 96 a17 17 0 1 1 34 0 l-8 8 h-18Z" fill="#C7B39A"/>`
    s += rect(x + 140, 100, 70, 26, '#C7B39A') + rect(x + 168, 126, 14, 120, '#8A6A4C')
    s += rect(x + 260, 104, 12, 70, '#C7B39A') + rect(x + 254, 174, 24, 70, '#E24E1B')
    s += `<path d="M${x + 350} 100 l26 0 l10 70 l-12 80 l-10 0 l6 -80 l-8 -60 l-8 60 l6 80 l-10 0 l-12 -80Z" fill="#C7B39A"/>`
    s += `<circle cx="${x + 470}" cy="${170}" r="54" fill="none" stroke="#1B1712" stroke-width="16"/>`
    return s
  }
  mid += pegs(760) + pegs(1960)
  mid += rect(0, MID_H - 110, W, 16, '#5B4636') + rect(30, MID_H - 94, 18, 94, '#4A3A2D') + rect(W - 48, MID_H - 94, 18, 94, '#4A3A2D')
  for (let k = 0; k < 6; k++) mid += rect(120 + k * 380, MID_H - 150, 90 + (k % 3) * 30, 40, k % 2 ? '#6E5643' : '#7E6450')
  // light from the window falls across the floor
  const near = rect(0, NEAR_H - 40, W, 40, p.verge) + `<path d="M260 ${NEAR_H} L560 ${NEAR_H - 40} L900 ${NEAR_H - 40} L700 ${NEAR_H}Z" fill="${p.verge2}"/><path d="M1460 ${NEAR_H} L1760 ${NEAR_H - 40} L2100 ${NEAR_H - 40} L1900 ${NEAR_H}Z" fill="${p.verge2}"/>`
  return { far, mid, near }
}

/** Golden hour on the open highway: the Kitanglad range, pineapple fields, one tree. */
function now(p: Pal) {
  const far =
    sun(p, 1200, 360, 150) +
    `<path d="${ridge(FAR_H, 330, 120, 31, 3)}" fill="${p.far}"/>` +
    `<path d="${ridge(FAR_H, 420, 60, 33, 4)}" fill="${p.far2}"/>`
  let mid = rect(0, MID_H - 150, W, 150, p.mid3)
  // rows of pineapple crowns receding in bands
  for (let row = 0; row < 5; row++) {
    const y = MID_H - 140 + row * 28
    const s = 0.5 + row * 0.18
    for (let x = (row % 2) * 20; x < W; x += 40 * s + 10) {
      mid += `<path d="M${r1(x)} ${y} l${r1(6 * s)} ${r1(-18 * s)} l${r1(4 * s)} ${r1(14 * s)} l${r1(4 * s)} ${r1(-20 * s)} l${r1(4 * s)} ${r1(20 * s)} l${r1(4 * s)} ${r1(-14 * s)} l${r1(6 * s)} ${r1(18 * s)}Z" fill="${row % 2 ? p.mid : p.mid2}"/>`
    }
  }
  mid += tree(1700, MID_H - 150, 1.5, '#5A4A24', '#4A3A1C')
  const near = verge(p, 41, posts(p, 120, 340))
  return { far, mid, near }
}

/** Dusk at a fork in the road. */
function ahead(p: Pal) {
  const far =
    rect(0, 360, W, 160, p.mid2) +
    `<circle cx="1180" cy="380" r="110" fill="${p.sun}"/>` +
    `<path d="${ridge(FAR_H, 400, 70, 52)}" fill="${p.far}"/>` +
    `<path d="${ridge(FAR_H, 460, 34, 53)}" fill="${p.far2}"/>`
  // the road forks: one way bends left, the other right, both run on to the hills
  const g = MID_H
  const road = '#3D3934'
  const line = '#EFE3C8'
  let mid = rect(0, g - 120, W, 120, p.mid)
  mid += `<path d="M980 ${g} L1150 ${g - 64} L700 ${g - 120} L780 ${g - 120} L1200 ${g - 76} L1620 ${g - 120} L1700 ${g - 120} L1250 ${g - 64} L1420 ${g}Z" fill="${road}"/>`
  mid += `<path d="M1200 ${g} L1200 ${g - 58} M1190 ${g - 70} L760 ${g - 118} M1210 ${g - 70} L1640 ${g - 118}" fill="none" stroke="${line}" stroke-width="5" stroke-dasharray="22 18"/>`
  const near = verge(p, 57, posts(p, 140, 460))
  return { far, mid, near }
}

const BUILD: Record<SceneId, (p: Pal) => { far: string; mid: string; near: string }> = { hello, ustp, buynabay, cepalco, workshop, now, ahead }

/** The full stack of art for one scene, inside `.scene__art`. */
export function sceneArt(id: SceneId) {
  const p = PAL[id]
  const a = BUILD[id](p)
  return [
    svg('layer--far', FAR_H, a.far),
    svg('layer--mid', MID_H, a.mid),
    `<div class="road" aria-hidden="true"><i class="road__line"></i></div>`,
    svg('layer--near', NEAR_H, a.near),
  ].join('')
}

/* ——— road signs ——— */

/** A green highway sign on two posts. Pure decoration: the heading next to it says the same thing. */
export function roadSign(km: string, place: string) {
  const w = Math.max(240, 40 + place.length * 21)
  return `<svg class="sign" viewBox="0 0 ${w} 250" style="aspect-ratio:${w}/250" aria-hidden="true" focusable="false">
<rect x="${w * 0.22}" y="110" width="10" height="140" fill="#9A9A92"/><rect x="${w * 0.78 - 10}" y="110" width="10" height="140" fill="#9A9A92"/>
<rect x="0" y="0" width="${w}" height="124" rx="12" fill="#1E6B47"/><rect x="6" y="6" width="${w - 12}" height="112" rx="8" fill="none" stroke="#F4EBDD" stroke-width="4"/>
<text x="${w / 2}" y="54" text-anchor="middle" class="sign__km">${km}</text><text x="${w / 2}" y="98" text-anchor="middle" class="sign__place">${place}</text></svg>`
}

/* ——— the motorcycle ——— */

/** The logo's shapes and the clip paths that cut it into parts, defined once per page. */
export function logoSprite() {
  const clips = PARTS.filter((p) => p.clip)
    .map((p) => `<clipPath id="cut-${p.id}"><polygon points="${p.clip}"/></clipPath>`)
    .join('')
  const shapes = Object.entries(SHAPES)
    .map(([k, d]) => `<path id="lg-${k}" fill-rule="evenodd" d="${d}"/>`)
    .join('')
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${shapes}${clips}</defs></svg>`
}

function partBody(p: LogoPart) {
  const clip = p.clip ? ` clip-path="url(#cut-${p.id})"` : ''
  return `<use href="#lg-${p.src}"${clip}/>${p.also ? `<use href="#lg-${p.also}"/>` : ''}`
}

/** The whole bike, assembled, each part in its own group so it can be taken apart. */
export function bike(cls = 'bike') {
  const [x, y, w, h] = VIEW
  const groups = PARTS.map((p) => `<g class="bike__part" data-part="${p.id}">${partBody(p)}</g>`).join('')
  return `<svg class="${cls}" viewBox="${x} ${y} ${w} ${h}" style="aspect-ratio:${w}/${h}" aria-hidden="true" focusable="false">${groups}</svg>`
}

/** One part on its own, cropped to its box: for the workshop floor. */
export function partArt(id: LogoPart['id']) {
  const p = PARTS.find((q) => q.id === id)!
  const [x, y, w, h] = p.box
  return `<svg class="part__art" viewBox="${x} ${y} ${w} ${h}" style="aspect-ratio:${w}/${h};--bw:${w}" aria-hidden="true" focusable="false">${partBody(p)}</svg>`
}

/** The whole logo as one standalone image, for places that don't load the sprite. */
export function logoMark(cls: string) {
  const [x, y, w, h] = VIEW
  const d = Object.values(SHAPES).join('')
  return `<svg class="${cls}" viewBox="${x} ${y} ${w} ${h}" role="img" aria-label="The GNEGR motorcycle logo"><path fill-rule="evenodd" d="${d}"/></svg>`
}
