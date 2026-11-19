/**
 * YSN WORKS — SERVICES CONTROLLER (services.js)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Services specific scroll animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.from('.pricing-card', {
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.pricing-grid',
          start: 'top 85%'
        }
      });
    }
  });

})();
