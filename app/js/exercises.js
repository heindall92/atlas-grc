/* Atlas GRC · tipos de ejercicio.
   Cada uno devuelve {el, ready(), check(), answerText, onChange}.
   «Comprobar» marca en verde o rojo; la explicación sale en la hoja inferior. */
(function () {
  const {h, icon, rich} = UI;
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const KEEP_ORDER = /todas las anteriores|ninguna de las anteriores|^[a-d](,| y) /i;
  const KIND = {
    choice: ['list-checks', 'Elige la respuesta'], tf: ['scale', 'Verdadero o falso'], match: ['puzzle', 'Empareja'],
    order: ['list-ordered', 'Ordena'], classify: ['layout-grid', 'Clasifica']
  };

  function head(item, extra) {
    const k = KIND[item.k] || KIND.choice;
    return [
      h('div.ex-k', icon(k[0]), k[1], extra || ''),
      item.scenario ? h('div.scenario', {html: rich(item.scenario)}) : null,
      h('div.ex-q', {html: rich(item.q)})
    ];
  }

  function choice(item, ctx) {
    const keep = item.k === 'tf' || item.opts.some(o => KEEP_ORDER.test(o));
    const opts = item.k === 'tf' ? [['Verdadero', true], ['Falso', false]] : (keep ? item.opts.map((o, i) => [o, i]) : shuffle(item.opts.map((o, i) => [o, i])));
    let sel = null, done = false;
    const api = {onChange: () => {}};
    const btns = opts.map(([txt, val], i) => {
      const sub = ctx && ctx.sub ? ctx.sub(txt) : null;
      const b = h('button.opt', {type: 'button', 'aria-pressed': 'false', 'data-val': String(val)},
        h('span.key', item.k === 'tf' ? (val ? 'V' : 'F') : String(i + 1)), h('span', txt, sub ? h('span.sub', sub) : null));
      b.addEventListener('click', () => pick(b));
      return b;
    });
    function pick(b) {
      if (done) return;
      btns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      sel = b; api.onChange();
    }
    const correct = item.k === 'tf' ? String(item.a) : String(item.a);
    api.el = h('div.ex', head(item), h('div.opts' + (item.k === 'tf' ? '.tf' : ''), btns));
    api.ready = () => !!sel;
    api.key = (k) => { const n = item.k === 'tf' ? ({v: 0, f: 1})[k.toLowerCase()] ?? (+k - 1) : +k - 1; if (btns[n]) pick(btns[n]); };
    api.check = () => {
      done = true;
      const ok = sel.dataset.val === correct;
      btns.forEach(b => { b.disabled = true; if (b === sel) b.classList.add(ok ? 'right' : 'wrong'); });
      if (!ok) sel.classList.add('shake');
      return {ok};
    };
    api.reveal = () => btns.forEach(b => { if (b.dataset.val === correct) b.classList.add('right'); });
    api.answerText = item.k === 'tf' ? (item.a ? 'Verdadero' : 'Falso') : item.opts[item.a];
    return api;
  }

  function match(item) {
    const L = shuffle(item.pairs.map((p, i) => [p[0], i])), R = shuffle(item.pairs.map((p, i) => [p[1], i]));
    const pairs = new Map();   // índice izquierdo -> índice derecho
    let selL = null, done = false, n = 0;
    const api = {onChange: () => {}};
    const lb = L.map(([t, i]) => h('button.mt', {type: 'button', 'data-i': i}, t));
    const rb = R.map(([t, i]) => h('button.mt', {type: 'button', 'data-i': i}, t));
    const label = new Map();
    function refresh() {
      lb.forEach(b => { const i = +b.dataset.i; b.classList.toggle('sel', selL === i); b.classList.toggle('paired', pairs.has(i)); });
      rb.forEach(b => { const i = +b.dataset.i; const owner = [...pairs].find(([, r]) => r === i); b.classList.toggle('paired', !!owner); });
      [...lb, ...rb].forEach(b => { const old = b.querySelector('.pn'); old && old.remove(); });
      for (const [l, r] of pairs) {
        const num = label.get(l);
        lb.find(b => +b.dataset.i === l).prepend(h('span.pn', num));
        rb.find(b => +b.dataset.i === r).prepend(h('span.pn', num));
      }
      api.onChange();
    }
    lb.forEach(b => b.addEventListener('click', () => {
      if (done) return; const i = +b.dataset.i;
      if (pairs.has(i)) { pairs.delete(i); label.delete(i); selL = null; } else selL = selL === i ? null : i;
      refresh();
    }));
    rb.forEach(b => b.addEventListener('click', () => {
      if (done) return; const r = +b.dataset.i;
      const owner = [...pairs].find(([, x]) => x === r);
      if (owner) { pairs.delete(owner[0]); label.delete(owner[0]); }
      if (selL != null) { pairs.set(selL, r); label.set(selL, ++n > 9 ? n % 10 : n); selL = null; b.classList.add('pop'); setTimeout(() => b.classList.remove('pop'), 350); }
      refresh();
    }));
    api.el = h('div.ex', head(item, h('span', {style: {marginLeft: '6px', fontWeight: 500}}, '· toca uno de cada lado')), h('div.match', h('div.col', lb), h('div.col', rb)));
    api.ready = () => pairs.size === item.pairs.length;
    api.check = () => {
      done = true; let good = 0;
      for (const [l, r] of pairs) {
        const ok = l === r; if (ok) good++;
        lb.find(b => +b.dataset.i === l).classList.add(ok ? 'right' : 'wrong');
        rb.find(b => +b.dataset.i === r).classList.add(ok ? 'right' : 'wrong');
      }
      [...lb, ...rb].forEach(b => b.disabled = true);
      return {ok: good === item.pairs.length, partial: good / item.pairs.length};
    };
    api.answerText = item.pairs.map(p => p[0] + ' → ' + p[1]).join(' · ');
    return api;
  }

  function order(item) {
    let bank = shuffle(item.items.map((t, i) => [t, i]));
    if (bank.every(([, i], k) => i === k)) bank.reverse();
    const seq = []; let done = false;
    const api = {onChange: () => {}};
    const seqEl = h('div.seq'), bankEl = h('div.bank');
    function draw() {
      seqEl.textContent = ''; bankEl.textContent = '';
      seq.forEach(([t, i], k) => seqEl.append(h('button.tile', {type: 'button', 'data-i': i, onclick: () => { if (done) return; seq.splice(k, 1); bank.push([t, i]); draw(); }}, h('span.pos', k + 1), t)));
      bank.forEach(([t, i], k) => bankEl.append(h('button.tile', {type: 'button', onclick: () => { if (done) return; bank.splice(k, 1); seq.push([t, i]); draw(); }}, t)));
      api.onChange();
    }
    draw();
    api.el = h('div.ex', head(item), seqEl, bankEl);
    api.ready = () => bank.length === 0;
    api.check = () => {
      done = true; let good = 0;
      [...seqEl.children].forEach((b, k) => { const ok = +b.dataset.i === k; if (ok) good++; b.classList.add(ok ? 'right' : 'wrong'); b.disabled = true; });
      return {ok: good === item.items.length, partial: good / item.items.length};
    };
    api.answerText = item.items.map((t, i) => (i + 1) + '. ' + t).join('  ');
    return api;
  }

  function classify(item) {
    const items = shuffle(item.items.map(([t, b], i) => ({t, b, i, at: null})));
    let armed = null, done = false;
    const api = {onChange: () => {}};
    const bankEl = h('div.bank');
    const bEls = item.buckets.map((bk, bi) => {
      const list = h('div', {style: {display: 'grid', gap: '6px'}});
      const el = h('div.bucket', {role: 'button', tabindex: 0, 'aria-label': 'Caja ' + bk.t, style: {'--c': bk.c}}, h('h4', h('i'), bk.t), list);
      const drop = (e) => {
        if (done) return;
        if (e.target.closest('.tile')) return;
        if (armed) { armed.at = bi; armed = null; draw(); }
      };
      el.addEventListener('click', drop);
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop(e); } });
      el._list = list; return el;
    });
    function draw() {
      bankEl.textContent = ''; bEls.forEach(b => { b._list.textContent = ''; b.classList.toggle('armed', !!armed); });
      items.forEach(it => {
        const tile = h('span.tile', {role: 'button', tabindex: 0, 'data-i': it.i, style: armed === it ? {borderColor: 'var(--track)', background: 'var(--track-soft)'} : null}, it.t);
        const act = (e) => {
          e.stopPropagation(); if (done) return;
          if (it.at != null) { it.at = null; armed = null; } else armed = armed === it ? null : it;
          draw();
        };
        tile.addEventListener('click', act);
        tile.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(e); } });
        (it.at == null ? bankEl : bEls[it.at]._list).append(tile);
      });
      api.onChange();
    }
    draw();
    api.el = h('div.ex', head(item, h('span', {style: {marginLeft: '6px', fontWeight: 500}}, '· toca una ficha y luego su caja')),
      h('div.buckets', {style: {'--n': Math.min(item.buckets.length, 4)}}, bEls), bankEl);
    api.ready = () => items.every(it => it.at != null);
    api.check = () => {
      done = true; let good = 0;
      items.forEach(it => { const ok = it.at === it.b; if (ok) good++; const el = api.el.querySelector(`.tile[data-i="${it.i}"]`); el && el.classList.add(ok ? 'right' : 'wrong'); });
      return {ok: good === items.length, partial: good / items.length};
    };
    api.answerText = item.buckets.map((bk, bi) => bk.t + ': ' + item.items.filter(x => x[1] === bi).map(x => x[0]).join(', ')).join(' · ');
    return api;
  }

  function render(item, ctx) {
    if (item.k === 'match') return match(item);
    if (item.k === 'order') return order(item);
    if (item.k === 'classify') return classify(item);
    return choice(item, ctx);
  }
  window.Ex = {render, shuffle};
})();
