// Full-screen drawing/image viewer: fit, wheel/pinch zoom around the pointer, drag to pan, keyboard, groups.
export function initViewer(ctx) {
  const box = document.querySelector('[data-viewer]');
  if (!box) return;
  const canvas = box.querySelector('[data-viewer-canvas]');
  const img = box.querySelector('[data-viewer-img]');
  const cap = box.querySelector('[data-viewer-cap]');
  const count = box.querySelector('[data-viewer-count]');
  const rtl = ctx.rtl;
  let list = [], idx = 0, lastFocus = null;
  let s = 1, x = 0, y = 0, fit = 1, natW = 1, natH = 1;

  const apply = () => { img.style.transform = `translate(${x}px, ${y}px) scale(${s})`; };
  function fitView() {
    const cw = canvas.clientWidth, ch = canvas.clientHeight, pad = Math.min(48, cw * 0.05);
    fit = Math.min((cw - pad * 2) / natW, (ch - pad * 2) / natH, 1.6);
    s = fit; x = (cw - natW * s) / 2; y = (ch - natH * s) / 2; apply();
  }
  function zoomAt(f, cx, cy) {
    const ns = Math.min(Math.max(s * f, fit * 0.6), Math.max(fit * 8, 3));
    x = cx - (cx - x) * (ns / s); y = cy - (cy - y) * (ns / s); s = ns; apply();
  }

  function show(i) {
    idx = (i + list.length) % list.length;
    const b = list[idx];
    natW = +b.dataset.w; natH = +b.dataset.h;
    img.classList.toggle('is-drawing', b.dataset.kind === 'd');
    img.style.width = `${natW}px`; img.style.height = `${natH}px`;
    img.alt = b.dataset.caption || '';
    img.src = b.dataset.full;
    cap.textContent = b.dataset.caption || '';
    count.textContent = list.length > 1 ? `${idx + 1} / ${list.length}` : '';
    box.querySelector('[data-viewer-prev]').hidden = box.querySelector('[data-viewer-next]').hidden = list.length < 2;
    fitView();
    [1, -1].forEach((d) => { const n = list[(idx + d + list.length) % list.length]; if (n) { const p = new Image(); p.src = n.dataset.full; } });
  }

  function open(btn) {
    const group = btn.dataset.group;
    const seen = new Set();
    list = [...document.querySelectorAll(`[data-view][data-group="${group}"]`)].filter((b) => {
      if (seen.has(b.dataset.view)) return false; seen.add(b.dataset.view); return true;
    });
    lastFocus = btn;
    box.hidden = false;
    document.body.classList.add('viewer-open');
    ctx.lenis && ctx.lenis.stop();
    show(Math.max(0, list.findIndex((b) => b.dataset.view === btn.dataset.view)));
    ctx.gsap.fromTo(box, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    box.querySelector('[data-viewer-close]').focus();
  }
  function close() {
    ctx.gsap.to(box, { opacity: 0, duration: 0.25, onComplete: () => { box.hidden = true; img.removeAttribute('src'); } });
    document.body.classList.remove('viewer-open');
    ctx.lenis && ctx.lenis.start();
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-view]');
    if (!b || b.closest('[data-viewer]')) return;
    e.preventDefault();
    open(b);
  });
  box.querySelector('[data-viewer-close]').addEventListener('click', close);
  box.querySelector('[data-viewer-prev]').addEventListener('click', () => show(idx - 1));
  box.querySelector('[data-viewer-next]').addEventListener('click', () => show(idx + 1));
  box.querySelector('[data-viewer-in]').addEventListener('click', () => zoomAt(1.5, canvas.clientWidth / 2, canvas.clientHeight / 2));
  box.querySelector('[data-viewer-out]').addEventListener('click', () => zoomAt(1 / 1.5, canvas.clientWidth / 2, canvas.clientHeight / 2));
  box.querySelector('[data-viewer-fit]').addEventListener('click', fitView);
  window.addEventListener('resize', () => { if (!box.hidden) fitView(); });

  box.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'Escape') { e.preventDefault(); close(); }
    else if (k === 'ArrowRight') { e.preventDefault(); show(idx + (rtl ? -1 : 1)); }
    else if (k === 'ArrowLeft') { e.preventDefault(); show(idx + (rtl ? 1 : -1)); }
    else if (k === '+' || k === '=') zoomAt(1.4, canvas.clientWidth / 2, canvas.clientHeight / 2);
    else if (k === '-') zoomAt(1 / 1.4, canvas.clientWidth / 2, canvas.clientHeight / 2);
    else if (k === '0') fitView();
    else if (k === 'Tab') {
      const f = [...box.querySelectorAll('button')].filter((b) => !b.hidden);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // pointer: drag to pan, pinch to zoom, double-tap to zoom
  const pts = new Map();
  let lastDist = 0, lastTap = 0, moved = false;
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); moved = false;
    canvas.classList.add('is-dragging');
    if (pts.size === 2) { const [a, b] = [...pts.values()]; lastDist = Math.hypot(a[0] - b[0], a[1] - b[1]); }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    const prev = pts.get(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 1) { x += e.clientX - prev[0]; y += e.clientY - prev[1]; if (Math.abs(e.clientX - prev[0]) + Math.abs(e.clientY - prev[1]) > 2) moved = true; apply(); }
    else if (pts.size === 2) {
      const [a, b] = [...pts.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const r = canvas.getBoundingClientRect();
      if (lastDist) zoomAt(d / lastDist, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top);
      lastDist = d; moved = true;
    }
  });
  const end = (e) => {
    pts.delete(e.pointerId); if (pts.size < 2) lastDist = 0;
    if (!pts.size) canvas.classList.remove('is-dragging');
    if (e.type === 'pointerup' && !moved) {
      const t = performance.now();
      if (t - lastTap < 300) { const r = canvas.getBoundingClientRect(); zoomAt(s > fit * 1.5 ? fit / s : 2.2, e.clientX - r.left, e.clientY - r.top); lastTap = 0; }
      else lastTap = t;
    }
  };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0022)), e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
}
