// Encode every crop into responsive AVIF + WebP sets and write the image manifest used by the templates.
// Sources (best first): assets-src/sr (Real-ESRGAN upscales) > assets-src/cutouts (RGBA) > assets-src/crops.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'assets-src');
const OUT = path.join(ROOT, 'docs/img');
const MANIFEST = path.join(ROOT, 'src/content/images.json');
const STEPS = [480, 800, 1200, 1700, 2400, 3000];
const crops = JSON.parse(await fs.readFile(path.join(SRC, 'crops/crops.json'), 'utf8'));
const extra = { portrait: { kind: 'r', file: path.join(SRC, 'cv/en-001-000.jpg') } };
const only = process.argv.slice(2);
await fs.mkdir(OUT, { recursive: true });

const old = existsSync(MANIFEST) ? JSON.parse(await fs.readFile(MANIFEST, 'utf8')) : {};
const manifest = { ...old };

function pickSource(id) {
  if (extra[id]) {
    const sr = path.join(SRC, 'sr', `${id}.jpg`);
    return existsSync(sr) ? { file: sr, sr: true } : { file: extra[id].file, sr: false };
  }
  const sr = path.join(SRC, 'sr', `${id}.jpg`);
  if (existsSync(sr)) return { file: sr, sr: true };
  const cut = path.join(SRC, 'cutouts', `${id}.png`);
  if (existsSync(cut)) return { file: cut, sr: false, alpha: true };
  return { file: path.join(SRC, 'crops', `${id}.png`), sr: false };
}

// Paper to transparency ("colour to alpha" against white): composited over white it is identical to the
// original, over any tinted page it reads as ink printed on that paper. Works inside sticky/transformed
// containers where CSS blend modes would be isolated.
async function paperToAlpha(input) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const a = Math.max(255 - r, 255 - g, 255 - b);
    if (a <= 3) { out[j + 3] = 0; continue; }
    const k = 255 / a, w = 255 - a;
    out[j] = Math.min(255, Math.max(0, Math.round((r - w) * k)));
    out[j + 1] = Math.min(255, Math.max(0, Math.round((g - w) * k)));
    out[j + 2] = Math.min(255, Math.max(0, Math.round((b - w) * k)));
    out[j + 3] = a;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

const PROC = 'v2';
async function encode(id) {
  const kind = (crops[id] || extra[id]).kind;
  const src = pickSource(id);
  const srcTime = statSync(src.file).mtimeMs;
  const prev = old[id];
  if (prev && prev.proc === PROC && prev.srcTime === srcTime && prev.src === path.relative(ROOT, src.file) && existsSync(path.join(OUT, `${id}-${prev.widths.at(-1)}.webp`))) {
    return prev;
  }
  let base = sharp(src.file, { limitInputPixels: false });
  const meta = await base.metadata();
  let pipeline = base.clone();
  if (kind === 'd' && !src.alpha) {
    // drafting paper to pure white, keep line weight; subtle unsharp for crisp lines
    pipeline = pipeline.linear(255 / 238, 0).sharpen({ sigma: 0.55, m1: 0.4, m2: 1.2 });
  } else if (kind === 'r' && !src.sr) {
    pipeline = pipeline.sharpen({ sigma: 0.7 });
  }
  let buf = await pipeline.toBuffer();
  const paperAlpha = kind === 'd' && !src.alpha;
  if (paperAlpha) buf = await paperToAlpha(buf);
  const W = meta.width, H = meta.height;
  const cap = kind === 'd' ? 2400 : 3000;
  const widths = STEPS.filter((w) => w < Math.min(W, cap) * 0.92);
  widths.push(Math.min(W, cap));
  for (const w of widths) {
    const img = sharp(buf).resize({ width: w, withoutEnlargement: true });
    await img.clone().avif({ quality: kind === 'd' ? 62 : 52, effort: 4, chromaSubsampling: kind === 'd' ? '4:4:4' : '4:2:0' }).toFile(path.join(OUT, `${id}-${w}.avif`));
    await img.clone().webp({ quality: kind === 'd' ? 86 : 80, effort: 5, alphaQuality: 90 }).toFile(path.join(OUT, `${id}-${w}.webp`));
  }
  const lq = await sharp(buf).resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  const stats = await sharp(buf).resize({ width: 32 }).stats();
  const d = stats.dominant;
  return {
    w: W, h: H, kind, widths, alpha: !!src.alpha || paperAlpha, cutout: !!src.alpha, sr: src.sr,
    lqip: `data:image/webp;base64,${lq.toString('base64')}`,
    color: `rgb(${d.r} ${d.g} ${d.b})`,
    src: path.relative(ROOT, src.file), srcTime, proc: PROC,
  };
}

const ids = [...Object.keys(crops), ...Object.keys(extra)].filter((id) => !only.length || only.includes(id));
let n = 0;
const queue = [...ids];
async function worker() {
  while (queue.length) {
    const id = queue.shift();
    manifest[id] = await encode(id);
    n++;
    if (n % 10 === 0) console.log(`${n}/${ids.length}`);
  }
}
await Promise.all([worker(), worker(), worker()]);
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 1));
console.log(`images: ${ids.length} processed → ${path.relative(ROOT, OUT)}`);
