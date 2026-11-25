import { LAB, mixLab, smooth } from './tone.js';

// Hero choreography (scroll progress p of the hero track):
// 0–.12 plan drawn · .10–.45 podium then towers rise · .46–.68 day falls into blue hour · .70–.92 camera
// descends to the street · .86–.95 the massing dissolves into the project's night render.
export function initHero(ctx) {
  const { gsap, ScrollTrigger, mobile } = ctx;
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const root = document.documentElement;
  const track = hero.querySelector('.hero__track');
  const canvas = hero.querySelector('.hero__canvas');
  const intro = hero.querySelector('[data-hero-intro]');
  const words = [...intro.querySelectorAll('.hero__word > span')];
  const byline = intro.querySelector('.hero__byline');
  const story = hero.querySelector('[data-hero-story]');
  const stepsEl = hero.querySelector('[data-hero-steps]');
  const steps = [...stepsEl.querySelectorAll('.hero__step')];
  const note = hero.querySelector('[data-hero-note]');
  const cue = hero.querySelector('[data-hero-cue]');
  const render = hero.querySelector('.hero__render');
  const renderPic = render.querySelector('.pic');
  const shade = hero.querySelector('.hero__shade');
  const labelsBox = hero.querySelector('.hero__labels');
  const labels = [...hero.querySelectorAll('[data-label]')];

  const st = story.querySelector('.hero__statement');
  st.innerHTML = st.textContent.trim().split(/(\s+)/).map((w) => (/^\s+$/.test(w) ? w : `<span class="w">${w}</span>`)).join('');
  const sw = [...st.querySelectorAll('.w')];

  // the one orchestrated load moment: the name rises off the ground line while the plan is drafted
  gsap.from(words, { yPercent: 108, duration: 1.5, ease: 'expo.out', stagger: 0.09, delay: 0.2 });
  gsap.from(byline, { opacity: 0, y: 14, duration: 1.1, ease: 'power3.out', delay: 0.85 });
  gsap.from(cue, { opacity: 0, duration: 1, delay: 1.7 });

  // light inside the hero (shared with the page's light cycle)
  const tone = { active: true, bg: LAB.vellum.bg, fg: LAB.vellum.fg, dark: 0 };
  ctx.heroTone = tone;

  let three = null, p = 0;
  const webgl = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
  if (!webgl) fallback();
  else {
    import('./hero3d.js').then(({ createHero }) => {
      three = createHero(canvas, { mobile, rtl: ctx.rtl });
      root.classList.add('webgl');
      gsap.to(labels, { opacity: 1, duration: 0.8, stagger: 0.12, delay: 1.2, ease: 'power2.out' });
      update(p);
    }).catch((e) => { console.warn('3D unavailable', e); fallback(); });
  }
  function fallback() {
    // no WebGL: the hero becomes a plain cover (the night render), the track collapses, the page light takes over
    root.classList.add('no-webgl');
    ctx.heroTone = null;
    intro.style.cssText = '';
    cue.style.opacity = '';
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  let lastStep = -1, lastWords = -1;
  function update(prog) {
    p = prog;
    if (root.classList.contains('no-webgl')) return;
    const out = smooth(0.025, 0.11, p);
    intro.style.opacity = 1 - out;
    intro.style.transform = `translateY(${-out * 6}vh)`;
    intro.style.visibility = out >= 1 ? 'hidden' : '';
    cue.style.opacity = 1 - smooth(0, 0.035, p);



    // light
    const n = smooth(0.44, 0.66, p);
    tone.bg = mixLab(LAB.vellum.bg, LAB.night.bg, n);
    tone.fg = mixLab(LAB.vellum.fg, LAB.night.fg, smooth(0.46, 0.56, p));
    tone.dark = p > 0.51 ? 1 : 0;
    tone.active = p < 0.999;

    // labels follow the drawing while it is a plan
    const lo = 1 - smooth(0.07, 0.14, p);
    labelsBox.style.opacity = lo;
    if (three && lo > 0) {
      labels.forEach((el) => {
        const [x, y] = three.labelScreen(el.dataset.label);
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      });
    }

    // statement, read word by word while the building rises
    story.style.opacity = smooth(0.12, 0.17, p) * (1 - smooth(0.5, 0.56, p));
    const k = Math.round(sw.length * smooth(0.15, 0.44, p));
    if (k !== lastWords) { sw.forEach((w, i) => w.classList.toggle('is-on', i < k)); lastWords = k; }

    stepsEl.style.opacity = smooth(0.04, 0.09, p) * (1 - smooth(0.84, 0.88, p));
    const s = p < 0.14 ? 0 : p < 0.48 ? 1 : 2;
    if (s !== lastStep) { steps.forEach((el, i) => el.classList.toggle('is-on', i === s)); lastStep = s; }
    note.style.opacity = smooth(0.16, 0.22, p) * (1 - smooth(0.82, 0.86, p));

    const r = smooth(0.86, 0.95, p);
    render.style.opacity = r;
    renderPic.style.transform = `scale(${1.08 - 0.08 * smooth(0.86, 1, p)})`;
    shade.style.opacity = smooth(0.9, 1, p);
    if (three) { three.setProgress(p); three.setRunning(r < 0.999); }
    ctx.toneUpdate && ctx.toneUpdate();
  }

  // the model answers the pointer (fine pointers only)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      if (!three) return;
      three.setPointer((e.clientX / innerWidth - 0.5) * 2, (e.clientY / innerHeight - 0.5) * 2);
    });
    hero.addEventListener('pointerleave', () => three && three.setPointer(0, 0));
  }

  ScrollTrigger.create({
    trigger: track, start: 'top top', end: 'bottom bottom',
    onUpdate: (self) => update(self.progress),
    onRefresh: (self) => update(self.progress),
  });
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { three && three.resize(); update(p); }, 120); });
  update(0);
}
