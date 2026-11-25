// Re-drawn from the architect's concept diagram for the Senior Living Village:
// people scattered → small groups, each in a home → pairs of L-shaped dwellings around a shared heart.
import { smooth } from './tone.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const lerp = (a, b, t) => a + (b - a) * t;

export function initConcept(svg, stepsEl, onProgressHook) {
  const steps = [...stepsEl.querySelectorAll('li')];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  const frame = el('rect', { x: 14, y: 14, width: 572, height: 372, class: 'cs-frame', rx: 2 });
  svg.append(frame);
  const centres = [[168, 118], [432, 118], [168, 282], [432, 282]];
  const houses = [];
  const W = 60, H = 78, T = 22, WL = 66, HL = 84;
  centres.forEach(([cx, cy]) => {
    [-1, 1].forEach((side) => {
      // house rectangle (state B) and L-shaped dwelling (state C), both as 6-point outlines
      const x0 = side < 0 ? cx - 72 : cx + 12, y0 = cy - 42;
      const rect = side < 0
        ? [[x0, y0], [x0 + W, y0], [x0 + W, y0 + H / 2], [x0 + W, y0 + H], [x0 + W / 2, y0 + H], [x0, y0 + H]]
        : [[x0 + W, y0], [x0, y0], [x0, y0 + H / 2], [x0, y0 + H], [x0 + W / 2, y0 + H], [x0 + W, y0 + H]];
      const lx = side < 0 ? cx - 76 : cx + 76;
      const d = side < 0 ? 1 : -1;
      const L = [[lx, y0], [lx + d * WL, y0], [lx + d * WL, y0 + T], [lx + d * T, y0 + T], [lx + d * T, y0 + HL], [lx, y0 + HL]];
      const poly = el('polygon', { class: 'cs-house', points: rect.map((q) => q.join(',')).join(' ') });
      poly.style.opacity = 0;
      svg.append(poly);
      houses.push({ poly, rect, L, cx, cy, side });
    });
  });
  const hearts = centres.map(([cx, cy]) => {
    const g = el('g', { transform: `translate(${cx} ${cy + 14}) scale(0)` });
    g.append(el('path', { class: 'cs-heart', d: 'M0 8 C -12 -1, -8 -14, 0 -6 C 8 -14, 12 -1, 0 8 Z' }));
    svg.append(g);
    return { g, cx, cy };
  });

  // 36 people, each assigned to a home
  const dots = [];
  for (let i = 0; i < 36; i++) {
    const h = houses[i % 8];
    const k = Math.floor(i / 8); // 0..4 slot inside the home
    const a = [40 + rnd() * 520, 40 + rnd() * 320];
    const hx0 = Math.min(...h.rect.map((q) => q[0])), hy0 = h.rect[0][1];
    const b = [hx0 + 18 + (k % 2) * 24, hy0 + 16 + Math.floor(k / 2) * 22];
    // inside the L: along the long bar, then the short bar
    const lxMin = Math.min(...h.L.map((q) => q[0]));
    const c = k < 3
      ? [h.side < 0 ? lxMin + 11 : Math.max(...h.L.map((q) => q[0])) - 11, h.L[0][1] + 14 + k * 24]
      : [h.side < 0 ? lxMin + 36 + (k - 3) * 22 : Math.max(...h.L.map((q) => q[0])) - 36 - (k - 3) * 22, h.L[0][1] + 11];
    const dot = el('circle', { class: 'cs-dot', r: 5.2, cx: a[0], cy: a[1] });
    svg.append(dot);
    dots.push({ dot, a, b, c, delay: (i % 9) * 0.012 });
  }

  let lastStep = -1;
  function set(p) {
    const ab = smooth(0.14, 0.46, p);
    const bc = smooth(0.6, 0.86, p);
    houses.forEach((h, i) => {
      const t = bc;
      const pts = h.rect.map((q, j) => [lerp(q[0], h.L[j][0], t), lerp(q[1], h.L[j][1], t)]);
      h.poly.setAttribute('points', pts.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' '));
      h.poly.style.opacity = smooth(0.12 + i * 0.015, 0.32 + i * 0.015, p);
      h.poly.classList.toggle('cs-house--l', t > 0.5);
    });
    dots.forEach((d) => {
      const t1 = smooth(0.16 + d.delay, 0.46 + d.delay, p);
      const t2 = smooth(0.6 + d.delay, 0.86 + d.delay, p);
      const x = lerp(lerp(d.a[0], d.b[0], t1), d.c[0], t2);
      const y = lerp(lerp(d.a[1], d.b[1], t1), d.c[1], t2);
      d.dot.setAttribute('cx', x.toFixed(1)); d.dot.setAttribute('cy', y.toFixed(1));
    });
    hearts.forEach((h, i) => {
      const s = smooth(0.7 + i * 0.03, 0.88 + i * 0.03, p);
      h.g.setAttribute('transform', `translate(${h.cx} ${h.cy + 14}) scale(${(s * 1.6).toFixed(3)})`);
    });
    const step = p < 0.3 ? 0 : p < 0.66 ? 1 : 2;
    if (step !== lastStep) { steps.forEach((s, i) => s.classList.toggle('is-on', i === step)); lastStep = step; }
    onProgressHook && onProgressHook(p);
  }
  set(0);
  return set;
}
