// Renders the site: a home page and one page per project, in three languages. Every page is complete static HTML;
// motion is layered on by JS, and without it each page reads top to bottom. All links are relative (works under /Osman/).
import { LANGS, LANG_META, person, ui, captions, projects as P, workOrder, indexMeta, indexThumb, slugs, projectTone, practice } from '../content/data.js';

export const pathFor = (lang, key) => `${LANG_META[lang].path}${key ? `projects/${slugs[key]}/` : ''}`;

function kit({ lang, images, key }) {
  const path = pathFor(lang, key);
  const depth = path.split('/').filter(Boolean).length;
  const base = depth ? '../'.repeat(depth) : './';
  const link = (p) => (base + p) || './';
  const t = (v) => (v == null ? '' : typeof v === 'string' || typeof v === 'number' ? String(v) : v[lang]);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const cap = (id) => esc(t(captions[id] || ''));
  const num = (n) => Number(n).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US');

  function srcset(id, fmt) { return images[id].widths.map((w) => `${base}img/${id}-${w}.${fmt} ${w}w`).join(', '); }
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
  const viewAttrs = (id, group) => {
    const im = images[id];
    return `data-view="${id}" data-group="${group}" data-full="${base}img/${id}-${im.widths.at(-1)}.webp" data-w="${im.w}" data-h="${im.h}" data-kind="${im.kind}" data-caption="${cap(id)}"`;
  };
  function zoom(id, { group = 'all', sizes, cls = '', eager = false, label = null } = {}) {
    const im = images[id];
    const kindLabel = im.kind === 'd' ? t(ui.viewer.open) : t(ui.viewer.openImage);
    return `<button type="button" class="zoom ${cls}" ${viewAttrs(id, group)} aria-label="${esc(kindLabel)}: ${esc(label ?? t(captions[id]))}">`
      + pic(id, { sizes, eager })
      + `<span class="zoom__icon" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3 8V3h5M17 12v5h-5M3 3l5.5 5.5M17 17l-5.5-5.5"/></svg></span>`
      + `</button>`;
  }
  const fig = (id, { group, sizes, cls = '', eager = false } = {}) => `<figure class="fig ${cls}">${zoom(id, { group, sizes, eager })}<figcaption class="fig__cap">${cap(id)}</figcaption></figure>`;
  const facts = (list) => `<dl class="facts">${list.map(([k, v]) => `<div class="facts__row"><dt>${esc(t(ui.facts[k]))}</dt><dd>${esc(t(v))}</dd></div>`).join('')}</dl>`;
  return { lang, key, path, base, link, t, esc, cap, num, pic, zoom, fig, facts, viewAttrs, images, home: link(pathFor(lang, null)) };
}

const mark = `<svg class="mark" viewBox="0 0 34 24" aria-hidden="true"><circle cx="8.5" cy="12" r="6.2"/><path d="M18 18.5V5.5l5 7 5-7v13"/><path class="mark__datum" d="M1 22.5h32"/></svg>`;
const levelMark = (val) => `<svg class="lvl" viewBox="0 0 14 10" aria-hidden="true"><path d="M1 1h12L7 9z"/></svg><span class="lvl__val">${val}</span>`;
const dlIcon = `<svg class="file__icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1v10M3.5 6.5 8 11l4.5-4.5M2 14.5h12"/></svg>`;
const arrowIcon = `<svg class="go" viewBox="0 0 24 12" aria-hidden="true"><path d="M0 6h22M17 1l5 5-5 5"/></svg>`;
// the reader's own language first
const CV = { en: ['Osman-Mohamed-CV-EN.pdf', 'cvEn'], ar: ['Osman-Mohamed-CV-AR.pdf', 'cvAr'], tr: ['Osman-Mohamed-CV-TR.pdf', 'cvTr'] };
const cvLinks = (k) => [k.lang, ...LANGS.filter((l) => l !== k.lang)]
  .map((l) => `<li><a class="file" href="${k.base}files/${CV[l][0]}" download hreflang="${l}" type="application/pdf"><span class="file__name">${k.esc(k.t(ui[CV[l][1]]))}</span>${dlIcon}</a></li>`).join('');

// ───────────────────────── shared chrome ─────────────────────────
function chrome(k) {
  const { t, esc, link, lang, key, home } = k;
  const onHome = !key;
  const navHref = (id) => (onHome || id === 'contact' ? `#${id}` : `${home}#${id}`);
  const nav = [['work', 'work'], ['practice', 'practice'], ['about', 'about'], ['contact', 'contact']];
  const langLinks = (cls) => `<ul class="langs ${cls}">${LANGS.map((l) => `<li><a href="${link(pathFor(l, key))}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="page"' : ''} data-lang-link="${l}"><span class="langs__short" aria-hidden="true">${LANG_META[l].short}</span><span class="langs__full">${LANG_META[l].name}</span></a></li>`).join('')}</ul>`;
  const header = `
<a class="skip" href="#main">${esc(t(ui.skip))}</a>
<header class="hud" data-hud>
  <a class="hud__home" href="${onHome ? '#top' : home}">${mark}<span class="hud__name">${esc(t(person.name))}</span></a>
  <p class="hud__now" aria-hidden="true"><span data-now></span></p>
  <nav class="hud__nav" aria-label="${esc(t(ui.menu))}">${nav.map(([n, id]) => `<a href="${navHref(id)}">${esc(t(ui.nav[n]))}</a>`).join('')}</nav>
  <nav class="hud__langs" aria-label="${esc(t(ui.language))}">${langLinks('langs--hud')}</nav>
  <button type="button" class="hud__menu" aria-expanded="false" aria-controls="menu" data-menu-open><span class="hud__menu-lines" aria-hidden="true"></span><span class="hud__menu-label">${esc(t(ui.menu))}</span></button>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="${esc(t(ui.menu))}" hidden data-menu>
  <div class="menu__sheet">
    <div class="menu__top">
      <a class="hud__home" href="${onHome ? '#top' : home}" data-menu-link>${mark}<span class="hud__name">${esc(t(person.name))}</span></a>
      <button type="button" class="menu__close" data-menu-close>${esc(t(ui.close))}</button>
    </div>
    <div class="menu__body">
      <section class="menu__index" aria-labelledby="menu-index-h">
        <h2 class="menu__h" id="menu-index-h">${esc(t(ui.index))}</h2>
        <ol class="menu__list">
          ${workOrder.map((p) => `<li><a href="${link(pathFor(lang, p))}" data-menu-link data-thumb="${p}"${p === key ? ' aria-current="page"' : ''}><span class="menu__title">${esc(t(P[p].title))}</span><span class="menu__meta">${esc(t(indexMeta[p]))}</span></a></li>`).join('')}
        </ol>
      </section>
      <div class="menu__side">
        <figure class="menu__thumbs" aria-hidden="true">${workOrder.map((p, i) => `<div class="menu__thumb${(key ? p === key : i === 0) ? ' is-on' : ''}" data-thumb-for="${p}">${k.pic(indexThumb[p], { sizes: '30vw', decorative: true })}</div>`).join('')}</figure>
        <ul class="menu__nav">${nav.slice(1).map(([n, id]) => `<li><a href="${navHref(id)}" data-menu-link>${esc(t(ui.nav[n]))}</a></li>`).join('')}</ul>
        <nav aria-label="${esc(t(ui.language))}">${langLinks('langs--menu')}</nav>
        <p class="menu__contact"><a href="mailto:${person.email}">${person.email}</a><br><a href="tel:${person.phoneHref}" dir="ltr">${person.phone}</a></p>
      </div>
    </div>
  </div>
</div>
<div class="gauge" aria-hidden="true"><span class="gauge__track"></span><span class="gauge__mark" data-gauge>${levelMark('')}</span></div>`;

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
  return { header, viewer, langLinks };
}

function contact(k, langLinks) {
  const { t, esc, base, key } = k;
  const year = new Date().getFullYear();
  return `
<section class="contact${key ? ' contact--page' : ''}" id="contact" data-tone="night" aria-labelledby="contact-h">
  <div class="contact__wire" aria-hidden="true">${k.pic('cover-wire', { sizes: '60vw', decorative: true })}</div>
  <div class="contact__body">
    <h2 class="section-title" id="contact-h">${esc(t(ui.nav.contact))}</h2>
    <p class="lead contact__line">${esc(t(ui.contactLine))}</p>
    <p class="contact__email"><a href="mailto:${person.email}" data-email>${person.email.replace('@', '<wbr>@')}</a></p>
    <div class="contact__actions">
      <button type="button" class="btn" data-copy="${person.email}" data-copied="${esc(t(ui.copied))}">${esc(t(ui.copyEmail))}</button>
      <a class="btn" href="tel:${person.phoneHref}"><span class="btn__k">${esc(t(ui.phone))}</span><span dir="ltr">${person.phone}</span></a>
    </div>
    <ul class="files files--contact">
      ${cvLinks(k)}
      <li><a class="file" href="${base}files/Osman-Mohamed-Portfolio.pdf" download type="application/pdf"><span class="file__name">${esc(t(ui.portfolio))}</span>${dlIcon}</a></li>
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
}

// ───────────────────────── home ─────────────────────────
function homeBody(k) {
  const { t, esc, pic, link, lang } = k;
  const R = P.rcc;
  const nameLines = t(person.name).split(' ');
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
      <div class="hero__story" data-hero-story><p class="hero__statement">${esc(t(person.summary))}</p></div>
      <ol class="hero__steps" data-hero-steps>
        ${ui.heroSteps.map((s, i) => `<li class="hero__step${i === 0 ? ' is-on' : ''}"><span class="hero__step-n">${i + 1}</span><span class="hero__step-t">${esc(t(s))}</span><span class="hero__step-c">${esc(t(ui.heroCaptions[i]))}</span></li>`).join('')}
      </ol>
      <p class="hero__note" data-hero-note>${esc(t(ui.heroNote))}</p>
      <p class="hero__cue" data-hero-cue><span>${esc(t(ui.scrollCue))}</span><svg viewBox="0 0 12 40" aria-hidden="true"><path d="M6 0v38M1 33l5 6 5-6"/></svg></p>
    </div>
  </div>
</section>
<section class="feature" id="featured" data-tone="night" aria-labelledby="feature-title">
  <h2 class="project__title" id="feature-title">${esc(t(R.title))}</h2>
  <p class="project__summary">${esc(t(R.summary))}</p>
  <a class="btn btn--light feature__go" href="${link(pathFor(lang, 'rcc'))}">${esc(t(ui.openProject))}${arrowIcon}</a>
</section>`;

  const works = `
<section class="works" id="work" data-tone="dawn" aria-labelledby="work-h">
  <header class="works__head">
    <h2 class="section-title" id="work-h">${esc(t(ui.index))}</h2>
    <p class="lead">${esc(t(ui.workIntro))}</p>
  </header>
  <ol class="works__list">
    ${workOrder.map((p, i) => `<li class="work work--${i % 2 ? 'b' : 'a'}">
      <a class="work__link" href="${link(pathFor(lang, p))}">
        <span class="work__img" style="view-transition-name: cover-${p}">${pic(indexThumb[p], { sizes: '(min-width: 900px) 46vw, 100vw', decorative: true })}</span>
        <span class="work__text"><span class="work__title">${esc(t(P[p].title))}</span><span class="work__meta">${esc(t(indexMeta[p]))}</span></span>
      </a>
    </li>`).join('')}
  </ol>
</section>`;

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
      ${cvLinks(k)}
    </ul>
  </div>
</section>`;
  return hero + works + practiceHtml + about;
}

// ───────────────────────── project pages ─────────────────────────
function projectHero(k, key, { note = '' } = {}) {
  const { t, esc, pic, home } = k;
  const pr = P[key];
  const cover = indexThumb[key];
  const n = workOrder.indexOf(key) + 1;
  const two = (x) => String(x).padStart(2, '0');
  return `
<header class="phero" data-tone="night" data-phero>
  <div class="phero__img" style="view-transition-name: cover-${key}"><div class="phero__pic" data-phero-pic>${pic(cover, { sizes: '100vw', eager: true, high: true })}</div></div>
  <div class="phero__text" data-phero-text>
    <p class="phero__top"><a class="phero__back" href="${home}#work"><svg class="go go--back" viewBox="0 0 24 12" aria-hidden="true"><path d="M24 6H2M7 1 2 6l5 5"/></svg>${esc(t(ui.allProjects))}</a><span class="phero__n" aria-hidden="true"><bdi>${two(n)} / ${two(workOrder.length)}</bdi></span></p>
    <h1 class="phero__title" id="ptitle">${esc(t(pr.title))}</h1>
    <p class="phero__kind">${esc(t(pr.kind || indexMeta[key]))}</p>
  </div>
</header>
<section class="pintro" aria-label="${esc(t(pr.title))}">
  <div class="pintro__text">
    <p class="pintro__summary">${esc(t(pr.summary))}</p>
    ${pr.role ? `<p class="pintro__role">${esc(t(pr.role))}</p>` : ''}
    ${note}
  </div>
  ${pr.facts ? `<div class="pintro__facts">${k.facts(pr.facts)}</div>` : ''}
</section>`;
}

function nextBlock(k, key) {
  const { t, esc, pic, link, lang, home } = k;
  const next = workOrder[(workOrder.indexOf(key) + 1) % workOrder.length];
  return `
<nav class="pnext" aria-label="${esc(t(ui.nextProject))}">
  <a class="pnext__card" href="${link(pathFor(lang, next))}">
    <span class="pnext__k">${esc(t(ui.nextProject))}</span>
    <span class="pnext__title">${esc(t(P[next].title))}${arrowIcon}</span>
    <span class="pnext__img" style="view-transition-name: cover-${next}">${pic(indexThumb[next], { sizes: '(min-width: 900px) 70vw, 100vw', decorative: true })}</span>
  </a>
  <a class="pnext__all" href="${home}#work">${esc(t(ui.allProjects))}</a>
</nav>`;
}

const body = {
  rcc(k) {
    const { t, esc, pic, zoom, fig, viewAttrs, lang } = k;
    const R = P.rcc;
    const floorLabel = (o) => (o.from === o.to ? (o.from === 0 ? esc(t(ui.ground)) : `${esc(t(ui.floor))} ${o.from}`) : `${esc(t(ui.floors))} ${o.from}–${o.to}`);
    return `
  <section class="stack" data-stack aria-labelledby="stack-h">
    <div class="stack__track">
      <div class="stack__stage">
        <header class="stack__head">
          <h2 class="h3" id="stack-h">${esc(t(R.mallTitle))}</h2>
          <p class="lead">${esc(t(R.mallIntro))}</p>
        </header>
        <div class="stack__view">
          <div class="stack__model" data-stack-model>
            ${R.mallLevels.map((lv, i) => `<button type="button" class="stack__level" style="--i:${i}" data-level="${i}" ${viewAttrs(lv.img, 'mall')} aria-label="${esc(t(ui.viewer.open))}: ${esc(t(lv.name))}">${pic(lv.img, { sizes: '(min-width: 900px) 40vw, 80vw', decorative: true })}<span class="stack__tag" aria-hidden="true">${esc(lv.tag)}</span></button>`).join('')}
          </div>
        </div>
        <div class="stack__flat">
          ${R.mallLevels.map((lv, i) => `<figure class="stack__plan${i === 0 ? ' is-on' : ''}" data-stack-plan="${i}">${zoom(lv.img, { group: 'mall', sizes: '(min-width: 900px) 54vw, 94vw', label: t(lv.name) })}<figcaption class="stack__cap"><span class="stack__cap-tag">${esc(lv.tag)}</span><span class="stack__cap-name">${esc(t(lv.name))}</span><span class="stack__cap-text">${esc(t(lv.text))}</span></figcaption></figure>`).join('')}
        </div>
        <ol class="stack__chips" aria-label="${esc(t(ui.chooseLevel))}">
          ${R.mallLevels.map((lv, i) => `<li><button type="button" class="stack__chip" data-chip="${i}" aria-pressed="${i === 0}"><span aria-hidden="true">${esc(lv.tag)}</span><span class="sr">${esc(t(lv.name))}</span></button></li>`).join('')}
        </ol>
        <ul class="legend">${R.legend.map(([c, n]) => `<li><span class="legend__swatch" style="--c:${c}"></span>${esc(t(n))}</li>`).join('')}</ul>
      </div>
    </div>
  </section>

  <section class="floors" data-floors aria-labelledby="floors-h">
    <div class="floors__track">
      <div class="floors__stage">
        <header class="floors__head">
          <h2 class="h3" id="floors-h">${esc(t(R.officeTitle))}</h2>
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
          ${R.officeFloors.map((o, i) => `<figure class="floors__plan${i === 0 ? ' is-on' : ''}" data-floor-plan="${i}" data-from="${o.from}" data-to="${o.to}" data-text="${esc(t(o.text))}">${zoom(o.img, { group: 'office', sizes: '(min-width: 900px) 60vw, 94vw' })}<figcaption class="fig__cap"><span class="floors__range">${floorLabel(o)}</span><span class="floors__ftext">${esc(t(o.text))}</span></figcaption></figure>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <section class="apts" aria-labelledby="apts-h">
    <header class="apts__head">
      <h2 class="h3" id="apts-h">${esc(t(R.aptTitle))}</h2>
      <p class="lead">${esc(t(R.aptIntro))}</p>
      <ul class="unitkey">${R.unitKey.map(([c, n]) => `<li><span class="legend__swatch" style="--c:${c}"></span><bdi>${n}</bdi></li>`).join('')}</ul>
    </header>
    <div class="apts__tabs" role="tablist" aria-label="${esc(t(R.aptTitle))}">
      ${R.aptSets.map((s, i) => `<button type="button" role="tab" id="apts-tab-${i}" aria-controls="apts-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" class="apts__tab">${esc(t(s.label))}</button>`).join('')}
    </div>
    ${R.aptSets.map((s, i) => `<div class="apts__panel" role="tabpanel" id="apts-panel-${i}" aria-labelledby="apts-tab-${i}"${i ? ' hidden' : ''}>
      ${fig(s.mix, { group: 'apts', sizes: '(min-width: 900px) 38vw, 94vw', cls: 'apts__mix fig--sheet' })}
      ${fig(s.plan, { group: 'apts', sizes: '(min-width: 900px) 50vw, 94vw', cls: 'apts__plan fig--sheet' })}
    </div>`).join('')}
  </section>

  <section class="elev" aria-labelledby="elev-h">
    <h2 class="h3 elev__h" id="elev-h">${esc(t(R.elevTitle))}</h2>
    ${fig('rcc-day', { group: 'rcc', sizes: '(min-width: 900px) 58vw, 100vw', cls: 'elev__day' })}
    ${fig('rcc-aerial', { group: 'rcc', sizes: '(min-width: 900px) 30vw, 60vw', cls: 'elev__aerial' })}
    ${fig('rcc-night-2', { group: 'rcc', sizes: '(min-width: 900px) 30vw, 60vw', cls: 'elev__night' })}
    ${fig('rcc-off-render', { group: 'rcc', sizes: '(min-width: 900px) 40vw, 90vw', cls: 'elev__office' })}
    ${fig('rcc-mall-site', { group: 'rcc', sizes: '(min-width: 900px) 40vw, 90vw', cls: 'elev__site fig--sheet' })}
    ${fig('rcc-section', { group: 'rcc', sizes: '(min-width: 900px) 40vw, 90vw', cls: 'elev__section fig--sheet' })}
  </section>`;
  },

  mrc(k) {
    const { t, esc, zoom, fig, cap } = k;
    const M = P.mrc;
    return `
  <section class="tilt" data-tilt aria-labelledby="tilt-h">
    <div class="tilt__track">
      <div class="tilt__stage">
        <div class="tilt__text">
          <h2 class="h3" id="tilt-h">${esc(t(M.compareTitle))}</h2>
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
    ${['mrc-night-b', 'mrc-street'].map((id, i) => `<figure class="descent__frame" data-descent-frame="${i}">${zoom(id, { group: 'mrc', sizes: '100vw' })}<figcaption class="fig__cap descent__cap">${cap(id)}</figcaption></figure>`).join('')}
  </section>
  <section class="sheet sheet--mrc" aria-labelledby="mrc-dr-h" data-tone="dawn">
    <h2 class="h3" id="mrc-dr-h">${esc(t(M.drawingsTitle))}</h2>
    ${fig('mrc-section-e', { group: 'mrc', sizes: '100vw', cls: 'sheet__wide' })}
    ${fig('mrc-section-n', { group: 'mrc', sizes: '(min-width: 900px) 60vw, 100vw', cls: 'sheet__half' })}
    ${fig('mrc-floor-plan', { group: 'mrc', sizes: '(min-width: 900px) 30vw, 80vw', cls: 'sheet__quarter' })}
    ${fig('mrc-shop-plan', { group: 'mrc', sizes: '(min-width: 900px) 50vw, 94vw', cls: 'sheet__third' })}
  </section>`;
  },

  fac(k) {
    const { t, esc, zoom, fig, cap } = k;
    return `
  <section class="wipe" data-wipe aria-label="${esc(t(P.fac.wipeTitle))}">
    <div class="wipe__track">
      <div class="wipe__stage">
        <div class="wipe__frame">
          <div class="wipe__layer wipe__layer--drawing">${zoom('fac-elevation', { group: 'fac', sizes: '(min-width: 900px) 80vw, 100vw' })}</div>
          <div class="wipe__layer wipe__layer--image" data-wipe-image>${zoom('fac-street', { group: 'fac', sizes: '(min-width: 900px) 80vw, 100vw' })}</div>
          <span class="wipe__line" data-wipe-line aria-hidden="true"></span>
        </div>
        <p class="wipe__caps" aria-hidden="true"><span>${cap('fac-elevation')}</span><span>${cap('fac-street')}</span></p>
      </div>
    </div>
  </section>
  <section class="sheet sheet--fac">
    ${fig('fac-aerial', { group: 'fac', sizes: '(min-width: 900px) 56vw, 100vw', cls: 'sheet__aerial' })}
    ${fig('fac-site', { group: 'fac', sizes: '(min-width: 900px) 40vw, 94vw', cls: 'sheet__site' })}
    ${fig('fac-plans', { group: 'fac', sizes: '100vw', cls: 'sheet__plans' })}
    ${fig('fac-sec-n', { group: 'fac', sizes: '(min-width: 900px) 48vw, 100vw', cls: 'sheet__secn' })}
    ${fig('fac-sec-e', { group: 'fac', sizes: '(min-width: 900px) 48vw, 100vw', cls: 'sheet__sece' })}
  </section>`;
  },

  mvr(k) {
    const { t, esc, zoom, fig, cap } = k;
    const V = P.mvr;
    return `
  <section class="levels" data-levels aria-labelledby="levels-h">
    <div class="levels__track">
      <div class="levels__stage">
        <h2 class="h3 levels__h" id="levels-h">${esc(t(V.levelsTitle))}</h2>
        <figure class="levels__section fig">
          ${zoom('mvr-side-sec', { group: 'mvr', sizes: '(min-width: 900px) 46vw, 94vw' })}
          <span class="levels__band" data-levels-band aria-hidden="true"></span>
          <figcaption class="fig__cap">${cap('mvr-side-sec')}</figcaption>
        </figure>
        <ol class="levels__names" data-levels-names>${V.levels.map((l, i) => `<li data-level-name="${i}"${i === 0 ? ' class="is-on"' : ''}>${esc(t(l.name))}</li>`).join('')}</ol>
        <div class="levels__plans">
          ${V.levels.map((l, i) => `<figure class="levels__plan fig${i === 0 ? ' is-on' : ''}" data-levels-plan="${i}">${zoom(l.img, { group: 'mvr', sizes: '(min-width: 900px) 50vw, 94vw' })}<figcaption class="fig__cap">${cap(l.img)}</figcaption></figure>`).join('')}
        </div>
      </div>
    </div>
  </section>
  <section class="sheet sheet--mvr">
    ${fig('mvr-r2', { group: 'mvr', sizes: '100vw', cls: 'sheet__r2' })}
    ${fig('mvr-site-sec', { group: 'mvr', sizes: '100vw', cls: 'sheet__wide' })}
    ${fig('mvr-site-plan', { group: 'mvr', sizes: '(min-width: 900px) 64vw, 100vw', cls: 'sheet__siteplan' })}
    ${fig('mvr-elev', { group: 'mvr', sizes: '(min-width: 900px) 36vw, 100vw', cls: 'sheet__elev' })}
  </section>`;
  },

  villas(k) {
    const { t, esc, zoom, fig, cap } = k;
    const VV = P.villas;
    const levelStack = (levels) => `<ol class="vlevels" aria-hidden="true">${levels.slice().reverse().map(([n, v, y]) => `<li class="vlevels__row" style="--y:${y}"><span class="vlevels__name">${n}</span>${levelMark(v)}</li>`).join('')}</ol>`;
    const section = (id, group, levels) => `<figure class="villa__section fig" data-villa-section><div class="villa__secimg">${zoom(id, { group, sizes: '(min-width: 900px) 56vw, 80vw' })}${levelStack(levels)}</div><figcaption class="fig__cap">${cap(id)}</figcaption></figure>`;
    return `
  <section class="villa villa--one" aria-labelledby="v1-h">
    <h2 class="villa__h" id="v1-h">${esc(t(VV.one.title))}</h2>
    ${section('v1-section-a', 'v1', VV.one.levels)}
    ${fig('v1-plans', { group: 'v1', sizes: '(min-width: 900px) 56vw, 94vw', cls: 'villa__plans' })}
    ${fig('v1-section-b', { group: 'v1', sizes: '(min-width: 900px) 40vw, 94vw', cls: 'villa__sec2' })}
    ${fig('v1-massing', { group: 'v1', sizes: '(min-width: 900px) 30vw, 60vw', cls: 'villa__massing' })}
    ${fig('v1-site', { group: 'v1', sizes: '(min-width: 900px) 24vw, 46vw', cls: 'villa__site' })}
    ${fig('v1-plan-render', { group: 'v1', sizes: '(min-width: 900px) 30vw, 60vw', cls: 'villa__planr' })}
  </section>
  <section class="villa villa--two" aria-labelledby="v2-h">
    <h2 class="villa__h" id="v2-h">${esc(t(VV.two.title))}</h2>
    ${fig('v2-r2', { group: 'v2', sizes: '(min-width: 900px) 60vw, 100vw', cls: 'villa__hero' })}
    ${fig('v2-r1', { group: 'v2', sizes: '(min-width: 900px) 36vw, 94vw', cls: 'villa__r1' })}
    ${section('v2-section-a', 'v2', VV.two.levels)}
    ${fig('v2-plans', { group: 'v2', sizes: '(min-width: 900px) 56vw, 94vw', cls: 'villa__plans' })}
    ${fig('v2-section-b', { group: 'v2', sizes: '(min-width: 900px) 40vw, 94vw', cls: 'villa__sec2' })}
  </section>`;
  },

  cc(k) {
    const { t, esc, fig } = k;
    const C = P.cc;
    const step = (i) => `<p class="film__step"><span class="film__n">${i + 1}</span><span class="film__t">${esc(t(C.steps[i]))}</span></p>`;
    const frame = (inner, cls = '') => `<li class="film__frame ${cls}">${inner}</li>`;
    return `
  <section class="film" data-film aria-label="${esc(t(C.title))}">
    <div class="film__track">
      <div class="film__stage">
        <ol class="film__strip" data-film-strip>
          ${frame(step(0) + `<div class="film__drawing" aria-hidden="true"><svg viewBox="0 0 300 200"><path d="M20 160 L95 40 L150 120 L210 30 L280 150 Z"/><path d="M60 170 L140 70 L240 170"/><path d="M30 120 L270 120" class="dash"/></svg></div>`, 'film__frame--intro')}
          ${frame(fig('cc-model-1', { group: 'cc', sizes: '(min-width: 900px) 44vw, 86vw' }) + step(1))}
          ${frame(fig('cc-model-2', { group: 'cc', sizes: '(min-width: 900px) 44vw, 86vw' }) + step(2))}
          ${frame(fig('cc-sketch-1', { group: 'cc', sizes: '(min-width: 900px) 34vw, 80vw' }) + fig('cc-sketch-2', { group: 'cc', sizes: '(min-width: 900px) 34vw, 80vw' }) + step(3), 'film__frame--pair')}
          ${frame(fig('cc-aerial', { group: 'cc', sizes: '(min-width: 900px) 60vw, 92vw' }) + step(4), 'film__frame--wide')}
        </ol>
        <div class="film__progress" aria-hidden="true"><span data-film-progress></span></div>
      </div>
    </div>
  </section>
  <section class="sheet sheet--cc">
    ${fig('cc-site-plan', { group: 'cc', sizes: '(min-width: 900px) 44vw, 94vw', cls: 'sheet__ccsite' })}
    ${fig('cc-plan-g', { group: 'cc', sizes: '(min-width: 900px) 48vw, 94vw', cls: 'sheet__ccg' })}
    ${fig('cc-plan-1', { group: 'cc', sizes: '(min-width: 900px) 48vw, 94vw', cls: 'sheet__cc1' })}
    ${fig('cc-elev-a', { group: 'cc', sizes: '(min-width: 900px) 48vw, 94vw', cls: 'sheet__cce1' })}
    ${fig('cc-elev-b', { group: 'cc', sizes: '(min-width: 900px) 48vw, 94vw', cls: 'sheet__cce2' })}
    ${fig('cc-r1', { group: 'cc', sizes: '(min-width: 900px) 56vw, 100vw', cls: 'sheet__ccr1' })}
    ${fig('cc-r3', { group: 'cc', sizes: '(min-width: 900px) 36vw, 94vw', cls: 'sheet__ccr3' })}
    ${fig('cc-r2', { group: 'cc', sizes: '(min-width: 900px) 44vw, 94vw', cls: 'sheet__ccr2' })}
    ${fig('cc-r4', { group: 'cc', sizes: '(min-width: 900px) 48vw, 94vw', cls: 'sheet__ccr4' })}
  </section>`;
  },

  slv(k) {
    const { t, esc, zoom, fig } = k;
    const S = P.slv;
    return `
  <section class="concept" data-concept aria-labelledby="concept-h">
    <div class="concept__track">
      <div class="concept__stage">
        <h2 class="h3 concept__h" id="concept-h">${esc(t(S.conceptTitle))}</h2>
        <svg class="concept__svg" viewBox="0 0 600 400" data-concept-svg role="img" aria-label="${esc(S.concept.map((c) => t(c)).join(' → '))}"></svg>
        <ol class="concept__steps" data-concept-steps>${S.concept.map((c, i) => `<li${i === 0 ? ' class="is-on"' : ''}><span class="concept__n">${i + 1}</span>${esc(t(c))}</li>`).join('')}</ol>
      </div>
    </div>
  </section>
  <section class="slv-plan">
    ${fig('slv-site-plan', { group: 'slv', sizes: '(min-width: 900px) 34vw, 90vw', cls: 'slv-plan__site' })}
    ${fig('slv-r1', { group: 'slv', sizes: '(min-width: 900px) 62vw, 100vw', cls: 'slv-plan__aerial' })}
  </section>
  <section class="slv-views" aria-label="${esc(t(ui.views))}">
    ${['slv-r2', 'slv-r3', 'slv-r4'].map((id, i) => fig(id, { group: 'slv', sizes: '(min-width: 900px) 46vw, 100vw', cls: `slv-views__f slv-views__f--${i + 2}` })).join('')}
  </section>
  <section class="slv-buildings" aria-labelledby="slv-b-h">
    <h2 class="h3" id="slv-b-h">${esc(t(S.buildingsTitle))}</h2>
    <ul class="slv-buildings__list">
      ${S.buildings.map((b) => `<li>${zoom(b.img, { group: 'slv-dr', sizes: '(min-width: 900px) 46vw, 94vw', label: t(b.name) })}<p class="fig__cap">${esc(t(b.name))}</p></li>`).join('')}
    </ul>
  </section>`;
  },

  site(k) {
    const { t, esc, zoom, fig, num } = k;
    const T = P.site;
    const maxTotal = Math.max(...T.glass.rows.map((r) => r[3]));
    return `
  <section class="site-open" aria-label="${esc(t(T.title))}">
    ${fig('toki-osman', { group: 'site', sizes: '(min-width: 900px) 28vw, 70vw', cls: 'site-open__osman' })}
    ${fig('toki-court', { group: 'site', sizes: '(min-width: 900px) 44vw, 94vw', cls: 'site-open__court' })}
    ${fig('toki-mosque', { group: 'site', sizes: '(min-width: 900px) 22vw, 46vw', cls: 'site-open__mosque' })}
    ${fig('toki-roof', { group: 'site', sizes: '(min-width: 900px) 22vw, 46vw', cls: 'site-open__roof' })}
  </section>
  <section class="cases" aria-labelledby="cer-h">
    <header class="cases__head">
      <h2 class="h3" id="cer-h">${esc(t(T.ceramicTitle))}</h2>
      <p class="lead">${esc(t(T.ceramicText))}</p>
    </header>
    <ul class="pairs">
      ${T.ceramics.map((c) => `<li class="pair" data-pair>
        <p class="pair__code"><bdi>${c.code}</bdi></p>
        <div class="pair__frame">
          <figure class="pair__img pair__img--before" data-pair-before>${zoom(c.before, { group: 'cer', sizes: '(min-width: 900px) 30vw, 94vw' })}</figure>
          <figure class="pair__img pair__img--after" data-pair-after>${zoom(c.after, { group: 'cer', sizes: '(min-width: 900px) 30vw, 94vw' })}</figure>
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
      <h2 class="h3" id="leak-h">${esc(t(T.leakTitle))}</h2>
      <p class="lead">${esc(t(T.leakText))}</p>
    </header>
    <ol class="leaks">
      ${T.leaks.map((l) => `<li class="leak">
        ${fig(l.problem, { group: 'leak', sizes: '(min-width: 900px) 22vw, 46vw', cls: 'leak__problem' })}
        <p class="leak__fix"><span class="leak__code"><bdi>${esc(l.code)}</bdi></span><svg class="leak__arrow" viewBox="0 0 60 12" aria-hidden="true"><path d="M0 6h56M50 1l6 5-6 5"/></svg><span class="leak__name">${esc(t(l.fixName))}</span></p>
        ${fig(l.fix, { group: 'leak', sizes: '(min-width: 900px) 24vw, 46vw', cls: 'leak__after' })}
      </li>`).join('')}
    </ol>
  </section>
  <section class="docs" aria-labelledby="docs-h">
    <header class="cases__head">
      <h2 class="h3" id="docs-h">${esc(t(T.docsTitle))}</h2>
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
      ${fig('doc-overview-a', { group: 'docs', sizes: '(min-width: 900px) 22vw, 46vw', cls: 'docs__ph docs__ph--a' })}
      ${fig('doc-overview-b', { group: 'docs', sizes: '(min-width: 900px) 22vw, 46vw', cls: 'docs__ph docs__ph--b' })}
      ${fig('doc-defect', { group: 'docs', sizes: '(min-width: 900px) 22vw, 46vw', cls: 'docs__ph docs__ph--c' })}
      ${fig('doc-glass-table', { group: 'docs', sizes: '(min-width: 900px) 30vw, 70vw', cls: 'docs__ph docs__ph--d' })}
      ${fig('doc-ceramic-table', { group: 'docs', sizes: '(min-width: 900px) 50vw, 94vw', cls: 'docs__ph docs__ph--e' })}
    </div>
  </section>`;
  },
};

// ───────────────────────── page ─────────────────────────
export function renderPage({ lang, images, version, siteUrl = '', heroChunk = '', key = null }) {
  const k = kit({ lang, images, key });
  const { t, esc, base } = k;
  const meta = LANG_META[lang];
  const { header, viewer, langLinks } = chrome(k);
  const pr = key ? P[key] : null;

  const main = key
    ? `<article class="project project--${key}" data-tone="${projectTone[key]}" aria-labelledby="ptitle">
${projectHero(k, key, { note: key === 'site' ? `<p class="pintro__note">${esc(t(P.site.tokiNote))}</p>` : '' })}
${body[key](k)}
${nextBlock(k, key)}
</article>
${contact(k, langLinks)}`
    : `${homeBody(k)}
${contact(k, langLinks)}`;

  const title = key ? `${t(pr.title)} — ${t(person.name)}` : t(ui.metaTitle);
  const desc = key ? t(pr.summary) : t(ui.metaDescription);
  const here = (l) => pathFor(l, key);
  const alt = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${siteUrl ? siteUrl + here(l) : k.link(here(l))}">`).join('');
  const ogImg = key ? `img/${indexThumb[key]}-${images[indexThumb[key]].widths.find((w) => w >= 1200) || images[indexThumb[key]].widths.at(-1)}.webp` : `img/og-${lang}.jpg`;
  const og = siteUrl ? `<meta property="og:image" content="${siteUrl}${ogImg}"><meta property="og:url" content="${siteUrl}${here(lang)}">` : `<meta property="og:image" content="${base}${ogImg}">`;
  const fontPreload = lang === 'ar'
    ? `<link rel="preload" href="${base}assets/fonts/noto-kufi-arabic-arabic-wght-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="${base}assets/fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2" as="font" type="font/woff2" crossorigin>`
    : `<link rel="preload" href="${base}assets/fonts/archivo-latin-standard-normal.woff2" as="font" type="font/woff2" crossorigin>`;
  const ld = key
    ? { '@context': 'https://schema.org', '@type': 'CreativeWork', name: t(pr.title), description: t(pr.summary), inLanguage: lang, creator: { '@type': 'Person', name: person.fullName.en } }
    : {
      '@context': 'https://schema.org', '@type': 'Person',
      name: person.fullName.en, alternateName: [person.name.en, person.name.ar], jobTitle: t(person.role),
      email: `mailto:${person.email}`, telephone: person.phoneHref,
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Istanbul Gelişim University' }, knowsLanguage: ['ar', 'en', 'tr'],
      ...(siteUrl ? { url: siteUrl + here(lang), image: `${siteUrl}img/og-${lang}.jpg` } : {}),
    };
  const redirect = lang === 'en' && !key
    ? `<script>try{if(!localStorage.getItem('om-lang')&&!location.hash){var L=((navigator.languages&&navigator.languages[0])||navigator.language||'').slice(0,2).toLowerCase();if(L==='ar'||L==='tr'){localStorage.setItem('om-lang',L);location.replace(L+'/');}}}catch(e){}</script>`
    : '';
  const preload3d = !key && heroChunk ? `var l=d.createElement('link');l.rel='modulepreload';l.href='${base}assets/chunks/${heroChunk}';d.head.appendChild(l);` : '';

  return `<!doctype html>
<html lang="${lang}" dir="${meta.dir}" class="no-js${key ? ' is-project' : ' is-home'}">
<head>
<meta charset="utf-8">
${redirect}
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0E1A2B">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:locale" content="${lang === 'ar' ? 'ar_AR' : lang === 'tr' ? 'tr_TR' : 'en_US'}">
${og}
<meta name="twitter:card" content="summary_large_image">
${siteUrl ? `<link rel="canonical" href="${siteUrl}${here(lang)}">` : ''}
${alt}<link rel="alternate" hreflang="x-default" href="${siteUrl ? siteUrl + here('en') : k.link(here('en'))}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${base}favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">
${fontPreload}
<link rel="stylesheet" href="${base}assets/main.css?v=${version}">
<script>(function(d){var h=d.documentElement;h.classList.replace('no-js','js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){h.classList.add('motion');${preload3d}}})(document);</script>
<script type="module" src="${base}assets/main.js?v=${version}"></script>
</head>
<body data-lang="${lang}">
${header}
<main id="main">
${main}
</main>
${viewer}
</body>
</html>
`;
}
