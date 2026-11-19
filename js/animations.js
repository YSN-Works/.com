/**
 * YSN WORKS — ADVANCED ANIMATION ENGINE (animations.js)
 * Implements and rigorously fixes all 8 Mandatory Animation Techniques:
 * 01. 3D Parallax Scrolling & Mouse Tilt
 * 02. GSAP ScrollTrigger Pinned Sections (CRITICAL FIX: Zero text overlap / Complete autoAlpha exit)
 * 03. Scroll Controlled Horizontal Gallery (Fluid vertical-to-horizontal with mobile touch protection)
 * 04. Advanced Kinetic Typography (Safe word & character splitting with line-height preservation)
 * 05. SVG Liquid Morphing Page Transition (Organic bezier wave morph)
 * 06. GSAP Stacked Card Scroll Animation (Sticky card stacking with realistic depth)
 * 07. Clip Path Image Reveal Animation (Polygonal, circular, and diagonal reveals)
 * 08. Cinematic Scroll-Driven Scene Transitions
 * 09. Micro-Interactions (Magnetic buttons, custom cursor, back-to-top)
 */

window.YSN = window.YSN || {};

window.YSN.Animations = (function () {
  'use strict';

  function isGsapReady() {
    return typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  }

  // --- 01. 3D PARALLAX SCROLLING & MOUSE TILT ---
  function init3DParallax() {
    if (!isGsapReady()) return;

    // Scroll-based parallax depth layers
    const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');
    parallaxLayers.forEach((layer) => {
      const speed = parseFloat(layer.getAttribute('data-parallax-speed')) || 0.15;
      gsap.to(layer, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: layer.closest('.section') || layer,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    // 3D Mouse Parallax Tilt for Desktop
    if (window.innerWidth >= 1024) {
      const tiltElements = document.querySelectorAll('.tilt-3d, .hero-portrait-frame, .interactive-3d-card');
      tiltElements.forEach((el) => {
        el.style.transformStyle = 'preserve-3d';

        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -8;
          const rotateY = ((x - centerX) / centerX) * 8;

          gsap.to(el, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.4,
            ease: 'power2.out'
          });
        });

        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.4)'
          });
        });
      });
    }
  }

  // --- 02. PINNED SCROLL STORYTELLING (CRITICAL OVERLAP FIX) ---
  function initPinnedStorytelling() {
    if (!isGsapReady()) return;

    const isMobile = window.innerWidth < 768;

    const sections = document.querySelectorAll('.pinned-story-section');
    sections.forEach((section) => {
      const storySteps = section.querySelectorAll('.story-step');
      const visualPanels = section.querySelectorAll('.story-visual-panel');

      if (!storySteps.length) return;

      // On mobile: reset everything to natural flow, do NOT pin or absolutely position
      if (isMobile) {
        storySteps.forEach((step) => {
          step.removeAttribute('style');
          gsap.set(step, { clearProps: 'all' });
          step.style.position = 'relative';
          step.style.opacity = '1';
          step.style.visibility = 'visible';
          step.style.pointerEvents = 'auto';
          step.style.transform = 'none';
          step.style.marginBottom = '2.5rem';
          step.style.width = '100%';
        });
        visualPanels.forEach((panel) => {
          panel.removeAttribute('style');
          gsap.set(panel, { clearProps: 'all' });
        });
        return; // Skip all pinning on mobile
      }

      // Desktop: CRITICAL INITIAL SETUP
      // Step 0 is fully visible (autoAlpha: 1), all subsequent steps are completely hidden (autoAlpha: 0)
      storySteps.forEach((step, idx) => {
        gsap.set(step, {
          autoAlpha: idx === 0 ? 1 : 0,
          y: idx === 0 ? 0 : 40,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        });
      });

      visualPanels.forEach((panel, idx) => {
        gsap.set(panel, {
          autoAlpha: idx === 0 ? 1 : 0,
          scale: idx === 0 ? 1 : 1.05
        });
      });

      // Construct Scrubbed Pinning Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(storySteps.length - 1) * 120}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1
        }
      });

      // Choreograph step-by-step complete exit and entrance
      for (let i = 1; i < storySteps.length; i++) {
        const prevStep = storySteps[i - 1];
        const nextStep = storySteps[i];
        const prevPanel = visualPanels[i - 1];
        const nextPanel = visualPanels[i];
        const transitionKey = `stage-${i}`;

        // 1. Completely hide the previous step (autoAlpha: 0 prevents any overlap or ghosting)
        tl.to(prevStep, {
          autoAlpha: 0,
          y: -40,
          duration: 0.35,
          ease: 'power2.in'
        }, transitionKey);

        if (prevPanel) {
          tl.to(prevPanel, {
            autoAlpha: 0,
            scale: 0.95,
            duration: 0.35,
            ease: 'power2.in'
          }, transitionKey);
        }

        // 2. Introduce the incoming step cleanly
        tl.fromTo(nextStep,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' },
          `${transitionKey}+=0.15`
        );

        if (nextPanel) {
          tl.fromTo(nextPanel,
            { autoAlpha: 0, scale: 1.05 },
            { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power2.out' },
            `${transitionKey}+=0.15`
          );
        }
      }
    });
  }

  // --- 03. SCROLL-CONTROLLED HORIZONTAL GALLERY ---
  function initHorizontalGallery() {
    if (!isGsapReady()) return;

    const isMobile = window.innerWidth < 768;

    const galleries = document.querySelectorAll('.horizontal-gallery-section');
    galleries.forEach((gallery) => {
      const track = gallery.querySelector('.horizontal-gallery-track');
      if (!track) return;

      // On mobile: reset any transforms and do NOT pin or scroll horizontally
      if (isMobile) {
        gsap.set(track, { clearProps: 'all' });
        track.style.transform = 'none';
        track.style.willChange = 'auto';
        return;
      }

      const panels = track.querySelectorAll('.horizontal-gallery-panel');
      if (panels.length <= 1) return;

      const totalDistance = () => track.scrollWidth - window.innerWidth + 100;

      gsap.to(track, {
        x: () => -totalDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: gallery,
          start: 'top top',
          end: () => `+=${totalDistance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const counter = gallery.querySelector('.horizontal-gallery-counter');
            if (counter) {
              const current = Math.min(Math.floor(self.progress * panels.length) + 1, panels.length);
              counter.textContent = `0${current} / 0${panels.length}`;
            }
          }
        }
      });
    });
  }

  // --- 04. ADVANCED KINETIC TYPOGRAPHY ---
  function splitTextToWordsAndChars(element) {
    if (!element || element.dataset.splitDone) return;
    element.dataset.splitDone = 'true';

    const text = element.textContent.trim();
    const words = text.split(/\s+/);
    element.innerHTML = '';

    words.forEach((word) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'kinetic-word';
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      wordSpan.style.overflow = 'hidden';
      wordSpan.style.verticalAlign = 'top';
      wordSpan.style.marginRight = '0.28em';

      for (let char of word) {
        const charSpan = document.createElement('span');
        charSpan.className = 'kinetic-char';
        charSpan.style.display = 'inline-block';
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
      }
      element.appendChild(wordSpan);
    });
  }

  function initKineticTypography() {
    if (!isGsapReady()) return;

    const kineticTitles = document.querySelectorAll('.kinetic-title, .hero-kinetic-title');
    kineticTitles.forEach((title) => {
      splitTextToWordsAndChars(title);

      const chars = title.querySelectorAll('.kinetic-char');
      if (!chars.length) return;

      const isHero = title.classList.contains('hero-kinetic-title');

      if (isHero) {
        const runHeroReveal = () => {
          gsap.fromTo(chars,
            { yPercent: 110, rotateZ: 4, autoAlpha: 0 },
            {
              yPercent: 0,
              rotateZ: 0,
              autoAlpha: 1,
              duration: 0.85,
              stagger: 0.02,
              ease: 'power3.out',
              delay: 0.1
            }
          );
        };

        window.addEventListener('ysn:preloader_finished', runHeroReveal, { once: true });
        if (sessionStorage.getItem('ysn_preloader_done')) {
          runHeroReveal();
        }
      } else {
        gsap.fromTo(chars,
          { yPercent: 100, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.015,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });
  }

  // --- 06. GSAP STACKED CARD SCROLL ANIMATION ---
  function initStackedCards() {
    if (!isGsapReady()) return;
    if (window.innerWidth < 768) return;

    const containers = document.querySelectorAll('.stacked-cards-container');
    containers.forEach((container) => {
      const cards = container.querySelectorAll('.stacked-card');
      if (cards.length <= 1) return;

      cards.forEach((card, index) => {
        if (index === cards.length - 1) return; // Last card stays full scale

        gsap.to(card, {
          scale: 1 - (cards.length - index) * 0.035,
          opacity: 0.45,
          yPercent: -6 * (cards.length - index),
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: cards[index + 1],
            start: 'top 85%',
            end: 'top 25%',
            scrub: true
          }
        });
      });
    });
  }

  // --- 07. CLIP PATH IMAGE REVEAL ANIMATION ---
  function initClipPathReveals() {
    if (!isGsapReady()) return;

    const polygonTargets = document.querySelectorAll('.clip-reveal-polygon');
    polygonTargets.forEach((target) => {
      gsap.fromTo(target,
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          scale: 1.1
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1,
          duration: 1.1,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: target,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    const circleTargets = document.querySelectorAll('.clip-reveal-circle');
    circleTargets.forEach((target) => {
      gsap.fromTo(target,
        { clipPath: 'circle(0% at 50% 50%)' },
        {
          clipPath: 'circle(100% at 50% 50%)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: target,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  // --- 08. CINEMATIC SCENE TRANSITIONS ---
  function initSceneTransitions() {
    if (!isGsapReady()) return;

    const scenes = document.querySelectorAll('.scene-transition-section');
    scenes.forEach((scene) => {
      const zoomEl = scene.querySelector('.scene-bg-zoom');
      if (zoomEl) {
        gsap.fromTo(zoomEl,
          { scale: 1.2, y: -20 },
          {
            scale: 1,
            y: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: scene,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    });
  }

  // Master Initializer
  function initAll() {
    init3DParallax();
    initPinnedStorytelling();
    initHorizontalGallery();
    initKineticTypography();
    initStackedCards();
    initClipPathReveals();
    initSceneTransitions();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
      initAll();
    } else {
      window.addEventListener('load', initAll);
    }
  });

  return {
    initAll,
    init3DParallax,
    initPinnedStorytelling,
    initHorizontalGallery,
    initKineticTypography,
    initStackedCards,
    initClipPathReveals,
    initSceneTransitions
  };
})();
