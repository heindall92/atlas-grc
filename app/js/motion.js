/* Atlas GRC · utilidades de interfaz y movimiento (principios de Emil Kowalski).
   - Avisos apilados que se expanden al pasar el ratón (como Sonner).
   - Hoja inferior arrastrable con velocidad (como Vaul).
   - Panel lateral con salida animada, menús que crecen desde su botón.
   - Contador que rueda, «mantener para confirmar», anillos y confeti.
   Todo respeta «reducir movimiento». */
(function () {
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Constructor de nodos: h('div.card#id', {attrs}, ...hijos) */
  function h(tag, attrs, ...kids) {
    const m = tag.match(/^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i) || [];
    const el = document.createElement(m[1] || 'div');
    (m[2] || '').replace(/([.#])([\w-]+)/g, (_, t, v) => { if (t === '.') el.classList.add(v); else el.id = v; });
    if (attrs != null && attrs !== false && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') { for (const p in v) { if (p.startsWith('--')) el.style.setProperty(p, v[p]); else el.style[p] = v[p]; } }
      else if (k === 'class') el.className += ' ' + v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    const add = (k) => { if (k == null || k === false) return; if (Array.isArray(k)) k.forEach(add); else el.append(k instanceof Node ? k : document.createTextNode(k)); };
    kids.forEach(add);
    return el;
  }
  function icon(name, cls) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', 'ico' + (cls ? ' ' + cls : ''));
    s.innerHTML = (window.ICONS || {})[name] || (window.ICONS || {})['circle-help'] || '';
    return s;
  }
  /* **negrita** y <b> en textos de contenido (contenido propio, no de terceros) */
  const rich = (t) => String(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  /* ── Avisos apilados ── */
  let toaster, toasts = [];
  function layoutToasts(expanded) {
    let y = 0;
    toasts.forEach((t, i) => {
      const el = t.el;
      if (expanded) { el.style.setProperty('--y', -y + 'px'); el.style.setProperty('--s', 1); el.style.setProperty('--o', 1); y += el.offsetHeight + 8; }
      else { el.style.setProperty('--y', -(i * 10) + 'px'); el.style.setProperty('--s', 1 - i * .05); el.style.setProperty('--o', i > 2 ? 0 : 1); }
      el.style.zIndex = 100 - i;
    });
  }
  function toast(msg, opts = {}) {
    if (!toaster) {
      toaster = h('div.toaster', {'aria-live': 'polite'});
      toaster.addEventListener('mouseenter', () => layoutToasts(true));
      toaster.addEventListener('mouseleave', () => layoutToasts(false));
      document.body.append(toaster);
    }
    const el = h('div.toast' + (opts.kind ? '.' + opts.kind : ''), icon(opts.icon || 'check'), h('span', msg));
    toaster.append(el);
    const t = {el};
    toasts.unshift(t);
    layoutToasts(toaster.matches(':hover'));
    const kill = () => {
      el.classList.add('out');
      setTimeout(() => { el.remove(); toasts = toasts.filter(x => x !== t); layoutToasts(toaster.matches(':hover')); }, 350);
    };
    let left = opts.ms || 3200, start = Date.now(), timer = setTimeout(kill, left);
    // Pausa mientras el ratón está encima (como Sonner)
    toaster.addEventListener('mouseenter', () => { clearTimeout(timer); left -= Date.now() - start; });
    toaster.addEventListener('mouseleave', () => { start = Date.now(); timer = setTimeout(kill, Math.max(left, 800)); });
  }

  /* ── Hoja inferior arrastrable (respuesta de los ejercicios) ── */
  function drawer(content, {onClose, dismissible = true} = {}) {
    const wrap = h('div.drawer.closed', {role: 'dialog', 'aria-modal': 'false'});
    const inner = h('div.drawer-in', h('div.handle', {'aria-hidden': 'true'}), content);
    wrap.append(inner); document.body.append(wrap);
    requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.remove('closed')));
    let y0 = null, t0 = 0, dy = 0;
    const close = () => {
      wrap.classList.remove('dragging'); inner.style.setProperty('--dy', '0px');
      wrap.classList.add('closed');
      setTimeout(() => wrap.remove(), RM() ? 10 : 500);
      onClose && onClose();
    };
    if (dismissible) {
      inner.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button,a,input')) return;
        y0 = e.clientY; t0 = Date.now(); dy = 0; inner.setPointerCapture(e.pointerId); wrap.classList.add('dragging');
      });
      inner.addEventListener('pointermove', (e) => {
        if (y0 == null) return;
        dy = e.clientY - y0;
        // Hacia arriba ofrece resistencia; hacia abajo sigue al dedo
        const v = dy < 0 ? -Math.sqrt(-dy) * 2 : dy;
        inner.style.setProperty('--dy', v + 'px');
      });
      const end = () => {
        if (y0 == null) return;
        const vel = dy / Math.max(1, Date.now() - t0);
        y0 = null; wrap.classList.remove('dragging');
        if (dy > inner.offsetHeight * .4 || vel > .45) close();
        else inner.style.setProperty('--dy', '0px');
      };
      inner.addEventListener('pointerup', end); inner.addEventListener('pointercancel', end);
    }
    return {el: wrap, close};
  }

  /* ── Panel lateral (escritorio) / hoja (móvil) con fondo ── */
  function panel(build) {
    const wrap = h('div.sheet-wrap', {role: 'dialog', 'aria-modal': 'true'});
    const close = () => {
      if (wrap.classList.contains('closing')) return;
      wrap.classList.add('closing');
      document.removeEventListener('keydown', onKey);
      setTimeout(() => wrap.remove(), RM() ? 10 : 420);
      last && last.focus && last.focus();
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const last = document.activeElement;
    const scrim = h('div.scrim', {onclick: close});
    const box = h('div.panel', build(close));
    wrap.append(scrim, box); document.body.append(wrap);
    document.addEventListener('keydown', onKey);
    setTimeout(() => { const f = box.querySelector('button,a,input'); f && f.focus({preventScroll: true}); }, 60);
    return {close, el: wrap};
  }

  /* ── Menú que crece desde su botón ── */
  function menu(anchor, items) {
    document.querySelectorAll('.menu').forEach(m => m.remove());
    const r = anchor.getBoundingClientRect();
    const el = h('div.menu', {role: 'menu'});
    items.forEach(it => el.append(it));
    document.body.append(el);
    const w = el.offsetWidth;
    const left = Math.min(r.left, innerWidth - w - 12);
    el.style.left = Math.max(12, left) + 'px'; el.style.top = (r.bottom + 8) + 'px';
    el.style.setProperty('--ox', (r.left + r.width / 2 - Math.max(12, left)) + 'px top');
    const close = (e) => {
      if (e && el.contains(e.target)) return;
      el.classList.add('out'); setTimeout(() => el.remove(), 130);
      document.removeEventListener('pointerdown', close, true); document.removeEventListener('keydown', esc);
    };
    const esc = (e) => { if (e.key === 'Escape') close(); };
    setTimeout(() => { document.addEventListener('pointerdown', close, true); document.addEventListener('keydown', esc); });
    return close;
  }

  /* ── Pastilla deslizante (pestañas y segmentos): FLIP con transform ── */
  function pill(container, activeSel, instant) {
    let p = container.querySelector(':scope > .tab-pill');
    if (!p) { p = h('span.tab-pill', {'aria-hidden': 'true'}); container.prepend(p); instant = true; }
    const a = container.querySelector(activeSel);
    if (!a) { p.style.opacity = 0; return; }
    p.style.opacity = 1;
    if (instant) p.classList.add('instant');
    p.style.setProperty('--x', a.offsetLeft + 'px');
    p.style.setProperty('--w', a.offsetWidth + 'px');
    if (instant) requestAnimationFrame(() => p.classList.remove('instant'));
  }

  /* ── Número que rueda ── */
  function ticker(el, value) {
    const str = String(value);
    if (el.dataset.v === str) return;
    const old = el.dataset.v || '';
    el.dataset.v = str;
    if (RM() || !old) { el.textContent = str; return; }
    el.textContent = '';
    const wrap = h('span.tick');
    [...str].forEach((ch, i) => {
      const s = h('span', ch);
      if (old[i] !== ch && /\d/.test(ch)) { s.style.transform = 'translateY(100%)'; requestAnimationFrame(() => requestAnimationFrame(() => { s.style.transform = 'translateY(0)'; })); }
      wrap.append(s);
    });
    el.append(wrap);
  }

  /* ── Mantener pulsado para confirmar ── */
  function holdButton(label, ms, onDone, cls = '') {
    const b = h('button.btn.press.hold' + (cls ? '.' + cls.split(' ').join('.') : ''), {type: 'button', style: {'--hold': ms + 'ms'}},
      h('span.hold-fill'), h('span', label));
    let t;
    const start = (e) => { if (e.button > 0) return; b.classList.add('holding'); t = setTimeout(() => { b.classList.remove('holding'); onDone(); }, ms); };
    const stop = () => { clearTimeout(t); b.classList.remove('holding'); };
    b.addEventListener('pointerdown', start);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, stop));
    b.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); start(e); } });
    b.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') stop(); });
    b.title = 'Mantén pulsado para confirmar';
    return b;
  }

  /* ── Anillos de actividad ── */
  function rings(values, size = 150) {
    const cols = ['var(--ring-1)', 'var(--ring-2)', 'var(--ring-3)'];
    const sw = size * .1, gap = sw * 1.15;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    values.forEach((v, i) => {
      const r = size / 2 - sw / 2 - i * gap, C = 2 * Math.PI * r;
      const bg = document.createElementNS(ns, 'circle');
      Object.entries({cx: size / 2, cy: size / 2, r, class: 'bgc', 'stroke-width': sw}).forEach(([k, x]) => bg.setAttribute(k, x));
      bg.style.stroke = `color-mix(in oklab, ${cols[i]} 22%, transparent)`;
      const fg = document.createElementNS(ns, 'circle');
      Object.entries({cx: size / 2, cy: size / 2, r, class: 'fg', 'stroke-width': sw, 'stroke-dasharray': C, 'stroke-dashoffset': C}).forEach(([k, x]) => fg.setAttribute(k, x));
      fg.style.stroke = cols[i];
      svg.append(bg, fg);
      requestAnimationFrame(() => requestAnimationFrame(() => fg.setAttribute('stroke-dashoffset', C * (1 - Math.min(1, v)))));
    });
    return h('div.rings', svg);
  }

  /* ── Confeti y XP flotante ── */
  function confetti(n = 70) {
    if (RM()) return;
    const box = h('div.confetti');
    const cols = ['#5e5ce6', '#bf5af2', '#ff9f0a', '#34c759', '#ff2d55', '#0a84ff', '#ffcc00'];
    for (let i = 0; i < n; i++) {
      const c = h('i');
      c.style.left = Math.random() * 100 + '%';
      c.style.background = cols[i % cols.length];
      c.style.setProperty('--x', (Math.random() * 200 - 100) + 'px');
      c.style.setProperty('--r', (Math.random() * 900 - 450) + 'deg');
      c.style.setProperty('--d', (1.8 + Math.random() * 1.4) + 's');
      c.style.animationDelay = Math.random() * .3 + 's';
      box.append(c);
    }
    document.body.append(box);
    setTimeout(() => box.remove(), 3600);
  }
  function xpFloat(anchor, n) {
    if (RM() || !anchor) return;
    const r = anchor.getBoundingClientRect();
    const el = h('div.xp-float', '+' + n + ' XP');
    el.style.left = (r.left + r.width / 2) + 'px'; el.style.top = (r.top - 4) + 'px';
    document.body.append(el); setTimeout(() => el.remove(), 1000);
  }

  /* ── Transición entre vistas (View Transitions API si existe) ── */
  /* Si la animación se cancela (cambios muy rápidos o pestaña en segundo plano), la pantalla se pinta igual */
  let vt = null;
  function transition(update) {
    if (!document.startViewTransition || RM() || document.hidden) { update(); return; }
    if (vt) { try { vt.skipTransition(); } catch (e) { /* nada */ } }
    let ran = false;
    const run = () => { if (!ran) { ran = true; update(); } };
    try {
      vt = document.startViewTransition(run);
      vt.ready.catch(() => {});
      vt.finished.catch(() => {}).finally(() => { vt = null; run(); });
      vt.updateCallbackDone.catch(() => run());
      setTimeout(run, 350);   // red de seguridad si el navegador no está dibujando fotogramas
    } catch (e) { run(); }
  }

  /* ── Sonidos suaves (Web Audio, sin ficheros) ── */
  let ac;
  function beep(kind) {
    if (Store.s.sound === false) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const notes = kind === 'ok' ? [660, 880] : kind === 'win' ? [523, 659, 784, 1046] : [220, 180];
      notes.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = kind === 'ko' ? 'triangle' : 'sine'; o.frequency.value = f;
        const t = ac.currentTime + i * .08;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.06, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + .22);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + .25);
      });
    } catch (e) { /* sin audio */ }
  }

  window.UI = {h, icon, rich, toast, drawer, panel, menu, pill, ticker, holdButton, rings, confetti, xpFloat, transition, beep, RM};
})();
