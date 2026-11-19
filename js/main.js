/**
 * YSN WORKS — CORE APPLICATION ENGINE (main.js)
 * Refined Crimson — Editorial Luxury Architecture
 * Features: Lenis Smooth Scroll, GSAP Sync, Theme Manager, Currency Engine,
 * Custom Magnetic Cursor, Liquid Navigation, Liquid Page Transitions, Toast UI.
 */

window.YSN = window.YSN || {};

(function () {
  'use strict';

  // --- 01. THEME MANAGER ---
  const ThemeManager = {
    STORAGE_KEY: 'ysn_theme',
    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY) || 'dark';
      this.applyTheme(saved);
      this.bindEvents();
    },
    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
      this.updateIcon(theme);
    },
    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const target = current === 'dark' ? 'light' : 'dark';
      this.applyTheme(target);
      YSN.showToast(`Switched to ${target === 'dark' ? 'Dark' : 'Light'} Mode`, '✦');
    },
    updateIcon(theme) {
      const toggles = document.querySelectorAll('.theme-toggle');
      toggles.forEach(btn => {
        btn.innerHTML = '';

        // Force button layout (overrides any GSAP or external style interference)
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.padding = '0';
        btn.style.lineHeight = '0';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.style.display = 'block';
        svg.style.flexShrink = '0';
        svg.style.pointerEvents = 'none';

        if (theme === 'light') {
          svg.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
          btn.setAttribute('aria-label', 'Switch to Dark Mode');
        } else {
          svg.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
          btn.setAttribute('aria-label', 'Switch to Light Mode');
        }
        btn.appendChild(svg);
      });
    },
    bindEvents() {
      document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.theme-toggle');
        if (toggleBtn) {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }
  };

  // --- 02. CURRENCY CONVERSION ENGINE ---
  const CurrencyEngine = {
    STORAGE_KEY: 'ysn_currency',
    // Realistic conversion rates configuration (editable approx rates)
    RATES: {
      PKR: { rate: 1, symbol: 'Rs. ', decimals: 0 },
      USD: { rate: 1 / 278, symbol: '$', decimals: 0 },
      GBP: { rate: 1 / 355, symbol: '£', decimals: 0 },
      EUR: { rate: 1 / 300, symbol: '€', decimals: 0 },
      AED: { rate: 1 / 75.7, symbol: 'AED ', decimals: 0 },
      SAR: { rate: 1 / 74.1, symbol: 'SAR ', decimals: 0 }
    },
    init() {
      this.current = localStorage.getItem(this.STORAGE_KEY) || 'PKR';
      this.updateAllPrices();
      this.bindEvents();
    },
    setCurrency(code) {
      if (!this.RATES[code]) return;
      this.current = code;
      localStorage.setItem(this.STORAGE_KEY, code);
      this.updateAllPrices();
      window.dispatchEvent(new CustomEvent('ysn:currency_changed', { detail: { currency: code } }));
      YSN.showToast(`Pricing updated to ${code}`, '💱');
    },
    formatPrice(basePkr) {
      const conf = this.RATES[this.current] || this.RATES.PKR;
      const converted = basePkr * conf.rate;
      const formattedNum = conf.decimals > 0 
        ? converted.toFixed(conf.decimals) 
        : Math.round(converted).toLocaleString();
      return `${conf.symbol}${formattedNum}`;
    },
    updateAllPrices() {
      // Update all elements with [data-base-price-pkr]
      const priceEls = document.querySelectorAll('[data-base-price-pkr]');
      priceEls.forEach(el => {
        const base = parseFloat(el.getAttribute('data-base-price-pkr')) || 0;
        el.textContent = this.formatPrice(base);
      });

      // Update active state on currency buttons
      const buttons = document.querySelectorAll('.currency-btn');
      buttons.forEach(btn => {
        const c = btn.getAttribute('data-currency');
        if (c === this.current) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    },
    bindEvents() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.currency-btn');
        if (btn) {
          e.preventDefault();
          const targetCurrency = btn.getAttribute('data-currency');
          if (targetCurrency) {
            this.setCurrency(targetCurrency);
          }
        }
      });
    }
  };
  window.YSN.Currency = CurrencyEngine;

  // --- 03. LENIS SMOOTH SCROLL INTEGRATION ---
  function initLenisScroll() {
    if (typeof Lenis === 'undefined') return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false
    });

    window.YSN.lenis = lenis;

    // Harmonize with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // --- 04. CUSTOM CURSOR & MAGNETIC PHYSICS ---
  function initCustomCursor() {
    // Only enable on desktop screens
    if (window.innerWidth < 1024 || 'ontouchstart' in window) return;

    let dot = document.querySelector('.cursor-dot');
    let ring = document.querySelector('.cursor-follower');

    if (!dot || !ring) {
      dot = document.createElement('div');
      dot.className = 'cursor-dot';
      ring = document.createElement('div');
      ring.className = 'cursor-follower';
      document.body.appendChild(dot);
      document.body.appendChild(ring);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    function updateFollower() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(updateFollower);
    }
    updateFollower();

    // Hover detection
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, .btn, input, textarea, select, .magnetic-wrap');
      if (target) {
        document.body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('a, button, .btn, input, textarea, select, .magnetic-wrap');
      if (target) {
        document.body.classList.remove('cursor-hover');
      }
    });

    initMagneticElements();
  }

  function initMagneticElements() {
    // Exclude .theme-toggle and .nav-brand from heavy magnetic movement
    // (these small elements break layout when translated)
    const magnetics = document.querySelectorAll('.magnetic-wrap:not(.theme-toggle):not(.nav-brand), .social-icon-btn');
    magnetics.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;

        if (typeof gsap !== 'undefined') {
          gsap.to(el, { x: deltaX, y: deltaY, duration: 0.3, ease: 'power2.out' });
        }
      });

      el.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        }
      });
    });
  }

  // --- 05. NAVIGATION & MOBILE DRAWER ---
  function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar?.classList.add('nav-scrolled');
      } else {
        navbar?.classList.remove('nav-scrolled');
      }
    }, { passive: true });

    highlightActiveNav();

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('is-open');
        if (isOpen) {
          closeMobileDrawer();
        } else {
          openMobileDrawer();
        }
      });

      mobileDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileDrawer);
      });
    }

    function openMobileDrawer() {
      mobileToggle.classList.add('is-active');
      mobileDrawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      if (typeof gsap !== 'undefined') {
        gsap.fromTo('.mobile-drawer-link',
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
        );
      }
    }

    function closeMobileDrawer() {
      mobileToggle?.classList.remove('is-active');
      mobileDrawer?.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.YSN.lenis) {
          window.YSN.lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  function highlightActiveNav() {
    const path = window.location.pathname.toLowerCase();
    const links = document.querySelectorAll('.nav-link, .mobile-drawer-link');

    links.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href')?.toLowerCase() || '';

      if (path.endsWith('/') || path.endsWith('index.html') || path === '') {
        if (href.includes('index.html') || href === '/' || href === './index.html') {
          link.classList.add('active');
        }
      } else if (href.includes('about') && path.includes('about')) {
        link.classList.add('active');
      } else if (href.includes('portfolio') && path.includes('portfolio')) {
        link.classList.add('active');
      } else if (href.includes('services') && path.includes('services')) {
        link.classList.add('active');
      } else if (href.includes('products') && path.includes('products')) {
        link.classList.add('active');
      } else if (href.includes('faq') && path.includes('faq')) {
        link.classList.add('active');
      } else if (href.includes('contact') && path.includes('contact')) {
        link.classList.add('active');
      }
    });
  }

  // --- 06. SVG LIQUID PAGE TRANSITIONS ---
  function initLiquidTransitions() {
    let curtain = document.querySelector('.page-transition-curtain');
    if (!curtain) {
      curtain = document.createElement('div');
      curtain.className = 'page-transition-curtain';
      curtain.innerHTML = `
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path id="transitionPath" d="M 0 100 V 100 Q 50 100 100 100 V 100 Z" />
        </svg>
      `;
      document.body.appendChild(curtain);
    }

    const path = document.getElementById('transitionPath');

    if (typeof gsap !== 'undefined' && path) {
      gsap.set(path, { attr: { d: 'M 0 0 V 100 Q 50 100 100 100 V 0 Z' } });
      gsap.timeline()
        .to(path, {
          duration: 0.5,
          ease: 'power3.in',
          attr: { d: 'M 0 0 V 0 Q 50 100 100 0 V 0 Z' }
        })
        .to(path, {
          duration: 0.35,
          ease: 'power2.out',
          attr: { d: 'M 0 0 V 0 Q 50 0 100 0 V 0 Z' },
          onComplete: () => {
            curtain.style.pointerEvents = 'none';
          }
        });
    }

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const target = link.getAttribute('target');

      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || target === '_blank' || href.startsWith('javascript:')) {
        return;
      }

      const isInternal = !href.startsWith('http') || href.includes(window.location.hostname);
      if (!isInternal) return;

      e.preventDefault();
      curtain.style.pointerEvents = 'all';

      if (typeof gsap !== 'undefined' && path) {
        gsap.timeline({
          onComplete: () => {
            window.location.href = href;
          }
        })
        .set(path, { attr: { d: 'M 0 100 V 100 Q 50 100 100 100 V 100 Z' } })
        .to(path, {
          duration: 0.45,
          ease: 'power3.in',
          attr: { d: 'M 0 100 V 40 Q 50 0 100 40 V 100 Z' }
        })
        .to(path, {
          duration: 0.35,
          ease: 'power2.out',
          attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 Z' }
        });
      } else {
        window.location.href = href;
      }
    });
  }

  // --- 07. MINIMAL PRELOADER ---
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const hasLoaded = sessionStorage.getItem('ysn_preloader_done');
    if (hasLoaded && window.location.pathname.includes('/pages/')) {
      preloader.style.display = 'none';
      return;
    }

    let progress = 0;
    const bar = preloader.querySelector('.preloader-bar');
    const counter = preloader.querySelector('.preloader-counter');

    const timer = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 12;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);

        if (bar) bar.style.width = '100%';
        if (counter) counter.textContent = '100%';

        setTimeout(() => {
          if (typeof gsap !== 'undefined') {
            gsap.to(preloader, {
              yPercent: -100,
              duration: 0.7,
              ease: 'power4.inOut',
              onComplete: () => {
                preloader.style.display = 'none';
                sessionStorage.setItem('ysn_preloader_done', 'true');
                window.dispatchEvent(new CustomEvent('ysn:preloader_finished'));
              }
            });
          } else {
            preloader.style.display = 'none';
            sessionStorage.setItem('ysn_preloader_done', 'true');
          }
        }, 200);
      } else {
        if (bar) bar.style.width = `${progress}%`;
        if (counter) counter.textContent = `${progress}%`;
      }
    }, 45);
  }

  // --- 08. GLOBAL TOAST NOTIFICATIONS ---
  YSN.showToast = function (message, icon = '✦') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="color:var(--accent-crimson); font-size:1.1rem;">${icon}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  };

  // Lifecycle
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    CurrencyEngine.init();
    initLenisScroll();
    initCustomCursor();
    initNavigation();
    initLiquidTransitions();
    initPreloader();
  });

})();
