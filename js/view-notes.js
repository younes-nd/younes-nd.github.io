/* Notes: one general note + one note per day, autosaved. */
function renderNotes(root) {
  const s = Store.state, today = todayISO(), sel = App.noteDay || today;
  const past = Object.keys(s.notes.days).filter(d => s.notes.days[d] && s.notes.days[d].trim() && d !== sel).sort().reverse();
  root.innerHTML = topbarHTML() +
    '<div class="section-h" style="margin-top:4px"><h2>' + esc(sel === today ? t('dayNote') : fmtDate(sel, { weekday: 'long', day: 'numeric', month: 'long' })) + '</h2>' +
    (sel !== today ? '<button class="pill" data-nday="' + today + '">' + esc(t('today')) + '</button>' : '<span class="pill">' + esc(fmtDate(today)) + '</span>') + '</div>' +
    '<div class="card"><textarea class="input" id="nDay" placeholder="' + esc(t('notePh')) + '" aria-label="' + esc(t('dayNote')) + '">' + esc(s.notes.days[sel] || '') + '</textarea></div>' +
    '<div class="section-h"><h2>' + esc(t('generalNote')) + '</h2></div>' +
    '<div class="card"><textarea class="input" id="nGen" style="min-height:150px" placeholder="' + esc(t('notePh')) + '" aria-label="' + esc(t('generalNote')) + '">' + esc(s.notes.general || '') + '</textarea></div>' +
    '<div class="section-h"><h2>' + esc(t('pastNotes')) + '</h2></div>' +
    (past.length ? past.map(d => '<button class="card note-item" data-nday="' + d + '"><div class="d">' + esc(fmtDate(d, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })) + '</div><div class="tx">' + esc(s.notes.days[d]) + '</div></button>').join('') : '<p class="info" style="text-align:center">' + esc(t('noNotes')) + '</p>');
  let tm;
  const save = () => { clearTimeout(tm); tm = setTimeout(() => { const v = $('#nDay', root).value; if (v.trim()) s.notes.days[sel] = v; else delete s.notes.days[sel]; s.notes.general = $('#nGen', root).value; Store.save(); }, 400); };
  $('#nDay', root).addEventListener('input', save); $('#nGen', root).addEventListener('input', save);
  $$('[data-nday]', root).forEach(b => b.onclick = () => { App.noteDay = b.dataset.nday; App.render(); scrollTo(0, 0); });
}
