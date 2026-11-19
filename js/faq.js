/**
 * YSN WORKS — FAQ CONTROLLER (faq.js)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initAccordions();
    initFaqSearch();
    initCategoryTabs();
  });

  function initAccordions() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.contains('is-open');

        if (isOpen) {
          item.classList.remove('is-open');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('is-open');
          answer.style.maxHeight = `${answer.scrollHeight + 20}px`;
        }
      });
    });
  }

  function initFaqSearch() {
    const searchInput = document.getElementById('faqSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll('.faq-item');
      const groups = document.querySelectorAll('.faq-accordion-group');

      items.forEach(item => {
        const qText = item.querySelector('.faq-question').textContent.toLowerCase();
        const aText = item.querySelector('.faq-answer-inner').textContent.toLowerCase();

        if (qText.includes(q) || aText.includes(q)) {
          item.style.display = 'block';
          if (q.length > 2) {
            item.classList.add('is-open');
            const answer = item.querySelector('.faq-answer');
            answer.style.maxHeight = `${answer.scrollHeight + 20}px`;
          }
        } else {
          item.style.display = 'none';
        }
      });

      groups.forEach(g => {
        const visible = g.querySelectorAll('.faq-item:not([style*="display: none"])');
        g.style.display = visible.length === 0 ? 'none' : 'block';
      });
    });
  }

  function initCategoryTabs() {
    const tabs = document.querySelectorAll('.faq-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.getAttribute('data-category');
        const groups = document.querySelectorAll('.faq-accordion-group');

        groups.forEach(g => {
          if (cat === 'all' || g.getAttribute('data-group') === cat) {
            g.style.display = 'block';
          } else {
            g.style.display = 'none';
          }
        });
      });
    });
  }

})();
