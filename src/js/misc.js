// Small behaviours that work with or without motion.
import { initConcept } from './concept.js';

export function initMisc(ctx) {
  // concept diagram: without motion, show its final state
  if (!ctx.motion) {
    const svg = document.querySelector('[data-concept-svg]');
    if (svg) initConcept(svg, document.querySelector('[data-concept-steps]'))(1);
  }

  // images fade in once decoded
  const mark = (img) => img.classList.add('is-loaded');
  document.querySelectorAll('.pic img').forEach((img) => {
    if (img.complete && img.naturalWidth) mark(img);
    else { img.addEventListener('load', () => mark(img), { once: true }); img.addEventListener('error', () => mark(img), { once: true }); }
  });

  // copy e-mail address
  const toast = document.querySelector('[data-toast]');
  let toastT;
  document.querySelectorAll('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.style.cssText = 'position:fixed;opacity:0'; document.body.append(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    }
    if (toast) {
      toast.textContent = btn.dataset.copied;
      toast.classList.add('is-on');
      clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('is-on'), 2600);
    }
  }));

  // apartment tabs (roving tabindex, arrow keys)
  const tabs = [...document.querySelectorAll('.apts__tab')];
  const select = (i, focus) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const fwd = ctx.rtl ? 'ArrowLeft' : 'ArrowRight', back = ctx.rtl ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === fwd) { e.preventDefault(); select((i + 1) % tabs.length, true); }
      if (e.key === back) { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
    });
  });

  // before / after repair toggles
  document.querySelectorAll('[data-pair]').forEach((pair) => {
    const btn = pair.querySelector('[data-pair-toggle]');
    const state = pair.querySelector('[data-pair-state]');
    const set = (after) => {
      pair.classList.toggle('is-after', after);
      pair.style.removeProperty('--after');
      btn.setAttribute('aria-pressed', after);
      btn.textContent = after ? btn.dataset.showBefore : btn.dataset.showAfter;
      state.textContent = after ? state.dataset.after : state.dataset.before;
    };
    pair.__set = set;
    btn.addEventListener('click', () => { pair.dataset.user = '1'; set(!pair.classList.contains('is-after')); });
  });

  // language links keep the reader's place; remember the choice
  document.querySelectorAll('[data-lang-link]').forEach((a) => a.addEventListener('click', (e) => {
    try { localStorage.setItem('om-lang', a.dataset.langLink); } catch { /* private mode */ }
    if (a.getAttribute('aria-current') === 'page') return;
    const id = ctx.currentSection;
    if (id) { e.preventDefault(); location.href = `${a.getAttribute('href')}#${id}`; }
  }));
}
