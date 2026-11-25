// Social preview cards (1200×630) per language, rendered with the site's own fonts.
// Optional step — needs Playwright with Chromium and the local preview server running (npm run serve).
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://localhost:4173/';
const OUT = new URL('../docs/img/', import.meta.url).pathname;
const L = {
  en: { name: 'Osman<br>Mohamed', role: 'Architect', line: 'Architecture, from the drawing board to the building site.', dir: 'ltr' },
  tr: { name: 'Osman<br>Mohamed', role: 'Mimar', line: 'Mimarlık, çizim masasından şantiyeye.', dir: 'ltr' },
  ar: { name: 'عثمان<br>محمد', role: 'مهندس معماري', line: 'العمارة، من لوحة الرسم إلى موقع البناء.', dir: 'rtl' },
};
const html = (l) => `<!doctype html><html dir="${L[l].dir}"><head><meta charset="utf-8"><style>
@font-face{font-family:A;src:url(${BASE}assets/fonts/archivo-latin-standard-normal.woff2);font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:A;src:url(${BASE}assets/fonts/archivo-latin-ext-standard-normal.woff2);font-weight:100 900;font-stretch:62% 125%;unicode-range:U+0100-02BA}
@font-face{font-family:K;src:url(${BASE}assets/fonts/noto-kufi-arabic-arabic-wght-normal.woff2);font-weight:100 900}
@font-face{font-family:P;src:url(${BASE}assets/fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2)}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#0E1A2B;color:#F3F5F7;font-family:A,P;overflow:hidden;position:relative}
.img{position:absolute;inset:0 0 0 ${L[l].dir === 'rtl' ? '0' : '38%'};${L[l].dir === 'rtl' ? 'right:38%;' : ''}background:url(${BASE}img/rcc-night-1700.webp) center 30%/cover}
.fade{position:absolute;inset:0;background:linear-gradient(${L[l].dir === 'rtl' ? 'to left' : 'to right'},#0E1A2B 36%,rgba(14,26,43,.0) 70%)}
.t{position:absolute;${L[l].dir === 'rtl' ? 'right' : 'left'}:64px;bottom:64px;width:560px}
h1{font-size:${l === 'ar' ? 104 : 132}px;line-height:${l === 'ar' ? 1.25 : .84};font-stretch:62%;font-weight:860;text-transform:uppercase;letter-spacing:-.015em;font-family:${l === 'ar' ? 'K' : 'A'}}
.r{margin-top:26px;font-size:30px;font-stretch:112%;font-weight:520;font-family:${l === 'ar' ? 'P' : 'A'}}
.l{margin-top:8px;font-size:22px;opacity:.72;font-stretch:94%;font-family:${l === 'ar' ? 'P' : 'A'}}
.d{position:absolute;${L[l].dir === 'rtl' ? 'right' : 'left'}:64px;top:64px;width:120px;height:3px;background:#F1B86A}
</style></head><body><div class="img"></div><div class="fade"></div><div class="d"></div><div class="t"><h1>${L[l].name}</h1><p class="r">${L[l].role}</p><p class="l">${L[l].line}</p></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`${BASE}robots.txt`); // same origin as the fonts (no CORS on font requests)
for (const l of Object.keys(L)) {
  await page.setContent(html(l), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}og-${l}.jpg`, type: 'jpeg', quality: 86 });
  console.log(`og-${l}.jpg`);
}
await browser.close();
