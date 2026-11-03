/* Atlas GRC · Anexo: simulador de auditoría.
   Un caso es un paquete de datos (data/auditoria/*.js). Aquí están las pantallas, el estado del alumno
   y el motor de evaluación. Se guarda aparte del progreso de la app, en este navegador.
   Rutas: #/auditoria · #/auditoria/<caso> · #/auditoria/<caso>/<paso> */
(function () {
  const {h, icon, toast, panel} = UI;
  const DEMO = /[?&]demo(&|$)/.test(location.search);
  const KEY = 'atlas-grc.audit' + (DEMO ? '.demo' : '');
  const AUD = () => window.AUDIT || {cases: {}, order: [], soon: []};
  const tr = (s) => (window.I18N ? I18N.t(s) : s);

  const STEPS = [
    ['encargo', 'Encargo', 'mail-open'], ['plan', 'Plan', 'list-todo'], ['muestra', 'Muestra', 'list-checks'],
    ['evidencias', 'Evidencias', 'folder-open'], ['entrevistas', 'Entrevistas', 'messages-square'],
    ['pruebas', 'Pruebas', 'clipboard-check'], ['hallazgos', 'Hallazgos', 'flag'], ['informe', 'Informe', 'file-text']];
  const TYPES = [['nc', 'No conformidad'], ['obs', 'Observación'], ['om', 'Oportunidad de mejora']];
  const WARN = 'Entorno educativo. Organizaciones, personas, documentos y evidencias son ficticios. La puntuación no equivale a una certificación profesional ni acredita experiencia de auditoría real.';

  /* ── Estado ── */
  const blank = () => ({v: 1, mode: 'learn', cases: {}});
  let S;
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = blank(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* modo privado */ } };
  const fresh = () => ({plan: {obj: '', sys: [], crit: [], tech: []}, sample: [], why: '', req: [], marks: {}, asked: [], tests: {}, finds: [], summary: '', concl: '', result: null});
  const cs = (id) => S.cases[id] || (S.cases[id] = Object.assign(fresh(), {attempts: []}));
  const toggle = (arr, v) => { const i = arr.indexOf(v); if (i < 0) arr.push(v); else arr.splice(i, 1); };

  /* ── Piezas de interfaz ── */
  const warn = () => h('div.callout.added.au-warn', icon('info'), h('div', h('b', 'Simulación educativa'), h('span', WARN)));
  function table(tb) {
    return h('div.au-tbl', h('table',
      h('thead', h('tr', tb.head.map(c => h('th', {scope: 'col'}, c)))),
      h('tbody', tb.rows.map(r => h('tr', r.map((c, i) => i === 0 ? h('th', {scope: 'row'}, c) : h('td', c)))))));
  }
  function check(label, on, onchange, opts = {}) {
    return h('label.au-chk' + (opts.radio ? '.radio' : ''), h('input', {type: opts.radio ? 'radio' : 'checkbox', name: opts.name, checked: on, disabled: opts.disabled, onchange}), h('span', label), opts.extra || null);
  }
  function area(value, oninput, opts = {}) {
    const t = h('textarea.au-ta', {rows: opts.rows || 4, placeholder: opts.ph || '', 'aria-label': opts.label || opts.ph || '', disabled: opts.disabled});
    t.value = value || ''; t.addEventListener('input', () => oninput(t.value)); return t;
  }
  function dl(name, text, type) {
    const a = h('a', {href: URL.createObjectURL(new Blob([text], {type})), download: name});
    document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }
  function hints(C, k) {
    if (S.mode !== 'learn' || !C.hints || !C.hints[k]) return null;
    const list = C.hints[k]; let n = 0;
    const box = h('div.au-hints');
    const btn = h('button.btn.sm.ghost.press', {type: 'button', onclick: () => {
      if (n < list.length) box.append(h('div.callout.plain', icon('lightbulb'), h('div', h('b', 'Pista'), h('span', list[n++]))));
      if (n >= list.length) btn.remove();
    }}, icon('lightbulb'), 'Ver una pista');
    return h('div.au-hint-wrap', btn, box);
  }
  const sec = (title, ...kids) => h('section.au-sec', h('h2', title), ...kids);

  /* ═════════ Motor de evaluación ═════════ */
  function expected(t, sample) {
    if (t.fail.includes('*')) return 'nc';
    if (t.needs && !t.needs.some(b => sample.includes(b))) return 'na';
    if (t.fail.some(b => sample.includes(b))) return 'nc';
    return 'ok';
  }
  function grade(C, st) {
    const P = C.plan, fb = [];
    const good = (t) => fb.push(['ok', t]), bad = (t) => fb.push(['bad', t]), info = (t) => fb.push(['info', t]);
    /* Planificación · 15 */
    let plan = 0;
    if (st.plan.obj === P.objectiveOk) { plan += 5; good('El objetivo se centra en comprobar el cumplimiento contra criterios.'); }
    else bad('El objetivo de una auditoría interna es comprobar el cumplimiento contra criterios, no revisar la técnica ni evaluar a personas.');
    const fit = (opts, chosen, flag) => opts.filter(o => (chosen.includes(o.id)) === !!o[flag]).length / opts.length;
    const sysFit = fit(P.systems, st.plan.sys, 'in'); plan += 5 * sysFit;
    const K = C.checks || {};
    const sysMiss = (K.sys || []).filter(x => !st.plan.sys.includes(x.id));
    sysMiss.forEach(x => bad(x.bad));
    if (!sysMiss.length && sysFit === 1 && K.sysGood) good(K.sysGood);
    const critFit = fit(P.criteria, st.plan.crit, 'rel'); plan += 3 * critFit;
    if (P.criteria.some(c => !c.rel && st.plan.crit.includes(c.id))) bad('Has incluido criterios que no tienen relación con el encargo.');
    plan += 2 * fit(P.techniques, st.plan.tech, 'rel');
    if (st.plan.tech.includes('pen')) bad('Una auditoría interna de este proceso no necesita pruebas de intrusión: se pide evidencia, no se ataca.');
    /* Selección de pruebas · 20 */
    let sel = 0;
    const smp = st.sample, pop = C.population;
    if (smp.length >= C.sampleMin) sel += 4; else bad('La muestra es demasiado pequeña para esta población.');
    /* Los elementos de mayor riesgo (cada caso dice cuáles) deben estar en la muestra */
    const must = K.mustSample || {ids: pop.filter(b => b.priv).map(b => b.id), good: '', bad: ''};
    if (must.ids.some(b => smp.includes(b))) { sel += 4; if (must.good) good(must.good); }
    else if (must.bad) bad(must.bad);
    const qs = new Set(pop.filter(b => smp.includes(b.id)).map(b => b.q));
    if (qs.size > 1) sel += 2; else bad('La muestra no cubre todo el periodo auditado.');
    const relEv = C.evidence.filter(e => e.rel).map(e => e.id), irr = C.evidence.filter(e => !e.rel).map(e => e.id);
    const gotRel = relEv.filter(e => st.req.includes(e)).length, gotIrr = irr.filter(e => st.req.includes(e)).length;
    sel += Math.max(0, 6 * gotRel / relEv.length - 1.5 * gotIrr);
    if (gotIrr) bad('Has pedido evidencias que no sirven para el objetivo.');
    (K.ev || []).forEach(x => { if (!st.req.includes(x.id)) bad(x.bad); });
    const keyQs = C.people.flatMap(p => p.qs).filter(q => q.key).map(q => q.id), offQs = C.people.flatMap(p => p.qs).filter(q => q.off).map(q => q.id);
    sel += Math.max(0, 4 * keyQs.filter(q => st.asked.includes(q)).length / keyQs.length - offQs.filter(q => st.asked.includes(q)).length);
    if (offQs.some(q => st.asked.includes(q))) bad('Hiciste preguntas fuera del alcance de la auditoría.');
    /* Análisis de evidencia · 25 */
    let okT = 0;
    C.tests.forEach(t => {
      const e = expected(t, smp), u = (st.tests[t.id] || {}).s || 'pend';
      if (u === e || (t.also || []).includes(u) || (e === 'na' && u === 'insuf')) okT++;
    });
    const ana = 25 * okT / C.tests.length;
    if (okT === C.tests.length) good('Todas las pruebas tienen el resultado que muestran las evidencias.');
    else info('Algunas pruebas no tienen el resultado que muestran las evidencias de tu muestra. Revisa la solución.');
    /* Calidad de hallazgos · 25 */
    const reach = C.key.filter(k => k.subj === 'rev' || k.subj === 'proc' || smp.includes(k.subj));
    /* Cada hallazgo del alumno cuenta una sola vez: se asigna a la clave de la solución que mejor encaja */
    let pts = 0; const matched = {}, used = new Set();
    const score = (f, k) => { let p = f.type === k.type ? 1 : (k.alt || []).includes(f.type) ? .6 : .3; if (!k.crit.includes(f.crit)) p *= .8; if (!f.ev.some(e => k.ev.includes(e))) p *= .8; return p; };
    const pairs = [];
    reach.forEach(k => st.finds.forEach((f, i) => { if (f.subj === k.subj) pairs.push([score(f, k) + (k.crit[0] === f.crit ? .01 : 0), k, i]); }));
    pairs.sort((x, y) => y[0] - x[0]).forEach(([p, k, i]) => { if (matched[k.id] != null || used.has(i)) return; matched[k.id] = Math.min(1, p); used.add(i); pts += Math.min(1, p); });
    reach.forEach(k => { if (matched[k.id] == null) matched[k.id] = 0; });
    let fp = 0;
    st.finds.forEach(f => {
      const tp = C.traps.find(x => x.subj === f.subj);
      if (tp && (f.type === 'nc' || f.type === 'obs')) { fp++; fb.push(['bad', tp.t, tp.why]); }
    });
    const qual = Math.max(0, (reach.length ? 25 * pts / reach.length : 0) - 4 * fp);
    if (!fp) good('No hay falsos positivos: no has convertido en hallazgo nada que estuviera justificado.');
    C.key.filter(k => !reach.includes(k)).forEach(k => fb.push(['info', 'Fuera de tu muestra', k.t]));
    /* Informe y seguimiento · 15 */
    let rep = 0;
    if (st.concl === C.conclusionOk) { rep += 6; good('La conclusión se corresponde con los hallazgos.'); } else bad('La conclusión no se corresponde con lo que muestran los hallazgos.');
    const sl = (st.summary || '').trim().length; rep += sl >= 60 ? 4 : sl >= 20 ? 2 : 0;
    if (sl < 60) bad('El resumen ejecutivo es demasiado breve.');
    const ncs = st.finds.filter(f => f.type === 'nc');
    if (ncs.length) {
      const full = ncs.filter(f => (f.corr || '').trim().length >= 10 && (f.ca || '').trim().length >= 10).length;
      rep += 5 * full / ncs.length;
      if (full < ncs.length) bad('Cada no conformidad necesita una corrección y una acción correctiva que ataque la causa.');
      else good('Cada no conformidad tiene corrección y acción correctiva.');
    }
    const parts = [['Planificación', plan, 15], ['Selección de pruebas', sel, 20], ['Análisis de evidencia', ana, 25], ['Calidad de hallazgos', qual, 25], ['Informe y seguimiento', rep, 15]]
      .map(([n, v, m]) => [n, Math.round(Math.min(v, m)), m]);
    return {total: parts.reduce((a, p) => a + p[1], 0), parts, fb, matched, date: new Date().toISOString().slice(0, 10)};
  }
  /* Requisitos para entregar: cada uno sabe si está hecho y en qué paso se completa */
  function readiness(C, st) {
    return [
      ['Objetivo de la auditoría', !!st.plan.obj, 'plan'],
      ['Alcance: al menos un sistema', st.plan.sys.length > 0, 'plan'],
      ['Al menos un criterio', st.plan.crit.length > 0, 'plan'],
      ['Muestra del tamaño mínimo', st.sample.length >= C.sampleMin, 'muestra'],
      ['Justificación de la muestra', (st.why || '').trim().length >= 10, 'muestra'],
      ['Resultado de al menos una prueba', C.tests.some(t => (st.tests[t.id] || {}).s && st.tests[t.id].s !== 'pend'), 'pruebas'],
      ['Conclusión del informe', !!st.concl, 'informe']
    ];
  }
  const missing = (C, st) => readiness(C, st).filter(r => !r[1]).map(r => r[0]);

  /* ═════════ Informe en Markdown ═════════ */
  function report(C, st) {
    const L = [], P = C.plan, T = tr;
    const name = (arr, id) => (arr.find(x => x.id === id) || {}).t || id;
    L.push('# ' + T('Informe de auditoría interna'), '', '> **' + T('SIMULACIÓN EDUCATIVA — NO ES UNA AUDITORÍA REAL') + '**  ', '> ' + T(WARN), '');
    L.push('## ' + T('Caso') + ' ' + C.n + ' · ' + C.t, '');
    C.brief.facts.forEach(([k, v]) => L.push('- **' + k + ':** ' + v));
    L.push('', '## 1. ' + T('Resumen ejecutivo'), '', st.summary || '—', '');
    L.push('## 2. ' + T('Objetivo'), '', name(P.objectives, st.plan.obj) || '—', '');
    L.push('## 3. ' + T('Alcance'), '', ...st.plan.sys.map(id => '- ' + name(P.systems, id)), '');
    L.push('## 4. ' + T('Criterios'), '', ...st.plan.crit.map(id => '- ' + name(P.criteria, id)), '');
    L.push('## 5. ' + T('Método'), '', ...st.plan.tech.map(id => '- ' + name(P.techniques, id)), '');
    L.push('## 6. ' + T('Muestra'), '', st.sample.join(', ') || '—', '', st.why || '', '');
    L.push('## 7. ' + T('Pruebas realizadas'), '', '| ' + T('Prueba') + ' | ' + T('Resultado') + ' | ' + T('Nota') + ' |', '|---|---|---|');
    const stName = (s) => T((C.testStates.find(x => x[0] === s) || [0, s])[1]);
    C.tests.forEach(t => { const r = st.tests[t.id] || {}; L.push('| ' + t.id + ' · ' + t.t + ' | ' + stName(r.s || 'pend') + ' | ' + (r.note || '').replace(/\|/g, '/').replace(/\n/g, ' ') + ' |'); });
    L.push('', '## 8. ' + T('Hallazgos'), '');
    if (!st.finds.length) L.push('—');
    st.finds.forEach((f, i) => {
      L.push('### H-' + String(i + 1).padStart(2, '0') + ' · ' + T((TYPES.find(x => x[0] === f.type) || [0, f.type])[1]), '',
        '- **' + T('Afecta a') + ':** ' + subjName(C, f.subj), '- **' + T('Criterio') + ':** ' + name(P.criteria, f.crit),
        '- **' + T('Evidencias') + ':** ' + f.ev.join(', '), '- **' + T('Condición observada') + ':** ' + (f.cond || '').replace(/\n/g, ' '));
      if (f.type === 'nc') L.push('- **' + T('Corrección') + ':** ' + (f.corr || '—'), '- **' + T('Acción correctiva') + ':** ' + (f.ca || '—'));
      L.push('');
    });
    L.push('## 9. ' + T('Conclusión'), '', name(C.conclusions, st.concl) || '—', '');
    L.push('## 10. ' + T('Limitaciones'), '', T('La auditoría se basa en una muestra y en evidencias aportadas por el auditado; lo que no entró en la muestra no se ha revisado.'), '');
    L.push('---', '', '_' + T('Generado con Atlas GRC · Simulador de auditoría') + ' · ' + new Date().toISOString().slice(0, 10) + '_', '');
    return L.join('\n');
  }
  function subjName(C, id) {
    const b = C.population.find(x => x.id === id); if (b) return b.id + ' · ' + b.role;
    const s = C.subjects.find(x => x[0] === id); return s ? s[1] : id;
  }

  /* ═════════ Centro de misiones ═════════ */
  function center() {
    const A = AUD();
    const modeSeg = h('div.seg', {role: 'group', 'aria-label': 'Modo'}, [['learn', 'Aprendiz', 'Con pistas'], ['pro', 'Auditor', 'Sin pistas']].map(([v, t, s]) =>
      h('button', {type: 'button', 'aria-pressed': String(S.mode === v), title: s, onclick: () => { S.mode = v; save(); refresh(); }}, t)));
    const card = (C) => {
      const st = S.cases[C.id], state = !st ? 'Sin empezar' : st.result ? 'Entregado' : 'En curso';
      return h('a.au-case', {href: '#/auditoria/' + C.id},
        h('div.au-case-n', C.n),
        h('div', h('div.ex-k', icon('scan-search'), C.kind, ' · ', C.level, ' · ≈ ', String(C.mins), ' min'), h('h3', C.t), h('p', C.s),
          h('div.au-tags', C.skills.map(s => h('span.tag', s)))),
        h('div.au-case-st', h('span.tag' + (st && st.result ? '.ok' : st ? '.track' : ''), state), st && st.result ? h('b', st.result.total + '/100') : null, icon('chevron-right')));
    };
    return h('div.view.au',
      h('h1', 'Simulador de auditoría'),
      h('p.lede', 'Aprende a trabajar como auditor interno y analista GRC: recibes un encargo, planificas, eliges una muestra, pides evidencias, entrevistas a las personas, ejecutas pruebas, redactas hallazgos y presentas un informe. Con Albatrel como cliente.'),
      warn(),
      h('div.au-mode', h('span', 'Modo'), modeSeg, h('small', S.mode === 'learn' ? 'Aprendiz: cada paso tiene pistas.' : 'Auditor: sin pistas, como en un encargo real.')),
      sec('Casos', h('div.au-cases', A.order.map(id => card(A.cases[id])),
        (A.soon || []).filter(([n]) => !A.order.some(id => A.cases[id].n === n)).map(([n, t, s]) => h('div.au-case.soon', {'aria-disabled': 'true'}, h('div.au-case-n', n), h('div', h('h3', t), h('p', s)), h('div.au-case-st', h('span.tag', 'Próximamente')))))),
      sec('Itinerario de 12 semanas',
        h('p.au-p', 'Un recorrido para pasar de cero a defender un caso de auditoría en una entrevista. Cada fase se apoya en lo que ya tienes en Atlas.'),
        h('ol.au-road', ROAD.map(([w, t, d, href, cta]) => h('li', h('span.au-w', w), h('div', h('b', t), h('p', d), href ? h('a.link', {href}, cta, ' →') : h('small', cta)))))),
      sec('Auditar no es lo mismo que implantar',
        h('div.au-roles', ROLES.map(([t, d]) => h('div', h('b', t), h('p', d))))),
      h('div.au-foot', h('button.btn.sm', {type: 'button', onclick: exportAll}, icon('download'), 'Exportar mi progreso (JSON)'),
        h('label.btn.sm', icon('upload'), 'Importar', h('input', {type: 'file', accept: 'application/json', hidden: true, onchange: (e) => importAll(e.target.files[0])})),
        h('button.btn.sm.ghost', {type: 'button', onclick: () => UI.ask({title: tr('¿Borrar todo el progreso del simulador?'), text: tr('Se borrarán tus intentos, notas y hallazgos de los cinco casos. El resto de Atlas no cambia.'), ok: tr('Borrar todo'), cancel: tr('Cancelar'), danger: true}).then(ok => { if (!ok) return; S = blank(); save(); toast(tr('Progreso del simulador borrado')); refresh(); })}, icon('trash-2'), 'Borrar todo')));
  }
  const ROAD = [
    ['1–2', 'Fundamentos', 'Qué es un SGSI, las cláusulas 4 a 10 y qué hace un auditor interno.', '#/ruta', 'Bloques 0 y 1'],
    ['3–4', 'Riesgos', 'Activos, amenazas, impacto, probabilidad, tratamiento y Declaración de Aplicabilidad.', '#/b/m2', 'Bloque 2'],
    ['5–6', 'Controles', 'Convertir los 93 controles en preguntas, pruebas y evidencias.', '#/norma/controles', 'Mapa de la norma'],
    ['7–8', 'Auditoría completa', 'Plan, entrevistas, muestreo, pruebas, hallazgos e informe.', '#/auditoria/c01', 'Caso 01'],
    ['9–10', 'Operativa GRC', 'Seguimiento de evidencias, acciones correctivas y reuniones.', null, 'Próximos casos'],
    ['11–12', 'Empleabilidad', 'Defender tus hallazgos, preparar el examen y presentar tu informe como portfolio.', '#/examen', 'Simulacro']
  ];
  const ROLES = [
    ['Implantación', 'Construir el SGSI: alcance, política, riesgos, controles y mejora.'],
    ['Auditoría interna', 'Comprobar con criterios, muestras y evidencias si el SGSI cumple y funciona.'],
    ['Auditoría de certificación', 'La hace una entidad acreditada (tercera parte). Este simulador no la reproduce.'],
    ['Operación GRC', 'El día a día: riesgos, evidencias, excepciones, responsables y acciones pendientes.']
  ];
  function exportAll() { dl('atlas-auditoria-progreso.json', JSON.stringify(S, null, 2), 'application/json'); }
  function importAll(file) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || d.v !== 1 || typeof d.cases !== 'object') throw new Error('formato');
        const out = blank(); out.mode = d.mode === 'pro' ? 'pro' : 'learn';
        Object.keys(d.cases).forEach(id => {
          if (!AUD().cases[id]) return;
          const src = d.cases[id], c = Object.assign(fresh(), {attempts: []});
          const arr = (v) => Array.isArray(v) ? v.filter(x => typeof x === 'string').slice(0, 50) : [];
          const str = (v) => typeof v === 'string' ? v.slice(0, 4000) : '';
          c.plan = {obj: str(src.plan && src.plan.obj), sys: arr(src.plan && src.plan.sys), crit: arr(src.plan && src.plan.crit), tech: arr(src.plan && src.plan.tech)};
          c.sample = arr(src.sample); c.why = str(src.why); c.req = arr(src.req); c.asked = arr(src.asked);
          c.summary = str(src.summary); c.concl = str(src.concl);
          Object.entries(src.tests || {}).forEach(([k, v]) => { c.tests[k] = {s: str(v && v.s), note: str(v && v.note)}; });
          c.finds = (Array.isArray(src.finds) ? src.finds : []).slice(0, 30).map(f => ({type: str(f.type), subj: str(f.subj), crit: str(f.crit), ev: arr(f.ev), cond: str(f.cond), corr: str(f.corr), ca: str(f.ca)}));
          c.attempts = (Array.isArray(src.attempts) ? src.attempts : []).slice(-20).map(a => ({date: str(a.date), total: +a.total || 0}));
          out.cases[id] = c;
        });
        S = out; save(); toast(tr('Progreso importado')); refresh();
      } catch (e) { toast(tr('Ese fichero no es un progreso válido del simulador')); }
    };
    r.readAsText(file);
  }

  /* ═════════ Espacio de trabajo de un caso ═════════ */
  function caseView(id, step) {
    const C = AUD().cases[id];
    if (!C) return Views.notFound();
    const st = cs(id), locked = !!st.result;
    step = STEPS.some(s => s[0] === step) || step === 'resultado' ? step : 'encargo';
    const idx = STEPS.findIndex(s => s[0] === step);
    const body = h('div.au-body');
    const set = (fn, re = true) => { if (locked) return; fn(st); save(); if (re) refreshBody(); };
    const refreshBody = () => { const y = scrollY; const v = caseView(id, step); document.querySelector('.au')?.replaceWith(v); scrollTo(0, y); };
    const nav = h('nav.au-steps', {'aria-label': 'Pasos de la auditoría'}, STEPS.map(([k, t, ic], i) =>
      h('a', {href: '#/auditoria/' + id + '/' + k, 'aria-current': k === step ? 'step' : null}, h('span', String(i + 1)), icon(ic), h('em', t))),
      st.result ? h('a', {href: '#/auditoria/' + id + '/resultado', 'aria-current': step === 'resultado' ? 'step' : null}, icon('award'), h('em', 'Resultado')) : null);
    /* En el móvil, la barra de pasos se desplaza hasta el paso actual */
    setTimeout(() => { const cur = nav.querySelector('[aria-current]'); if (cur) nav.scrollLeft = cur.offsetLeft - (nav.clientWidth - cur.offsetWidth) / 2; }, 0);
    const P = C.plan;
    const dis = {disabled: locked};

    if (step === 'encargo') body.append(
      h('div.au-letter', h('div.ex-k', icon('mail'), 'Carta de encargo'), h('p.au-from', C.brief.from, ' · ', C.brief.date), C.brief.body.map(p => h('p', p))),
      h('dl.au-facts', C.brief.facts.map(([k, v]) => [h('dt', k), h('dd', v)])),
      h('p.au-p', 'Antes de pedir nada, piensa qué tendría que pasar para que la respuesta fuera «sí, funciona», y qué te haría falta para demostrarlo.'),
      hints(C, 'brief'));

    if (step === 'plan') body.append(
      sec('Objetivo', h('div.au-list', P.objectives.map(o => check(o.t, st.plan.obj === o.id, () => set(s => { s.plan.obj = o.id; }), {radio: true, name: 'obj', ...dis})))),
      sec('Alcance: sistemas', h('div.au-list', P.systems.map(o => check(o.t, st.plan.sys.includes(o.id), () => set(s => toggle(s.plan.sys, o.id)), dis)))),
      sec('Criterios de auditoría', h('p.au-p', 'Contra qué compararás lo que encuentres. Elige solo lo que aplica a este encargo.'),
        h('div.au-list', P.criteria.map(o => check(o.t, st.plan.crit.includes(o.id), () => set(s => toggle(s.plan.crit, o.id)), dis)))),
      sec('Técnicas', h('div.au-list', P.techniques.map(o => check(o.t, st.plan.tech.includes(o.id), () => set(s => toggle(s.plan.tech, o.id)), dis)))),
      sec('Agenda', table({head: ['Cuándo', 'Qué'], rows: P.agenda})),
      hints(C, 'plan'));

    if (step === 'muestra') body.append(
      h('p.au-p', C.popIntro || 'Esta es la población: todo lo que podrías revisar.', ' ', 'Elige al menos', ' ', String(C.sampleMin), ' ', 'y explica por qué.'),
      h('div.au-list', C.population.map(b => check(h('span.au-b', h('b', b.id), ' ', b.role, h('small', b.out)), st.sample.includes(b.id), () => set(s => toggle(s.sample, b.id)), dis))),
      h('div.au-count', h('b', String(st.sample.length)), ' / ', String(C.population.length), h('span', ' en la muestra')),
      sec('Justificación de la muestra', area(st.why, (v) => set(s => { s.why = v; }, false), {ph: C.sampleWhyPh || 'Piensa en el riesgo y en el periodo.', ...dis})),
      hints(C, 'sample'));

    if (step === 'evidencias') {
      const got = C.evidence.filter(e => st.req.includes(e.id)), left = C.evidence.filter(e => !st.req.includes(e.id));
      body.append(
        h('p.au-p', 'Pide al auditado lo que necesites. Cada petición le cuesta tiempo: pide solo lo que sirve para el objetivo.'),
        left.length ? sec('Solicitar', h('div.au-req', left.map(e => h('button.au-req-i.press', {type: 'button', disabled: locked, onclick: () => set(s => { s.req.push(e.id); })},
          icon('send'), h('div', h('b', e.t), h('small', e.from, ' · ', e.type)))))) : null,
        sec('Sala de evidencias', got.length ? h('div.au-evs', got.map(e => evCard(C, e, st, set, locked))) : h('p.au-empty', 'Aún no has pedido ninguna evidencia.')),
        hints(C, 'evidence'));
    }

    if (step === 'entrevistas') body.append(
      h('p.au-p', 'Las respuestas orientan, pero no son evidencia por sí solas: contrástalas con documentos y extractos.'),
      h('div.au-people', C.people.map(p => h('div.au-person',
        h('div.au-ph', h('span.au-av', icon('user-round')), h('div', h('b', p.name), h('small', p.role))),
        h('div.au-qs', p.qs.map(q => {
          const asked = st.asked.includes(q.id);
          return h('div.au-q' + (asked ? '.on' : ''),
            h('button', {type: 'button', 'aria-expanded': String(asked), disabled: locked && !asked, onclick: () => { if (!asked) set(s => { s.asked.push(q.id); }); }}, icon('messages-square'), h('span', q.q)),
            asked ? h('p.au-a', '«', q.a, '»') : null);
        }))))),
      hints(C, 'people'));

    if (step === 'pruebas') body.append(
      h('p.au-p', 'Para cada prueba, mira las evidencias de los elementos de tu muestra y registra el resultado. Tu muestra:', ' ', h('b', st.sample.join(', ') || '—')),
      h('div.au-tests', C.tests.map(t => {
        const r = st.tests[t.id] || {s: 'pend', note: ''};
        return h('div.au-test',
          h('div.au-test-h', h('span.tag.track', t.id), h('b', t.t)),
          h('dl.au-mini', h('dt', 'Criterio'), h('dd', (P.criteria.find(c => c.id === t.crit) || {}).t || ''), h('dt', 'Evidencia esperada'), h('dd', t.ev), h('dt', 'Procedimiento'), h('dd', t.how)),
          h('div.au-states', {role: 'radiogroup', 'aria-label': t.id}, C.testStates.map(([v, l]) => h('button.pill.press', {type: 'button', role: 'radio', 'aria-checked': String(r.s === v), 'aria-pressed': String(r.s === v), disabled: locked,
            onclick: () => set(s => { s.tests[t.id] = Object.assign(s.tests[t.id] || {note: ''}, {s: v}); })}, l))),
          area(r.note, (v) => set(s => { s.tests[t.id] = Object.assign(s.tests[t.id] || {s: 'pend'}, {note: v}); }, false), {rows: 2, ph: 'Nota: qué has visto y en qué evidencia', ...dis}));
      })),
      hints(C, 'tests'));

    if (step === 'hallazgos') body.append(
      h('p.au-p', 'Un hallazgo = criterio + condición observada + evidencia. Si algo no se puede demostrar, no es un hallazgo: es evidencia insuficiente.'),
      st.finds.length ? h('div.au-finds', st.finds.map((f, i) => h('div.au-find',
        h('div.au-find-h', h('span.tag' + (f.type === 'nc' ? '.warn' : f.type === 'obs' ? '.track' : ''), (TYPES.find(x => x[0] === f.type) || [0, ''])[1]), h('b', 'H-' + String(i + 1).padStart(2, '0')), h('span', subjName(C, f.subj)),
          locked ? null : h('span.au-act', h('button.btn.sm.ghost.press', {type: 'button', onclick: () => findForm(C, st, set, i)}, icon('notebook-pen'), 'Editar'), h('button.btn.sm.ghost', {type: 'button', 'aria-label': 'Eliminar hallazgo', onclick: () => set(s => { s.finds.splice(i, 1); })}, icon('trash-2')))),
        h('p', f.cond), h('small', (P.criteria.find(c => c.id === f.crit) || {}).t || '', ' · ', f.ev.join(', '))))) : h('p.au-empty', 'Aún no has registrado hallazgos.'),
      locked ? null : h('button.btn.primary.press', {type: 'button', onclick: () => findForm(C, st, set, -1)}, icon('flag'), 'Registrar un hallazgo'),
      hints(C, 'findings'));

    if (step === 'informe') {
      body.append(
        sec('Resumen ejecutivo', h('p.au-p', 'Lo que leerá la Gerencia en un minuto: qué se auditó, qué se encontró y qué significa.'),
          area(st.summary, (v) => set(s => { s.summary = v; }, false), {rows: 5, ph: 'Resumen ejecutivo', ...dis})),
        sec('Conclusión', h('div.au-list', C.conclusions.map(o => check(o.t, st.concl === o.id, () => set(s => { s.concl = o.id; }), {radio: true, name: 'concl', ...dis})))),
        sec('Exportar', h('div.au-btns',
          h('button.btn', {type: 'button', onclick: () => dl('informe-auditoria-' + C.id + '.md', report(C, st), 'text/markdown')}, icon('file-down'), 'Informe (Markdown)'),
          h('button.btn', {type: 'button', onclick: () => dl('expediente-' + C.id + '.json', JSON.stringify({simulacion: true, aviso: tr(WARN), caso: C.id, version: C.v, estado: st}, null, 2), 'application/json')}, icon('download'), 'Expediente (JSON)'))),
        locked ? null : sec('Entregar', (() => {
          const rd = readiness(C, st), done = rd.filter(r => r[1]).length, ready = done === rd.length;
          return [
            h('div.au-ready',
              h('div.au-ready-h', h('b', ready ? 'Todo listo para entregar' : 'Antes de entregar'), h('span.au-ready-n', h('b', String(done)), ' / ', String(rd.length))),
              h('i.au-ready-bar', h('em', {style: {transform: 'scaleX(' + (done / rd.length) + ')'}})),
              h('ul.au-ready-l', rd.map(([t, ok, step]) => h('li' + (ok ? '.ok' : ''),
                h('span.au-tick', ok ? icon('check') : null), h('span', t),
                !ok && step !== 'informe' ? h('a.link', {href: '#/auditoria/' + id + '/' + step}, STEPS.find(x => x[0] === step)[1], ' →') : null)))),
            h('p.au-p', ready ? 'Al entregar verás tu puntuación por competencias y la solución del caso.' : 'Completa lo que falta; cada enlace te lleva al paso correspondiente.'),
            h('button.btn.primary.lg.press', {type: 'button', disabled: !ready, onclick: () => {
              const r = grade(C, st); st.result = r; st.attempts = (st.attempts || []).concat({date: r.date, total: r.total}); save();
              location.hash = '#/auditoria/' + id + '/resultado';
            }}, icon('send'), 'Entregar y evaluar')];
        })()),
        hints(C, 'report'));
    }

    if (step === 'resultado' && st.result) body.append(resultView(C, st, id));

    if (locked && step !== 'resultado') body.prepend(h('div.callout.case', icon('lock'), h('div', h('b', 'Caso entregado'), h('span', 'Puedes revisarlo y exportarlo. Para volver a intentarlo, empieza de nuevo desde el resultado.'))));

    const next = STEPS[idx + 1], prev = STEPS[idx - 1];
    const pager = idx >= 0 ? h('div.au-pager',
      prev ? h('a.btn', {href: '#/auditoria/' + id + '/' + prev[0]}, icon('arrow-left'), prev[1]) : h('a.btn', {href: '#/auditoria'}, icon('arrow-left'), 'Casos'),
      next ? h('a.btn.dark', {href: '#/auditoria/' + id + '/' + next[0]}, next[1], icon('arrow-right')) : null) : null;

    return h('div.view.au',
      h('a.au-back.press', {href: '#/auditoria'}, icon('chevron-left'), 'Simulador de auditoría'),
      h('div.eyebrow.track', h('span.dot'), 'Caso ', C.n, ' · ', C.kind),
      h('h1.au-h1', C.t),
      warn(), nav,
      h('h2.au-step', step === 'resultado' ? 'Resultado' : STEPS[idx][1]),
      body, pager);
  }

  function evCard(C, e, st, set, locked) {
    const mark = st.marks[e.id] || '';
    return h('details.au-ev', {open: true},
      h('summary', h('span.tag', e.id), h('b', e.t), h('small', e.from, ' · ', e.type, ' · ', e.date)),
      e.note ? h('p.au-p', e.note) : null,
      e.table ? table(e.table) : null,
      e.link ? h('a.link', {href: e.link}, 'Abrir el documento en el caso Albatrel', ' →') : null,
      h('label.au-mark', h('span', 'Tu valoración'),
        h('select', {disabled: locked, onchange: (ev) => set(s => { s.marks[e.id] = ev.target.value; }, false)},
          [['', 'Sin valorar'], ['ok', 'Suficiente'], ['insuf', 'Insuficiente'], ['contra', 'Contradictoria'], ['irr', 'No sirve para el objetivo']].map(([v, l]) => h('option', {value: v, selected: mark === v}, l)))));
  }

  function findForm(C, st, set, i) {
    const f = i >= 0 ? JSON.parse(JSON.stringify(st.finds[i])) : {type: 'nc', subj: '', crit: '', ev: [], cond: '', corr: '', ca: ''};
    const subjects = [...C.population.filter(b => st.sample.includes(b.id)).map(b => [b.id, b.id + ' · ' + b.role]), ...C.subjects];
    panel(close => {
      /* Cada campo lleva su propio mensaje de error, que dice qué falla y cómo arreglarlo */
      const fields = {};
      const field = (key, label, ctl, help) => {
        const msg = h('p.au-ferr', {id: 'fe-' + key, role: 'alert'});
        const wrap = h('div.au-field', h('label.au-lbl', label), help ? h('small.au-help', help) : null, ctl, msg);
        fields[key] = {wrap, msg, ctl}; return wrap;
      };
      const clear = (key) => { const x = fields[key]; if (x) { x.wrap.classList.remove('is-error'); x.msg.textContent = ''; } };
      const ncBox = h('div');
      const drawNc = () => { ncBox.textContent = ''; if (f.type === 'nc') ncBox.append(
        field('corr', 'Corrección', area(f.corr, v => { f.corr = v; }, {rows: 2, ph: 'Qué se hace ya con lo detectado'}), 'Arregla este caso concreto.'),
        field('ca', 'Acción correctiva', area(f.ca, v => { f.ca = v; }, {rows: 2, ph: 'Qué cambia para atacar la causa'}), 'Evita que vuelva a pasar.')); };
      drawNc();
      const types = h('div.seg.au-seg', {role: 'group', 'aria-label': 'Tipo'}, TYPES.map(([v, l]) => h('button', {type: 'button', 'aria-pressed': String(f.type === v), onclick: (e) => {
        f.type = v; types.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); drawNc(); }}, l)));
      const sel = (opts, val, on, ph) => h('select.au-sel', {'aria-label': ph, onchange: (e) => on(e.target.value)}, h('option', {value: ''}, ph), opts.map(([v, l]) => h('option', {value: v, selected: val === v}, l)));
      const evs = C.evidence.filter(e => st.req.includes(e.id));
      const save = () => {
        Object.keys(fields).forEach(clear);
        const errs = [];
        if (!f.subj) errs.push(['subj', 'Elige a qué elemento o proceso afecta.']);
        if (!f.crit) errs.push(['crit', 'Elige el criterio: sin criterio no hay hallazgo.']);
        if (!f.ev.length) errs.push(['ev', evs.length ? 'Marca al menos una evidencia que lo demuestre.' : 'Primero pide evidencias en el paso 4.']);
        if (f.cond.trim().length < 20) errs.push(['cond', 'Describe qué viste, cuándo y en qué evidencia (al menos una frase).']);
        if (f.type === 'nc' && (f.corr || '').trim().length < 10) errs.push(['corr', 'Indica qué se hace ya con este caso.']);
        if (f.type === 'nc' && (f.ca || '').trim().length < 10) errs.push(['ca', 'Indica qué cambia para que no se repita.']);
        if (errs.length) {
          errs.forEach(([k, m]) => { const x = fields[k]; if (!x) return; x.msg.textContent = tr(m); x.wrap.classList.remove('is-error'); void x.wrap.offsetWidth; x.wrap.classList.add('is-error'); });
          const first = fields[errs[0][0]].wrap; first.scrollIntoView({block: 'center', behavior: UI.RM() ? 'auto' : 'smooth'});
          const ctl = first.querySelector('select,textarea,input'); ctl && ctl.focus({preventScroll: true});
          return;
        }
        set(s => { if (i >= 0) s.finds[i] = f; else s.finds.push(f); }); close(); toast(tr(i >= 0 ? 'Hallazgo actualizado' : 'Hallazgo registrado'));
      };
      return [
        h('div.panel-h', h('div', h('h2', i >= 0 ? 'Editar hallazgo' : 'Nuevo hallazgo'), h('p.au-sub', 'Criterio + condición observada + evidencia.')),
          h('button.ib.press', {type: 'button', 'aria-label': 'Cerrar', onclick: close}, icon('x'))),
        h('div.panel-b.au-form',
          field('type', 'Tipo', types),
          field('subj', 'Afecta a', sel(subjects, f.subj, v => { f.subj = v; clear('subj'); }, 'Elige un elemento de tu muestra o un proceso')),
          field('crit', 'Criterio', sel(C.plan.criteria.map(c => [c.id, c.t]), f.crit, v => { f.crit = v; clear('crit'); }, 'Elige el criterio'), 'El requisito que no se cumple o que queda afectado.'),
          field('ev', 'Evidencias que lo demuestran', evs.length ? h('div.au-list', evs.map(e => check(h('span.au-b', h('b', e.id), ' ', e.t), f.ev.includes(e.id), () => { toggle(f.ev, e.id); clear('ev'); }))) : h('p.au-empty', 'Primero pide evidencias en la sala de evidencias.')),
          field('cond', 'Condición observada', area(f.cond, v => { f.cond = v; if (v.trim().length >= 20) clear('cond'); }, {rows: 3, ph: 'Qué has visto, cuándo y en qué evidencia'}), 'Hechos, sin opiniones.'),
          ncBox),
        h('div.panel-f', h('button.btn.press', {type: 'button', onclick: close}, 'Cancelar'), h('button.btn.primary.press', {type: 'button', onclick: save}, icon('check'), 'Guardar hallazgo'))];
    });
  }

  function resultView(C, st, id) {
    const r = st.result;
    return h('div.au-res',
      h('div.au-score.is-in', h('div.au-big', h('b', String(r.total).split('').map((d, k) => h('span.au-dig', {style: {'--k': k}}, d))), h('span', '/100')),
        h('div.au-bars', r.parts.map(([n, v, m], k) => h('div.au-bar', {style: {'--k': k}}, h('span', n), h('i', h('em', {style: {'--v': v / m}})), h('b', v + '/' + m))))),
      sec('Lo que has hecho bien y lo que falta', h('ul.au-fb', r.fb.map(([k, t, sub]) => h('li.' + k, icon(k === 'ok' ? 'circle-check' : k === 'bad' ? 'circle-x' : 'info'), h('span', h('b', t), sub ? h('span', sub) : null))))),
      sec('Solución del caso', h('p.au-p', 'Estos son los hallazgos que se podían demostrar con las evidencias.'),
        h('div.au-key', C.key.map(k => {
          const got = r.matched[k.id];
          return h('div.au-k', h('div.au-find-h', h('span.tag' + (k.type === 'nc' ? '.warn' : '.track'), (TYPES.find(x => x[0] === k.type) || [0, ''])[1]), h('b', k.t),
            h('span.tag' + (got >= .9 ? '.ok' : ''), got == null ? 'Fuera de tu muestra' : got >= .9 ? 'Detectado' : got > 0 ? 'Detectado en parte' : 'No detectado')),
            h('p', k.why), h('small', 'Evidencias: ', k.ev.join(', ')));
        })),
        h('h3.au-h3', 'Lo que no era un hallazgo'),
        h('div.au-key', C.traps.map(t => h('div.au-k', h('b', t.t), h('p', t.why))))),
      sec('Informe modelo', h('p.au-p', C.model.summary), table({head: ['Tipo', 'Acción'], rows: C.model.actions})),
      sec('Intentos', h('div.au-att', (st.attempts || []).map((a, i) => h('span.tag', '#' + (i + 1) + ' · ' + a.date + ' · ' + a.total + '/100')))),
      h('div.au-btns',
        h('button.btn.primary', {type: 'button', onclick: () => { const att = st.attempts; S.cases[id] = Object.assign(fresh(), {attempts: att}); save(); location.hash = '#/auditoria/' + id + '/encargo'; toast(tr('Caso reiniciado: el resto de tu progreso sigue igual')); }}, icon('rotate-ccw'), 'Empezar de nuevo'),
        h('button.btn', {type: 'button', onclick: () => dl('informe-auditoria-' + C.id + '.md', report(C, st), 'text/markdown')}, icon('file-down'), 'Descargar mi informe')));
  }

  /* ═════════ Tarjeta de novedad en «Hoy» ═════════
     Una demo en miniatura del simulador (reglas de stageshow): se pulsa «Auditar», las bajas pasan de
     «Pendiente» a su resultado una a una, el anillo cuenta el cumplimiento y aparece la acción correctiva.
     Diseñada a tamaño fijo y escalada al hueco; en el móvil tiene su propia versión compacta.
     El fotograma fijo es el resultado: es lo que se ve con «reducir movimiento». */
  function promo() {
    const C = AUD().cases.c01; if (!C) return null;
    const ROWS = [
      ['B-01', 'Soporte a ayuntamientos', 'ok', 'check', 'Correcto'],
      ['B-02', 'Desarrollador', 'nc', 'circle-x', '7 días tarde'],
      ['B-03', 'Analista de datos', 'ex', 'info', 'Excepción EX-03'],
      ['B-04', 'Soporte a clínicas', 'nc', 'circle-x', 'Cuenta activa'],
      ['B-07', 'Administrador', 'nc', 'circle-x', 'adm- 3 días tarde']];
    const rows = ROWS.map(([id, role, k, ic, label]) => h('div.ap-row', {'data-k': k},
      h('span.ap-av', icon('user-round')), h('span.ap-who', h('b', id), h('small', role)),
      h('span.ap-st', h('span.ap-st-p', 'Pendiente'), h('span.ap-st-r', icon(ic), label))));
    const R = 30, CIRC = 2 * Math.PI * R;
    const num = h('b.ap-num', '—');
    const ring = h('div.ap-ring', {html: '<svg viewBox="0 0 76 76"><circle class="bg" cx="38" cy="38" r="' + R + '"/><circle class="fg" cx="38" cy="38" r="' + R + '" stroke-dasharray="' + CIRC + '" stroke-dashoffset="' + CIRC + '"/></svg>'});
    ring.append(h('span.ap-ring-c', num, h('small', 'de 100')));
    const cnt = (k, n, l) => h('span.ap-cnt.' + k, h('b', String(n)), h('small', l));
    const nav = (ic, t, on) => h('span.ap-nav' + (on ? '.on' : ''), icon(ic), t);
    const btn = h('span.ap-btn', icon('scan-search'), h('span', 'Auditar'));
    const win = h('div.ap-win',
      h('div.ap-chrome', h('i.r'), h('i.y'), h('i.g'), h('span.ap-url', icon('lock'), 'atlas-grc · auditoría')),
      h('div.ap-body',
        h('div.ap-side', h('span.ap-brand', icon('atlas'), 'Atlas GRC'), nav('mail-open', 'Encargo'), nav('folder-open', 'Evidencias'), nav('clipboard-check', 'Pruebas', true), nav('flag', 'Hallazgos'), nav('file-text', 'Informe'), h('i.ap-bar', {style: {width: '62px'}}), h('i.ap-bar', {style: {width: '48px'}})),
        h('div.ap-main',
          h('div.ap-head', h('span.ap-doc', icon('file-text')), h('div', h('b', 'Caso 01 · Bajas de personal'), h('small', 'Albatrel · primer semestre de 2026')), btn),
          h('div.ap-grid',
            h('div.ap-card.ap-list', h('div.ap-card-h', h('b', 'Muestra'), h('small', '5 bajas')), rows),
            h('div.ap-col',
              h('div.ap-card.ap-score', h('div.ap-card-h', h('b', 'Cumplimiento')), ring, h('span.ap-risk', 'Riesgo alto'),
                h('div.ap-cnts', cnt('nc', 3, 'NC'), cnt('ex', 1, 'Exc.'), cnt('ok', 1, 'OK'))),
              h('div.ap-card.ap-fix', h('div.ap-card-h', icon('notebook-pen'), h('b', 'Acción correctiva')), h('p', 'Añadir la consola de clínicas y las cuentas adm- al ticket de baja.')))))));
    const cursor = h('span.ap-cursor', {html: '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z"/></svg>'});
    const scaler = h('div.ap-scaler', win, cursor);
    const stage = h('div.au-pr-stage', {'aria-hidden': 'true'}, scaler);
    const card = h('a.au-promo.press', {href: '#/auditoria'},   // siempre al panel principal del simulador
      h('span.au-new', icon('zap'), 'Nuevo'),
      h('div.au-pr-copy',
        h('div.au-pr-k', icon('scan-search'), 'Simulador de auditoría'),
        h('h3', 'Audita Albatrel como lo haría un profesional'),
        h('p', 'Pide evidencias, entrevista al equipo, encuentra las no conformidades y entrega tu informe. Con la solución al final.'),
        h('span.au-pr-cta', 'Ver los 5 casos', icon('arrow-right'))),
      stage);

    /* Escala: diseño a tamaño fijo, encajado en el hueco */
    let scale = 1;
    const fit = () => {
      const w = stage.clientWidth; if (!w) return;
      const compact = w < 540; scaler.dataset.compact = compact ? '1' : '';
      const dw = compact ? 400 : 640, left = compact ? 18 : 36;
      scale = Math.min(1, (w - left * 2) / dw);   // márgenes iguales a los lados; solo se corta por abajo
      scaler.style.setProperty('--s', scale); scaler.style.setProperty('--l', left + 'px');
    };
    const ro = new ResizeObserver(fit); setTimeout(() => { if (card.isConnected) { ro.observe(stage); fit(); } }, 0);

    /* Estados */
    const fill = (pct, ms) => {
      const fg = ring.querySelector('.fg'); fg.style.strokeDashoffset = CIRC * (1 - pct / 100);
      if (!ms) { num.textContent = pct ? String(pct) : '—'; return; }
      const t0 = performance.now();
      const step = (t) => { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3); num.textContent = String(Math.round(pct * e)); if (k < 1 && card.isConnected) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const cursorTo = (el, dx = 0, dy = 0) => {
      const sr = scaler.getBoundingClientRect(), r = el.getBoundingClientRect();
      cursor.style.setProperty('--x', ((r.left - sr.left + r.width * .6) / scale + dx) + 'px');
      cursor.style.setProperty('--y', ((r.top - sr.top + r.height * .55) / scale + dy) + 'px');
    };
    const away = () => { cursor.style.setProperty('--x', '106%'); cursor.style.setProperty('--y', '88%'); };
    const reset = () => { stage.dataset.beat = '0'; rows.forEach(r => r.classList.remove('on')); fill(0, 0); stage.classList.remove('busy'); away(); };
    const poster = () => { stage.dataset.beat = '9'; rows.forEach(r => r.classList.add('on')); fill(58, 0); stage.classList.remove('busy'); away(); };
    poster();
    if (UI.RM()) return card;

    let timers = [], running = false;
    const stop = () => { timers.forEach(clearTimeout); timers = []; running = false; };
    const at = (t, f) => timers.push(setTimeout(() => card.isConnected ? f() : stop(), t));
    const run = () => {
      reset();
      at(500, () => cursorTo(btn));
      at(1500, () => stage.classList.add('press'));
      at(1700, () => { stage.classList.remove('press'); stage.classList.add('busy'); stage.dataset.beat = '1'; });
      rows.forEach((r, i) => at(2100 + i * 520, () => r.classList.add('on')));
      at(3140, () => cursorTo(rows[2], 40, 30));
      at(4800, () => { stage.classList.remove('busy'); stage.dataset.beat = '2'; fill(58, 1100); });
      at(6000, () => { stage.dataset.beat = '9'; away(); });
      at(11800, () => { stage.dataset.beat = 'out'; });
      at(12400, run);
    };
    const play = () => { if (running) return; running = true; run(); };
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting && !document.hidden) play(); else { stop(); poster(); } }), {threshold: .4});
    setTimeout(() => card.isConnected && io.observe(card), 0);
    App.onLeave(() => { stop(); io.disconnect(); ro.disconnect(); });
    return card;
  }

  function refresh() { if (location.hash.startsWith('#/auditoria')) window.dispatchEvent(new HashChangeEvent('hashchange')); }

  window.Audit = {
    view(id, step) { return id ? caseView(id, step) : center(); },
    promo,
    state: () => S, grade, expected, report
  };
})();
