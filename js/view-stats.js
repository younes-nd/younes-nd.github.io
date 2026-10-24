/* Stats: completion, streaks, XP chart, fire milestones, per-habit. */
function renderStats(root) {
  const s = Store.state, today = todayISO(), all = computeAll(s, today), lv = levelInfo(all.totalXp);
  const last = []; for (let i = 13; i >= 0; i--) { const iso = addDays(today, -i); last.push(all.days.find(d => d.iso === iso) || { iso, xp: 0, rest: isRest(s, iso) }); }
  const max = Math.max(20, ...last.map(d => d.xp));
  const chart = '<div class="chart">' + last.map((d, i) => '<div class="col"><b>' + (d.xp ? fmtNum(d.xp) : '') + '</b><i class="' + (d.xp ? '' : d.rest ? 'restc' : 'zero') + '" style="height:' + Math.max(3, Math.round(110 * d.xp / max)) + 'px;animation-delay:' + (i * 30) + 'ms"></i><small>' + esc(t('dayShort')[weekday(d.iso)].slice(0, 2)) + '</small></div>').join('') + '</div>';
  const dayN = Math.min(s.plan.days, Math.max(1, diffDays(s.plan.start, today) + 1));
  const ms = FIRE_MILESTONES.map(m => '<div class="ms ' + (all.best >= m ? 'got' : '') + '"><span class="f">' + (all.best >= m ? commitIcon(Math.max(7, m), 26) : commitIcon(0, 26)) + '</span>' + fmtNum(m) + '</div>').join('');
  const habits = s.habits.filter(h => !h.deletedAt).map(h => {
    let sch = 0, dn = 0; for (const d of all.days) { if (d.rest) continue; if (isScheduled(h, d.iso)) { sch++; if (Store.isDone(d.iso, h.id)) dn++; } }
    const p = sch ? Math.round(100 * dn / sch) : 0;
    return '<div class="hbar"><div class="top"><span>' + esc((h.icon || '') + ' ' + h.name) + '</span><span>' + fmtNum(dn) + '/' + fmtNum(sch) + ' · ' + p + '%</span></div><div class="bar"><i style="width:' + p + '%"></i></div></div>';
  }).join('');
  root.innerHTML = topbarHTML() +
    '<div class="card" style="display:flex;align-items:center;gap:14px;margin-bottom:12px"><div class="lvl-badge" style="background:var(--accent);color:var(--on-accent)"><b>' + fmtNum(lv.level) + '</b><small>' + esc(t('level')) + '</small></div><div style="flex:1"><div class="lvl-title"><b>' + esc(lv.title) + '</b><span style="color:var(--muted)">' + fmtNum(lv.into) + '/' + fmtNum(lv.need) + '</span></div><div class="xpbar"><i style="width:' + lv.pct + '%"></i></div></div></div>' +
    '<div class="stats-grid">' +
    '<div class="stat"><span class="e">🎯</span><div class="k">' + esc(t('completion')) + '</div><div class="v">' + all.completion + '%</div></div>' +
    '<div class="stat"><span class="e">' + commitIcon(all.streak, 22) + '</span><div class="k">' + esc(t('currentStreak')) + '</div><div class="v">' + fmtNum(all.streak) + '<small> ' + esc(t('days')) + '</small></div></div>' +
    '<div class="stat"><span class="e">🏆</span><div class="k">' + esc(t('bestStreak')) + '</div><div class="v">' + fmtNum(all.best) + '<small> ' + esc(t('days')) + '</small></div></div>' +
    '<div class="stat"><span class="e">⚡</span><div class="k">' + esc(t('totalXp')) + '</div><div class="v">' + fmtNum(all.totalXp) + '</div></div>' +
    '<div class="stat"><span class="e">✅</span><div class="k">' + esc(t('tasksDone')) + '</div><div class="v">' + fmtNum(all.tasksDone) + '</div></div>' +
    '<div class="stat"><span class="e">⭐</span><div class="k">' + esc(t('perfectDays')) + '</div><div class="v">' + fmtNum(all.perfect) + '</div></div></div>' +
    '<div class="section-h"><h2>' + esc(t('xpChart')) + '</h2></div><div class="card">' + chart + '</div>' +
    '<div class="section-h"><h2>' + esc(t('milestones')) + '</h2></div><div class="card"><div class="milestones">' + ms + '</div><p class="info" style="margin:8px 0 0">' + esc(t('restKeeps')) + '</p></div>' +
    '<div class="section-h"><h2>' + esc(t('planProgress')) + '</h2><span class="pill">' + esc(t('planDay', { a: fmtNum(dayN), b: fmtNum(s.plan.days) })) + '</span></div><div class="card"><div class="goal-bar"><i style="width:' + Math.round(100 * dayN / s.plan.days) + '%"></i></div><div class="info">' + esc(fmtDate(s.plan.start, { day: 'numeric', month: 'long', year: 'numeric' }) + ' → ' + fmtDate(planEnd(s.plan), { day: 'numeric', month: 'long', year: 'numeric' })) + '</div></div>' +
    (habits ? '<div class="section-h"><h2>' + esc(t('perHabit')) + '</h2></div><div class="card">' + habits + '</div>' : '') +
    '<div class="section-h"><h2>' + esc(t('howScore')) + '</h2></div><div class="card info">' + esc(t('howScoreBody')) + '</div>';
}
