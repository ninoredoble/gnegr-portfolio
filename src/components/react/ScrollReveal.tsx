/*! @license
 * ScrollReveal, adapted from React Bits (reactbits.dev) <ScrollReveal />.
 * Copyright (c) 2026 David Haz. MIT + Commons Clause License Condition v1.0: permission is hereby
 * granted, free of charge, to use, copy, modify, merge, publish, and distribute the Software as
 * part of an application, website, or product, provided the components themselves are not sold,
 * sublicensed or redistributed. The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS",
 * WITHOUT WARRANTY OF ANY KIND.
 *
 * Changes for this site: only the scrubbed fade (with blur) is kept; the last words can be set
 * apart as an accent, and once they light up a hand-drawn marker stroke is drawn under them with
 * anime.js. The full heading is server-rendered, so there's no layout shift when this hydrates.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, svg } from 'animejs';
import './scroll-reveal.css';

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const SPAN = 0.5;

type Props = { text: string; accent?: string; className?: string; baseOpacity?: number; blur?: number; stagger?: number };

export default function ScrollReveal({ text, accent = '', className = '', baseOpacity = 0.12, blur = 4, stagger = 0.05 }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const strokeRef = useRef<SVGPathElement>(null);
  const words = text.split(/\s+/).filter(Boolean);
  const accentWords = accent.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pieces = Array.from(el.querySelectorAll<HTMLElement>('.sr-piece'));
    const mm = gsap.matchMedia();
    let drawn = false;

    const drawStroke = () => {
      if (drawn || !strokeRef.current) return;
      drawn = true;
      const [line] = svg.createDrawable(strokeRef.current);
      strokeRef.current.closest('svg')?.classList.add('on');
      animate(line, { draw: ['0 0', '0 1'], duration: 900, ease: 'inOutQuad' });
    };

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const state = { p: 0 };
      const total = SPAN + Math.max(0, pieces.length - 1) * stagger;
      const last = pieces.map(() => -1);
      const paint = () => {
        const at = state.p * total;
        pieces.forEach((piece, i) => {
          const t = clamp01((at - i * stagger) / SPAN);
          if (t === last[i]) return;
          last[i] = t;
          piece.style.opacity = t >= 1 ? '' : (baseOpacity + (1 - baseOpacity) * t).toFixed(3);
          piece.style.filter = blur && t < 1 ? `blur(${(blur * (1 - t)).toFixed(2)}px)` : '';
        });
        if (accentWords.length && state.p > 0.97) drawStroke();
      };
      pieces.forEach((p) => (p.style.willChange = 'opacity, filter'));
      paint();
      gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: paint,
        scrollTrigger: {
          trigger: el,
          start: () => `top bottom-=${0.15 * Math.min(el.offsetHeight, innerHeight)}`,
          end: 'center 45%',
          scrub: true,
        },
      });
      return () => {
        pieces.forEach((p) => {
          p.style.opacity = '';
          p.style.filter = '';
          p.style.willChange = '';
        });
      };
    });
    // Reduced motion: no fade, but the marker is still there.
    mm.add('(prefers-reduced-motion: reduce)', () => {
      strokeRef.current?.closest('svg')?.classList.add('on', 'static');
    });
    return () => mm.revert();
  }, [text, accent, baseOpacity, blur, stagger]);

  return (
    <h2 ref={ref} className={`scroll-reveal ${className}`} aria-label={`${text} ${accent}`.trim()}>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="sr-piece">{w}</span>{' '}
          </span>
        ))}
        {accentWords.length > 0 && (
          <em className="sr-accent">
            <svg className="sr-mark" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true">
              <path ref={strokeRef} d="M6 27 C 60 19, 118 31, 178 23 S 262 19, 296 25" />
            </svg>
            {accentWords.map((w, i) => (
              <span key={i}>
                <span className="sr-piece">{w}</span>
                {i < accentWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </em>
        )}
      </span>
    </h2>
  );
}
