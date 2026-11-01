/* Atlas GRC · idiomas (español / English).
   El español es el idioma de origen. En inglés:
   - los datos (lecciones, ejercicios, glosario, caso…) se traducen al cargar con un diccionario
     español → inglés (app/i18n/en-*.js), sin duplicar la estructura;
   - la interfaz se traduce al vuelo: cada texto o atributo que aparece en pantalla se busca en el
     diccionario, y los textos con números pasan por unas reglas (expresiones regulares).
   Cambiar de idioma recarga la app. */
(function () {
  const q = location.search.match(/[?&]lang=(es|en)/);
  let saved = null; try { saved = localStorage.getItem('atlas-lang'); } catch (e) { /* modo privado */ }
  const lang = (q ? q[1] : saved) === 'en' ? 'en' : 'es';
  const D = Object.create(null), RX = [];
  const ATTRS = ['title', 'aria-label', 'placeholder', 'alt'];

  function t(s, depth = 0) {
    if (lang !== 'en' || typeof s !== 'string' || !s) return s;
    const hit = D[s]; if (hit != null) return hit;
    const tr = s.trim(); if (!tr) return s;
    if (tr !== s && D[tr] != null) return s.replace(tr, D[tr]);
    for (const [r, f] of RX) { if (r.test(tr)) { r.lastIndex = 0; return s.replace(tr, tr.replace(r, f)); } }
    if (depth < 2) {
      // «A · B · C»: se traduce cada trozo
      if (tr.includes(' · ')) {
        const p = tr.split(' · '), o = p.map(x => t(x, depth + 1));
        if (o.some((x, i) => x !== p[i])) return s.replace(tr, o.join(' · '));
      }
      // Varias frases seguidas: se traduce cada una
      const f = tr.split(/(?<=[.!?:])\s+(?=[A-ZÁÉÍÓÚÑ¿¡«(0-9])/);
      if (f.length > 1) {
        const o = f.map(x => t(x, depth + 1));
        if (o.some((x, i) => x !== f[i])) return s.replace(tr, o.join(' '));
      }
    }
    return s;
  }
  // Traduce en profundidad un objeto de datos (cadenas y, si se pide, también las claves)
  function deep(o, seen = new Set()) {
    if (!o || typeof o !== 'object' || seen.has(o)) return o;
    seen.add(o);
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) o[i] = typeof o[i] === 'string' ? t(o[i]) : deep(o[i], seen); return o; }
    for (const k of Object.keys(o)) { const v = o[k]; o[k] = typeof v === 'string' ? t(v) : deep(v, seen); }
    return o;
  }
  // Interfaz: textos y atributos que aparecen en el DOM
  function node(n) {
    if (n.nodeType === 3) { const v = n.nodeValue, r = t(v); if (r !== v) n.nodeValue = r; return; }
    if (n.nodeType !== 1) return;
    for (const a of ATTRS) { const v = n.getAttribute(a); if (v) { const r = t(v); if (r !== v) n.setAttribute(a, r); } }
    if (n.tagName === 'SCRIPT' || n.tagName === 'STYLE') return;
    for (let c = n.firstChild; c; c = c.nextSibling) node(c);
  }
  function observe() {
    if (lang !== 'en') return;
    node(document.body);
    new MutationObserver((ms) => {
      for (const m of ms) {
        if (m.type === 'characterData') node(m.target);
        else if (m.type === 'attributes') node(m.target);
        else m.addedNodes.forEach(node);
      }
    }).observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS});
    const ttl = () => { const r = t(document.title); if (r !== document.title) document.title = r; };
    new MutationObserver(ttl).observe(document.querySelector('title'), {childList: true, characterData: true, subtree: true}); ttl();
  }

  window.I18N = {
    lang, t, deep, observe,
    add(o) { Object.assign(D, o); },
    rules(list) { RX.push(...list); },
    locale: lang === 'en' ? 'en-GB' : 'es-ES',
    set(l) { try { localStorage.setItem('atlas-lang', l); } catch (e) { /* nada */ }
      const u = new URL(location.href); u.searchParams.delete('lang'); location.replace(u.toString()); },
    // Tras cargar los datos: traducir la norma activa y sus explicaciones
    apply() {
      if (lang !== 'en' || !window.ATLAS) return;
      ATLAS.tracks.forEach(tr => deep(tr));
      Object.values(ATLAS._data || {}).forEach(T => {
        const why = T.why; if (why) { const n = {}; Object.keys(why).forEach(k => { n[t(k)] = t(why[k]); }); T.why = n; }
        if (T.glossary) T.glossary.forEach(g => { if (Array.isArray(g) && !g.key) g.key = g[0]; });
        deep(T);
      });
    }
  };
  document.documentElement.lang = lang;
})();
