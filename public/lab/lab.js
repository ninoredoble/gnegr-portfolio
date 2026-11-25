// Shared notes layer for the Lab scene pages: a way back to the Lab, a notes card that can be
// folded away, and a small toolbar. Each page's notes.js fills them in through window.Lab.
(function () {
  if (/[?&]shot\b/.test(location.search)) document.documentElement.classList.add('lab-shot');

  const icons = {
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="m16 9 6 6M22 9l-6 6"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
  };

  const store = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch {}
    },
  };

  /** Find one of the template's own buttons by its label or text (they stay in the page, hidden). */
  function templateButton(label) {
    const want = label.toLowerCase();
    return [...document.querySelectorAll('#standalone-root button')].find((b) => {
      const names = [b.getAttribute('aria-label') || '', b.textContent || ''].map((x) => x.trim().toLowerCase());
      return names.some((name) => name === want || name.startsWith(want));
    });
  }

  function el(tag, attrs, html) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
    if (html != null) n.innerHTML = html;
    return n;
  }

  function mount({ title, lede, body, tools = [] }) {
    const shell = el('div', { class: 'lab-shell' });

    shell.append(el('a', { class: 'lab-back', href: '/lab/' }, '← Lab <span>Niño Redoble</span>'));

    const slug = document.body.dataset.lab;
    const narrow = matchMedia('(max-width: 640px)').matches;
    const saved = store.get(`lab-notes-${slug}`);
    const open = saved ? saved === 'open' : !narrow;

    const notes = el('section', { class: `lab-notes${open ? '' : ' closed'}`, 'aria-labelledby': 'lab-title' });
    const head = el('div', { class: 'lab-notes-head' });
    head.append(el('h1', { class: 'lab-title', id: 'lab-title' }, title.toUpperCase().replace('°', '<span class="lab-deg">°</span>')));
    const toggle = el('button', { class: 'lab-toggle', type: 'button', 'aria-expanded': String(open), 'aria-controls': 'lab-body' }, open ? 'Hide' : 'Notes');
    head.append(toggle);
    notes.append(head);
    if (lede) notes.append(el('p', { class: 'lab-lede' }, lede));
    const bodyEl = el('div', { class: 'lab-body', id: 'lab-body' });
    if (typeof body === 'string') bodyEl.innerHTML = body;
    else if (body) bodyEl.append(body);
    notes.append(bodyEl);
    toggle.addEventListener('click', () => {
      const nowOpen = notes.classList.toggle('closed') === false;
      toggle.setAttribute('aria-expanded', String(nowOpen));
      toggle.textContent = nowOpen ? 'Hide' : 'Notes';
      store.set(`lab-notes-${slug}`, nowOpen ? 'open' : 'closed');
    });
    shell.append(notes);

    if (tools.length) {
      const bar = el('div', { class: 'lab-tools', role: 'toolbar', 'aria-label': 'Scene' });
      for (const t of tools) bar.append(t);
      shell.append(bar);
    }
    document.body.append(shell);
    return bodyEl;
  }

  /** A toggle that presses one of the template's hidden buttons. */
  function toggleTool({ label, on, off, iconOn, iconOff, pressed = false, target }) {
    const b = el('button', { type: 'button', 'aria-pressed': String(pressed), 'aria-label': label });
    const paint = () => {
      const p = b.getAttribute('aria-pressed') === 'true';
      b.innerHTML = `${icons[p ? iconOn : iconOff]}<span>${p ? on : off}</span>`;
    };
    paint();
    b.addEventListener('click', () => {
      const t = templateButton(target);
      if (t) t.click();
      b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
      paint();
    });
    return b;
  }

  /** The Motion toggle, shared by the scenes that have one. */
  function motionTool() {
    return toggleTool({ label: 'Pause motion', on: 'Paused', off: 'Pause', iconOn: 'play', iconOff: 'pause', target: 'Motion' });
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  window.Lab = { mount, el, icons, toggleTool, motionTool, templateButton, ready, store };
})();
