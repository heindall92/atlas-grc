/* Atlas GRC · estado y progreso.
   Todo se guarda en este navegador (localStorage). Cada norma tiene su propio progreso. */
(function () {
  /* Modo demostración (?demo): progreso de ejemplo guardado aparte; nunca toca el progreso real */
  const DEMO = /[?&]demo(&|$)/.test(location.search);
  const KEY = DEMO ? 'atlas-grc.demo' : 'atlas-grc.v1';
  /* &captura: sin animaciones de entrada (para hacer capturas del README) */
  if (/[?&]captura(&|$)/.test(location.search)) document.documentElement.classList.add('captura');
  const BOXES = [0, 1, 3, 7, 14, 30];      // días de espera por caja (Leitner)
  const day = (d = new Date()) => {
    const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return z.toISOString().slice(0, 10);
  };
  const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return day(d); };

  const blank = () => ({v: 1, theme: null, track: 'iso27001', booted: false, xp: 0, days: {}, goal: 60, tracks: {}});
  let S;
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = blank(); }

  if (DEMO && !S.booted) {
    const t0 = new Date(); const d = (n) => { const x = new Date(t0); x.setDate(x.getDate() - n); return new Date(x.getTime() - x.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
    const days = {}; [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 19, 22].forEach((n, i) => { days[d(n)] = {xp: n === 0 ? 42 : 30 + (i * 17) % 70, mins: 12 + (i * 7) % 25, lessons: n === 0 ? 1 : 1, cards: n === 0 ? 6 : 8}; });
    const lab = (b) => ({best: b, first: b, last: d(3)});
    const L = {}, labs = {}, boss = {};
    ['u0', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u9', 'u10'].forEach(u => { L[u] = d(5); });
    ['u0l1', 'u1l1', 'u1l2', 'u1l3', 'u2l1', 'u2l2', 'u3l1', 'u3l2', 'u4l1', 'u4l2', 'u4l3', 'u5l1', 'u5l2', 'u6l1', 'u6l2', 'u7l1', 'u9l1'].forEach((id, i) => { labs[id] = lab(i % 3 ? 1 : .8); });
    ['u0', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6'].forEach(u => { boss[u] = {won: true, best: .9, last: d(4)}; });
    S = Object.assign(blank(), {booted: true, xp: 1840, days, goal: 60, plan: {goal: 0, level: 0, min: 1},
      tracks: {iso27001: {lessons: L, labs, boss, cards: {}, mistakes: {}, known: {'5.1': 1, '5.2': 1, '5.3': 1, '5.9': 1, '5.15': 1, '8.5': 1, '8.13': 1, '8.8': 1}, docs: {pol: d(2), ctx: d(2), org: d(1), met: d(1)},
        exams: [{date: d(1), good: 33, n: 40, pct: .825, pass: true, mins: 41}, {date: d(8), good: 27, n: 40, pct: .675, pass: false, mins: 52}]}}});
  }
  /* La app siempre abre en modo claro; el oscuro se elige con el botón (y &tema=dark en la demo, para capturas) */
  { const m = location.search.match(/[?&]tema=(light|dark)/); S.theme = DEMO && m ? m[1] : 'light'; }
  /* &piel=coral|indigo: color de la app en la demostración (las capturas del README van en coral) */
  { const m = location.search.match(/[?&]piel=(coral|azul|verde|indigo)/); if (DEMO && m) S.skin = m[1] === 'indigo' ? null : m[1]; }
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

    docBuilt(id) { return !!(tr().docs || {})[id]; },
    markDoc(id) { const d = tr().docs || (tr().docs = {}); const first = !d[id]; d[id] = day(); save(); emit('progress'); return first; },
    toggleKnown(n) { const k = tr().known; if (k[n]) delete k[n]; else k[n] = 1; save(); emit('known'); return !!k[n]; },
    addExam(r) { tr().exams.unshift(r); tr().exams = tr().exams.slice(0, 20); save(); emit('progress'); },

    reset() { S = blank(); S.booted = true; save(); emit('all'); },
    exportJSON() { return JSON.stringify(S, null, 1); },
    importJSON(txt) { const o = JSON.parse(txt); if (!o || typeof o !== 'object' || !o.tracks) throw new Error('No es una copia de Atlas'); S = Object.assign(blank(), o); save(); emit('all'); }
  };
  window.Store = Store;
})();
