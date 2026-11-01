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
  /* Colores de cada bloque (portadas del carrusel y cabeceras) */
  const BLOCK_COL = [['#5e5ce6', '#0a84ff'], ['#30b0c7', '#5e5ce6'], ['#ff9f0a', '#ff375f'], ['#34c759', '#30b0c7'], ['#64d2ff', '#5e5ce6'], ['#bf5af2', '#ff375f'], ['#ffcc00', '#ff9f0a'], ['#5e5ce6', '#bf5af2'], ['#ff9f0a', '#ff6482'], ['#30d158', '#0a84ff'], ['#ff375f', '#bf5af2']];
  const BLOCK_HEAD = ['Empieza por los cimientos', 'Conoce tu organización', 'Domina el riesgo', 'Prepara el terreno', 'Pon el SGSI en marcha', 'Mide y audita', 'Mejora siempre', 'Controles de organización', 'Personas y espacios', 'Controles tecnológicos', 'Rumbo a la certificación'];
  const BLOCK_ICON = ['compass', 'building-2', 'scale', 'file-text', 'refresh-cw', 'scan-search', 'sparkles', 'landmark', 'users', 'server', 'award'];
  const blockPct = (m) => { const T = App.T(); if (m.soon) return null; const us = m.units.map(id => T.units[id]); return us.reduce((a, u) => a + unitState(u).pct, 0) / us.length; };
  /* Imagen opcional de app/img: si no existe, se queda el fondo de color */
  /* Solo se piden las ilustraciones que existen (lista en app/img/imagenes.js): sin errores 404 */
  const optImg = (src, alt) => (window.ATLAS_IMG || []).includes(src.replace(/^img\//, '')) ? h('img', {src, alt: alt || '', loading: 'lazy', decoding: 'async', onerror: (e) => e.currentTarget.remove()}) : null;
  function nextStep() {
    const T = App.T(), start = (Store.s.plan && Store.s.plan.level) || 0;
    const ordered = T.modules.filter(m => !m.soon && +m.n >= start).concat(T.modules.filter(m => !m.soon && +m.n < start)).flatMap(m => m.units.map(id => T.units[id]));
    for (const u of ordered) {
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

    const qr = h('nav.qr', {'aria-label': 'Accesos rápidos'}, [
      ['#/repaso', 'refresh-cw', 'Repaso', dueCards + dueMist, dueCards + dueMist ? 'pendiente' : 'al día', '#ff2d55'],
      ['#/norma', 'layers', 'Mapa', 0, Object.keys(Store.tr().known).length + '/93', '#30b0c7'],
      ['#/examen', 'graduation-cap', 'Simulacro', 0, Store.tr().exams.length ? Math.round(Store.tr().exams[0].pct * 100) + ' %' : 'sin intentos', '#ff9f0a'],
      ['#/caso', 'briefcase', 'Albatrel', 0, 'tu caso', 'var(--track)'],
      ['#/glosario', 'book-a', 'Glosario', 0, T.glossary.length + ' términos', '#34c759']
    ].map(([href, ic, t, n, sub, c], i) => rise(h('a.press', {href, style: {'--c': c}}, h('span.c', icon(ic), n ? h('i', n > 99 ? '99+' : n) : null), h('span', t, h('small', sub))), i)));

    return h('div.view',
      h('div.eyebrow.track', h('span.dot'), date),
      h('h1', saludo()),
      h('div.today', rise(hero, 0), rise(h('div', ringCard,
        h('div.mini-stats',
          h('div.mini', h('span', 'Racha'), h('b', {style: {display: 'flex', alignItems: 'center', gap: '6px'}}, Store.streak(), icon('flame', 'flame-ico'))),
          h('div.mini', h('span', 'XP total'), h('b', Store.s.xp)),
          h('div.mini', h('span', 'Unidades'), h('b', doneUnits + '/' + units.length)))), 1)),
      h('div.sec', qr),
      h('div.sec', h('div.sec-h', h('h2', 'Tu ciudad'), h('a', {href: '#/ciudad'}, 'Verla entera')), City.mini()),
      h('div.sec', h('div.sec-h', h('h2', 'Tus bloques'), h('a', {href: '#/ruta'}, 'Ver la ruta')), carousel()));
  }
  function carousel() {
    const T = App.T();
    const car = h('div.car', T.modules.map((m, i) => {
      const p = blockPct(m), [a, b] = BLOCK_COL[i % BLOCK_COL.length];
      return h('a.dest', {href: m.soon ? '#/ruta' : '#/b/' + m.id, style: {'--a': a, '--b': b}, 'aria-label': 'Bloque ' + m.n + ': ' + m.t},
        h('span.cov'), h('span.deco', icon(BLOCK_ICON[i] || 'compass')), optImg('img/bloque-' + m.n + '-portada.webp'),
        p != null && p > 0 ? h('span.pct', icon(p >= 1 ? 'crown' : 'flag'), Math.round(p * 100) + ' %') : null,
        h('span.meta', h('small', 'Bloque ' + m.n), h('b', m.t)),
        m.soon ? h('span.lk', icon('lock'), 'Próximamente') : null);
    }));
    // Arrastrar con el ratón; con el dedo manda el scroll nativo (inercia incluida)
    let x0 = null, s0 = 0, moved = false;
    car.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; x0 = e.clientX; s0 = car.scrollLeft; moved = false; });
    car.addEventListener('pointermove', (e) => { if (x0 == null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 5) { moved = true; car.classList.add('drag'); } car.scrollLeft = s0 - dx; });
    const end = () => { x0 = null; setTimeout(() => car.classList.remove('drag'), 0); };
    car.addEventListener('pointerup', end); car.addEventListener('pointerleave', end);
    car.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    return car;
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
          h('div.mod-h', h('div', h('h3', h('a', {href: '#/b/' + m.id, style: {textDecoration: 'none'}}, 'Bloque ' + m.n + ' · ' + m.t)), h('p', m.s)), h('a.tag.track', {href: '#/b/' + m.id}, Math.round(pct * 100) + ' %', icon('chevron-right'))),
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
      h('div.sec', City.mini()),
      Docs.section(),
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
      ['file-check', 'Arquitecto del SGSI', 'Construye todos los documentos de Albatrel.', App.T().caso.docs && App.T().caso.docs.every(d => Store.docBuilt(d.id))],
      ['play', 'Operador', 'Completa el bloque 4.', App.T().modules[4].units && App.T().modules[4].units.every(id => unitState(App.T().units[id]).complete)],
      ['scan-search', 'Auditor', 'Completa el bloque 5.', App.T().modules[5].units && App.T().modules[5].units.every(id => unitState(App.T().units[id]).complete)],
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
  /* ═════ Acerca de: autor, código fuente y el ecosistema GRC (como en Rosetta) ═════ */
  const VERSION = '0.6 beta';
  const AUTOR = {nombre: 'Yoandy Ramírez Delgado', email: 'yoandyramirezdelgado@gmail.com', repo: 'https://github.com/heindall92/atlas-grc',
    links: [['linkedin', 'LinkedIn', 'https://www.linkedin.com/in/yoandyrd92/'], ['github', 'GitHub', 'https://github.com/heindall92'],
      ['globe', 'Portafolio', 'https://yoandyramirez.com'], ['hackthebox', 'HackTheBox', 'https://profile.hackthebox.com/profile/019c5812-b4ca-7315-b12f-14db6d2b42fa']]};
  // Logotipos de marca (no existen en Lucide): GitHub y Hack The Box de Simple Icons (CC0); LinkedIn, dibujado
  const BRAND = {
    github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    hackthebox: 'm22.5106 6.4566.0008-.0123a.888.888 0 0 0-.2717-.6384c-.0084-.0084-.018-.0155-.0267-.0235-.0186-.0166-.0371-.0333-.0572-.0484-.0193-.0147-.04-.0276-.0607-.0406-.0096-.006-.0182-.0131-.0281-.0188L12.4576.1266a.891.891 0 0 0-.9223.0043L1.933 5.6744c-.0107.0062-.0203.014-.0307.0205-.0073.0047-.015.008-.0223.0128-.007.0047-.013.0106-.02.0155a.8769.8769 0 0 0-.147.1333l-.0026.003a.8872.8872 0 0 0-.2218.5847l.0009.014c-.0002.0088-.0015.0176-.0015.0264v11.0708c0 .3277.1802.6288.469.7836l9.5986 5.5417c.0076.0044.0158.0075.0236.0117a.8754.8754 0 0 0 .166.0687c.0134.004.0266.0083.0401.0117a.8793.8793 0 0 0 .072.0142c.0117.0019.0232.0045.0349.006a.835.835 0 0 0 .2157 0c.0117-.0015.0232-.0041.0348-.006a.9.9 0 0 0 .072-.0142c.0135-.0034.0267-.0077.04-.0117a.895.895 0 0 0 .0646-.0217.9134.9134 0 0 0 .1015-.047c.0078-.0042.016-.0072.0236-.0117l9.5986-5.5417a.8888.8888 0 0 0 .469-.7836V6.4779c0-.0071-.0012-.0142-.0014-.0213zM5.2543 6.0822l6.5367-3.774a.4182.4182 0 0 1 .4182 0l6.5366 3.774a.4182.4182 0 0 1 0 .7243l-6.5367 3.774a.4182.4182 0 0 1-.4182 0l-6.5366-3.774a.4182.4182 0 0 1 0-.7243zm5.6134 14.3449a.4172.4172 0 0 1-.626.3613L3.718 17.0218a.4173.4173 0 0 1-.2086-.3613V9.1279a.4172.4172 0 0 1 .6258-.3613l6.524 3.7666a.4172.4172 0 0 1 .2086.3614v7.5325zm9.623-3.7666a.4173.4173 0 0 1-.2086.3613l-6.5239 3.7666a.4172.4172 0 0 1-.6259-.3613v-7.5325c0-.149.0796-.2868.2087-.3614l6.5239-3.7666a.4172.4172 0 0 1 .6258.3613v7.5326z'
  };
  function brand(k) {
    const s = h('span.brand-ic', {'aria-hidden': 'true'});
    if (k === 'linkedin') s.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><rect x="1" y="1" width="22" height="22" rx="4" fill="currentColor"/><text x="12" y="17.2" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="13" style="fill:var(--li-in,#fff)">in</text></svg>';
    else if (BRAND[k]) s.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="' + BRAND[k] + '"/></svg>';
    else return icon(k);
    return s;
  }
  const ext = (href, cls, ...kids) => h('a' + cls, {href, target: '_blank', rel: 'noopener noreferrer'}, ...kids);
  // El ecosistema: cada herramienta enlaza a las demás. Webs comprobadas el 30/10/2026.
  const SUITE = [
    ['atlas', 'Atlas GRC', 'Aprender la ISO/IEC 27001 desde cero: lecciones, prácticas, simulacros CertiProf y la ciudad de Albatrel que crece contigo.', null, 'https://github.com/heindall92/atlas-grc'],
    ['argos', 'ARGOS', 'Laboratorio de práctica GRC: rutas, máquinas con flags y simulacros cronometrados de ENS, ISO/IEC 27001 y continuidad.', 'https://heindall92.github.io/argos-grc/', 'https://github.com/heindall92/argos-grc'],
    ['rosetta', 'Rosetta', 'Mapa multinorma: ENS, ISO/IEC 27001, NIS2, DORA, RGPD y más en 152 controles unificados, con equivalencias ENS ↔ ISO.', 'https://heindall92.github.io/rosetta_multinorma/', 'https://github.com/heindall92/rosetta_multinorma'],
    ['ens', 'ENS Compliance Studio', 'Categorización del sistema, análisis de riesgos MAGERIT, Declaración de Aplicabilidad y preauditoría del ENS.', 'https://heindall92.github.io/grc_ens_compliance_studio/app/dist/ens-compliance-studio.html', 'https://github.com/heindall92/grc_ens_compliance_studio'],
    ['kairos', 'KAIROS', 'Continuidad de negocio: BIA, BCP y DRP con la ruta crítica de recuperación de cada función.', 'https://heindall92.github.io/kairos/', 'https://github.com/heindall92/kairos'],
    ['ctem', 'CTEM-Nexus', 'Gestión de la exposición: prioriza hallazgos de escáneres y pentest y dibuja las rutas de ataque hacia los activos críticos.', 'https://heindall92.github.io/ctem-nexus/', 'https://github.com/heindall92/ctem-nexus'],
    ['adaudit', 'ENS AD Auditor', 'Audita el Directorio Activo frente a las medidas de control de acceso del ENS (op.acc).', 'https://heindall92.github.io/ens_ad-auditor/', 'https://github.com/heindall92/ens_ad-auditor'],
    ['mcpshield', 'MCP-Shield', 'Audita las configuraciones MCP de los asistentes de IA: cadena de suministro, secretos, ficheros y tool poisoning.', 'https://heindall92.github.io/mcp-shield/', 'https://github.com/heindall92/mcp-shield'],
    ['norvik', 'Norvik', 'Gobernanza: roles, responsables y políticas que unen al resto de herramientas.', null, 'https://github.com/heindall92/Norvik_Gobernanza']
  ];
  function about() {
    return [
      h('div.about-card',
        h('div.about-av', {'aria-hidden': 'true'}, 'YR'),
        h('div.about-who',
          h('b.about-name', AUTOR.nombre), h('span.about-role', 'Diseño y desarrollo de Atlas'),
          h('small', 'Junior Pentester · eJPTv2 · AI Governance (ISO 42001) · SysAdmin'),
          h('div.about-links', AUTOR.links.map(([k, l, href]) => ext(href, '.about-link', brand(k), l)), ext('mailto:' + AUTOR.email, '.about-link', icon('mail'), 'Correo')))),
      h('h4', 'Sobre la herramienta'),
      h('p', h('b', 'Atlas GRC ' + VERSION), ' · ISO/IEC 27001:2022. Herramienta de estudio: no sustituye a la norma, a un curso oficial ni a una auditoría de certificación. El caso Albatrel es ficticio.'),
      h('p.muted', {style: {fontSize: '13px'}}, 'No está afiliada ni respaldada por ISO, IEC, UNE, CertiProf, el CCN ni ninguna entidad de certificación. Iconos Lucide (ISC). Ciudad 3D con Three.js (MIT).'),
      ext(AUTOR.repo, '.about-repo', brand('github'), 'github.com/heindall92/atlas-grc'),
      h('h4', 'Herramientas GRC del autor'),
      h('p.muted', {style: {fontSize: '13.5px'}}, 'Se complementan: Atlas te enseña la norma, ARGOS te entrena, Rosetta traduce entre marcos, ENS Compliance Studio prepara el ENS, KAIROS cubre la continuidad, CTEM-Nexus mide la exposición técnica, ENS AD Auditor revisa el directorio, MCP-Shield audita los asistentes de IA y Norvik gobierna el conjunto.'),
      h('div.suite', SUITE.map(([id, n, d, app, repo]) => h('article.suite-card' + (id === 'atlas' ? '.here' : ''),
        h('div.suite-hd', h('b', n), id === 'atlas' ? h('span.tag.suite-here', 'Estás aquí') : null),
        h('p', d),
        h('div.suite-row', id !== 'atlas' && app ? ext(app, '.btn.sm.primary.press', 'Abrir la app', icon('arrow-right')) : null, ext(repo, '.btn.sm.press', brand('github'), 'Código'))))),
      h('div.help-cta', h('b', icon('life-buoy'), '¿Algo no funciona o tienes una idea?'),
        h('p', 'Atlas no tiene soporte en directo. Abre una incidencia en el repositorio o escribe al autor.'),
        h('div.suite-row',
          ext(AUTOR.repo + '/issues/new', '.btn.sm.primary.press', icon('bug'), 'Abrir una incidencia'),
          ext('mailto:' + AUTOR.email + '?subject=Atlas%20GRC', '.btn.sm.press', icon('mail'), 'Escribir al autor'),
          ext(AUTOR.repo, '.btn.sm.press', brand('github'), 'Ver el código')))
    ];
  }
  function aboutView() {
    return h('div.view', h('div.eyebrow.track', h('span.dot'), 'Atlas GRC ' + VERSION), h('h1', 'Acerca de'),
      h('p.lede', 'Quién hace Atlas, dónde está su código y qué otras herramientas GRC lo acompañan.'), h('div.sec.about-page', about()));
  }

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
          h('h4', 'Color'),
          (() => { const g = h('div.opt-row', [['', 'Malva'], ['coral', 'Coral'], ['azul', 'Azul eléctrico'], ['verde', 'Verde']].map(([k, l]) => h('button.pill.press', {type: 'button', 'aria-pressed': String((Store.s.skin || '') === k), onclick: (e) => { App.setSkin(k || null); g.querySelectorAll('.pill').forEach(p => p.setAttribute('aria-pressed', 'false')); e.currentTarget.setAttribute('aria-pressed', 'true'); }}, l))); return g; })(),
          h('h4', 'Tu plan'),
          h('button.btn.sm.press', {type: 'button', onclick: () => { close(); setTimeout(onboarding, 300); }}, icon('compass'), 'Rehacer mi plan'),
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
          h('p', 'Las lecciones, ejercicios, explicaciones y el caso Albatrel son contenido propio. Las citas indican de dónde sale cada idea (curso, norma o fuente web). Gracias al profesor ', h('a.link', {href: 'https://www.linkedin.com/in/ezequiel-wolf/', target: '_blank', rel: 'noopener noreferrer'}, 'Ezequiel Wolf'), ', cuya frase sobre cómo se encalla uno con la norma inspiró este proyecto.'),
          h('p', 'Uso personal. El material del curso tiene derechos de autor: no se publica ni se sube a ningún sitio.'),
          h('h4', 'Acerca de'), ...about())
      ];
    });
  }

  /* ═════ Página de bloque: cabecera grande ═════ */
  function block(id) {
    const T = App.T(), i = T.modules.findIndex(m => m.id === id), m = T.modules[i];
    if (!m || m.soon) return notFound();
    const us = m.units.map(x => T.units[x]), p = blockPct(m), [a, b] = BLOCK_COL[i % BLOCK_COL.length];
    let nx = null;
    for (const u of us) { const s = unitState(u); if (!s.complete) { nx = u; break; } }
    const cta = nx ? h('a.btn.lg.press', {href: '#/u/' + nx.id}, icon('play'), (p > 0 ? 'Continuar' : 'Empezar') + ' · Unidad ' + nx.n) : h('a.btn.lg.press', {href: '#/examen'}, icon('graduation-cap'), 'Ponte a prueba');
    const mins = us.reduce((s, u) => s + (u.mins || 10) + u.labs.length * 4, 0);
    const waves = h('div.waves', {html: '<svg viewBox="0 0 400 120" preserveAspectRatio="none" width="100%" height="100%"><path d="M0 70 Q 80 20 160 60 T 320 40 T 400 50 V120 H0Z" fill="#fff" fill-opacity=".14"/><path d="M0 95 Q 100 60 200 90 T 400 80 V120 H0Z" fill="#fff" fill-opacity=".1"/></svg>'});
    return h('div.view',
      h('a.back', {href: '#/ruta'}, icon('chevron-left'), 'Ruta'),
      rise(h('section.bh', {style: {'--a': a, '--b': b, marginTop: '10px'}},
        h('div',
          h('div.eyebrow', 'Bloque ' + m.n + ' · ' + m.t),
          h('h1', BLOCK_HEAD[i] || m.t),
          h('p', m.s),
          h('div.prog', h('div.bar', h('i', {style: {'--v': p}})), h('b', Math.round(p * 100) + ' %')),
          h('div', {style: {display: 'flex', gap: '10px', flexWrap: 'wrap'}}, cta, h('a.btn.lg.glass.press', {href: '#/ruta'}, 'Toda la ruta')),
          h('div.chips', h('span', icon('book-open'), us.length + ' unidades'), h('span', icon('timer'), '≈ ' + mins + ' min'), h('span', icon('swords'), us.length + ' jefes'))),
        h('div.ill', h('div.big', icon(BLOCK_ICON[i] || 'compass')), waves, optImg('img/bloque-' + m.n + '-cabecera.webp', 'Ilustración del bloque ' + m.n))), 0),
      h('div.sec', h('div.sec-h', h('h2', 'Unidades'), h('small', us.filter(u => unitState(u).complete).length + ' de ' + us.length + ' completadas')),
        h('div.units', us.map((u, k) => {
          const s = unitState(u);
          return rise(h('a.unit.press', {href: '#/u/' + u.id},
            s.complete ? h('span.done-ico', icon('check')) : null,
            h('span.u-k', 'UNIDAD ' + u.n + (u.clauses ? ' · ' + u.clauses.join(', ') : '')),
            h('b', u.t), h('small.muted', {style: {fontSize: '13.5px', lineHeight: 1.35}}, u.s),
            h('div.steps-dots', h('span.sd' + (s.lesson ? '.on' : '')), s.labs.map(l => h('span.sd' + (l && l.best >= 1 ? '.gold' : l && l.best >= .7 ? '.on' : ''))), h('span.sd' + (s.won ? '.on' : '')))), k + 1);
        }))));
  }

  /* ═════ Bienvenida en 3 pasos: objetivo, nivel y meta diaria → plan ═════ */
  const OB_STEPS = [
    {t: '¿Cuál es tu objetivo?', p: 'Adaptamos la ruta y el simulacro a lo que buscas.', k: 'goal', o: [['graduation-cap', 'Aprobar CertiProf ISO 27001 Foundation', 'Ruta completa y simulacros de 40 preguntas'], ['compass', 'Aprender GRC desde cero', 'Sin prisa, con el caso Albatrel'], ['scan-search', 'Prepararme para auditar', 'Más casos de auditoría y no conformidades']]},
    {t: '¿Cuánto sabes ya?', p: 'Si ya conoces lo básico, empezamos más adelante.', k: 'level', o: [['sparkles', 'Nada, parto de cero', 'Empezamos por «¿qué es GRC?»'], ['book-open', 'Algo de teoría', 'Empezamos en el bloque 1'], ['shield-check', 'He trabajado con un SGSI', 'Directo a riesgos y controles']]},
    {t: '¿Cuánto tiempo al día?', p: 'Mejor poco y constante. Lo puedes cambiar en Ajustes.', k: 'min', o: [['timer', '5 minutos', 'Una tarjeta y un repaso'], ['flame', '15 minutos', 'Una lección o una práctica'], ['zap', '30 minutos', 'Lección, práctica y repaso']]}
  ];
  function onboarding() {
    const prev = Store.s.plan || {};
    const st = {i: 0, dir: 1, goal: prev.goal ?? null, level: prev.level ?? null, min: prev.min ?? null};
    const card = h('div.obc', {role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Configura tu plan'});
    const wrap = h('div.ob', h('div.ob-in',
      h('div.ob-art', optImg('img/bienvenida.webp'), h('span.mark', icon('atlas')), h('h1', 'Atlas GRC'), h('p', 'Aprende GRC desde cero con la ISO 27001. Tres preguntas y te armo un plan.')),
      card));
    const finish = () => {
      Store.set('plan', {goal: st.goal, level: st.level, min: st.min});
      Store.set('goal', [30, 60, 100][st.min]);
      Store.set('booted', true);
      wrap.classList.add('out'); setTimeout(() => wrap.remove(), 520);
      App.render();
      toast('Plan guardado. ¡A por ello!', {icon: 'compass'});
    };
    const draw = () => {
      const stepper = h('div.stepper', [0, 1, 2].flatMap(k => [h('span' + (k <= st.i ? '.on' : '')), k < 2 ? h('i', {style: {'--f': k < st.i ? 1 : 0}}) : null]));
      card.textContent = '';
      if (st.i > 2) {
        const weeks = Math.max(3, [12, 7, 4][st.min] - [0, 1, 2][st.level]);
        card.append(stepper, h('div.obs', h('h3', 'Tu plan está listo'), h('p', 'Lo puedes cambiar cuando quieras en Ajustes.'),
          h('div.plan',
            h('div', icon('target'), OB_STEPS[0].o[st.goal][1]),
            h('div', icon('map'), OB_STEPS[1].o[st.level][2]),
            h('div', icon('timer'), OB_STEPS[2].o[st.min][1] + ' al día · meta de ' + [30, 60, 100][st.min] + ' XP'),
            h('div', icon('calendar'), 'Preparado para el examen en unas ' + weeks + ' semanas')),
          h('div.ob-foot', h('button.btn.press', {type: 'button', onclick: () => { st.dir = -1; st.i = 2; draw(); }}, 'Atrás'), h('button.btn.primary.press', {type: 'button', onclick: finish}, 'Empezar', icon('arrow-right')))));
        card.querySelector('.btn.primary').focus();
        return;
      }
      const s = OB_STEPS[st.i];
      card.append(stepper, h('div.obs' + (st.dir < 0 ? '.back-dir' : ''), h('h3', s.t), h('p', s.p),
        h('div.choice', s.o.map(([ic, t, sub], k) => h('button.press', {type: 'button', 'aria-pressed': String(st[s.k] === k), onclick: () => { st[s.k] = k; st.dir = 1; st.i++; draw(); }}, icon(ic), h('span', t, h('small', sub))))),
        h('div.ob-foot',
          h('button.btn.press', {type: 'button', disabled: st.i ? null : true, onclick: () => { st.dir = -1; st.i--; draw(); }}, 'Atrás'),
          h('button.btn.ghost.press', {type: 'button', onclick: () => { if (st.goal == null) st.goal = 1; if (st.level == null) st.level = 0; if (st.min == null) st.min = 1; st.i = 3; draw(); }}, 'Saltar'))));
      const sel = card.querySelector('.choice button[aria-pressed="true"]') || card.querySelector('.choice button');
      sel && sel.focus({preventScroll: true});
    };
    document.body.append(wrap);
    draw();
  }

  function notFound() { return h('div.view', h('h1', 'No encuentro esa página'), h('a.btn.primary.press', {href: '#/'}, 'Volver a Hoy')); }

  window.Views = {aboutView, brand, VERSION, today, path, unit, block, onboarding, norma, review, flashcards, glossary, caso, examCover, library, progress, tracks, settings, notFound, unitState, allUnits, nextStep};
})();
