/* Atlas GRC · Ciudad de Albatrel.
   Un plano isométrico de la empresa del caso que crece con tu estudio:
   - cada bloque es un edificio y cada unidad completada le suma plantas;
   - cada día de estudio planta un árbol;
   - cada documento de Albatrel construido enciende una farola;
   - cada control del Anexo A que entiendes levanta un tramo de muralla.
   Todo se dibuja con SVG propio. Idea inspirada en Growdoro (sin copiar código ni dibujos). */
(function () {
  const {h, icon, toast, panel} = UI;
  const N = 14, TW = 32, TH = 16, FH = 13;                 // mapa de 14×14 baldosas; altura de una planta
  const P = (i, j, z = 0) => [(i - j) * TW, (i + j) * TH - z];
  const pts = (a) => a.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const poly = (cls, a, extra = '') => `<polygon class="${cls}" points="${pts(a)}"${extra}/>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

  /* Edificios: uno por bloque de la ruta. [i, j, ancho, fondo, plantas máximas, tejado] */
  const B = [
    {name: 'Faro del norte', what: 'Los fundamentos: GRC, normas, SGSI, PDCA y el vocabulario básico. Es el faro que orienta todo lo demás.', at: [6.6, 6.6, .8, .8], max: 5, roof: 'lantern'},
    {name: 'Sede central', what: 'Contexto, partes interesadas, alcance, liderazgo, política y roles (cláusulas 4 y 5). Aquí decide la Gerencia.', at: [1, 1, 3, 2.5], max: 6, roof: 'flat'},
    {name: 'Observatorio de riesgos', what: 'Análisis de riesgos con MAGERIT, Declaración de Aplicabilidad y plan de tratamiento (cláusula 6).', at: [9.5, 1, 2.5, 2.5], max: 3, roof: 'dome'},
    {name: 'Escuela y archivo', what: 'Recursos, competencia, concienciación, comunicación e información documentada (cláusula 7).', at: [1, 9.5, 3, 2], max: 3, roof: 'pyr'},
    {name: 'Sala técnica', what: 'Operación del SGSI: planificar, controlar y tratar los riesgos en el día a día (cláusula 8).', at: [9.6, 9.6, 2.5, 2], max: 2, roof: 'units'},
    {name: 'Torre de auditoría', what: 'Métricas, auditoría interna y revisión por la dirección (cláusula 9).', at: [12.6, 1.4, 1, 1], max: 7, roof: 'flat'},
    {name: 'Taller de mejora', what: 'No conformidades, acciones correctivas y mejora continua (cláusula 10).', at: [9.5, 4, 2, 1.2], max: 2, roof: 'pyr'},
    {name: 'Oficinas de gobierno', what: 'Controles organizacionales del Anexo A (tema 5).', at: [4.3, 1, 1.2, 2.5], max: 4, roof: 'flat'},
    {name: 'Vestíbulo y accesos', what: 'Controles de personas y controles físicos del Anexo A (temas 6 y 7).', at: [1, 12, 2.5, 1.4], max: 2, roof: 'flat'},
    {name: 'Centro de datos', what: 'Controles tecnológicos del Anexo A (tema 8).', at: [12.7, 9.5, .9, 3], max: 3, roof: 'units'},
    {name: 'Sello de certificación', what: 'Auditoría externa y certificación (ISO 19011). El monumento que corona la ciudad.', at: [8.2, 8.2, .6, .6], max: 2, roof: 'star'}
  ];
  const LAMPS = [[5.8, 1], [8.2, 2.5], [5.8, 4], [8.2, 11], [5.8, 12.5], [8.2, 13.4], [1, 5.8], [2.6, 8.2], [4, 5.8], [10, 8.2], [11.5, 5.8], [13.3, 8.2], [8.2, 5], [5.8, 9.2]];

  /* Huecos libres para árboles, repartidos siempre igual */
  const TREES = (() => {
    const busy = (x, y) => (x > 5.4 && x < 8.6) || (y > 5.4 && y < 8.6) ||
      B.some(b => { const [i, j, w, d] = b.at; return x > i - .45 && x < i + w + .45 && y > j - .45 && y < j + d + .45; }) ||
      LAMPS.some(([a, c]) => Math.abs(a - x) < .5 && Math.abs(c - y) < .5);
    const c = [];
    for (let x = .5; x < N; x += .9) for (let y = .5; y < N; y += .9) if (!busy(x, y)) c.push([x, y]);
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let k = c.length - 1; k > 0; k--) { const r = Math.floor(rnd() * (k + 1)); [c[k], c[r]] = [c[r], c[k]]; }
    return c.slice(0, 60);
  })();

  /* Muralla: 93 tramos (uno por control), empezando por el frente para que se vea crecer */
  const WALL = (() => {
    const out = [], L = 4 * N / 93;
    for (let k = 0; k < 93; k++) {
      let t = k * L, seg;
      if (t < N) seg = [t, N - .2, .45, .2];
      else if ((t -= N) < N) seg = [N - .2, N - t - .45, .2, .45];
      else if ((t -= N) < N) seg = [N - t - .45, 0, .45, .2];
      else { t -= N; seg = [0, t, .2, .45]; }
      out.push(seg);
    }
    return out;
  })();

  /* ── Estado de la ciudad a partir del progreso ── */
  function data() {
    const T = App.T(), C = T.caso || {};
    const blocks = T.modules.map((m, k) => {
      const b = B[k] || B[B.length - 1];
      if (m.soon) return {m, b, k, soon: true, pct: 0, floors: 0};
      const us = (m.units || []).map(id => T.units[id]).filter(Boolean);
      const pct = us.length ? us.reduce((a, u) => a + Views.unitState(u).pct, 0) / us.length : 0;
      const done = us.filter(u => Views.unitState(u).complete).length;
      return {m, b, k, soon: false, pct, done, n: us.length, floors: pct > 0 ? Math.max(1, Math.round(pct * b.max)) : 0};
    });
    const days = Object.values(Store.s.days).filter(d => d.xp > 0).length;
    const docs = (C.docs || []).filter(d => Store.docBuilt(d.id)).length;
    return {blocks, trees: Math.min(days, TREES.length), days, lamps: Math.min(docs, LAMPS.length), docs, nDocs: (C.docs || []).length,
      wall: Math.min(Object.keys(Store.tr().known).length, 93), beacon: Store.streak() > 0, passed: (Store.tr().exams || []).some(e => e.pass)};
  }

  /* ── Piezas de dibujo ── */
  function box(i, j, w, d, z0, hh, cls = '') {
    const z1 = z0 + hh;
    return poly('fl ' + cls, [P(i, j + d, z0), P(i + w, j + d, z0), P(i + w, j + d, z1), P(i, j + d, z1)]) +
      poly('fr ' + cls, [P(i + w, j, z0), P(i + w, j + d, z0), P(i + w, j + d, z1), P(i + w, j, z1)]) +
      poly('ft ' + cls, [P(i, j, z1), P(i + w, j, z1), P(i + w, j + d, z1), P(i, j + d, z1)]);
  }
  function windows(i, j, w, d, f, seed) {
    let s = '';
    const v0 = f * FH + 3.5, v1 = f * FH + FH - 4;
    const nl = Math.max(1, Math.round(w * 2)), nr = Math.max(1, Math.round(d * 2));
    for (let k = 0; k < nl; k++) {
      const u0 = (k + .28) / nl, u1 = (k + .72) / nl, on = (seed + k * 7 + f * 3) % 5 ? ' on' : '';
      s += poly('win' + on, [P(i + u0 * w, j + d, v0), P(i + u1 * w, j + d, v0), P(i + u1 * w, j + d, v1), P(i + u0 * w, j + d, v1)]);
    }
    for (let k = 0; k < nr; k++) {
      const u0 = (k + .28) / nr, u1 = (k + .72) / nr, on = (seed + k * 5 + f * 2 + 1) % 4 ? ' on' : '';
      s += poly('win r' + on, [P(i + w, j + u0 * d, v0), P(i + w, j + u1 * d, v0), P(i + w, j + u1 * d, v1), P(i + w, j + u0 * d, v1)]);
    }
    return s;
  }
  function roof(b, z, complete) {
    const [i, j, w, d] = b.at, cx = i + w / 2, cy = j + d / 2;
    if (b.roof === 'pyr') {
      const ap = P(cx, cy, z + Math.min(w, d) * 9);
      return poly('rf b', [P(i, j, z), P(i + w, j, z), ap]) + poly('rf b', [P(i, j, z), P(i, j + d, z), ap]) +
        poly('rf l', [P(i, j + d, z), P(i + w, j + d, z), ap]) + poly('rf r', [P(i + w, j, z), P(i + w, j + d, z), ap]);
    }
    if (b.roof === 'dome') {
      const [x, y] = P(cx, cy, z), r = Math.min(w, d) * TW * .5;
      return `<ellipse class="dome-b" cx="${x}" cy="${y}" rx="${r}" ry="${r / 2}"/><path class="dome" d="M${x - r} ${y}A${r} ${r} 0 0 1 ${x + r} ${y}A${r} ${r / 2} 0 0 1 ${x - r} ${y}Z"/>` +
        `<path class="slit" d="M${x - r * .1} ${y - r * .95}L${x + r * .06} ${y - r * .62}"/><circle class="shine" cx="${x - r * .45}" cy="${y - r * .45}" r="${r * .14}"/>`;
    }
    if (b.roof === 'units') return box(i + w * .15, j + d * .2, w * .25, d * .3, z, 6, 'unit') + box(i + w * .55, j + d * .45, w * .25, d * .3, z, 6, 'unit');
    if (b.roof === 'lantern') {
      const [x, y] = P(cx, cy, z + 12);
      return box(i + .15, j + .15, w - .3, d - .3, z, 10, 'glass') + poly('rf l', [P(i + .1, j + d - .1, z + 10), P(i + w - .1, j + d - .1, z + 10), P(cx, cy, z + 19)]) +
        poly('rf r', [P(i + w - .1, j + .1, z + 10), P(i + w - .1, j + d - .1, z + 10), P(cx, cy, z + 19)]) + `<circle class="beacon" cx="${x}" cy="${y - 7}" r="18"/>`;
    }
    if (b.roof === 'star' && complete) {
      const [x, y] = P(cx, cy, z + 14); let s = '';
      for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 4 : 9; s += (x + r * Math.cos(a)).toFixed(1) + ',' + (y + r * Math.sin(a)).toFixed(1) + ' '; }
      return `<polygon class="star" points="${s}"/>`;
    }
    return '';
  }
  function flag(x, y) { return `<path class="pole" d="M${x} ${y}V${y - 24}"/><path class="flag" d="M${x} ${y - 24}l12 4-12 4z"/>`; }
  function crane(i, j, z0, top) {
    const [x, y] = P(i, j, z0), yt = y - (top - z0) - 18;
    return `<g class="crane"><path d="M${x} ${y}V${yt}M${x - 10} ${yt}H${x + 34}M${x} ${yt}l-6 6M${x} ${yt}l6 6"/><g class="hook"><path d="M${x + 28} ${yt}v16"/><rect x="${x + 24}" y="${yt + 16}" width="8" height="6" rx="1"/></g></g>`;
  }

  function building(s, opts, fresh) {
    const {b, k, soon, floors, pct} = s, [i, j, w, d] = b.at;
    const complete = !soon && pct >= 1, top = floors * FH;
    let solid = '', ghost = '';
    if (soon || floors === 0) ghost += poly('lot' + (soon ? ' soon' : ''), [P(i, j), P(i + w, j), P(i + w, j + d), P(i, j + d)]);
    for (let f = 0; f < floors; f++) {
      solid += box(i, j, w, d, f * FH, FH, b.roof === 'lantern' && f % 2 ? 'stripe' : '');
      if (b.roof !== 'star') solid += windows(i, j, w, d, f, k * 3);
    }
    if (floors) solid += roof(b, top, complete);
    if (floors < b.max && !soon) ghost += box(i, j, w, d, top, (b.max - floors) * FH, 'gh');
    if (soon) ghost += box(i, j, w, d, 0, b.max * FH, 'gh faint');
    if (floors && !complete) ghost += crane(i, j, top, b.max * FH);
    if (complete && b.roof !== 'star' && b.roof !== 'lantern') { const [x, y] = P(i + w * .2, j + d * .2, top); solid += flag(x, y); }
    const label = b.name + (soon ? ', próximamente' : ', ' + Math.round(pct * 100) + ' %');
    const attrs = opts.mini ? '' : ` tabindex="0" role="button" aria-label="${esc(label)}"`;
    return `<g class="bld${soon ? ' is-soon' : ''}${complete ? ' done' : ''}${fresh ? ' fresh' : ''}" data-k="${k}" style="--a:${opts.col[k] || 'var(--track)'};--i:${k}"${attrs}>` +
      `<title>${esc(label)}</title>${ghost}<g class="gr">${solid}</g></g>`;
  }
  function tree(x, y, n, fresh) {
    const [px, py] = P(x, y), r = 6 + (n % 3) * 1.6;
    return `<g class="tree${fresh ? ' fresh' : ''}" style="--i:${n % 20}"><ellipse class="sh" cx="${px}" cy="${py}" rx="${r}" ry="${r / 2.2}"/><path class="trunk" d="M${px} ${py}v-7"/>` +
      `<g class="crown"><circle cx="${px}" cy="${py - 7 - r}" r="${r}"/><circle class="hi" cx="${px - r / 3}" cy="${py - 9 - r}" r="${r / 2.4}"/></g></g>`;
  }
  function lamp(x, y, on, fresh) {
    const [px, py] = P(x, y);
    return `<g class="lamp${on ? ' on' : ''}${fresh ? ' fresh' : ''}"><circle class="halo" cx="${px}" cy="${py - 22}" r="14"/><path class="post" d="M${px} ${py}v-20"/><circle class="bulb" cx="${px}" cy="${py - 22}" r="3"/></g>`;
  }

  function svg(st, opts = {}) {
    const col = opts.col || [];
    const items = [];
    st.blocks.forEach((s) => { const [i, j, w, d] = s.b.at; items.push([i + w + j + d, building(s, Object.assign({col}, opts), opts.fresh && opts.fresh.b.includes(s.k))]); });
    for (let n = 0; n < st.trees; n++) { const [x, y] = TREES[n]; items.push([x + y + .2, tree(x, y, n, opts.fresh && n >= opts.fresh.t)]); }
    LAMPS.forEach(([x, y], n) => items.push([x + y + .1, lamp(x, y, n < st.lamps, opts.fresh && n < st.lamps && n >= opts.fresh.l)]));
    for (let n = 0; n < st.wall; n++) { const [i, j, w, d] = WALL[n]; items.push([i + w + j + d, `<g class="wall${opts.fresh && n >= opts.fresh.w ? ' fresh' : ''}" style="--i:${n % 30}">${box(i, j, w, d, 0, 5)}</g>`]); }
    items.sort((a, b) => a[0] - b[0]);

    const ground = poly('g-l', [P(0, N), P(N, N), P(N, N, -16), P(0, N, -16)]) + poly('g-r', [P(N, 0), P(N, N), P(N, N, -16), P(N, 0, -16)]) +
      poly('g-t', [P(0, 0), P(N, 0), P(N, N), P(0, N)]) +
      poly('road', [P(6, 0), P(8, 0), P(8, N), P(6, N)]) + poly('road', [P(0, 6), P(N, 6), P(N, 8), P(0, 8)]) +
      poly('plaza', [P(5, 5), P(9, 5), P(9, 9), P(5, 9)]) + poly('plaza-in', [P(6, 6), P(8, 6), P(8, 8), P(6, 8)]) +
      `<path class="lane" d="M${P(7, 0)}L${P(7, 5)}M${P(7, 9)}L${P(7, N)}M${P(0, 7)}L${P(5, 7)}M${P(9, 7)}L${P(N, 7)}"/>`;
    const sky = opts.mini ? '' : `<g class="stars">${[[-380, -60], [-250, -90], [-120, -40], [60, -95], [210, -60], [350, -85], [420, 20], [-430, 60], [300, 40]].map(([x, y], n) => `<circle cx="${x}" cy="${y}" r="${1 + n % 2 * .6}" style="--i:${n}"/>`).join('')}</g>`;
    const banner = st.passed ? (() => { const [x, y] = P(6.6, 6.6, 5 * FH + 19); return `<g class="cert">${flag(x, y - 2)}</g>`; })() : '';
    const vb = opts.mini ? '-470 -75 940 555' : '-470 -100 940 590';
    return `<svg class="city-svg${st.beacon ? ' beam' : ''}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ciudad de Albatrel">${sky}${ground}${items.map(x => x[1]).join('')}${banner}</svg>`;
  }

  const COLS = () => ['var(--track)', '#0a84ff', '#ff9f0a', '#30b0c7', '#34c759', '#64d2ff', '#bf5af2', '#5e5ce6', '#ff9f0a', '#30d158', '#ffcc00'];

  /* ── Panel de un edificio ── */
  function info(s, st) {
    const {b, m, soon, pct, floors} = s;
    panel(close => [
      h('div.panel-h', {style: {'--c': COLS()[s.k]}}, h('div',
        h('div.eyebrow', {style: {color: COLS()[s.k]}}, 'Bloque ' + m.n + ' · ' + m.t),
        h('h2', {style: {marginTop: '6px'}}, b.name),
        h('div', {style: {display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap'}},
          soon ? h('span.tag', icon('lock'), 'Próximamente') : h('span.tag', icon('building-2'), floors + ' de ' + b.max + ' plantas'),
          !soon && pct >= 1 ? h('span.tag', {style: {background: 'color-mix(in oklab, #34c759 16%, transparent)', color: '#248a3d'}}, icon('badge-check'), 'Terminado') : null)),
        h('button.ib.press', {type: 'button', 'aria-label': 'Cerrar', onclick: close}, icon('x'))),
      h('div.panel-b',
        h('p', b.what),
        soon ? h('p.muted', 'Se levantará cuando publiquemos este bloque. De momento solo está el solar.')
          : [h('h4', 'Obra'), h('div.prog-row', h('div.bar', h('i', {style: {'--v': pct}})), h('b', Math.round(pct * 100) + ' %')),
            h('p.muted', {style: {fontSize: '14px', marginTop: '10px'}}, s.done + ' de ' + s.n + ' unidades completas. Cada lección, práctica y jefe que superas sube la obra.')]),
      h('div.panel-f', h('small.muted', 'Atajo: Esc para cerrar'),
        soon ? h('a.btn.press', {href: '#/ruta', onclick: close}, 'Ver la ruta') : h('a.btn.primary.press', {href: '#/b/' + m.id, onclick: close}, icon('play'), pct >= 1 ? 'Repasar el bloque' : 'Seguir construyendo'))
    ]);
  }

  /* ── Vista completa ── */
  function view() {
    const st = data(), old = Store.s.city;
    const fresh = old ? {b: st.blocks.filter(s => s.floors > ((old.b || {})[s.m.id] || 0)).map(s => s.k), t: old.t || 0, l: old.l || 0, w: old.w || 0} : null;
    const wrap = h('div.city.anim');
    wrap.innerHTML = svg(st, {col: COLS(), fresh});
    wrap.addEventListener('click', (e) => { const g = e.target.closest('.bld'); if (g) info(st.blocks[+g.dataset.k], st); });
    wrap.addEventListener('keydown', (e) => { const g = e.target.closest('.bld'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); info(st.blocks[+g.dataset.k], st); } });

    // Avisa de lo que ha crecido desde la última visita
    const snap = {b: Object.fromEntries(st.blocks.map(s => [s.m.id, s.floors])), t: st.trees, l: st.lamps, w: st.wall};
    if (old) {
      const fl = st.blocks.reduce((a, s) => a + Math.max(0, s.floors - ((old.b || {})[s.m.id] || 0)), 0);
      const bits = [fl && (fl === 1 ? '1 planta' : fl + ' plantas'), st.trees > old.t && (st.trees - old.t === 1 ? '1 árbol' : (st.trees - old.t) + ' árboles'),
        st.lamps > old.l && (st.lamps - old.l === 1 ? '1 farola' : (st.lamps - old.l) + ' farolas'), st.wall > old.w && ((st.wall - old.w) + ' de muralla')].filter(Boolean);
      if (bits.length) setTimeout(() => toast('Albatrel ha crecido: ' + bits.join(', ')), 700);
    }
    Store.s.city = snap; Store.save();

    const built = st.blocks.filter(s => s.floors > 0).length, open = st.blocks.filter(s => !s.soon).length;
    const floors = st.blocks.reduce((a, s) => a + s.floors, 0), maxF = st.blocks.filter(s => !s.soon).reduce((a, s) => a + s.b.max, 0);
    const legend = [
      ['building-2', 'Edificios', built + '/' + open, floors + ' de ' + maxF + ' plantas. Cada unidad que completas sube la obra de su bloque.'],
      ['sprout', 'Árboles', st.trees, 'Uno por cada día que estudias. ' + (st.beacon ? 'El faro brilla mientras mantienes la racha.' : 'Estudia hoy para encender el faro.')],
      ['lightbulb', 'Farolas', st.lamps + '/' + st.nDocs, 'Cada documento de Albatrel que construyes enciende una.'],
      ['shield-check', 'Muralla', st.wall + '/93', 'Un tramo por cada control del Anexo A que marcas como entendido.']
    ];
    const rise = (el, i) => { el.classList.add('rise'); el.style.setProperty('--i', i); return el; };
    return h('div.view',
      h('div.eyebrow.track', h('span.dot'), 'Caso Albatrel'),
      h('h1', 'La ciudad de Albatrel'),
      h('p.lede', 'Albatrel crece contigo. Cada bloque es un edificio y lo levantas estudiando. Toca un edificio para ver cómo va su obra.'),
      h('div.sec', h('div.city-card', wrap)),
      h('div.sec.city-legend', legend.map(([ic, t, v, s], i) => rise(h('div.mini.cl', h('div.cl-h', h('span.cl-i', icon(ic)), h('span', t), h('b', v)), h('small', s)), i))),
      h('div.sec', h('div.soon', icon('sparkles'), 'Idea inspirada en ', h('a.link', {href: 'https://github.com/Hyperaide/Growdoro', target: '_blank', rel: 'noopener'}, 'Growdoro'), ' (Fuente web): aquí todo está dibujado desde cero para Atlas.')));
  }

  /* ── Miniatura para la pantalla Hoy ── */
  function mini() {
    const st = data();
    const floors = st.blocks.reduce((a, s) => a + s.floors, 0);
    const a = h('a.city-mini.press', {href: '#/ciudad', 'aria-label': 'Abrir la ciudad de Albatrel'});
    const art = h('div.cm-art'); art.innerHTML = svg(st, {col: COLS(), mini: true});
    a.append(art, h('div.cm-t', h('b', 'Ciudad de Albatrel'), h('small', floors + ' plantas · ' + st.trees + ' árboles · ' + st.lamps + ' farolas'), h('span.cm-go', 'Ver la ciudad', icon('chevron-right'))));
    return a;
  }

  window.City = {view, mini, data};
})();
