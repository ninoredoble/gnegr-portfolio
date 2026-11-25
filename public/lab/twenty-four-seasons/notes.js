// 24 Seasons: which of Japan's 24 solar terms (nijūshi sekki) it is right now. Each term starts
// when the sun reaches a multiple of 15° along the ecliptic, computed here from the date.
Lab.ready(() => {
  const terms = [
    ['Risshun', '立春', 'Spring begins', 'The old calendar counted spring from here, while it was still deep in the cold.'],
    ['Usui', '雨水', 'Rain water', 'Snow turns to rain, and the ice starts to melt.'],
    ['Keichitsu', '啓蟄', 'Insects wake', 'Insects that wintered underground start to stir.'],
    ['Shunbun', '春分', 'Spring equinox', 'Day and night are about equal. It’s a public holiday in Japan.'],
    ['Seimei', '清明', 'Clear and bright', 'Everything looks fresh and clean. Cherry blossoms are out across much of Japan.'],
    ['Kokuu', '穀雨', 'Grain rain', 'Spring rain soaks the newly sown fields.'],
    ['Rikka', '立夏', 'Summer begins', 'New leaves everywhere, and the first warm days.'],
    ['Shōman', '小満', 'Lesser fullness', 'Plants and grain fill out.'],
    ['Bōshu', '芒種', 'Grain in ear', 'Time to plant rice. The rainy season starts around now.'],
    ['Geshi', '夏至', 'Summer solstice', 'The longest day of the year, usually in the middle of the rains.'],
    ['Shōsho', '小暑', 'Lesser heat', 'The rainy season ends and the heat begins.'],
    ['Taisho', '大暑', 'Greater heat', 'The hottest stretch of the year.'],
    ['Risshū', '立秋', 'Autumn begins', 'Still hot, but summer greetings now speak of the “lingering heat”.'],
    ['Shosho', '処暑', 'Heat eases', 'The heat starts to let up, and typhoons are most likely.'],
    ['Hakuro', '白露', 'White dew', 'Nights cool enough for dew to form on the grass.'],
    ['Shūbun', '秋分', 'Autumn equinox', 'Day and night are even again. Families visit their ancestors’ graves this week.'],
    ['Kanro', '寒露', 'Cold dew', 'The dew turns cold, and wild geese arrive.'],
    ['Sōkō', '霜降', 'Frost falls', 'The first frost in the mountains, and the leaves begin to turn.'],
    ['Rittō', '立冬', 'Winter begins', 'Shorter days and the first cold winds.'],
    ['Shōsetsu', '小雪', 'Light snow', 'The first light snow on the peaks.'],
    ['Taisetsu', '大雪', 'Heavy snow', 'Snow settles in the mountains and the north.'],
    ['Tōji', '冬至', 'Winter solstice', 'The shortest day. People take yuzu baths, with the citrus floating in the tub.'],
    ['Shōkan', '小寒', 'Lesser cold', 'The start of “kan”, the coldest month of the year.'],
    ['Daikan', '大寒', 'Greater cold', 'The coldest time of year. It ends the day before spring begins.'],
  ];
  const seasonColour = (i) => ['#f2c4cd', '#9cc3a5', '#e8876f', '#bccde2'][Math.floor(i / 6)];

  // The sun's apparent ecliptic longitude, good to about a hundredth of a degree.
  function sunLongitude(date) {
    const n = date.getTime() / 864e5 + 2440587.5 - 2451545.0;
    const L = 280.46 + 0.9856474 * n;
    const g = (357.528 + 0.9856003 * n) * (Math.PI / 180);
    return (((L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360) + 360) % 360;
  }
  const termAt = (date) => {
    const pos = (sunLongitude(date) - 315 + 360) % 360;
    return { i: Math.floor(pos / 15), frac: (pos % 15) / 15 };
  };
  // When does the term after this one begin? Step forward, then narrow down to the hour.
  function nextStart(from) {
    const start = termAt(from).i;
    let t = from.getTime();
    while (termAt(new Date(t)).i === start) t += 864e5;
    let lo = t - 864e5;
    let hi = t;
    while (hi - lo > 36e5) {
      const mid = (lo + hi) / 2;
      if (termAt(new Date(mid)).i === start) lo = mid;
      else hi = mid;
    }
    return new Date(hi);
  }

  const now = new Date();
  const { i: nowI, frac } = termAt(now);
  const next = nextStart(now);
  const daysLeft = Math.ceil((next - now) / 864e5);

  // The wheel: 24 arcs, spring at the top, going clockwise.
  const R = 92;
  const r = 66;
  const C = 110;
  const pt = (deg, rr) => [C + rr * Math.sin((deg * Math.PI) / 180), C - rr * Math.cos((deg * Math.PI) / 180)];
  const arc = (k) => {
    const a0 = k * 15 + 0.8;
    const a1 = (k + 1) * 15 - 0.8;
    const [x0, y0] = pt(a0, R);
    const [x1, y1] = pt(a1, R);
    const [x2, y2] = pt(a1, r);
    const [x3, y3] = pt(a0, r);
    return `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r} ${r} 0 0 0 ${x3} ${y3} Z`;
  };
  const [mx, my] = pt((nowI + frac) * 15, R + 8);

  const body = Lab.el('div');
  body.innerHTML = `
    <div class="ss-wrap">
      <svg class="ss-wheel" viewBox="0 0 220 220" role="group" aria-label="The 24 solar terms of the year">
        ${terms.map((t, k) => `<path d="${arc(k)}" fill="${seasonColour(k)}" data-k="${k}" tabindex="0" role="button" aria-label="${t[0]}, ${t[2]}"><title>${t[0]} · ${t[2]}</title></path>`).join('')}
        <circle cx="${mx}" cy="${my}" r="5" class="ss-now"/>
        <text x="${C}" y="${C - 4}" class="ss-kanji" text-anchor="middle"></text>
        <text x="${C}" y="${C + 22}" class="ss-pos" text-anchor="middle"></text>
      </svg>
      <div class="ss-term" aria-live="polite">
        <p class="ss-when"></p>
        <p class="ss-name"></p>
        <p class="ss-en"></p>
        <p class="ss-note"></p>
      </div>
    </div>
    <p class="lab-small">Spring sits at the top and the year runs clockwise. Tap any segment. Dates come from the sun’s position, computed in your browser.</p>
    <div class="lab-fact"><b>In the scene</b>
      <ul class="ss-facts">
        <li><b>Asagiri</b> means morning mist.</li>
        <li>A <b>torii</b> marks where ordinary ground ends and a shrine’s sacred ground begins.</li>
        <li>Japan’s old wooden <b>pagodas</b> have rarely fallen in earthquakes: a central pillar lets the storeys sway instead of topple.</li>
        <li>Stone <b>lanterns</b> first lit the paths of Buddhist temples, then moved into tea gardens.</li>
        <li>Most city <b>cherry trees</b> are Somei-yoshino, grafted copies of one another, so a whole avenue blooms at once.</li>
      </ul>
    </div>`;

  const style = document.createElement('style');
  style.textContent = `
    .ss-wrap{display:grid;grid-template-columns:150px 1fr;gap:14px;align-items:center;margin-bottom:10px}
    .ss-wheel{width:150px;height:150px;display:block;overflow:visible}
    .ss-wheel path{cursor:pointer;opacity:.5;transition:opacity .2s}
    .ss-wheel path:hover,.ss-wheel path:focus-visible{opacity:.85;outline:none}
    .ss-wheel path.on{opacity:1}
    .ss-now{fill:#fff;stroke:#16202c;stroke-width:2}
    .ss-kanji{font-size:30px;fill:var(--lab-ink);font-family:'Hiragino Mincho ProN','Yu Mincho',serif}
    .ss-pos{font-size:11px;fill:var(--lab-muted);font-family:'Familjen Grotesk',sans-serif}
    .ss-term p{margin:0}
    .ss-when{font-size:12.5px;color:var(--lab-accent);font-weight:700}
    .ss-name{font-family:'Empanada','Arial Narrow',sans-serif;font-size:30px;line-height:1;margin-top:4px!important;text-transform:uppercase}
    .ss-en{font-weight:700;margin-top:2px!important}
    .ss-note{font-size:14px;color:var(--lab-muted);margin-top:6px!important}
    .ss-facts{margin:8px 0 0;padding:0;list-style:none;display:grid;gap:8px;font-size:14px}.ss-facts li{padding-left:14px;position:relative}.ss-facts li::before{content:'';position:absolute;left:0;top:.6em;width:6px;height:6px;background:var(--lab-accent)}
    .ss-facts b{display:inline;margin:0;font-size:inherit}
    @media (max-width:640px){.ss-wrap{grid-template-columns:120px 1fr}.ss-wheel{width:120px;height:120px}}`;
  document.head.append(style);

  const fmtDate = (d) => d.toLocaleDateString('en-PH', { day: 'numeric', month: 'long' });
  const paths = [...body.querySelectorAll('.ss-wheel path')];
  function show(k) {
    const t = terms[k];
    paths.forEach((p, j) => p.classList.toggle('on', j === k));
    body.querySelector('.ss-kanji').textContent = t[1];
    body.querySelector('.ss-pos').textContent = `${k + 1} of 24`;
    body.querySelector('.ss-when').textContent =
      k === nowI ? `Now · ${daysLeft} day${daysLeft === 1 ? '' : 's'} until ${terms[(nowI + 1) % 24][0]}` : k === (nowI + 1) % 24 ? `Next · from ${fmtDate(next)}` : 'Another time of year';
    body.querySelector('.ss-name').textContent = t[0];
    body.querySelector('.ss-en').textContent = t[2];
    body.querySelector('.ss-note').textContent = t[3];
  }
  paths.forEach((p) => {
    const k = Number(p.dataset.k);
    p.addEventListener('click', () => show(k));
    p.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        show(k);
      }
    });
  });
  show(nowI);

  Lab.mount({
    title: '24 Seasons',
    lede: 'Japan’s old calendar splits the year into 24 short seasons of about fifteen days. This is the one we’re in.',
    body,
    tools: [
      Lab.toggleTool({ label: 'Sound', on: 'Sound on', off: 'Sound', iconOn: 'sound', iconOff: 'mute', target: 'Audio' }),
      Lab.motionTool(),
    ],
  });
});
