/* Small UI helpers: escaping, icons, toasts, bottom sheet, confetti, flame, celebration. */
const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

const ICONS = {
  today: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  week: '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M7.5 14h2M11 14h2M14.5 14h2M7.5 17h2"/></svg>',
  notes: '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h5"/></svg>',
  rewards: '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="5" rx="1.5"/><path d="M5 13v8h14v-8M12 8v13M12 8c-2-4-6-4-6-1.5S9 8 12 8zm0 0c2-4 6-4 6-1.5S15 8 12 8z"/></svg>',
  stats: '<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  theme: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/></svg>',
  edit: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
};
const LOGO = '<span class="logo" aria-hidden="true">ND</span>';
const HABIT_ICONS = ['💪','🏃','📚','🧠','💧','🕌','📖','🥗','😴','📵','🚭','🎮','🧘','✍️','💰','🎯','🧹','🚿','☕','🍬'];

/* Streak fire: cold blue-grey on day 0, heats through blue → purple → orange, fully lit at day 7. */
const FIRE_OUTER = ['#2A313C', '#2C4471', '#3157B8', '#4F55D6', '#7E4CD3', '#B5489F', '#E25A3C', '#FF7A1A'];
const FIRE_INNER = ['#3A4352', '#45649E', '#5584E6', '#857FEE', '#AE7BEE', '#EE88BC', '#FF9F5C', '#FFD54D'];
function flameSVG(streak, size) {
  const h = Math.min(streak, 7), st = fireStage(streak);
  const scale = st >= 5 ? 1.18 : st >= 4 ? 1.12 : st >= 3 ? 1.06 : 1;
  size = Math.round((size || 32) * scale);
  return '<svg class="flame-svg" width="' + size + '" height="' + size + '" viewBox="0 0 32 32" aria-hidden="true">' +
    '<path class="outer" fill="' + FIRE_OUTER[h] + '" d="M16 2c1.2 4.6 5 7 7.4 10.6 2.6 3.8 2.8 9.4-.8 13-3.6 3.7-9.6 3.9-13.4.4-3.6-3.3-4.2-8.6-1.6-12.6.6 2 1.8 3.5 3.4 4.2-.6-5.6 2.2-10.8 5-15.6z"/>' +
    '<path class="inner" fill="' + FIRE_INNER[h] + '" d="M16.2 13c.8 2.4 3.4 4 3.9 6.8.6 3-1.6 5.8-4.3 5.8-2.8 0-4.6-2.5-4.1-5.1.3-1.4 1-2.4 2-3.2 0 1.2.5 2 1.3 2.4-.2-2.4.4-4.6 1.2-6.7z"/></svg>';
}
function fireBadge(streak) {
  const st = fireStage(streak), lit = streak >= 7;
  let heat = '';
  if (!lit) { heat = '<span class="heat">'; for (let i = 1; i <= 7; i++) heat += '<i style="background:' + (i <= streak ? FIRE_OUTER[i] : '') + '"></i>'; heat += '</span>'; }
  const mode = Store.state.settings.display || 'fire';
  if (mode !== 'fire') heat = heat.replace(/background:#[0-9A-F]+/gi, 'background:var(--text)');
  return '<div class="fire s' + st + (lit ? ' lit' : '') + ' m-' + mode + '" title="' + esc(t('streak')) + '">' + commitIcon(streak, 32) +
    '<b>' + fmtNum(streak) + '</b><small>' + esc(t('streak')) + '</small>' + heat + '</div>';
}

function toast(msg, cls, ms) {
  let wrap = $('.toast-wrap'); if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const el = document.createElement('div'); el.className = 'toast ' + (cls || ''); el.textContent = msg; wrap.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, ms || 1900);
}

function burst(x, y, colors, n) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  colors = colors || [getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#fff'];
  n = n || 16;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i'); p.className = 'burst';
    p.style.left = x + 'px'; p.style.top = y + 'px'; p.style.background = colors[i % colors.length];
    if (i % 3 === 0) p.style.borderRadius = '50%';
    document.body.appendChild(p);
    const a = (Math.PI * 2 * i) / n + Math.random() * .4, d = 40 + Math.random() * 50;
    p.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(.3) rotate(${Math.random() * 360}deg)`, opacity: 0 }],
      { duration: 650 + Math.random() * 250, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => p.remove();
  }
}
function confetti(colors) {
  const w = innerWidth;
  for (let k = 0; k < 5; k++) setTimeout(() => burst(w * (.15 + .7 * Math.random()), innerHeight * (.25 + .3 * Math.random()), colors, 22), k * 140);
}

function celebrate({ emoji, html, title, text, cls, colors }) {
  const el = document.createElement('div'); el.className = 'celebrate ' + (cls || '');
  el.innerHTML = '<div class="box" role="dialog" aria-modal="true">' + (html || '<div class="emo">' + emoji + '</div>') +
    '<h2>' + esc(title) + '</h2><p>' + esc(text) + '</p><button class="btn block" data-close>' + esc(t('keepGoing')) + '</button></div>';
  document.body.appendChild(el);
  confetti(colors);
  const close = () => { el.style.transition = 'opacity .25s'; el.style.opacity = 0; setTimeout(() => el.remove(), 250); };
  el.addEventListener('click', e => { if (e.target === el || e.target.closest('[data-close]')) close(); });
  $('[data-close]', el).focus();
}

/* Bottom sheet. Returns the sheet element; onMount wires its contents. */
function openSheet(html, onMount) {
  closeSheet(true);
  const ov = document.createElement('div'); ov.className = 'overlay';
  const sh = document.createElement('div'); sh.className = 'sheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true');
  sh.innerHTML = '<div class="grab"></div>' + html;
  document.body.append(ov, sh);
  requestAnimationFrame(() => { ov.classList.add('show'); sh.classList.add('show'); });
  ov.addEventListener('click', () => closeSheet());
  if (onMount) onMount(sh);
  return sh;
}
function closeSheet(instant) {
  const ov = $('.overlay'), sh = $('.sheet'); if (!sh) return;
  if (instant) { ov && ov.remove(); sh.remove(); return; }
  ov && ov.classList.remove('show'); sh.classList.remove('show');
  setTimeout(() => { ov && ov.remove(); sh.remove(); }, 320);
}
function confirmSheet(msg, okLabel, onOk) {
  openSheet('<h2>' + esc(msg) + '</h2><div class="row"><button class="btn ghost" data-no>' + esc(t('cancel')) + '</button><button class="btn danger" data-yes>' + esc(okLabel) + '</button></div>', sh => {
    $('[data-no]', sh).onclick = () => closeSheet();
    $('[data-yes]', sh).onclick = () => { closeSheet(); onOk(); };
  });
}
function segHTML(name, opts, val) {
  return '<div class="seg" data-seg="' + name + '">' + opts.map(([v, l]) => '<button type="button" data-v="' + esc(v) + '" class="' + (String(v) === String(val) ? 'on' : '') + '">' + esc(l) + '</button>').join('') + '</div>';
}
function wireSeg(root, name, cb) {
  const seg = $('[data-seg="' + name + '"]', root); if (!seg) return;
  seg.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', seg).forEach(x => x.classList.toggle('on', x === b)); cb(b.dataset.v); });
}
function daysOrder() { const ws = Store.state.settings.weekStart; return [0, 1, 2, 3, 4, 5, 6].map(i => (ws + i) % 7); }
function daysPickerHTML(sel, cls) {
  return '<div class="days ' + (cls || '') + '">' + daysOrder().map(d => '<button type="button" data-d="' + d + '" class="' + (sel.includes(d) ? 'on' : '') + '">' + esc(t('dayShort')[d]) + '</button>').join('') + '</div>';
}
function wireDays(root, arr) {
  $$('.days button', root).forEach(b => b.addEventListener('click', () => {
    const d = Number(b.dataset.d), i = arr.indexOf(d);
    if (i >= 0) arr.splice(i, 1); else arr.push(d);
    b.classList.toggle('on', arr.includes(d));
  }));
}
