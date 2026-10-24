/* Local persistence. Everything lives in this browser (localStorage). */
const STORE_KEY = 'newday:v1';
const AIKEY_KEY = 'newday:aikey'; // kept apart so backups never carry the key

function todayISO(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function parseISO(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(iso, n) { const d = parseISO(iso); d.setDate(d.getDate() + n); return todayISO(d); }
function diffDays(a, b) { return Math.round((parseISO(b) - parseISO(a)) / 86400000); }
function weekday(iso) { return parseISO(iso).getDay(); }
function uid() { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4); }

function defaultState() {
  return {
    v: 1, onboarded: false,
    settings: { lang: 'ar', theme: 'dark', weekStart: 6, display: 'fire' },
    plan: { start: todayISO(), days: 90, preset: 'd3m', restDays: [5] },
    habits: [], log: {}, meta: { celebrated: {}, lastLevel: 1 },
    notes: { general: '', days: {} }, rewards: null, redemptions: [], goal: null, challenges: { active: null, badges: [] }
  };
}

const Store = {
  state: null,
  load() {
    try { const raw = localStorage.getItem(STORE_KEY); this.state = raw ? this.migrate(JSON.parse(raw)) : defaultState(); }
    catch (e) { this.state = defaultState(); }
    return this.state;
  },
  migrate(s) {
    const d = defaultState();
    s.settings = Object.assign(d.settings, s.settings || {});
    s.plan = Object.assign(d.plan, s.plan || {});
    s.meta = Object.assign(d.meta, s.meta || {});
    s.habits = Array.isArray(s.habits) ? s.habits : [];
    s.log = s.log && typeof s.log === 'object' ? s.log : {};
    s.notes = Object.assign({ general: '', days: {} }, s.notes || {});
    if (!Array.isArray(s.redemptions)) s.redemptions = [];
    s.challenges = Object.assign({ active: null, badges: [] }, s.challenges || {}); if (!Array.isArray(s.challenges.badges)) s.challenges.badges = [];
    if (s.rewards !== null && !Array.isArray(s.rewards)) s.rewards = null;
    if (s.goal && typeof s.goal !== 'object') s.goal = null;
    s.v = 1; return s;
  },
  save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(this.state)); } catch (e) { console.warn('save failed', e); } },
  isDone(iso, hid) { return !!(this.state.log[iso] && this.state.log[iso][hid]); },
  toggle(iso, hid) {
    const log = this.state.log; log[iso] = log[iso] || {};
    if (log[iso][hid]) { delete log[iso][hid]; if (!Object.keys(log[iso]).length) delete log[iso]; }
    else log[iso][hid] = 1;
    this.save(); return this.isDone(iso, hid);
  },
  upsertHabit(h) {
    const i = this.state.habits.findIndex(x => x.id === h.id);
    if (i >= 0) this.state.habits[i] = h; else this.state.habits.push(h);
    this.save();
  },
  deleteHabit(id) { const h = this.state.habits.find(x => x.id === id); if (h) { h.deletedAt = todayISO(); this.save(); } },
  exportJSON() { return JSON.stringify({ app: 'newday', exportedAt: new Date().toISOString(), data: this.state }, null, 2); },
  importJSON(text) {
    const o = JSON.parse(text); const s = o && o.app === 'newday' ? o.data : o;
    if (!s || !s.plan || !Array.isArray(s.habits)) throw new Error('bad');
    this.state = this.migrate(s); this.state.onboarded = true; this.save();
  },
  spentPoints() { return this.state.redemptions.reduce((a, r) => a + (Number(r.cost) || 0), 0); },
  reset() { localStorage.removeItem(STORE_KEY); this.state = defaultState(); },
  getAIKey() { try { return localStorage.getItem(AIKEY_KEY) || ''; } catch (e) { return ''; } },
  setAIKey(k) { if (k) localStorage.setItem(AIKEY_KEY, k.trim()); else localStorage.removeItem(AIKEY_KEY); }
};
