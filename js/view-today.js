/* Today: clock + stopwatch, the fire-wall day strip, hero (level, XP), the selected day's tasks. */
function topbarHTML() {
  return '<header class="topbar"><div class="brand">' + LOGO + '<div>' + esc(t('appName')) + '<small>' + esc(t('tagline')) + '</small></div></div>' +
    '<div style="display:flex;gap:8px"><button class="icon-btn" data-act="theme" aria-label="' + esc(t('theme')) + '">' + ICONS.theme + '</button>' +
    '<button class="icon-btn" data-act="settings" aria-label="' + esc(t('navSettings')) + '">' + ICONS.settings + '</button></div></header>';
}

/* ---------- streak fire colour: orange → blue → hot pink → (darkening) rose → crimson → red → white (long challenges), orange for short ones ---------- */
const ND_FIRE_STOPS = [
  [0, '#E8420F', '#FF7A1A', '#FFD27A'],
  [.22, '#1F4FE0', '#3D8BFF', '#C4E2FF'],
  [.42, '#E8288A', '#FF4FA3', '#FFD3EA'],
  [.53, '#C2185B', '#F23D86', '#FFC6DD'],
  [.63, '#9C0F3F', '#DC143C', '#FFB9C4'],
  [.75, '#A8000F', '#F01E28', '#FFC0B5'],
  [.88, '#C8D2E0', '#F6F8FC', '#FFFFFF'],
  [1, '#D6DEEA', '#FFFFFF', '#FFFFFF']
];
function ndHex(h) { return [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16)); }
function ndMix(a, b, k) { const x = ndHex(a), y = ndHex(b); return x.map((v, i) => Math.round(v + (y[i] - v) * k)); }
function ndFire(run, goal) {
  const k = Math.max(0, Math.min(1, run / goal));
  let cols;
  if (goal < 21) cols = ND_FIRE_STOPS[0].slice(1).map(ndHex);
  else {
    let i = 0; while (i < ND_FIRE_STOPS.length - 2 && k > ND_FIRE_STOPS[i + 1][0]) i++;
    const A = ND_FIRE_STOPS[i], B = ND_FIRE_STOPS[i + 1], f = (k - A[0]) / (B[0] - A[0]);
    cols = [1, 2, 3].map(j => ndMix(A[j], B[j], Math.max(0, Math.min(1, f))));
  }
  const rgb = c => 'rgb(' + c.join(',') + ')';
  // intensity grows with the streak: bigger flame, brighter glow, more wall light, quicker flicker
  const top = goal >= 21 && k >= .88; // the white tier burns biggest and brightest
  return '--f1:' + rgb(cols[0]) + ';--f2:' + rgb(cols[1]) + ';--f3:' + rgb(cols[2]) + ';--fg:' + cols[1].join(',') +
    ';--fs:' + (top ? 1.14 + .08 * (k - .88) / .12 : 0.82 + 0.34 * k).toFixed(3) + ';--fa:' + (top ? .95 : 0.32 + 0.45 * k).toFixed(3) + ';--fd:' + (2.6 - 1.1 * k).toFixed(2) + 's';
}
const ND_FLAME = '<span class="fl" aria-hidden="true"><span class="fx">' +
  '<svg class="f1" viewBox="0 0 32 40"><path d="M16 0C18 7 27 12 27 24 27 33 22 39 16 39 10 39 5 33 5 25 5 19 8 15 10 12 10 16 12 18 14 19 13 12 14 6 16 0Z"/></svg>' +
  '<svg class="tg tl" viewBox="0 0 32 40"><path d="M9 39C6 35 5 30 7 25 8 28 9 29 10 30 9 26 10 22 12 19 12 24 14 28 15 31 15 35 13 38 9 39Z"/></svg>' +
  '<svg class="tg tr" viewBox="0 0 32 40"><path d="M23 39C26 35 27 30 25 25 24 28 23 29 22 30 23 26 22 22 20 19 20 24 18 28 17 31 17 35 19 38 23 39Z"/></svg>' +
  '<svg class="f2" viewBox="0 0 32 40"><path d="M16 9C18 15 23 19 23 27 23 33 20 37 16 37 12 37 9 33 9 28 9 24 11 22 12 20 12 23 13 25 15 25 14 20 15 14 16 9Z"/></svg>' +
  '<svg class="f3" viewBox="0 0 32 40"><path d="M16 19C17 24 20 27 20 31 20 34 18 36 16 36 14 36 12 34 12 31 12 28 14 25 16 19Z"/></svg></span>' +
  '<i class="em e1"></i><i class="em e2"></i><i class="em e3"></i><i class="em e4"></i><i class="em e5"></i></span>';
/* which colour stage a burning day is in (drives the blue gas-flame look and the white tier's black sparks) */
function ndTier(run, goal) {
  if (goal < 21) return 'orange';
  const k = run / goal;
  return k < .12 ? 'orange' : k < .33 ? 'blue' : k < .5 ? 'pink' : k < .7 ? 'rose' : k < .88 ? 'red' : 'white';
}
/* gas-flame gradients for the blue stage, defined once for every flame */
function ndFireDefs() {
  if (document.getElementById('ndFireDefs')) return;
  document.body.insertAdjacentHTML('beforeend', '<svg id="ndFireDefs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="ndB1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#0716B8"/><stop offset=".45" stop-color="#1D5BFF"/><stop offset=".8" stop-color="#3FB4FF"/><stop offset="1" stop-color="#9BEFFF"/></linearGradient>' +
    '<linearGradient id="ndB2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1640FF"/><stop offset=".5" stop-color="#36A2FF"/><stop offset="1" stop-color="#C8FAFF"/></linearGradient>' +
    '<linearGradient id="ndB3" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7FD8FF"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient></defs></svg>');
}

/* ---------- flames feel motion: they lean against the strip's drag and the page's scroll, then spring upright ---------- */
const NDLEAN = {
  a: 0, va: 0, q: 0, vq: 0, ux: 0, uy: 0, raf: 0, last: 0, sx: null, sy: null, strip: null, tSeen: 0,
  bind(strip) {
    this.strip = strip; this.sx = null;
    if (!strip || ndReduced()) return;
    strip.addEventListener('scroll', () => this.kick(), { passive: true });
    if (!window.__ndLean) { window.__ndLean = 1; addEventListener('scroll', () => this.kick(), { passive: true }); }
  },
  kick() { this.tSeen = performance.now(); if (!this.raf) { this.last = 0; this.raf = requestAnimationFrame(n => this.step(n)); } },
  step(now) {
    this.raf = 0;
    const st = this.strip; if (!st || !st.isConnected) { this.a = this.va = this.q = this.vq = 0; return; }
    const dt = this.last ? Math.min(.05, (now - this.last) / 1000) : 1 / 60; this.last = now;
    const x = st.scrollLeft, y = window.scrollY;
    if (this.sx == null) { this.sx = x; this.sy = y; }
    // on-screen speed of the flames (px/s); smoothed so one jumpy frame doesn't jerk them
    const ux = -(x - this.sx) / dt, uy = -(y - this.sy) / dt; this.sx = x; this.sy = y;
    this.ux += (ux - this.ux) * .35; this.uy += (uy - this.uy) * .35;
    const cl = (v, m) => Math.max(-m, Math.min(m, v));
    const ta = cl(-this.ux * .022, 22), tq = cl(this.uy * .00035, .22); // tip trails the motion; climbing squashes, falling stretches
    this.va += ((ta - this.a) * 140 - this.va * 11) * dt; this.a += this.va * dt;   // under-damped spring: overshoot, then settle
    this.vq += ((tq - this.q) * 160 - this.vq * 13) * dt; this.q += this.vq * dt;
    st.style.setProperty('--lean', this.a.toFixed(2) + 'deg');
    st.style.setProperty('--sq', (1 + this.q).toFixed(3));
    const busy = now - this.tSeen < 140 || Math.abs(this.a) > .08 || Math.abs(this.va) > .3 || Math.abs(this.q) > .002 || Math.abs(this.vq) > .01;
    if (busy) this.raf = requestAnimationFrame(n => this.step(n));
    else { this.ux = this.uy = 0; st.style.setProperty('--lean', '0deg'); st.style.setProperty('--sq', '1'); }
  }
};

/* ---------- clock + stopwatch (stopwatch survives reloads; kept apart from the habit data) ---------- */
const ND_SW_KEY = 'newday:stopwatch';
const ND_SW_TXT = { ar: ['المؤقّت', 'تشغيل / إيقاف', 'تصفير'], en: ['Stopwatch', 'Start / pause', 'Reset'], fr: ['Chrono', 'Démarrer / pause', 'Remettre à zéro'] };
const ndSwT = i => (ND_SW_TXT[LANG] || ND_SW_TXT.en)[i];
function ndSw() { try { return JSON.parse(localStorage.getItem(ND_SW_KEY)) || { run: false, t0: 0, acc: 0 }; } catch (e) { return { run: false, t0: 0, acc: 0 }; } }
function ndSwSave(o) { try { localStorage.setItem(ND_SW_KEY, JSON.stringify(o)); } catch (e) {} }
function ndSwMs(o) { return o.acc + (o.run ? Date.now() - o.t0 : 0); }
function ndPad(n) { return String(n).padStart(2, '0'); }
function ndSwFmt(ms) {
  const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60;
  return h ? h + ':' + ndPad(m) + ':' + ndPad(s % 60) : ndPad(m) + ':' + ndPad(s % 60) + '<small>.' + Math.floor(ms % 1000 / 100) + '</small>';
}
const ND_PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';
const ND_PAUSE = '<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>';
const ND_RESET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/></svg>';
function ndTick() {
  const c = document.getElementById('ndClock');
  if (c) { const d = new Date(), hm = ndPad(d.getHours()) + ':' + ndPad(d.getMinutes()); if (c.dataset.hm !== hm) { c.dataset.hm = hm; c.firstChild.textContent = hm; } c.lastChild.textContent = ':' + ndPad(d.getSeconds()); }
  const w = document.getElementById('ndSw'); if (w) { const o = ndSw(); w.innerHTML = ndSwFmt(ndSwMs(o)); }
}
function ndSwPaint() {
  const o = ndSw(), card = document.getElementById('ndSwCard'); if (!card) return;
  card.classList.toggle('run', o.run); card.classList.toggle('zero', !o.run && !o.acc);
  const b = $('[data-sw=toggle]', card); b.innerHTML = o.run ? ND_PAUSE : ND_PLAY; b.setAttribute('aria-pressed', o.run);
  ndTick();
}
if (!window.__ndTimers) {
  window.__ndTimers = 1;
  let last = 0;
  const loop = () => { const now = Date.now(), fast = ndSw().run; if (now - last >= (fast ? 100 : 1000) && !document.hidden) { last = now; ndTick(); } setTimeout(loop, fast ? 100 : 250); };
  loop();
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-sw]'); if (!b) return;
    const o = ndSw();
    if (b.dataset.sw === 'toggle') { if (o.run) { o.acc += Date.now() - o.t0; o.run = false; } else { o.t0 = Date.now(); o.run = true; } }
    else { o.run = false; o.acc = 0; o.t0 = 0; }
    ndSwSave(o); ndSwPaint(); if (navigator.vibrate) navigator.vibrate(8);
  });
}
function clockHTML() {
  const o = ndSw(), d = new Date(), info = ndSkyInfo(), date = esc(t('dayShort')[d.getDay()]) + ' · ' + fmtDate(todayISO(), { day: 'numeric', month: 'short' });
  return '<section class="sky s-' + info.scene + (info.day ? ' day' : ' night') + '" id="ndSky"><div class="sky-bg" aria-hidden="true"><canvas></canvas></div><i class="sky-shade"></i><i class="sky-dim"></i>' +
    '<div class="sky-top">' + topbarHTML() + '</div>' +
    '<div class="sky-main"><div class="sky-time"><div class="clk" id="ndClock" dir="ltr"><span>' + ndPad(d.getHours()) + ':' + ndPad(d.getMinutes()) + '</span><small>:' + ndPad(d.getSeconds()) + '</small></div>' +
    '<div class="sky-date">' + date + '</div></div><div class="wx-slot">' + ndSkyLine(info) + '</div></div>' +
    '<div class="sky-sw"><div class="sw-card' + (o.run ? ' run' : '') + (!o.run && !o.acc ? ' zero' : '') + '" id="ndSwCard"><span class="sw-ic" aria-hidden="true">' + ND_SW_IC + '</span><div class="sw" id="ndSw" dir="ltr" aria-label="' + esc(ndSwT(0)) + '">' + ndSwFmt(ndSwMs(o)) + '</div>' +
    '<div class="sw-btns"><button class="sw-b ghost" data-sw="reset" aria-label="' + esc(ndSwT(2)) + '">' + ND_RESET + '</button><button class="sw-b" data-sw="toggle" aria-pressed="' + o.run + '" aria-label="' + esc(ndSwT(1)) + '">' + (o.run ? ND_PAUSE : ND_PLAY) + '</button></div></div></div>' + '</section>';
}
const ND_SW_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V10M10 2.8h4M18.4 6.6l1.4-1.4"/></svg>';

/* ---------- the sheet slides over the weather (iOS Weather style) ----------
   The sky is sticky behind; the cards' sheet scrolls over it. No scroll JS at all: the gentle fade/scale of the
   clock and weather is a CSS scroll-driven animation (compositor-only). One IntersectionObserver notes when the
   sheet has fully covered the sky, so the weather canvas stops painting and the sky stops being drawn. */
let ND_COVER = null;
function ndCoverWatch(root) {
  if (ND_COVER) { ND_COVER.disconnect(); ND_COVER = null; }
  NDWX.covered = false;
  const pin = root.querySelector('.tsheet-pin'), sky = root.querySelector('#ndSky');
  if (!pin || !sky || !('IntersectionObserver' in window)) return;
  ND_COVER = new IntersectionObserver(es => {
    const e = es[es.length - 1], cov = !e.isIntersecting && e.boundingClientRect.top < 0;
    NDWX.covered = cov; sky.classList.toggle('covered', cov);
  });
  ND_COVER.observe(pin);
}

/* ---------- live weather in the header (Open-Meteo, keyless; network-only, cached locally) ---------- */
const ND_WX_KEY = 'newday:weather';
const ND_WX_TXT = {
  ar: { city: 'مدينتك', pick: 'اختر مدينتك للطقس', search: 'ابحث عن مدينة…', none: 'لا نتائج', change: 'تغيير', sug: 'مقترح', hint: 'الطقس الحالي يظهر خلف الساعة', c: ['صحو', 'غائم جزئياً', 'غائم', 'ضباب', 'رذاذ', 'مطر', 'ثلج', 'زخات', 'عاصفة رعدية'] },
  en: { city: 'Your city', pick: 'Pick your city for weather', search: 'Search a city…', none: 'No results', change: 'Change', sug: 'Suggested', hint: 'Live weather shows behind the clock', c: ['Clear', 'Partly cloudy', 'Cloudy', 'Fog', 'Drizzle', 'Rain', 'Snow', 'Showers', 'Thunderstorm'] },
  fr: { city: 'Ta ville', pick: 'Choisis ta ville pour la météo', search: 'Chercher une ville…', none: 'Aucun résultat', change: 'Changer', sug: 'Suggestion', hint: 'La météo en direct s\u2019affiche derrière l\u2019horloge', c: ['Dégagé', 'Partiellement nuageux', 'Nuageux', 'Brouillard', 'Bruine', 'Pluie', 'Neige', 'Averses', 'Orage'] }
};
const ndWxT = k => (ND_WX_TXT[LANG] || ND_WX_TXT.en)[k];
function ndWx() { try { return JSON.parse(localStorage.getItem(ND_WX_KEY)) || {}; } catch (e) { return {}; } }
function ndWxSave(o) { try { localStorage.setItem(ND_WX_KEY, JSON.stringify(o)); } catch (e) {} }
/* WMO code → scene + label index */
function ndScene(code) {
  if (code == null) return ['clear', 0];
  if (code === 0) return ['clear', 0]; if (code <= 2) return ['partly', 1]; if (code === 3) return ['cloudy', 2];
  if (code === 45 || code === 48) return ['fog', 3]; if (code >= 51 && code <= 57) return ['drizzle', 4];
  if ((code >= 61 && code <= 67)) return ['rain', 5]; if ((code >= 71 && code <= 77) || code === 85 || code === 86) return ['snow', 6];
  if (code >= 80 && code <= 82) return ['rain', 7]; if (code >= 95) return ['storm', 8]; return ['cloudy', 2];
}
function ndIsDay(w) { if (w.data && w.data.is_day != null && Date.now() - w.data.at < 3 * 3600e3) return !!w.data.is_day; const h = new Date().getHours(); return h >= 7 && h < 19; }
function ndWxRefresh(force) {
  const w = ndWx(); if (!w.city || !navigator.onLine) return;
  if (!force && w.data && w.data.hi != null && Date.now() - w.data.at < 30 * 60e3) return;
  if (ndWxRefresh.busy) return; ndWxRefresh.busy = 1;
  fetch('https://api.open-meteo.com/v1/forecast?latitude=' + w.city.lat + '&longitude=' + w.city.lon + '&current=temperature_2m,apparent_temperature,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto')
    .then(r => r.json()).then(j => {
      const c = j && j.current, dl = j && j.daily; if (!c) return;
      const r0 = a => a && a.length && a[0] != null ? Math.round(a[0]) : null;
      const o = ndWx(); o.data = { temp: Math.round(c.temperature_2m), feels: c.apparent_temperature != null ? Math.round(c.apparent_temperature) : null, hi: r0(dl && dl.temperature_2m_max), lo: r0(dl && dl.temperature_2m_min), code: c.weather_code, is_day: c.is_day, at: Date.now() }; ndWxSave(o); ndSkyPaint();
    }).catch(() => {}).finally(() => { ndWxRefresh.busy = 0; });
}
function ndSkyInfo() {
  const w = ndWx(), [scene, li] = ndScene(w.data && w.data.code), day = ndIsDay(w);
  return { w, scene: w.data ? scene : 'clear', label: w.data ? ndWxT('c')[li] : '', day };
}
/* monochrome weather glyphs (the fire stays the only colour) */
const ND_WI = (() => {
  const cl = '<path d="M7.5 18.5h9.2a3.8 3.8 0 0 0 .4-7.6 5.6 5.6 0 0 0-10.8 1.2 3.2 3.2 0 0 0 1.2 6.4z"/>';
  const up = '<path d="M7.5 14.5h9.2a3.8 3.8 0 0 0 .4-7.6 5.6 5.6 0 0 0-10.8 1.2 3.2 3.2 0 0 0 1.2 6.4z"/>';
  const sun = '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>';
  const moon = '<path d="M19.5 14.6A7.8 7.8 0 0 1 9.4 4.5a7.8 7.8 0 1 0 10.1 10.1z"/>';
  const g = b => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + b + '</svg>';
  return {
    clear: d => g(d ? sun : moon),
    partly: d => g((d ? '<circle cx="8.5" cy="8" r="3"/><path d="M8.5 2.3v1.2M3 8h1.2M4.6 4.1l.9.9M12.4 4.1l-.9.9"/>' : '<path d="M12.6 8.6A4.6 4.6 0 0 1 6.6 2.6a4.6 4.6 0 1 0 6 6z"/>') + '<path d="M9.5 20h8a3.3 3.3 0 0 0 .3-6.6 4.9 4.9 0 0 0-9.4 1A2.8 2.8 0 0 0 9.5 20z"/>'),
    cloudy: () => g(cl), fog: () => g('<path d="M4 9h16M6 13h12M4 17h16"/>'),
    drizzle: () => g(up + '<path d="M9 18v1.5M13 18v1.5M11 20.5v1"/>'),
    rain: () => g(up + '<path d="M8.5 17.5l-1 3M12.5 17.5l-1 3M16.5 17.5l-1 3"/>'),
    snow: () => g(up + '<path d="M8.5 18.5h.01M12 20.5h.01M15.5 18.5h.01M10 21.5h.01M14 21.5h.01" stroke-width="2.6"/>'),
    storm: () => g(up + '<path d="M12.5 14.5l-2 3.5h3l-2 3.8"/>')
  };
})();
const ndWxIcon = info => '<i class="wi" aria-hidden="true">' + (ND_WI[info.scene] || ND_WI.cloudy)(info.day) + '</i>';
const ND_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>';
const ND_FEELS = { ar: 'الإحساس', en: 'Feels', fr: 'Ressenti' };
function ndSkyLine(info) {
  if (!info.w.city) return '<button class="wx-pick" data-city>' + ND_PIN + '<span>' + esc(ndWxT('pick')) + '</span></button>';
  const d = info.w.data, city = '<span class="wx-city">' + ND_PIN + '<span>' + esc(info.w.city.name) + '</span></span>';
  if (!d) return '<button class="wx-big" data-city aria-label="' + esc(ndWxT('change')) + '">' + city + '</button>';
  const hl = d.hi != null ? '<span dir="ltr">↑' + d.hi + '°  ↓' + d.lo + '°</span>' : '';
  const fl = d.feels != null && d.feels !== d.temp ? '<span>' + esc(ND_FEELS[LANG] || ND_FEELS.en) + ' <bdi dir="ltr">' + d.feels + '°</bdi></span>' : '';
  return '<button class="wx-big" data-city aria-label="' + esc(ndWxT('change')) + '"><span class="wx-now">' + ndWxIcon(info) + '<b dir="ltr">' + d.temp + '°</b></span>' +
    '<span class="wx-cond">' + esc(info.label) + '</span>' + (hl || fl ? '<span class="wx-hl">' + hl + (hl && fl ? '<i>·</i>' : '') + fl + '</span>' : '') + city + '</button>';
}
function ndMiniWx(info) { return info.w.data ? ndWxIcon(info) + '<b dir="ltr">' + info.w.data.temp + '°</b>' : ''; }
function ndSkyPaint() {
  const sky = document.getElementById('ndSky'); if (!sky) return;
  const info = ndSkyInfo();
  ['day', 'night', 's-clear', 's-partly', 's-cloudy', 's-fog', 's-drizzle', 's-rain', 's-snow', 's-storm'].forEach(c => sky.classList.remove(c));
  sky.classList.add('s-' + info.scene, info.day ? 'day' : 'night');
  const ln = $('.wx-slot', sky); if (ln) ln.innerHTML = ndSkyLine(info);
  NDWX.start($('canvas', sky), info.scene, info.day);
}
/* city search sheet */
function ndCityPicker(done) {
  const sug = LANG === 'ar' ? { name: 'الجزائر', admin1: '', country: 'الجزائر', latitude: 36.7525, longitude: 3.042 } : { name: 'Algiers', admin1: '', country: LANG === 'fr' ? 'Algérie' : 'Algeria', latitude: 36.7525, longitude: 3.042 };
  const row = (r, i) => '<button class="city-r" data-i="' + i + '"><b>' + esc(r.name) + '</b><small>' + esc([r.admin1, r.country].filter(Boolean).join(' · ')) + '</small></button>';
  let results = [sug];
  openSheet('<h2>📍 ' + esc(ndWxT('city')) + '</h2><p class="info" style="margin:-8px 0 12px">' + esc(ndWxT('hint')) + '</p><input class="input" id="cityQ" type="search" autocomplete="off" placeholder="' + esc(ndWxT('search')) + '"><div class="city-list" id="cityL"><div class="city-h">' + esc(ndWxT('sug')) + '</div>' + row(sug, 0) + '</div>', sh => {
    const q = $('#cityQ', sh), L = $('#cityL', sh); let tm = 0, seq = 0;
    q.addEventListener('input', () => {
      clearTimeout(tm); const v = q.value.trim(); if (v.length < 2) return;
      tm = setTimeout(() => {
        const my = ++seq;
        fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(v) + '&count=6&language=' + LANG + '&format=json').then(r => r.json()).then(j => {
          if (my !== seq) return; results = (j && j.results) || [];
          L.innerHTML = results.length ? results.map(row).join('') : '<div class="city-h">' + esc(ndWxT('none')) + '</div>';
        }).catch(() => { L.innerHTML = '<div class="city-h">' + esc(ndWxT('none')) + '</div>'; });
      }, 350);
    });
    L.addEventListener('click', e => {
      const b = e.target.closest('.city-r'); if (!b) return; const r = results[+b.dataset.i]; if (!r) return;
      const o = ndWx(); o.city = { name: r.name, country: r.country || '', lat: r.latitude, lon: r.longitude }; o.data = null; o.asked = 1; ndWxSave(o);
      closeSheet(); ndSkyPaint(); ndWxRefresh(true); if (done) done(); else if (App.view === 'settings') App.render();
    });
  });
}
document.addEventListener('click', e => { if (e.target.closest('[data-city]')) ndCityPicker(); });

/* the sky renderer: one canvas, ≤30 fps, capped particles, paused when hidden or off-screen */
const NDWX = {
  id: 0,
  start(cv, scene, day) {
    if (!cv) return; const me = ++this.id, ctx = cv.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(2, devicePixelRatio || 1), rtl = document.documentElement.dir === 'rtl';
    let W = 0, H = 0;
    const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    if (!W || !H) return;
    const R = Math.random, has = k => k.split(' ').includes(scene);
    const cloudy = has('partly cloudy drizzle rain storm snow fog'), wet = has('drizzle rain storm');
    const dark = has('rain storm') ? .55 : has('cloudy drizzle snow') ? .8 : 1;
    // cloud sprites, rendered once
    const sprite = (w, h, shade, a, fog) => {
      const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
      if (fog) { g.scale(3, 1); for (let i = 0; i < 6; i++) { const x = w / 3 * (.15 + .7 * R()), y = h * (.35 + .3 * R()), r = h * (.25 + .2 * R()), gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(' + shade + ',' + a + ')'); gr.addColorStop(1, 'rgba(' + shade + ',0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } return c; }
      const n = 14;
      for (let i = 0; i < n; i++) { // cumulus: puffs along a flat base, taller in the middle
        const k = i / (n - 1), arch = Math.sin(Math.PI * k);
        const x = w * (.14 + .72 * k) + (R() - .5) * w * .05, r = h * (.16 + .2 * arch * (.7 + .5 * R())), y = h * .7 - arch * h * .2 * (.6 + .6 * R());
        const gr = g.createRadialGradient(x, y - r * .25, r * .05, x, y, r);
        gr.addColorStop(0, 'rgba(' + shade + ',' + a + ')'); gr.addColorStop(.6, 'rgba(' + shade + ',' + (a * .75) + ')'); gr.addColorStop(1, 'rgba(' + shade + ',0)');
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
      }
      const base = g.createLinearGradient(0, h * .55, 0, h * .9); base.addColorStop(0, 'rgba(0,0,0,0)'); base.addColorStop(1, 'rgba(0,0,0,.18)');
      g.globalCompositeOperation = 'source-atop'; g.fillStyle = base; g.fillRect(0, 0, w, h); // soft shaded underside
      return c;
    };
    const shade = Math.round(235 * dark) + ',' + Math.round(238 * dark) + ',' + Math.round(242 * dark);
    const nClouds = scene === 'partly' ? 3 : scene === 'fog' ? 0 : cloudy ? 6 : 0;
    const clouds = [];
    for (let i = 0; i < nClouds; i++) {
      const far = i % 2 === 0, w = far ? 200 : 260, h = far ? 80 : 104;
      clouds.push({ s: sprite(w, h, shade, far ? .42 : .62), x: R() * (W + w) - w, y: -h * .25 + R() * H * .45, v: (far ? 4 : 9) * (rtl ? -1 : 1), w });
    }
    const fogs = scene === 'fog' ? [0, 1, 2].map(i => ({ s: sprite(420, 120, '220,222,226', .3, 1), x: R() * W - 200, y: H * (.15 + i * .25), v: (3 + i * 2) * (rtl ? -1 : 1), w: 420 })) : [];
    const stars = !day && !has('cloudy drizzle rain storm snow fog') ? Array.from({ length: 36 }, () => ({ x: R() * W, y: R() * H * .8, r: R() * 1.1 + .3, p: R() * 6, f: .6 + R() * 1.4 })) : [];
    const nDrops = scene === 'drizzle' ? 30 : wet ? 60 : 0;
    const drops = Array.from({ length: nDrops }, () => ({ x: R() * W, y: R() * H, l: scene === 'drizzle' ? 6 + R() * 6 : 10 + R() * 14, v: scene === 'drizzle' ? 160 + R() * 80 : 380 + R() * 260, a: .25 + R() * .45 }));
    const splashes = [];
    const flakes = scene === 'snow' ? Array.from({ length: 45 }, () => ({ x: R() * W, y: R() * H, r: .8 + R() * 2, v: 14 + R() * 22, p: R() * 6 })) : [];
    const sunX = W * (rtl ? .4 : .6);
    let flash = 0, nextFlash = 2 + R() * 4, last = 0, t = 0, vis = true;
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { vis = es[0].isIntersecting; }) : null; if (io) io.observe(cv);
    const draw = dt => {
      ctx.clearRect(0, 0, W, H);
      if (day && has('clear partly')) { // sun: soft bloom + slow rays
        const g = ctx.createRadialGradient(sunX, -6, 4, sunX, -6, 150);
        g.addColorStop(0, 'rgba(255,236,200,.75)'); g.addColorStop(.18, 'rgba(255,214,160,.35)'); g.addColorStop(1, 'rgba(255,190,120,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.save(); ctx.translate(sunX, -6); ctx.rotate(t * .04); ctx.fillStyle = 'rgba(255,240,215,.05)';
        for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(220, -9); ctx.lineTo(220, 9); ctx.fill(); }
        ctx.restore();
      }
      if (!day && has('clear partly')) { // stars + moon
        for (const s of stars) { ctx.globalAlpha = .25 + .6 * Math.abs(Math.sin(t * s.f + s.p)); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill(); }
        ctx.globalAlpha = 1;
        const mx = sunX, my = 26, g = ctx.createRadialGradient(mx, my, 8, mx, my, 60);
        g.addColorStop(0, 'rgba(235,238,245,.28)'); g.addColorStop(1, 'rgba(235,238,245,0)'); ctx.fillStyle = g; ctx.fillRect(mx - 60, my - 60, 120, 120);
        ctx.fillStyle = '#ECEEF2'; ctx.beginPath(); ctx.arc(mx, my, 11, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(12,15,22,.9)'; ctx.beginPath(); ctx.arc(mx + (rtl ? -5 : 5), my - 3, 10, 0, 7); ctx.fill();
      }
      for (const f of fogs) { f.x += f.v * dt; if (f.x > W) f.x = -f.w; if (f.x < -f.w) f.x = W; ctx.drawImage(f.s, f.x, f.y - 60); ctx.drawImage(f.s, f.x - f.w * Math.sign(f.v || 1), f.y - 60); }
      if (flash > 0) { ctx.fillStyle = 'rgba(235,240,255,' + (flash * .5) + ')'; ctx.fillRect(0, 0, W, H); }
      for (const c of clouds) { c.x += c.v * dt; if (c.v > 0 && c.x > W) c.x = -c.w; if (c.v < 0 && c.x < -c.w) c.x = W; ctx.drawImage(c.s, c.x, c.y); }
      if (drops.length) { // rain streaks, varied speed and opacity, slight wind
        ctx.strokeStyle = '#DCE3EC'; ctx.lineWidth = 1; ctx.lineCap = 'round';
        for (const d of drops) {
          d.y += d.v * dt; d.x -= d.v * .1 * dt;
          if (d.y > H) { if (splashes.length < 14 && R() < .5) splashes.push({ x: d.x, life: 0 }); d.y = -d.l - R() * 40; d.x = R() * (W + 30); }
          ctx.globalAlpha = d.a; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.l * .1, d.y - d.l); ctx.stroke();
        }
        for (let i = splashes.length - 1; i >= 0; i--) { const s = splashes[i]; s.life += dt; if (s.life > .3) { splashes.splice(i, 1); continue; } ctx.globalAlpha = .5 * (1 - s.life / .3); ctx.beginPath(); ctx.ellipse(s.x, H - 2, 2 + s.life * 14, 1 + s.life * 3, 0, Math.PI, 0); ctx.stroke(); }
        ctx.globalAlpha = 1;
      }
      if (flakes.length) { ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); for (const f of flakes) { f.y += f.v * dt; f.x += Math.sin(t * .9 + f.p) * 12 * dt; if (f.y > H + 3) { f.y = -3; f.x = R() * W; } ctx.moveTo(f.x + f.r, f.y); ctx.arc(f.x, f.y, f.r, 0, 7); } ctx.fill(); }
      if (scene === 'storm') {
        nextFlash -= dt; if (nextFlash <= 0) { flash = 1; nextFlash = 4 + R() * 6; NDWX.bolt = { x: W * (.2 + .6 * R()), life: .18 }; }
        flash = Math.max(0, flash - dt * 2.6);
        const b = NDWX.bolt; if (b && b.life > 0) { b.life -= dt; ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.6; ctx.beginPath(); let x = b.x, y = 0; ctx.moveTo(x, y); while (y < H * .8) { x += (R() - .5) * 18; y += 8 + R() * 10; ctx.lineTo(x, y); } ctx.stroke(); }
      }
    };
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) { draw(0); return; }
    const loop = now => {
      if (me !== this.id || !cv.isConnected) { if (io) io.disconnect(); return; }
      requestAnimationFrame(loop);
      if (document.hidden || !vis || NDWX.covered) { last = now; return; }
      if (now - last < 33) return; // ~30 fps is plenty for weather
      const dt = Math.min(.1, (now - (last || now)) / 1000); last = now; t += dt; draw(dt);
    };
    requestAnimationFrame(loop);
  }
};

/* ---------- strip motion: glide, ignite ---------- */
let ND_LIT = null, ND_SCROLL = null, ND_IO = null, ND_GLIDE = 0;
const ndReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function ndGlide(strip, el, ms) {
  if (!strip || !el) return;
  const delta = el.getBoundingClientRect().left + el.offsetWidth / 2 - (strip.getBoundingClientRect().left + strip.clientWidth / 2);
  if (Math.abs(delta) < 2) return;
  const from = strip.scrollLeft, id = ++ND_GLIDE;
  if (ndReduced() || ms === 0) { strip.scrollLeft = from + delta; return; }
  ms = ms || Math.max(450, Math.min(1200, 380 + Math.abs(delta) * .5));
  const t0 = performance.now();
  const step = now => {
    if (id !== ND_GLIDE) return;
    const x = Math.min(1, (now - t0) / ms), e = 1 - (1 + 7 * x) * Math.exp(-7 * x); // critically-damped spring, no overshoot
    strip.scrollLeft = from + delta * (x >= 1 ? 1 : e / (1 - 8 * Math.exp(-7)));
    if (x < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function ndIgnite(strip, el) {
  const wall = strip.parentNode, go = () => {
    el.classList.remove('ignite'); void el.offsetWidth; el.classList.add('ignite');
    if (navigator.vibrate) navigator.vibrate([10, 60, 22]);
    const st = getComputedStyle(el);
    setTimeout(() => { const r = $('.c', el).getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height * .25, [st.getPropertyValue('--f2'), st.getPropertyValue('--f3'), st.getPropertyValue('--f1')], 22); }, 260);
    const next = el.nextElementSibling;
    if (next && el.classList.contains('today')) setTimeout(() => { next.classList.add('next'); ndGlide(strip, next, 1300); }, 1500);
  };
  const r = wall.getBoundingClientRect();
  if (r.top < 0 || r.bottom > innerHeight - 80) { scrollTo({ top: scrollY + r.top - 90, behavior: ndReduced() ? 'auto' : 'smooth' }); setTimeout(go, 520); }
  else setTimeout(go, 60);
}

function renderToday(root) {
  const s = Store.state, today = todayISO(), sel = App.sel || today;
  const all = computeAll(s, today), lv = levelInfo(all.totalXp);
  const end = planEnd(s.plan), dayN = Math.min(s.plan.days, Math.max(1, diffDays(s.plan.start, today) + 1));
  const statusBy = {}, runBy = {}; let run = 0;
  all.days.forEach(d => { statusBy[d.iso] = d.status; if (d.status === 'success' || d.status === 'perfect') runBy[d.iso] = ++run; else if (d.status === 'miss') run = 0; });
  const ds = dayStats(s, sel), pct = ds.total ? Math.round(100 * ds.done / ds.total) : 0;
  const isToday = sel === today, goal = Math.max(1, Number(s.plan.days) || 100);

  // fire-wall strip: one circle per plan day; a completed day burns
  const key = s.plan.start + ':' + s.plan.days, lit = new Set(), shorts = t('dayShort');
  let dots = '', prevLit = false;
  for (let i = 0; i < s.plan.days; i++) {
    const iso = addDays(s.plan.start, i), st = statusBy[iso], rest = isRest(s, iso), on = st === 'success' || st === 'perfect';
    if (on) lit.add(iso);
    let cls = 'dc';
    if (on) cls += ' lit t-' + ndTier(runBy[iso] || 1, goal) + (st === 'perfect' ? ' perfect' : '') + (prevLit ? ' link' : '');
    else if (iso > today) cls += ' future';
    else if (st === 'miss') cls += ' miss';
    if (rest && !on) cls += ' rest';
    if (iso === today) cls += ' today';
    if (iso === sel && !isToday) cls += ' sel';
    const [y, m, d] = iso.split('-');
    const label = shorts[weekday(iso)] + ' ' + d + '/' + m + '/' + y.slice(2);
    dots += '<button class="' + cls + '" data-day="' + iso + '"' + (on ? ' style="' + ndFire(runBy[iso] || 1, goal) + '"' : '') + (iso > today ? ' disabled' : '') +
      ' aria-label="' + esc(t('dayWord') + ' ' + (i + 1) + ' · ' + label + (on ? ' · ' + t('done') : '')) + '"' + (iso === today ? ' aria-current="date"' : '') + '>' +
      (on ? '<span class="wg"></span>' : '') + '<span class="cw">' + (on ? ND_FLAME : '') + '<span class="c"><b>' + fmtNum(i + 1) + '</b></span></span>' +
      '<span class="wd">' + esc(shorts[weekday(iso)]) + '</span><span class="dt" dir="ltr">' + d + '/' + m + '/' + y.slice(2) + '</span></button>';
    prevLit = on;
  }
  let ignite = null;
  if (ND_LIT && ND_LIT.key === key) { for (const iso of lit) if (!ND_LIT.set.has(iso)) { ignite = iso; break; } }
  ND_LIT = { key, set: lit };

  let list = '';
  if (!ds.total) {
    list = '<div class="card empty"><div class="big">🌱</div><h3>' + esc(t('noTasks')) + '</h3><p>' + esc(t('noTasksSub')) + '</p><button class="btn" data-act="add">+ ' + esc(t('addFirst')) + '</button></div>';
  } else {
    list = '<div class="tasks">' + ds.list.map((h, i) => {
      const done = Store.isDone(sel, h.id);
      return '<div class="task ' + (done ? 'done ' : '') + (h.type === 'bad' ? 'bad' : '') + '" style="animation-delay:' + (i * 45) + 'ms" data-hid="' + h.id + '">' +
        '<div class="ico">' + esc(h.icon || '•') + '</div><div class="body"><div class="name"><span>' + esc(h.name) + '</span></div><div class="meta">' +
        (h.time ? '<span>⏰ ' + esc(h.time) + '</span>' : '') + '<span class="tag ' + (h.type === 'bad' ? 'bad' : '') + '">' + esc(h.type === 'bad' ? t('badHabit') : t('goodHabit')) + '</span><span>+' + fmtNum(h.xp || 10) + '</span></div></div>' +
        '<button class="edit" data-edit="' + h.id + '" aria-label="' + esc(t('editHabit')) + '">' + ICONS.edit + '</button>' +
        '<button class="check" data-toggle="' + h.id + '" aria-pressed="' + done + '" aria-label="' + esc(h.type === 'bad' ? t('resistedQ') : t('done')) + '">' + ICONS.check + '</button></div>';
    }).join('') + '</div>';
  }

  const dateLabel = fmtDate(sel, { weekday: 'long', day: 'numeric', month: 'long' });
  const fireLine = heatLine(all.streak), planPct = Math.round(100 * dayN / s.plan.days);
  root.innerHTML = clockHTML() + '<div class="tsheet"><i class="tsheet-pin" aria-hidden="true"></i>' +
    '<section class="fwall" aria-label="' + esc(t('planDay', { a: fmtNum(dayN), b: fmtNum(s.plan.days) })) + '"><div class="fhead"><b>' + esc(t('planDay', { a: fmtNum(dayN), b: fmtNum(s.plan.days) })) + '</b><span>' + esc(today > end ? t('planDone') : t('planLeft', { n: fmtNum(Math.max(0, diffDays(today, end))) })) + '</span></div>' +
    '<div class="strip fstrip" id="strip">' + dots + '</div><i class="fprog" style="width:' + planPct + '%"></i></section>' +
    '<section class="hero"><div class="hero-top"><div><div class="date">' + esc(dateLabel) + '</div><h1>' + esc(t('hello')) + '</h1>' +
    '<div class="sub">' + esc(fireLine) + '</div></div>' + (all.streak ? fireBadge(all.streak).replace('<div class="fire ', '<div style="' + ndFire(all.streak, goal) + '" class="fire tinted ') : fireBadge(all.streak)) + '</div>' +
    '<div class="lvl-row"><div class="lvl-badge"><b>' + fmtNum(lv.level) + '</b><small>' + esc(t('level')) + '</small></div><div class="lvl-info">' +
    '<div class="lvl-title"><span>' + esc(lv.title) + '</span><span>' + fmtNum(all.totalXp) + ' ' + esc(t('xpShort')) + '</span></div>' +
    '<div class="xpbar"><i style="width:' + lv.pct + '%"></i></div><div class="sub">' + esc(t('toNext', { n: fmtNum(lv.need - lv.into) })) + '</div></div></div></section>' +
    '<div class="section-h"><h2>' + esc(isToday ? t('todayTasks') : fmtDate(sel, { weekday: 'long', day: 'numeric', month: 'short' })) + '</h2>' +
    (!isToday ? '<button class="pill" data-day="' + today + '">' + esc(t('today')) + '</button>' : '') + '</div>' +
    (ds.total ? '<div class="card progress-card"><div class="ring" style="--p:' + pct + '"><span>' + pct + '%</span></div><div><h3>' + esc(pct === 100 ? t('allDone') : t('ofTasks', { a: fmtNum(ds.done), b: fmtNum(ds.total) })) + '</h3><p>' + esc(ds.rest ? t('restKeeps') : pct === 100 ? t('perfectBonus', { n: PERFECT_BONUS }) : t('keepGoing')) + '</p></div></div>' : '') +
    (ds.rest ? '<div class="rest-banner"><div class="big">😴</div><div><b>' + esc(t('restDay')) + '</b><p>' + esc(t('restDaySub')) + '</p></div></div>' : '') +
    list + '<div id="aiTip"></div></div>';

  ndCoverWatch(root);
  ndFireDefs();
  const strip = $('#strip', root), dir = document.documentElement.dir;
  NDLEAN.bind(strip);
  requestAnimationFrame(() => {
    if (!strip.isConnected) return;
    const todayEl = $('.dc.today', strip), selEl = $('.dc.sel', strip);
    let target = selEl || todayEl;
    if (!selEl && todayEl && todayEl.classList.contains('lit') && todayEl.nextElementSibling) { target = todayEl.nextElementSibling; target.classList.add('next'); }
    if (!target) target = today > end ? strip.lastElementChild : strip.firstElementChild;
    const fresh = !ND_SCROLL || ND_SCROLL.dir !== dir || ND_SCROLL.key !== key;
    strip.scrollLeft = fresh ? 0 : ND_SCROLL.x;
    const igEl = ignite && strip.querySelector('[data-day="' + ignite + '"]');
    if (igEl) {
      if (igEl.classList.contains('today')) { target.classList.remove('next'); ndGlide(strip, igEl, 500); }
      ndIgnite(strip, igEl);
    } else ndGlide(strip, target, fresh ? 1200 : undefined);
    strip.addEventListener('scroll', () => { ND_SCROLL = { dir, key, x: strip.scrollLeft }; }, { passive: true });
    strip.addEventListener('pointerdown', () => { ND_GLIDE++; }, { passive: true });
    ND_SCROLL = { dir, key, x: strip.scrollLeft };
    // only flames on screen flicker — keeps long streaks light on the GPU
    if (ND_IO) ND_IO.disconnect();
    if ('IntersectionObserver' in window) { ND_IO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('on', e.isIntersecting)), { root: strip, rootMargin: '0px 80px' }); $$('.dc.lit', strip).forEach(el => ND_IO.observe(el)); }
    else $$('.dc.lit', strip).forEach(el => el.classList.add('on'));
  });
  requestAnimationFrame(() => {
    if (!root.isConnected) return;
    ndSkyPaint(); ndWxRefresh();
    const w = ndWx(); if (!w.city && !w.asked) setTimeout(() => { const o = ndWx(); if (App.view === 'today' && !o.city && !o.asked && !$('.sheet') && !$('.celebrate')) { o.asked = 1; ndWxSave(o); ndCityPicker(); } }, 900);
  });
  if (typeof AICoach !== 'undefined' && isToday) AICoach.renderTip($('#aiTip', root), all, ds);
}


/* ---------- "Install app" banner: a slim bar at the very top (scrolls away with the page, never floats over content) ---------- */
const ND_INST_TXT = {
  ar: { btn: 'تحميل التطبيق', sub: 'ثبّته على شاشتك الرئيسية · يعمل بدون إنترنت', ios: 'اضغط «مشاركة» ثم «إضافة إلى الشاشة الرئيسية»', x: 'إغلاق' },
  en: { btn: 'Install app', sub: 'Add it to your home screen · works offline', ios: 'Tap Share, then “Add to Home Screen”', x: 'Close' },
  fr: { btn: 'Installer l\u2019application', sub: 'Sur ton écran d\u2019accueil · marche hors ligne', ios: 'Touche Partager puis « Sur l\u2019écran d\u2019accueil »', x: 'Fermer' }
};
const ND_INST_HIDE = 'newday:installHide';
const ND_INST = { evt: null, ios: false, el: null, lang: '' };
function ndInstAlone() { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
function ndInstMuted() { try { return Date.now() < Number(localStorage.getItem(ND_INST_HIDE) || 0); } catch (e) { return false; } }
function ndInstPaint() {
  const want = !ndInstAlone() && !ndInstMuted() && (ND_INST.evt || ND_INST.ios);
  if (!want) { if (ND_INST.el) { ND_INST.el.remove(); ND_INST.el = null; } return; }
  const T = ND_INST_TXT[LANG] || ND_INST_TXT.en, key = LANG + (ND_INST.evt ? 1 : 0);
  if (ND_INST.el && ND_INST.lang === key) return;
  const el = ND_INST.el || document.createElement('aside');
  el.className = 'inst'; el.setAttribute('role', 'complementary'); ND_INST.lang = key;
  el.innerHTML = '<img src="icons/icon-192.png" alt="" width="38" height="38"><div class="inst-t"><b>New Day · يوم جديد</b><small>' + esc(ND_INST.evt ? T.sub : T.ios) + '</small></div>' +
    (ND_INST.evt ? '<button class="inst-go" data-inst="go">' + esc(T.btn) + '</button>' : '') +
    '<button class="inst-x" data-inst="x" aria-label="' + esc(T.x) + '">✕</button>';
  if (!ND_INST.el) { ND_INST.el = el; document.body.prepend(el); }
}
(() => {
  if (ndInstAlone()) return;
  const ua = navigator.userAgent || '';
  ND_INST.ios = /iP(hone|ad|od)/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); ND_INST.evt = e; ndInstPaint(); });
  addEventListener('appinstalled', () => { ND_INST.evt = null; ND_INST.ios = false; ndInstPaint(); });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-inst]'); if (!b) return;
    if (b.dataset.inst === 'go' && ND_INST.evt) {
      const ev = ND_INST.evt; ND_INST.evt = null;
      try { ev.prompt(); (ev.userChoice || Promise.resolve()).then(() => ndInstPaint()); } catch (err) { ndInstPaint(); }
    } else if (b.dataset.inst === 'x') {
      try { localStorage.setItem(ND_INST_HIDE, String(Date.now() + 3 * 864e5)); } catch (err) {}
      ndInstPaint();
    }
  });
  // follow language changes (onboarding / settings re-render #app)
  const watch = () => { const app = document.getElementById('app'); if (app) new MutationObserver(() => { if (ND_INST.el) ndInstPaint(); }).observe(app, { childList: true }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
  if (ND_INST.ios) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ndInstPaint); else ndInstPaint(); }
})();
