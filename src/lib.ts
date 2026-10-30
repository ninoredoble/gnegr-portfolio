export const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s)!
export const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)]

const params = new URLSearchParams(location.search)
/** ?qa turns off smoothing so screenshots land exactly where the test scrolls to. */
export const QA = params.has('qa')
export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

/** Wide enough, tall enough and landscape: room for the ride. Everything else gets the stacked scenes. */
export const rideQuery = matchMedia('(min-width: 900px) and (min-height: 560px) and (orientation: landscape)')

/** Wrap every visible character under `node` in a span.char so it can be animated on its own. */
export function charify(node: HTMLElement) {
  const walk = (n: Node) => {
    for (const child of [...n.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        for (const c of child.textContent!) {
          if (/\s/.test(c)) frag.append(c)
          else {
            const s = document.createElement('span')
            s.className = 'char'
            s.textContent = c
            frag.append(s)
          }
        }
        child.replaceWith(frag)
      } else if (child instanceof HTMLElement && !child.classList.contains('char')) walk(child)
    }
  }
  walk(node)
  return $$('.char', node)
}
