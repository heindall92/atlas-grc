/* Atlas GRC · intro de marca en cada carga: ordenador con sonido, móvil en silencio. */
(function () {
  const root = document.getElementById('film');
  const video = document.getElementById('film-v');
  if (!root || !video) return;

  const skip = document.getElementById('film-skip');
  const desktop = matchMedia('(min-width: 721px)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let closed = false;

  function close() {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', onKey, true);
    video.pause();
    root.classList.add('out');
    document.documentElement.classList.remove('film-on');
    setTimeout(() => root.remove(), 480);
  }

  function onKey(e) {
    if (closed || !root.isConnected) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  }

  function resumeMuted() {
    if (closed || video.ended) return;
    video.muted = true;
    video.play().catch(() => {});
  }

  function start() {
    video.volume = 1;
    video.muted = false;
    const pending = video.play();
    if (!pending || !pending.then) {
      if (video.paused) resumeMuted();
      return;
    }
    pending.then(() => {
      if (video.paused) resumeMuted();
    }).catch(resumeMuted);
  }

  // Sin intro con movimiento reducido ni en el modo de capturas del README (?captura)
  if (reduced || /[?&]captura/.test(location.search)) {
    root.remove();
    return;
  }

  document.documentElement.classList.add('film-on');
  document.addEventListener('keydown', onKey, true);
  if (skip) skip.addEventListener('click', close);
  video.addEventListener('ended', () => setTimeout(close, 280));

  if (desktop) {
    video.src = 'media/intro.mp4';
    video.muted = false;
    video.volume = 1;
    start();
    return;
  }

  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.preload = 'auto';
  video.src = 'media/intro-movil.mp4';
  const playSilent = () => {
    if (closed || video.ended || !video.paused) return;
    const pending = video.play();
    if (pending && pending.catch) pending.catch(() => video.addEventListener('canplay', playSilent, {once: true}));
  };
  video.addEventListener('loadeddata', playSilent);
  playSilent();
})();
