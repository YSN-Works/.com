/**
 * YSN WORKS — CONTACT CONTROLLER (contact.js)
 * Field validation & direct WhatsApp message formatting (+923079649008)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initCopyEmail();
    prefillServiceFromUrl();
  });

  function prefillServiceFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const pkg = urlParams.get('package');
    if (pkg) {
      const radio = document.querySelector(`input[name="serviceType"][value="${pkg}"]`);
      if (radio) radio.checked = true;
    }
  }

  function initCopyEmail() {
    const copyBtn = document.getElementById('copyEmailBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('111.limitra.pk@gmail.com').then(() => {
          if (window.YSN && window.YSN.showToast) {
            window.YSN.showToast('Copied 111.limitra.pk@gmail.com to clipboard!', '📋');
          }
        });
      });
    }
  }

  function initContactForm() {
    const form = document.getElementById('inquiryForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      const nameInput = document.getElementById('clientName');
      const nameGroup = nameInput.closest('.form-group');
      if (!nameInput.value.trim()) {
        nameGroup.classList.add('has-error');
        isValid = false;
      } else {
        nameGroup.classList.remove('has-error');
      }

      const emailInput = document.getElementById('clientEmail');
      const emailGroup = emailInput.closest('.form-group');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        emailGroup.classList.remove('has-error');
      }

      const subjectInput = document.getElementById('clientSubject');
      const subjectGroup = subjectInput.closest('.form-group');
      if (!subjectInput.value.trim()) {
        subjectGroup.classList.add('has-error');
        isValid = false;
      } else {
        subjectGroup.classList.remove('has-error');
      }

      const messageInput = document.getElementById('clientMessage');
      const messageGroup = messageInput.closest('.form-group');
      if (messageInput.value.trim().length < 8) {
        messageGroup.classList.add('has-error');
        isValid = false;
      } else {
        messageGroup.classList.remove('has-error');
      }

      if (!isValid) {
        if (window.YSN && window.YSN.showToast) {
          window.YSN.showToast('Please fill all required fields.', '⚠️');
        }
        return;
      }

      const service = form.querySelector('input[name="serviceType"]:checked')?.value || 'General Inquiry';
      const budget = form.querySelector('input[name="budget"]:checked')?.value || 'Not specified';

      // Assemble the exact formatted message requested
      const messageText = 
`Hello Yaseen!
I am interested in your services.
Name: ${nameInput.value.trim()}
Email: ${emailInput.value.trim()}
Subject: ${subjectInput.value.trim()}
Service: ${service}
Budget: ${budget}

Project Details:
${messageInput.value.trim()}

I would like to discuss this project with you.`;

      const whatsappUrl = `https://wa.me/923079649008?text=${encodeURIComponent(messageText)}`;

      if (window.YSN && window.YSN.showToast) {
        window.YSN.showToast('Opening WhatsApp with your project brief...', '💬');
      }

      // Open WhatsApp window with pre-typed text
      window.open(whatsappUrl, '_blank');
    });
  }

})();
