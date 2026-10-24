/* Today: hero (level, XP, fire), plan day strip, the selected day's tasks. */
function topbarHTML() {
  return '<header class="topbar"><div class="brand">' + LOGO + '<div>' + esc(t('appName')) + '<small>' + esc(t('tagline')) + '</small></div></div>' +
    '<div style="display:flex;gap:8px"><button class="icon-btn" data-act="theme" aria-label="' + esc(t('theme')) + '">' + ICONS.theme + '</button>' +
    '<button class="icon-btn" data-act="settings" aria-label="' + esc(t('navSettings')) + '">' + ICONS.settings + '</button></div></header>';
}

function renderToday(root) {
  const s = Store.state, today = todayISO(), sel = App.sel || today;
  const all = computeAll(s, today), lv = levelInfo(all.totalXp);
  const end = planEnd(s.plan), dayN = Math.min(s.plan.days, Math.max(1, diffDays(s.plan.start, today) + 1));
  const statusBy = {}; all.days.forEach(d => { statusBy[d.iso] = d.status; });
  const ds = dayStats(s, sel), pct = ds.total ? Math.round(100 * ds.done / ds.total) : 0;
  const isToday = sel === today;

  // plan strip
  let chips = '';
  for (let i = 0; i < s.plan.days; i++) {
    const iso = addDays(s.plan.start, i), st = statusBy[iso], rest = isRest(s, iso);
    let cls = 'chip', mark = '';
    if (iso > today) { cls += ' future'; mark = rest ? '😴' : '·'; }
    else if (rest) { cls += ' rest'; mark = '😴'; }
    else if (st === 'perfect') { cls += ' done'; mark = '✓✓'; }
    else if (st === 'success') { cls += ' done'; mark = '✓'; }
    else if (st === 'miss') { cls += ' miss'; mark = '✕'; }
    else mark = '○';
    if (rest) cls += ' rest';
    if (iso === today) cls += ' today';
    if (iso === sel) cls += ' sel';
    chips += '<button class="' + cls + '" data-day="' + iso + '"' + (iso > today ? ' disabled' : '') + '><div class="n">' + esc(t('dayWord')) + '</div><div class="d">' + fmtNum(i + 1) + '</div><div class="m">' + mark + '</div></button>';
  }

  let list = '';
  if (!ds.total) {
    list = '<div class="card empty"><div class="big">🌱</div><h3>' + esc(t('noTasks')) + '</h3><p>' + esc(t('noTasksSub')) + '</p><button class="btn" data-act="add">+ ' + esc(t('addFirst')) + '</button></div>';
  } else {
    list = '<div class="tasks">' + ds.list.map((h, i) => {
      const done = Store.isDone(sel, h.id);
      return '<div class="task ' + (done ? 'done ' : '') + (h.type === 'bad' ? 'bad' : '') + '" style="animation-delay:' + (i * 40) + 'ms" data-hid="' + h.id + '">' +
        '<div class="ico">' + esc(h.icon || '•') + '</div><div class="body"><div class="name">' + esc(h.name) + '</div><div class="meta">' +
        (h.time ? '<span>⏰ ' + esc(h.time) + '</span>' : '') + '<span class="tag ' + (h.type === 'bad' ? 'bad' : '') + '">' + esc(h.type === 'bad' ? t('badHabit') : t('goodHabit')) + '</span><span>+' + fmtNum(h.xp || 10) + '</span></div></div>' +
        '<button class="edit" data-edit="' + h.id + '" aria-label="' + esc(t('editHabit')) + '">' + ICONS.edit + '</button>' +
        '<button class="check" data-toggle="' + h.id + '" aria-pressed="' + done + '" aria-label="' + esc(h.type === 'bad' ? t('resistedQ') : t('done')) + '">' + ICONS.check + '</button></div>';
    }).join('') + '</div>';
  }

  const dateLabel = fmtDate(sel, { weekday: 'long', day: 'numeric', month: 'long' });
  const fireLine = heatLine(all.streak);
  root.innerHTML = topbarHTML() +
    '<section class="hero"><div class="hero-top"><div><div class="date">' + esc(dateLabel) + '</div><h1>' + esc(t('hello')) + '</h1>' +
    '<div class="sub">' + esc(fireLine) + '</div></div>' + fireBadge(all.streak) + '</div>' +
    '<div class="lvl-row"><div class="lvl-badge"><b>' + fmtNum(lv.level) + '</b><small>' + esc(t('level')) + '</small></div><div class="lvl-info">' +
    '<div class="lvl-title"><span>' + esc(lv.title) + '</span><span>' + fmtNum(all.totalXp) + ' ' + esc(t('xpShort')) + '</span></div>' +
    '<div class="xpbar"><i style="width:' + lv.pct + '%"></i></div><div class="sub">' + esc(t('toNext', { n: fmtNum(lv.need - lv.into) })) + '</div></div></div></section>' +
    '<div class="section-h"><h2>' + esc(t('planDay', { a: fmtNum(dayN), b: fmtNum(s.plan.days) })) + '</h2><span class="pill">' + esc(today > end ? t('planDone') : t('planLeft', { n: fmtNum(Math.max(0, diffDays(today, end))) })) + '</span></div>' +
    '<div class="strip" id="strip">' + chips + '</div>' +
    '<div class="plan-bar"><div class="bar"><i style="width:' + Math.round(100 * dayN / s.plan.days) + '%"></i></div><span>' + Math.round(100 * dayN / s.plan.days) + '%</span></div>' +
    '<div class="section-h"><h2>' + esc(isToday ? t('todayTasks') : fmtDate(sel, { weekday: 'long', day: 'numeric', month: 'short' })) + '</h2>' +
    (!isToday ? '<button class="pill" data-day="' + today + '">' + esc(t('today')) + '</button>' : '') + '</div>' +
    (ds.total ? '<div class="card progress-card"><div class="ring" style="--p:' + pct + '"><span>' + pct + '%</span></div><div><h3>' + esc(pct === 100 ? t('allDone') : t('ofTasks', { a: fmtNum(ds.done), b: fmtNum(ds.total) })) + '</h3><p>' + esc(ds.rest ? t('restKeeps') : pct === 100 ? t('perfectBonus', { n: PERFECT_BONUS }) : t('keepGoing')) + '</p></div></div>' : '') +
    (ds.rest ? '<div class="rest-banner"><div class="big">😴</div><div><b>' + esc(t('restDay')) + '</b><p>' + esc(t('restDaySub')) + '</p></div></div>' : '') +
    list + '<div id="aiTip"></div>';

  const strip = $('#strip', root), cur = $('.chip.sel', strip) || $('.chip.today', strip);
  if (cur) requestAnimationFrame(() => { strip.scrollLeft += cur.getBoundingClientRect().left - strip.getBoundingClientRect().left - strip.clientWidth / 2 + cur.clientWidth / 2; });
  if (typeof AICoach !== 'undefined' && isToday) AICoach.renderTip($('#aiTip', root), all, ds);
}
