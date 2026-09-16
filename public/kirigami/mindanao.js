/* Mindanao additions for the KIRIGAMI scene (MIT, Famanias). Additive only:
   nothing in the original scene is removed or recoloured. Each piece is
   appended inside an existing depth layer so it inherits that layer's
   unfold, parallax and fold animation. Colours come from the scene. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var SH = 'rgba(77,41,38,0.28)'; // paper shadow, from the scene's #4D2926

  var eagle =
    // Philippine eagle, soaring: pale shaggy crest, dark wings with a light band, fan tail.
    '<g class="mdn-eagle" transform="translate(1092 204) scale(1.35)"><g class="mdn-float">' +
    '<g fill="' + SH + '" transform="translate(3 4)">' +
    '<path d="M -4 -2 C -16 -10 -30 -18 -48 -22 L -44 -18 L -52 -16 L -44 -13 L -50 -9 L -40 -8 C -28 -6 -16 -2 -6 2 Z"/>' +
    '<path d="M 4 -2 C 14 -12 26 -22 42 -28 L 39 -23 L 47 -22 L 39 -18 L 45 -14 L 35 -13 C 24 -8 14 -3 6 2 Z"/>' +
    '<path d="M -16 -1 C -10 -5 6 -5 14 -2 L 24 -5 L 26 0 L 24 5 L 14 2 C 6 5 -10 5 -16 1 Z"/></g>' +
    '<path fill="#7B3E3B" d="M -4 -2 C -16 -10 -30 -18 -48 -22 L -44 -18 L -52 -16 L -44 -13 L -50 -9 L -40 -8 C -28 -6 -16 -2 -6 2 Z"/>' +
    '<path fill="#7B3E3B" d="M 4 -2 C 14 -12 26 -22 42 -28 L 39 -23 L 47 -22 L 39 -18 L 45 -14 L 35 -13 C 24 -8 14 -3 6 2 Z"/>' +
    '<path fill="#B69676" d="M -8 0 C -18 -6 -28 -10 -38 -12 L -34 -9 C -24 -6 -16 -3 -8 2 Z M 8 0 C 16 -7 24 -12 32 -16 L 30 -12 C 22 -8 15 -4 8 2 Z"/>' +
    '<path fill="#5C4330" d="M -16 -1 C -10 -5 6 -5 14 -2 L 24 -5 L 26 0 L 24 5 L 14 2 C 6 5 -10 5 -16 1 Z"/>' +
    '<path fill="#B69676" d="M -19 -3 L -24 -9 L -19 -6 L -20 -11 L -15 -6 L -14 -9 L -12 -4 Z"/>' +
    '<circle cx="-17" cy="-1" r="4.4" fill="#F3DFC7"/>' +
    '<path fill="#3E2C20" d="M -21 -1 C -24 -1 -26 1 -25 3 L -21 1 Z"/>' +
    '</g></g>';

  function palm(x, y, s, flip) {
    var f = flip ? -1 : 1;
    return '<g class="mdn-palm" transform="translate(' + x + ' ' + y + ') scale(' + (s * f) + ' ' + s + ')"><g class="mdn-sway">' +
      '<path fill="' + SH + '" transform="translate(4 3)" d="M -4 0 C -2 -40 6 -80 18 -118 L 24 -116 C 14 -80 6 -40 4 0 Z"/>' +
      '<path fill="#816247" d="M -4 0 C -2 -40 6 -80 18 -118 L 24 -116 C 14 -80 6 -40 4 0 Z"/>' +
      '<g stroke="#5C4330" stroke-width="1.4"><path d="M -3 -14 L 4 -14"/><path d="M -1 -32 L 6 -31"/><path d="M 2 -50 L 9 -49"/><path d="M 5 -68 L 12 -66"/><path d="M 9 -86 L 16 -84"/><path d="M 13 -102 L 20 -100"/></g>' +
      '<g transform="translate(21 -118)">' +
      '<path fill="#3E4F37" d="M0 0 C 18 -10 44 -8 62 10 C 40 2 20 2 0 4 Z"/>' +
      '<path fill="#3E4F37" d="M0 0 C -18 -12 -44 -10 -60 6 C -38 0 -18 0 0 4 Z"/>' +
      '<path fill="#56684A" d="M0 0 C 14 -22 36 -30 56 -26 C 34 -20 16 -10 0 2 Z"/>' +
      '<path fill="#56684A" d="M0 0 C -12 -24 -32 -34 -52 -30 C -30 -22 -14 -12 0 2 Z"/>' +
      '<path fill="#778764" d="M0 0 C 6 -24 4 -40 -4 -50 C 6 -34 6 -18 2 0 Z"/>' +
      '<path fill="#778764" d="M0 0 C 24 4 40 20 44 36 C 30 20 16 10 0 4 Z"/>' +
      '<path fill="#778764" d="M0 0 C -22 6 -36 22 -38 38 C -26 22 -12 12 0 4 Z"/>' +
      '<circle cx="-4" cy="6" r="4.5" fill="#5C4330"/><circle cx="5" cy="7" r="4.5" fill="#5C4330"/><circle cx="0" cy="12" r="4" fill="#3E2C20"/>' +
      '</g></g></g>';
  }

  var vinta =
    '<g class="mdn-vinta" transform="translate(752 628) scale(0.62)"><g class="mdn-bob">' +
    '<path fill="' + SH + '" transform="translate(3 4)" d="M -62 0 L 66 0 C 58 10 40 14 2 14 C -34 14 -54 10 -62 0 Z"/>' +
    '<path stroke="#B69676" stroke-width="3" fill="none" d="M -40 4 L -50 20 L 54 20 L 44 4"/>' +
    '<path fill="#7B3E3B" d="M -62 0 L 66 0 C 58 10 40 14 2 14 C -34 14 -54 10 -62 0 Z"/>' +
    '<path fill="#4D2926" d="M -62 0 L 66 0 L 62 3 L -58 3 Z"/>' +
    '<path stroke="#5C4330" stroke-width="3" d="M -2 0 L -10 -96"/>' +
    '<clipPath id="mdn-sail-clip"><path d="M -6 -6 L -16 -100 C 10 -108 40 -104 62 -92 L 52 -6 Z"/></clipPath>' +
    '<path fill="' + SH + '" transform="translate(4 3)" d="M -6 -6 L -16 -100 C 10 -108 40 -104 62 -92 L 52 -6 Z"/>' +
    '<g clip-path="url(#mdn-sail-clip)">' +
    '<rect x="-20" y="-112" width="16" height="110" fill="#C46864"/>' +
    '<rect x="-4" y="-112" width="14" height="110" fill="#F3DFC7"/>' +
    '<rect x="10" y="-112" width="14" height="110" fill="#E8A564"/>' +
    '<rect x="24" y="-112" width="14" height="110" fill="#9EB084"/>' +
    '<rect x="38" y="-112" width="14" height="110" fill="#C46864"/>' +
    '<rect x="52" y="-112" width="14" height="110" fill="#F3DFC7"/>' +
    '</g>' +
    '<path stroke="#5C4330" stroke-width="2.5" fill="none" d="M -16 -100 C 10 -108 40 -104 62 -92"/>' +
    '</g></g>';

  var css =
    '@keyframes mdnFloat{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(-14px,-6px) rotate(-3deg)}}' +
    '@keyframes mdnSway{0%,100%{transform:rotate(0)}50%{transform:rotate(-2.2deg)}}' +
    '@keyframes mdnBob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-2px) rotate(0.8deg)}}' +
    '.mdn-float{animation:mdnFloat 9s ease-in-out infinite;transform-box:fill-box;transform-origin:center}' +
    '.mdn-sway{animation:mdnSway 6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}' +
    '.mdn-bob{animation:mdnBob 3.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}' +
    '@media (prefers-reduced-motion: reduce){.mdn-float,.mdn-sway,.mdn-bob{animation:none}}';

  function add(sel, markup) {
    var host = document.querySelector(sel);
    if (!host || host.querySelector('[data-mdn]')) return !!host;
    var tmp = document.createElementNS(NS, 'g');
    tmp.setAttribute('data-mdn', '1');
    tmp.innerHTML = markup;
    host.appendChild(tmp);
    return true;
  }

  function apply() {
    var ok = add('[data-depth-layer="2"]', eagle);
    ok = add('#kirigami-river-valley', vinta) && ok;
    ok = add('#kirigami-mid-trees', palm(612, 528, 0.95, false) + palm(652, 520, 0.78, true) + palm(1178, 486, 0.7, false)) && ok;
    return ok;
  }

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  // Only touch the scene after React has hydrated it: extra nodes before that make
  // hydration fail and React re-renders the whole scene from scratch.
  var started = false;
  function start() {
    if (started) return;
    started = true;
    apply();
    // React may re-render a layer; put the pieces back if they go missing.
    new MutationObserver(function () { apply(); }).observe(document.getElementById('standalone-root') || document.body, { childList: true, subtree: true });
  }
  if (window.__kirigamiReady) start();
  else {
    window.addEventListener('kirigami:ready', start, { once: true });
    setTimeout(start, 5000); // the scene script failed or is very slow: add the pieces anyway
  }
})();
