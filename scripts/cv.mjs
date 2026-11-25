// Arabic CV → assets-src/pdf/cv-ar.pdf (copied to docs/files/Osman-Mohamed-CV-AR.pdf by the build).
// Typeset in Chromium so Arabic is shaped and set right-to-left properly; fonts and photo are embedded.
// Optional step, like og.mjs — needs Playwright with Chromium:  node scripts/cv.mjs [--png]
import { createRequire } from 'node:module';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

// Playwright is usually installed globally (resolved through NODE_PATH), which only require() honours
const { chromium } = createRequire(import.meta.url)('playwright');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const NM = path.join(ROOT, 'node_modules');

// static instances only (src/cv/fonts, cut from the variable fonts with fontTools): variable fonts end up as
// Type 3 glyphs in Chromium's PDFs, which readers and applicant-tracking systems cannot search or copy
const ARABIC = 'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC';
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
const face = async (family, weight, file, range, type = 'truetype') => {
  const data = (await fs.readFile(file)).toString('base64');
  return `@font-face{font-family:'${family}';font-style:normal;font-display:block;font-weight:${weight};src:url(data:font/${type === 'truetype' ? 'ttf' : 'woff2'};base64,${data}) format('${type}');unicode-range:${range};}`;
};
const F = path.join(ROOT, 'src/cv/fonts');
const fonts = (await Promise.all([
  ...[400, 500, 600, 700].map((w) => face('Plex', w, path.join(NM, `@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-${w}-normal.woff2`), ARABIC, 'woff2')),
  ...[400, 500, 600].flatMap((w) => [
    face('Archivo', w, path.join(F, `Archivo-${w}-latin.ttf`), LATIN),
    face('Archivo', w, path.join(F, `Archivo-${w}-latin-ext.ttf`), LATIN_EXT),
  ]),
])).join('\n');

const photo = await sharp(path.join(ROOT, 'assets-src/cv/en-001-000.jpg')).resize({ width: 520 }).jpeg({ quality: 88 }).toBuffer();
const tpl = await fs.readFile(path.join(ROOT, 'src/cv/cv-ar.html'), 'utf8');
const html = tpl.replace('{{FONTS}}', () => fonts).replace('{{PHOTO}}', () => `data:image/jpeg;base64,${photo.toString('base64')}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const missing = await page.evaluate(() => ['700 20px Plex', '400 12px Plex', '600 12px Plex', '600 12px Archivo'].filter((f) => !document.fonts.check(f, f.includes('Archivo') ? 'İŞ Aa' : 'عربي')));
if (missing.length) throw new Error(`fonts not loaded: ${missing.join(', ')}`);
const overflow = await page.evaluate(() => {
  const pg = document.querySelector('.page');
  return Math.max(0, pg.scrollHeight - pg.clientHeight);
});
if (overflow) console.warn(`! content overflows the page by ${overflow}px`);
const out = path.join(ROOT, 'assets-src/pdf/cv-ar.pdf');
await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
console.log(`wrote ${path.relative(ROOT, out)}`);
if (process.argv.includes('--png')) {
  const png = path.join(process.env.TMPDIR || '/tmp', 'cv-ar.png');
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.screenshot({ path: png, fullPage: true });
  console.log(`preview ${png}`);
}
await browser.close();
