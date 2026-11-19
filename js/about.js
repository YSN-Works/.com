/**
 * YSN WORKS — ABOUT CONTROLLER (about.js)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.from('.about-journey-step', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-journey-container',
        start: 'top 85%'
      }
    });
  });
})();
