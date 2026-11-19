/**
 * YSN WORKS — PORTFOLIO CONTROLLER (portfolio.js)
 * Loads real projects from ../data/projects.json and handles category filter tabs.
 */

(function () {
  'use strict';

  let allProjects = [];

  document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioProjects();
    setupCategoryFiltering();
  });

  async function loadPortfolioProjects() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    try {
      const response = await fetch('../data/projects.json');
      if (!response.ok) throw new Error('Could not load projects.json');
      allProjects = await response.json();
      renderProjects(allProjects);
    } catch (err) {
      console.warn('Portfolio load fallback', err);
    }
  }

  function renderProjects(projects) {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    grid.innerHTML = '';

    projects.forEach((proj) => {
      const card = document.createElement('div');
      card.className = 'portfolio-card';
      card.setAttribute('data-category', proj.category);

      const techHtml = proj.techStack ? proj.techStack.map(t => `
        <span class="tech-tag">${t}</span>
      `).join('') : '';

      card.innerHTML = `
        <div class="portfolio-thumb clip-reveal-polygon">
          <img src="${proj.thumbnail}" alt="${proj.title}" loading="lazy">
        </div>
        <div class="portfolio-body">
          <div class="portfolio-tags">
            <span class="portfolio-cat">${proj.category}</span>
          </div>
          <h3 class="portfolio-title">${proj.title}</h3>
          <p class="portfolio-desc">${proj.shortDesc}</p>
          <div class="portfolio-tech-list">${techHtml}</div>
          <div class="portfolio-footer">
            ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-outline">
              <span>Live Site</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>` : ''}
            <a href="https://wa.me/923079649008?text=Hello%20Yaseen!%20I%20am%20interested%20in%20a%20project%20similar%20to%20${encodeURIComponent(proj.title)}" target="_blank" rel="noopener" class="btn btn-sm btn-primary">
              <span>Inquire Similar</span>
            </a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    if (window.YSN && window.YSN.Animations) {
      window.YSN.Animations.initClipPathReveals();
      window.YSN.Animations.init3DParallax();
    }
  }

  function setupCategoryFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-filter');
        if (cat === 'all') {
          renderProjects(allProjects);
        } else {
          const filtered = allProjects.filter(p => p.category.toLowerCase().includes(cat.toLowerCase()));
          renderProjects(filtered);
        }
      });
    });
  }

})();
