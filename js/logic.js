/* Scheduling, scoring, streaks, levels — pure functions over the state. */
const STREAK_THRESHOLD = 0.5;   // a day counts toward the streak at >= 50% done
const PERFECT_BONUS = 20;
const FIRE_MILESTONES = [7, 14, 30, 60, 100, 180, 365];

function planEnd(plan) { return addDays(plan.start, plan.days - 1); }
function isRest(state, iso) { return state.plan.restDays.includes(weekday(iso)); }

function isScheduled(h, iso) {
  if (h.created && iso < h.created) return false;
  if (h.deletedAt && iso >= h.deletedAt) return false;
  if (h.repeat === 'once') return h.date === iso;
  if (h.repeat === 'days') return (h.days || []).includes(weekday(iso));
  return true; // daily
}

function habitsFor(state, iso) {
  return state.habits.filter(h => isScheduled(h, iso))
    .sort((a, b) => (a.time || '99') < (b.time || '99') ? -1 : (a.time || '99') > (b.time || '99') ? 1 : 0);
}

function dayStats(state, iso) {
  const list = habitsFor(state, iso);
  const done = list.filter(h => Store.isDone(iso, h.id)).length;
  return { list, done, total: list.length, rest: isRest(state, iso) };
}

/* Walk every day from plan start to today and derive XP, streaks and history. */
function computeAll(state, today) {
  today = today || todayISO();
  const start = state.plan.start, out = { days: [], totalXp: 0, streak: 0, best: 0, perfect: 0, tasksDone: 0, sumDone: 0, sumTotal: 0, streakStart: null };
  if (today < start) return out;
  const byId = {}; state.habits.forEach(h => { byId[h.id] = h; });
  let streak = 0, streakStart = null;
  for (let iso = start; iso <= today; iso = addDays(iso, 1)) {
    const s = dayStats(state, iso);
    const doneIds = Object.keys(state.log[iso] || {}).filter(id => byId[id]);
    let xp = doneIds.reduce((a, id) => a + (Number(byId[id].xp) || 10), 0);
    let status = 'neutral', bonus = 0;
    out.tasksDone += doneIds.length;
    if (!s.rest && s.total > 0) {
      const r = s.done / s.total;
      out.sumDone += s.done; out.sumTotal += s.total;
      if (r >= STREAK_THRESHOLD) {
        streak++; if (streak === 1) streakStart = iso;
        bonus = Math.min(5 * streak, 50); status = 'success';
        if (r === 1) { bonus += PERFECT_BONUS; out.perfect++; status = 'perfect'; }
      } else if (iso === today) { status = 'pending'; }
      else { streak = 0; streakStart = null; status = 'miss'; }
    } else if (s.rest) status = 'rest';
    xp += bonus;
    out.totalXp += xp; out.best = Math.max(out.best, streak);
    out.days.push({ iso, xp, bonus, done: s.done, total: s.total, rest: s.rest, status });
  }
  out.streak = streak; out.streakStart = streakStart;
  out.completion = out.sumTotal ? Math.round(100 * out.sumDone / out.sumTotal) : 0;
  return out;
}

/* Level n -> n+1 costs 100*n XP. */
function levelInfo(xp) {
  let level = 1, need = 100, floor = 0;
  while (xp >= floor + need) { floor += need; level++; need = 100 * level; }
  const titles = t('titles');
  return { level, floor, need, into: xp - floor, pct: Math.min(100, Math.round(100 * (xp - floor) / need)), title: titles[Math.min(level - 1, titles.length - 1)] };
}

function fireStage(streak) {
  if (streak >= 100) return 5; if (streak >= 30) return 4; if (streak >= 14) return 3; if (streak >= 7) return 2; if (streak >= 1) return 1; return 0;
}

function weekStartOf(state, iso) { const wd = weekday(iso); const off = (wd - state.settings.weekStart + 7) % 7; return addDays(iso, -off); }
