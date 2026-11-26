// Taped paper notes you can pick up and move (drag physics from Motion, motion.dev).
// They're server-rendered, so they show (and read) the same before this hydrates. Dragging is
// for a mouse or trackpad only: on a touch screen it would swallow the swipe you scroll with.
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import './paper-notes.css';

const NOTES = [
  { text: 'Took Kivora from sketch to App Store.', tone: 'sun', tilt: -4 },
  { text: 'I design it, build it, and break it before your users do.', tone: 'petal', tilt: 3 },
  { text: 'Specs before code. Tests before fixes.', tone: 'sage', tilt: -2 },
];

export default function PaperNotes() {
  const area = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number | null>(null);
  const [moved, setMoved] = useState(false);
  const [canDrag, setCanDrag] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(hover: hover) and (pointer: fine)');
    const on = () => setCanDrag(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <div className={`notes${canDrag ? ' can-drag' : ''}`} ref={area}>
      {NOTES.map((n, i) => (
        <motion.figure
          key={i}
          className={`note note-${n.tone}`}
          style={{ rotate: n.tilt, zIndex: top === i ? 3 : 1 }}
          drag={canDrag}
          dragConstraints={area}
          dragElastic={0.18}
          dragTransition={{ power: 0.25, timeConstant: 220 }}
          whileHover={canDrag ? { y: -4 } : undefined}
          whileDrag={{ scale: 1.05, rotate: 0, cursor: 'grabbing' }}
          onDragStart={() => {
            setTop(i);
            setMoved(true);
          }}
        >
          <span className="tape" aria-hidden="true" />
          <blockquote>{n.text}</blockquote>
          {i === 0 && canDrag && !moved && (
            <figcaption className="hint" aria-hidden="true">
              drag me
              <svg viewBox="0 0 40 24" aria-hidden="true">
                <path d="M2 20 C 12 4, 26 2, 36 8 M30 3 L36 8 L29 12" />
              </svg>
            </figcaption>
          )}
        </motion.figure>
      ))}
    </div>
  );
}
