import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initTone } from './tone.js';
import { initHud } from './hud.js';
import { initViewer } from './viewer.js';
import { initMisc } from './misc.js';
import { initHero } from './hero.js';
import { initScenes } from './scenes.js';

gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement;
const motion = root.classList.contains('motion');
const rtl = root.dir === 'rtl';
const mobile = matchMedia('(max-width: 760px), (pointer: coarse)').matches;

let lenis = null;
if (motion) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.92, smoothWheel: true, syncTouch: false, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

const ctx = { gsap, ScrollTrigger, lenis, motion, rtl, mobile };
window.__om = ctx;

// smooth in-page navigation that also works with the sticky scenes
ctx.scrollTo = (target, opts = {}) => {
  const el = typeof target === 'string' ? (target === '#top' ? 0 : document.querySelector(target)) : target;
  if (el == null) return;
  if (lenis) {
    const y = el === 0 ? 0 : el.getBoundingClientRect().top + window.scrollY;
    const dist = Math.abs(y - window.scrollY);
    lenis.scrollTo(y, { duration: Math.min(2.4, 0.9 + dist / 9000), easing: (t) => 1 - Math.pow(1 - t, 3.2), ...opts });
  } else if (el === 0) window.scrollTo(0, 0);
  else el.scrollIntoView();
};
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  const el = id === '#top' ? 0 : document.querySelector(id);
  if (el == null) return;
  e.preventDefault();
  if (a.hasAttribute('data-menu-link')) document.dispatchEvent(new CustomEvent('om:close-menu'));
  ctx.scrollTo(id);
  history.replaceState(null, '', id === '#top' ? location.pathname : id);
  const focusEl = id === '#top' ? document.querySelector('#main') : el;
  if (focusEl && focusEl.focus) { focusEl.setAttribute('tabindex', '-1'); focusEl.focus({ preventScroll: true }); }
});

initViewer(ctx);
initMisc(ctx);
if (motion) {
  initHero(ctx);
  initScenes(ctx);
}
initHud(ctx);
initTone(ctx);

const refresh = () => ScrollTrigger.refresh();
window.addEventListener('load', refresh);
document.fonts && document.fonts.ready.then(refresh);
if (location.hash && location.hash.length > 1) {
  window.addEventListener('load', () => setTimeout(() => ctx.scrollTo(location.hash, { immediate: true }), 60));
}
