/* Atlas GRC · Ciudad de Albatrel en 3D (Three.js, incluido en app/vendor).
   Cada edificio sale de una «fábrica» que lo monta con piezas simples (cuerpo, forjados,
   tejado, grúa, bandera…) y pivotes que se animan: la idea de img2threejs aplicada a mano.
   Texturas generadas en canvas: no se descarga ninguna imagen. */
import * as THREE from 'three';
import {OrbitControls} from '../vendor/three/addons/OrbitControls.js';
import {RoundedBoxGeometry} from '../vendor/three/addons/RoundedBoxGeometry.js';
import {RoomEnvironment} from '../vendor/three/addons/RoomEnvironment.js';

const N = 14, HALF = N / 2, FH = .34, BAYS = 2.6;
const X = (i) => i - HALF;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeBack = (t) => { const c = 1.35; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const lerp = (a, b, t) => a + (b - a) * t;
function seeded(s) { return () => (s = (s * 16807) % 2147483647) / 2147483647; }

/* ── Texturas de canvas ── */
function tex(w, h, draw, {repeat = [1, 1], srgb = true} = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function speckle(g, w, h, base, cols, n, rnd, size = 2) {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let k = 0; k < n; k++) { g.fillStyle = cols[k % cols.length]; const s = 1 + rnd() * size; g.fillRect(rnd() * w, rnd() * h, s, s); }
}

/* Fachadas: 4 vanos × 4 plantas por textura; la emisiva enciende ventanas al azar de noche */
const STY = {
  glass: {wall: '#cfd9e6', glass: ['#5f88bd', '#bcd3ee'], frame: '#eef3f8', win: [.06, .1, .94, .9], mull: true, rough: .22, metal: .35},
  white: {wall: '#f1efea', glass: ['#58789f', '#b4c8e0'], frame: '#ffffff', win: [.22, .24, .78, .8], rough: .7, metal: 0},
  brick: {wall: '#b0603f', glass: ['#4d6987', '#a1b8d2'], frame: '#f4eee4', win: [.24, .22, .76, .8], brick: true, rough: .9, metal: 0},
  stone: {wall: '#e6dbc3', glass: ['#516a85', '#9fb5cc'], frame: '#fbf7ee', win: [.3, .14, .7, .86], rough: .85, metal: 0},
  concrete: {wall: '#b8bbc1', glass: ['#3b4552', '#6b7888'], frame: '#d3d6db', win: [.08, .36, .92, .62], louvre: true, rough: .9, metal: 0},
  dark: {wall: '#353a45', glass: ['#1b222d', '#2c3848'], frame: '#575e6b', win: [.08, .42, .92, .56], led: true, rough: .5, metal: .4},
  metal: {wall: '#c5cad2', glass: ['#566b83', '#9bb0c7'], frame: '#e5e7eb', win: [.14, .3, .86, .7], ribs: true, rough: .45, metal: .55}
};
const FAC = {};
function facade(key) {
  if (FAC[key]) return FAC[key];
  const s = STY[key], C = 64, rnd = seeded(11 + key.length * 7);
  const map = tex(C * 4, C * 4, (g) => {
    g.fillStyle = s.wall; g.fillRect(0, 0, C * 4, C * 4);
    if (s.brick) { g.strokeStyle = 'rgba(70,30,20,.28)'; g.lineWidth = 1; for (let y = 0; y < C * 4; y += 6) { g.beginPath(); g.moveTo(0, y); g.lineTo(C * 4, y); g.stroke(); for (let x = (y / 6) % 2 ? 0 : 7; x < C * 4; x += 14) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 6); g.stroke(); } } }
    if (s.ribs) { g.fillStyle = 'rgba(0,0,0,.08)'; for (let x = 0; x < C * 4; x += 8) g.fillRect(x, 0, 2, C * 4); }
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const [a, b, e, f] = s.win, x0 = c * C + a * C, y0 = r * C + b * C, ww = (e - a) * C, hh = (f - b) * C;
      const gr = g.createLinearGradient(x0, y0, x0 + ww * .4, y0 + hh); gr.addColorStop(0, s.glass[1]); gr.addColorStop(.55, s.glass[0]); gr.addColorStop(1, s.glass[0]);
      g.fillStyle = gr; g.fillRect(x0, y0, ww, hh);
      g.strokeStyle = s.frame; g.lineWidth = 2.5; g.strokeRect(x0, y0, ww, hh);
      if (s.mull) { g.lineWidth = 1.5; g.beginPath(); g.moveTo(x0 + ww / 2, y0); g.lineTo(x0 + ww / 2, y0 + hh); g.stroke(); }
      if (s.louvre) { g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1; for (let y = y0 + 3; y < y0 + hh; y += 3) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + ww, y); g.stroke(); } }
      // reflejo suave del cielo
      g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.moveTo(x0, y0 + hh * .7); g.lineTo(x0 + ww * .55, y0); g.lineTo(x0 + ww * .75, y0); g.lineTo(x0, y0 + hh); g.fill();
    }
  });
  const emi = tex(C * 4, C * 4, (g) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, C * 4, C * 4);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const [a, b, e, f] = s.win, on = rnd();
      if (s.led) { g.fillStyle = on > .5 ? '#5ef0ff' : '#7dff9c'; g.fillRect(c * C + a * C, r * C + (b + .06) * C, (e - a) * C, 2); g.fillRect(c * C + a * C, r * C + (f - .06) * C, (e - a) * C * on, 2); continue; }
      if (on < .32) continue;
      g.fillStyle = on > .8 ? '#fff3d6' : on > .55 ? '#ffd27f' : '#ffbe5c';
      g.fillRect(c * C + a * C + 2, r * C + b * C + 2, (e - a) * C - 4, (f - b) * C - 4);
    }
  });
  return (FAC[key] = {map, emi, s});
}
function facadeMat(key, uRep, vRep, vOff, M) {
  const F = facade(key), map = F.map.clone(), emi = F.emi.clone();
  [map, emi].forEach(t => { t.needsUpdate = true; t.repeat.set(uRep, vRep); t.offset.set(0, vOff); });
  const m = new THREE.MeshStandardMaterial({map, emissiveMap: emi, emissive: 0xffffff, emissiveIntensity: 0, roughness: F.s.rough, metalness: F.s.metal});
  M.windows.push(m);
  return m;
}

/* ── Escena ── */
export function mount(host, st, opts = {}) {
  const reduced = !!opts.reduced, still = !!opts.still;
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.still});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, .5, 200);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.enablePan = false;
  controls.minDistance = 14; controls.maxDistance = 58;
  controls.minPolarAngle = .45; controls.maxPolarAngle = 1.22;
  controls.autoRotateSpeed = .55; controls.target.set(0, .6, 0);
  // En el móvil un dedo desplaza la página; con dos se gira y se acerca
  controls.touches = {ONE: -1, TWO: THREE.TOUCH.DOLLY_ROTATE};
  renderer.domElement.style.touchAction = 'pan-y';

  /* Luces */
  const hemi = new THREE.HemisphereLight(0xdfeaff, 0x5b4a36, .9); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
  sun.position.set(9, 16, 6); sun.castShadow = true;
  const sm = innerWidth < 700 ? 1024 : 2048; sun.shadow.mapSize.set(sm, sm);
  Object.assign(sun.shadow.camera, {left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 50});
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .02; sun.shadow.radius = 3;
  scene.add(sun);

  const M = {windows: [], bulbs: [], halos: [], heads: [], beams: [], lanterns: [], blinks: [], pools: []};
  let beamG = null;
  const anim = [];          // animaciones de entrada
  const spin = [];          // piezas que giran o se balancean cada fotograma
  const pick = [];          // cajas invisibles para tocar edificios
  const bgroups = [];       // grupo de cada edificio (para levantarlo al pasar el ratón)
  const std = (c, r = .8, m = 0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({color: c, roughness: r, metalness: m}, extra));
  const mesh = (geo, mat, cast = true, recv = true) => { const o = new THREE.Mesh(geo, mat); o.castShadow = cast; o.receiveShadow = recv; return o; };
  const box = (w, h, d, mat, cast, recv) => mesh(new THREE.BoxGeometry(w, h, d), mat, cast, recv);
  const rnd = seeded(42);

  /* ── Terreno: maqueta con tierra, césped, calles, aceras y plaza ── */
  const world = new THREE.Group(); scene.add(world);
  const slab = mesh(new RoundedBoxGeometry(N + .5, .8, N + .5, 4, .16), std('#7d5f43', .95), false, true); slab.position.y = -.43; world.add(slab);
  const grassT = tex(256, 256, (g, w, h) => speckle(g, w, h, '#86b860', ['#78aa53', '#95c66d', '#6e9f4b', '#a3cf79'], 2600, rnd, 2.5), {repeat: [6, 6]});
  const grass = box(N, .06, N, std('#ffffff', .95, 0, {map: grassT}), false, true); grass.position.y = -.03; world.add(grass);
  const asphaltT = tex(128, 1024, (g, w, h) => {
    speckle(g, w, h, '#4a4d54', ['#3f4249', '#575a62', '#51545b'], 3000, rnd, 1.5);
    g.fillStyle = '#e9e5d8'; for (let y = 8; y < h; y += 64) g.fillRect(w / 2 - 2, y, 4, 34);
    g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(6, 0, 3, h); g.fillRect(w - 9, 0, 3, h);
  });
  const roadMat = std('#ffffff', .85, 0, {map: asphaltT});
  const r1 = box(2, .02, N, roadMat, false, true); r1.position.y = .005; world.add(r1);
  const roadMat2 = roadMat.clone(); roadMat2.map = asphaltT.clone(); roadMat2.map.needsUpdate = true; roadMat2.map.rotation = Math.PI / 2; roadMat2.map.center.set(.5, .5);
  const r2 = box(N, .02, 2, roadMat2, false, true); r2.position.y = .006; world.add(r2);
  const swMat = std('#d9d5cc', .9);
  [[-1.13, -4.6], [1.13, -4.6], [-1.13, 4.6], [1.13, 4.6]].forEach(([x, z]) => { const a = box(.26, .06, 4.8, swMat, false, true); a.position.set(x, .03, z); world.add(a); const b = box(4.8, .06, .26, swMat, false, true); b.position.set(z, .03, x); world.add(b); });
  const plazaT = tex(256, 256, (g, w, h) => { speckle(g, w, h, '#e7e1d4', ['#ded7c7', '#efe9dc'], 900, rnd); g.strokeStyle = 'rgba(120,100,80,.22)'; g.lineWidth = 1.2; for (let k = 0; k <= w; k += 32) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, h); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(w, k); g.stroke(); } }, {repeat: [2, 2]});
  const plaza = box(4.2, .03, 4.2, std('#ffffff', .8, 0, {map: plazaT}), false, true); plaza.position.y = .016; world.add(plaza);
  const ring = mesh(new THREE.CylinderGeometry(1.25, 1.25, .012, 48), std('#cfc6b4', .75), false, true); ring.position.y = .034; world.add(ring);
  // pasos de cebra
  const zebraMat = std('#f4f1e8', .7);
  [[0, -2.35, 0], [0, 2.35, 0], [-2.35, 0, 1], [2.35, 0, 1]].forEach(([x, z, rot]) => { for (let k = -3; k <= 3; k++) { const s = box(.14, .025, .5, zebraMat, false, true); s.position.set(rot ? x : x + k * .26, .02, rot ? z + k * .26 : z); if (rot) s.rotation.y = Math.PI / 2; world.add(s); } });

  /* ── Fábricas de piezas ── */
  const accentMat = (k) => std(st.cols[k] || '#5e5ce6', .5, .1);
  const roofMat = std('#c9ccd1', .9);
  const glassBlk = std('#20262f', .15, .6);

  function parapet(g, w, d, y, mat) {
    const t = .06, h = .1;
    [[0, d / 2 - t / 2, w, t], [0, -d / 2 + t / 2, w, t], [w / 2 - t / 2, 0, t, d], [-w / 2 + t / 2, 0, t, d]].forEach(([x, z, ww, dd]) => { const p = box(ww, h, dd, mat); p.position.set(x, y + h / 2, z); g.add(p); });
  }
  function hvac(g, x, z, y, fan) {
    const u = box(.34, .16, .26, std('#aeb3ba', .6, .3)); u.position.set(x, y + .08, z); g.add(u);
    if (fan) { const f = mesh(new THREE.CylinderGeometry(.09, .09, .02, 14), std('#5c6169', .5, .5)); f.position.set(x, y + .17, z); g.add(f); const b = box(.16, .01, .03, std('#30343a', .5, .5)); b.position.set(x, y + .185, z); g.add(b); spin.push((t) => { b.rotation.y = t * 9; }); }
  }
  function gable(w, d, h, wallC) {
    const s = new THREE.Shape(); s.moveTo(-d / 2 - .05, 0); s.lineTo(d / 2 + .05, 0); s.lineTo(0, h); s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, {depth: w + .1, bevelEnabled: false});
    geo.translate(0, 0, -(w + .1) / 2); geo.rotateY(Math.PI / 2);
    const tileT = tex(64, 64, (g) => { g.fillStyle = '#8f3f2e'; g.fillRect(0, 0, 64, 64); g.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 0; y < 64; y += 8) g.fillRect(0, y, 64, 2); }, {repeat: [4, 2]});
    return mesh(geo, [std(wallC, .9), std('#ffffff', .8, 0, {map: tileT})]);
  }
  function flagPole(g, x, z, y, k) {
    const p = mesh(new THREE.CylinderGeometry(.012, .012, .7, 6), std('#d9dbe0', .3, .8)); p.position.set(x, y + .35, z); g.add(p);
    const piv = new THREE.Group(); piv.position.set(x, y + .6, z); g.add(piv);
    const fg = new THREE.PlaneGeometry(.32, .2, 8, 1); fg.translate(.16, 0, 0);
    const f = mesh(fg, std(st.cols[k] || '#5e5ce6', .7, 0, {side: THREE.DoubleSide}), true, false); piv.add(f);
    const pos = fg.attributes.position, base = pos.array.slice();
    spin.push((t) => { for (let v = 0; v < pos.count; v++) { const xx = base[v * 3]; pos.array[v * 3 + 2] = Math.sin(t * 4 + xx * 14) * .03 * xx * 3; } pos.needsUpdate = true; piv.rotation.y = Math.sin(t * .7 + k) * .25; });
  }
  function crane(x, z, h, k) {
    const g = new THREE.Group(); g.position.set(x, 0, z);
    const yel = std('#f2b705', .55, .2), lat = new THREE.MeshBasicMaterial({color: '#c98f00', wireframe: true});
    const mast = box(.1, h, .1, yel); mast.position.y = h / 2; g.add(mast);
    const lw = new THREE.Mesh(new THREE.BoxGeometry(.15, h, .15, 1, Math.max(2, Math.round(h / .16)), 1), lat); lw.position.y = h / 2; g.add(lw);
    const slew = new THREE.Group(); slew.position.y = h; g.add(slew);
    const jib = box(1.9, .07, .09, yel); jib.position.x = .8; slew.add(jib);
    const cj = box(.6, .07, .09, yel); cj.position.x = -.4; slew.add(cj);
    const cw = box(.18, .16, .16, std('#8a8f97', .8)); cw.position.set(-.62, -.1, 0); slew.add(cw);
    const cab = box(.16, .14, .14, std('#f6f6f6', .4, .1)); cab.position.set(.05, -.1, .1); slew.add(cab);
    const top = mesh(new THREE.ConeGeometry(.06, .35, 4), yel); top.position.y = .2; slew.add(top);
    const cbl = std('#ff3b30', .4, 0, {emissive: 0xff3b30, emissiveIntensity: 1}); M.blinks.push(cbl);
    const cled = mesh(new THREE.SphereGeometry(.03, 8, 6), cbl, false, false); cled.position.y = .4; slew.add(cled);
    const trolley = new THREE.Group(); trolley.position.x = 1.1; slew.add(trolley);
    const cable = mesh(new THREE.CylinderGeometry(.006, .006, 1, 4), std('#333', .5, .5), false, false); trolley.add(cable);
    const hook = box(.12, .08, .12, std('#e2a400', .5, .3)); trolley.add(hook);
    const off = k * 1.7;
    spin.push((t) => { slew.rotation.y = off + Math.sin(t * .18 + off) * 1.1; trolley.position.x = .7 + Math.sin(t * .3 + off) * .4; const L = .7 + Math.sin(t * .45 + off) * .35; cable.scale.y = L; cable.position.y = -L / 2; hook.position.y = -L - .04; });
    return g;
  }
  function ghost(w, d, y0, hh, k, faint) {
    const g = new THREE.Group();
    const c = faint ? '#8e8e93' : (st.cols[k] || '#5e5ce6');
    const fill = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), new THREE.MeshBasicMaterial({color: c, transparent: true, opacity: faint ? 0 : .05, depthWrite: false}));
    fill.position.y = y0 + hh / 2; g.add(fill);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, hh, d)), new THREE.LineBasicMaterial({color: c, transparent: true, opacity: faint ? .16 : .45}));
    edges.position.y = y0 + hh / 2; g.add(edges);
    // andamio: líneas de cada planta pendiente
    const fl = Math.round(hh / FH);
    for (let f = 1; f < fl; f++) { const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2)), new THREE.LineBasicMaterial({color: c, transparent: true, opacity: faint ? .07 : .2})); e.position.y = y0 + f * FH; g.add(e); }
    return g;
  }
  function hoarding(w, d, k) {
    const g = new THREE.Group(), mat = std('#ece8de', .9), top = std(st.cols[k] || '#8e8e93', .6);
    [[0, d / 2, w, .03], [0, -d / 2, w, .03], [w / 2, 0, .03, d], [-w / 2, 0, .03, d]].forEach(([x, z, ww, dd]) => { const p = box(ww, .16, dd, mat); p.position.set(x, .08, z); g.add(p); const s = box(ww + .01, .03, dd + .01, top); s.position.set(x, .17, z); g.add(s); });
    const dirt = box(w - .05, .02, d - .05, std('#a78a63', 1), false, true); dirt.position.y = .01; g.add(dirt);
    return g;
  }

  /* Cuerpo de un edificio de varias plantas */
  function body(g, w, d, floors, sty, k, opt = {}) {
    if (!floors) return 0;
    const h = floors * FH, v = floors / 4;
    const mx = facadeMat(sty, d * BAYS / 4, v, 0, M), mz = facadeMat(sty, w * BAYS / 4, v, .25 * (k % 4), M);
    const b = mesh(new THREE.BoxGeometry(w, h, d), [mx, mx, roofMat, roofMat, mz, mz]); b.position.y = h / 2; g.add(b);
    const band = std(STY[sty].frame, .6, .05);
    for (let f = 1; f <= floors; f++) { const s = box(w + .05, .035, d + .05, band); s.position.y = f * FH - .01; g.add(s); }
    if (!opt.noDoor) {
      const door = box(.32, .22, .02, glassBlk); door.position.set(0, .11, d / 2 + .011); g.add(door);
      const can = box(.5, .03, .18, accentMat(k)); can.position.set(0, .25, d / 2 + .09); g.add(can);
    }
    return h;
  }

  /* ── Los 11 edificios ── */
  function building(s) {
    const {b, k, soon, floors, pct} = s, [i, j, w, d] = b.at;
    const g = new THREE.Group(); g.position.set(X(i + w / 2), 0, X(j + d / 2)); world.add(g);
    const grow = new THREE.Group(); g.add(grow);
    const complete = !soon && pct >= 1, maxH = b.max * FH;
    let top = 0;
    if (soon) { g.add(hoarding(w, d, k)); g.add(ghost(w, d, 0, maxH, k, true)); }
    else if (!floors) { g.add(hoarding(w, d, k)); g.add(ghost(w, d, 0, maxH, k, false)); }
    else switch (k) {
      case 0: { // Faro del norte
        for (let f = 0; f < floors; f++) {
          const r0 = lerp(.42, .3, f / b.max), r1 = lerp(.42, .3, (f + 1) / b.max);
          const seg = mesh(new THREE.CylinderGeometry(r1, r0, FH, 28), f % 2 ? std(st.cols[0], .55, .05) : std('#f7f5f0', .6));
          seg.position.y = f * FH + FH / 2; grow.add(seg);
          const win = box(.08, .12, .02, glassBlk); win.position.set(0, f * FH + FH / 2, lerp(r0, r1, .5) - .005); grow.add(win);
        }
        top = floors * FH;
        if (floors >= b.max) {
          const gal = mesh(new THREE.CylinderGeometry(.42, .42, .05, 28), std('#30343c', .5, .6)); gal.position.y = top + .025; grow.add(gal);
          const rail = mesh(new THREE.TorusGeometry(.4, .01, 6, 32), std('#30343c', .5, .6)); rail.rotation.x = Math.PI / 2; rail.position.y = top + .14; grow.add(rail);
          const lm = std('#fff4cc', .1, 0, {emissive: 0xffd36b, emissiveIntensity: .4, transparent: true, opacity: .9}); M.lanterns.push(lm);
          const lan = mesh(new THREE.CylinderGeometry(.2, .2, .26, 20), lm); lan.position.y = top + .18; grow.add(lan);
          const cap = mesh(new THREE.ConeGeometry(.27, .22, 20), std(st.cols[0], .5, .1)); cap.position.y = top + .42; grow.add(cap);
          const ball = mesh(new THREE.SphereGeometry(.04, 10, 8), std('#e3c15b', .3, .9)); ball.position.y = top + .55; grow.add(ball);
          if (st.beacon) {
            const beam = new THREE.Group(); beam.position.y = top + .18; grow.add(beam);
            const bm = new THREE.MeshBasicMaterial({color: 0xffe08a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide});
            M.beams.push(bm);
            [0, Math.PI].forEach(a => { const c = new THREE.Mesh(new THREE.ConeGeometry(.5, 4.5, 24, 1, true), bm); c.rotation.z = Math.PI / 2; c.position.x = 2.25; const p = new THREE.Group(); p.rotation.y = a; p.add(c); beam.add(p); });
            beamG = beam; spin.push((t) => { beam.rotation.y = t * .9; });
          }
          if (st.passed) flagPole(grow, .25, .25, top + .05, 0);
        }
        break;
      }
      case 1: { // Sede central: muro cortina
        top = body(grow, w, d, floors, 'glass', k); parapet(grow, w, d, top, accentMat(k));
        hvac(grow, -.7, -.5, top, true); hvac(grow, -.2, -.5, top, true);
        const ant = mesh(new THREE.CylinderGeometry(.015, .02, .6, 6), std('#c9ccd2', .3, .8)); ant.position.set(.9, top + .3, -.6); grow.add(ant);
        if (complete) flagPole(grow, .9, .7, top, k);
        break;
      }
      case 2: { // Observatorio de riesgos
        top = body(grow, w, d, floors, 'white', k); parapet(grow, w, d, top, accentMat(k));
        if (floors >= 1) {
          const dome = new THREE.Group(); dome.position.y = top; grow.add(dome);
          const dm = mesh(new THREE.SphereGeometry(.72, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), std('#f4f5f7', .28, .55)); dome.add(dm);
          const slit = box(.16, .05, .74, std('#1c2028', .4, .3)); slit.position.set(0, .5, .26); slit.rotation.x = -.75; dome.add(slit);
          const drum = mesh(new THREE.CylinderGeometry(.76, .76, .08, 40), accentMat(k)); drum.position.y = .04; dome.add(drum);
          spin.push((t) => { dome.rotation.y = Math.sin(t * .12) * 1.4; });
        }
        if (complete) flagPole(grow, -1, .9, top, k);
        break;
      }
      case 3: { // Escuela y archivo: ladrillo y tejado a dos aguas
        top = body(grow, w, d, floors, 'brick', k);
        const r = gable(w, d, .55, '#b0603f'); r.position.y = top; grow.add(r);
        const ch = box(.14, .3, .14, std('#8e4a33', .9)); ch.position.set(-.9, top + .35, -.35); grow.add(ch);
        if (complete) flagPole(grow, 1.3, .9, top, k);
        break;
      }
      case 4: { // Sala técnica: hormigón con enfriadoras
        top = body(grow, w, d, floors, 'concrete', k); parapet(grow, w, d, top, accentMat(k));
        [-.8, -.3, .2, .7].forEach((x, n) => hvac(grow, x, n % 2 ? .3 : -.3, top, true));
        if (complete) flagPole(grow, 1.1, .8, top, k);
        break;
      }
      case 5: { // Torre de auditoría
        top = body(grow, w, d, floors, 'white', k, {noDoor: true}); parapet(grow, w, d, top, accentMat(k));
        const ant = mesh(new THREE.CylinderGeometry(.012, .025, .9, 6), std('#c9ccd2', .3, .8)); ant.position.y = top + .45; grow.add(ant);
        const bl = std('#ff3b30', .4, 0, {emissive: 0xff3b30, emissiveIntensity: 1}); M.blinks.push(bl);
        const led = mesh(new THREE.SphereGeometry(.035, 10, 8), bl, false, false); led.position.y = top + .92; grow.add(led);
        break;
      }
      case 6: { // Taller de mejora: cubierta en diente de sierra
        top = body(grow, w, d, floors, 'metal', k);
        for (let n = 0; n < 3; n++) {
          const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(d / 3, 0); s.lineTo(0, .28); s.closePath();
          const geo = new THREE.ExtrudeGeometry(s, {depth: w, bevelEnabled: false}); geo.translate(0, 0, -w / 2); geo.rotateY(Math.PI / 2);
          const p = mesh(geo, [std('#9fb3c9', .2, .4), std('#c5cad2', .5, .5)]); p.position.set(0, top, -d / 2 + n * d / 3); grow.add(p);
        }
        break;
      }
      case 7: { // Oficinas de gobierno: piedra, columnas y frontón
        top = body(grow, w, d, floors, 'stone', k);
        const corn = box(w + .12, .06, d + .12, std('#f7f1e4', .7)); corn.position.y = top + .03; grow.add(corn);
        [-.35, -.12, .12, .35].forEach(x => { const c = mesh(new THREE.CylinderGeometry(.035, .04, .5, 12), std('#fbf7ee', .6)); c.position.set(x, .25, d / 2 + .16); grow.add(c); });
        const ped = new THREE.Shape(); ped.moveTo(-.5, 0); ped.lineTo(.5, 0); ped.lineTo(0, .16); ped.closePath();
        const pg = new THREE.ExtrudeGeometry(ped, {depth: .3, bevelEnabled: false}); const pm = mesh(pg, std('#f7f1e4', .7)); pm.position.set(0, .5, d / 2 + .02); grow.add(pm);
        if (complete) flagPole(grow, 0, 0, top + .06, k);
        break;
      }
      case 8: { // Vestíbulo y accesos: barrera que sube y baja
        top = body(grow, w, d, floors, 'glass', k); parapet(grow, w, d, top, accentMat(k));
        const post = box(.08, .18, .08, std('#30343c', .5, .3)); post.position.set(w / 2 + .25, .09, d / 2 + .1); grow.add(post);
        const arm = new THREE.Group(); arm.position.set(w / 2 + .25, .17, d / 2 + .1); grow.add(arm);
        const bar = box(.9, .03, .03, std('#ff3b30', .5)); bar.position.x = -.45; arm.add(bar);
        spin.push((t) => { arm.rotation.z = -Math.max(0, Math.sin(t * .5)) * 1.3; });
        break;
      }
      case 9: { // Centro de datos: paneles oscuros y LED
        top = body(grow, w, d, floors, 'dark', k); parapet(grow, w, d, top, accentMat(k));
        hvac(grow, 0, -1, top, true); hvac(grow, 0, .1, top, true); hvac(grow, 0, 1, top, true);
        break;
      }
      case 10: { // Sello de certificación
        const ped = mesh(new THREE.CylinderGeometry(.28, .32, .3, 24), std('#e9e4d8', .6)); ped.position.y = .15; grow.add(ped);
        if (complete) { const disc = mesh(new THREE.CylinderGeometry(.22, .22, .05, 32), std('#e8b923', .25, 1)); disc.rotation.x = Math.PI / 2; disc.position.y = .58; grow.add(disc); spin.push((t) => { disc.rotation.z = t * .6; }); }
        top = .3;
        break;
      }
    }
    if (!soon && floors && floors < b.max && k !== 10) g.add(ghost(w, d, top, maxH - floors * FH, k, false));
    if (!soon && floors && !complete && k !== 10) g.add(crane(-w / 2 - .25, -d / 2 - .25, maxH + .9, k));

    const pb = new THREE.Mesh(new THREE.BoxGeometry(w + .3, maxH + .6, d + .3), new THREE.MeshBasicMaterial({visible: false}));
    pb.position.y = (maxH + .6) / 2; pb.userData.k = k; g.add(pb); pick.push(pb);
    bgroups[k] = g;
    if (!still && !reduced) { grow.scale.y = .001; anim.push({o: grow, at: 250 + k * 110, dur: 900 + floors * 60, kind: 'grow', fresh: st.fresh && st.fresh.includes(k)}); }
  }
  st.blocks.forEach(building);

  /* ── Árboles (instanciados): tronco y dos copas por árbol ── */
  const nT = st.trees;
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(.03, .045, .32, 6), std('#7a5a3c', .9), Math.max(1, nT));
  const crownA = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.22, 1), std('#ffffff', .85, 0, {flatShading: true}), Math.max(1, nT));
  const crownB = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.15, 1), std('#ffffff', .85, 0, {flatShading: true}), Math.max(1, nT));
  [trunks, crownA, crownB].forEach(m => { m.castShadow = true; m.receiveShadow = true; m.count = nT; world.add(m); });
  const trees = [];
  const greens = ['#4f9a45', '#5fae4f', '#3f8a3c', '#6dbb58', '#78a640'];
  for (let n = 0; n < nT; n++) {
    const [ti, tj] = st.TREES[n], s = .8 + rnd() * .5, kind = n % 4 === 0 ? 'cone' : 'round';
    trees.push({x: X(ti), z: X(tj), s, ph: rnd() * 6, born: 600 + (n % 25) * 40, kind});
    crownA.setColorAt(n, new THREE.Color(greens[n % greens.length])); crownB.setColorAt(n, new THREE.Color(greens[(n + 2) % greens.length]).offsetHSL(0, 0, .05));
  }
  const dm = new THREE.Object3D();
  function placeTrees(t, ms) {
    trees.forEach((tr, n) => {
      const g = still || reduced ? 1 : easeBack(Math.min(1, Math.max(0, (ms - tr.born) / 600)));
      const sw = reduced ? 0 : Math.sin(t * 1.3 + tr.ph) * .04, s = tr.s * Math.max(.001, g);
      dm.position.set(tr.x, .16 * s, tr.z); dm.rotation.set(0, 0, 0); dm.scale.set(s, s, s); dm.updateMatrix(); trunks.setMatrixAt(n, dm.matrix);
      dm.position.set(tr.x + sw * .3, .42 * s, tr.z); dm.rotation.set(sw, tr.ph, sw * .5); dm.scale.set(s, s * (tr.kind === 'cone' ? 1.4 : 1), s); dm.updateMatrix(); crownA.setMatrixAt(n, dm.matrix);
      dm.position.set(tr.x + sw * .5, .62 * s, tr.z); dm.scale.set(s * .9, s * .9, s * .9); dm.updateMatrix(); crownB.setMatrixAt(n, dm.matrix);
    });
    [trunks, crownA, crownB].forEach(m => { m.instanceMatrix.needsUpdate = true; });
  }
  if (crownA.instanceColor) { crownA.instanceColor.needsUpdate = true; crownB.instanceColor.needsUpdate = true; }

  /* ── Farolas: encendidas por cada documento construido ── */
  const haloT = tex(64, 64, (g) => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,220,140,1)'); r.addColorStop(.35, 'rgba(255,190,90,.45)'); r.addColorStop(1, 'rgba(255,170,60,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
  const postMat = std('#3a3f47', .5, .6);
  st.LAMPS.forEach(([li, lj], n) => {
    const on = n < st.lamps, g = new THREE.Group(); g.position.set(X(li), 0, X(lj)); world.add(g);
    const p = mesh(new THREE.CylinderGeometry(.018, .026, .62, 6), postMat); p.position.y = .31; g.add(p);
    const arm = box(.14, .02, .02, postMat); arm.position.set(.06, .62, 0); g.add(arm);
    const bm = std(on ? '#fff1c9' : '#9a9da3', .3, 0, {emissive: on ? 0xffc864 : 0x000000, emissiveIntensity: on ? .3 : 0});
    const bulb = mesh(new THREE.SphereGeometry(.035, 10, 8), bm, false, false); bulb.position.set(.12, .6, 0); g.add(bulb);
    if (on) { M.bulbs.push(bm); const sp = new THREE.Sprite(new THREE.SpriteMaterial({map: haloT, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false})); sp.scale.set(.9, .9, .9); sp.position.set(.12, .6, 0); g.add(sp); M.halos.push(sp.material); }
  });

  /* ── Muralla: un sillar por control entendido ── */
  if (st.wall) {
    const wm = new THREE.InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 1, .08), std('#ffffff', .95), st.wall);
    wm.castShadow = true; wm.receiveShadow = true; world.add(wm);
    for (let n = 0; n < st.wall; n++) {
      const [i, j, w, d] = st.WALL[n];
      dm.position.set(X(i + w / 2), .09, X(j + d / 2)); dm.rotation.set(0, 0, 0); dm.scale.set(w, .18, d); dm.updateMatrix(); wm.setMatrixAt(n, dm.matrix);
      wm.setColorAt(n, new THREE.Color().setHSL(.09, .12, .62 + rnd() * .12));
    }
  }

  /* ── Coches que circulan ── */
  const cars = [];
  const carCols = ['#e5484d', '#f2f2f2', '#2f6fde', '#1f2329', '#f5a524', '#5bb36b'];
  function car(c) {
    const g = new THREE.Group();
    const bodyM = std(c, .35, .5);
    const b = mesh(new RoundedBoxGeometry(.5, .14, .26, 2, .05), bodyM); b.position.y = .12; g.add(b);
    const cab = mesh(new RoundedBoxGeometry(.28, .12, .22, 2, .04), std('#26303c', .1, .6)); cab.position.set(-.03, .24, 0); g.add(cab);
    const wg = new THREE.CylinderGeometry(.055, .055, .04, 12); wg.rotateX(Math.PI / 2);
    [[.16, .13], [-.16, .13], [.16, -.13], [-.16, -.13]].forEach(([x, z]) => { const w = mesh(wg, std('#15171a', .8)); w.position.set(x, .06, z); g.add(w); });
    const hm = std('#ffffff', .2, 0, {emissive: 0xfff2c8, emissiveIntensity: .2}); M.heads.push(hm);
    [.08, -.08].forEach(z => { const h = box(.02, .03, .05, hm, false, false); h.position.set(.25, .13, z); g.add(h); const tl = box(.02, .03, .05, std('#ff3b30', .4, 0, {emissive: 0xff2a20, emissiveIntensity: .6}), false, false); tl.position.set(-.25, .13, z); g.add(tl); });
    world.add(g); return g;
  }
  const lanes = [{ax: 'z', off: .58, dir: -1}, {ax: 'z', off: -.58, dir: 1}, {ax: 'x', off: .58, dir: 1}, {ax: 'x', off: -.58, dir: -1}];
  for (let n = 0; n < 6; n++) { const L = lanes[n % 4]; cars.push({g: car(carCols[n]), L, s: -7 + n * 2.4, s0: -7 + n * 2.4, v: .7 + (n % 3) * .15}); }
  function moveCars(dt) {
    cars.forEach(c => {
      if (!reduced && !still) c.s += c.v * dt;
      if (c.s > 7.4) c.s -= 14.8;
      const p = c.s * c.L.dir;
      if (c.L.ax === 'z') { c.g.position.set(c.L.off, .02, p); c.g.rotation.y = c.L.dir > 0 ? -Math.PI / 2 : Math.PI / 2; }
      else { c.g.position.set(p, .02, c.L.off); c.g.rotation.y = c.L.dir > 0 ? 0 : Math.PI; }
      c.g.visible = Math.abs(c.s) < 7.15;
    });
  }

  let nightT = opts.night ? 1 : 0, nightGoal = nightT;
  /* ── Vida de la ciudad: aceras de parcela, bancos, macetas, charcos de luz, peatones y nubes ── */
  const padMat = std('#d6d2c9', .9);
  st.blocks.forEach(({b}) => { const [i, j, w, d] = b.at; const p = box(w + .36, .04, d + .36, padMat, false, true); p.position.set(X(i + w / 2), .02, X(j + d / 2)); world.add(p); });
  const wood = std('#9b6b43', .8), iron = std('#3a3f47', .5, .6);
  [30, 60, 120, 150, 210, 240, 300, 330].forEach(deg => {
    const a = deg * Math.PI / 180, g = new THREE.Group(); g.position.set(Math.cos(a) * 1.7, 0, Math.sin(a) * 1.7); g.rotation.y = -a; world.add(g);
    const seat = box(.08, .025, .3, wood); seat.position.y = .07; g.add(seat);
    const back = box(.02, .07, .3, wood); back.position.set(.04, .11, 0); g.add(back);
    [-.12, .12].forEach(z => { const l = box(.06, .06, .02, iron); l.position.set(0, .03, z); g.add(l); });
  });
  const potMat = std('#cbb89a', .85), bushMat = std('#4f8f43', .9, 0, {flatShading: true});
  [[-1.85, -1.85], [1.85, -1.85], [-1.85, 1.85]].forEach(([x, z]) => { const p = mesh(new THREE.CylinderGeometry(.16, .13, .14, 16), potMat); p.position.set(x, .09, z); world.add(p); const b = mesh(new THREE.IcosahedronGeometry(.17, 1), bushMat); b.position.set(x, .25, z); world.add(b); });
  // charcos de luz bajo las farolas encendidas (solo de noche)
  st.LAMPS.forEach(([li, lj], n) => {
    if (n >= st.lamps) return;
    const pm = new THREE.MeshBasicMaterial({map: haloT, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false});
    const pool = new THREE.Mesh(new THREE.CircleGeometry(.75, 24), pm); pool.rotation.x = -Math.PI / 2; pool.position.set(X(li) + .12, .045, X(lj)); world.add(pool); M.pools.push(pm);
  });
  // peatones por las aceras
  const nP = 18, people = [];
  const bodyI = new THREE.InstancedMesh(new THREE.CapsuleGeometry(.035, .08, 3, 8), std('#ffffff', .8), nP);
  const headI = new THREE.InstancedMesh(new THREE.SphereGeometry(.03, 8, 6), std('#e8c4a0', .8), nP);
  [bodyI, headI].forEach(m => { m.castShadow = true; world.add(m); });
  const shirts = ['#2f6fde', '#e5484d', '#f5a524', '#5bb36b', '#8e5cd9', '#f2f2f2', '#1f2329', '#30b0c7'];
  for (let n = 0; n < nP; n++) {
    const axis = n % 2 ? 'x' : 'z', side = (n >> 1) % 2 ? 1.13 : -1.13, half = (n >> 2) % 2 ? 1 : -1;
    people.push({axis, off: side + (rnd() - .5) * .1, mid: half * 4.6, amp: 1.6 + rnd() * .6, ph: rnd() * 6.28, sp: .12 + rnd() * .1});
    bodyI.setColorAt(n, new THREE.Color(shirts[n % shirts.length]));
  }
  bodyI.instanceColor.needsUpdate = true;
  function walk(t, loopP) {
    people.forEach((p, n) => {
      const s = p.mid + p.amp * Math.sin(loopP != null ? loopP * Math.PI * 2 + p.ph : t * p.sp + p.ph);
      const bob = reduced ? 0 : Math.abs(Math.sin((loopP != null ? loopP * 60 : t * 7) + n)) * .012;
      const x = p.axis === 'z' ? p.off : s, z = p.axis === 'z' ? s : p.off;
      dm.position.set(x, .1 + bob, z); dm.rotation.set(0, 0, 0); dm.scale.set(1, 1, 1); dm.updateMatrix(); bodyI.setMatrixAt(n, dm.matrix);
      dm.position.set(x, .2 + bob, z); dm.updateMatrix(); headI.setMatrixAt(n, dm.matrix);
    });
    bodyI.instanceMatrix.needsUpdate = true; headI.instanceMatrix.needsUpdate = true;
  }
  // nubes que solo proyectan su sombra al pasar (no tapan la vista)
  const cloudMat = new THREE.MeshBasicMaterial({colorWrite: false, depthWrite: false});
  const clouds = [0, 1, 2].map(n => {
    const g = new THREE.Group(); g.position.set(-10 + n * 7.5, 5, -4 + n * 3.5);
    for (let k = 0; k < 5; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.7 + rnd() * .6, 10, 8), cloudMat); s.position.set(k * .8 - 1.6, rnd() * .3, (rnd() - .5) * 1.2); s.castShadow = true; g.add(s); }
    world.add(g); return {g, x0: g.position.x};
  });
  function drift(t, loopP) { clouds.forEach(c => { const x = c.x0 + (loopP != null ? loopP * 24 : t * .35); c.g.position.x = ((x + 12) % 24 + 24) % 24 - 12; c.g.visible = nightT < .5; }); }

  /* ── Día y noche ── */
  const DAY = {sun: 2.6, sunC: new THREE.Color('#fff1dc'), hemi: .9, env: 1, exp: 1.05};
  const NIGHT = {sun: .35, sunC: new THREE.Color('#7d96ff'), hemi: .1, env: .1, exp: .95};
  function applyLight(t) {
    sun.intensity = lerp(DAY.sun, NIGHT.sun, t); sun.color.copy(DAY.sunC).lerp(NIGHT.sunC, t);
    sun.position.set(lerp(9, -6, t), lerp(16, 12, t), lerp(6, 8, t));
    hemi.intensity = lerp(DAY.hemi, NIGHT.hemi, t); scene.environmentIntensity = lerp(DAY.env, NIGHT.env, t);
    renderer.toneMappingExposure = lerp(DAY.exp, NIGHT.exp, t);
    M.windows.forEach(m => { m.emissiveIntensity = t * 1.25; });
    M.bulbs.forEach(m => { m.emissiveIntensity = lerp(.3, 3.2, t); });
    M.halos.forEach(m => { m.opacity = t * .9; });
    M.heads.forEach(m => { m.emissiveIntensity = lerp(.2, 3, t); });
    M.beams.forEach(m => { m.opacity = t * .2; });
    M.lanterns.forEach(m => { m.emissiveIntensity = lerp(.4, 3, t); });
    M.pools.forEach(m => { m.opacity = t * .55; });
  }
  applyLight(nightT);

  /* ── Cámara y tamaño ── */
  function frame() {
    const w = host.clientWidth || 600, h = host.clientHeight || 400, a = w / h;
    renderer.setSize(w, h, false); camera.aspect = a;
    const r = a >= 1.25 ? 33 : a >= .9 ? 39 : 45;
    if (!frame.done) { const az = opts.az != null ? opts.az : Math.PI / 4, pol = opts.pol || .98, rr = r * (opts.zoom || 1); camera.position.set(rr * Math.sin(pol) * Math.sin(az), rr * Math.cos(pol) + .6, rr * Math.sin(pol) * Math.cos(az)); frame.done = true; endPos.copy(camera.position); }
    camera.updateProjectionMatrix();
  }
  const endPos = new THREE.Vector3();
  frame();
  // Entrada de cámara: llega desde más lejos y más alto, y se asienta (ease-out)
  const intro = !still && !reduced ? {from: endPos.clone().multiplyScalar(1.35).add(new THREE.Vector3(0, 6, 0)), at: 0, dur: 1600} : null;
  if (intro) camera.position.copy(intro.from);
  const ro = new ResizeObserver(() => frame()); ro.observe(host);

  /* ── Tocar y pasar el ratón ── */
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let hover = -1, down = null;
  const hit = (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera); const o = ray.intersectObjects(pick, false)[0];
    return o ? o.object.userData.k : -1;
  };
  const el = renderer.domElement;
  // La rueda solo acerca con Ctrl/⌘ o tras tocar la ciudad: así la página sigue haciendo scroll
  let engaged = false;
  el.addEventListener('wheel', (e) => { controls.enableZoom = engaged || e.ctrlKey || e.metaKey; }, {capture: true, passive: true});
  el.addEventListener('pointerleave', () => { engaged = false; });
  el.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const k = hit(e); if (k !== hover) { hover = k; el.style.cursor = k >= 0 ? 'pointer' : 'grab'; opts.onHover && opts.onHover(k, e); }
    else if (k >= 0 && opts.onHover) opts.onHover(k, e);
  });
  el.addEventListener('pointerleave', () => { hover = -1; opts.onHover && opts.onHover(-1); });
  el.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; engaged = true; if (intro) intro.done = true; });
  el.addEventListener('pointerup', (e) => {
    if (!down) return; const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]); down = null;
    if (moved < 6) { const k = hit(e); if (k >= 0 && opts.onPick) opts.onPick(k); }
  });

  /* ── Bucle ── */
  const clock = new THREE.Clock(); const t0 = performance.now();
  let raf = 0, visible = true, alive = true;
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf && alive && !still) raf = requestAnimationFrame(loop); });
  io.observe(host);
  function loop() {
    raf = 0;
    if (!alive) return;
    if (!host.isConnected) { dispose(); return; }
    const dt = Math.min(.05, clock.getDelta()), t = clock.elapsedTime, ms = performance.now() - t0;
    if (intro && !intro.done) { const p = Math.min(1, ms / intro.dur); camera.position.lerpVectors(intro.from, endPos, easeOut(p)); if (p >= 1) intro.done = true; }
    controls.update();
    if (nightT !== nightGoal) { nightT += Math.sign(nightGoal - nightT) * Math.min(Math.abs(nightGoal - nightT), dt * 1.6); applyLight(nightT); }
    anim.forEach(a => { const p = Math.min(1, Math.max(0, (ms - a.at) / a.dur)); a.o.scale.y = Math.max(.001, a.fresh ? easeBack(p) : easeOut(p)); });
    if (!reduced) spin.forEach(f => f(t));
    M.blinks.forEach(m => { m.emissiveIntensity = (Math.sin(t * 3) > .6 ? 2.5 : .2) * (reduced ? 0 : 1) + (reduced ? 1 : 0); });
    bgroups.forEach((g, k) => { if (g) g.position.y = lerp(g.position.y, hover === k ? .1 : 0, .18); });
    placeTrees(t, still ? 1e6 : ms);
    moveCars(dt);
    walk(t); drift(t);
    renderer.render(scene, camera);
    if (visible && !document.hidden) raf = requestAnimationFrame(loop);
  }
  document.addEventListener('visibilitychange', onVis);
  function onVis() { if (!document.hidden && visible && !raf && alive && !still) { clock.getDelta(); raf = requestAnimationFrame(loop); } }
  function renderStill() {
    // Foto fija; con opts.loop.p (0..1) se dibuja un fotograma de un bucle perfecto (cabecera del README)
    const lp = opts.loop ? opts.loop.p : null;
    controls.update();
    placeTrees(lp != null ? lp * Math.PI * 2 / 1.3 : 0, 1e6);
    if (lp != null) cars.forEach(c => { c.s = ((c.s0 + 7.4 + 14.8 * lp) % 14.8 + 14.8) % 14.8 - 7.4; });
    moveCars(0); spin.forEach(f => f(2)); walk(0, lp); drift(0, lp);
    if (beamG && lp != null) beamG.rotation.y = lp * Math.PI * 4;
    M.blinks.forEach(m => { m.emissiveIntensity = lp != null && Math.sin(lp * Math.PI * 12) > .3 ? 2.5 : .3; });
    renderer.render(scene, camera);
  }
  if (still) { renderStill(); new ResizeObserver(() => { frame(); renderStill(); }).observe(host); host.dataset.ready = '1'; }
  else raf = requestAnimationFrame(loop);

  function dispose() {
    if (!alive) return; alive = false; cancelAnimationFrame(raf);
    ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); controls.dispose();
    scene.traverse(o => { if (o.geometry) o.geometry.dispose(); const ms = o.material ? [].concat(o.material) : []; ms.forEach(m => { ['map', 'emissiveMap'].forEach(k => m[k] && m[k].dispose()); m.dispose(); }); });
    Object.keys(FAC).forEach(k => { FAC[k].map.dispose(); FAC[k].emi.dispose(); delete FAC[k]; });
    pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss();
    renderer.domElement.remove();
  }
  return {
    canvas: renderer.domElement,
    setNight(b) { nightGoal = b ? 1 : 0; if (reduced || still) { nightT = nightGoal; applyLight(nightT); } },
    setAuto(b) { controls.autoRotate = !!b && !reduced; },
    reset() { frame.done = false; frame(); controls.target.set(0, .6, 0); },
    dispose
  };
}
