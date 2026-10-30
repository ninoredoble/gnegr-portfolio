import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PARTS, VIEW } from './logo'
import { $, $$, QA, charify } from './lib'

gsap.registerPlugin(ScrollTrigger)

/*
 The ride: one sticky stage holds every scene. A single scrubbed timeline drives it all, measured
 in "beats" (one beat = half a screen of scroll):
   - a new place wipes in from the right over the last one, along a slanted edge (WIPE beats);
   - while a place is on screen its layers slide left at their own speeds, the road lines run
     and the sign passes the bike;
   - in the workshop the bike stops, comes apart onto a mat, and goes back together before it leaves.
*/

const SCRUB: number | true = QA ? true : 0.7
const WIPE = 1.2
/** how long each place holds the screen after its wipe, in beats */
const HOLD: Record<string, number> = { hello: 1.6, ustp: 2.2, buynabay: 2.4, cepalco: 2.4, workshop: 5.2, now: 2.2, ahead: 1.8 }
const BEAT = () => window.innerHeight * 0.5
const SPEED = { far: 0.25, mid: 0.55, near: 1 }

export type Ride = {
  /** seconds on the timeline where each scene has fully arrived */
  arrive: Record<string, number>
  tl: gsap.core.Timeline
  st: ScrollTrigger
  /** the scene on top at the current point of the ride */
  current: () => HTMLElement
  /** the odometer reading at the current point of the ride */
  km: () => number
}

export function intro() {
  const tl = gsap.timeline()
  const name = $('.hello__name')
  tl.from(charify(name), { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.04, ease: 'expo.out' }, 0)
    .from(['#hello .lede', '#hello .hello__cue'], { y: 24, opacity: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out' }, 0.35)
    .from('.rider', { x: () => -window.innerWidth * 0.4, duration: 1.4, ease: 'power3.out' }, 0.1)
  return tl
}

export function buildRide(onUpdate: () => void): Ride {
  const ride = $('#ride')
  const stage = $('#stage')
  const scenes = $$('.scene', stage)
  const rider = $<SVGSVGElement>('.rider', stage)
  const tl = gsap.timeline({ defaults: { ease: 'none' }, paused: true })

  // when each scene starts wiping in, and when it has fully arrived
  const start: Record<string, number> = {}
  const arrive: Record<string, number> = {}
  let t = 0
  scenes.forEach((s, i) => {
    start[s.id] = i === 0 ? 0 : t
    arrive[s.id] = i === 0 ? 0 : t + WIPE
    t = arrive[s.id]! + HOLD[s.id]!
  })
  const total = t

  scenes.forEach((s, i) => {
    const t0 = start[s.id]!
    const t1 = arrive[s.id]!
    const next = scenes[i + 1]
    // a scene stays on screen (and keeps moving) until the next one has fully covered it
    const tEnd = next ? arrive[next.id]! : total
    const span = tEnd - t0

    if (i > 0) {
      tl.fromTo(s, { '--wipe': 120 }, { '--wipe': -20, duration: WIPE, ease: 'power1.inOut' }, t0)
    }

    for (const layer of $$<SVGSVGElement>('.layer', s)) {
      const k = layer.classList.contains('layer--far') ? SPEED.far : layer.classList.contains('layer--mid') ? SPEED.mid : SPEED.near
      tl.fromTo(layer, { x: 0 }, { x: () => -Math.max(0, layer.getBoundingClientRect().width - window.innerWidth) * k, duration: span }, t0)
    }
    const line = s.querySelector('.road__line')
    if (line) tl.fromTo(line, { backgroundPositionX: 0 }, { backgroundPositionX: () => -Math.round((window.innerWidth * span) / 120) * 120, duration: span }, t0)
    const sign = s.querySelector('.sign')
    if (sign) tl.fromTo(sign, { x: () => (i === 0 ? 0 : window.innerWidth * 0.12) }, { x: () => -window.innerWidth * 0.62, duration: span }, t0)

    // the copy arrives once the wipe has mostly passed, and leaves as the next place comes in
    const copy = $$(':scope > .scene__copy > *', s)
    if (i > 0) {
      // explicit start and end states: a plain from() loses its starting state when a resize invalidates the timeline
      tl.set(copy, { y: 30, opacity: 0 }, 0)
      tl.fromTo(copy, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', immediateRender: false }, t1 - 0.35)
    }
    if (next) tl.to(copy, { y: -24, opacity: 0, duration: 0.6, stagger: 0.04, ease: 'power1.in' }, start[next.id]! - 0.1)
  })

  // the hero name opens up as the ride starts
  const [w1, w2] = $$('.hello__word')
  tl.to(w1!, { xPercent: -10, duration: 1.4 }, 0.2).to(w2!, { xPercent: 10, duration: 1.4 }, 0.2)

  workshop(tl, stage, rider, arrive.workshop!, HOLD.workshop!)

  // at dusk the bike catches the last light
  tl.to(rider, { fill: '#F4EBDD', duration: WIPE }, start.ahead!)
  // the bike eases towards the road ahead at the very end
  tl.to('.rider', { x: () => window.innerWidth * 0.08, duration: HOLD.ahead!, ease: 'power1.inOut' }, arrive.ahead!)

  const size = () => {
    ride.style.height = `${Math.round(total * BEAT() + window.innerHeight)}px`
  }
  size()
  ScrollTrigger.addEventListener('refreshInit', size)

  const st = ScrollTrigger.create({
    trigger: ride,
    start: 'top top',
    end: 'bottom bottom',
    scrub: SCRUB,
    animation: tl,
    invalidateOnRefresh: true,
    onUpdate,
  })

  const order = scenes.map((s) => ({ el: s, at: arrive[s.id]! - WIPE * 0.5, km: Number(s.dataset.km) }))
  const current = () => {
    const now = tl.time()
    let top = order[0]!.el
    for (const o of order) if (now >= o.at) top = o.el
    return top
  }
  const km = () => {
    const now = tl.time()
    for (let k = 0; k < order.length - 1; k++) {
      const a = order[k]!
      const b = order[k + 1]!
      const ta = arrive[a.el.id]!
      const tb = arrive[b.el.id]!
      if (now < tb) return now <= ta ? a.km : a.km + ((now - ta) / (tb - ta)) * (b.km - a.km)
    }
    return order[order.length - 1]!.km
  }
  return { arrive, tl, st, current, km }
}

/**
 The workshop. The bike rides to the middle of the floor and stops; a mat is laid down; each part
 lifts off the bike and settles in its place on the mat (the parts on the mat start exactly where
 the same part sits on the bike, then fly home). Before the bike leaves, it all goes back together.
*/
function workshop(tl: gsap.core.Timeline, stage: HTMLElement, rider: SVGSVGElement, t1: number, hold: number) {
  const scene = $('#workshop')
  const mat = $('.parts', scene)
  const items = $$('.part', scene)
  const labels = items.flatMap((li) => $$(':scope > h3, :scope > p', li))
  const [vx, vy, vw] = VIEW

  // where the rider stands while parked: centred on the floor
  const parkX = () => window.innerWidth / 2 - rider.getBoundingClientRect().width / 2 - riderLeft()
  const riderLeft = () => parseFloat(getComputedStyle(rider).left)
  const stageRect = () => stage.getBoundingClientRect()

  /** the offset and scale that put the part on the mat exactly over the same part of the parked bike */
  const flip = (li: HTMLElement) => {
    const id = li.dataset.part!
    const part = PARTS.find((p) => p.id === id)!
    const slot = $('.part__slot', li)
    const art = $<SVGSVGElement>('.part__art', li)
    const s = stageRect()
    const slotBox = slot.getBoundingClientRect()
    // the art sits at the bottom-left of its slot; its own size is unaffected by its transform's origin math below
    const artW = parseFloat(getComputedStyle(art).width)
    const artH = artW * (part.box[3] / part.box[2])
    const artLeft = slotBox.left - s.left
    const artTop = slotBox.bottom - s.top - artH
    const r = rider.getBoundingClientRect()
    const scale = r.width / vw
    const bikeLeft = riderLeft() + parkX() + (part.box[0] - vx) * scale
    const bikeTop = r.top - s.top + (part.box[1] - vy) * scale
    return { x: bikeLeft - artLeft, y: bikeTop - artTop, scale: (scale * part.box[2]) / artW }
  }

  const a = t1 + 0.1
  tl.to(rider, { x: parkX, duration: 1, ease: 'power2.inOut' }, a)
  tl.set(mat, { opacity: 0, scaleY: 0.2, transformOrigin: '50% 100%' }, 0)
  tl.fromTo(mat, { opacity: 0, scaleY: 0.2 }, { opacity: 1, scaleY: 1, duration: 0.6, ease: 'power2.out', immediateRender: false }, a + 0.7)
  tl.set(rider, { opacity: 0 }, a + 1.4)
  items.forEach((li, i) => {
    const art = $('.part__art', li)
    tl.fromTo(
      art,
      { x: () => flip(li).x, y: () => flip(li).y, scale: () => flip(li).scale, fill: '#1B1712' },
      { x: 0, y: 0, scale: 1, fill: '#F4EBDD', duration: 0.9, ease: 'power3.inOut', immediateRender: false },
      a + 1.4 + i * 0.06,
    )
  })
  // before the parts fly, they sit hidden on the mat
  tl.set($$('.part__art', scene), { opacity: 0 }, 0)
  tl.set($$('.part__art', scene), { opacity: 1 }, a + 1.4)
  tl.set(labels, { opacity: 0, y: 14 }, 0)
  tl.fromTo(labels, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power2.out', immediateRender: false }, a + 2.1)

  // and back together
  const b = t1 + hold - 1.5
  tl.to(labels, { opacity: 0, duration: 0.3 }, b)
  items.forEach((li) => {
    const art = $('.part__art', li)
    tl.to(art, { x: () => flip(li).x, y: () => flip(li).y, scale: () => flip(li).scale, fill: '#1B1712', duration: 0.8, ease: 'power3.inOut' }, b + 0.1)
  })
  tl.set($$('.part__art', scene), { opacity: 0 }, b + 0.9)
  tl.set(rider, { opacity: 1 }, b + 0.9)
  tl.to(mat, { opacity: 0, duration: 0.4 }, b + 0.8)
  tl.to(rider, { x: 0, duration: 1.2, ease: 'power2.inOut' }, b + 1)
}
