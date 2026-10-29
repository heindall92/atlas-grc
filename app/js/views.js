/* Atlas GRC · vistas. */
(function () {
  const {h, icon, rich, rings, toast, panel, holdButton, confetti, beep} = UI;
  const rise = (el, i) => { el.classList.add('rise'); el.style.setProperty('--i', i); return el; };

  /* ── Progreso de una unidad ── */
  function unitState(u) {
    const lesson = Store.lessonDone(u.id);
    const labs = u.labs.map(l => Store.lab(l.id));
    const user = labs.filter(l => l && l.best >= .7).length, root = labs.filter(l => l && l.best >= 1).length;
    const boss = Store.boss(u.id);
    const steps = 1 + u.labs.length + 1;
    const done = (lesson ? 1 : 0) + user + (boss && boss.won ? 1 : 0);
    return {lesson, labs, user, root, boss, won: !!(boss && boss.won), pct: done / steps, complete: lesson && user === u.labs.length && boss && boss.won,
      bossOpen: lesson && user >= 1, gold: lesson && root === u.labs.length && boss && boss.best >= 1};
  }
  function allUnits() { const T = App.T(); return T.modules.filter(m => !m.soon).flatMap(m => m.units.map(id => T.units[id])); }
  function nextStep() {
    for (const u of allUnits()) {
      const s = unitState(u);
      if (!s.lesson) return {u, kind: 'lesson', href: '#/leccion/' + u.id, label: 'Empezar lección', what: 'Lección'};
      const lab = u.labs.find(l => !(Store.lab(l.id) && Store.lab(l.id).best >= .7));
      if (lab) return {u, kind: 'lab', href: '#/lab/' + u.id + '/' + lab.id, label: 'Practicar', what: 'Práctica · ' + lab.t};
      if (!s.won) return {u, kind: 'boss', href: '#/jefe/' + u.id, label: 'Enfrentar al jefe', what: 'Jefe de la unidad'};
    }
    return null;
  }

  /* ═════ Hoy ═════ */
  function today() {
    const T = App.T(), td = Store.today(), nx = nextStep();
    const dueCards = Store.dueCards(T.glossary.map(g => g[0])).length, dueMist = Store.dueMistakes().length;
    const reviewGoal = 10;
    const vals = [Math.min(1, td.lessons / 1), Math.min(1, td.xp / Store.s.goal), (dueCards + dueMist) === 0 && td.cards === 0 ? 0 : Math.min(1, td.cards / reviewGoal)];
    const date = new Date().toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric', month: 'long'});
    const units = allUnits(), doneUnits = units.filter(u => unitState(u).complete).length;

    const hero = nx ? h('section.hero',
      h('div.eyebrow', 'Siguiente paso · Unidad ' + nx.u.n),
      h('h2', nx.u.t),
      h('p', nx.u.s),
      h('div.meta', h('span', icon(nx.kind === 'boss' ? 'swords' : nx.kind === 'lab' ? 'flask-conical' : 'book-open'), nx.what), h('span', icon('timer'), '≈ ' + (nx.kind === 'lesson' ? nx.u.mins : 4) + ' min')),
      h('div.go', h('a.btn.lg.press', {href: nx.href}, icon('play'), nx.label), h('a.btn.lg.glass.press', {href: '#/u/' + nx.u.id}, 'Ver la unidad')),
      h('div.hero-art', icon(nx.u.icon || 'compass')))
      : h('section.hero', h('div.eyebrow', 'Bloques disponibles completados'), h('h2', '¡Lo tienes todo hecho!'), h('p', 'Repasa, haz el simulacro y espera los próximos bloques.'),
        h('div.go', h('a.btn.lg.press', {href: '#/examen'}, icon('graduation-cap'), 'Ir al simulacro')), h('div.hero-art', icon('trophy')));

    const ringCard = h('section.card.rings-card',
      rings(vals),
      h('div.ring-legend',
        h('div', h('i', {style: {background: 'var(--ring-1)'}}), h('b', 'Aprender'), h('span', td.lessons + '/1 ', h('small', 'lección'))),
        h('div', h('i', {style: {background: 'var(--ring-2)'}}), h('b', 'Practicar'), h('span', td.xp + '/' + Store.s.goal + ' ', h('small', 'XP'))),
        h('div', h('i', {style: {background: 'var(--ring-3)'}}), h('b', 'Repasar'), h('span', td.cards + '/' + reviewGoal + ' ', h('small', 'tarjetas')))));

    const quick = [
      ['#/repaso', 'refresh-cw', 'Repaso', dueCards + dueMist ? `${dueCards} tarjetas y ${dueMist} errores esperan` : 'Nada pendiente hoy', dueCards + dueMist ? 'Repasar ahora' : 'Al día', '#ff2d55'],
      ['#/norma', 'map', 'Mapa de la norma', 'Cláusulas 4-10 y los 93 controles, explicados en sencillo.', Object.keys(Store.tr().known).length + ' de 93 entendidos', '#30b0c7'],
      ['#/examen', 'graduation-cap', 'Simulacro', 'Formato CertiProf: 40 preguntas en 60 minutos.', Store.tr().exams.length ? 'Último: ' + Math.round(Store.tr().exams[0].pct * 100) + ' %' : 'Sin intentos aún', '#ff9f0a'],
      ['#/caso', 'briefcase', 'Caso Albatrel', 'Tu empresa de prácticas, inventada para esta app.', T.caso.kpis[0][0] + ' personas · ' + T.caso.kpis[1][0] + ' entidades', '#5e5ce6']
    ].map(([href, ic, t, s, n, c], i) => rise(h('a.qk.press', {href, style: {'--c': c}}, h('div.qi', icon(ic)), h('b', t), h('small', s), h('span.n', n)), i + 2));

    return h('div.view',
      h('div.eyebrow.track', h('span.dot'), date),
      h('h1', saludo()),
      h('div.today', rise(hero, 0), rise(h('div', ringCard,
        h('div.mini-stats',
          h('div.mini', h('span', 'Racha'), h('b', {style: {display: 'flex', alignItems: 'center', gap: '6px'}}, Store.streak(), icon('flame', 'flame-ico'))),
          h('div.mini', h('span', 'XP total'), h('b', Store.s.xp)),
          h('div.mini', h('span', 'Unidades'), h('b', doneUnits + '/' + units.length)))), 1)),
      h('div.sec', h('div.sec-h', h('h2', 'Atajos')), h('div.quick', quick)),
      h('div.sec', h('div.sec-h', h('h2', 'Tu ruta'), h('a', {href: '#/ruta'}, 'Ver todo')), modulesList(true)));
  }
  function saludo() {
    const hr = new Date().getHours();
    const s = hr < 6 ? 'Buenas noches' : hr < 13 ? 'Buenos días' : hr < 21 ? 'Buenas tardes' : 'Buenas noches';
    return s + '. Vamos a por la 27001.';
  }

  /* ═════ Ruta ═════ */
  function modulesList(compact) {
    const T = App.T();
    const mods = (compact ? T.modules.filter(m => !m.soon) : T.modules).map((m, mi) => {
      if (m.soon) return rise(h('section.mod.locked', h('div.mod-rail', h('div.mod-n', m.n)),
        h('div.mod-body', h('div.mod-h', h('div', h('h3', 'Bloque ' + m.n + ' · ' + m.t), h('p', m.s)), h('span.tag', icon('lock'), 'Próximamente')))), mi);
      const us = m.units.map(id => T.units[id]);
      const pct = us.reduce((a, u) => a + unitState(u).pct, 0) / us.length;
      return rise(h('section.mod', h('div.mod-rail', h('div.mod-n', m.n)),
        h('div.mod-body',
          h('div.mod-h', h('div', h('h3', 'Bloque ' + m.n + ' · ' + m.t), h('p', m.s)), h('span.tag.track', Math.round(pct * 100) + ' %')),
          h('div.mod-bar', h('i', {style: {'--v': pct}})),
          h('div.units', us.map(u => {
            const s = unitState(u);
            return h('a.unit.press', {href: '#/u/' + u.id},
              s.complete ? h('span.done-ico', icon('check')) : null,
              h('span.u-k', 'UNIDAD ' + u.n + (u.clauses ? ' · ' + u.clauses.join(', ') : '')),
              h('b', u.t),
              h('div.steps-dots', h('span.sd' + (s.lesson ? '.on' : '')), s.labs.map(l => h('span.sd' + (l && l.best >= 1 ? '.gold' : l && l.best >= .7 ? '.on' : ''))), h('span.sd' + (s.won ? '.on' : ''))));
          })))), mi);
    });
    return h('div.mods', mods);
  }
  function path() {
    const T = App.T(), tk = App.trackInfo();
    return h('div.view',
      h('div.eyebrow.track', h('span.dot'), tk.name),
      h('h1', 'Tu ruta'),
      h('p.lede', 'De cero a preparado para el examen, bloque a bloque. Cada unidad: lección, prácticas y jefe. Los bloques siguen el orden de la norma.'),
      h('div.sec', modulesList(false)),
      h('div.sec', h('div.soon', icon('sparkles'), 'Los bloques 2 a 10 se irán añadiendo. Después vendrán ENS, riesgos con MAGERIT, continuidad y auditoría como normas nuevas.')));
  }

  /* ═════ Unidad ═════ */
  function unit(id) {
    const T = App.T(), u = T.units[id];
    if (!u) return notFound();
    const s = unitState(u);
    const step = (cls, ic, title, sub, right, href, disabled) => {
      const b = h('button.step.press' + cls, {type: 'button', disabled: disabled || null, onclick: () => { location.hash = href; }},
        h('div.si', icon(ic)), h('div', h('b', title), h('small', sub)), h('div.st-r', right));
      return b;
    };
    const flags = (l) => [h('span.flag' + (l && l.best >= .7 ? '.on' : ''), icon('flag'), '70 %'), h('span.flag' + (l && l.best >= 1 ? '.gold' : ''), icon('crown'), '100 %')];
    const items = [
      step(s.lesson ? '.done' : '', s.lesson ? 'check' : 'book-open', 'Lección', u.lesson.filter(x => !x.check).length + ' tarjetas · ' + u.lesson.filter(x => x.check).length + ' preguntas rápidas · ≈ ' + u.mins + ' min',
        s.lesson ? h('span.tag.ok', 'Hecha') : h('span.tag.track', 'Empieza aquí'), '#/leccion/' + u.id),
      ...u.labs.map((l, k) => step(s.labs[k] && s.labs[k].best >= .7 ? '.done' : '', 'flask-conical', 'Práctica ' + (k + 1) + ' · ' + l.t, l.items.length + ' ejercicios' + (s.labs[k] ? ' · mejor: ' + Math.round(s.labs[k].best * 100) + ' %' : ''),
        flags(s.labs[k]), '#/lab/' + u.id + '/' + l.id, !s.lesson)),
      step('.boss' + (s.won ? '.done' : ''), s.won ? 'trophy' : 'swords', 'Jefe de la unidad', u.boss.length + ' preguntas · 3 vidas · 30 s cada una' + (s.boss ? ' · mejor: ' + Math.round(s.boss.best * 100) + ' %' : ''),
        s.won ? h('span.tag.ok', 'Vencido') : s.bossOpen ? h('span.tag.warn', 'Disponible') : h('span.tag', icon('lock'), 'Lección + 1 práctica'), '#/jefe/' + u.id, !s.bossOpen)
    ].map((el, i) => rise(el, i));
    const mod = T.modules.find(m => m.units && m.units.includes(u.id));
    return h('div.view.narrow',
      h('div.u-head',
        h('a.back', {href: '#/ruta'}, icon('chevron-left'), 'Ruta'),
        h('div.eyebrow.track', h('span.dot'), 'Bloque ' + mod.n + ' · Unidad ' + u.n + (u.clauses ? ' · Cláusulas ' + u.clauses.join(', ') : '')),
        h('h1', {style: {fontSize: 'clamp(30px,1.6rem + 1.6vw,44px)'}}, u.t),
        h('p.lede', u.s)),
      h('div.path', items),
      u.clauses ? h('div.sec', h('div.sec-h', h('h2', 'En la norma')), h('div.grid', u.clauses.map(n => clauseCard(n)))) : null);
  }
  function clauseCard(n) {
    const N = App.T().norma;
    for (const c of N.clauses) for (const s of c.sub) if (s.n === n) {
      const ph = N.phases.find(p => p.id === c.phase);
      return h('button.cl.press', {type: 'button', style: {'--c': ph.c}, onclick: () => clausePanel(s, c)}, h('span.n', s.n + ' · ' + ph.t), h('b', s.t), h('small', s.plain));
    }
    return null;
  }

  /* ═════ Mapa de la norma ═════ */
  function norma(tab) {
    tab = tab === 'controles' ? 'controles' : 'clausulas';
    const N = App.T().norma;
    const seg = h('div.seg', {role: 'tablist'},
      h('button', {type: 'button', 'aria-pressed': String(tab === 'clausulas'), onclick: () => { location.hash = '#/norma'; }}, 'Cláusulas 4-10'),
      h('button', {type: 'button', 'aria-pressed': String(tab === 'controles'), onclick: () => { location.hash = '#/norma/controles'; }}, 'Anexo A · 93 controles'));
    requestAnimationFrame(() => UI.pill(seg, 'button[aria-pressed="true"]', true));
    const body = tab === 'clausulas' ? clausesView(N) : controlsView(N);
    return h('div.view',
      h('div.eyebrow.track', h('span.dot'), 'Mapa de la norma'),
      h('h1', tab === 'clausulas' ? 'El ciclo de la norma' : 'Los 93 controles'),
      h('p.lede', tab === 'clausulas' ? 'Las cláusulas obligatorias ordenadas por el ciclo PDCA. Toca una para verla explicada en sencillo.' : 'Cuatro temas. Toca un control para ver qué pide en lenguaje sencillo y marcarlo como entendido.'),
      h('div', {style: {margin: '22px 0 18px'}}, seg), body);
  }
  function clausesView(N) {
    return h('div',
      h('div.cycle', N.phases.map((p, i) => rise(h('div.phase', {style: {'--c': p.c}},
        h('div.phase-h', h('i'), p.id + ' · ' + p.t),
        N.clauses.filter(c => c.phase === p.id).flatMap(c => [h('small', {style: {fontWeight: 650, color: 'var(--ink-3)', marginTop: '6px'}}, c.n + ' · ' + c.t),
          ...c.sub.map(s => h('button.cl.press', {type: 'button', onclick: () => clausePanel(s, c)}, h('span.n', s.n + (s.isNew ? ' · nueva' : ''), s.doc ? icon('file-check', 'doc-ico') : null), h('b', s.t)))])), i))),
      h('p.muted', {style: {fontSize: '13.5px', marginTop: '14px'}}, icon('file-check', 'doc-ico'), ' = la norma pide información documentada en ese apartado.'),
      h('div.sec', h('div.sec-h', h('h2', 'Contexto de internet')), h('div.grid.g3', N.web.map((w, i) => rise(h('div.card', h('span.tag.web', icon('globe'), 'Fuente web'), h('h3', {style: {margin: '10px 0 6px'}}, w.t), h('p.muted', {style: {fontSize: '14.5px', margin: '0 0 10px'}}, w.d), h('a.link', {href: w.url, target: '_blank', rel: 'noopener noreferrer'}, w.src + ' ↗')), i)))));
  }
  function clausePanel(s, c) {
    const N = App.T().norma, ph = N.phases.find(p => p.id === c.phase);
    const units = Object.values(App.T().units).filter(u => u.clauses && u.clauses.includes(s.n));
    panel(close => [
      h('div.panel-h', {style: {'--c': ph.c}}, h('div', h('div.big-n', s.n), h('h2', {style: {marginTop: '8px'}}, s.t), h('div', {style: {display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap'}}, h('span.tag', {style: {background: `color-mix(in oklab, ${ph.c} 14%, transparent)`, color: ph.c}}, ph.t), h('span.tag', 'Cláusula ' + c.n + ' · ' + c.t), s.doc ? h('span.tag.warn', icon('file-check'), 'Documentada') : null, s.isNew ? h('span.tag.warn', 'Nueva en 2022') : null)),
        h('button.ib.press', {type: 'button', 'aria-label': 'Cerrar', onclick: close}, icon('x'))),
      h('div.panel-b',
        h('h4', 'En sencillo'), h('p', s.plain),
        h('h4', 'Fuente'), h('div.refs', App.refChip(s.ref)),
        units.length ? [h('h4', 'Se estudia en'), ...units.map(u => h('a.lib-i', {href: '#/u/' + u.id, onclick: close}, h('span.li', icon(u.icon)), h('div', h('b', 'Unidad ' + u.n + ' · ' + u.t), h('small', u.s)), icon('chevron-right')))] : h('p.muted', {style: {marginTop: '14px'}}, 'Esta cláusula se estudiará en un próximo bloque.'))
    ]);
  }
  let ctlFilter = {q: '', th: null, onlyNew: false};
  function controlsView(N) {
    const grid = h('div.ctl-grid');
    const count = h('small.muted');
    const draw = () => {
      grid.textContent = '';
      const q = ctlFilter.q.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
      const list = N.controls.filter(([n, t, p, nw]) => {
        const th = 'x.org.per.fis.tec'.split('.')[+n.split('.')[0] - 4];
        if (ctlFilter.th && th !== ctlFilter.th) return false;
        if (ctlFilter.onlyNew && !nw) return false;
        return !q || (n + ' ' + t + ' ' + p).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').includes(q);
      });
      count.textContent = list.length + ' controles';
      const known = Store.tr().known;
      list.forEach(([n, t, p, nw], i) => {
        const th = N.themes[+n.split('.')[0] - 5];
        const b = h('button.ctl.press' + (known[n] ? '.known' : ''), {type: 'button', style: {'--c': th.c}, onclick: () => controlPanel(n, draw)},
          h('span.n', n, known[n] ? icon('circle-check', 'known-ico') : null), h('b', t), nw ? h('span.new', 'NUEVO') : null);
        if (i < 40) rise(b, Math.min(i, 20));
        grid.append(b);
      });
    };
    const field = h('label.field', icon('search'), h('input', {type: 'search', placeholder: 'Busca: copias, nube, contraseña, 8.13…', value: ctlFilter.q, 'aria-label': 'Buscar control', oninput: (e) => { ctlFilter.q = e.target.value; draw(); }}));
    const pills = h('div.pills', [null, ...N.themes].map(t => h('button.pill.press', {type: 'button', 'aria-pressed': String(ctlFilter.th === (t ? t.id : null)), style: t ? {'--c': t.c} : null,
      onclick: (e) => { ctlFilter.th = t ? t.id : null; pills.querySelectorAll('.pill').forEach(p => p.setAttribute('aria-pressed', 'false')); e.currentTarget.setAttribute('aria-pressed', 'true'); draw(); }},
      t ? h('i') : null, t ? `${t.n} · ${t.t} (${t.count})` : 'Todos')),
      h('button.pill.press', {type: 'button', 'aria-pressed': String(ctlFilter.onlyNew), onclick: (e) => { ctlFilter.onlyNew = !ctlFilter.onlyNew; e.currentTarget.setAttribute('aria-pressed', String(ctlFilter.onlyNew)); draw(); }}, icon('sparkles'), 'Nuevos en 2022'));
    draw();
    return h('div', h('div.toolbar', field, count), h('div', {style: {marginBottom: '16px'}}, pills), grid);
  }
  function controlPanel(n, redraw) {
    const N = App.T().norma, c = N.controls.find(x => x[0] === n), th = N.themes[+n.split('.')[0] - 5];
    const exQs = (window.EXAM_EZEQUIEL || []).filter(q => q.opts.some(o => o.split(/ y |,\s*/).includes(n)) && q.opts[q.a].split(/ y |,\s*/).includes(n));
    panel(close => {
      const btn = h('button.btn.press' + (Store.tr().known[n] ? '' : '.primary'), {type: 'button'}, Store.tr().known[n] ? 'Entendido' : 'Marcar como entendido');
      btn.onclick = () => { const k = Store.toggleKnown(n); btn.textContent = k ? 'Entendido' : 'Marcar como entendido'; btn.classList.toggle('primary', !k); redraw && redraw(); if (k) toast('Control ' + n + ' marcado como entendido'); };
      return [
        h('div.panel-h', {style: {'--c': th.c}}, h('div', h('div.big-n', n), h('h2', {style: {marginTop: '8px'}}, c[1]), h('div', {style: {display: 'flex', gap: '6px', marginTop: '10px'}}, h('span.tag', {style: {background: `color-mix(in oklab, ${th.c} 14%, transparent)`, color: th.c}}, 'Tema ' + th.n + ' · ' + th.t), c[3] ? h('span.tag.warn', 'Nuevo en 2022') : null)),
          h('button.ib.press', {type: 'button', 'aria-label': 'Cerrar', onclick: close}, icon('x'))),
        h('div.panel-b',
          h('h4', 'En sencillo'), h('p', c[2]),
          h('p.muted', {style: {fontSize: '13px'}}, 'Explicación propia. El texto oficial está en la norma (Anexo A) y la guía de implantación en la ISO 27002.'),
          h('div.refs', App.refChip(['une', (N.ctlPage && N.ctlPage[n]) || 18], 'Anexo A')),
          exQs.length ? [h('h4', 'Sale en el examen de práctica del curso'), ...exQs.map(q => h('div.rv', h('b', 'Pregunta ' + q.n), h('small', q.q)))] : null),
        h('div.panel-f', h('small.muted', 'Atajo: Esc para cerrar'), btn)];
    });
  }

  /* ═════ Repaso ═════ */
  function review() {
    const T = App.T();
    const terms = T.glossary.map(g => g[0]);
    const due = Store.dueCards(terms), mist = Store.dueMistakes();
    const boxes = [0, 0, 0, 0, 0];
    terms.forEach(t => { const c = Store.card(t); boxes[(c ? Math.max(1, Math.min(c.box, 5)) : 1) - 1]++; });
    const totalMist = Object.keys(Store.tr().mistakes).length;
    return h('div.view',
      h('div.eyebrow.track', h('span.dot'), 'Repaso espaciado'),
      h('h1', 'Lo que se repasa, se queda'),
      h('p.lede', 'Las tarjetas vuelven a los 1, 3, 7, 14 y 30 días. Los errores de prácticas, jefes y simulacros, a los 1, 3 y 7 días hasta que los aciertes tres veces.'),
      h('div.sec.grid.g2',
        rise(h('div.card', {style: {display: 'grid', gap: '14px'}}, h('span.tag.track', icon('layers'), 'Glosario'), h('h2', due.length ? due.length + ' tarjetas para hoy' : 'Tarjetas al día'),
          h('p.muted', {style: {margin: 0}}, terms.length + ' términos en total. Mira el término, piensa la definición y gira la tarjeta.'),
          h('div', {style: {display: 'flex', gap: '8px', flexWrap: 'wrap'}}, h('a.btn.primary.press', {href: '#/repaso/tarjetas'}, icon('play'), due.length ? 'Repasar ' + Math.min(due.length, 15) : 'Repasar igualmente'), h('a.btn.press', {href: '#/glosario'}, 'Ver glosario'))), 0),
        rise(h('div.card', {style: {display: 'grid', gap: '14px'}}, h('span.tag', {style: {background: 'var(--bad-soft)', color: 'var(--bad)'}}, icon('target'), 'Mis errores'), h('h2', mist.length ? mist.length + ' errores para hoy' : 'Sin errores pendientes'),
          h('p.muted', {style: {margin: 0}}, totalMist + ' preguntas falladas en seguimiento.'),
          h('div', h('a.btn.primary.press', {href: '#/repaso/errores', 'aria-disabled': mist.length ? null : 'true', style: mist.length ? null : {opacity: .4, pointerEvents: 'none'}}, icon('play'), 'Repasar errores'))), 1)),
      h('div.sec', h('div.sec-h', h('h2', 'Tus cajas'), h('small', 'Caja 1 = recién aprendida · Caja 5 = dominada')),
        h('div.leitner', {style: {width: '100%'}}, boxes.map((n, i) => h('div.lb', h('b', n), h('small', 'Caja ' + (i + 1)))))));
  }
  function flashcards() {
    const T = App.T();
    let queue = Store.dueCards(T.glossary.map(g => g[0]));
    if (!queue.length) queue = UI_shuffle(T.glossary.map(g => g[0])).slice(0, 10);
    queue = UI_shuffle(queue).slice(0, 15);
    let i = 0, flipped = false, good = 0;
    const deck = h('div.deck');
    const view = h('div.view.narrow', h('a.back', {href: '#/repaso'}, icon('chevron-left'), 'Repaso'), h('h1', {style: {fontSize: '34px'}}, 'Tarjetas'), deck);
    const draw = () => {
      deck.textContent = '';
      if (i >= queue.length) {
        if (good) confetti(40);
        deck.append(h('div.result.blur-in', h('div.medal.track', icon('layers')), h('h2', 'Repaso terminado'), h('p.lede', `${good} de ${queue.length} las sabías.`), h('a.btn.primary.press', {href: '#/'}, 'Volver a Hoy')));
        return;
      }
      const g = T.glossary.find(x => x[0] === queue[i]);
      flipped = false;
      const card = h('button.flash', {type: 'button', 'aria-label': 'Girar tarjeta'},
        h('div.flash-in', h('div.face', h('small', 'Tarjeta ' + (i + 1) + ' de ' + queue.length), h('div.term', g[0]), h('small', 'Toca o pulsa Espacio para girar')),
          h('div.face.back', h('div.term', {style: {fontSize: '22px'}}, g[0]), h('div.def', g[1]), g[2] ? h('div', {onclick: e => e.stopPropagation()}, App.refChip(g[2])) : null)));
      const grade = h('div.grade', {style: {visibility: 'hidden'}},
        h('button.btn.press', {type: 'button', onclick: () => rate(false)}, icon('rotate-ccw'), 'Aún no'),
        h('button.btn.primary.press', {type: 'button', onclick: () => rate(true)}, icon('check'), 'La sabía'));
      card.onclick = () => { flipped = !flipped; card.classList.toggle('flipped', flipped); grade.style.visibility = 'visible'; };
      deck.append(card, grade, h('small.muted', 'Atajos: Espacio gira · 1 aún no · 2 la sabía'));
      card.focus({preventScroll: true});
    };
    const rate = (ok) => { Store.gradeCard(queue[i], ok); if (ok) { good++; Store.addXP(2); } i++; draw(); };
    const onKey = (e) => {
      if (!document.body.contains(deck)) { document.removeEventListener('keydown', onKey); return; }
      const c = deck.querySelector('.flash');
      if (e.key === ' ' && c) { e.preventDefault(); c.click(); }
      if (flipped && e.key === '1') rate(false);
      if (flipped && e.key === '2') rate(true);
    };
    document.addEventListener('keydown', onKey);
    App.onLeave(() => document.removeEventListener('keydown', onKey));
    draw();
    return view;
  }
  const UI_shuffle = (a) => Ex.shuffle(a);

  /* ═════ Glosario ═════ */
  function glossary() {
    const T = App.T();
    const list = h('div.gl');
    const draw = (q = '') => {
      list.textContent = '';
      const nq = q.toLowerCase();
      T.glossary.filter(g => !nq || (g[0] + g[1]).toLowerCase().includes(nq)).forEach((g, i) =>
        list.append(rise(h('div.gl-i', h('b', g[0]), h('p', g[1]), g[2] ? App.refChip(g[2]) : null), Math.min(i, 16))));
    };
    draw();
    return h('div.view', h('div.eyebrow.track', h('span.dot'), 'Glosario'), h('h1', 'Las palabras de la norma'),
      h('div.toolbar', {style: {marginTop: '18px'}}, h('label.field', icon('search'), h('input', {type: 'search', placeholder: 'Buscar término…', 'aria-label': 'Buscar término', oninput: e => draw(e.target.value)}))), list);
  }

  /* ═════ Caso Albatrel (propio) ═════ */
  function caso() {
    const C = App.T().caso;
    return h('div.view',
      h('div.eyebrow.track', h('span.dot'), 'Tu caso práctico'),
      h('h1', C.name),
      h('p.lede', 'Una empresa inventada para esta app (no es el caso del curso). Cada concepto lo aplicarás a ella, bloque a bloque.'),
      h('div.sec.case-hero',
        h('div.facts', C.facts.map(([ic, t], i) => rise(h('div.fact', h('div.fi', icon(ic)), h('span', t)), i))),
        h('div.grid', C.kpis.map(([v, l], i) => rise(h('div.kv', h('b', v), h('span', l)), i + 2)))),
      h('div.sec', h('div.sec-h', h('h2', 'La pirámide documental'), h('small', 'Cláusula 7.5 · control 5.1')),
        h('div.grid', C.pyramid.map(([t, d], i) => rise(h('div.card', {style: {marginInline: (i * 4) + '%', padding: '16px 20px'}}, h('b', t), h('p.muted', {style: {margin: '4px 0 0', fontSize: '14.5px'}}, d)), i)))),
      h('div.sec', h('div.sec-h', h('h2', 'Lo que construirás con Albatrel'), h('small', 'bloque a bloque')),
        h('div.lib', C.plan.map(([ic, t, d], i) => rise(h('div.lib-i', h('span.li', icon(ic)), h('div', h('b', t), h('small', d)), h('span')), i)))),
      h('div.sec', h('div.soon', icon('file-text'), 'Para ver documentos reales de un SGSI, abre las plantillas del curso en la ', h('a.link', {href: '#/biblioteca'}, 'Biblioteca'), '.')));
  }

  /* ═════ Examen ═════ */
  function examCover() {
    const exams = Store.tr().exams;
    const bank = App.examBank();
    let n = 40, mins = 60, src = 'mix';
    const setOpt = (grp, val, el) => { grp.querySelectorAll('.pill').forEach(p => p.setAttribute('aria-pressed', 'false')); el.setAttribute('aria-pressed', 'true'); return val; };
    const nG = h('div.opt-row', [[10, 10], [20, 20], [40, 40]].map(([v, l]) => h('button.pill.press', {type: 'button', 'aria-pressed': String(v === n), onclick: e => { n = setOpt(nG, v, e.currentTarget); mins = Math.round(v * 1.5); }}, l + ' preguntas')));
    const hasPriv = bank.some(q => q.src === 'Ezequiel');
    const sG = h('div.opt-row', (hasPriv ? [['mix', 'Todo lo estudiado + examen del curso'], ['ezequiel', 'Solo el examen del curso']] : [['mix', 'Todo lo estudiado']]).map(([v, l]) => h('button.pill.press', {type: 'button', 'aria-pressed': String(v === src), onclick: e => { src = setOpt(sG, v, e.currentTarget); }}, l)));
    const start = () => {
      let pool = src === 'ezequiel' ? bank.filter(q => q.src === 'Ezequiel') : bank;
      const qs = Ex.shuffle(pool).slice(0, n).map(q => Object.assign({}, q, {_order: null}));
      Player.exam({qs, minutes: Math.round(qs.length * 1.5), pass: .8, title: 'Simulacro · ' + qs.length + ' preguntas'});
    };
    return h('div.view',
      h('div.eyebrow.track', h('span.dot'), 'Simulacro de examen'),
      h('h1', 'Ensaya el día del examen'),
      h('div.sec.exam-cover',
        h('div.card',
          h('h3', {style: {marginBottom: '6px'}}, 'Formato'),
          rule('list-checks', '40 preguntas de opción múltiple', 'Como el examen ISO/IEC 27001 Foundation de CertiProf.'),
          rule('timer', '60 minutos', 'Puedes saltar preguntas, volver atrás y marcarlas para revisar.'),
          rule('target', 'Aprobado con un 80 %', 'Nota de práctica. Confirma la nota oficial en la web de CertiProf.'),
          rule('library', bank.length + ' preguntas en el banco', hasPriv ? `${bank.filter(q => q.src === 'Ezequiel').length} del examen de práctica del curso y el resto de las unidades.` : 'Todas propias, de las prácticas y los jefes de las unidades.'),
          h('h3', {style: {margin: '18px 0 10px'}}, 'Preguntas'), nG,
          h('h3', {style: {margin: '18px 0 10px'}}, 'Banco'), sG,
          h('div', {style: {marginTop: '22px'}}, h('button.btn.primary.lg.press', {type: 'button', onclick: start}, icon('play'), 'Empezar simulacro'))),
        h('div.card', h('h3', {style: {marginBottom: '12px'}}, 'Tus intentos'),
          exams.length ? h('div.hist', exams.map(e => h('div.hist-i', h('span', e.date), h('span', e.good + '/' + e.n), h('b', {style: {color: e.pass ? 'var(--ok)' : 'var(--bad)'}}, Math.round(e.pct * 100) + ' %')))) : h('p.muted', 'Aún no has hecho ningún simulacro. Te recomendamos terminar antes los bloques 0 y 1.'),
          h('a.ref', {href: 'https://certiprof.com/es/pages/certified-iso-iec-27001-2022-foundation-i27001f-spanish', target: '_blank', rel: 'noopener noreferrer', style: {marginTop: '16px'}}, icon('globe'), 'CertiProf · I27001F ↗'))));
  }
  const rule = (ic, b, s) => h('div.rule', h('div.ri', icon(ic)), h('div', h('b', b), h('small', s)));

  /* ═════ Biblioteca ═════ */
  function libItem(it) {
    const T = App.T();
    if (it.url) return h('a.lib-i', {href: it.url, target: '_blank', rel: 'noopener noreferrer'}, h('span.li.web', icon('globe')), h('div', h('b', it.t), h('small', it.note || '')), icon('external-link'));
    const d = it.d ? Object.assign({f: App.docFile(it.d)}, T.docs[it.d]) : {f: it.f, t: it.t};
    if (!d.f) return null;
    const isPdf = /\.pdf$/i.test(d.f);
    return h('a.lib-i', {href: App.docUrl(d.f), target: '_blank', rel: 'noopener'}, h('span.li.' + (isPdf ? 'pdf' : 'doc'), icon(isPdf ? 'file-text' : 'file-down')), h('div', h('b', d.t), h('small', it.note || d.f)), icon(isPdf ? 'external-link' : 'download'));
  }
  function library() {
    const T = App.T();
    return h('div.view', h('div.eyebrow.track', h('span.dot'), 'Biblioteca'), h('h1', 'Tus documentos'),
      h('p.lede', ATLAS.private ? 'Pack privado activo: los PDF y Word del curso se abren desde tu carpeta, sin copiarlos ni subirlos a ningún sitio.' : 'Recursos oficiales y gratuitos. Si tienes el material de un curso, puedes conectarlo en local con un pack privado (ver README).'),
      T.library.map((g, gi) => h('div.sec', h('div.sec-h', h('h2', g.g)), h('div.lib', g.items.map((it, i) => rise(libItem(it), Math.min(i, 10)))))));
  }

  /* ═════ Progreso ═════ */
  function progress() {
    const units = allUnits();
    const days = Store.s.days;
    const heat = h('div.heat');
    for (let k = 125; k >= 0; k--) { const d = Store.addDays(Store.day(), -k); const x = days[d] ? days[d].xp : 0; heat.append(h('i', {title: d + ' · ' + x + ' XP', 'data-l': x === 0 ? 0 : x < 20 ? 1 : x < 50 ? 2 : x < 100 ? 3 : 4})); }
    const st = units.map(unitState);
    const badges = [
      ['flag', 'Primer paso', 'Termina tu primera lección.', st.some(s => s.lesson)],
      ['swords', 'Cazajefes', 'Vence a tu primer jefe.', st.some(s => s.won)],
      ['crown', 'Perfeccionista', 'Consigue una bandera dorada.', st.some(s => s.root > 0)],
      ['shield-check', 'Fundamentos', 'Completa el bloque 0.', App.T().modules[0].units.every(id => unitState(App.T().units[id]).complete)],
      ['crown', 'Liderazgo', 'Completa el bloque 1.', App.T().modules[1].units.every(id => unitState(App.T().units[id]).complete)],
      ['scale', 'Gestor de riesgos', 'Completa el bloque 2.', App.T().modules[2].units && App.T().modules[2].units.every(id => unitState(App.T().units[id]).complete)],
      ['file-text', 'Documentalista', 'Completa el bloque 3.', App.T().modules[3].units && App.T().modules[3].units.every(id => unitState(App.T().units[id]).complete)],
      ['flame', 'Constancia', 'Racha de 7 días.', Store.bestStreak() >= 7],
      ['map', 'Cartógrafo', 'Marca 30 controles como entendidos.', Object.keys(Store.tr().known).length >= 30],
      ['award', 'Listo para CertiProf', 'Aprueba un simulacro de 40 preguntas.', Store.tr().exams.some(e => e.pass && e.n >= 40)]
    ];
    return h('div.view', h('div.eyebrow.track', h('span.dot'), 'Progreso'), h('h1', 'Cómo vas'),
      h('div.sec.grid.g4', [['XP total', Store.s.xp], ['Racha', Store.streak() + ' días'], ['Mejor racha', Store.bestStreak() + ' días'], ['Minutos', Object.values(days).reduce((a, d) => a + (d.mins || 0), 0)]].map(([l, v], i) => rise(h('div.mini', h('span', l), h('b', v)), i))),
      h('div.sec', h('div.sec-h', h('h2', 'Constancia'), h('small', 'Últimas 18 semanas')), h('div.card', heat)),
      h('div.sec', h('div.sec-h', h('h2', 'Insignias')), h('div.badges', badges.map(([ic, t, s, got], i) => rise(h('div.badge' + (got ? '.got' : ''), h('div.bi', icon(ic)), h('div', h('b', t), h('small', s))), i)))));
  }

  /* ═════ Normas (pistas) ═════ */
  function tracks() {
    return h('div.view', h('div.eyebrow.track', h('span.dot'), 'Atlas GRC'), h('h1', 'Tus normas'),
      h('p.lede', 'Hoy estudias la ISO 27001. Cuando la domines, se irán activando las demás con su propio color y progreso.'),
      h('div.sec.tracks', ATLAS.tracks.map((t, i) => rise(h('button.trk.press' + (t.status !== 'activo' ? '.off' : '') + (t.id === Store.s.track ? '.on' : ''), {type: 'button', style: {'--c': t.color},
        onclick: () => { if (t.status === 'activo') { App.setTrack(t.id); location.hash = '#/'; } else toast(t.short + ' llegará en una próxima versión', {icon: 'sparkles'}); }},
        h('span.tdot', {style: {background: `linear-gradient(135deg, ${t.color}, ${t.color2})`}}), h('b', t.name), h('small', t.sub), h('span.tag' + (t.status === 'activo' ? '.ok' : ''), t.status === 'activo' ? 'Activa' : 'Próximamente')), i))));
  }

  /* ═════ Ajustes y ayuda ═════ */
  function settings() {
    panel(close => {
      const sound = h('button.btn.sm.press', {type: 'button', onclick: (e) => { Store.set('sound', Store.s.sound === false); e.currentTarget.textContent = Store.s.sound === false ? 'Sonido: no' : 'Sonido: sí'; }}, Store.s.sound === false ? 'Sonido: no' : 'Sonido: sí');
      const goal = h('div.opt-row', [30, 60, 100].map(v => h('button.pill.press', {type: 'button', 'aria-pressed': String(Store.s.goal === v), onclick: (e) => { Store.set('goal', v); goal.querySelectorAll('.pill').forEach(p => p.setAttribute('aria-pressed', 'false')); e.currentTarget.setAttribute('aria-pressed', 'true'); }}, v + ' XP')));
      const file = h('input', {type: 'file', accept: 'application/json', hidden: true, onchange: (e) => {
        const f = e.target.files[0]; if (!f) return;
        f.text().then(t => { try { Store.importJSON(t); toast('Copia restaurada'); close(); App.render(); } catch (err) { toast('Ese fichero no es una copia de Atlas', {icon: 'x'}); } });
      }});
      return [
        h('div.panel-h', h('div', h('h2', 'Ajustes y ayuda')), h('button.ib.press', {type: 'button', 'aria-label': 'Cerrar', onclick: close}, icon('x'))),
        h('div.panel-b',
          h('h4', 'Meta diaria'), goal,
          h('h4', 'Sonido'), sound,
          h('h4', 'Atajos de teclado'),
          h('p', h('kbd', 'Ctrl K'), ' buscar · ', h('kbd', '1-4'), ' elegir · ', h('kbd', 'Intro'), ' comprobar/continuar · ', h('kbd', '← →'), ' moverte · ', h('kbd', 'Esc'), ' salir'),
          h('h4', 'Tu progreso'),
          h('p', 'Se guarda solo en este navegador. Haz una copia de vez en cuando.'),
          h('div', {style: {display: 'flex', gap: '8px', flexWrap: 'wrap'}},
            h('button.btn.sm.press', {type: 'button', onclick: () => { const a = h('a', {href: URL.createObjectURL(new Blob([Store.exportJSON()], {type: 'application/json'})), download: 'atlas-grc-copia-' + Store.day() + '.json'}); a.click(); }}, icon('download'), 'Guardar copia'),
            h('button.btn.sm.press', {type: 'button', onclick: () => file.click()}, icon('upload'), 'Restaurar copia'), file),
          h('h4', 'Empezar de cero'),
          holdButton('Mantén para borrar todo el progreso', 1600, () => { Store.reset(); toast('Progreso borrado', {icon: 'trash-2'}); close(); App.render(); }, 'sm'),
          h('h4', 'De dónde sale el contenido'),
          h('p', 'Las lecciones, ejercicios, explicaciones y el caso Albatrel son contenido propio. Las citas indican de dónde sale cada idea (curso, norma o fuente web). Gracias al profesor Ezequiel Wolf, cuya frase sobre cómo se encalla uno con la norma inspiró este proyecto.'),
          h('p', 'Uso personal. El material del curso tiene derechos de autor: no se publica ni se sube a ningún sitio.'))
      ];
    });
  }

  function notFound() { return h('div.view', h('h1', 'No encuentro esa página'), h('a.btn.primary.press', {href: '#/'}, 'Volver a Hoy')); }

  window.Views = {today, path, unit, norma, review, flashcards, glossary, caso, examCover, library, progress, tracks, settings, notFound, unitState, allUnits, nextStep};
})();
