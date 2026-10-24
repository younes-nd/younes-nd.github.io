/* First-run setup: language → plan duration → rest days. */
const PRESETS = [['d1m', 30], ['d3m', 90], ['d6m', 180], ['d1y', 365]];
function renderOnboarding(root) {
  const s = Store.state; let step = 0;
  const draw = () => {
    let body = '';
    if (step === 0) {
      body = '<div class="ob-hero">' + LOGO + '<h1>' + esc(t('obWelcome')) + '</h1><p>' + esc(t('obWelcomeSub')) + '</p></div>' +
        '<h2>' + esc(t('obLang')) + '</h2><p class="subt"></p><div class="opt-grid">' +
        Object.keys(I18N).map(l => '<button class="opt ' + (l === s.settings.lang ? 'on' : '') + ' ' + (l === 'ar' ? 'wide' : '') + '" data-lang="' + l + '">' + esc(I18N[l].langName) + '</button>').join('') + '</div>';
    } else if (step === 1) {
      body = '<h2>' + esc(t('obDuration')) + '</h2><p class="subt">' + esc(t('obDurationSub')) + '</p><div class="opt-grid">' +
        PRESETS.map(([k, d]) => '<button class="opt ' + (s.plan.preset === k ? 'on' : '') + '" data-preset="' + k + '" data-days="' + d + '">' + esc(t(k)) + '<small>' + esc(t('daysN', { n: fmtNum(d) })) + '</small></button>').join('') +
        '<button class="opt wide ' + (s.plan.preset === 'custom' ? 'on' : '') + '" data-preset="custom">' + esc(t('dCustom')) + '</button></div>' +
        '<div class="field ' + (s.plan.preset === 'custom' ? '' : 'hidden') + '" id="customWrap" style="margin-top:14px"><label for="customDays">' + esc(t('customDays')) + '</label><input id="customDays" class="input" type="number" min="1" max="3650" inputmode="numeric" value="' + s.plan.days + '"></div>';
    } else {
      body = '<h2>' + esc(t('obRest')) + '</h2><p class="subt">' + esc(t('obRestSub')) + '</p>' + daysPickerHTML(s.plan.restDays, 'rest');
    }
    root.innerHTML = '<div class="ob"><div class="ob-dots">' + [0, 1, 2].map(i => '<i class="' + (i === step ? 'on' : '') + '"></i>').join('') + '</div><div class="ob-step">' + body + '</div>' +
      '<div class="ob-actions">' + (step > 0 ? '<button class="btn ghost" data-back>' + esc(t('back')) + '</button>' : '') +
      '<button class="btn" data-next>' + esc(t(step === 2 ? 'obStart' : 'next')) + '</button></div></div>';
    $$('[data-lang]', root).forEach(b => b.onclick = () => { s.settings.lang = b.dataset.lang; setLang(b.dataset.lang); Store.save(); draw(); });
    $$('[data-preset]', root).forEach(b => b.onclick = () => {
      s.plan.preset = b.dataset.preset; if (b.dataset.days) s.plan.days = Number(b.dataset.days);
      $$('[data-preset]', root).forEach(x => x.classList.toggle('on', x === b)); $('#customWrap', root).classList.toggle('hidden', s.plan.preset !== 'custom');
    });
    if (step === 2) wireDays(root, s.plan.restDays);
    const back = $('[data-back]', root); if (back) back.onclick = () => { step--; draw(); };
    $('[data-next]', root).onclick = () => {
      if (step === 1 && s.plan.preset === 'custom') { const n = parseInt($('#customDays', root).value, 10); s.plan.days = Math.max(1, Math.min(3650, n || 30)); }
      if (step < 2) { step++; Store.save(); draw(); return; }
      s.plan.start = todayISO(); s.onboarded = true;
      if (s.rewards === null) s.rewards = t('defaultRewards').map(([name, cost, icon]) => ({ id: uid(), name, cost, icon }));
      Store.save(); App.go('today'); setTimeout(() => openHabitForm(), 500);
    };
  };
  draw();
}
