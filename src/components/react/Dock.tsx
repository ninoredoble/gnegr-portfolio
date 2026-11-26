/*! @license
 * Dock, adapted from React Bits (reactbits.dev) <Dock />, Motion version.
 * Copyright (c) 2026 David Haz. MIT + Commons Clause License Condition v1.0: permission is hereby
 * granted, free of charge, to use, copy, modify, merge, publish, and distribute the Software as
 * part of an application, website, or product, provided the components themselves are not sold,
 * sublicensed or redistributed. The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS",
 * WITHOUT WARRANTY OF ANY KIND.
 *
 * Changes for this site: items are real links; the dock slides in once the page's own nav has
 * scrolled away; the current section is marked; paper styling; labels show under the icons on
 * phones (no hover there); magnification only follows a mouse.
 */
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import './dock.css';

type Item = { href: string; label: string; section?: string; icon: ReactNode; primary?: boolean };

const I = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const ITEMS: Item[] = [
  { href: '/#about', label: 'About', section: 'about', icon: I('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0') },
  { href: '/#work', label: 'Work', section: 'work', icon: I('M3 7h18v13H3zM8 7V4h8v3M3 13h18') },
  { href: '/lab/', label: 'Lab', section: 'lab', icon: I('M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7 15h10') },
  { href: '/#contact', label: 'Contact', section: 'contact', icon: I('M3 5h18v14H3zM3 6l9 7 9-7') },
  { href: '/resume/', label: 'Resume', section: 'resume', icon: I('M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6'), primary: true },
];

const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };
const BASE = 46;
const PEAK = 66;
const DISTANCE = 160;

function DockItem({ item, mouseX, active }: { item: Item; mouseX: MotionValue<number>; active: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const dist = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect() ?? { x: 0, width: BASE };
    return x - r.x - BASE / 2;
  });
  const size = useSpring(useTransform(dist, [-DISTANCE, 0, DISTANCE], [BASE, PEAK, BASE]), SPRING);

  return (
    <motion.a
      ref={ref}
      href={item.href}
      style={{ width: size, height: size }}
      className={`dock-item${active ? ' is-active' : ''}${item.primary ? ' is-primary' : ''}`}
      aria-current={active ? 'page' : undefined}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <span className="dock-icon">{item.icon}</span>
      <span className="dock-name">{item.label}</span>
      <motion.span
        className="dock-label"
        role="tooltip"
        initial={false}
        animate={hover ? { opacity: 1, y: -8 } : { opacity: 0, y: 0 }}
        transition={{ duration: 0.18 }}
        aria-hidden="true"
      >
        {item.label}
      </motion.span>
      {active && <span className="dock-dot" aria-hidden="true" />}
    </motion.a>
  );
}

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Slide in once the page's own nav (the hero, or the top header) is out of view.
  useEffect(() => {
    const sentinel = document.querySelector('[data-dock-sentinel]');
    if (!sentinel) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Mark where you are: the section in the middle of the screen on home, else the page.
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/lab')) return setActive('lab');
    if (path.startsWith('/resume')) return setActive('resume');
    if (path.startsWith('/work/')) return setActive('work');
    const ids = ['about', 'work', 'contact'];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <motion.nav
      className="dock-outer"
      aria-label="Site"
      initial={false}
      animate={shown ? { y: 0, opacity: 1 } : { y: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      style={{ pointerEvents: shown ? undefined : 'none' }}
      aria-hidden={shown ? undefined : true}
      inert={shown ? undefined : true}
    >
      <div
        className="dock-panel"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {ITEMS.map((item) => (
          <DockItem key={item.href} item={item} mouseX={mouseX} active={active === item.section} />
        ))}
      </div>
    </motion.nav>
  );
}
