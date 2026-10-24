/* Add / edit a habit in a bottom sheet. */
function openHabitForm(habit, presetDate) {
  const isNew = !habit;
  const h = habit ? JSON.parse(JSON.stringify(habit)) : { id: uid(), name: '', type: 'good', repeat: 'daily', days: [0, 1, 2, 3, 4, 5, 6], date: presetDate || todayISO(), time: '', icon: '💪', xp: 10, created: todayISO() };
  if (!h.days) h.days = [];
  const html = '<h2>' + esc(t(isNew ? 'addHabit' : 'editHabit')) + '</h2>' +
    '<div class="field"><label for="hName">' + esc(t('habitName')) + '</label><input id="hName" class="input" maxlength="60" placeholder="' + esc(t('habitNamePh')) + '" value="' + esc(h.name) + '"></div>' +
    '<div class="field"><span class="lbl">' + esc(t('type')) + '</span>' + segHTML('type', [['good', t('goodHabit')], ['bad', t('badHabit')]], h.type) + '</div>' +
    '<div class="field"><span class="lbl">' + esc(t('repeat')) + '</span>' + segHTML('repeat', [['daily', t('everyDay')], ['days', t('weekdays')], ['once', t('onceDate')]], h.repeat) +
      '<div id="hDaysWrap" style="margin-top:10px">' + daysPickerHTML(h.days) + '</div>' +
      '<div id="hDateWrap" style="margin-top:10px"><input id="hDate" type="date" class="input" value="' + esc(h.date || todayISO()) + '"></div></div>' +
    '<div class="row"><div class="field"><label for="hTime">' + esc(t('time')) + '</label><input id="hTime" type="time" class="input" value="' + esc(h.time || '') + '"></div>' +
      '<div class="field"><span class="lbl">' + esc(t('points')) + '</span>' + segHTML('xp', [[5, '5'], [10, '10'], [20, '20']], h.xp) + '</div></div>' +
    '<div class="field"><span class="lbl">' + esc(t('icon')) + '</span><div class="icons">' + HABIT_ICONS.map(i => '<button type="button" data-i="' + i + '" class="' + (i === h.icon ? 'on' : '') + '">' + i + '</button>').join('') + '</div></div>' +
    '<div class="err" id="hErr"></div>' +
    '<div class="row">' + (isNew ? '<button class="btn ghost" data-cancel>' + esc(t('cancel')) + '</button>' : '<button class="btn danger" data-del>' + esc(t('delete')) + '</button>') +
    '<button class="btn" data-save>' + esc(t('save')) + '</button></div>';
  openSheet(html, sh => {
    const sync = () => { $('#hDaysWrap', sh).classList.toggle('hidden', h.repeat !== 'days'); $('#hDateWrap', sh).classList.toggle('hidden', h.repeat !== 'once'); };
    sync();
    wireSeg(sh, 'type', v => { h.type = v; if (v === 'bad' && h.icon === '💪') { h.icon = '📵'; $$('.icons button', sh).forEach(b => b.classList.toggle('on', b.dataset.i === h.icon)); } });
    wireSeg(sh, 'repeat', v => { h.repeat = v; sync(); });
    wireSeg(sh, 'xp', v => { h.xp = Number(v); });
    wireDays(sh, h.days);
    $$('.icons button', sh).forEach(b => b.addEventListener('click', () => { h.icon = b.dataset.i; $$('.icons button', sh).forEach(x => x.classList.toggle('on', x === b)); }));
    const c = $('[data-cancel]', sh); if (c) c.onclick = () => closeSheet();
    const d = $('[data-del]', sh); if (d) d.onclick = () => confirmSheet(t('confirmDelete'), t('delete'), () => { Store.deleteHabit(h.id); App.render(); });
    $('[data-save]', sh).onclick = () => {
      h.name = $('#hName', sh).value.trim(); h.time = $('#hTime', sh).value; h.date = $('#hDate', sh).value || todayISO();
      if (!h.name) { $('#hErr', sh).textContent = t('nameRequired'); $('#hName', sh).focus(); return; }
      if (h.repeat === 'days' && !h.days.length) { $('#hErr', sh).textContent = t('pickDay'); return; }
      if (h.repeat === 'once' && h.date < h.created) h.created = h.date;
      Store.upsertHabit(h); closeSheet(); App.render(); toast(t('saved'));
    };
    if (isNew) setTimeout(() => $('#hName', sh).focus(), 350);
  });
}
