// Sun at 8°N: the sun's year in Cagayan de Oro, computed in the browser (NOAA's solar formulas).
Lab.ready(() => {
  const CDO = { lat: 8.4542, lon: 124.6319, tz: 8 };
  const rad = Math.PI / 180;
  const YEAR = new Date().getFullYear();
  const DAYS = (YEAR % 4 === 0 && YEAR % 100 !== 0) || YEAR % 400 === 0 ? 366 : 365;

  function sun(doy, lat, lon, tz) {
    const g = ((2 * Math.PI) / DAYS) * (doy - 1);
    const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    const dec =
      0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    const phi = lat * rad;
    const ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(phi) * Math.cos(dec)) - Math.tan(phi) * Math.tan(dec)) / rad;
    const noon = 720 - 4 * lon - eq + tz * 60;
    return { rise: noon - 4 * ha, set: noon + 4 * ha, noon, length: 8 * ha, dec: dec / rad, alt: 90 - Math.abs(lat - dec / rad) };
  }

  const dateOf = (doy) => new Date(YEAR, 0, doy);
  const dayLabel = (doy) => dateOf(doy).toLocaleDateString('en-PH', { day: 'numeric', month: 'long' });
  const clock = (m) => {
    m = Math.round(m);
    const h = Math.floor(m / 60) % 24;
    const mm = String(m % 60).padStart(2, '0');
    return `${((h + 11) % 12) + 1}:${mm} ${h < 12 ? 'am' : 'pm'}`;
  };
  const span = (m) => `${Math.floor(m / 60)} h ${String(Math.round(m % 60)).padStart(2, '0')} min`;

  const year = Array.from({ length: DAYS }, (_, i) => sun(i + 1, CDO.lat, CDO.lon, CDO.tz));
  const longest = year.reduce((a, b, i) => (b.length > year[a].length ? i : a), 0);
  const shortest = year.reduce((a, b, i) => (b.length < year[a].length ? i : a), 0);
  const earliestSet = year.reduce((a, b, i) => (b.set < year[a].set ? i : a), 0);
  const latestRise = year.reduce((a, b, i) => (b.rise > year[a].rise ? i : a), 0);
  const zeroShadow = [];
  for (let i = 1; i < DAYS; i++) if (Math.sign(year[i].dec - CDO.lat) !== Math.sign(year[i - 1].dec - CDO.lat)) zeroShadow.push(i + 1);
  const helsinki = Array.from({ length: DAYS }, (_, i) => sun(i + 1, 60.17, 24.94, 2).length).filter((x) => !Number.isNaN(x));
  const helsinkiSpread = Math.max(...helsinki) - Math.min(...helsinki);

  const now = new Date();
  const today = Math.floor((now - new Date(YEAR, 0, 0)) / 864e5);

  // Day length across the year, as a small area chart.
  const W = 320;
  const H = 64;
  const min = year[shortest].length - 4;
  const max = year[longest].length + 4;
  const x = (i) => (i / (DAYS - 1)) * W;
  const y = (len) => H - ((len - min) / (max - min)) * H;
  const path = year.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d.length).toFixed(1)}`).join(' ');

  const body = Lab.el('div');
  body.innerHTML = `
    <div class="sn-today">
      <p class="sn-date"></p>
      <dl class="sn-grid">
        <div><dt>Sunrise</dt><dd class="lab-num" data-k="rise"></dd></div>
        <div><dt>Sunset</dt><dd class="lab-num" data-k="set"></dd></div>
        <div><dt>Daylight</dt><dd class="lab-num" data-k="len"></dd></div>
        <div><dt>Noon shadow</dt><dd class="lab-num" data-k="shadow"></dd></div>
      </dl>
    </div>
    <svg class="sn-chart" viewBox="0 -6 ${W} ${H + 12}" role="img" aria-label="Daylight in Cagayan de Oro across ${YEAR}: between ${span(year[shortest].length)} and ${span(year[longest].length)}.">
      <path d="${path} L${W} ${H + 6} L0 ${H + 6} Z" class="sn-area"/>
      <path d="${path}" class="sn-line"/>
      ${zeroShadow.map((d) => `<line x1="${x(d - 1)}" x2="${x(d - 1)}" y1="-6" y2="${H + 6}" class="sn-zero"/>`).join('')}
      <line class="sn-mark" y1="-6" y2="${H + 6}"/>
    </svg>
    <label class="sn-slider"><span class="lab-small">Drag through the year</span>
      <input type="range" min="1" max="${DAYS}" value="${today}" aria-label="Day of the year">
    </label>
    <div class="lab-fact"><b>Two noons without a shadow.</b>On ${zeroShadow.map(dayLabel).join(' and ')}, the noon sun stands straight overhead in Cagayan de Oro and shadows all but disappear. Nowhere north of 23.4° ever gets one.</div>
    <div class="lab-fact"><b>The seasons barely move the day here.</b>The longest day (${dayLabel(longest + 1)}) is only ${Math.round(year[longest].length - year[shortest].length)} minutes longer than the shortest (${dayLabel(shortest + 1)}). In Helsinki the gap is about ${Math.round(helsinkiSpread / 60)} hours.</div>
    <div class="lab-fact"><b>The earliest sunset isn't on the solstice.</b>Because Earth's orbit is an oval, the earliest sunset here falls around ${dayLabel(earliestSet + 1)} and the latest sunrise around ${dayLabel(latestRise + 1)}.</div>
    <p class="lab-small" style="margin-top:14px">“Solstice” is Latin for the sun standing still. Times are computed in your browser for ${YEAR}, give or take a minute.</p>`;

  const style = document.createElement('style');
  style.textContent = `
    .sn-date{font-weight:700;font-size:16px;margin:0 0 8px}
    .sn-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin:0}
    .sn-grid dt{font-size:12.5px;color:var(--lab-muted)}
    .sn-grid dd{margin:0;font-weight:700;font-size:17px}
    .sn-chart{display:block;width:100%;height:auto;margin:16px 0 4px;overflow:visible}
    .sn-area{fill:#d9a948;opacity:.22}
    .sn-line{fill:none;stroke:#b8862f;stroke-width:2}
    .sn-zero{stroke:var(--lab-accent);stroke-width:1.5;stroke-dasharray:3 3}
    .sn-mark{stroke:var(--lab-ink);stroke-width:2}
    .sn-slider{display:grid;gap:4px;margin-bottom:4px}
    .sn-slider input{width:100%;accent-color:var(--lab-accent);min-height:28px}`;
  document.head.append(style);

  const input = body.querySelector('input');
  const mark = body.querySelector('.sn-mark');
  const out = (k, v) => (body.querySelector(`[data-k="${k}"]`).textContent = v);
  const render = () => {
    const d = Number(input.value);
    const s = year[d - 1];
    body.querySelector('.sn-date').textContent = d === today ? `Today, ${dayLabel(d)}` : dayLabel(d);
    out('rise', clock(s.rise));
    out('set', clock(s.set));
    out('len', span(s.length));
    // A 1.6 m person at solar noon; the shadow points away from the sun.
    const len = 1.6 / Math.tan(s.alt * rad);
    out('shadow', len < 0.05 ? 'none' : `${len.toFixed(2)} m ${s.dec > CDO.lat ? 'south' : 'north'}`);
    mark.setAttribute('x1', x(d - 1));
    mark.setAttribute('x2', x(d - 1));
  };
  input.addEventListener('input', render);
  render();

  Lab.mount({
    title: 'Sun at 8°N',
    lede: 'A painted desert, and the sun’s year in Cagayan de Oro, where I live. Scroll to move through the canyon.',
    body,
  });

  // The template's own settings button is for template buyers; hide it.
  const own = Lab.templateButton('Controls');
  if (own) own.parentElement.classList.add('lab-hidden');
});
