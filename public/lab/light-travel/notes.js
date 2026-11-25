// Light Travel: the sunlight that left the Sun when you opened the page, and how far it's got.
Lab.ready(() => {
  const SECONDS_PER_AU = 499.005; // light time for one astronomical unit
  const worlds = [
    { name: 'Earth', au: 1.0 },
    { name: 'Jupiter', au: 5.203 },
    { name: 'Saturn', au: 9.537 },
    { name: 'Uranus', au: 19.19 },
    { name: 'Neptune', au: 30.07 },
  ];
  const facts = [
    ["Saturn would float.", "Its average density is lower than water's."],
    ['Wide, and very thin.', "Saturn's main rings stretch about 280,000 km across, yet in most places they're only around ten metres thick."],
    ['Every giant has rings.', "Jupiter, Uranus and Neptune have them too. Saturn's are just the brightest, because they're mostly water ice."],
    ['A short day.', 'Saturn spins once about every 10.7 hours, so its days are less than half as long as ours.'],
    ['On its side.', 'Uranus is tilted about 98 degrees, so each pole gets around 42 years of sunlight, then 42 years of night.'],
    ['The windiest place.', 'Neptune has the fastest winds measured on any planet, over 2,000 km/h.'],
    ['Mostly empty.', 'Spacecraft cross the asteroid belt without steering around anything: the rocks are usually hundreds of thousands of kilometres apart.'],
    ['Moons by the hundred.', 'Saturn has more than 270 known moons, more than any other planet.'],
    ['Old moonlight.', 'Moonlight is sunlight that took about 8 minutes to reach the Moon and 1.3 seconds more to reach you.'],
  ];

  const body = Lab.el('div');
  body.innerHTML = `
    <ol class="lt-list" aria-live="off"></ol>
    <p class="lab-small">Average distances. The real ones change as the planets move.</p>
    <div class="lab-fact" aria-live="polite"><b></b><span></span></div>
    <div class="lab-row">
      <button type="button" class="lab-btn solid lt-next">Another fact</button>
      <span class="lab-small lt-count"></span>
    </div>
    <p class="lab-small" style="margin-top:14px">The planet in the scene is an artwork, not a portrait of a real one.</p>`;

  const style = document.createElement('style');
  style.textContent = `
    .lt-list{list-style:none;margin:0 0 10px;padding:0;display:grid;gap:10px}
    .lt-list li{display:grid;grid-template-columns:72px 1fr auto;gap:10px;align-items:center;font-size:14px}
    .lt-list b{font-weight:700}
    .lt-bar{height:6px;background:var(--lab-chip);position:relative;overflow:hidden}
    .lt-bar i{position:absolute;inset:0 auto 0 0;background:var(--lab-accent);width:0}
    .lt-list .done .lt-bar i{background:#f4d58d}
    .lt-time{min-width:7ch;text-align:right;color:var(--lab-muted)}
    .lt-list .done .lt-time{color:#f4d58d}`;
  document.head.append(style);

  const list = body.querySelector('.lt-list');
  const rows = worlds.map((w) => {
    const li = Lab.el('li', {}, `<b>${w.name}</b><span class="lt-bar"><i></i></span><span class="lt-time lab-num"></span>`);
    list.append(li);
    return { ...w, li, bar: li.querySelector('i'), time: li.querySelector('.lt-time'), secs: w.au * SECONDS_PER_AU };
  });

  const fmt = (s) => {
    s = Math.max(0, Math.ceil(s));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = String(s % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
  };

  const start = performance.now();
  const tick = () => {
    const t = (performance.now() - start) / 1000;
    for (const r of rows) {
      const left = r.secs - t;
      r.bar.style.width = `${Math.min(100, (t / r.secs) * 100)}%`;
      if (left <= 0) {
        r.li.classList.add('done');
        r.time.textContent = 'arrived';
      } else r.time.textContent = fmt(left);
    }
  };
  tick();
  setInterval(tick, 1000);

  let i = Math.floor(Math.random() * facts.length);
  const factB = body.querySelector('.lab-fact b');
  const factS = body.querySelector('.lab-fact span');
  const count = body.querySelector('.lt-count');
  const show = () => {
    factB.textContent = facts[i][0];
    factS.textContent = facts[i][1];
    count.textContent = `${i + 1} of ${facts.length}`;
  };
  show();
  body.querySelector('.lt-next').addEventListener('click', () => {
    i = (i + 1) % facts.length;
    show();
  });

  Lab.mount({
    title: 'Light Travel',
    lede: 'The sunlight that left the Sun when you opened this page is still on its way out. Here’s where it is.',
    body,
    tools: [Lab.motionTool()],
  });
});
