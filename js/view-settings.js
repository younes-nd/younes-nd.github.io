/* Settings: language, theme, plan, rest days, week start, backup, AI coach, install, reset. */
function renderSettings(root) {
  const s = Store.state;
  const presets = PRESETS.map(([k, d]) => [k, t(k)]).concat([['custom', t('dCustom')]]);
  root.innerHTML = topbarHTML() +
    '<div class="set-group"><h3>' + esc(t('navSettings')) + '</h3><div class="card">' +
      '<div class="set-col"><div class="l">' + esc(t('language')) + '</div>' + segHTML('lang', Object.keys(I18N).map(l => [l, I18N[l].langName]), s.settings.lang) + '</div>' +
      '<div class="set-col"><div class="l">' + esc(t('theme')) + '</div>' + segHTML('theme', [['dark', '● ' + t('dark')], ['light', '○ ' + t('light')]], s.settings.theme) + '</div>' +
      '<div class="set-col"><div class="l">' + esc(t('display')) + '</div>' + segHTML('display', [['fire', t('dFire')], ['plant', t('dPlant')], ['chain', t('dChain')]], s.settings.display || 'fire') + '</div>' +
      '<div class="set-col"><div class="l">' + esc(t('weekStart')) + '</div>' + segHTML('ws', [6, 0, 1].map(d => [d, t('dayLong')[d]]), s.settings.weekStart) + '</div>' +
      (typeof ndWx === 'function' ? '<div class="set-row"><div class="l">📍 ' + esc(ndWxT('city')) + '<small>' + esc((ndWx().city || {}).name || '—') + '</small></div><button class="btn small ghost" data-city>' + esc(ndWxT('change')) + '</button></div>' : '') +
    '</div></div>' +
    '<div class="set-group"><h3>' + esc(t('plan')) + '</h3><div class="card">' +
      '<div class="set-col"><div class="l">' + esc(t('duration')) + '</div>' + segHTML('preset', presets, s.plan.preset) +
        '<div id="cWrap" class="' + (s.plan.preset === 'custom' ? '' : 'hidden') + '" style="margin-top:10px"><input id="cDays" class="input" type="number" min="1" max="3650" inputmode="numeric" value="' + s.plan.days + '" aria-label="' + esc(t('customDays')) + '"></div></div>' +
      '<div class="set-row"><div class="l">' + esc(t('startDate')) + '</div><input id="pStart" type="date" class="input" style="width:auto;height:44px" value="' + s.plan.start + '"></div>' +
      '<div class="set-col"><div class="l">' + esc(t('restDays')) + ' 😴</div>' + daysPickerHTML(s.plan.restDays, 'rest') + '</div>' +
    '</div></div>' +
    '<div class="set-group" id="aiGroup"></div>' +
    '<div class="set-group"><h3>' + esc(t('backup')) + '</h3><div class="card"><div class="btn-row"><button class="btn small" data-exp>⬇ ' + esc(t('exportData')) + '</button>' +
      '<label class="btn small ghost" style="cursor:pointer">⬆ ' + esc(t('importData')) + '<input type="file" id="impFile" accept="application/json,.json" class="sr"></label></div></div></div>' +
    '<div class="set-group"><h3>' + esc(t('installApp')) + '</h3><div class="card"><div class="set-row"><div class="l">' + esc(t('installApp')) + '<small>' + esc(t('installSub')) + '</small></div><button class="btn small" data-install>' + esc(t('install')) + '</button></div>' +
      '<p class="info" style="margin:0">' + esc(t('offlineReady')) + '</p></div></div>' +
    '<div class="set-group"><div class="card"><button class="btn danger block" data-reset>' + esc(t('resetAll')) + '</button></div></div>' +
    '<p class="info" style="text-align:center">' + esc(t('appName')) + ' · ' + esc(t('version')) + ' 1.1</p>';

  wireSeg(root, 'lang', v => { s.settings.lang = v; setLang(v); Store.save(); App.render(); });
  wireSeg(root, 'theme', v => { s.settings.theme = v; Store.save(); App.applyTheme(); });
  wireSeg(root, 'display', v => { s.settings.display = v; Store.save(); toast(t('saved')); });
  wireSeg(root, 'ws', v => { s.settings.weekStart = Number(v); Store.save(); App.render(); });
  wireSeg(root, 'preset', v => { s.plan.preset = v; const p = PRESETS.find(x => x[0] === v); if (p) s.plan.days = p[1]; $('#cWrap', root).classList.toggle('hidden', v !== 'custom'); Store.save(); toast(t('saved')); });
  $('#cDays', root).addEventListener('change', e => { s.plan.days = Math.max(1, Math.min(3650, parseInt(e.target.value, 10) || 30)); Store.save(); toast(t('saved')); });
  $('#pStart', root).addEventListener('change', e => { if (e.target.value) { s.plan.start = e.target.value; Store.save(); toast(t('saved')); } });
  $$('.days button', root).forEach(b => b.addEventListener('click', () => { const d = Number(b.dataset.d), i = s.plan.restDays.indexOf(d); if (i >= 0) s.plan.restDays.splice(i, 1); else s.plan.restDays.push(d); b.classList.toggle('on'); Store.save(); }));
  $('[data-exp]', root).onclick = () => {
    const blob = new Blob([Store.exportJSON()], { type: 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'new-day-backup-' + todayISO() + '.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  $('#impFile', root).addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return; const r = new FileReader();
    r.onload = () => { try { Store.importJSON(r.result); setLang(Store.state.settings.lang); App.applyTheme(); toast(t('importOk')); App.render(); } catch (err) { toast(t('importBad')); } };
    r.readAsText(f);
  });
  $('[data-install]', root).onclick = async () => { if (App.installEvt) { App.installEvt.prompt(); App.installEvt = null; } else toast(t('installHint'), '', 4000); };
  $('[data-reset]', root).onclick = () => confirmSheet(t('confirmReset'), t('delete'), () => { Store.reset(); setLang(Store.state.settings.lang); App.applyTheme(); App.view = 'today'; App.render(); });
  if (typeof AICoach !== 'undefined') AICoach.renderSettings($('#aiGroup', root));
}
