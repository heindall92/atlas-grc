/* Atlas GRC · aplicación: cabecera, rutas, buscador (Ctrl K), arranque y normas. */
(function () {
  const {h, icon, toast, menu, pill, ticker, transition} = UI;
  const $ = (s) => document.querySelector(s);
  const TABS = [['#/', 'house', 'Hoy'], ['#/ruta', 'map', 'Ruta'], ['#/norma', 'layers', 'Norma'], ['#/repaso', 'refresh-cw', 'Repaso'], ['#/examen', 'graduation-cap', 'Examen']];
  const MORE = [['#/glosario', 'book-a', 'Glosario', 'Los términos clave'], ['#/caso', 'briefcase', 'Caso Albatrel', 'Tu empresa de prácticas'], ['#/ciudad', 'building-2', 'Ciudad de Albatrel', 'La ciudad que levantas estudiando'], ['#/biblioteca', 'library', 'Biblioteca', 'Enlaces oficiales y gratuitos'], ['#/progreso', 'chart-column', 'Progreso', 'Racha, constancia e insignias'], ['#/normas', 'compass', 'Normas', 'ISO 27001, ENS y más'], ['#/acerca', 'info', 'Acerca de', 'Autor, código y herramientas GRC']];
  let leaveFns = [];

  const App = {
    T: () => ATLAS.track(Store.s.track),
    trackInfo: () => ATLAS.tracks.find(t => t.id === Store.s.track) || ATLAS.tracks[0],
    onLeave(f) { leaveFns.push(f); },
    docUrl(f, page) { return '/material/' + f.split('/').map(encodeURIComponent).join('/') + (page && /\.pdf$/i.test(f) ? '#page=' + page : ''); },
    /* Ruta local de un documento del curso: solo existe con el pack privado */
    docFile(key) { return (App.T().docFiles || {})[key] || null; },
    /* Explicación con palabras propias del tema en que se apoya cada idea o ejercicio
       (data/iso27001/fuentes.js). No enlaza ni reproduce material ajeno: solo lo explica. */
    sourceNote(ref, why) {
      const S = ref ? (App.T().sources || {})[ref[0] + '|' + (ref[1] || '')] : null;
      if (!S && !why) return null;
      return h('div.src-note',
        h('div.src-h', icon('lightbulb'), h('span', 'La explicación')),
        why ? h('p.src-why', {html: UI.rich(why)}) : null,
        S ? [h('b.src-t', S.t), h('ul', S.p.map(t => h('li', t)))] : null);
    },
    /* Botón que despliega la explicación debajo (sin documentos ni páginas) */
    refChip(ref) {
      if (!ref) return null;
      const key = ref[0] + '|' + (ref[1] || '');
      const S = (App.T().sources || {})[key];
      if (!S) return null;
      const chip = h('button.ref.cite', {type: 'button', 'aria-expanded': 'false', title: 'Ver la explicación'}, icon('lightbulb'), S.t, icon('chevron-down'));
      chip.onclick = (e) => {
        e.stopPropagation();
        const box = chip.closest('.fb-row') || chip.closest('.refs') || chip.parentNode;   // en la corrección, debajo de toda la fila
        const nx = box.nextElementSibling, open = nx && nx.classList.contains('src-note') && nx.dataset.k === key;
        if (nx && nx.classList.contains('src-note')) nx.remove();
        box.querySelectorAll('.ref.cite').forEach(c => c.setAttribute('aria-expanded', 'false'));
        if (open) return;
        const n = App.sourceNote(ref); n.dataset.k = key; box.after(n); chip.setAttribute('aria-expanded', 'true');
      };
      return chip;
    },
    /* «8.13» → «8.13 · Copias de seguridad de la información» (solo tras responder: en el examen real no sale el nombre) */
    withTitle(txt) {
      const N = App.T().norma; if (!N) return txt;
      const name = (n) => { const c = N.controls.find(x => x[0] === n); if (c) return n + ' ' + c[1]; for (const cl of N.clauses) for (const s of cl.sub) if (s.n === n || (n.startsWith(s.n + '.') && s.n.length > 2)) return n + ' ' + s.t; return n; };
      const parts = String(txt).split(/\s+y\s+/);
      if (parts.every(p => /^\d{1,2}\.\d{1,2}(\.\d)?$/.test(p.trim()))) return parts.map(p => name(p.trim())).join(' y ');
      return txt;
    },
    examBank() {
      const bank = [], seen = new Set();
      (window.EXAM_EZEQUIEL || []).forEach(q => {
        const tf = q.opts.length === 2 && q.opts[0] === 'Verdadero';
        bank.push({id: 'ez' + q.n, k: tf ? 'tf' : 'choice', q: q.q, opts: tf ? ['Verdadero', 'Falso'] : q.opts, a: tf ? q.a === 0 : q.a, why: q.why + (q.note ? ' (' + q.note + ')' : ''), src: 'Ezequiel', ref: ['exam', q.page]});
        seen.add(q.q);
      });
      Object.values(App.T().units || {}).forEach(u => [...u.boss, ...u.labs.flatMap(l => l.items)].forEach((it, k) => {
        if ((it.k === 'choice' || it.k === 'tf') && !seen.has(it.q)) { seen.add(it.q); bank.push(Object.assign({id: u.id + ':' + k + ':' + it.q.length, src: 'Unidad ' + u.n}, it)); }
      }));
      return bank;
    },
    setTrack(id) { Store.set('track', id); applyTrack(); renderHeader(); },
    setSkin(s) {
      const root = document.documentElement;
      if (!UI.RM()) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 380); }
      Store.set('skin', s); applyTrack();
    },
    render: () => route()
  };
  window.App = App;

  /* ── Color de la norma activa ── */
  // Pieles de color: índigo (malva, la de la norma), coral, azul eléctrico y verde
  const SKINS = {
    coral: {color: '#f2545b', color2: '#ff9a76', dark: '#ff7a7f', dark2: '#ffb199'},
    azul: {color: '#1f5cff', color2: '#00b8ff', dark: '#4f86ff', dark2: '#4fd8ff'},
    verde: {color: '#0f9b57', color2: '#7cc83a', dark: '#34d27d', dark2: '#a6e65a'}
  };
  App.SKINS = SKINS;
  function applyTrack() {
    const skin = SKINS[Store.s.skin] ? Store.s.skin : null;
    if (skin) document.documentElement.dataset.skin = skin; else delete document.documentElement.dataset.skin;
    const t = Object.assign({}, App.trackInfo(), skin ? SKINS[skin] : {});
    let st = $('#track-style'); if (!st) { st = h('style#track-style'); document.head.append(st); }
    const dark = `--track:${t.dark};--track-2:${t.dark2};--track-ink:#0b0a1a`;
    st.textContent = `:root{--track:${t.color};--track-2:${t.color2};--track-ink:#fff}
      @media (prefers-color-scheme:dark){:root:not([data-theme="light"]){${dark}}}
      :root[data-theme="dark"]{${dark}}`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.color);
  }
  function applyTheme() {
    const th = Store.s.theme;
    if (th) document.documentElement.setAttribute('data-theme', th); else document.documentElement.removeAttribute('data-theme');
  }
  const isDark = () => Store.s.theme ? Store.s.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  function toggleTheme() {
    const root = document.documentElement;
    if (!UI.RM()) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 380); }
    Store.set('theme', isDark() ? 'light' : 'dark'); applyTheme(); paintThemeBtn();
  }
  function paintThemeBtn() { const b = $('#theme-btn'); if (b) { b.textContent = ''; b.append(icon(isDark() ? 'sun' : 'moon')); b.setAttribute('aria-label', isDark() ? 'Tema claro' : 'Tema oscuro'); } }

  /* ── Pie de página: marca, mapa del sitio, ecosistema y autor ── */
  function renderFooter() {
    const f = $('#ftr'); if (!f) return; f.textContent = '';
    const ext = (href, cls, ...kids) => h('a' + cls, {href, target: '_blank', rel: 'noopener noreferrer'}, ...kids);
    const REPO = 'https://github.com/heindall92/atlas-grc';
    const cols = [
      ['Aprender', [['#/', 'Hoy'], ['#/ruta', 'Ruta'], ['#/norma', 'Mapa de la norma'], ['#/examen', 'Simulacro'], ['#/repaso', 'Repaso']]],
      ['Albatrel', [['#/caso', 'El caso'], ['#/ciudad', 'La ciudad'], ['#/caso', 'Sus 15 documentos'], ['#/glosario', 'Glosario']]],
      ['Ecosistema', [['https://heindall92.github.io/rosetta_multinorma/', 'Rosetta'], ['https://heindall92.github.io/argos-grc/', 'ARGOS'], ['https://heindall92.github.io/grc_ens_compliance_studio/app/dist/ens-compliance-studio.html', 'ENS Compliance Studio'], ['https://heindall92.github.io/kairos/', 'KAIROS', 1], ['#/acerca', 'Ver las 9 herramientas', 1]]]
    ];
    const link = ([href, t]) => href.startsWith('#') ? h('a.ft-a', {href}, t) : ext(href, '.ft-a', t, icon('arrow-up-right'));
    const socials = (cls) => h('div' + cls, social.map(([k, l, href]) => ext(href, '.ft-soc', Views.brand(k), h('span.sr', l))));
    const social = [['linkedin', 'LinkedIn', 'https://www.linkedin.com/in/yoandyrd92/'], ['github', 'GitHub', 'https://github.com/heindall92'], ['globe', 'Portafolio', 'https://yoandyramirez.com'], ['hackthebox', 'HackTheBox', 'https://profile.hackthebox.com/profile/019c5812-b4ca-7315-b12f-14db6d2b42fa']];
    f.append(h('div.ft-card',
      h('div.ft-top',
        h('div.ft-brand',
          h('a.ft-logo', {href: '#/', 'aria-label': 'Atlas GRC, inicio'}, h('span.mark', icon('atlas')), h('b', 'Atlas GRC')),
          h('p.ft-tag', 'Aprende la ISO/IEC 27001 desde cero. Busca siempre el norte.'),
          h('b.ft-cta-h', 'Hecho en abierto para aprender GRC en español'),
          h('div.ft-cta',
            ext(REPO, '.ft-btn.primary', Views.brand('github'), 'Código', h('span.ft-long', ' en GitHub')),
            ext(REPO + '/issues/new', '.ft-btn', icon('lightbulb'), 'Proponer', h('span.ft-long', ' una'), ' mejora'))),
        h('nav.ft-cols', {'aria-label': 'Mapa del sitio'}, cols.map(([t, ls]) => h('div.ft-col', h('h3', t), h('ul', ls.map(l => h('li' + (l[2] ? '.ft-more' : ''), link(l)))))),
          // En el móvil las redes ocupan el hueco junto a «Ecosistema»
          h('div.ft-col.ft-soc-col', h('h3', 'El autor'), socials('.ft-soc-grid')))),
      socials('.ft-social'),
      h('div.ft-bottom',
        h('span', '© 2026 Yoandy Ramírez Delgado · Atlas GRC ' + Views.VERSION),
        h('span.ft-legal', h('a', {href: '#/acerca'}, 'Acerca de'), h('i', '•'), ext(REPO, '', 'Código'), h('i', '•'), h('span', {title: 'El progreso se guarda solo en tu navegador'}, 'Sin cuentas ni seguimiento')))));
    // Aparece con un fundido suave al llegar a él
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { f.classList.add('in'); io.disconnect(); } }, {threshold: .15});
      io.observe(f);
    } else f.classList.add('in');
  }

  /* ── Cabecera, pestañas y dock ── */
  function renderHeader() {
    const t = App.trackInfo();
    const hdr = $('#hdr'); hdr.textContent = '';
    const tabs = h('nav.tabs', {'aria-label': 'Secciones'}, TABS.map(([href, ic, l]) => h('a', {href}, icon(ic), h('span', l))));
    const trackBtn = h('button.track-btn.press', {type: 'button', 'aria-haspopup': 'menu', onclick: (e) => trackMenu(e.currentTarget)}, h('i'), t.short, icon('chevron-down'));
    const xp = h('span#xp-n', String(Store.s.xp)); xp.dataset.v = String(Store.s.xp);
    hdr.append(
      h('div.brand', h('a.mark', {href: '#/', 'aria-label': 'Atlas GRC, inicio'}, icon('atlas')), h('div.wordmark', h('b', 'Atlas GRC'), h('small', 'Estudio personal')), trackBtn),
      tabs,
      h('div.hdr-r',
        h('span.chip.streak', {title: 'Días seguidos estudiando'}, icon('flame'), h('span#streak-n', String(Store.streak()))),
        h('span.chip.xp', {title: 'Experiencia total'}, icon('zap'), xp),
        h('button.search.press', {type: 'button', onclick: () => cmdk(true), 'aria-label': 'Buscar (Ctrl K)'}, icon('search'), h('span.lbl', 'Buscar'), h('kbd', 'Ctrl K')),
        h('button#theme-btn.ib.press', {type: 'button', onclick: toggleTheme}),
        h('button.ib.press', {type: 'button', 'aria-label': 'Más', 'aria-haspopup': 'menu', onclick: (e) => moreMenu(e.currentTarget)}, icon('ellipsis'))));
    paintThemeBtn();
    const dock = $('#dock'); dock.textContent = '';
    [...TABS.slice(0, 4), ['#/mas', 'ellipsis', 'Más']].forEach(([href, ic, l]) => dock.append(h('a', {href}, icon(ic), l)));
  }
  function markTabs(instant) {
    const cur = '#' + (location.hash.slice(1) || '/');
    const base = cur.startsWith('#/u/') || cur.startsWith('#/leccion') || cur.startsWith('#/lab') || cur.startsWith('#/jefe') ? '#/ruta'
      : cur.startsWith('#/norma') ? '#/norma' : cur.startsWith('#/repaso') ? '#/repaso' : cur;
    document.querySelectorAll('.tabs a, .dock a').forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === base ? 'page' : 'false'));
    const tabs = $('.tabs'); if (tabs) pill(tabs, 'a[aria-current="page"]', instant);
  }
  function trackMenu(anchor) {
    menu(anchor, ATLAS.tracks.map(t => h('button.menu-i', {type: 'button', role: 'menuitem', disabled: t.status !== 'activo' || null, style: {'--c': t.color},
      onclick: () => { App.setTrack(t.id); document.querySelectorAll('.menu').forEach(m => m.remove()); route(); }},
      h('i'), h('div', h('b', t.name), h('small', t.status === 'activo' ? t.sub : 'Próximamente')), t.id === Store.s.track ? icon('check') : null)));
  }
  function moreMenu(anchor) {
    const close = menu(anchor, [...MORE.map(([href, ic, t, s]) => h('button.menu-i', {type: 'button', role: 'menuitem', onclick: () => { close(); location.hash = href; }}, h('span', {style: {display: 'grid', placeItems: 'center', width: '30px', height: '30px', borderRadius: '9px', background: 'var(--fill)'}}, icon(ic)), h('div', h('b', t), h('small', s)))),
      h('button.menu-i', {type: 'button', role: 'menuitem', onclick: () => { close(); Views.settings(); }}, h('span', {style: {display: 'grid', placeItems: 'center', width: '30px', height: '30px', borderRadius: '9px', background: 'var(--fill)'}}, icon('settings')), h('div', h('b', 'Ajustes y ayuda'), h('small', 'Meta, sonido, copia de seguridad')))]);
  }
  Store.on((what) => {
    if (what === 'xp' || what === 'all') { const x = $('#xp-n'); x && ticker(x, Store.s.xp); const s = $('#streak-n'); s && (s.textContent = Store.streak()); }
  });

  /* ── Rutas ── */
  function route() {
    leaveFns.forEach(f => { try { f(); } catch (e) { /* nada */ } }); leaveFns = [];
    document.body.classList.remove('focus');
    document.querySelectorAll('.sheet-wrap,.drawer,.menu').forEach(e => e.remove());
    const parts = (location.hash.slice(2) || '').split('/');
    const T = App.T();
    const main = $('#main');
    const show = (el) => { main.textContent = ''; main.append(el); };
    const r = parts[0];
    if (r === 'leccion' && T.units[parts[1]]) return startLesson(T.units[parts[1]]);
    if (r === 'lab' && T.units[parts[1]]) return startLab(T.units[parts[1]], parts[2]);
    if (r === 'jefe' && T.units[parts[1]]) return startBoss(T.units[parts[1]]);
    if (r === 'repaso' && parts[1] === 'errores') return startMistakes();
    if (r === 'construir') return Docs.build(parts[1]);
    let el;
    switch (r) {
      case '': el = Views.today(); break;
      case 'ruta': el = Views.path(); break;
      case 'u': el = Views.unit(parts[1]); break;
      case 'b': el = Views.block(parts[1]); break;
      case 'doc': el = Docs.view(parts[1]); break;
      case 'norma': el = Views.norma(parts[1]); break;
      case 'repaso': el = parts[1] === 'tarjetas' ? Views.flashcards() : Views.review(); break;
      case 'glosario': el = Views.glossary(); break;
      case 'caso': el = Views.caso(); break;
      case 'ciudad': el = City.view(); break;
      case 'examen': el = Views.examCover(); break;
      case 'biblioteca': el = Views.library(); break;
      case 'progreso': el = Views.progress(); break;
      case 'normas': el = Views.tracks(); break;
      case 'acerca': el = Views.aboutView(); break;
      case 'mas': el = moreView(); break;
      default: el = Views.notFound();
    }
    show(el);
    markTabs(false);
    const title = {'': 'Hoy', ruta: 'Ruta', u: 'Unidad', norma: 'Mapa de la norma', repaso: 'Repaso', glosario: 'Glosario', caso: 'Caso Albatrel', examen: 'Simulacro', biblioteca: 'Biblioteca', progreso: 'Progreso', normas: 'Normas', mas: 'Más'}[r];
    document.title = (title ? title + ' · ' : '') + 'Atlas GRC';
  }
  function moreView() {
    return h('div.view', h('h1', 'Más'), h('div.lib', [...MORE.map(([href, ic, t, s]) => h('a.lib-i', {href}, h('span.li', icon(ic)), h('div', h('b', t), h('small', s)), icon('chevron-right'))),
      h('button.lib-i', {type: 'button', style: {textAlign: 'left', width: '100%', font: 'inherit'}, onclick: () => Views.settings()}, h('span.li', icon('settings')), h('div', h('b', 'Ajustes y ayuda'), h('small', 'Meta, sonido, copia de seguridad')), icon('chevron-right')),
      h('button.lib-i', {type: 'button', style: {textAlign: 'left', width: '100%', font: 'inherit'}, onclick: toggleTheme}, h('span.li', icon('moon')), h('div', h('b', 'Cambiar tema'), h('small', 'Claro u oscuro')), icon('chevron-right'))]));
  }

  /* ── Arrancar reproductores ── */
  function startLesson(u) {
    Player.run({
      title: 'Unidad ' + u.n + ' · ' + u.t + ' · Lección', mode: 'lesson', backHref: '#/u/' + u.id,
      steps: u.lesson.map(s => s.check ? {ex: s} : {idea: s}),
      keyOf: (it) => u.id + ':l:' + it.q,
      onFinish({pct}) {
        const first = Store.finishLesson(u.id);
        if (first) { Store.addXP(20); toast('+20 XP · Lección terminada', {icon: 'zap', kind: 'xp'}); }
        UI.beep('win');
        return {title: 'Lección terminada', icon: 'book-open', medal: 'track', text: first ? 'Ya puedes hacer las prácticas de esta unidad.' : 'Repasada. Las ideas se fijan mejor la segunda vez.',
          stats: [Math.round(pct * 100) + ' % en las preguntas rápidas'], confetti: first, next: u.labs[0] ? '#/lab/' + u.id + '/' + u.labs[0].id : '#/u/' + u.id, nextLabel: u.labs[0] ? 'Ir a la práctica 1' : 'Volver a la unidad'};
      }
    });
  }
  function startLab(u, labId) {
    const k = u.labs.findIndex(l => l.id === labId); const lab = u.labs[k];
    if (!lab) { location.hash = '#/u/' + u.id; return; }
    Player.run({
      title: 'Unidad ' + u.n + ' · Práctica ' + (k + 1) + ' · ' + lab.t, mode: 'lab', backHref: '#/u/' + u.id,
      steps: lab.items.map(it => ({ex: it})),
      keyOf: (it) => lab.id + ':' + it.q,
      onFinish({pct}) {
        const r = Store.finishLab(lab.id, pct);
        let bonus = 0;
        if (r.newUser) bonus += 10; if (r.newRoot) bonus += 15;
        if (bonus) { Store.addXP(bonus); toast('+' + bonus + ' XP · ' + (r.newRoot ? 'Bandera dorada' : 'Bandera azul'), {icon: r.newRoot ? 'crown' : 'flag', kind: r.newRoot ? 'gold' : 'xp'}); }
        const nextLab = u.labs[k + 1];
        const pass = pct >= .7;
        if (pass) UI.beep('win');
        return {title: pct >= 1 ? '¡Perfecto!' : pass ? 'Práctica superada' : 'Casi', icon: pct >= 1 ? 'crown' : pass ? 'flag' : 'rotate-ccw', medal: pct >= 1 ? 'gold' : pass ? 'track' : 'grey',
          score: Math.round(pct * 100) + ' %', text: pass ? (pct >= 1 ? 'Bandera dorada conseguida.' : 'Bandera azul. Con un 100 % ganas la dorada.') : 'Necesitas un 70 % para la bandera azul. Los fallos irán a tu repaso.',
          confetti: r.newRoot, retry: () => startLab(u, labId),
          next: pass ? (nextLab ? '#/lab/' + u.id + '/' + nextLab.id : '#/jefe/' + u.id) : '#/u/' + u.id, nextLabel: pass ? (nextLab ? 'Siguiente práctica' : 'Enfrentar al jefe') : 'Volver a la unidad'};
      }
    });
  }
  function startBoss(u) {
    const s = Views.unitState(u);
    if (!s.bossOpen) { toast('Primero la lección y una práctica', {icon: 'lock'}); location.hash = '#/u/' + u.id; return; }
    Player.run({
      title: 'Unidad ' + u.n + ' · Jefe', mode: 'boss', backHref: '#/u/' + u.id,
      steps: Ex.shuffle(u.boss).map(it => ({ex: it})),
      keyOf: (it) => u.id + ':boss:' + it.q,
      onFinish({pct, lives}) {
        const won = lives > 0;
        const r = Store.finishBoss(u.id, won, pct);
        if (won) { const xp = r.firstWin ? 40 : 10; Store.addXP(xp); toast('+' + xp + ' XP · Jefe vencido', {icon: 'trophy', kind: 'gold'}); UI.beep('win'); }
        const T = App.T(); const ids = Views.allUnits().map(x => x.id); const nxt = T.units[ids[ids.indexOf(u.id) + 1]];
        return {title: won ? 'Jefe vencido' : 'Te quedaste sin vidas', icon: won ? 'trophy' : 'swords', medal: won ? 'gold' : 'grey', score: Math.round(pct * 100) + ' %',
          text: won ? (nxt ? 'Siguiente: Unidad ' + nxt.n + ' · ' + nxt.t : 'Has completado todo lo disponible.') : 'Repasa la lección y vuelve a intentarlo. Los fallos irán a tu repaso.',
          stats: ['Vidas: ' + Math.max(0, lives) + '/3'], confetti: won && r.firstWin, retry: () => startBoss(u),
          next: won && nxt ? '#/u/' + nxt.id : '#/u/' + u.id, nextLabel: won && nxt ? 'Siguiente unidad' : 'Volver a la unidad'};
      }
    });
  }
  function startMistakes() {
    const due = Store.dueMistakes().slice(0, 15);
    if (!due.length) { toast('No tienes errores pendientes hoy'); location.hash = '#/repaso'; return; }
    Player.run({
      title: 'Mis errores · ' + due.length + ' preguntas', mode: 'review', backHref: '#/repaso',
      steps: due.map(m => ({ex: Object.assign({_key: m.key}, m.item)})),
      keyOf: (it) => it._key,
      onGrade: (it, ok) => Store.gradeMistake(it._key, ok),
      onFinish({pct}) {
        return {title: 'Repaso de errores hecho', icon: 'target', medal: pct >= .7 ? 'track' : 'grey', score: Math.round(pct * 100) + ' %',
          text: 'Los que has acertado vuelven más tarde; los fallados, mañana. Al acertar 3 veces salen de la lista.', next: '#/repaso', nextLabel: 'Volver al repaso'};
      }
    });
  }

  /* ── Buscador (Ctrl K): sin animación al abrir por teclado, como pide Emil para lo que se usa mucho ── */
  function searchIndex() {
    const T = App.T(), idx = [];
    TABS.concat(MORE).forEach(([href, ic, t, s]) => idx.push({g: 'Ir a', ic, t, s: s || '', go: () => { location.hash = href; }}));
    Views.allUnits().forEach(u => idx.push({g: 'Unidades', ic: u.icon || 'book-open', t: 'Unidad ' + u.n + ' · ' + u.t, s: u.s, go: () => { location.hash = '#/u/' + u.id; }}));
    (T.norma ? T.norma.clauses : []).forEach(c => c.sub.forEach(s => idx.push({g: 'Cláusulas', ic: 'scroll-text', t: s.n + ' · ' + s.t, s: s.plain, go: () => { location.hash = '#/norma'; setTimeout(() => document.querySelectorAll('.cl').forEach(b => { if (b.textContent.startsWith(s.n)) b.click(); }), 80); }})));
    (T.norma ? T.norma.controls : []).forEach(c => idx.push({g: 'Controles', ic: 'shield', t: c[0] + ' · ' + c[1], s: c[2], go: () => { location.hash = '#/norma/controles'; setTimeout(() => document.querySelectorAll('.ctl').forEach(b => { if (b.querySelector('.n').textContent === c[0]) b.click(); }), 80); }}));
    ((T.caso && T.caso.docs) || []).forEach(d => idx.push({g: 'Documentos de Albatrel', ic: 'file-text', t: d.code + ' · ' + d.t, s: d.why, go: () => { location.hash = '#/doc/' + d.id; }}));
    (T.glossary || []).forEach(g => idx.push({g: 'Glosario', ic: 'book-a', t: g[0], s: g[1], go: () => { location.hash = '#/glosario'; }}));
    idx.push({g: 'Acciones', ic: 'moon', t: 'Cambiar tema claro/oscuro', s: '', go: toggleTheme});
    idx.push({g: 'Acciones', ic: 'settings', t: 'Ajustes y ayuda', s: 'Meta diaria, sonido, copia de seguridad', go: () => Views.settings()});
    return idx;
  }
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  function cmdk(byMouse) {
    if ($('.cmd-wrap')) { $('.cmd-wrap').remove(); return; }
    const idx = searchIndex();
    const input = h('input', {type: 'text', placeholder: 'Busca una cláusula, un control, un término…', 'aria-label': 'Buscar', autocomplete: 'off'});
    const res = h('div.cmd-r', {role: 'listbox'});
    let items = [], sel = 0;
    const close = () => wrap.remove();
    const draw = () => {
      const q = norm(input.value.trim());
      let list = q ? idx.map(it => { const t = norm(it.t), s = norm(it.s); const sc = t.startsWith(q) ? 3 : t.includes(q) ? 2 : s.includes(q) ? 1 : 0; return [sc, it]; }).filter(x => x[0]).sort((a, b) => b[0] - a[0]).map(x => x[1]).slice(0, 40)
        : idx.filter(it => it.g === 'Ir a' || it.g === 'Unidades');
      res.textContent = ''; items = []; sel = Math.min(sel, Math.max(0, list.length - 1));
      if (!list.length) { res.append(h('div.cmd-e', 'Sin resultados para «' + input.value + '»')); return; }
      let g = null;
      list.forEach((it, k) => {
        if (it.g !== g) { g = it.g; res.append(h('div.cmd-g', g)); }
        const b = h('button.cmd-i', {type: 'button', role: 'option', 'aria-selected': String(k === sel), onclick: () => { close(); it.go(); }, onmousemove: () => { if (sel !== k) { sel = k; mark(); } }},
          h('span.ci', icon(it.ic)), h('span', h('b', it.t), it.s ? h('small', it.s) : null));
        items.push(b); res.append(b);
      });
    };
    const mark = () => { items.forEach((b, k) => b.setAttribute('aria-selected', String(k === sel))); items[sel] && items[sel].scrollIntoView({block: 'nearest'}); };
    input.addEventListener('input', () => { sel = 0; draw(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, items.length - 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); mark(); }
      else if (e.key === 'Enter') { e.preventDefault(); items[sel] && items[sel].click(); }
      else if (e.key === 'Escape') close();
    });
    const wrap = h('div.cmd-wrap', {role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Buscar'}, h('div.scrim', {onclick: close}),
      h('div.cmd' + (byMouse ? '.anim' : ''), h('div.cmd-f', icon('search'), input, h('kbd', 'Esc')), res,
        h('div.cmd-foot', h('span', h('kbd', '↑↓'), ' moverte'), h('span', h('kbd', 'Intro'), ' abrir'), h('span', h('kbd', 'Esc'), ' cerrar'))));
    document.body.append(wrap); draw(); input.focus();
  }

  /* ── Arranque (primera visita) ── */
  function boot() {
    if (Store.s.booted) return;
    Views.onboarding();
  }

  /* ── Minutos de estudio: cuenta un minuto si hubo actividad en él ── */
  let active = false;
  ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, () => { active = true; }, {passive: true}));
  setInterval(() => { if (active && !document.hidden) Store.addMinutes(1); active = false; }, 60000);

  /* ── Inicio ── */
  applyTheme(); applyTrack(); renderHeader(); renderFooter();
  addEventListener('hashchange', () => transition(route));
  addEventListener('resize', () => markTabs(true));
  addEventListener('scroll', () => $('#hdr').classList.toggle('scrolled', scrollY > 4), {passive: true});
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paintThemeBtn);
  addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk(false); }
    else if (e.key === '/' && !e.target.matches('input,textarea') && !document.body.classList.contains('focus')) { e.preventDefault(); cmdk(false); }
  });
  route(); markTabs(true); boot();
  document.fonts && document.fonts.ready.then(() => markTabs(true));
})();
