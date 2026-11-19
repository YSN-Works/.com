/**
 * YSN WORKS — DIGITAL PRODUCTS CONTROLLER (products.js)
 * Prepared data-driven engine ready to render products from products.json when added.
 * Integrates currency engine for PKR, USD, GBP, EUR, AED, SAR.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
  });

  async function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    try {
      const response = await fetch('../data/products.json');
      if (!response.ok) throw new Error('Could not fetch products.json');
      const products = await response.json();

      if (!products || products.length === 0) {
        // Subtle, elegant "Products Coming Soon" state as requested
        container.innerHTML = `
          <div class="products-empty-state">
            <span class="empty-state-badge">DIGITAL STORE VAULT</span>
            <h2 class="empty-state-title">Digital Products Releasing Soon.</h2>
            <p class="empty-state-desc">
              Curated website templates, creative developer components, and editing presets are currently being prepared. Check back soon or message directly for custom setups.
            </p>
            <div style="margin-top: 1rem;">
              <a href="https://wa.me/923079649008?text=Hello%20Yaseen!%20I%20am%20interested%20in%20your%20upcoming%20digital%20products" target="_blank" rel="noopener" class="btn btn-primary magnetic-wrap">
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        `;
      } else {
        // Ready structure for future products
        container.className = 'products-grid';
        container.innerHTML = products.map(p => `
          <div class="glass-card" style="padding: 1.5rem;">
            <div style="aspect-ratio: 16/10; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 1.25rem;">
              <img src="${p.thumbnail}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${p.name}</h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.25rem;">${p.shortDesc}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
              <span class="price-amount" style="font-size: 1.5rem;" data-base-price-pkr="${p.pricePkr || 0}">
                ${window.YSN.Currency ? window.YSN.Currency.formatPrice(p.pricePkr || 0) : 'Rs. ' + p.pricePkr}
              </span>
              <a href="product-details.html?id=${p.id}" class="btn btn-sm btn-primary">Details</a>
            </div>
          </div>
        `).join('');

        if (window.YSN.Currency) {
          window.YSN.Currency.updateAllPrices();
        }
      }
    } catch (err) {
      console.warn('Products load note:', err);
    }
  }

})();
