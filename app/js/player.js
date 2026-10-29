/* Atlas GRC · reproductor en modo foco: lecciones, prácticas, jefes, repaso de errores y simulacro. */
(function () {
  const {h, icon, rich, drawer, toast, confetti, xpFloat, beep, holdButton} = UI;

  /* Diagramas dentro de las lecciones */
  function diagram(d) {
    if (d.dia === 'pdca') return h('div.diagram', h('div.pdca',
      h('div.p', h('b', 'P · Planificar'), h('small', 'Política, objetivos, procesos y cómo tratar el riesgo.')),
      h('div.d', h('b', 'D · Hacer'), h('small', 'Implantar y operar los controles y procesos.')),
      h('div.a', h('b', 'A · Actuar'), h('small', 'Acciones correctivas para mejorar. Y vuelta a empezar.')),
      h('div.c', h('b', 'C · Verificar'), h('small', 'Medir, auditar y revisión por la dirección.'))));
    if (d.dia === 'cia') return h('div.diagram', h('div.triad',
      h('div', {style: {'--c': '#5e5ce6'}}, h('b', 'C'), h('span', 'Confidencialidad')),
      h('div', {style: {'--c': '#ff9f0a'}}, h('b', 'I'), h('span', 'Integridad')),
      h('div', {style: {'--c': '#34c759'}}, h('b', 'D'), h('span', 'Disponibilidad'))));
    if (d.dia === 'dciat') return h('div.diagram', h('div.triad', {style: {gridTemplateColumns: 'repeat(5,1fr)'}},
      [['D', 'Disponib.', '#34c759'], ['C', 'Confid.', '#5e5ce6'], ['I', 'Integridad', '#ff9f0a'], ['A', 'Autentic.', '#bf5af2'], ['T', 'Trazabil.', '#30b0c7']]
        .map(([l, t, c]) => h('div', {style: {'--c': c}}, h('b', l), h('span', t)))));
    if (d.dia === 'riskmatrix') {
      const L = ['MB', 'B', 'M', 'A', 'MA'];
      const col = (s) => s <= 3 ? '#34c759' : s <= 5 ? '#a3d93b' : s <= 6 ? '#ffcc00' : s <= 7 ? '#ff9f0a' : '#ff3b30';
      const g = h('div.rmx');
      g.append(h('span.rmx-y', 'Impacto'));
      [4, 3, 2, 1, 0].forEach(i => { g.append(h('b', L[i])); L.forEach((_, p) => g.append(h('i', {style: {background: col(i + p + 2)}}))); });
      g.append(h('span'), ...L.map(l => h('b', l)));
      return h('div.diagram', g, h('div.rmx-x', 'Probabilidad →'));
    }
    if (d.dia === 'flow') {
      const row = h('div.flow');
      d.items.forEach((t, i) => { if (i) row.append(icon('arrow-right')); row.append(h('span', t)); });
      return h('div.diagram', row);
    }
    return null;
  }

  function ideaSlide(s, T) {
    const body = h('div.body');
    (s.body || []).forEach(b => {
      if (typeof b === 'string') body.append(h('p', {html: rich(b)}));
      else if (b.ul) body.append(h('ul', b.ul.map(([m, t]) => h('li', h('span.bul' + (m.startsWith('i:') ? '.ic' : ''), m.startsWith('i:') ? icon(m.slice(2)) : m), h('span', {html: rich(t)})))));
      else if (b.dia) { const d = diagram(b); d && body.append(d); }
    });
    const callouts = [];
    if (s.plain) callouts.push(h('div.callout.plain', icon('lightbulb'), h('div', h('b', 'En cristiano'), h('span', {html: rich(s.plain)}))));
    if (s.case) callouts.push(h('div.callout.case', icon('briefcase'), h('div', h('b', 'Caso Albatrel'), h('span', {html: rich(s.case)}))));
    if (s.cls) callouts.push(h('div.callout.added', icon('book-open'), h('div', h('b', 'Ejemplo de clase'), h('span', {html: rich(s.cls)}))));
    if (s.exam) callouts.push(h('div.callout.exam', icon('target'), h('div', h('b', 'Para el examen'), h('span', {html: rich(s.exam)}))));
    if (s.web) callouts.push(h('div.callout.web', icon('globe'), h('div', h('b', 'Fuente web · ' + s.web.src), h('span', 'Este dato no viene del material del curso. '), h('a.link', {href: s.web.url, target: '_blank', rel: 'noopener noreferrer'}, 'Ver la fuente'))));
    if (s.added) callouts.push(h('div.callout.added', icon('book-open'), h('div', h('b', 'De la norma'), h('span', 'Parte de esta tarjeta sale del texto de la norma o de un análisis propio, no de las diapositivas.'))));
    return h('div.idea',
      h('div.k', icon('sparkles'), s.k || 'Idea'),
      h('h2', s.t), body, callouts,
      s.refs && s.refs.length ? h('div.refs.slide-refs', s.refs.map(r => App.refChip(r))) : null);
  }

  /* Contenido de la hoja de respuesta */
  function feedback(ok, item, api, onNext, opts = {}) {
    const why = item.why || '';
    const wrap = h('div.fb' + (ok ? '.ok' : '.ko'),
      h('div.fb-h', h('div.fb-ico', icon(ok ? 'check' : 'x')),
        h('div', h('b', ok ? pick(['¡Correcto!', '¡Bien!', '¡Eso es!', '¡Perfecto!']) : (opts.timeout ? 'Se acabó el tiempo' : 'No exactamente')),
          h('small', ok ? (opts.xp ? '+' + opts.xp + ' XP' : '') : 'Respuesta correcta: ' + App.withTitle(api.answerText)))),
      why ? h('p.fb-why', {html: rich(why)}) : null,
      h('div.fb-row', h('div.refs', item.ref ? App.refChip(item.ref) : null, item.src ? h('span.tag', item.src) : null),
        h('button.btn.primary.press', {type: 'button', id: 'fb-next', onclick: onNext}, opts.last ? 'Terminar' : 'Continuar', icon('arrow-right'))));
    return wrap;
  }
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  /* ── Reproductor genérico ── */
  function run(cfg) {
    // cfg: {title, steps:[{idea}|{ex}], mode:'lesson'|'lab'|'boss'|'review', onFinish(result), backHref}
    const main = document.getElementById('main');
    document.body.classList.add('focus');
    const steps = cfg.steps;
    let i = 0, lives = 3, combo = 0, score = 0, graded = 0, results = [], dir = 1, sheet = null, cur = null, timerId = null, tLeft = 30, finished = false;

    const bar = h('div.bar', h('i'));
    const livesEl = cfg.mode === 'boss' ? h('div.lives', [0, 1, 2].map(() => icon('heart'))) : null;
    const timerEl = cfg.mode === 'boss' ? h('div.timer', {title: 'Tiempo'}, svgTimer(), h('b', '30')) : null;
    const comboEl = h('div.combo');
    const stage = h('div.stage');
    const footBtn = h('button.btn.primary.lg.press', {type: 'button'}, 'Continuar');
    const backBtn = h('button.btn.ghost.press', {type: 'button', hidden: true}, icon('arrow-left'), 'Atrás');
    const hint = h('span.hint');
    const foot = h('div.p-foot', h('div.p-foot-in', h('div', {style: {display: 'flex', gap: '8px', alignItems: 'center'}}, backBtn, hint), footBtn));
    const exit = h('button.ib.press', {type: 'button', 'aria-label': 'Salir', onclick: () => leave()}, icon('x'));
    const view = h('div.player',
      h('div.p-top', exit, bar, livesEl, timerEl, comboEl),
      h('div.p-title', cfg.title), stage, foot);
    main.textContent = ''; main.append(view);
    scrollTo(0, 0);

    function leave() {
      if (!finished && i > 0 && !confirm('¿Salir? Perderás el progreso de esta sesión.')) return;
      cleanup(); location.hash = cfg.backHref || '#/';
    }
    function cleanup() {
      clearInterval(timerId); sheet && sheet.close(); sheet = null;
      document.body.classList.remove('focus'); document.removeEventListener('keydown', onKey);
    }
    App.onLeave(cleanup);

    function setBar() { bar.firstChild.style.setProperty('--v', i / steps.length); }

    function show() {
      setBar();
      if (i >= steps.length) return finish();
      const st = steps[i];
      stage.textContent = '';
      const box = h('div.slide' + (dir < 0 ? '.back-dir' : ''));
      backBtn.hidden = !(cfg.mode === 'lesson' && i > 0 && st.idea);
      if (st.idea) {
        cur = null;
        box.append(ideaSlide(st.idea, App.T()));
        footBtn.textContent = i === steps.length - 1 ? 'Terminar' : 'Continuar';
        footBtn.disabled = false; hint.textContent = '';
        footBtn.onclick = () => { dir = 1; i++; show(); };
      } else {
        const item = st.ex;
        cur = Ex.render(item);
        box.append(cur.el);
        footBtn.textContent = 'Comprobar'; footBtn.disabled = true;
        hint.textContent = item.k === 'choice' || item.k === 'tf' ? 'Atajos: 1-4 · Intro' : '';
        cur.onChange = () => { footBtn.disabled = !cur.ready(); };
        footBtn.onclick = () => grade();
        if (cfg.mode === 'boss') startTimer();
      }
      stage.append(box);
      footBtn.focus({preventScroll: true});
    }

    function svgTimer() {
      const ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg');
      s.setAttribute('viewBox', '0 0 36 36');
      s.innerHTML = '<circle class="t-bg" cx="18" cy="18" r="15"/><circle class="t-fg" cx="18" cy="18" r="15" stroke-dasharray="94.25" stroke-dashoffset="0"/>';
      return s;
    }
    function startTimer() {
      clearInterval(timerId); tLeft = 30; paintTimer();
      timerId = setInterval(() => { tLeft--; paintTimer(); if (tLeft <= 0) { clearInterval(timerId); grade(true); } }, 1000);
    }
    function paintTimer() {
      if (!timerEl) return;
      timerEl.querySelector('b').textContent = Math.max(0, tLeft);
      timerEl.querySelector('.t-fg').setAttribute('stroke-dashoffset', 94.25 * (1 - tLeft / 30));
      timerEl.classList.toggle('low', tLeft <= 8);
    }

    function grade(timeout) {
      if (!cur || sheet) return;
      clearInterval(timerId);
      const item = steps[i].ex;
      let r = timeout ? {ok: false} : cur.check();
      if (timeout) { cur.el.querySelectorAll('button,.tile').forEach(b => b.disabled = true); }
      if (!r.ok && cur.reveal) cur.reveal();
      const val = r.ok ? 1 : (r.partial && r.partial >= .5 ? r.partial * .5 : 0);
      score += val; graded++;
      results.push({item, ok: r.ok});
      let xp = 0;
      if (r.ok) {
        combo++; xp = cfg.mode === 'lesson' ? 2 : cfg.mode === 'review' ? 3 : 5 + Math.min(combo - 1, 5);
        Store.addXP(xp); xpFloat(footBtn, xp); beep('ok');
      } else {
        combo = 0; beep('ko');
        if (cfg.mode !== 'lesson' && cfg.mode !== 'review') Store.addMistake(cfg.keyOf(item), item, cfg.title);
        if (cfg.mode === 'boss') { lives--; paintLives(); }
      }
      if (cfg.onGrade) cfg.onGrade(item, r.ok);
      comboEl.textContent = ''; if (combo >= 2) comboEl.append(icon('flame'), '×' + combo);
      const last = i === steps.length - 1 || (cfg.mode === 'boss' && lives <= 0);
      footBtn.disabled = true;
      sheet = drawer(feedback(r.ok, item, cur, next, {xp, last, timeout}), {onClose: () => { if (sheet) { sheet = null; next(); } }});
      setTimeout(() => { const b = document.getElementById('fb-next'); b && b.focus({preventScroll: true}); }, 50);
    }
    function next() {
      if (sheet) { const s = sheet; sheet = null; s.close(); }
      if (cfg.mode === 'boss' && lives <= 0) return finish();
      dir = 1; i++; show();
    }
    function paintLives() {
      [...livesEl.children].forEach((e, k) => e.classList.toggle('lost', k >= lives));
      livesEl.classList.add('shake'); setTimeout(() => livesEl.classList.remove('shake'), 400);
    }

    function finish() {
      finished = true; clearInterval(timerId);
      bar.firstChild.style.setProperty('--v', 1);
      const pct = graded ? score / graded : 1;
      const res = cfg.onFinish({pct, lives, results, graded});
      foot.remove(); backBtn.hidden = true;
      const top = view.querySelector('.p-top'); top && top.remove();
      stage.textContent = '';
      stage.append(resultView(res));
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('focus');
    }

    function resultView(res) {
      const wrong = results.filter(r => !r.ok);
      const v = h('div.result.blur-in',
        h('div.medal.' + (res.medal || 'track'), icon(res.icon || 'trophy')),
        h('h2', res.title),
        res.score != null ? h('div.score', res.score) : null,
        res.text ? h('p.lede', {style: {textAlign: 'center'}}, res.text) : null,
        res.stats ? h('div.stats', res.stats.map(s => h('span', s))) : null,
        h('div', {style: {display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px'}},
          res.retry ? h('button.btn.press', {type: 'button', onclick: res.retry}, icon('rotate-ccw'), 'Repetir') : null,
          h('a.btn.primary.press', {href: res.next || cfg.backHref || '#/'}, res.nextLabel || 'Continuar', icon('arrow-right'))),
        wrong.length ? h('div.review', h('h3', {style: {marginTop: '10px'}}, 'Para repasar'),
          wrong.map(r => h('div.rv', h('b', {html: rich(r.item.q)}), h('small', h('span.ok', icon('check')), ' ', App.withTitle(Ex.render(r.item).answerText), r.item.why ? ' — ' + r.item.why : '')))) : null);
      if (res.confetti) setTimeout(() => confetti(), 200);
      return v;
    }

    function onKey(e) {
      if (e.target.matches('input,textarea')) return;
      if (e.key === 'Enter') {
        if (sheet) { e.preventDefault(); next(); return; }
        const ae = document.activeElement;
        if (ae && ae.matches('.opt') && !ae.disabled) { e.preventDefault(); ae.click(); }
        else if (ae && ae.matches('.mt,.tile,.bucket,a')) return;
        if (!footBtn.disabled) { e.preventDefault(); footBtn.click(); }
      } else if (e.key === 'Escape' && !sheet) leave();
      else if (cur && !sheet && cur.key && /^[1-9vfVF]$/.test(e.key)) cur.key(e.key);
      else if (e.key === 'ArrowRight' && !cur && !sheet) footBtn.click();
      else if (e.key === 'ArrowLeft' && !backBtn.hidden) backBtn.click();
    }
    document.addEventListener('keydown', onKey);
    backBtn.onclick = () => { dir = -1; i--; while (i > 0 && !steps[i].idea) i--; show(); };
    show();
  }

  /* ── Simulacro de examen (tipo CertiProf) ── */
  function exam(cfg) {
    // cfg: {qs:[item], minutes, pass, title}
    const main = document.getElementById('main');
    document.body.classList.add('focus');
    const qs = cfg.qs, ans = new Array(qs.length).fill(null), flags = new Set();
    let i = 0, left = cfg.minutes * 60, timerId, done = false;
    const clock = h('b.mono', '');
    const qnav = h('div.qnav');
    const stage = h('div.stage', {style: {paddingBottom: '160px'}});
    const prev = h('button.btn.press', {type: 'button'}, icon('arrow-left'), 'Anterior');
    const nextB = h('button.btn.primary.press', {type: 'button'}, 'Siguiente', icon('arrow-right'));
    const flagB = h('button.btn.ghost.press', {type: 'button'}, icon('flag'), 'Marcar');
    const submit = holdButton('Mantén para entregar', 1200, () => finish(), 'dark');
    const bar = h('div.bar', h('i'));
    const view = h('div.player',
      h('div.p-top', h('button.ib.press', {type: 'button', 'aria-label': 'Salir', onclick: () => { if (confirm('¿Abandonar el simulacro?')) { cleanup(); location.hash = '#/examen'; } }}, icon('x')), bar, h('span.chip', icon('timer'), clock)),
      h('div.p-title', cfg.title), qnav, stage,
      h('div.p-foot', h('div.p-foot-in', h('div', {style: {display: 'flex', gap: '8px'}}, prev, flagB), h('div', {style: {display: 'flex', gap: '8px'}}, submit, nextB))));
    main.textContent = ''; main.append(view); scrollTo(0, 0);
    const cleanup = () => { clearInterval(timerId); document.body.classList.remove('focus'); document.removeEventListener('keydown', onKey); };
    App.onLeave(cleanup);

    function tick() {
      left--; const m = Math.floor(left / 60), s = left % 60;
      clock.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      if (left === 300) toast('Quedan 5 minutos', {icon: 'timer'});
      if (left <= 0) finish();
    }
    function paintNav() {
      qnav.textContent = '';
      qs.forEach((_, k) => qnav.append(h('button', {type: 'button', class: [ans[k] != null ? 'ans' : '', k === i ? 'cur' : '', flags.has(k) ? 'flagged' : ''].join(' '), onclick: () => { i = k; show(); }, 'aria-label': 'Pregunta ' + (k + 1)}, k + 1)));
      bar.firstChild.style.setProperty('--v', ans.filter(a => a != null).length / qs.length);
    }
    function show() {
      const q = qs[i];
      stage.textContent = '';
      const keep = q.k === 'tf' || q.opts.some(o => /todas las anteriores|ninguna|^[a-d](,| y) /i.test(o));
      q._order = q._order || (keep ? (q.k === 'tf' ? [true, false] : q.opts.map((_, k) => k)) : Ex.shuffle(q.opts.map((_, k) => k)));
      const opts = q._order.map((v, k) => {
        const txt = q.k === 'tf' ? (v ? 'Verdadero' : 'Falso') : q.opts[v];
        const sub = null;
        return h('button.opt', {type: 'button', 'aria-pressed': String(ans[i] === v), onclick: () => { ans[i] = v; show(); }},
          h('span.key', q.k === 'tf' ? (v ? 'V' : 'F') : 'ABCD'[k]), h('span', txt, sub ? h('span.sub', sub) : null));
      });
      stage.append(h('div.slide', h('div.ex-k', 'Pregunta ' + (i + 1) + ' de ' + qs.length, q.src ? ' · ' + q.src : ''),
        h('div.ex-q', {html: rich(q.q)}), h('div.opts' + (q.k === 'tf' ? '.tf' : ''), opts)));
      prev.disabled = i === 0; nextB.disabled = i === qs.length - 1;
      flagB.lastChild.textContent = flags.has(i) ? 'Desmarcar' : 'Marcar';
      paintNav();
    }
    prev.onclick = () => { if (i > 0) { i--; show(); } };
    nextB.onclick = () => { if (i < qs.length - 1) { i++; show(); } };
    flagB.onclick = () => { flags.has(i) ? flags.delete(i) : flags.add(i); show(); };
    function onKey(e) {
      if (e.key === 'ArrowRight') nextB.click(); else if (e.key === 'ArrowLeft') prev.click();
      else if (/^[1-4a-dA-D]$/.test(e.key)) { const k = isNaN(+e.key) ? 'abcd'.indexOf(e.key.toLowerCase()) : +e.key - 1; const q = qs[i]; if (q._order[k] != null) { ans[i] = q._order[k]; show(); } }
    }
    document.addEventListener('keydown', onKey);
    function finish() {
      if (done) return; done = true; cleanup();
      const res = qs.map((q, k) => ({q, a: ans[k], ok: ans[k] === q.a}));
      const good = res.filter(r => r.ok).length, pct = good / qs.length, pass = pct >= cfg.pass;
      res.filter(r => !r.ok).forEach(r => Store.addMistake('exam:' + r.q.id, r.q, 'Simulacro'));
      Store.addXP(good * 2);
      Store.addExam({date: Store.day(), good, n: qs.length, pct, pass, mins: Math.round((cfg.minutes * 60 - left) / 60)});
      if (pass) { confetti(); beep('win'); }
      main.textContent = '';
      const ansTxt = (q, a) => a == null ? 'Sin responder' : q.k === 'tf' ? (a ? 'Verdadero' : 'Falso') : App.withTitle(q.opts[a]);
      main.append(h('div.view.narrow', h('div.result.blur-in',
        h('div.medal.' + (pass ? 'gold' : 'grey'), icon(pass ? 'award' : 'rotate-ccw')),
        h('h2', pass ? '¡Aprobado!' : 'Todavía no'),
        h('div.score', Math.round(pct * 100) + ' %'),
        h('p.lede', {style: {textAlign: 'center'}}, `${good} de ${qs.length} correctas. Para aprobar necesitas un ${Math.round(cfg.pass * 100)} %.`),
        h('div', {style: {display: 'flex', gap: '10px'}}, h('a.btn.press', {href: '#/examen'}, 'Volver'), h('a.btn.primary.press', {href: '#/repaso'}, 'Repasar mis errores')),
        h('div.review', res.map((r, k) => h('div.rv', h('b', {html: (k + 1) + '. ' + rich(r.q.q)}),
          h('small', h('span', {class: r.ok ? 'ok' : 'ko'}, icon(r.ok ? 'check' : 'x')), ' ', 'Tu respuesta: ' + ansTxt(r.q, r.a), r.ok ? '' : ' · Correcta: ' + ansTxt(r.q, r.q.a)),
          r.q.why ? h('small', r.q.why) : null))))));
      scrollTo(0, 0);
    }
    left++; tick(); timerId = setInterval(tick, 1000);
    show();
  }

  window.Player = {run, exam, ideaSlide};
})();
