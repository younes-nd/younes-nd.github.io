/* App shell: routing, nav, the check-off flow (XP, fire, level-up), theme, service worker. */
const App = {
  view: 'today', sel: null,
  init() {
    Store.load(); setLang(Store.state.settings.lang); this.applyTheme();
    document.addEventListener('click', e => this.onClick(e));
    this.render();
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); App.installEvt = e; });
    // roll over at midnight if left open
    let day = todayISO(); setInterval(() => { if (todayISO() !== day) { day = todayISO(); if (App.sel && App.sel < day) App.sel = null; App.render(); } }, 60000);
  },
  applyTheme() { document.documentElement.dataset.theme = Store.state.settings.theme === 'light' ? 'light' : 'dark'; const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = Store.state.settings.theme === 'light' ? '#ffffff' : '#000000'; },
  go(v) { this.view = v; if (v !== 'today') this.sel = null; this.render(); scrollTo(0, 0); },
  render() {
    const root = $('#app'), nav = $('#nav'), fab = $('#fab');
    if (!Store.state.onboarded) { nav.classList.add('hidden'); fab.classList.add('hidden'); renderOnboarding(root); return; }
    nav.classList.remove('hidden'); fab.classList.toggle('hidden', !['today', 'week'].includes(this.view));
    const views = { today: renderToday, week: renderWeek, stats: renderStats, notes: renderNotes, rewards: renderRewards, settings: renderSettings };
    const wrap = document.createElement('div'); wrap.className = 'view'; (views[this.view] || renderToday)(wrap);
    root.replaceChildren(wrap);
    this.renderNav();
  },
  renderNav() {
    const items = [['today', 'navToday'], ['week', 'navWeek'], ['notes', 'navNotes'], ['rewards', 'navRewards'], ['stats', 'navStats']];
    $('#nav').innerHTML = '<div class="nav-in">' + items.map(([v, k]) => '<button data-nav="' + v + '" class="' + (this.view === v ? 'on' : '') + '" aria-label="' + esc(t(k)) + '"' + (this.view === v ? ' aria-current="page"' : '') + '><span class="i">' + ICONS[v] + '</span>' + esc(t(k)) + '</button>').join('') + '</div>';
    $('#fab').setAttribute('aria-label', t('addHabit'));
  },
  onClick(e) {
    const el = e.target.closest('[data-nav],[data-act],[data-toggle],[data-edit],[data-day]'); if (!el) return;
    if (el.dataset.nav) return this.go(el.dataset.nav);
    if (el.dataset.toggle) return this.toggle(el.dataset.toggle, el);
    if (el.dataset.edit) { const h = Store.state.habits.find(x => x.id === el.dataset.edit); return h && openHabitForm(h); }
    if (el.dataset.day) { this.sel = el.dataset.day; if (this.view !== 'today') return this.go('today'); return this.render(); }
    const a = el.dataset.act;
    if (a === 'add') openHabitForm(null, this.view === 'today' ? (this.sel || todayISO()) : todayISO());
    else if (a === 'settings') this.go('settings');
    else if (a === 'theme') { Store.state.settings.theme = Store.state.settings.theme === 'light' ? 'dark' : 'light'; Store.save(); this.applyTheme(); if (this.view === 'settings') this.render(); }
  },
  toggle(hid, btn) {
    const s = Store.state, iso = this.sel || todayISO(), today = todayISO();
    if (iso > today) return;
    const before = computeAll(s, today), lvB = levelInfo(before.totalXp).level;
    const nowDone = Store.toggle(iso, hid);
    const after = computeAll(s, today), lv = levelInfo(after.totalXp);
    const row = btn.closest('.task');
    if (row) { row.classList.toggle('done', nowDone); row.classList.remove('pop'); void row.offsetWidth; if (nowDone) row.classList.add('pop'); btn.setAttribute('aria-pressed', nowDone); }
    if (nowDone) {
      const r = btn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2);
      if (navigator.vibrate) navigator.vibrate(18);
      const gain = after.totalXp - before.totalXp; if (gain > 0) toast(t('gotXp', { n: fmtNum(gain) }), 'xp', 1300);
    }
    // fire: heating up, ignition at 7, milestones after
    if (after.streak > before.streak) {
      const n = after.streak, key = (after.streakStart || '') + ':' + n;
      if (FIRE_MILESTONES.includes(n) && !s.meta.celebrated[key]) {
        s.meta.celebrated[key] = 1; Store.save();
        const fire = (s.settings.display || 'fire') === 'fire';
        setTimeout(() => celebrate({ html: '<div class="emo">' + commitIcon(n, 96) + '</div>', title: n === 7 && fire ? t('fireTitle') : t('daysN', { n: fmtNum(n) }), text: commitMsg(n), cls: fire ? 'firec' : '', colors: fire ? ['#FFB020', '#FF7A1A', '#FF4D1A', '#FFD54D'] : null }), 450);
      } else if (n < 7) setTimeout(() => toast(heatLine(n), (s.settings.display || 'fire') === 'fire' ? 'fire' : 'xp', 1800), 700);
    }
    if (lv.level > lvB && lv.level > (s.meta.lastLevel || 1)) {
      s.meta.lastLevel = lv.level; Store.save();
      setTimeout(() => celebrate({ html: '<div class="lvlnum">' + fmtNum(lv.level) + '</div>', title: t('levelUp'), text: t('levelUpSub', { t: lv.title }) }), 900);
    }
    checkChallenge(after);
    clearTimeout(this._rt); this._rt = setTimeout(() => this.render(), 650);
  }
};
document.addEventListener('DOMContentLoaded', () => App.init());
