// The light cycle: the page keeps time like a day. Each [data-tone] region names a light; the page colour is
// interpolated continuously (in OKLab) as region boundaries pass the viewer's eye line — never a hard cut.
export const TONES = {
  vellum: ['#E3E7E4', '#22282D'],
  night: ['#0E1A2B', '#E8ECEF'],
  dawn: ['#D9DFE3', '#22282D'],
  morning: ['#E4E9EC', '#22282D'],
  day: ['#EBECE8', '#23292D'],
  bright: ['#F1F2F0', '#22282D'],
  concrete: ['#D4D8D7', '#1F2428'],
  landscape: ['#DFE4D9', '#1E2620'],
  overcast: ['#CBD0D3', '#1C2125'],
};
const LAMP = '#F1B86A';

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function toLab([r, g, b]) {
  r = lin(r); g = lin(g); b = lin(b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function toRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return rgb.map((c) => Math.round(Math.min(1, Math.max(0, gam(c))) * 255));
}
const LAB = Object.fromEntries(Object.entries(TONES).map(([k, [b, f]]) => [k, { bg: toLab(hex(b)), fg: toLab(hex(f)), dark: toLab(hex(b))[0] < 0.5 }]));
const mixLab = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const rgbOf = (lab) => `rgb(${toRgb(lab).join(' ')})`;
export { LAB, mixLab, smooth };

export function initTone(ctx) {
  const root = document.documentElement;
  const els = [...document.querySelectorAll('main [data-tone]')];
  if (!els.length) return;
  root.classList.add('tone-js');
  const meta = document.querySelector('meta[name="theme-color"]');
  let segs = [];

  function measure() {
    const sy = window.scrollY;
    const spans = els.map((el) => {
      const r = el.getBoundingClientRect();
      let depth = 0; for (let p = el.parentElement; p; p = p.parentElement) if (p.hasAttribute && p.hasAttribute('data-tone')) depth++;
      return { a: r.top + sy, b: r.bottom + sy, tone: el.dataset.tone, depth, el };
    });
    const cuts = [...new Set(spans.flatMap((s) => [s.a, s.b]))].sort((x, y) => x - y);
    const out = [];
    for (let i = 0; i < cuts.length - 1; i++) {
      const mid = (cuts[i] + cuts[i + 1]) / 2;
      let best = null;
      spans.forEach((s) => { if (mid >= s.a && mid < s.b && (!best || s.depth >= best.depth)) best = s; });
      if (!best) continue;
      if (!out.length || out[out.length - 1].tone !== best.tone) out.push({ at: cuts[i], tone: best.tone, el: best.el });
    }
    segs = out;
  }

  let last = '';
  function update() {
    if (!segs.length) return;
    const vh = window.innerHeight;
    const y = window.scrollY + vh * 0.62;
    const W = vh * 0.32;
    let i = 0;
    while (i < segs.length - 1 && y >= segs[i + 1].at) i++;
    let bg = LAB[segs[i].tone].bg, fg = LAB[segs[i].tone].fg, darkness = LAB[segs[i].tone].dark ? 1 : 0;
    // hero: the 3D scene owns its light
    if (ctx.heroTone && ctx.heroTone.active) { bg = ctx.heroTone.bg; fg = ctx.heroTone.fg; darkness = ctx.heroTone.dark; }
    else {
      if (i > 0 && y < segs[i].at + W) {
        const t = smooth(segs[i].at - W, segs[i].at + W, y);
        const A = LAB[segs[i - 1].tone], B = LAB[segs[i].tone];
        bg = mixLab(A.bg, B.bg, t); fg = mixLab(A.fg, B.fg, smooth(0.38, 0.62, t)); darkness = (A.dark ? 1 : 0) * (1 - t) + (B.dark ? 1 : 0) * t;
      } else if (i < segs.length - 1 && y > segs[i + 1].at - W) {
        const t = smooth(segs[i + 1].at - W, segs[i + 1].at + W, y);
        const A = LAB[segs[i].tone], B = LAB[segs[i + 1].tone];
        bg = mixLab(A.bg, B.bg, t); fg = mixLab(A.fg, B.fg, smooth(0.38, 0.62, t)); darkness = (A.dark ? 1 : 0) * (1 - t) + (B.dark ? 1 : 0) * t;
      }
    }
    const bgs = rgbOf(bg), fgs = rgbOf(fg);
    const key = bgs + fgs;
    if (key === last) return;
    last = key;
    root.style.setProperty('--bg', bgs);
    root.style.setProperty('--fg', fgs);
    root.style.setProperty('--lit', darkness > 0.5 ? LAMP : fgs);
    root.classList.toggle('is-dark', darkness > 0.5);
    if (meta) meta.setAttribute('content', bgs);
  }
  ctx.toneUpdate = update;

  measure(); update();
  ctx.ScrollTrigger.addEventListener('refresh', () => { measure(); update(); });
  if (ctx.lenis) ctx.lenis.on('scroll', update);
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => { measure(); update(); });
}
