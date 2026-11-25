// Static build: a home page and one page per project in each language (en at /, ar at /ar/, tr at /tr/),
// bundled JS/CSS, fonts, files.
import * as esbuild from 'esbuild';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'docs');
// Published on GitHub Pages; override with SITE_URL=https://your.domain/ (or SITE_URL= to emit relative URLs only)
const SITE_URL = process.env.SITE_URL ?? 'https://binaref.github.io/Osman/';
const watch = process.argv.includes('--watch');

async function buildAssets() {
  await fs.rm(path.join(OUT, 'assets/chunks'), { recursive: true, force: true });
  const common = { bundle: true, minify: true, sourcemap: false, logLevel: 'warning', legalComments: 'none' };
  await esbuild.build({
    ...common,
    entryPoints: [path.join(ROOT, 'src/js/main.js')],
    outdir: path.join(OUT, 'assets'),
    format: 'esm', splitting: true, target: ['es2020', 'safari15'],
    chunkNames: 'chunks/[name]-[hash]', entryNames: '[name]',
  });
  await esbuild.build({
    ...common,
    entryPoints: [path.join(ROOT, 'src/css/main.css')],
    outfile: path.join(OUT, 'assets/main.css'),
    external: ['*.woff2'],
    target: ['chrome100', 'safari15', 'firefox100'],
  });
}

async function copyFonts() {
  const dst = path.join(OUT, 'assets/fonts');
  await fs.mkdir(dst, { recursive: true });
  const nm = path.join(ROOT, 'node_modules');
  const files = [
    '@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2',
    '@fontsource-variable/archivo/files/archivo-latin-ext-standard-normal.woff2',
    '@fontsource-variable/noto-kufi-arabic/files/noto-kufi-arabic-arabic-wght-normal.woff2',
    ...[400, 500, 600].map((w) => `@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-${w}-normal.woff2`),
  ];
  for (const f of files) await fs.copyFile(path.join(nm, f), path.join(dst, path.basename(f)));
}

async function copyFiles() {
  const dst = path.join(OUT, 'files');
  await fs.mkdir(dst, { recursive: true });
  const map = { 'cv-en.pdf': 'Osman-Mohamed-CV-EN.pdf', 'cv-tr.pdf': 'Osman-Mohamed-CV-TR.pdf', 'cv-ar.pdf': 'Osman-Mohamed-CV-AR.pdf', 'portfolio.pdf': 'Osman-Mohamed-Portfolio.pdf' };
  for (const [a, b] of Object.entries(map)) {
    const src = path.join(ROOT, 'assets-src/pdf', a);
    if (existsSync(src)) await fs.copyFile(src, path.join(dst, b));
    else console.warn(`missing ${a}`);
  }
}

async function icons() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0E1A2B"/><g fill="none" stroke="#E8ECEF" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="21" cy="30" r="9.5"/><path d="M36 39.5V20.5l7 10 7-10v19"/></g><path d="M10 48h44" stroke="#F1B86A" stroke-width="3" stroke-linecap="round"/></svg>`;
  await fs.writeFile(path.join(OUT, 'favicon.svg'), svg);
  await sharp(Buffer.from(svg)).resize(32, 32).png().toFile(path.join(OUT, 'favicon-32.png'));
  await sharp(Buffer.from(svg)).resize(180, 180).png().toFile(path.join(OUT, 'apple-touch-icon.png'));
}

async function pages() {
  // fresh import so --watch picks up content/template edits
  const bust = `?t=${Date.now()}`;
  const { renderPage, pathFor } = await import(path.join(ROOT, 'src/templates/site.js') + bust);
  const { LANGS, workOrder } = await import(path.join(ROOT, 'src/content/data.js') + bust);
  const images = JSON.parse(await fs.readFile(path.join(ROOT, 'src/content/images.json'), 'utf8'));
  const css = await fs.readFile(path.join(OUT, 'assets/main.css'));
  const js = await fs.readFile(path.join(OUT, 'assets/main.js'));
  const version = createHash('sha1').update(css).update(js).digest('hex').slice(0, 8);
  const heroChunk = (await fs.readdir(path.join(OUT, 'assets/chunks'))).find((f) => f.startsWith('hero3d-')) || '';
  const keys = [null, ...workOrder];
  // project pages are rebuilt from scratch so renamed slugs leave nothing behind
  for (const lang of LANGS) await fs.rm(path.join(OUT, pathFor(lang, null), 'projects'), { recursive: true, force: true });
  for (const lang of LANGS) {
    for (const key of keys) {
      const html = renderPage({ lang, images, version, siteUrl: SITE_URL, heroChunk, key });
      const dir = path.join(OUT, pathFor(lang, key));
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, 'index.html'), html);
    }
  }
  // works on a custom domain and on a GitHub Pages project site (/<repo>/): the base is resolved at runtime
  const notFound = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — Osman Mohamed</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0E1A2B;color:#E8ECEF;font:17px/1.6 system-ui,sans-serif}main{max-width:34rem;padding:2rem}h1{font-size:2rem;margin:0 0 1rem}a{color:#F1B86A}p{margin:.4rem 0}</style></head><body><main><h1>This page does not exist.</h1><p><a data-to="">Go to the home page</a></p><p dir="rtl" lang="ar">هذه الصفحة غير موجودة. <a data-to="ar/">العودة إلى الصفحة الرئيسية</a></p><p lang="tr">Bu sayfa mevcut değil. <a data-to="tr/">Ana sayfaya dön</a></p></main><script>var s=location.pathname.split('/')[1],b=${SITE_URL ? `'${new URL(SITE_URL).pathname}'` : `(/\\.github\\.io$/.test(location.hostname)&&s?'/'+s+'/':'/')`};document.querySelectorAll('[data-to]').forEach(function(a){a.href=b+a.dataset.to});</script></body></html>`;
  await fs.writeFile(path.join(OUT, '404.html'), notFound);
  await fs.writeFile(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n${SITE_URL ? `Sitemap: ${SITE_URL}sitemap.xml\n` : ''}`);
  if (SITE_URL) {
    const urls = keys.map((key) => {
      const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${pathFor(l, key)}"/>`).join('')
        + `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${pathFor('en', key)}"/>`;
      return LANGS.map((l) => `<url><loc>${SITE_URL}${pathFor(l, key)}</loc>${alts}</url>`).join('');
    }).join('');
    await fs.writeFile(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`);
  }
  await fs.writeFile(path.join(OUT, '.nojekyll'), '');
  return { version, count: LANGS.length * keys.length };
}

async function build() {
  const t0 = Date.now();
  await fs.mkdir(OUT, { recursive: true });
  await Promise.all([buildAssets(), copyFonts(), copyFiles(), icons()]);
  const { version: v, count } = await pages();
  console.log(`built docs/ (${count} pages, v${v}) in ${Date.now() - t0} ms`);
}

await build();
if (watch) {
  const { watch: fsWatch } = await import('node:fs');
  let timer;
  fsWatch(path.join(ROOT, 'src'), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((e) => console.error(e.message)), 120);
  });
  console.log('watching src/ …');
}
