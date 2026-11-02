import '@fontsource-variable/archivo/wdth.css'
import '@fontsource/overpass/700.css'
import './style.css'

import { $, $$, QA, reduced, rideQuery } from './lib'
import type Lenis from 'lenis'
import type { Ride } from './ride'

const root = document.documentElement
const riding = !reduced && rideQuery.matches
// crossing the breakpoint swaps between two layouts; a fresh start is simpler than undoing one
rideQuery.addEventListener('change', () => !reduced && location.reload())

$('#yearNow').textContent = String(new Date().getFullYear())

/* ——— HUD: colours and the odometer follow whichever place is on screen ——— */
const hud = $('#hud')
const odo = $('#odo')
const odoPlace = $('#odoPlace')
const themeMeta = $<HTMLMetaElement>('meta[name="theme-color"]')
const scenes = $$('.scene')
let current: HTMLElement | null = null

function onScene(scene: HTMLElement) {
  const cs = getComputedStyle(scene)
  const bg = cs.getPropertyValue('--sky').trim()
  const fg = cs.color
  hud.style.setProperty('--hud-bg', bg)
  hud.style.setProperty('--hud-ink', fg)
  themeMeta.content = bg
  odoPlace.textContent = scene.dataset.place ?? ''
}
function setScene(scene: HTMLElement) {
  if (scene === current) return
  current = scene
  onScene(scene)
}
const showKm = (km: number) => (odo.textContent = `KM ${km.toFixed(1).padStart(4, '0')}`)

/* ——— copy the email address ——— */
const copyBtn = $<HTMLButtonElement>('.copy')
const copyStatus = $('#copyStatus')
if (navigator.clipboard) {
  copyBtn.hidden = false
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.copy!)
      copyStatus.textContent = 'Email address copied.'
      copyBtn.textContent = 'Copied'
      setTimeout(() => {
        copyBtn.textContent = 'Copy'
        copyStatus.textContent = ''
      }, 2600)
    } catch {
      copyStatus.textContent = 'Could not copy. The address is redoble.gninoemmanuel@gmail.com.'
    }
  })
}

if (riding) void startRide()
else startStack()

/* ——— the ride ——— */
async function startRide() {
  root.classList.add('is-ride')
  // the animation engine is only fetched when the ride will actually run
  let mods
  try {
    mods = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
      import('./ride'),
    ])
  } catch {
    // the engine could not load: fall back to the stacked scenes
    root.classList.remove('is-ride')
    return startStack()
  }
  const [{ gsap }, { ScrollTrigger }, { default: LenisCtor }, { buildRide, intro }] = mods
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({ ignoreMobileResize: true })
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)

  let lenis: Lenis | null = null
  if (!QA) {
    lenis = new LenisCtor({ lerp: 0.1, wheelMultiplier: 0.9 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis!.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  let built: Ride | null = null
  const sync = () => {
    if (!built) return
    setScene(built.current())
    showKm(built.km())
  }
  const ride: Ride = (built = buildRide(sync))
  ScrollTrigger.addEventListener('refresh', sync)
  gsap.to('.progress i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })

  // the engine rumbles while the page is moving
  let still = 0
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: () => {
      root.classList.add('is-moving')
      clearTimeout(still)
      still = window.setTimeout(() => root.classList.remove('is-moving'), 140)
    },
  })

  // a place in the menu jumps to the moment that place's copy is fully shown
  const goto = (id: string) => {
    const at = ride.settled[id]
    if (at === undefined) return
    const y = ride.st.start + (at / ride.tl.duration()) * (ride.st.end - ride.st.start)
    if (lenis) lenis.scrollTo(y, { duration: 2 })
    else window.scrollTo(0, y)
  }
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('[data-goto]')
    if (!a) return
    e.preventDefault()
    goto(a.dataset.goto!)
    history.replaceState(null, '', `#${a.dataset.goto}`)
  })
  // keyboard users tabbing into a place's links land on that place
  document.addEventListener('focusin', (e) => {
    const scene = (e.target as HTMLElement).closest<HTMLElement>('.scene')
    if (scene && scene !== ride.current()) goto(scene.id)
  })

  sync()
  void document.fonts.ready.then(() => ScrollTrigger.refresh())
  const loaded = () => {
    ScrollTrigger.refresh()
    if (location.hash.length > 1) goto(location.hash.slice(1))
  }
  if (document.readyState === 'complete') loaded()
  else window.addEventListener('load', loaded)
  if (!QA) intro()
  // screenshots need to land on exact moments of the ride
  if (QA) Object.assign(window, { __ride: { at: (t: number) => ride.st.start + (t / ride.tl.duration()) * (ride.st.end - ride.st.start), arrive: ride.arrive } })
  root.dataset.ready = '1'
}

/* ——— stacked scenes: phones, reduced motion ——— */
function startStack() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setScene(e.target as HTMLElement)
    },
    // a scene counts as current once it reaches the HUD
    { rootMargin: '-64px 0px -85% 0px' },
  )
  scenes.forEach((s) => io.observe(s))
  setScene(scenes[0]!)
  const ticks = () => {
    const top = current ?? scenes[0]!
    showKm(Number(top.dataset.km))
  }
  window.addEventListener('scroll', ticks, { passive: true })

  if (!reduced && !QA) {
    root.classList.add('js-reveal')
    const items = $$('.scene__copy > *, .part')
    items.forEach((el, i) => {
      el.classList.add('reveal')
      el.style.transitionDelay = `${(i % 4) * 70}ms`
    })
    const show = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            show.unobserve(e.target)
          }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    items.forEach((el) => show.observe(el))
  }
  root.dataset.ready = '1'
}
