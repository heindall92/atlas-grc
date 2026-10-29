/* Atlas GRC · estado y progreso.
   Todo se guarda en este navegador (localStorage). Cada norma tiene su propio progreso. */
(function () {
  const KEY = 'atlas-grc.v1';
  const BOXES = [0, 1, 3, 7, 14, 30];      // días de espera por caja (Leitner)
  const day = (d = new Date()) => {
    const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return z.toISOString().slice(0, 10);
  };
  const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return day(d); };

  const blank = () => ({v: 1, theme: null, track: 'iso27001', booted: false, xp: 0, days: {}, goal: 60, tracks: {}});
  let S;
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = blank(); }

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* modo privado: se sigue sin guardar */ } };
  const tr = (id = S.track) => S.tracks[id] || (S.tracks[id] = {lessons: {}, labs: {}, boss: {}, cards: {}, mistakes: {}, known: {}, exams: []});
  const today = () => S.days[day()] || (S.days[day()] = {xp: 0, mins: 0, lessons: 0, cards: 0});

  const listeners = new Set();
  const emit = (what) => listeners.forEach(f => f(what));

  const Store = {
    day, addDays, BOXES,
    get s() { return S; },
    tr,
    today,
    on(f) { listeners.add(f); return () => listeners.delete(f); },
    save,
    set(k, v) { S[k] = v; save(); emit(k); },

    addXP(n) {
      if (!n) return;
      S.xp += n; today().xp += n; save(); emit('xp');
    },
    addMinutes(m) { today().mins += m; save(); },

    streak() {
      let n = 0, d = day();
      if (!(S.days[d] && S.days[d].xp > 0)) d = addDays(d, -1);   // hoy aún no cuenta hasta que estudies
      while (S.days[d] && S.days[d].xp > 0) { n++; d = addDays(d, -1); }
      return n;
    },
    bestStreak() {
      const ds = Object.keys(S.days).filter(k => S.days[k].xp > 0).sort();
      let best = 0, cur = 0, prev = null;
      ds.forEach(k => { cur = prev && addDays(prev, 1) === k ? cur + 1 : 1; best = Math.max(best, cur); prev = k; });
      return best;
    },

    /* Lecciones, prácticas y jefes */
    lessonDone(u) { return !!tr().lessons[u]; },
    finishLesson(u) {
      const first = !tr().lessons[u];
      tr().lessons[u] = day(); if (first) today().lessons++;
      save(); emit('progress'); return first;
    },
    lab(id) { return tr().labs[id] || null; },
    finishLab(id, score) {
      const prev = tr().labs[id];
      const best = Math.max(score, prev ? prev.best : 0);
      tr().labs[id] = {best, first: prev ? prev.first : score, last: day()};
      save(); emit('progress');
      return {best, newUser: score >= .7 && (!prev || prev.best < .7), newRoot: score >= 1 && (!prev || prev.best < 1)};
    },
    boss(u) { return tr().boss[u] || null; },
    finishBoss(u, won, score) {
      const prev = tr().boss[u];
      tr().boss[u] = {won: won || (prev && prev.won), best: Math.max(score, prev ? prev.best : 0), last: day()};
      save(); emit('progress');
      return {firstWin: won && !(prev && prev.won)};
    },

    /* Repaso espaciado de tarjetas (glosario) */
    card(term) { return tr().cards[term] || null; },
    dueCards(terms) {
      const t = day();
      return terms.filter(term => { const c = tr().cards[term]; return !c || c.due <= t; });
    },
    gradeCard(term, ok) {
      const c = tr().cards[term] || {box: 0};
      c.box = ok ? Math.min(c.box + 1, BOXES.length - 1) : 1;
      c.due = addDays(day(), BOXES[c.box]);
      tr().cards[term] = c; today().cards++;
      save(); emit('cards');
    },

    /* Mis errores: cada pregunta fallada vuelve a los 1, 3 y 7 días */
    addMistake(key, item, src) {
      const m = tr().mistakes[key] || {box: 0};
      m.item = item; m.src = src; m.box = 0; m.due = addDays(day(), 1);
      tr().mistakes[key] = m; save();
    },
    dueMistakes() {
      const t = day();
      return Object.entries(tr().mistakes).filter(([, m]) => m.due <= t).map(([k, m]) => Object.assign({key: k}, m));
    },
    gradeMistake(key, ok) {
      const m = tr().mistakes[key]; if (!m) return;
      if (ok) {
        m.box++;
        if (m.box >= 3) delete tr().mistakes[key];
        else m.due = addDays(day(), [1, 3, 7][m.box]);
      } else { m.box = 0; m.due = addDays(day(), 1); }
      save();
    },

    toggleKnown(n) { const k = tr().known; if (k[n]) delete k[n]; else k[n] = 1; save(); emit('known'); return !!k[n]; },
    addExam(r) { tr().exams.unshift(r); tr().exams = tr().exams.slice(0, 20); save(); emit('progress'); },

    reset() { S = blank(); S.booted = true; save(); emit('all'); },
    exportJSON() { return JSON.stringify(S, null, 1); },
    importJSON(txt) { const o = JSON.parse(txt); if (!o || typeof o !== 'object' || !o.tracks) throw new Error('No es una copia de Atlas'); S = Object.assign(blank(), o); save(); emit('all'); }
  };
  window.Store = Store;
})();
