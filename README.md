# Osman Mohamed — Architect

Personal website of architect **Osman Osama Abdalla Mohamed**, in Arabic, English and Turkish.
A single scroll-driven journey through his work: his mall site plan rises into a 3D massing model and falls into blue hour,
then the projects follow as scenes — plans that explode into axonometrics, an elevator ride through the office tower,
drawings that wipe into renders, paper models that turn into a building, and the construction-site record.

## النشر على GitHub Pages (بالعربية)

الموقع جاهز للنشر كما هو: كل ملفاته المبنية موجودة في مجلد `docs/`، والمستودع عام فخدمة Pages مجانية.

1. افتح المستودع على GitHub ← **Settings** ← **Pages**.
2. في **Build and deployment** اختر **Source: Deploy from a branch**.
3. اختر الفرع `ccr-5a3eab91-ubtj83` (أو `main` إذا دُمج فيه لاحقًا) والمجلد **`/docs`** ثم **Save**.
4. بعد دقيقة أو دقيقتين يظهر الموقع على: **https://binaref.github.io/Osman/**
   - العربية: `/Osman/ar/` — التركية: `/Osman/tr/` — الإنجليزية: `/Osman/`.
   - عند أول زيارة للصفحة الرئيسية يتبع الموقع لغة المتصفح (العربية أو التركية).

لتعديل أي نص بأيٍّ من اللغات الثلاث: الملف `src/content/data.js`، ثم `npm run build` وارفع التغييرات.
عند الانتقال إلى نطاق خاص لاحقًا: `SITE_URL=https://your.domain/ npm run build` لتحديث روابط المشاركة والخريطة.

## Publishing on GitHub Pages

Settings → Pages → *Deploy from a branch* → branch `ccr-5a3eab91-ubtj83` (or `main` once merged) → folder `/docs` → Save.
The site is then served at **https://binaref.github.io/Osman/**. The build defaults to that address for canonical, `hreflang`,
social-preview and sitemap URLs; set `SITE_URL` to change it (an empty value emits relative URLs only).

## Run and build

```bash
npm install
npm run build     # renders docs/index.html, docs/ar/, docs/tr/ and bundles JS/CSS/fonts
npm run serve     # http://localhost:4173/
```

`docs/` is the complete static site — commit it after every build; GitHub Pages serves it from `/docs`.

## Where things are

| Path | What |
| --- | --- |
| `src/content/data.js` | Every word on the site in three languages, plus image captions. Facts come only from the CVs and portfolio. |
| `src/templates/page.js` | The page, rendered once per language (true RTL for Arabic). |
| `src/css/` | Design system: tokens and tones (`base.css`), header/menu/viewer (`chrome.css`), hero, projects, people. |
| `src/js/hero3d.js` | Three.js massing model traced from the project's site plan; floors rise as instanced slabs; day → blue hour. |
| `src/js/scenes.js` | All scroll-scrubbed scenes (GSAP ScrollTrigger + Lenis). |
| `src/js/tone.js` | The light cycle: page colour interpolated in OKLab as scenes change. |
| `src/js/viewer.js` | Full-screen drawing viewer (zoom, pan, pinch, keyboard). |
| `assets-src/pages/` | Every page of the portfolio, extracted losslessly from the PDF. |
| `assets-src/pdf/` | The original CVs (EN, TR) and portfolio, also offered as downloads. |

## Image pipeline (only needed when images change)

```bash
python3 scripts/crop.py assets-src/crops            # cut every render/drawing/photo out of the pages
python3 scripts/cutout.py assets-src/crops assets-src/cutouts rcc-base-3 rcc-base-2 rcc-base-1 rcc-mall-g rcc-mall-1 rcc-mall-2 rcc-mall-3
python3 scripts/upscale_batch.py <realesrgan-ncnn models dir>   # optional, local Real-ESRGAN x4 on CPU
node scripts/images.mjs                              # AVIF + WebP at several widths, blur placeholders, manifest
```

The portfolio pages are flattened 72–150 dpi JPEGs, so renders and site photos are upscaled locally with Real-ESRGAN
(`realesrgan-x4plus`, run through the `ncnn` Python package; models from the
[Real-ESRGAN ncnn release](https://github.com/xinntao/Real-ESRGAN/releases/tag/v0.2.5.0)). Each upscale is checked tile by tile
against its source. Drawings are not upscaled; their paper is converted to transparency so the ink prints onto whatever light
the page is in. Python needs `numpy pillow opencv-python-headless scipy ncnn`.

`scripts/og.mjs` renders the social-preview cards (needs Playwright and `npm run serve`).

## Behaviour and accessibility

- Without JavaScript, or with *reduce motion*, every scene becomes a calm static layout; nothing is hidden behind animation.
- Without WebGL the hero shows the project's night render.
- Every image opens in the viewer; buttons, tabs, toggles and the menu work with the keyboard; focus is visible.
- Fonts are self-hosted: Archivo (variable width + weight), Noto Kufi Arabic and IBM Plex Sans Arabic.
