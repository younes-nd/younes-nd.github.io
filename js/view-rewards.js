/* Rewards shop: points balance (earned XP − spent), user-defined rewards, history, savings goal. */
function renderRewards(root) {
  const s = Store.state, all = computeAll(s), spent = Store.spentPoints(), bal = all.totalXp - spent;
  if (s.rewards === null) { s.rewards = t('defaultRewards').map(([name, cost, icon]) => ({ id: uid(), name, cost, icon })); Store.save(); }
  const g = s.goal, gp = g && g.target ? Math.min(100, Math.round(100 * (g.saved || 0) / g.target)) : 0;
  root.innerHTML = topbarHTML() +
    '<div class="card wallet"><div><div class="k">' + esc(t('balance')) + '</div><div class="v">' + fmtNum(bal) + ' <small style="font-size:16px;color:var(--muted)">' + esc(t('xpShort')) + '</small></div>' +
    '<div class="k">' + esc(t('earned')) + ' ' + fmtNum(all.totalXp) + ' · ' + esc(t('spent')) + ' ' + fmtNum(spent) + '</div></div><div style="font-size:40px;filter:grayscale(1)">🎁</div></div>' +
    challengesHTML(all) +
    '<div class="section-h"><h2>' + esc(t('goal')) + '</h2>' + (g ? '<button class="pill" data-goal>' + esc(t('editGoal')) + '</button>' : '') + '</div>' +
    (g ? '<div class="card"><div class="lvl-title"><b>💻 ' + esc(g.name) + '</b><span style="color:var(--muted)">' + gp + '%</span></div><div class="goal-bar"><i style="width:' + gp + '%"></i></div><div class="info">' + fmtNum(g.saved || 0) + ' / ' + fmtNum(g.target) + ' ' + esc(t('goalUnit')) + (gp >= 100 ? ' — ' + esc(t('goalReached')) : '') + '</div></div>'
      : '<button class="card" data-goal style="width:100%;text-align:center;font-weight:800">+ ' + esc(t('setGoal')) + '</button>') +
    '<div class="section-h"><h2>' + esc(t('rewards')) + '</h2><button class="pill" data-addr>+ ' + esc(t('addReward')) + '</button></div>' +
    (s.rewards.length ? s.rewards.map(r => '<div class="card reward"><div class="ico">' + esc(r.icon || '🎁') + '</div><div class="b"><b>' + esc(r.name) + '</b><small>' + fmtNum(r.cost) + ' ' + esc(t('xpShort')) + '</small></div>' +
      '<button class="edit" data-editr="' + r.id + '" aria-label="' + esc(t('edit') ) + '">' + ICONS.edit + '</button><button class="btn small" data-redeem="' + r.id + '"' + (bal < r.cost ? ' disabled' : '') + '>' + esc(t('redeem')) + '</button></div>').join('')
      : '<p class="info" style="text-align:center">' + esc(t('noRewards')) + '</p>') +
    (s.redemptions.length ? '<div class="section-h"><h2>' + esc(t('history')) + '</h2></div><div class="card">' + s.redemptions.slice().reverse().slice(0, 30).map(h => '<div class="hist"><span>' + esc(h.name) + (h.toGoal ? ' · +' + fmtNum(h.toGoal) + ' ' + esc(t('goalUnit')) : '') + '</span><span>−' + fmtNum(h.cost) + ' · ' + esc(fmtDate(h.date)) + '</span></div>').join('') + '</div>' : '');

  wireChallenges(root);
  $$('[data-goal]', root).forEach(b => b.onclick = () => openGoalForm());
  $('[data-addr]', root).onclick = () => openRewardForm();
  $$('[data-editr]', root).forEach(b => b.onclick = () => openRewardForm(s.rewards.find(r => r.id === b.dataset.editr)));
  $$('[data-redeem]', root).forEach(b => b.onclick = () => {
    const r = s.rewards.find(x => x.id === b.dataset.redeem); if (!r) return;
    if (bal < r.cost) return toast(t('notEnough', { n: fmtNum(r.cost - bal) }));
    openSheet('<h2>' + esc(r.icon + ' ' + r.name) + '</h2><p class="info">−' + fmtNum(r.cost) + ' ' + esc(t('xpShort')) + '</p>' +
      (s.goal ? '<div class="field"><label for="toGoal">' + esc(t('addToGoal')) + ' (' + esc(t('goalUnit')) + ')</label><input id="toGoal" class="input" type="number" min="0" inputmode="numeric" placeholder="1000"></div>' : '') +
      '<div class="row"><button class="btn ghost" data-no>' + esc(t('cancel')) + '</button><button class="btn" data-yes>' + esc(t('redeem')) + '</button></div>', sh => {
      $('[data-no]', sh).onclick = () => closeSheet();
      $('[data-yes]', sh).onclick = () => {
        const tg = s.goal ? Math.max(0, parseInt(($('#toGoal', sh) || {}).value, 10) || 0) : 0;
        s.redemptions.push({ id: uid(), rid: r.id, name: r.name, cost: Number(r.cost), date: todayISO(), toGoal: tg || 0 });
        if (tg && s.goal) s.goal.saved = (s.goal.saved || 0) + tg;
        Store.save(); closeSheet(); toast(t('redeemed'), 'xp'); confetti(); App.render();
      };
    });
  });
}
function openRewardForm(r) {
  const s = Store.state, isNew = !r; r = r ? Object.assign({}, r) : { id: uid(), name: '', cost: 200, icon: '🎮' };
  const icons = ['🎮', '💻', '🍕', '🎬', '🛍️', '☕', '📱', '⚽', '🎧', '🎁'];
  openSheet('<h2>' + esc(t('addReward')) + '</h2><div class="field"><label for="rName">' + esc(t('rewardName')) + '</label><input id="rName" class="input" maxlength="60" placeholder="' + esc(t('rewardPh')) + '" value="' + esc(r.name) + '"></div>' +
    '<div class="field"><label for="rCost">' + esc(t('cost')) + '</label><input id="rCost" class="input" type="number" min="1" inputmode="numeric" value="' + r.cost + '"></div>' +
    '<div class="field"><span class="lbl">' + esc(t('icon')) + '</span><div class="icons">' + icons.map(i => '<button type="button" data-i="' + i + '" class="' + (i === r.icon ? 'on' : '') + '">' + i + '</button>').join('') + '</div></div><div class="err" id="rErr"></div>' +
    '<div class="row">' + (isNew ? '<button class="btn ghost" data-no>' + esc(t('cancel')) + '</button>' : '<button class="btn danger" data-del>' + esc(t('delete')) + '</button>') + '<button class="btn" data-yes>' + esc(t('save')) + '</button></div>', sh => {
    $$('.icons button', sh).forEach(b => b.onclick = () => { r.icon = b.dataset.i; $$('.icons button', sh).forEach(x => x.classList.toggle('on', x === b)); });
    const no = $('[data-no]', sh); if (no) no.onclick = () => closeSheet();
    const del = $('[data-del]', sh); if (del) del.onclick = () => { s.rewards = s.rewards.filter(x => x.id !== r.id); Store.save(); closeSheet(); App.render(); };
    $('[data-yes]', sh).onclick = () => {
      r.name = $('#rName', sh).value.trim(); r.cost = Math.max(1, parseInt($('#rCost', sh).value, 10) || 0);
      if (!r.name) { $('#rErr', sh).textContent = t('nameRequired'); return; }
      const i = s.rewards.findIndex(x => x.id === r.id); if (i >= 0) s.rewards[i] = r; else s.rewards.push(r);
      Store.save(); closeSheet(); App.render();
    };
  });
}
function openGoalForm() {
  const s = Store.state, g = s.goal || { name: '', target: 230000, saved: 0 };
  openSheet('<h2>' + esc(t('goal')) + '</h2><div class="field"><label for="gName">' + esc(t('goalName')) + '</label><input id="gName" class="input" maxlength="60" placeholder="' + esc(t('goalNamePh')) + '" value="' + esc(g.name) + '"></div>' +
    '<div class="row"><div class="field"><label for="gT">' + esc(t('goalTarget')) + ' (' + esc(t('goalUnit')) + ')</label><input id="gT" class="input" type="number" min="1" inputmode="numeric" value="' + g.target + '"></div>' +
    '<div class="field"><label for="gS">' + esc(t('goalSaved')) + ' (' + esc(t('goalUnit')) + ')' + '</label><input id="gS" class="input" type="number" min="0" inputmode="numeric" value="' + (g.saved || 0) + '"></div></div><div class="err" id="gErr"></div>' +
    '<div class="row">' + (s.goal ? '<button class="btn danger" data-del>' + esc(t('delete')) + '</button>' : '<button class="btn ghost" data-no>' + esc(t('cancel')) + '</button>') + '<button class="btn" data-yes>' + esc(t('save')) + '</button></div>', sh => {
    const no = $('[data-no]', sh); if (no) no.onclick = () => closeSheet();
    const del = $('[data-del]', sh); if (del) del.onclick = () => { s.goal = null; Store.save(); closeSheet(); App.render(); };
    $('[data-yes]', sh).onclick = () => {
      const name = $('#gName', sh).value.trim(); if (!name) { $('#gErr', sh).textContent = t('nameRequired'); return; }
      s.goal = { name, target: Math.max(1, parseInt($('#gT', sh).value, 10) || 1), saved: Math.max(0, parseInt($('#gS', sh).value, 10) || 0) };
      Store.save(); closeSheet(); App.render();
    };
  });
}
