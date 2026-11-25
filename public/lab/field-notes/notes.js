// Field Notes: a botanist's margin note for each stage of the timelapse, and a print to keep.
Lab.ready(() => {
  const notes = {
    'phase-01': ['The empty canvas', 'Rag paper, made from cotton and linen, can last for centuries. Cheap wood-pulp paper yellows and crumbles because of the acid left in it.'],
    'phase-02': ['First ink marks', 'Roots find “down” with tiny starch grains in their tips that settle like sand in a jar, and the root grows toward them.'],
    'phase-03': ['Pigment bleed', 'Watercolour spreads because paper fibres pull water along by capillary action, and the pigment rides with it.'],
    'phase-04': ['Bud formation', 'The green leaves wrapped around a bud are sepals. Together they’re the calyx, and they guard the flower until it opens.'],
    'phase-05': ['The bloom', 'A peony can keep flowering in the same spot for decades. Some plants are over a hundred years old.'],
    'phase-06': ['Collage and engraving', 'For centuries, botanical plates were printed from engraved copper and then coloured by hand, one copy at a time.'],
    'phase-07': ['Final marks', 'Iron gall ink, the standard writing ink in Europe for over a thousand years, slowly eats through the paper it’s written on.'],
    'phase-08': ['Complete', 'Petals fall on cue: the plant seals off a layer of cells at the base of each one, the abscission zone, and lets go.'],
  };
  const order = Object.keys(notes);

  const body = Lab.el('div');
  body.innerHTML = `
    <ol class="fn-steps" aria-label="Stages"></ol>
    <div class="fn-note" aria-live="polite">
      <p class="fn-num lab-num"></p>
      <p class="fn-head"></p>
      <p class="fn-text"></p>
    </div>
    <p class="lab-small" style="margin-top:14px">The notes follow the painting. Use the timeline at the top left to scrub, pause or skip to the end.</p>`;

  const style = document.createElement('style');
  style.textContent = `
    .fn-steps{list-style:none;margin:0 0 14px;padding:0;display:grid;grid-template-columns:repeat(8,1fr);gap:4px}
    .fn-steps button{width:100%;height:28px;border:1px solid var(--lab-line);background:transparent;font-size:11px;font-variant-numeric:tabular-nums;color:var(--lab-muted)}
    .fn-steps .seen button{color:var(--lab-ink)}
    .fn-steps .now button{background:var(--lab-accent);border-color:var(--lab-accent);color:var(--lab-on-accent)}
    .fn-note{border-top:2px solid var(--lab-accent);padding-top:12px}
    .fn-num{margin:0;font-size:12.5px;color:var(--lab-accent);font-weight:700}
    .fn-head{margin:2px 0 6px;font-family:'Empanada','Arial Narrow',sans-serif;font-size:28px;line-height:1;text-transform:uppercase}
    .fn-text{margin:0;font-size:16px;line-height:1.5}
    .fn-note.ink .fn-text{animation:fn-ink .6s ease both}
    @keyframes fn-ink{from{opacity:0;filter:blur(3px)}to{opacity:1;filter:none}}
    @media (prefers-reduced-motion: reduce){.fn-note.ink .fn-text{animation:none}}`;
  document.head.append(style);

  const steps = body.querySelector('.fn-steps');
  const note = body.querySelector('.fn-note');
  const seen = new Set();
  order.forEach((id, i) => {
    const li = Lab.el('li', {}, `<button type="button" aria-label="${notes[id][0]}">${String(i + 1).padStart(2, '0')}</button>`);
    // Jump the painting to that stage through the template's own timeline buttons.
    li.querySelector('button').addEventListener('click', () => {
      const t = [...document.querySelectorAll('#standalone-root button[title]')].find((b) => b.title.startsWith(`0${i + 1}.`));
      if (t) t.click();
      else show(id);
    });
    steps.append(li);
  });

  let current;
  function show(id) {
    if (!notes[id] || id === current) return;
    current = id;
    seen.add(id);
    const i = order.indexOf(id);
    [...steps.children].forEach((li, j) => {
      li.classList.toggle('now', j === i);
      li.classList.toggle('seen', seen.has(order[j]));
    });
    note.querySelector('.fn-num').textContent = `Stage ${String(i + 1).padStart(2, '0')} of 08`;
    note.querySelector('.fn-head').textContent = notes[id][0];
    note.querySelector('.fn-text').textContent = notes[id][1];
    note.classList.remove('ink');
    void note.offsetWidth;
    note.classList.add('ink');
  }

  const stage = document.querySelector('[data-testid="botanical-stage"]');
  if (stage) {
    show(stage.dataset.phase);
    new MutationObserver(() => show(stage.dataset.phase)).observe(stage, { attributes: true, attributeFilter: ['data-phase'] });
  } else show('phase-01');

  // Keep a print: flatten the paper, the ink layers and the pigment into one PNG.
  async function print() {
    const w = innerWidth;
    const h = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const out = document.createElement('canvas');
    out.width = Math.round(w * dpr);
    out.height = Math.round(h * dpr);
    const g = out.getContext('2d');
    g.scale(dpr, dpr);
    g.fillStyle = '#E9E1D3';
    g.fillRect(0, 0, w, h);
    const layers = [...document.querySelectorAll('#standalone-root canvas, #standalone-root svg, #standalone-root img')].filter((n) => {
      if (n.closest('aside, button')) return false;
      const r = n.getBoundingClientRect();
      return r.width > 200 && r.height > 200 && getComputedStyle(n).visibility !== 'hidden';
    });
    for (const n of layers) {
      const r = n.getBoundingClientRect();
      const op = parseFloat(getComputedStyle(n).opacity) || 1;
      g.globalAlpha = op;
      try {
        if (n instanceof HTMLCanvasElement || n instanceof HTMLImageElement) g.drawImage(n, r.left, r.top, r.width, r.height);
        else {
          const clone = n.cloneNode(true);
          clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          clone.setAttribute('width', r.width);
          clone.setAttribute('height', r.height);
          const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
          const img = new Image();
          await new Promise((ok, no) => {
            img.onload = ok;
            img.onerror = no;
            img.src = url;
          });
          g.drawImage(img, r.left, r.top, r.width, r.height);
          URL.revokeObjectURL(url);
        }
      } catch {}
    }
    g.globalAlpha = 1;
    // A small specimen label in the corner.
    const label = `Field Notes · pressed ${new Date().toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    g.font = '600 13px "Familjen Grotesk", system-ui, sans-serif';
    const lw = g.measureText(label).width + 28;
    g.fillStyle = 'rgba(236,228,214,0.92)';
    g.fillRect(w - lw - 24, h - 58, lw, 34);
    g.strokeStyle = '#722C3B';
    g.strokeRect(w - lw - 24 + 0.5, h - 58 + 0.5, lw - 1, 33);
    g.fillStyle = '#1C191A';
    g.fillText(label, w - lw - 10, h - 36);
    out.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'field-notes-print.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }, 'image/png');
  }

  const keep = Lab.el('button', { type: 'button' }, `${Lab.icons.download}<span>Keep a print</span>`);
  keep.addEventListener('click', print);

  Lab.mount({
    title: 'Field Notes',
    lede: 'An ink-and-pigment flower paints itself in 18 seconds. A botanist’s note follows every stage.',
    body,
    tools: [keep],
  });
});
