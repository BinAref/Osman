// Renders one complete, static HTML page per language. Motion is layered on by JS; without it the page reads top to bottom.
import { LANGS, LANG_META, person, ui, captions, projects as P, workOrder, indexMeta, indexThumb, practice } from '../content/data.js';

export function renderPage({ lang, images, version, siteUrl = '', heroChunk = '' }) {
  const meta = LANG_META[lang];
  const base = lang === 'en' ? './' : '../';
  const t = (v) => (v == null ? '' : typeof v === 'string' || typeof v === 'number' ? String(v) : v[lang]);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const cap = (id) => esc(t(captions[id] || ''));
  const href = (to) => (lang === 'en' ? (to === 'en' ? './' : `${LANG_META[to].path}`) : to === 'en' ? '../' : `../${LANG_META[to].path}`);
  const num = (n) => Number(n).toLocaleString(lang === 'ar' ? 'en-US' : lang === 'tr' ? 'tr-TR' : 'en-US');

  // ---------- images ----------
  function srcset(id, fmt) {
    const im = images[id];
    return im.widths.map((w) => `${base}img/${id}-${w}.${fmt} ${w}w`).join(', ');
  }
  function pic(id, { sizes = '100vw', cls = '', eager = false, alt = null, high = false, decorative = false } = {}) {
    const im = images[id];
    if (!im) throw new Error(`missing image ${id}`);
    const mid = im.widths.find((w) => w >= 1200) || im.widths.at(-1);
    const style = im.alpha ? `--ar:${im.w}/${im.h}` : `--ar:${im.w}/${im.h};--lqip:url(${im.lqip});--dom:${im.color}`;
    const a = decorative ? '' : esc(alt ?? t(captions[id] || ''));
    return `<picture class="pic${im.alpha ? ' pic--alpha' : ''}${im.kind === 'd' ? ' pic--drawing' : ''}${im.cutout ? ' pic--sheet' : ''} ${cls}" style="${style}">`
      + `<source type="image/avif" srcset="${srcset(id, 'avif')}" sizes="${sizes}">`
      + `<source type="image/webp" srcset="${srcset(id, 'webp')}" sizes="${sizes}">`
      + `<img src="${base}img/${id}-${mid}.webp" width="${im.w}" height="${im.h}" alt="${a}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${high ? ' fetchpriority="high"' : ''}>`
      + `</picture>`;
  }
  function zoom(id, { group = 'all', sizes, cls = '', eager = false, label = null } = {}) {
    const im = images[id];
    const full = `${base}img/${id}-${im.widths.at(-1)}.webp`;
    const kindLabel = im.kind === 'd' ? t(ui.viewer.open) : t(ui.viewer.openImage);
    return `<button type="button" class="zoom ${cls}" data-view="${id}" data-group="${group}" data-full="${full}" data-w="${im.w}" data-h="${im.h}" data-kind="${im.kind}" data-caption="${cap(id)}" aria-label="${esc(kindLabel)}: ${esc(label ?? t(captions[id]))}">`
      + pic(id, { sizes, eager })
      + `<span class="zoom__icon" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3 8V3h5M17 12v5h-5M3 3l5.5 5.5M17 17l-5.5-5.5"/></svg></span>`
      + `</button>`;
  }
  function fig(id, { group, sizes, cls = '', capCls = '', eager = false, note = '' } = {}) {
    return `<figure class="fig ${cls}">${zoom(id, { group, sizes, eager })}<figcaption class="fig__cap ${capCls}">${cap(id)}${note}</figcaption></figure>`;
  }
  const facts = (list) => `<dl class="facts">${list.map(([k, v]) => `<div class="facts__row"><dt>${esc(t(ui.facts[k]))}</dt><dd>${esc(t(v))}</dd></div>`).join('')}</dl>`;
  const bdi = (s) => `<bdi>${esc(s)}</bdi>`;

  // ---------- small svg vocabulary ----------
  const mark = `<svg class="mark" viewBox="0 0 34 24" aria-hidden="true"><circle cx="8.5" cy="12" r="6.2"/><path d="M18 18.5V5.5l5 7 5-7v13"/><path class="mark__datum" d="M1 22.5h32"/></svg>`;
  const levelMark = (val) => `<svg class="lvl" viewBox="0 0 14 10" aria-hidden="true"><path d="M1 1h12L7 9z"/></svg><span class="lvl__val">${esc(val)}</span>`;

  // ---------- header + menu ----------
  const navItems = [['work', '#work'], ['practice', '#practice'], ['about', '#about'], ['contact', '#contact']];
  const langLinks = (cls) => `<ul class="langs ${cls}">${LANGS.map((l) => `<li><a href="${href(l)}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="page"' : ''} data-lang-link="${l}"><span class="langs__short" aria-hidden="true">${LANG_META[l].short}</span><span class="langs__full">${LANG_META[l].name}</span></a></li>`).join('')}</ul>`;

  const header = `
<a class="skip" href="#main">${esc(t(ui.skip))}</a>
<header class="hud" data-hud>
  <a class="hud__home" href="#top">${mark}<span class="hud__name">${esc(t(person.name))}</span></a>
  <p class="hud__now" aria-hidden="true"><span data-now></span></p>
  <nav class="hud__nav" aria-label="${esc(t(ui.menu))}">
    ${navItems.map(([k, h]) => `<a href="${h}">${esc(t(ui.nav[k]))}</a>`).join('')}
  </nav>
  <nav class="hud__langs" aria-label="${esc(t(ui.language))}">${langLinks('langs--hud')}</nav>
  <button type="button" class="hud__menu" aria-expanded="false" aria-controls="menu" data-menu-open><span class="hud__menu-lines" aria-hidden="true"></span><span class="hud__menu-label">${esc(t(ui.menu))}</span></button>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="${esc(t(ui.menu))}" hidden data-menu>
  <div class="menu__sheet">
    <div class="menu__top">
      <a class="hud__home" href="#top" data-menu-link>${mark}<span class="hud__name">${esc(t(person.name))}</span></a>
      <button type="button" class="menu__close" data-menu-close>${esc(t(ui.close))}</button>
    </div>
    <div class="menu__body">
      <section class="menu__index" aria-labelledby="menu-index-h">
        <h2 class="menu__h" id="menu-index-h">${esc(t(ui.index))}</h2>
        <ol class="menu__list">
          ${workOrder.map((k) => `<li><a href="#${k}" data-menu-link data-thumb="${k}"><span class="menu__title">${esc(t(P[k].title))}</span><span class="menu__meta">${esc(t(indexMeta[k]))}</span></a></li>`).join('')}
        </ol>
      </section>
      <div class="menu__side">
        <figure class="menu__thumbs" aria-hidden="true">${workOrder.map((k, i) => `<div class="menu__thumb${i === 0 ? ' is-on' : ''}" data-thumb-for="${k}">${pic(indexThumb[k], { sizes: '30vw', decorative: true })}</div>`).join('')}</figure>
        <ul class="menu__nav">${navItems.slice(1).map(([k, h]) => `<li><a href="${h}" data-menu-link>${esc(t(ui.nav[k]))}</a></li>`).join('')}</ul>
        <nav aria-label="${esc(t(ui.language))}">${langLinks('langs--menu')}</nav>
        <p class="menu__contact"><a href="mailto:${person.email}">${person.email}</a><br><a href="tel:${person.phoneHref}" dir="ltr">${person.phone}</a></p>
      </div>
    </div>
  </div>
</div>`;

  // ---------- hero (site plan → massing → night → render) ----------
  const nameLines = t(person.name).split(' ');
  const R = P.rcc;
  const hero = `
<section class="hero" id="top" data-hero data-tone="night" aria-labelledby="hero-name">
  <div class="hero__track">
    <div class="hero__stage">
      <div class="hero__fallback">${pic('rcc-night', { sizes: '100vw', decorative: true, eager: true })}</div>
      <canvas class="hero__canvas" aria-hidden="true"></canvas>
      <div class="hero__labels" aria-hidden="true">
        <span class="hero__label" data-label="apt1">${esc(t(ui.planLabels.apartments))}</span>
        <span class="hero__label" data-label="apt2">${esc(t(ui.planLabels.apartments))}</span>
        <span class="hero__label" data-label="off">${esc(t(ui.planLabels.offices))}</span>
        <span class="hero__label hero__label--void" data-label="void">${esc(t(ui.planLabels.mall))}</span>
        <span class="hero__label hero__label--entry" data-label="entry">${esc(t(ui.planLabels.entry))}</span>
      </div>
      <div class="hero__render" aria-hidden="true">${pic('rcc-night', { sizes: '100vw', decorative: true })}</div>
      <div class="hero__shade" aria-hidden="true"></div>

      <div class="hero__intro" data-hero-intro>
        <h1 class="hero__name" id="hero-name">${nameLines.map((w) => `<span class="hero__word"><span>${esc(w)}</span></span>`).join('')}</h1>
        <div class="hero__byline">
          <p class="hero__role">${esc(t(person.role))}</p>
          <p class="hero__tagline">${esc(t(person.tagline))}</p>
        </div>
      </div>

      <div class="hero__story" data-hero-story>
        <p class="hero__statement">${esc(t(person.summary))}</p>
      </div>
      <ol class="hero__steps" data-hero-steps>
        ${ui.heroSteps.map((s, i) => `<li class="hero__step${i === 0 ? ' is-on' : ''}"><span class="hero__step-n">${i + 1}</span><span class="hero__step-t">${esc(t(s))}</span><span class="hero__step-c">${esc(t(ui.heroCaptions[i]))}</span></li>`).join('')}
      </ol>
      <p class="hero__note" data-hero-note>${esc(t(ui.heroNote))}</p>
      <p class="hero__cue" data-hero-cue><span>${esc(t(ui.scrollCue))}</span><svg viewBox="0 0 12 40" aria-hidden="true"><path d="M6 0v38M1 33l5 6 5-6"/></svg></p>
    </div>
  </div>
</section>`;

  // ---------- 01 Residential & Commercial Complex ----------
  const rcc = `
<article class="project project--rcc" id="rcc" data-tone="night" aria-labelledby="rcc-title">
  <header class="rcc-head" id="work" data-rcc-head>
    <h2 class="project__title" id="rcc-title">${esc(t(R.title))}</h2>
    <p class="project__summary">${esc(t(R.summary))}</p>
  </header>
  <section class="rcc-role">
    <div class="rcc-role__text">
      <p class="rcc-role__quote">${esc(t(R.role))}</p>
    </div>
    <div class="rcc-role__facts">${facts(R.facts)}</div>
  </section>

  <section class="stack" data-stack aria-labelledby="stack-h">
    <div class="stack__track">
      <div class="stack__stage">
        <header class="stack__head">
          <h3 class="h3" id="stack-h">${esc(t(R.mallTitle))}</h3>
          <p class="lead">${esc(t(R.mallIntro))}</p>
        </header>
        <div class="stack__view" aria-hidden="true">
          <div class="stack__model" data-stack-model>
            ${R.mallLevels.map((lv, i) => `<div class="stack__level" data-level="${i}" style="--i:${i}">${pic(lv.img, { sizes: '(min-width: 900px) 46vw, 90vw', decorative: true })}<span class="stack__tag">${esc(lv.tag)}</span></div>`).join('')}
          </div>
        </div>
        <ol class="stack__list" data-stack-list>
          ${R.mallLevels.map((lv, i) => `<li class="stack__item" data-level-item="${i}"><button type="button" class="stack__btn" data-view="${lv.img}" data-group="mall" data-full="${base}img/${lv.img}-${images[lv.img].widths.at(-1)}.webp" data-w="${images[lv.img].w}" data-h="${images[lv.img].h}" data-kind="d" data-caption="${cap(lv.img)}"><span class="stack__btn-tag">${esc(lv.tag)}</span><span class="stack__btn-name">${esc(t(lv.name))}</span><span class="stack__btn-text">${esc(t(lv.text))}</span></button></li>`).join('')}
        </ol>
        <ul class="legend" aria-label="${esc(t(ui.drawings))}">${R.legend.map(([c, n]) => `<li><span class="legend__swatch" style="--c:${c}"></span>${esc(t(n))}</li>`).join('')}</ul>
      </div>
    </div>
  </section>

  <section class="floors" data-floors aria-labelledby="floors-h">
    <div class="floors__track">
      <div class="floors__stage">
        <header class="floors__head">
          <h3 class="h3" id="floors-h">${esc(t(R.officeTitle))}</h3>
          <p class="lead">${esc(t(R.officeIntro))}</p>
        </header>
        <div class="floors__tower" role="group" aria-label="${esc(t(ui.floors))}">
          ${Array.from({ length: 23 }, (_, f) => 22 - f).map((f) => {
            const g = R.officeFloors.findIndex((o) => f >= o.from && f <= o.to);
            return `<button type="button" class="floors__bar" data-floor="${f}" data-group-i="${g}" aria-label="${f === 0 ? esc(t(ui.ground)) : `${esc(t(ui.floor))} ${f}`}"><span>${f === 0 ? (lang === 'ar' ? 'أ' : lang === 'tr' ? 'Z' : 'G') : f}</span></button>`;
          }).join('')}
        </div>
        <div class="floors__readout" aria-live="polite">
          <p class="floors__num"><span class="floors__num-label">${esc(t(ui.floor))}</span><span class="floors__num-val" data-floor-num>${lang === 'ar' ? 'أرضي' : lang === 'tr' ? 'Zemin' : 'Ground'}</span></p>
          <p class="floors__text" data-floor-text>${esc(t(R.officeFloors[0].text))}</p>
        </div>
        <div class="floors__plans">
          ${R.officeFloors.map((o, i) => `<figure class="floors__plan${i === 0 ? ' is-on' : ''}" data-floor-plan="${i}" data-from="${o.from}" data-to="${o.to}" data-text="${esc(t(o.text))}">${zoom(o.img, { group: 'office', sizes: '(min-width: 900px) 55vw, 92vw' })}<figcaption class="fig__cap"><span class="floors__range">${o.from === o.to ? (o.from === 0 ? esc(t(ui.ground)) : `${esc(t(ui.floor))} ${o.from}`) : `${esc(t(ui.floors))} ${o.from}–${o.to}`}</span><span class="floors__ftext">${esc(t(o.text))}</span></figcaption></figure>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <section class="apts" aria-labelledby="apts-h">
    <header class="apts__head">
      <h3 class="h3" id="apts-h">${esc(t(R.aptTitle))}</h3>
      <p class="lead">${esc(t(R.aptIntro))}</p>
      <ul class="unitkey">${R.unitKey.map(([c, n]) => `<li><span class="legend__swatch" style="--c:${c}"></span><bdi>${n}</bdi></li>`).join('')}</ul>
    </header>
    <div class="apts__tabs" role="tablist" aria-label="${esc(t(R.aptTitle))}">
      ${R.aptSets.map((s, i) => `<button type="button" role="tab" id="apts-tab-${i}" aria-controls="apts-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" class="apts__tab">${esc(t(s.label))}</button>`).join('')}
    </div>
    ${R.aptSets.map((s, i) => `<div class="apts__panel" role="tabpanel" id="apts-panel-${i}" aria-labelledby="apts-tab-${i}"${i ? ' hidden' : ''}>
      ${fig(s.mix, { group: 'apts', sizes: '(min-width: 900px) 34vw, 92vw', cls: 'apts__mix fig--sheet' })}
      ${fig(s.plan, { group: 'apts', sizes: '(min-width: 900px) 40vw, 92vw', cls: 'apts__plan' })}
    </div>`).join('')}
  </section>

  <section class="elev" aria-labelledby="elev-h">
    <h3 class="h3 elev__h" id="elev-h">${esc(t(R.elevTitle))}</h3>
    ${fig('rcc-day', { group: 'rcc', sizes: '(min-width: 900px) 58vw, 100vw', cls: 'elev__day' })}
    ${fig('rcc-aerial', { group: 'rcc', sizes: '(min-width: 900px) 30vw, 60vw', cls: 'elev__aerial' })}
    ${fig('rcc-night-2', { group: 'rcc', sizes: '(min-width: 900px) 30vw, 60vw', cls: 'elev__night' })}
    ${fig('rcc-section', { group: 'rcc', sizes: '(min-width: 900px) 30vw, 70vw', cls: 'elev__section fig--drawing' })}
    ${fig('rcc-off-render', { group: 'rcc', sizes: '(min-width: 900px) 34vw, 80vw', cls: 'elev__office' })}
    ${fig('rcc-mall-site', { group: 'rcc', sizes: '(min-width: 900px) 34vw, 80vw', cls: 'elev__site fig--sheet' })}
  </section>
</article>`;

  // ---------- 02 Mixed-use residential complex ----------
  const M = P.mrc;
  const projectHead = (k, extra = '') => `
  <header class="project__head">
    <h2 class="project__title" id="${k}-title">${esc(t(P[k].title))}</h2>
    ${P[k].kind ? `<p class="project__kind">${esc(t(P[k].kind))}</p>` : ''}
    <p class="project__summary">${esc(t(P[k].summary))}</p>
    ${P[k].facts ? facts(P[k].facts) : ''}
    ${extra}
  </header>`;

  const mrc = `
<article class="project project--mrc" id="mrc" data-tone="night" aria-labelledby="mrc-title">
  ${projectHead('mrc')}
  <section class="tilt" data-tilt aria-labelledby="tilt-h">
    <div class="tilt__track">
      <div class="tilt__stage">
        <div class="tilt__text">
          <h3 class="h3" id="tilt-h">${esc(t(M.compareTitle))}</h3>
          <p class="lead">${esc(t(M.compareText))}</p>
        </div>
        <div class="tilt__view">
          <div class="tilt__plane" data-tilt-plan>${zoom('mrc-site-plan', { group: 'mrc', sizes: '(min-width: 900px) 30vw, 70vw' })}</div>
          <div class="tilt__aerial" data-tilt-aerial>${zoom('mrc-aerial', { group: 'mrc', sizes: '(min-width: 900px) 46vw, 92vw' })}</div>
        </div>
        <p class="tilt__caps" aria-hidden="true"><span data-tilt-cap="0">${cap('mrc-site-plan')}</span><span data-tilt-cap="1">${cap('mrc-aerial')}</span></p>
      </div>
    </div>
  </section>
  <section class="descent" data-descent>
    ${['mrc-night-a', 'mrc-night-b', 'mrc-street'].map((id, i) => `<figure class="descent__frame" data-descent-frame="${i}">${zoom(id, { group: 'mrc', sizes: '100vw' })}<figcaption class="fig__cap descent__cap">${cap(id)}</figcaption></figure>`).join('')}
  </section>
  <section class="sheet sheet--mrc" aria-labelledby="mrc-dr-h" data-tone="dawn">
    <h3 class="h3" id="mrc-dr-h">${esc(t(M.drawingsTitle))}</h3>
    ${fig('mrc-section-e', { group: 'mrc', sizes: '100vw', cls: 'sheet__wide fig--drawing' })}
    ${fig('mrc-section-n', { group: 'mrc', sizes: '(min-width: 900px) 50vw, 100vw', cls: 'sheet__half fig--drawing' })}
    ${fig('mrc-shop-plan', { group: 'mrc', sizes: '(min-width: 900px) 30vw, 90vw', cls: 'sheet__third fig--drawing' })}
    ${fig('mrc-floor-plan', { group: 'mrc', sizes: '(min-width: 900px) 22vw, 70vw', cls: 'sheet__quarter fig--drawing' })}
  </section>
</article>`;

  // ---------- 03 Facade design ----------
  const fac = `
<article class="project project--fac" id="fac" data-tone="morning" aria-labelledby="fac-title">
  ${projectHead('fac')}
  <section class="wipe" data-wipe aria-label="${esc(t(P.fac.wipeTitle))}">
    <div class="wipe__track">
      <div class="wipe__stage">
        <div class="wipe__frame">
          <div class="wipe__layer wipe__layer--drawing">${zoom('fac-elevation', { group: 'fac', sizes: '(min-width: 900px) 70vw, 100vw' })}</div>
          <div class="wipe__layer wipe__layer--image" data-wipe-image>${zoom('fac-street', { group: 'fac', sizes: '(min-width: 900px) 70vw, 100vw' })}</div>
          <span class="wipe__line" data-wipe-line aria-hidden="true"></span>
        </div>
        <p class="wipe__caps" aria-hidden="true"><span>${cap('fac-elevation')}</span><span>${cap('fac-street')}</span></p>
      </div>
    </div>
  </section>
  <section class="sheet sheet--fac">
    ${fig('fac-aerial', { group: 'fac', sizes: '(min-width: 900px) 48vw, 100vw', cls: 'sheet__aerial' })}
    ${fig('fac-site', { group: 'fac', sizes: '(min-width: 900px) 36vw, 90vw', cls: 'sheet__site fig--drawing' })}
    ${fig('fac-plans', { group: 'fac', sizes: '(min-width: 900px) 64vw, 100vw', cls: 'sheet__plans fig--drawing' })}
    ${fig('fac-sec-n', { group: 'fac', sizes: '(min-width: 900px) 42vw, 100vw', cls: 'sheet__secn fig--drawing' })}
    ${fig('fac-sec-e', { group: 'fac', sizes: '(min-width: 900px) 42vw, 100vw', cls: 'sheet__sece fig--drawing' })}
  </section>
</article>`;

  // ---------- 04 Modern villa residences ----------
  const V = P.mvr;
  const mvr = `
<article class="project project--mvr" id="mvr" data-tone="day" aria-labelledby="mvr-title">
  <section class="window" data-window>
    <div class="window__track">
      <div class="window__stage">
        <div class="window__frame" data-window-frame>${zoom('mvr-r1', { group: 'mvr', sizes: '100vw' })}</div>
      </div>
    </div>
  </section>
  ${projectHead('mvr')}
  <section class="levels" data-levels aria-labelledby="levels-h">
    <div class="levels__track">
      <div class="levels__stage">
        <h3 class="h3 levels__h" id="levels-h">${esc(t(V.levelsTitle))}</h3>
        <figure class="levels__section fig">
          ${zoom('mvr-side-sec', { group: 'mvr', sizes: '(min-width: 900px) 40vw, 92vw' })}
          <span class="levels__band" data-levels-band aria-hidden="true"></span>
          <figcaption class="fig__cap">${cap('mvr-side-sec')}</figcaption>
        </figure>
        <ol class="levels__names" data-levels-names>${V.levels.map((l, i) => `<li data-level-name="${i}"${i === 0 ? ' class="is-on"' : ''}>${esc(t(l.name))}</li>`).join('')}</ol>
        <div class="levels__plans">
          ${V.levels.map((l, i) => `<figure class="levels__plan fig${i === 0 ? ' is-on' : ''}" data-levels-plan="${i}">${zoom(l.img, { group: 'mvr', sizes: '(min-width: 900px) 44vw, 92vw' })}<figcaption class="fig__cap">${cap(l.img)}</figcaption></figure>`).join('')}
        </div>
      </div>
    </div>
  </section>
  <section class="sheet sheet--mvr">
    ${fig('mvr-site-sec', { group: 'mvr', sizes: '100vw', cls: 'sheet__wide fig--drawing' })}
    ${fig('mvr-site-plan', { group: 'mvr', sizes: '(min-width: 900px) 62vw, 100vw', cls: 'sheet__siteplan fig--drawing' })}
    ${fig('mvr-elev', { group: 'mvr', sizes: '(min-width: 900px) 34vw, 100vw', cls: 'sheet__elev fig--drawing' })}
    ${fig('mvr-r2', { group: 'mvr', sizes: '(min-width: 900px) 80vw, 100vw', cls: 'sheet__r2' })}
  </section>
</article>`;

  // ---------- 05 Two villas ----------
  const VV = P.villas;
  const levelStack = (levels) => `<ol class="vlevels" aria-hidden="true">${levels.slice().reverse().map(([n, v, y]) => `<li class="vlevels__row" style="--y:${y}"><span class="vlevels__name">${n}</span>${levelMark(v)}</li>`).join('')}</ol>`;
  const villaSection = (id, group, levels) => `<figure class="villa__section fig" data-villa-section><div class="villa__secimg">${zoom(id, { group, sizes: '(min-width: 900px) 38vw, 80vw' })}${levelStack(levels)}</div><figcaption class="fig__cap">${cap(id)}</figcaption></figure>`;
  const villas = `
<article class="project project--villas" id="villas" data-tone="bright" aria-labelledby="villas-title">
  ${projectHead('villas')}
  <div class="villas">
    <section class="villa villa--one" aria-labelledby="v1-h">
      <h3 class="villa__h" id="v1-h">${esc(t(VV.one.title))}</h3>
      ${fig('v1-render', { group: 'v1', sizes: '(min-width: 900px) 48vw, 100vw', cls: 'villa__hero' })}
      ${villaSection('v1-section-a', 'v1', VV.one.levels)}
      <div class="villa__row">
        ${fig('v1-massing', { group: 'v1', sizes: '(min-width: 900px) 22vw, 50vw', cls: 'villa__massing' })}
        ${fig('v1-site', { group: 'v1', sizes: '(min-width: 900px) 20vw, 45vw', cls: 'villa__site' })}
      </div>
      ${fig('v1-plans', { group: 'v1', sizes: '(min-width: 900px) 40vw, 92vw', cls: 'fig--drawing villa__plans' })}
      ${fig('v1-section-b', { group: 'v1', sizes: '(min-width: 900px) 38vw, 86vw', cls: 'fig--drawing villa__sec2' })}
      ${fig('v1-plan-render', { group: 'v1', sizes: '(min-width: 900px) 24vw, 60vw', cls: 'villa__planr' })}
    </section>
    <section class="villa villa--two" aria-labelledby="v2-h">
      <h3 class="villa__h" id="v2-h">${esc(t(VV.two.title))}</h3>
      ${fig('v2-r2', { group: 'v2', sizes: '(min-width: 900px) 48vw, 100vw', cls: 'villa__hero' })}
      ${villaSection('v2-section-a', 'v2', VV.two.levels)}
      ${fig('v2-r1', { group: 'v2', sizes: '(min-width: 900px) 34vw, 92vw', cls: 'villa__r1' })}
      ${fig('v2-plans', { group: 'v2', sizes: '(min-width: 900px) 40vw, 92vw', cls: 'fig--drawing villa__plans' })}
      ${fig('v2-section-b', { group: 'v2', sizes: '(min-width: 900px) 38vw, 86vw', cls: 'fig--drawing villa__sec2' })}
    </section>
  </div>
</article>`;

  // ---------- 06 Community center ----------
  const C = P.cc;
  const step = (i) => `<p class="film__step"><span class="film__n">${i + 1}</span><span class="film__t">${esc(t(C.steps[i]))}</span></p>`;
  const frame = (inner, cls = '') => `<li class="film__frame ${cls}">${inner}</li>`;
  const cc = `
<article class="project project--cc" id="cc" data-tone="concrete" aria-labelledby="cc-title">
  <div class="vellum" data-vellum aria-hidden="true"></div>
  ${projectHead('cc')}
  <section class="film" data-film aria-label="${esc(t(C.title))}">
    <div class="film__track">
      <div class="film__stage">
        <ol class="film__strip" data-film-strip>
          ${frame(step(0) + `<div class="film__drawing" aria-hidden="true"><svg viewBox="0 0 300 200"><path d="M20 160 L95 40 L150 120 L210 30 L280 150 Z"/><path d="M60 170 L140 70 L240 170"/><path d="M30 120 L270 120" class="dash"/></svg></div>`, 'film__frame--intro')}
          ${frame(fig('cc-model-1', { group: 'cc', sizes: '(min-width: 900px) 32vw, 80vw' }) + step(1))}
          ${frame(fig('cc-model-2', { group: 'cc', sizes: '(min-width: 900px) 32vw, 80vw' }) + step(2))}
          ${frame(fig('cc-sketch-1', { group: 'cc', sizes: '(min-width: 900px) 30vw, 80vw' }) + fig('cc-sketch-2', { group: 'cc', sizes: '(min-width: 900px) 30vw, 80vw' }) + step(3), 'film__frame--pair')}
          ${frame(fig('cc-site-plan', { group: 'cc', sizes: '(min-width: 900px) 40vw, 85vw' }))}
          ${frame(fig('cc-plan-g', { group: 'cc', sizes: '(min-width: 900px) 40vw, 85vw', cls: 'fig--drawing' }))}
          ${frame(fig('cc-plan-1', { group: 'cc', sizes: '(min-width: 900px) 40vw, 85vw', cls: 'fig--drawing' }))}
          ${frame(fig('cc-elev-a', { group: 'cc', sizes: '(min-width: 900px) 40vw, 85vw', cls: 'fig--drawing' }))}
          ${frame(fig('cc-elev-b', { group: 'cc', sizes: '(min-width: 900px) 40vw, 85vw', cls: 'fig--drawing' }))}
          ${frame(fig('cc-aerial', { group: 'cc', sizes: '(min-width: 900px) 56vw, 92vw' }) + step(4), 'film__frame--wide')}
          ${frame(fig('cc-r1', { group: 'cc', sizes: '(min-width: 900px) 40vw, 85vw' }) + fig('cc-r3', { group: 'cc', sizes: '(min-width: 900px) 30vw, 70vw' }), 'film__frame--pair')}
          ${frame(fig('cc-r2', { group: 'cc', sizes: '(min-width: 900px) 40vw, 85vw' }) + fig('cc-r4', { group: 'cc', sizes: '(min-width: 900px) 44vw, 85vw' }), 'film__frame--pair')}
        </ol>
        <div class="film__progress" aria-hidden="true"><span data-film-progress></span></div>
      </div>
    </div>
  </section>
</article>`;

  // ---------- 07 Senior living village ----------
  const S = P.slv;
  const slv = `
<article class="project project--slv" id="slv" data-tone="landscape" aria-labelledby="slv-title">
  ${projectHead('slv')}
  <section class="concept" data-concept aria-labelledby="concept-h">
    <div class="concept__track">
      <div class="concept__stage">
        <h3 class="h3 concept__h" id="concept-h">${esc(t(S.conceptTitle))}</h3>
        <svg class="concept__svg" viewBox="0 0 600 400" data-concept-svg role="img" aria-label="${esc(S.concept.map((c) => t(c)).join(' → '))}"></svg>
        <ol class="concept__steps" data-concept-steps>${S.concept.map((c, i) => `<li${i === 0 ? ' class="is-on"' : ''}><span class="concept__n">${i + 1}</span>${esc(t(c))}</li>`).join('')}</ol>
      </div>
    </div>
  </section>
  <section class="slv-plan">
    ${fig('slv-site-plan', { group: 'slv', sizes: '(min-width: 900px) 34vw, 90vw', cls: 'slv-plan__site' })}
    ${fig('slv-aerial', { group: 'slv', sizes: '(min-width: 900px) 62vw, 100vw', cls: 'slv-plan__aerial' })}
  </section>
  <section class="slv-views" aria-label="${esc(t(ui.views))}">
    ${['slv-r1', 'slv-r2', 'slv-r3', 'slv-r4'].map((id, i) => fig(id, { group: 'slv', sizes: '(min-width: 900px) 46vw, 100vw', cls: `slv-views__f slv-views__f--${i + 1}` })).join('')}
  </section>
  <section class="slv-buildings" aria-labelledby="slv-b-h">
    <h3 class="h3" id="slv-b-h">${esc(t(S.buildingsTitle))}</h3>
    <ul class="slv-buildings__list">
      ${S.buildings.map((b) => `<li>${zoom(b.img, { group: 'slv-dr', sizes: '(min-width: 900px) 40vw, 90vw', label: t(b.name) })}<p class="fig__cap">${esc(t(b.name))}</p></li>`).join('')}
    </ul>
  </section>
</article>`;

  // ---------- 08 Site supervision ----------
  const T = P.site;
  const maxTotal = Math.max(...T.glass.rows.map((r) => r[3]));
  const site = `
<article class="project project--site" id="site" data-tone="overcast" aria-labelledby="site-title">
  <div class="site-open">
    ${projectHead('site', `<p class="project__note">${esc(t(T.tokiNote))}</p>`)}
    ${fig('toki-osman', { group: 'site', sizes: '(min-width: 900px) 24vw, 60vw', cls: 'site-open__osman' })}
    ${fig('toki-aerial', { group: 'site', sizes: '(min-width: 900px) 52vw, 100vw', cls: 'site-open__aerial' })}
    ${fig('toki-court', { group: 'site', sizes: '(min-width: 900px) 30vw, 80vw', cls: 'site-open__court' })}
    ${fig('toki-mosque', { group: 'site', sizes: '(min-width: 900px) 18vw, 45vw', cls: 'site-open__mosque' })}
    ${fig('toki-roof', { group: 'site', sizes: '(min-width: 900px) 18vw, 45vw', cls: 'site-open__roof' })}
  </div>

  <section class="cases" aria-labelledby="cer-h">
    <header class="cases__head">
      <h3 class="h3" id="cer-h">${esc(t(T.ceramicTitle))}</h3>
      <p class="lead">${esc(t(T.ceramicText))}</p>
    </header>
    <ul class="pairs">
      ${T.ceramics.map((c) => `<li class="pair" data-pair>
        <p class="pair__code"><bdi>${c.code}</bdi></p>
        <div class="pair__frame">
          <figure class="pair__img pair__img--before" data-pair-before>${zoom(c.before, { group: 'cer', sizes: '(min-width: 900px) 28vw, 90vw' })}</figure>
          <figure class="pair__img pair__img--after" data-pair-after>${zoom(c.after, { group: 'cer', sizes: '(min-width: 900px) 28vw, 90vw' })}</figure>
        </div>
        <div class="pair__bar">
          <span class="pair__state" data-pair-state data-before="${esc(t(ui.before))}" data-after="${esc(t(ui.after))}">${esc(t(ui.before))}</span>
          <button type="button" class="pair__toggle" data-pair-toggle aria-pressed="false" data-show-after="${esc(t(ui.showAfter))}" data-show-before="${esc(t(ui.showBefore))}">${esc(t(ui.showAfter))}</button>
        </div>
      </li>`).join('')}
    </ul>
  </section>

  <section class="cases cases--leak" aria-labelledby="leak-h">
    <header class="cases__head">
      <h3 class="h3" id="leak-h">${esc(t(T.leakTitle))}</h3>
      <p class="lead">${esc(t(T.leakText))}</p>
    </header>
    <ol class="leaks">
      ${T.leaks.map((l) => `<li class="leak">
        ${fig(l.problem, { group: 'leak', sizes: '(min-width: 900px) 16vw, 44vw', cls: 'leak__problem' })}
        <p class="leak__fix"><span class="leak__code"><bdi>${esc(l.code)}</bdi></span><svg class="leak__arrow" viewBox="0 0 60 12" aria-hidden="true"><path d="M0 6h56M50 1l6 5-6 5"/></svg><span class="leak__name">${esc(t(l.fixName))}</span></p>
        ${fig(l.fix, { group: 'leak', sizes: '(min-width: 900px) 18vw, 44vw', cls: 'leak__after' })}
      </li>`).join('')}
    </ol>
  </section>

  <section class="docs" aria-labelledby="docs-h">
    <header class="cases__head">
      <h3 class="h3" id="docs-h">${esc(t(T.docsTitle))}</h3>
      <p class="lead">${esc(t(T.docsText))}</p>
    </header>
    <div class="docs__grid">
      <figure class="glass" data-glass>
        <figcaption class="glass__title">${esc(t(T.glass.title))}</figcaption>
        <table class="glass__table">
          <thead><tr>${T.glass.cols.map((c, i) => `<th scope="col"${i ? ' class="num"' : ''}>${esc(t(c))}</th>`).join('')}<th scope="col" class="glass__barh"><span class="sr">${esc(t(T.glass.cols[3]))}</span></th></tr></thead>
          <tbody>
            ${T.glass.rows.map((r) => `<tr><th scope="row">${esc(t(r[0]))}</th><td class="num">${num(r[1])}</td><td class="num">${num(r[2])}</td><td class="num">${num(r[3])}</td><td class="glass__barcell" aria-hidden="true"><span class="glass__bar" style="--s:${(r[1] / maxTotal).toFixed(3)};--d:${(r[2] / maxTotal).toFixed(3)}"><span class="glass__s"></span><span class="glass__d"></span></span></td></tr>`).join('')}
          </tbody>
          <tfoot><tr><th scope="row">${esc(t(T.glass.total[0]))}</th><td class="num">${num(T.glass.total[1])}</td><td class="num">${num(T.glass.total[2])}</td><td class="num glass__grand">${num(T.glass.total[3])}</td><td aria-hidden="true"></td></tr></tfoot>
        </table>
        <p class="glass__key" aria-hidden="true"><span class="glass__k glass__k--s">${esc(t(T.glass.cols[1]))}</span><span class="glass__k glass__k--d">${esc(t(T.glass.cols[2]))}</span></p>
      </figure>
      <figure class="log">
        <figcaption class="glass__title">${esc(t(T.ceramicLog.title))}</figcaption>
        <table class="log__table">
          <thead><tr>${T.ceramicLog.cols.map((c, i) => `<th scope="col"${i === 0 ? ' class="num"' : ''}>${esc(t(c))}</th>`).join('')}</tr></thead>
          <tbody>${T.ceramicLog.rows.map((r) => `<tr><td class="num">${r[0]}</td><td>${esc(t(r[1]))}</td><td>${esc(t(r[2]))}</td></tr>`).join('')}</tbody>
        </table>
      </figure>
      ${fig('doc-overview-a', { group: 'docs', sizes: '(min-width: 900px) 20vw, 45vw', cls: 'docs__ph docs__ph--a' })}
      ${fig('doc-overview-b', { group: 'docs', sizes: '(min-width: 900px) 20vw, 45vw', cls: 'docs__ph docs__ph--b' })}
      ${fig('doc-defect', { group: 'docs', sizes: '(min-width: 900px) 20vw, 45vw', cls: 'docs__ph docs__ph--c' })}
      ${fig('doc-glass-table', { group: 'docs', sizes: '(min-width: 900px) 24vw, 60vw', cls: 'docs__ph docs__ph--d fig--drawing' })}
      ${fig('doc-ceramic-table', { group: 'docs', sizes: '(min-width: 900px) 36vw, 90vw', cls: 'docs__ph docs__ph--e fig--drawing' })}
    </div>
  </section>
</article>`;

  // ---------- Experience ----------
  const PR = practice;
  const practiceHtml = `
<section class="practice" id="practice" data-tone="vellum" aria-labelledby="practice-h">
  <header class="practice__head">
    <h2 class="section-title" id="practice-h">${esc(t(PR.title))}</h2>
    <p class="lead">${esc(t(PR.intro))}</p>
  </header>
  <div class="strata" data-strata>
    ${PR.groups.map((g, gi) => `<section class="stratum stratum--${gi}" aria-labelledby="stratum-${gi}">
      <h3 class="stratum__name" id="stratum-${gi}">${esc(t(g.name))}</h3>
      <ol class="stratum__items">
        ${g.items.map((it) => `<li class="slab">
          <span class="slab__line" aria-hidden="true"></span>
          <h4 class="slab__title">${esc(t(it.title))}</h4>
          ${it.org ? `<p class="slab__org">${esc(t(it.org))}${it.years ? `<span class="slab__years"><bdi>${it.years}</bdi></span>` : ''}</p>` : ''}
          ${it.text ? `<p class="slab__text">${esc(t(it.text))}</p>` : ''}
          ${it.cert ? `<p class="slab__cert">${esc(t(it.cert))}</p>` : ''}
        </li>`).join('')}
      </ol>
    </section>`).join('')}
  </div>
  <section class="tools" aria-labelledby="tools-h">
    <h3 class="h3" id="tools-h">${esc(t(PR.toolsTitle))}</h3>
    <p class="lead">${esc(t(PR.toolsIntro))}</p>
    <ol class="tools__chain">
      ${PR.tools.map((s, i) => `<li class="tools__stage"><span class="tools__n">${i + 1}</span><span class="tools__name">${esc(t(s.stage))}</span><ul class="tools__list">${s.items.map((x) => `<li><bdi>${x}</bdi></li>`).join('')}</ul></li>`).join('')}
    </ol>
  </section>
</section>`;

  // ---------- About ----------
  const about = `
<section class="about" id="about" data-tone="vellum" aria-labelledby="about-h">
  <figure class="about__portrait">${pic('portrait', { sizes: '(min-width: 900px) 26vw, 60vw', alt: t(captions.portrait) })}</figure>
  <div class="about__text">
    <h2 class="section-title" id="about-h">${esc(t(person.fullName))}</h2>
    <p class="about__role">${esc(t(person.role))}</p>
    <p class="about__bio">${esc(t(person.bio))}</p>
    <dl class="facts about__facts">
      <div class="facts__row"><dt>${esc(t(practice.languagesTitle))}</dt><dd>${esc(t(person.languages))}</dd></div>
      <div class="facts__row"><dt>${esc(t(practice.strengthsTitle))}</dt><dd>${person.strengths.map((s) => esc(t(s))).join(lang === 'ar' ? '، ' : ', ')}</dd></div>
    </dl>
    <ul class="files">
      <li><a class="file" href="${base}files/Osman-Mohamed-CV-EN.pdf" download><span class="file__name">${esc(t(ui.cvEn))}</span>${dlIcon()}</a></li>
      <li><a class="file" href="${base}files/Osman-Mohamed-CV-TR.pdf" download><span class="file__name">${esc(t(ui.cvTr))}</span>${dlIcon()}</a></li>
    </ul>
  </div>
</section>`;
  function dlIcon() { return `<svg class="file__icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1v10M3.5 6.5 8 11l4.5-4.5M2 14.5h12"/></svg>`; }

  // ---------- Contact ----------
  const year = new Date().getFullYear();
  const contact = `
<section class="contact" id="contact" data-tone="night" aria-labelledby="contact-h">
  <div class="contact__wire" aria-hidden="true">${pic('cover-wire', { sizes: '60vw', decorative: true })}</div>
  <div class="contact__body">
    <h2 class="section-title" id="contact-h">${esc(t(ui.nav.contact))}</h2>
    <p class="lead contact__line">${esc(t(ui.contactLine))}</p>
    <p class="contact__email"><a href="mailto:${person.email}" data-email>${person.email.replace('@', '<wbr>@')}</a></p>
    <div class="contact__actions">
      <button type="button" class="btn" data-copy="${person.email}" data-copied="${esc(t(ui.copied))}">${esc(t(ui.copyEmail))}</button>
      <a class="btn" href="tel:${person.phoneHref}"><span class="btn__k">${esc(t(ui.phone))}</span><span dir="ltr">${person.phone}</span></a>
    </div>
    <ul class="files files--contact">
      <li><a class="file" href="${base}files/Osman-Mohamed-CV-EN.pdf" download><span class="file__name">${esc(t(ui.cvEn))}</span>${dlIcon()}</a></li>
      <li><a class="file" href="${base}files/Osman-Mohamed-CV-TR.pdf" download><span class="file__name">${esc(t(ui.cvTr))}</span>${dlIcon()}</a></li>
      <li><a class="file" href="${base}files/Osman-Mohamed-Portfolio.pdf" download><span class="file__name">${esc(t(ui.portfolio))}</span>${dlIcon()}</a></li>
    </ul>
    <p class="toast" role="status" aria-live="polite" data-toast></p>
  </div>
  <footer class="foot">
    <p class="foot__name">${mark}<span>© ${year} ${esc(t(person.name))}</span></p>
    <p class="foot__rights">${esc(t(ui.rights))}</p>
    <nav aria-label="${esc(t(ui.language))}">${langLinks('langs--foot')}</nav>
    <a class="foot__top" href="#top">${esc(t(ui.backToTop))}</a>
  </footer>
</section>`;

  // ---------- viewer ----------
  const viewer = `
<div class="viewer" role="dialog" aria-modal="true" aria-label="${esc(t(ui.viewer.open))}" hidden data-viewer>
  <div class="viewer__canvas" data-viewer-canvas><img class="viewer__img" alt="" data-viewer-img draggable="false"></div>
  <div class="viewer__bar">
    <p class="viewer__cap" data-viewer-cap></p>
    <p class="viewer__count" data-viewer-count></p>
    <div class="viewer__tools">
      <button type="button" class="viewer__btn" data-viewer-prev aria-label="${esc(t(ui.viewer.prev))}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4 6.5 10l6 6"/></svg></button>
      <button type="button" class="viewer__btn" data-viewer-next aria-label="${esc(t(ui.viewer.next))}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4 6 6-6 6"/></svg></button>
      <button type="button" class="viewer__btn" data-viewer-out aria-label="${esc(t(ui.viewer.zoomOut))}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12"/></svg></button>
      <button type="button" class="viewer__btn" data-viewer-in aria-label="${esc(t(ui.viewer.zoomIn))}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12M10 4v12"/></svg></button>
      <button type="button" class="viewer__btn" data-viewer-fit aria-label="${esc(t(ui.viewer.fit))}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 7V3h4M17 7V3h-4M3 13v4h4M17 13v4h-4"/></svg></button>
      <button type="button" class="viewer__btn viewer__close" data-viewer-close aria-label="${esc(t(ui.viewer.close))}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4.5 4.5 11 11M15.5 4.5l-11 11"/></svg></button>
    </div>
    <p class="viewer__hint">${esc(t(ui.viewer.hint))}</p>
  </div>
</div>`;

  const progress = `<div class="gauge" aria-hidden="true"><span class="gauge__track"></span><span class="gauge__mark" data-gauge>${levelMark('')}</span></div>`;

  // ---------- head ----------
  const alt = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${siteUrl ? siteUrl + LANG_META[l].path : href(l)}">`).join('');
  const fontPreload = lang === 'ar'
    ? `<link rel="preload" href="${base}assets/fonts/noto-kufi-arabic-arabic-wght-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="${base}assets/fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2" as="font" type="font/woff2" crossorigin>`
    : `<link rel="preload" href="${base}assets/fonts/archivo-latin-standard-normal.woff2" as="font" type="font/woff2" crossorigin>`;
  const og = siteUrl ? `<meta property="og:image" content="${siteUrl}img/og-${lang}.jpg"><meta property="og:url" content="${siteUrl}${LANG_META[lang].path}">` : `<meta property="og:image" content="${base}img/og-${lang}.jpg">`;

  return `<!doctype html>
<html lang="${lang}" dir="${meta.dir}" class="no-js">
<head>
<meta charset="utf-8">
${lang === 'en' ? `<script>try{if(!localStorage.getItem('om-lang')&&!location.hash){var L=((navigator.languages&&navigator.languages[0])||navigator.language||'').slice(0,2).toLowerCase();if(L==='ar'||L==='tr'){localStorage.setItem('om-lang',L);location.replace(L+'/');}}}catch(e){}</script>` : ''}
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t(ui.metaTitle))}</title>
<meta name="description" content="${esc(t(ui.metaDescription))}">
<meta name="theme-color" content="#0E1A2B">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t(ui.metaTitle))}">
<meta property="og:description" content="${esc(t(ui.metaDescription))}">
<meta property="og:locale" content="${lang === 'ar' ? 'ar_AR' : lang === 'tr' ? 'tr_TR' : 'en_US'}">
${og}
<meta name="twitter:card" content="summary_large_image">
${alt}<link rel="alternate" hreflang="x-default" href="${siteUrl || href('en')}">
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Person',
  name: person.fullName.en, alternateName: [person.name.en, person.name.ar], jobTitle: t(person.role),
  email: `mailto:${person.email}`, telephone: person.phoneHref,
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Istanbul Gelişim University' },
  knowsLanguage: ['ar', 'en', 'tr'],
  ...(siteUrl ? { url: siteUrl + LANG_META[lang].path, image: `${siteUrl}img/og-${lang}.jpg` } : {}),
})}</script>
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${base}favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">
${fontPreload}
<link rel="stylesheet" href="${base}assets/main.css?v=${version}">
<script>(function(d){var h=d.documentElement;h.classList.replace('no-js','js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){h.classList.add('motion');${heroChunk ? `var l=d.createElement('link');l.rel='modulepreload';l.href='${base}assets/chunks/${heroChunk}';d.head.appendChild(l);` : ''}}})(document);</script>
<script type="module" src="${base}assets/main.js?v=${version}"></script>
</head>
<body data-lang="${lang}">
${header}
${progress}
<main id="main">
${hero}
${rcc}
${mrc}
${fac}
${mvr}
${villas}
${cc}
${slv}
${site}
${practiceHtml}
${about}
${contact}
</main>
${viewer}
</body>
</html>
`;
}
