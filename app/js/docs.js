/* Atlas GRC · documentos del caso Albatrel: visor, descarga y modo «Construir». */
(function () {
  const {h, icon, rich, toast, confetti} = UI;
  const LVL = {POL: ['Política', '#5e5ce6'], DOC: ['Documentos del sistema', '#30b0c7'], NOR: ['Normativas', '#ff9f0a'], PRO: ['Procedimientos', '#34c759'], REG: ['Registros', '#bf5af2']};
  const C = () => App.T().caso;
  const doc = (id) => C().docs.find(d => d.id === id);

  function table(t) {
    return h('div.dtw', h('table.dtable', h('thead', h('tr', t.head.map(x => h('th', x)))), h('tbody', t.rows.map(r => h('tr', r.map(c => h('td', {html: rich(String(c))})))))));
  }
  const lv = (l) => h('span.lv', {'data-l': l}, l);
  const st = (s) => h('span.st-pill', {'data-s': s}, s);

  /* Secciones especiales generadas a partir de los datos */
  function special(d) {
    const c = C();
    if (d.special === 'risks') return [h('h2', '1. Riesgos identificados'),
      h('p', 'Escala y criterios de MET-01. Se acepta el riesgo residual Bajo o Muy bajo.'),
      h('div.dtw', h('table.dtable', h('thead', h('tr', ['ID', 'Riesgo', 'Activo', 'Amenaza', 'P', 'I', 'Inherente', 'Tratamiento', 'Residual', 'Dueño'].map(x => h('th', x)))),
        h('tbody', c.risks.map(r => h('tr', h('td.mono', r.id), h('td', r.t), h('td', r.asset), h('td', r.threat), h('td', lv(r.p)), h('td', lv(r.i)), h('td', lv(c.riskLevel(r.p, r.i))), h('td', r.opt), h('td', lv(r.res)), h('td', r.owner))))))];
    if (d.special === 'ptr') return [h('h2', '1. Acciones de tratamiento'),
      h('div.dtw', h('table.dtable', h('thead', h('tr', ['Riesgo', 'Control', 'Acción', 'Responsable', 'Plazo', 'Estado', 'Residual'].map(x => h('th', x)))),
        h('tbody', c.ptr.map(r => h('tr', h('td.mono', r[0]), h('td.mono', r[1]), h('td', r[2]), h('td', r[3]), h('td', r[4]), h('td', st(r[5])), h('td', lv(r[6])))))))];
    if (d.special === 'soa') {
      const rows = c.soaRows();
      const count = (s) => rows.filter(r => r.st === s).length;
      const tb = h('tbody');
      let f = 'all';
      const draw = () => { tb.textContent = ''; rows.filter(r => f === 'all' || r.st === f).forEach(r => tb.append(h('tr', h('td.mono', r.n), h('td', r.t), h('td', r.ap ? 'Sí' : 'No'), h('td', r.why), h('td', st(r.st)), h('td.mono', r.docs.join(', ') || '—')))); };
      const pills = h('div.pills', [['all', 'Todos (93)'], ['Implantado', 'Implantados'], ['En curso', 'En curso'], ['Planificado', 'Planificados'], ['N/A', 'No aplicables']].map(([k, l]) =>
        h('button.pill.press', {type: 'button', 'aria-pressed': String(k === 'all'), onclick: (e) => { f = k; pills.querySelectorAll('.pill').forEach(p => p.setAttribute('aria-pressed', 'false')); e.currentTarget.setAttribute('aria-pressed', 'true'); draw(); }}, l)));
      draw();
      return [h('h2', '1. Controles del Anexo A'),
        h('div.soa-kpis', [['Aplicables', rows.filter(r => r.ap).length], ['Implantados', count('Implantado')], ['En curso', count('En curso')], ['Planificados', count('Planificado')]].map(([l, v]) => h('div.mini', h('span', l), h('b', v)))),
        pills, h('div.dtw', {style: {marginTop: '10px'}}, h('table.dtable', h('thead', h('tr', ['Control', 'Título', 'Aplica', 'Justificación', 'Estado', 'Documento'].map(x => h('th', x)))), tb))];
    }
    return [];
  }

  function sectionNodes(s) {
    return [h('h2', s.h), ...(s.p || []).map(t => h('p', {html: rich(t)})), s.ul ? h('ul', s.ul.map(t => h('li', {html: rich(t)}))) : null, s.table ? table(s.table) : null];
  }

  /* Página de un documento */
  function view(id) {
    const d = doc(id);
    if (!d) return Views.notFound();
    const built = Store.docBuilt(id), [ln, lc] = LVL[d.lvl];
    return h('div.view.narrow', {style: {maxWidth: d.special ? '1080px' : '820px'}},
      h('a.back', {href: '#/caso'}, icon('chevron-left'), 'Caso Albatrel'),
      h('div.eyebrow', {style: {color: lc}}, icon(d.icon), d.code + ' · ' + ln),
      h('h1', {style: {fontSize: 'clamp(28px,1.4rem + 1.6vw,42px)'}}, d.t),
      h('div.callout.case', icon('lightbulb'), h('div', h('b', 'Por qué existe'), h('span', d.why))),
      h('div.doc-actions',
        h('a.btn.primary.press', {href: '#/construir/' + d.id}, icon('wand-sparkles'), built ? 'Volver a construirlo' : 'Construirlo paso a paso'),
        h('button.btn.press', {type: 'button', onclick: () => download(d)}, icon('download'), 'Descargar (.md)'),
        built ? h('span.tag.ok', icon('check'), 'Construido') : null),
      h('article.paper',
        h('div.dmeta', [['Código', d.code], ['Versión', d.ver], ['Fecha', d.date], ['Propietario', d.owner], ['Aprueba', d.appr], ['Clasificación', d.cls]].map(([k, v]) => h('div', h('span', k), h('b', v)))),
        h('div.refs', {style: {margin: '6px 0 4px'}}, (d.cl || []).map(c => h('span.tag.track', 'Cláusula ' + c)), (d.ctl || []).map(c => h('span.tag', 'Control ' + c))),
        d.special ? special(d) : d.body.flatMap(sectionNodes),
        h('p.muted', {style: {fontSize: '12.5px', marginTop: '26px'}}, 'Albatrel Servicios Digitales es una empresa inventada para aprender. Documento de ejemplo de Atlas GRC.')));
  }

  /* Exportar a Markdown */
  function toMd(d) {
    const c = C();
    const t = (head, rows) => '| ' + head.join(' | ') + ' |\n|' + head.map(() => '---').join('|') + '|\n' + rows.map(r => '| ' + r.join(' | ') + ' |').join('\n') + '\n';
    let md = `# ${d.code} · ${d.t}\n\n**${c.name}** (empresa ficticia, ejemplo de Atlas GRC)\n\n` + t(['Código', 'Versión', 'Fecha', 'Propietario', 'Aprueba', 'Clasificación'], [[d.code, d.ver, d.date, d.owner, d.appr, d.cls]]) + '\n';
    if (d.special === 'risks') md += '## Riesgos identificados\n\n' + t(['ID', 'Riesgo', 'Activo', 'P', 'I', 'Inherente', 'Tratamiento', 'Residual', 'Dueño'], c.risks.map(r => [r.id, r.t, r.asset, r.p, r.i, c.riskLevel(r.p, r.i), r.opt, r.res, r.owner]));
    else if (d.special === 'ptr') md += '## Acciones de tratamiento\n\n' + t(['Riesgo', 'Control', 'Acción', 'Responsable', 'Plazo', 'Estado', 'Residual'], c.ptr);
    else if (d.special === 'soa') md += '## Controles del Anexo A\n\n' + t(['Control', 'Título', 'Aplica', 'Justificación', 'Estado'], c.soaRows().map(r => [r.n, r.t, r.ap ? 'Sí' : 'No', r.why, r.st]));
    else d.body.forEach(s => { md += `## ${s.h}\n\n` + (s.p || []).map(p => p + '\n\n').join('') + (s.ul ? s.ul.map(x => '- ' + x).join('\n') + '\n\n' : '') + (s.table ? t(s.table.head, s.table.rows) + '\n' : ''); });
    return md.replace(/\*\*(.+?)\*\*/g, '**$1**');
  }
  function download(d) {
    const a = h('a', {href: URL.createObjectURL(new Blob([toMd(d)], {type: 'text/markdown'})), download: `Albatrel-${d.code}.md`});
    a.click(); toast('Descargado ' + d.code + '.md', {icon: 'download'});
  }

  /* Modo «Construir»: ejercicio → sección escrita */
  function build(id) {
    const d = doc(id);
    if (!d) { location.hash = '#/caso'; return; }
    const secBody = (k) => {
      if (d.special) return [{dia: 'flow', items: ['Riesgos (REG-01)', 'Controles (SOA-01)', 'Acciones (PTR-01)']}, 'En el documento final verás la tabla completa generada con los datos de Albatrel.'];
      const s = d.body[k]; if (!s) return [];
      return [...(s.p || []), s.ul ? {ul: s.ul.map(x => ['·', x])} : null, s.table ? {table: s.table} : null].filter(Boolean);
    };
    const steps = [{idea: {k: d.code, t: 'Vas a construir: ' + d.t, body: [d.why, {ul: [['i:user-round', '<b>Propietario</b>: ' + d.owner], ['i:badge-check', '<b>Aprueba</b>: ' + d.appr], ['i:scroll-text', '<b>Cumple</b>: ' + [...(d.cl || []).map(c => 'cláusula ' + c), ...(d.ctl || []).map(c => 'control ' + c)].join(', ')]]}]}}];
    d.build.forEach(b => {
      steps.push({ex: Object.assign({}, b.ex)});
      const s = d.body[b.sec];
      steps.push({idea: {k: 'Así queda', t: d.special ? d.t : s.h, body: secBody(b.sec)}});
    });
    Player.run({
      title: 'Construir ' + d.code + ' · ' + d.t, mode: 'lesson', backHref: '#/doc/' + d.id, steps,
      keyOf: (it) => 'doc:' + d.id + ':' + it.q,
      onFinish({pct}) {
        const first = Store.markDoc(d.id);
        if (first) { Store.addXP(25); toast('+25 XP · ' + d.code + ' construido', {icon: 'file-check', kind: 'xp'}); }
        const n = C().docs.filter(x => Store.docBuilt(x.id)).length;
        if (n === C().docs.length && first) setTimeout(() => toast('¡Has construido el SGSI completo de Albatrel!', {icon: 'trophy', kind: 'gold'}), 600);
        return {title: d.code + ' construido', icon: 'file-check', medal: 'track', text: `Llevas ${n} de ${C().docs.length} documentos de Albatrel.`, stats: [Math.round(pct * 100) + ' % de aciertos'], confetti: first, next: '#/doc/' + d.id, nextLabel: 'Ver el documento'};
      }
    });
  }

  /* Bloque de documentos para la página del caso */
  function section() {
    const c = C(), n = c.docs.filter(d => Store.docBuilt(d.id)).length;
    return h('div.sec',
      h('div.sec-h', h('h2', 'El SGSI de Albatrel'), h('small', n + ' de ' + c.docs.length + ' construidos')),
      h('p.muted', {style: {margin: '-6px 0 6px', maxWidth: '70ch'}}, 'Los ' + c.docs.length + ' documentos de su sistema de gestión, escritos para esta app. Léelos, o constrúyelos tú paso a paso: cada sección se decide con un ejercicio.'),
      Object.entries(LVL).map(([k, [ln, lc]]) => {
        const list = c.docs.filter(d => d.lvl === k);
        if (!list.length) return null;
        return h('div.docs-lvl', {style: {'--c': lc}}, h('h3', h('i'), ln),
          h('div.dcards', list.map(d => h('div.dcard', {style: {'--c': lc}},
            Store.docBuilt(d.id) ? h('span.built', icon('check')) : null,
            h('span.dc-k', icon(d.icon), d.code), h('b', d.t),
            h('small', [...(d.cl || []).map(x => 'Cl. ' + x), ...(d.ctl || []).slice(0, 4).map(x => 'A.' + x)].join(' · ') || ' '),
            h('div.dc-a', h('a.btn.sm.press', {href: '#/doc/' + d.id}, 'Leer'), h('a.btn.sm.primary.press', {href: '#/construir/' + d.id}, icon('wand-sparkles'), 'Construir'))))));
      }));
  }

  window.Docs = {view, build, section, table, download};
})();
