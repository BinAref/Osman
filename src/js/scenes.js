import { smooth } from './tone.js';
import { initConcept } from './concept.js';

// Every scene is scrubbed by scroll (reversible, speed follows the reader). Each motion shows a relationship:
// plan → volume, level → floor, drawing → image, sketch → model → render, before → after.
export function initScenes(ctx) {
  const { gsap, ScrollTrigger, rtl } = ctx;
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => [...r.querySelectorAll(s)];
  const track = (el, onUpdate, opts = {}) => ScrollTrigger.create({
    trigger: el, start: 'top top', end: 'bottom bottom', ...opts,
    onUpdate: (s) => onUpdate(s.progress), onRefresh: (s) => onUpdate(s.progress),
  });

  const scrollToY = (y) => (ctx.lenis ? ctx.lenis.scrollTo(y, { duration: 0.9 }) : window.scrollTo(0, y));

  // ── Mall: the building is assembled level by level, bottom up. Each plan drops onto the one below and is read
  //    on top of the stack, large and tilted on the diagonal; the camera rises with it, then pulls back to show
  //    the whole exploded axonometric. Every plate opens full size in the viewer. ──
  const stack = q('[data-stack]');
  if (stack) {
    const model = q('[data-stack-model]', stack);
    const levels = qa('.stack__level', model);
    const plans = qa('[data-stack-plan]', stack);
    const chips = qa('[data-chip]', stack);
    const n = levels.length, mid = (n - 1) / 2;
    const A = 0.1, S0 = 0.12, S1 = 0.82, B0 = 0.86;   // tilt in · assemble · pull back
    let cur = -1;
    const setActive = (i) => {
      if (i === cur) return; cur = i;
      plans.forEach((pl, j) => pl.classList.toggle('is-on', j === i));
      chips.forEach((c, j) => c.setAttribute('aria-pressed', String(j === i)));
    };
    const st = track(q('.stack__track', stack), (p) => {
      const a = smooth(0, A, p);
      const back = smooth(B0, 1, p);
      const W = model.offsetWidth;
      const gap = W * 0.24;
      const sweep = smooth(S0, S1, p) * (n - 1);
      model.style.setProperty('--rx', `${(a * 38 + back * 16).toFixed(2)}deg`);
      model.style.setProperty('--rz', `${(back * (rtl ? 10 : -10)).toFixed(2)}deg`);
      model.style.setProperty('--gap', `${gap.toFixed(1)}px`);
      model.style.setProperty('--cam', `${(-(sweep - mid) * gap * (1 - back)).toFixed(1)}px`);
      model.style.setProperty('--sc', (1 - back * 0.5).toFixed(3));
      levels.forEach((lv, i) => {
        const d = i - sweep;                       // > 0: not placed yet
        const o = d > 0 ? Math.max(0, 1 - d * 1.6) : Math.max(0.22, 1 + d * 0.42);
        const oo = o + (1 - o) * back * (d > 0 ? 1 : 0.8);
        lv.style.setProperty('--o', oo.toFixed(3));
        lv.style.setProperty('--lift', `${(d > 0 ? d * gap * 1.4 : 0).toFixed(1)}px`);
        lv.style.setProperty('--to', back.toFixed(3));
        const hidden = oo < 0.04;
        lv.style.visibility = hidden ? 'hidden' : '';
        lv.style.pointerEvents = oo < 0.5 && back < 0.5 ? 'none' : '';
      });
      setActive(Math.min(n - 1, Math.max(0, Math.round(sweep))));
    });
    // the elevator panel jumps straight to a level
    chips.forEach((c, i) => c.addEventListener('click', () => {
      setActive(i);
      scrollToY(st.start + (S0 + (i / (n - 1)) * (S1 - S0)) * (st.end - st.start) + 1);
    }));
  }

  // ── Office tower: an elevator ride from the ground floor to the restaurant floor ──
  const floors = q('[data-floors]');
  if (floors) {
    const tr = q('.floors__track', floors);
    const bars = qa('.floors__bar', floors);
    const plans = qa('[data-floor-plan]', floors);
    const num = q('[data-floor-num]', floors), text = q('[data-floor-text]', floors);
    const groundWord = num.textContent;
    let cur = -1;
    const setFloor = (f) => {
      if (f === cur) return; cur = f;
      const g = plans.findIndex((pl) => f >= +pl.dataset.from && f <= +pl.dataset.to);
      bars.forEach((b) => { const bf = +b.dataset.floor; b.classList.toggle('is-on', bf === f); b.classList.toggle('in-group', bf !== f && +b.dataset.groupI === g); });
      plans.forEach((pl, i) => pl.classList.toggle('is-on', i === g));
      num.textContent = f === 0 ? groundWord : String(f).padStart(2, '0');
      text.textContent = plans[g].dataset.text;
    };
    const st = track(tr, (p) => setFloor(Math.round(smooth(0.05, 0.95, p) * 22)));
    bars.forEach((b) => b.addEventListener('click', () => {
      const f = +b.dataset.floor;
      scrollToY(st.start + (0.05 + (f / 22) * 0.9) * (st.end - st.start) + 1);
    }));
  }

  // ── Six towers: the site plan tilts away into the aerial view ──
  const tilt = q('[data-tilt]');
  if (tilt) {
    const plan = q('[data-tilt-plan]', tilt), aerial = q('[data-tilt-aerial]', tilt);
    const caps = qa('[data-tilt-cap]', tilt);
    track(q('.tilt__track', tilt), (p) => {
      const t = smooth(0.1, 0.62, p);
      plan.style.setProperty('--tx', `${(t * 56).toFixed(2)}deg`);
      plan.style.setProperty('--ts', (1 - t * 0.08).toFixed(3));
      plan.style.setProperty('--po', (1 - smooth(0.38, 0.64, p)).toFixed(3));
      const ao = smooth(0.34, 0.62, p);
      aerial.style.setProperty('--ao', ao.toFixed(3));
      aerial.style.setProperty('--as', (1.08 - 0.08 * smooth(0.34, 0.96, p)).toFixed(3));
      caps[0].style.opacity = 1 - ao; caps[1].style.opacity = ao;
      plan.style.pointerEvents = ao > 0.5 ? 'none' : '';
    });
  }

  // ── Descent: from the avenue to the street corner, each view held while the next slides over ──
  const descent = q('[data-descent]');
  if (descent) {
    const frames = qa('[data-descent-frame]', descent);
    track(descent, (p) => {
      frames.forEach((f, i) => {
        const a = i / frames.length, b = (i + 1) / frames.length;
        f.style.setProperty('--k', (1.14 - 0.14 * smooth(a - 0.12, b, p)).toFixed(4));
      });
    });
  }

  // ── Facade: the elevation drawing is wiped into the rendered street view ──
  const wipe = q('[data-wipe]');
  if (wipe) {
    const frame = q('.wipe__frame', wipe);
    track(q('.wipe__track', wipe), (p) => frame.style.setProperty('--cut', `${(100 - 100 * smooth(0.18, 0.84, p)).toFixed(2)}%`));
  }

  // ── Section ↔ plans: the highlighted band climbs the section as the plans change ──
  const lv = q('[data-levels]');
  if (lv) {
    const band = q('[data-levels-band]', lv);
    const names = qa('[data-level-name]', lv);
    const plans = qa('[data-levels-plan]', lv);
    // band positions on the side-section drawing (top %, height % of the drawing): basement, ground, first, roof
    const B = [[58, 25], [36, 22], [14, 22], [2, 19]];
    let cur = -1;
    track(q('.levels__track', lv), (p) => {
      const i = Math.min(3, Math.floor(smooth(0.06, 0.94, p) * 4));
      if (i === cur) return; cur = i;
      band.style.setProperty('--bt', `${B[i][0]}%`); band.style.setProperty('--bh', `${B[i][1]}%`);
      names.forEach((n, j) => n.classList.toggle('is-on', j === i));
      plans.forEach((pl, j) => pl.classList.toggle('is-on', j === i));
    });
  }

  // ── Villas: level lines are drawn as the sections arrive ──
  qa('[data-villa-section]').forEach((sec) => {
    gsap.fromTo(qa('.vlevels__row', sec), { '--sx': 0 }, {
      '--sx': 1, duration: 1.1, ease: 'power3.out', stagger: 0.18,
      scrollTrigger: { trigger: sec, start: 'top 78%', toggleActions: 'play none none reverse' },
    });
  });

  // ── Community center: a tracing-paper sheet slides over, then the process runs sideways ──
  const vellum = q('[data-vellum]');
  if (vellum) {
    ScrollTrigger.create({
      trigger: vellum, start: 'top bottom', end: 'bottom 40%',
      onUpdate: (s) => vellum.style.setProperty('--vb', `${(s.progress * 16).toFixed(1)}px`),
    });
  }
  const film = q('[data-film]');
  if (film) {
    const strip = q('[data-film-strip]', film);
    const tr = q('.film__track', film);
    const bar = q('[data-film-progress]', film);
    let dist = 0;
    const measure = () => {
      strip.style.transform = 'none';
      const view = film.clientWidth - 2 * parseFloat(getComputedStyle(film).paddingInlineStart || 0);
      dist = Math.max(0, strip.scrollWidth - view);
      tr.style.setProperty('--film-h', `${Math.round(dist * 0.72 + window.innerHeight)}px`);
      strip.style.transform = '';
    };
    measure();
    ScrollTrigger.addEventListener('refreshInit', measure);
    track(tr, (p) => {
      strip.style.setProperty('--fx', `${(rtl ? 1 : -1) * p * dist}px`);
      bar.parentElement.style.setProperty('--fp', p.toFixed(4));
    });
  }

  // ── Senior village: the concept diagram, scrubbed ──
  const concept = q('[data-concept]');
  if (concept) {
    const set = initConcept(q('[data-concept-svg]', concept), q('[data-concept-steps]', concept));
    track(q('.concept__track', concept), (p) => set(p));
  }

  // ── Site: repairs cross-fade as each case passes the eye line (the toggle hands control to the reader) ──
  qa('[data-pair]').forEach((pair) => {
    const state = q('[data-pair-state]', pair);
    const btn = q('[data-pair-toggle]', pair);
    let after = false;
    ScrollTrigger.create({
      trigger: pair, start: 'top 72%', end: 'top 24%',
      onUpdate: (s) => {
        if (pair.dataset.user) return;
        const v = smooth(0.3, 0.7, s.progress);
        pair.style.setProperty('--after', v.toFixed(3));
        const now = v > 0.5;
        if (now !== after) {
          after = now;
          pair.classList.toggle('is-after', now);
          state.textContent = now ? state.dataset.after : state.dataset.before;
          btn.textContent = now ? btn.dataset.showBefore : btn.dataset.showAfter;
          btn.setAttribute('aria-pressed', now);
        }
      },
    });
  });

  // ── Documentation: the glazing counts grow into bars ──
  qa('[data-glass]').forEach((g) => ScrollTrigger.create({ trigger: g, start: 'top 80%', once: true, onEnter: () => g.classList.add('is-in') }));

  // ── Experience: floor slabs are drawn as each entry arrives ──
  qa('.slab').forEach((slab) => {
    const line = q('.slab__line', slab);
    ScrollTrigger.create({ trigger: slab, start: 'top 94%', end: 'top 62%', onUpdate: (s) => line.style.setProperty('--sx', smooth(0, 1, s.progress).toFixed(3)), onRefresh: (s) => line.style.setProperty('--sx', smooth(0, 1, s.progress).toFixed(3)) });
  });
  const chain = q('.tools__chain');
  if (chain) ScrollTrigger.create({ trigger: chain, start: 'top 88%', end: 'top 50%', onUpdate: (s) => chain.style.setProperty('--tl', s.progress.toFixed(3)), onRefresh: (s) => chain.style.setProperty('--tl', s.progress.toFixed(3)) });

  // ── Depth: figures in the galleries drift at different rates ──
  const drift = [
    ['.elev__aerial', 70], ['.elev__night', -40], ['.elev__section', 90], ['.elev__site', 50],
    ['.slv-views__f--3', 70], ['.site-open__osman', 60], ['.site-open__court', 40],
    ['.sheet--fac .sheet__site', 50], ['.villa__planr', 50], ['.villa__r1', 40], ['.sheet__ccr3', 60], ['.sheet__ccr2', -40],
  ];
  drift.forEach(([sel, d]) => qa(sel).forEach((el) => gsap.fromTo(el, { y: d }, { y: -d, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })));
  // ── Project cover: the camera eases in as the reader leaves the title ──
  const phero = q('[data-phero]');
  if (phero) {
    const pic = q('[data-phero-pic]', phero), text = q('[data-phero-text]', phero);
    gsap.fromTo(pic, { scale: 1, yPercent: 0 }, { scale: 1.08, yPercent: 6, ease: 'none', scrollTrigger: { trigger: phero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(text, { opacity: 0, y: -40, ease: 'none', scrollTrigger: { trigger: phero, start: 'top top', end: '55% top', scrub: true } });
  }
  // ── Index: each cover opens like a shutter as it arrives ──
  qa('.work__img, .pnext__img').forEach((el) => gsap.fromTo(el, { clipPath: 'inset(14% 0% 0% 0%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 55%', scrub: true },
  }));

  const wire = q('.contact__wire');
  if (wire) gsap.fromTo(wire, { yPercent: 12 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true } });
}
