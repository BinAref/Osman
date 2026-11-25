// The site plan of the Residential & Commercial Complex, traced from the architect's drawing (plan pixels),
// rises floor by floor into a massing model, then falls into blue hour with its windows lit.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, Vector2, Vector3, Shape, Path, ShapeGeometry, ExtrudeGeometry,
  MeshStandardMaterial, MeshBasicMaterial, Mesh, InstancedMesh, Object3D, BufferGeometry, Float32BufferAttribute,
  LineBasicMaterial, LineLoop, LineSegments, DirectionalLight, HemisphereLight, PlaneGeometry, SRGBColorSpace,
  NeutralToneMapping, PCFShadowMap, MathUtils, DoubleSide,
} from 'three';

const PX = 0.14;                // metres per plan pixel (towers ≈ 42 m long)
const CENTER = [516, 452];      // plan pixel origin
const w = ([x, y]) => new Vector2((x - CENTER[0]) * PX, -(y - CENTER[1]) * PX); // shape space (y flipped → world z = plan y)

// ── traced plan (pixels of the site-plan crop) ──
const PLOT = [[2, 447], [633, 3], [1013, 522], [655, 838]];
const ARC = { to: [375, 805], ctrl: [515, 745] };
const VOID = [[420, 478], [470, 432], [523, 398], [560, 408], [607, 468], [597, 518], [545, 528], [450, 515]];
const TOWERS = [
  { id: 'apt1', kind: 'apt', pts: [[380, 233], [630, 68], [737, 243], [468, 388]], long: [0, 2], label: [558, 230] },
  { id: 'off', kind: 'off', pts: [[85, 460], [210, 337], [438, 553], [300, 685]], long: [1, 3], label: [262, 510] },
  { id: 'apt2', kind: 'apt', pts: [[585, 548], [848, 385], [947, 527], [700, 715]], long: [0, 2], label: [765, 552] },
];
const ENTRIES = [[500, 805, 0], [354, 200, 2.3], [118, 372, 2.3], [300, 712, 0.75], [820, 300, -2.2], [735, 98, -2.6], [675, 305, -1.6], [790, 392, 1.0], [980, 455, -0.9]];

const PODIUM_LEVELS = 4, PODIUM_FLOOR = 5.0;
const TOWER_LEVELS = 23, TOWER_FLOOR = 3.3;
const PODIUM_H = PODIUM_LEVELS * PODIUM_FLOOR;
const TOP_H = PODIUM_H + TOWER_LEVELS * TOWER_FLOOR;

const C = {
  vellum: new Color('#E3E7E4'), night: new Color('#0E1A2B'), dusk: new Color('#22385A'),
  model: new Color('#EEF0EE'), modelNight: new Color('#142238'), glassNight: new Color('#1A2C45'),
  line: new Color('#22282D'), lineNight: new Color('#6F86A6'), lamp: new Color('#F1B86A'),
  apt: new Color('#9DA6C3'), off: new Color('#A9C49E'), corridor: new Color('#D3D8D6'), band: new Color('#C5CBC9'),
};

const smooth = (a, b, x) => { const t = MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = MathUtils.lerp;

function barrel(t) {
  // rectangle with convex long sides, as in the tower floor plans
  const s = new Shape();
  const P = t.pts.map(w);
  s.moveTo(P[0].x, P[0].y);
  for (let i = 0; i < 4; i++) {
    const a = P[i], b = P[(i + 1) % 4];
    if (t.long.includes(i)) {
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const dir = b.clone().sub(a);
      const n = new Vector2(dir.y, -dir.x).normalize();
      const c = P.reduce((acc, p) => acc.add(p), new Vector2()).multiplyScalar(0.25);
      if (n.dot(mid.clone().sub(c)) < 0) n.negate();
      const ctrl = mid.add(n.multiplyScalar(dir.length() * 0.085));
      s.quadraticCurveTo(ctrl.x, ctrl.y, b.x, b.y);
    } else s.lineTo(b.x, b.y);
  }
  return s;
}

function plotRing(d) {
  // the plot outline offset inward by d metres: straight edges are offset exactly, the concave entry arc is
  // re-fitted between the offset corners (offsetting the sampled arc directly degenerates at its ends)
  const base = [...PLOT, ARC.to].map(w);
  const off = d ? offset(base, d) : base;
  const a = off[3], b = off[4];
  const shift = a.clone().add(b).multiplyScalar(0.5).sub(base[3].clone().add(base[4]).multiplyScalar(0.5));
  const c = w(ARC.ctrl).add(shift);
  const pts = off.slice(0, 4);
  for (let i = 1; i < 16; i++) {
    const t = i / 16, u = 1 - t;
    pts.push(new Vector2(u * u * a.x + 2 * u * t * c.x + t * t * b.x, u * u * a.y + 2 * u * t * c.y + t * t * b.y));
  }
  pts.push(b);
  return pts;
}

function offset(points, d) {
  // inward parallel offset by intersecting shifted edges (points counter-clockwise or clockwise handled by sign)
  const n = points.length;
  let area = 0;
  for (let i = 0; i < n; i++) { const p = points[i], q = points[(i + 1) % n]; area += p.x * q.y - q.x * p.y; }
  const sgn = area > 0 ? 1 : -1;
  const out = [];
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n], p1 = points[i], p2 = points[(i + 1) % n];
    const e1 = p1.clone().sub(p0).normalize(), e2 = p2.clone().sub(p1).normalize();
    const n1 = new Vector2(-e1.y, e1.x).multiplyScalar(sgn * d), n2 = new Vector2(-e2.y, e2.x).multiplyScalar(sgn * d);
    const a1 = p0.clone().add(n1), a2 = p1.clone().add(n2);
    const cross = e1.x * e2.y - e1.y * e2.x;
    if (Math.abs(cross) < 1e-4) { out.push(p1.clone().add(n1)); continue; }
    const t = ((a2.x - a1.x) * e2.y - (a2.y - a1.y) * e2.x) / cross;
    out.push(a1.add(e1.multiplyScalar(t)));
  }
  return out;
}

function clean(pts) {
  const out = [];
  pts.forEach((p) => { if (!out.length || out[out.length - 1].distanceTo(p) > 1e-4) out.push(p); });
  if (out.length > 2 && out[0].distanceTo(out[out.length - 1]) < 1e-4) out.pop();
  return out;
}

const shapeFrom = (pts, holes = []) => {
  const s = new Shape(pts);
  holes.forEach((h) => s.holes.push(new Path(h)));
  return s;
};

function lineLoopFrom(points2, y, mat) {
  const g = new BufferGeometry();
  const arr = [];
  points2.forEach((p) => arr.push(p.x, y, -p.y));
  g.setAttribute('position', new Float32BufferAttribute(arr, 3));
  return new LineLoop(g, mat);
}

// window / LED shader patch shared by tower & podium glass
function glassMaterial(seed, uniforms, podium, center, radius) {
  const m = new MeshStandardMaterial({ color: C.model.clone(), roughness: 0.92, metalness: 0.0, emissive: new Color(0x000000) });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uNight = uniforms.uNight; sh.uniforms.uLit = uniforms.uLit; sh.uniforms.uSeed = { value: seed };
    sh.uniforms.uLamp = { value: new Color('#FFD7A1') }; sh.uniforms.uPodium = { value: podium ? 1 : 0 };
    sh.uniforms.uCenter = { value: center }; sh.uniforms.uRadius = { value: radius };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWp; varying vec3 vWn; varying float vInst;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vec4 wpp = vec4(transformed,1.0);\n vec3 wn = objectNormal;\n #ifdef USE_INSTANCING\n wpp = instanceMatrix * wpp;\n wn = mat3(instanceMatrix) * wn;\n vInst = float(gl_InstanceID);\n #else\n vInst = 0.0;\n #endif\n vWp = (modelMatrix * wpp).xyz;\n vWn = normalize(mat3(modelMatrix) * wn);');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWp; varying vec3 vWn; varying float vInst; uniform float uNight; uniform float uLit; uniform float uSeed; uniform vec3 uLamp; uniform float uPodium; uniform vec2 uCenter; uniform float uRadius;\nfloat h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float ang = atan(vWp.z - uCenter.y, vWp.x - uCenter.x);
        float u = ang * uRadius / (uPodium > 0.5 ? 3.6 : 2.4);
        float col = floor(u);
        float side = 1.0 - step(0.5, abs(vWn.y));
        float mull = smoothstep(0.04, 0.1, fract(u)) * (1.0 - smoothstep(0.9, 0.96, fract(u)));
        float run = floor(col / 7.0);
        float inst = floor(vInst + 0.5); // interpolated varyings drift by ~1e-4: round before hashing
        float r = h21(vec2(run + uSeed * 17.0, inst * 3.1 + uSeed));
        float r2 = h21(vec2(col * 1.7 + uSeed, inst + 11.0));
        float lit = step(r, uLit) * step(0.12, r2);
        if (uPodium > 0.5) lit = step(0.18, r2) * smoothstep(0.0, 0.25, uLit);
        float warm = mix(0.5, 1.0, h21(vec2(col, inst + 7.0)));
        totalEmissiveRadiance += uLamp * lit * mull * warm * side * uNight * (uPodium > 0.5 ? 0.85 : 0.62);
        vec3 sky = mix(vec3(0.03, 0.06, 0.12), vec3(0.16, 0.24, 0.4), smoothstep(10.0, 110.0, vWp.y));
        diffuseColor.rgb = mix(diffuseColor.rgb * (1.0 - 0.06 * (1.0 - mull) * side), sky * (0.55 + 0.45 * mull), uNight * side);`);
  };
  return m;
}

export function createHero(canvas, { mobile, rtl = false }) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  scene.background = C.vellum.clone();
  scene.fog = new Fog(C.vellum.clone(), 600, 1500);
  const camera = new PerspectiveCamera(30, 1, 1, 4000);

  const uniforms = { uNight: { value: 0 }, uLit: { value: 0 } };

  // lights
  const hemi = new HemisphereLight(0xffffff, 0xc7ccca, 1.15);
  scene.add(hemi);
  const sun = new DirectionalLight(0xffffff, 2.1);
  sun.position.set(-160, 220, 120);
  sun.castShadow = !mobile;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -150, right: 150, top: 150, bottom: -150, near: 10, far: 700 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.6;
  scene.add(sun);

  // ground + drafting grid
  const groundMat = new MeshStandardMaterial({ color: C.vellum.clone(), roughness: 1 });
  const ground = new Mesh(new PlaneGeometry(4000, 4000), groundMat);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const gridMat = new LineBasicMaterial({ color: C.line.clone(), transparent: true, opacity: 0.07 });
  {
    const g = new BufferGeometry(); const a = []; const S = 12, N = 60;
    for (let i = -N; i <= N; i++) { a.push(i * S, 0.01, -N * S, i * S, 0.01, N * S, -N * S, 0.01, i * S, N * S, 0.01, i * S); }
    g.setAttribute('position', new Float32BufferAttribute(a, 3));
    const grid = new LineSegments(g, gridMat); grid.rotation.y = 0.58; scene.add(grid);
  }

  // plot: land-border band (outer) and podium footprint (inner, with the void)
  const BAND = 45 * PX;
  const outer = plotRing(0);
  const inner = plotRing(BAND);
  const voidPts = VOID.map(w);
  const bandMat = new MeshStandardMaterial({ color: C.band.clone(), roughness: 1, transparent: true, opacity: 0 });
  const band = new Mesh(new ShapeGeometry(shapeFrom(outer, [inner.slice().reverse()])), bandMat);
  band.rotation.x = -Math.PI / 2; band.position.y = 0.05; band.receiveShadow = true; scene.add(band);
  const floorMat = new MeshStandardMaterial({ color: C.corridor.clone(), roughness: 1, transparent: true, opacity: 0 });
  const floorPlan = new Mesh(new ShapeGeometry(shapeFrom(inner, [voidPts.slice().reverse()])), floorMat);
  floorPlan.rotation.x = -Math.PI / 2; floorPlan.position.y = 0.06; floorPlan.receiveShadow = true; scene.add(floorPlan);

  // drawn lines (the plan being drafted)
  const lineMat = new LineBasicMaterial({ color: C.line.clone(), transparent: true, opacity: 0.9 });
  const lines = [lineLoopFrom(outer, 0.12, lineMat), lineLoopFrom(inner, 0.12, lineMat), lineLoopFrom(voidPts, 0.12, lineMat)];
  const towerShapes = TOWERS.map(barrel);
  towerShapes.forEach((s) => lines.push(lineLoopFrom(clean(s.getPoints(14)), 0.14, lineMat)));
  lines.forEach((l) => { l.userData.n = l.geometry.attributes.position.count; l.geometry.setDrawRange(0, 0); scene.add(l); });
  // entry arrows
  {
    const g = new BufferGeometry(); const a = [];
    ENTRIES.forEach(([x, y, rot]) => {
      const c = w([x, y]); const s = 2.6;
      const pts = [[0, -s], [-s * 0.8, s * 0.7], [s * 0.8, s * 0.7]].map(([px, py]) => {
        const cx = px * Math.cos(rot) - py * Math.sin(rot), cy = px * Math.sin(rot) + py * Math.cos(rot);
        return [c.x + cx, c.y - cy];
      });
      for (let i = 0; i < 3; i++) { const p = pts[i], q = pts[(i + 1) % 3]; a.push(p[0], 0.15, -p[1], q[0], 0.15, -q[1]); }
    });
    g.setAttribute('position', new Float32BufferAttribute(a, 3));
    const arrows = new LineSegments(g, lineMat); arrows.userData.n = a.length / 3; g.setDrawRange(0, 0); lines.push(arrows); scene.add(arrows);
  }

  // plan fills: tower footprints in the drawing's legend colours — they rise as roofs
  const capMats = TOWERS.map((t) => new MeshStandardMaterial({ color: (t.kind === 'apt' ? C.apt : C.off).clone(), roughness: 0.95, transparent: true, opacity: 0, side: DoubleSide }));
  const caps = TOWERS.map((t, i) => {
    const m = new Mesh(new ShapeGeometry(towerShapes[i], 12), capMats[i]);
    m.rotation.x = -Math.PI / 2; m.position.y = 0.2; scene.add(m); return m;
  });

  // massing — podium floors and tower floors as instanced slabs (glass band + projecting slab edge)
  const dummy = new Object3D();
  const podiumShape = shapeFrom(inner, [voidPts.slice().reverse()]);
  const podGlass = glassMaterial(3, uniforms, true, new Vector2(w([515, 466]).x, -w([515, 466]).y), 52);
  const podGeo = new ExtrudeGeometry(podiumShape, { depth: PODIUM_FLOOR - 0.9, bevelEnabled: false, curveSegments: 12 });
  podGeo.rotateX(-Math.PI / 2);
  const podSlabGeo = new ExtrudeGeometry(shapeFrom(plotRing(BAND - 0.5), [offset(voidPts, 0.5).slice().reverse()]), { depth: 0.9, bevelEnabled: false, curveSegments: 12 });
  podSlabGeo.rotateX(-Math.PI / 2);
  const slabMat = new MeshStandardMaterial({ color: C.model.clone(), roughness: 0.85, emissive: new Color(0x000000) });
  const podium = new InstancedMesh(podGeo, podGlass, PODIUM_LEVELS);
  const podiumSlabs = new InstancedMesh(podSlabGeo, slabMat, PODIUM_LEVELS);
  for (let i = 0; i < PODIUM_LEVELS; i++) {
    dummy.position.set(0, i * PODIUM_FLOOR, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix();
    podium.setMatrixAt(i, dummy.matrix);
    dummy.position.set(0, i * PODIUM_FLOOR + PODIUM_FLOOR - 0.9, 0); dummy.updateMatrix(); podiumSlabs.setMatrixAt(i, dummy.matrix);
  }
  [podium, podiumSlabs].forEach((m) => { m.castShadow = m.receiveShadow = true; m.count = 0; scene.add(m); });

  const towers = TOWERS.map((t, i) => {
    const glassGeo = new ExtrudeGeometry(towerShapes[i], { depth: TOWER_FLOOR - 0.42, bevelEnabled: false, curveSegments: 14 });
    glassGeo.rotateX(-Math.PI / 2);
    const slabShape = new Shape(offset(clean(towerShapes[i].getPoints(14)), -0.35));
    const slabGeo = new ExtrudeGeometry(slabShape, { depth: 0.42, bevelEnabled: false });
    slabGeo.rotateX(-Math.PI / 2);
    const cen = w(t.pts.reduce((a, q) => [a[0] + q[0] / 4, a[1] + q[1] / 4], [0, 0]));
    const glass = new InstancedMesh(glassGeo, glassMaterial(i + 1, uniforms, false, new Vector2(cen.x, -cen.y), 17), TOWER_LEVELS);
    const slabs = new InstancedMesh(slabGeo, slabMat, TOWER_LEVELS);
    [glass, slabs].forEach((m) => { m.castShadow = m.receiveShadow = true; m.count = 0; scene.add(m); });
    return { glass, slabs };
  });

  // LED lines at night: thin emissive rings at each floor edge (one merged geometry per building)
  const ledMat = new LineBasicMaterial({ color: C.lamp.clone(), transparent: true, opacity: 0 });
  const ledGroups = TOWERS.map((t, i) => {
    const pts = offset(clean(towerShapes[i].getPoints(14)), -0.42);
    const g = new BufferGeometry(); const a = [];
    for (let f = 0; f < TOWER_LEVELS; f++) {
      const y = PODIUM_H + f * TOWER_FLOOR + TOWER_FLOOR - 0.06;
      for (let k = 0; k < pts.length; k++) { const p = pts[k], q = pts[(k + 1) % pts.length]; a.push(p.x, y, -p.y, q.x, y, -q.y); }
    }
    g.setAttribute('position', new Float32BufferAttribute(a, 3));
    const ls = new LineSegments(g, ledMat); ls.userData.per = pts.length * 2; g.setDrawRange(0, 0); scene.add(ls); return ls;
  });
  const podLed = (() => {
    const pts = plotRing(BAND - 0.56); const g = new BufferGeometry(); const a = [];
    for (let f = 0; f < PODIUM_LEVELS; f++) {
      const y = f * PODIUM_FLOOR + PODIUM_FLOOR - 0.05;
      for (let k = 0; k < pts.length; k++) { const p = pts[k], q = pts[(k + 1) % pts.length]; a.push(p.x, y, -p.y, q.x, y, -q.y); }
    }
    g.setAttribute('position', new Float32BufferAttribute(a, 3));
    const ls = new LineSegments(g, ledMat); scene.add(ls); return ls;
  })();

  // ── camera path (spherical around a moving target) ──
  const keys = [
    { p: 0.0, phi: 0.6, theta: 0, rp: 1, rb: 0, ty: 0, tx: 'shift', tz: 10 },
    { p: 0.12, phi: 2, theta: 0, rp: 1, rb: 0, ty: 0, tx: 'shift', tz: 10 },
    { p: 0.46, phi: 50, theta: -36, rp: 0, rb: 2.15, ty: 40, tx: -2, tz: -4 },
    { p: 0.7, phi: 66, theta: -16, rp: 0, rb: 1.6, ty: 44, tx: 0, tz: -6 },
    { p: 0.9, phi: 95, theta: 0, rp: 0, rb: 1.38, ty: 46, tx: 0, tz: -8 },
    { p: 1.0, phi: 96, theta: 0, rp: 0, rb: 1.32, ty: 47, tx: 0, tz: -8 },
  ];
  let fitR = 300, fitB = 200, planShift = 0;
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  const target = new Vector3();
  function cameraAt(p) {
    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1].p) i++;
    const a = keys[i], b = keys[i + 1];
    const t = smooth(a.p, b.p, p);
    // pointer: a few degrees of orbit once the plan has become a volume
    const look = smooth(0.12, 0.22, p);
    const phi = MathUtils.degToRad(lerp(a.phi, b.phi, t) + ptr.y * 2.2 * look);
    const theta = MathUtils.degToRad(lerp(a.theta, b.theta, t) + ptr.x * 5 * look);
    const r = fitR * lerp(a.rp, b.rp, t) + fitB * lerp(a.rb, b.rb, t);
    const ax = a.tx === 'shift' ? planShift : a.tx, bx = b.tx === 'shift' ? planShift : b.tx;
    target.set(lerp(ax, bx, t), lerp(a.ty, b.ty, t), lerp(a.tz, b.tz, t));
    camera.position.set(target.x + r * Math.sin(phi) * Math.sin(theta), target.y + r * Math.cos(phi), target.z + r * Math.sin(phi) * Math.cos(theta));
    camera.up.set(0, 1, 0);
    camera.lookAt(target);
  }

  function resize() {
    const wv = canvas.clientWidth, hv = canvas.clientHeight;
    renderer.setSize(wv, hv, false);
    camera.aspect = wv / hv;
    camera.fov = camera.aspect < 0.8 ? 38 : 30;
    camera.updateProjectionMatrix();
    // fit the 150 m plot in view from above with margins
    const vFov = MathUtils.degToRad(camera.fov);
    const needH = 170, needW = 190;
    const rH = needH / (2 * Math.tan(vFov / 2));
    const rW = needW / (2 * Math.tan(vFov / 2) * camera.aspect);
    fitR = Math.max(rH, rW) * (camera.aspect < 0.8 ? 1.0 : 1.08);
    fitB = (112 / (2 * Math.tan(vFov / 2))) * (camera.aspect < 0.8 ? 1.25 : 1);
    // on wide screens the plan sits beside the name (name at the start edge), on tall screens above it
    planShift = camera.aspect > 1.1 ? (rtl ? 1 : -1) * Math.min(48, 26 * camera.aspect) : 0;
  }

  // ── state ──
  let progress = 0, intro = 0, dirty = true;
  const bg = new Color(), tmp = new Color();
  function apply() {
    const p = progress;
    // drafting: lines draw in on load (intro), extrusion with scroll
    lines.forEach((l) => l.geometry.setDrawRange(0, Math.floor(l.userData.n * intro)));
    const grow = smooth(0.1, 0.44, p);
    const night = smooth(0.46, 0.66, p);
    uniforms.uNight.value = night;
    uniforms.uLit.value = smooth(0.5, 0.76, p) * 0.24;

    // plan fills fade in with the drawing, then hand over to the volumes
    const fill = intro * (1 - smooth(0.12, 0.3, p));
    bandMat.opacity = Math.max(0.55 * intro, 0);
    floorMat.opacity = fill * 0.9;
    capMats.forEach((m) => { m.opacity = Math.min(1, intro); });

    // podium rises first, then the towers floor by floor
    const podGrow = smooth(0.1, 0.2, p) * PODIUM_LEVELS;
    setInstances(podium, podiumSlabs, podGrow, PODIUM_LEVELS, PODIUM_FLOOR, 0, 0.9);
    towers.forEach((tw, i) => {
      const g = MathUtils.clamp((grow - 0.18 - i * 0.04) / (0.8 - i * 0.04), 0, 1) * TOWER_LEVELS;
      setInstances(tw.glass, tw.slabs, g, TOWER_LEVELS, TOWER_FLOOR, PODIUM_H, 0.42);
      const hTop = podGrow >= PODIUM_LEVELS - 0.001 ? PODIUM_H + g * TOWER_FLOOR : podGrow * PODIUM_FLOOR;
      caps[i].position.y = Math.max(0.2, hTop + 0.05);
      ledGroups[i].geometry.setDrawRange(0, Math.floor(Math.min(g, TOWER_LEVELS)) * ledGroups[i].userData.per);
    });
    // colours: day → blue hour
    bg.copy(C.vellum).lerp(C.dusk, smooth(0.44, 0.56, p)).lerp(C.night, smooth(0.52, 0.68, p));
    scene.background.copy(bg); scene.fog.color.copy(bg); groundMat.color.copy(bg);
    gridMat.color.copy(C.line).lerp(C.lineNight, night); gridMat.opacity = lerp(0.07, 0.1, night);
    lineMat.color.copy(C.line).lerp(C.lineNight, night); lineMat.opacity = lerp(0.9, 0.0, smooth(0.3, 0.6, p));
    bandMat.color.copy(C.band).lerp(tmp.set('#1B2A41'), night);
    slabMat.color.copy(C.model).lerp(tmp.set('#2A3A52'), night);
    slabMat.emissive.setRGB(0, 0, 0);
    podGlass.color.copy(C.model).lerp(C.glassNight, night);
    towers.forEach((tw) => tw.glass.material.color.copy(C.model).lerp(C.glassNight, night));
    capMats.forEach((m, i) => m.color.copy(TOWERS[i].kind === 'apt' ? C.apt : C.off).lerp(tmp.set('#24344D'), night));
    ledMat.opacity = night * 0.75;
    hemi.intensity = lerp(1.15, 0.5, night);
    hemi.color.set('#ffffff').lerp(tmp.set('#5A76A8'), night);
    hemi.groundColor.set('#c7ccca').lerp(tmp.set('#0E1A2B'), night);
    sun.intensity = lerp(2.1, 0.12, night);
    renderer.toneMappingExposure = lerp(1.0, 1.25, night);
    cameraAt(p);
    dirty = true;
  }

  function setInstances(glass, slabs, g, levels, fh, base, slabH) {
    const full = Math.floor(g), part = g - full;
    const count = Math.min(levels, full + (part > 0.001 ? 1 : 0));
    for (let f = 0; f < count; f++) {
      const s = f < full ? 1 : part;
      dummy.position.set(0, base + f * fh, 0); dummy.scale.set(1, Math.max(0.001, s), 1); dummy.updateMatrix();
      glass.setMatrixAt(f, dummy.matrix);
      dummy.position.set(0, base + f * fh + (fh - slabH) * s, 0); dummy.scale.set(1, Math.max(0.001, s), 1); dummy.updateMatrix();
      slabs.setMatrixAt(f, dummy.matrix);
    }
    glass.count = slabs.count = count;
    glass.instanceMatrix.needsUpdate = slabs.instanceMatrix.needsUpdate = true;
  }

  const labelPts = {
    apt1: w(TOWERS[0].label), off: w(TOWERS[1].label), apt2: w(TOWERS[2].label), void: w([515, 466]), entry: w([500, 852]),
  };
  const v = new Vector3();
  function labelScreen(key) {
    const p = labelPts[key];
    v.set(p.x, 1, -p.y).project(camera);
    return [(v.x * 0.5 + 0.5) * canvas.clientWidth, (-v.y * 0.5 + 0.5) * canvas.clientHeight];
  }

  let raf = 0, running = true, lastIntroT = 0;
  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (intro < 1) {
      if (!lastIntroT) lastIntroT = t;
      intro = Math.min(1, (t - lastIntroT) / 1900);
      apply();
    }
    if (Math.abs(ptr.tx - ptr.x) + Math.abs(ptr.ty - ptr.y) > 1e-4) {
      ptr.x += (ptr.tx - ptr.x) * 0.06; ptr.y += (ptr.ty - ptr.y) * 0.06;
      cameraAt(progress); dirty = true;
    }
    if (dirty && running) { renderer.render(scene, camera); dirty = false; }
  }

  resize(); apply();
  raf = requestAnimationFrame(loop);

  return {
    setProgress(p) { if (Math.abs(p - progress) > 1e-5) { progress = p; apply(); } },
    setPointer(x, y) { ptr.tx = x; ptr.ty = y; },
    resize() { resize(); apply(); },
    labelScreen,
    setRunning(r) { running = r; if (r) dirty = true; },
    get introDone() { return intro >= 1; },
    dispose() { cancelAnimationFrame(raf); renderer.dispose(); },
  };
}
