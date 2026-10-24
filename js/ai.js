/* Optional AI coach. The person's own key lives in localStorage only and is sent only to the provider.
   Add a provider by adding an entry to AI_PROVIDERS with the same generate(prompt, opts) shape. */
const AI_PROVIDERS = {
  gemini: {
    label: 'Google Gemini',
    base: 'https://generativelanguage.googleapis.com',
    models: ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-flash-lite-latest'],
    async generate(prompt, { key, json, extraHeaders } = {}) {
      let lastErr;
      for (const model of this.models) {
        const res = await fetch(this.base + '/v1beta/models/' + model + ':generateContent', {
          method: 'POST',
          headers: Object.assign({ 'content-type': 'application/json', 'x-goog-api-key': key }, extraHeaders || {}),
          body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: Object.assign({ temperature: 0.8 }, json ? { responseMimeType: 'application/json' } : {}) })
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          const text = (((data.candidates || [])[0] || {}).content || {}).parts;
          const out = (text || []).map(p => p.text || '').join('').trim();
          if (out) return out;
          lastErr = new Error('empty answer'); continue;
        }
        lastErr = new Error(String((data.error && data.error.message) || ('HTTP ' + res.status)).split('\n')[0].slice(0, 160));
        if (![404, 429, 500, 503].includes(res.status)) break; // try the next model when this one is missing, out of free quota, or busy
      }
      throw lastErr;
    }
  }
  // openai: { label: 'OpenAI', async generate(prompt, opts) { ... } }  ← future providers plug in here
};

const AICoach = {
  provider() { return AI_PROVIDERS[(Store.state.settings.aiProvider) || 'gemini']; },
  hasKey() { return !!Store.getAIKey(); },
  langName() { return { ar: 'Arabic (simple, friendly; Algerian readers)', en: 'English', fr: 'French' }[LANG] || 'English'; },
  ask(prompt, json) { return this.provider().generate(prompt, { key: Store.getAIKey(), json }); },

  planPrompt(goal) {
    return 'You are a habit coach inside a habit-tracker app. The user\'s goal: "' + goal.replace(/"/g, "'") + '".\n' +
      'Suggest 4 to 7 concrete, small daily or weekly habits that build toward it. Include at most 2 "bad" habits to quit if relevant.\n' +
      'Write every "name" in ' + this.langName() + ', max 40 characters.\n' +
      'Answer ONLY with JSON: an array of objects {"name": string, "type": "good"|"bad", "days": "daily" or an array of weekday numbers (0=Sunday..6=Saturday), "time": "HH:MM" or "", "icon": one emoji, "xp": 5|10|20}.';
  },
  parsePlan(text) {
    let s = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    let arr = JSON.parse(s); if (!Array.isArray(arr)) arr = arr.habits || arr.items || [];
    return arr.filter(x => x && x.name).slice(0, 10).map(x => ({
      name: String(x.name).slice(0, 60), type: x.type === 'bad' ? 'bad' : 'good',
      repeat: Array.isArray(x.days) ? 'days' : 'daily', days: Array.isArray(x.days) ? x.days.map(Number).filter(d => d >= 0 && d <= 6) : [0, 1, 2, 3, 4, 5, 6],
      time: /^\d\d:\d\d$/.test(x.time || '') ? x.time : '', icon: (x.icon && String(x.icon).length <= 4) ? x.icon : '🎯', xp: [5, 10, 20].includes(Number(x.xp)) ? Number(x.xp) : 10
    }));
  },
  tipPrompt(all, ds) {
    return 'You are a warm, concise habit coach. Write ONE short motivating tip (max 2 sentences, no hashtags) in ' + this.langName() + ' for today.\n' +
      'Context: current streak ' + all.streak + ' days, best ' + all.best + ', overall completion ' + all.completion + '%, today ' + ds.done + ' of ' + ds.total + ' tasks done' + (ds.rest ? ' (rest day)' : '') +
      '. Habits: ' + ds.list.map(h => h.name + (h.type === 'bad' ? ' (quitting)' : '')).join(', ') + '.';
  },

  renderTip(el, all, ds) {
    if (!el || !this.hasKey()) return;
    const k = 'newday:tip:' + todayISO() + ':' + LANG, cached = localStorage.getItem(k);
    const show = txt => { el.innerHTML = '<div class="ai-card"><div class="big">✨</div><div><small>' + esc(t('aiTip')) + '</small><p>' + esc(txt) + '</p></div></div>'; };
    if (cached) return show(cached);
    el.innerHTML = '<div class="ai-card"><span class="spin"></span><p>' + esc(t('aiThinking')) + '</p></div>';
    this.ask(this.tipPrompt(all, ds)).then(txt => { localStorage.setItem(k, txt); show(txt); })
      .catch(e => { el.innerHTML = '<div class="ai-card"><div class="big">⚠️</div><p style="font-size:13px">' + esc(t('aiError', { e: e.message })) + '</p></div>'; });
  },

  renderSettings(el) {
    if (!el) return;
    const has = this.hasKey();
    el.innerHTML = '<h3>' + esc(t('ai')) + '</h3><div class="card"><p class="info" style="margin-top:0">' + esc(t('aiSub')) + '</p>' +
      (has ? '<div class="btn-row"><button class="btn small" data-aibuild>✨ ' + esc(t('aiBuild')) + '</button><button class="btn small ghost" data-airm>' + esc(t('aiRemove')) + '</button></div>'
        : '<div class="field" style="margin-bottom:10px"><label for="aiKey">' + esc(t('aiKey')) + '</label><input id="aiKey" class="input" type="password" autocomplete="off" spellcheck="false" placeholder="AIza…"></div><button class="btn small" data-aisave>' + esc(t('aiSave')) + '</button>') + '</div>';
    const sv = $('[data-aisave]', el); if (sv) sv.onclick = () => { const v = $('#aiKey', el).value.trim(); if (!v) return; Store.setAIKey(v); toast(t('aiKeyOk')); this.renderSettings(el); };
    const rm = $('[data-airm]', el); if (rm) rm.onclick = () => { Store.setAIKey(''); this.renderSettings(el); };
    const bd = $('[data-aibuild]', el); if (bd) bd.onclick = () => this.openBuilder();
  },

  openBuilder() {
    if (!this.hasKey()) return toast(t('aiNoKey'));
    openSheet('<h2>✨ ' + esc(t('aiBuild')) + '</h2><div class="field"><textarea id="aiGoal" class="input" style="min-height:80px" placeholder="' + esc(t('aiGoalPh')) + '"></textarea></div>' +
      '<button class="btn block" data-gen>' + esc(t('aiGenerate')) + '</button><div id="aiOut" style="margin-top:14px"></div>', sh => {
      $('[data-gen]', sh).onclick = async () => {
        const goal = $('#aiGoal', sh).value.trim(); if (!goal) return;
        const out = $('#aiOut', sh); out.innerHTML = '<p class="info"><span class="spin"></span> ' + esc(t('aiThinking')) + '</p>';
        try {
          const list = this.parsePlan(await this.ask(this.planPrompt(goal), true));
          if (!list.length) throw new Error('no habits');
          out.innerHTML = list.map((h, i) => '<label class="sugg"><input type="checkbox" checked data-i="' + i + '"><span class="ico" style="font-size:22px">' + esc(h.icon) + '</span><span class="b"><b>' + esc(h.name) + '</b><small>' +
            esc(h.type === 'bad' ? t('badHabit') : t('goodHabit')) + ' · ' + esc(h.repeat === 'daily' ? t('everyDay') : h.days.map(d => t('dayShort')[d]).join('، ')) + (h.time ? ' · ' + esc(h.time) : '') + '</small></span></label>').join('') +
            '<button class="btn block" data-addsel>' + esc(t('aiAdd')) + '</button>';
          $('[data-addsel]', out).onclick = () => {
            $$('input[type=checkbox]', out).forEach(cb => { if (cb.checked) { const h = list[Number(cb.dataset.i)]; Store.upsertHabit(Object.assign({ id: uid(), created: todayISO(), date: todayISO() }, h)); } });
            closeSheet(); App.go('today'); toast(t('saved'));
          };
        } catch (e) { out.innerHTML = '<p class="err">' + esc(t('aiError', { e: e.message })) + '</p>'; }
      };
    });
  }
};
