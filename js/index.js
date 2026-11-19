/**
 * YSN WORKS — HOME PAGE CONTROLLER (index.js)
 * Manages Home Specific Animations, Hero Interactions, and Currency Integration
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initHeroTilt();
  });

  function initHeroTilt() {
    const portraitFrame = document.querySelector('.hero-portrait-frame');
    if (!portraitFrame || window.innerWidth < 1024) return;

    window.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth) - 0.5;
      const mouseY = (e.clientY / window.innerHeight) - 0.5;

      if (typeof gsap !== 'undefined') {
        gsap.to(portraitFrame, {
          x: mouseX * 18,
          y: mouseY * 18,
          duration: 0.5,
          ease: 'power1.out'
        });
      }
    });
  }

})();
