// Header: paper backdrop after the hero, hides while reading down, current-section label, progress gauge, menu.
export function initHud(ctx) {
  const { ScrollTrigger, lenis } = ctx;
  const hud = document.querySelector('[data-hud]');
  const now = document.querySelector('[data-now]');
  const nowWrap = now && now.parentElement;
  const hero = document.querySelector('[data-hero]');
  const gauge = document.querySelector('[data-gauge]');
  const menu = document.querySelector('[data-menu]');
  const openBtn = document.querySelector('[data-menu-open]');
  const navLinks = [...document.querySelectorAll('.hud__nav a')];

  // ── backdrop + hide on scroll down ──
  let lastY = window.scrollY, hidden = false;
  function onScroll() {
    const y = window.scrollY;
    const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight * 0.5 : 200;
    hud.classList.toggle('hud--paper', y > heroEnd);
    const dy = y - lastY;
    if (Math.abs(dy) > 6) {
      const shouldHide = dy > 0 && y > heroEnd + 300 && !document.body.classList.contains('menu-open');
      if (shouldHide !== hidden) { hidden = shouldHide; hud.classList.toggle('hud--hidden', hidden); }
      lastY = y;
    }
    if (gauge) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const h = gauge.parentElement.clientHeight - 12;
      gauge.style.setProperty('--y', `${(max > 0 ? y / max : 0) * h}px`);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (lenis) lenis.on('scroll', onScroll);
  onScroll();
  hud.addEventListener('focusin', () => { hidden = false; hud.classList.remove('hud--hidden'); });

  // ── current section ──
  const sections = [...document.querySelectorAll('main > article.project, main > section.practice, main > section.about, main > section.contact')];
  const navFor = (el) => {
    if (el.classList.contains('project')) return '#work';
    return `#${el.id}`;
  };
  sections.forEach((el) => {
    const title = el.querySelector('.project__title, .section-title');
    ScrollTrigger.create({
      trigger: el.id === 'rcc' ? '#rcc .rcc-role' : el, start: 'top 55%', end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) {
          if (now) { now.textContent = title ? title.textContent : ''; nowWrap.classList.add('is-on'); }
          navLinks.forEach((a) => (a.getAttribute('href') === navFor(el) ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
          ctx.currentSection = el.id;
        }
      },
    });
  });
  ScrollTrigger.create({
    trigger: hero || document.body, start: 'top top', end: 'bottom 40%',
    onToggle: (self) => { if (self.isActive && nowWrap) { nowWrap.classList.remove('is-on'); ctx.currentSection = ''; navLinks.forEach((a) => a.removeAttribute('aria-current')); } },
  });

  // ── menu ──
  if (!menu || !openBtn) return;
  const closeBtn = menu.querySelector('[data-menu-close]');
  const sheet = menu.querySelector('.menu__sheet');
  let lastFocus = null;
  const focusables = () => [...menu.querySelectorAll('a[href], button:not([disabled])')].filter((el) => el.offsetParent !== null);
  function open() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    document.body.classList.add('menu-open');
    openBtn.setAttribute('aria-expanded', 'true');
    lenis && lenis.stop();
    ctx.gsap.fromTo(sheet, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.out' });
    ctx.gsap.fromTo(menu.querySelectorAll('.menu__list li'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power3.out', delay: 0.1 });
    setTimeout(() => (menu.querySelector('.menu__list a') || closeBtn).focus(), 60);
  }
  function close() {
    if (menu.hidden) return;
    ctx.gsap.to(sheet, {
      clipPath: 'inset(0 0 100% 0)', duration: 0.45, ease: 'power3.in',
      onComplete: () => { menu.hidden = true; sheet.style.clipPath = ''; },
    });
    document.body.classList.remove('menu-open');
    openBtn.setAttribute('aria-expanded', 'false');
    lenis && lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  document.addEventListener('om:close-menu', close);
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') {
      const f = focusables(); if (!f.length) return;
      const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
  });
  const thumbs = [...menu.querySelectorAll('[data-thumb-for]')];
  menu.querySelectorAll('[data-thumb]').forEach((a) => {
    const on = () => thumbs.forEach((t) => t.classList.toggle('is-on', t.dataset.thumbFor === a.dataset.thumb));
    a.addEventListener('mouseenter', on); a.addEventListener('focus', on);
  });
}
