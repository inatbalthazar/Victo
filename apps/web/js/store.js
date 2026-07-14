/* =================================================================
   VICTO — Landing page interactions (index.html)
   Vanilla JS · no frameworks
   ================================================================= */
(function () {
  'use strict';

  /* ---- Sticky nav shadow on scroll ---- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
  });
  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
    });
  });

  /* ---- Scroll-spy: highlight active nav link ---- */
  const linkMap = {};
  navLinks.querySelectorAll('a').forEach(a => {
    const id = a.getAttribute('href');
    if (id && id.startsWith('#') && id.length > 1) linkMap[id.slice(1)] = a;
  });
  const sections = Object.keys(linkMap)
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          Object.values(linkMap).forEach(a => a.classList.remove('active'));
          if (linkMap[id]) linkMap[id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const revealer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => revealer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close all (single-open accordion)
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---- Smooth-scroll fallback for in-page anchors ---- */
  // Native CSS scroll-behavior handles this, but ensure nav closes & target is reachable.
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', id);
        }
      }
    });
  });
})();
