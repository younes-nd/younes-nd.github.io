/* Commitment display (fire / plant / chain) and N-day challenges with badges. */
const CHALLENGES = [7, 30, 100];
const PLANT = ['🌰', '🌱', '🌿', '🪴', '🌳', '🌳'];

function commitIcon(streak, size) {
  const mode = Store.state.settings.display || 'fire';
  if (mode === 'fire') return flameSVG(streak, size);
  const st = fireStage(streak), px = Math.round((size || 32) * (st >= 4 ? 1.15 : st >= 3 ? 1.07 : 1));
  const ch = mode === 'plant' ? PLANT[st] : (streak >= 7 ? '⛓️' : '🔗');
  const style = 'font-size:' + Math.round(px * .9) + 'px;line-height:1;display:block;' + (mode === 'chain' ? 'filter:grayscale(1)' + (streak ? '' : ' opacity(.45)') : (streak ? '' : 'filter:grayscale(1) opacity(.5)'));
  return '<span class="commit-ico" style="' + style + '" aria-hidden="true">' + ch + '</span>';
}
function commitMsg(n) {
  const mode = Store.state.settings.display || 'fire';
  return mode === 'fire' ? t('fireMsgs')[n] : t('streakMsg', { n: fmtNum(n) });
}
function heatLine(streak) {
  const mode = Store.state.settings.display || 'fire';
  if (streak >= 7) return '';
  if (mode === 'fire') return streak ? t('fireHeat', { n: fmtNum(streak) }) : t('fireCold');
  return streak ? t('growing', { n: fmtNum(streak) }) : t('startStreak');
}

function challengeProgress(state, all) {
  const c = state.challenges && state.challenges.active; if (!c) return null;
  let n = 0, failed = false;
  for (const d of all.days) { if (d.iso < c.start) continue; if (d.status === 'success' || d.status === 'perfect') n++; else if (d.status === 'miss') { n = 0; failed = true; } }
  return { n: Math.min(n, c.n), goal: c.n, failed, done: n >= c.n };
}
/* Called after every check-off; awards the badge once. */
function checkChallenge(all) {
  const s = Store.state, pr = challengeProgress(s, all); if (!pr || !pr.done) return;
  const c = s.challenges.active; s.challenges.badges.push({ n: c.n, date: todayISO() }); s.challenges.active = null; Store.save();
  setTimeout(() => celebrate({ html: '<div class="badge big">' + fmtNum(c.n) + '</div>', title: t('chDone'), text: t('chDoneSub', { n: fmtNum(c.n) }) }), 1200);
}
function challengesHTML(all) {
  const s = Store.state, pr = challengeProgress(s, all), badges = s.challenges.badges;
  let html = '<div class="section-h"><h2>' + esc(t('challenges')) + '</h2></div>';
  if (pr) {
    html += '<div class="card"><div class="lvl-title"><b>' + esc(t('chName', { n: fmtNum(pr.goal) })) + '</b><span style="color:var(--muted)">' + fmtNum(pr.n) + '/' + fmtNum(pr.goal) + '</span></div>' +
      '<div class="goal-bar"><i style="width:' + Math.round(100 * pr.n / pr.goal) + '%"></i></div><div class="info">' + esc(pr.failed && pr.n === 0 ? t('chReset') : t('chHint')) + '</div>' +
      '<button class="btn small ghost" data-chquit style="margin-top:8px">' + esc(t('chQuit')) + '</button></div>';
  } else {
    html += '<div class="ch-grid">' + CHALLENGES.map(n => '<button class="card ch" data-chstart="' + n + '"><b>' + fmtNum(n) + '</b><small>' + esc(t('chDays')) + '</small><span>' + esc(t('chStart')) + '</span></button>').join('') + '</div>';
  }
  if (badges.length) html += '<div class="badges">' + badges.map(b => '<div class="badge" title="' + esc(fmtDate(b.date)) + '">' + fmtNum(b.n) + '</div>').join('') + '</div>';
  return html;
}
function wireChallenges(root) {
  const s = Store.state;
  $$('[data-chstart]', root).forEach(b => b.onclick = () => { s.challenges.active = { n: Number(b.dataset.chstart), start: todayISO() }; Store.save(); toast(t('chStarted')); App.render(); });
  const q = $('[data-chquit]', root); if (q) q.onclick = () => confirmSheet(t('chQuit') + '?', t('chQuit'), () => { s.challenges.active = null; Store.save(); App.render(); });
}
