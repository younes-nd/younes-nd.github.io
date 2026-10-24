/* Week: seven day cards with progress; tap a day to open it in Today. */
function renderWeek(root) {
  const s = Store.state, today = todayISO();
  App.weekOff = App.weekOff || 0;
  const ws = addDays(weekStartOf(s, today), 7 * App.weekOff);
  let done = 0, total = 0, rests = 0, cards = '';
  for (let i = 0; i < 7; i++) {
    const iso = addDays(ws, i), ds = dayStats(s, iso), fut = iso > today, outPlan = iso < s.plan.start || iso > planEnd(s.plan);
    if (!ds.rest) { done += fut ? 0 : ds.done; total += fut ? 0 : ds.total; } else rests++;
    const pct = ds.total ? Math.round(100 * ds.done / ds.total) : 0;
    const st = ds.rest ? '😴' : fut ? '' : !ds.total ? '' : pct === 100 ? '✓✓' : pct >= 50 ? '✓' : iso === today ? '○' : '✕';
    cards += '<button class="card wday ' + (iso === today ? 'today ' : '') + (ds.rest ? 'rest ' : '') + (fut ? 'future' : '') + '" data-day="' + iso + '"' + (fut ? ' disabled' : '') + '>' +
      '<div class="dn"><small>' + esc(t('dayShort')[weekday(iso)]) + '</small><b>' + fmtNum(parseISO(iso).getDate()) + '</b></div>' +
      '<div class="mid"><b>' + esc(ds.rest ? t('rest') : iso === today ? t('today') : fut ? t('future') : t('weekDone', { a: fmtNum(ds.done), b: fmtNum(ds.total) })) + '</b>' +
      (outPlan ? '' : '<div class="dots">' + ds.list.slice(0, 14).map(h => '<i class="' + (Store.isDone(iso, h.id) ? 'on' : '') + '" title="' + esc(h.name) + '"></i>').join('') + '</div>') +
      (ds.total && !ds.rest ? '<div class="bar"><i style="width:' + pct + '%"></i></div>' : '') + '</div><div class="st">' + st + '</div></button>';
  }
  const label = fmtDate(ws, { day: 'numeric', month: 'short' }) + ' – ' + fmtDate(addDays(ws, 6), { day: 'numeric', month: 'short' });
  const prevA = document.documentElement.dir === 'rtl' ? '→' : '←', nextA = document.documentElement.dir === 'rtl' ? '←' : '→';
  root.innerHTML = topbarHTML() +
    '<div class="week-nav"><button class="icon-btn" data-wk="-1" aria-label="' + esc(t('prevWeek')) + '">' + prevA + '</button><h2>' + esc(App.weekOff === 0 ? t('thisWeek') : label) + '<br><small style="color:var(--muted);font-size:13px">' + esc(label) + '</small></h2>' +
    '<button class="icon-btn" data-wk="1" aria-label="' + esc(t('nextWeek')) + '"' + (App.weekOff >= 0 ? ' disabled style="opacity:.35"' : '') + '>' + nextA + '</button></div>' +
    '<div class="wsum"><div class="stat"><div class="k">' + esc(t('tasksDone')) + '</div><div class="v">' + fmtNum(done) + '<small>/' + fmtNum(total) + '</small></div></div>' +
    '<div class="stat"><div class="k">' + esc(t('completion')) + '</div><div class="v">' + (total ? Math.round(100 * done / total) : 0) + '%</div></div>' +
    '<div class="stat"><div class="k">' + esc(t('rest')) + '</div><div class="v">' + fmtNum(rests) + '<small> 😴</small></div></div></div>' +
    cards + '<p class="info" style="text-align:center">' + esc(t('tapToOpen')) + '</p>';
  $$('[data-wk]', root).forEach(b => b.onclick = () => { const n = App.weekOff + Number(b.dataset.wk); if (n <= 0) { App.weekOff = n; App.render(); } });
}
