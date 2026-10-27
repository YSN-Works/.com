// Active nav state + smooth scroll
const links = document.querySelectorAll('.nav .link');
links.forEach(l => l.addEventListener('click', e => {
    links.forEach(x => x.classList.remove('active'));
    l.classList.add('active');
    document.getElementById('nav').classList.remove('open');
}));

// Mobile menu
document.getElementById('burger').addEventListener('click', () =>
    document.getElementById('nav').classList.toggle('open'));


/* ========================================================== */
/* ===================== FADE-UP ON SCROLL ====================== */
/* ========================================================== */

const fadeEls = document.querySelectorAll('[data-fade]');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));


/* ========================================================== */
/* ============== HERO SLIDE-OUT ON SCROLL =================== */
/* ========================================================== */

const heroContent = document.querySelector('.hero .content');
const heroPortrait = document.querySelector('.hero .portrait');

const mediaQuery = window.matchMedia('(min-width: 761px)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateHeroSlide() {
    if (!mediaQuery.matches || reduceMotion.matches) {
        if (heroContent) {
            heroContent.style.transform = '';
            heroContent.style.opacity = '';
        }
        if (heroPortrait) {
            heroPortrait.style.transform = '';
            heroPortrait.style.opacity = '';
        }
        return;
    }

    const vh = window.innerHeight;
    let progress = window.scrollY / vh;
    progress = Math.max(0, Math.min(1, progress));

    const slideDistance = 120;

    if (heroContent) {
        heroContent.style.transform = `translateX(${-progress * slideDistance}%)`;
        heroContent.style.opacity = String(1 - progress);
    }
    if (heroPortrait) {
        heroPortrait.style.transform = `translateX(${progress * slideDistance}%)`;
        heroPortrait.style.opacity = String(1 - progress);
    }
}

let ticking = false;
function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateHeroSlide();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateHeroSlide);
mediaQuery.addEventListener('change', updateHeroSlide);

updateHeroSlide();


/* ========================================================== */
/* ===================== FOOTER YEAR ============================ */
/* ========================================================== */

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ========================================================== */
/* =================== CONTACT CONFIG WIRING ===================== */
/* ========================================================== */
/* Centralizes WhatsApp URL + email address so changing
   window.CONTACT_CONFIG in index.html updates every link site-wide. */

if (window.CONTACT_CONFIG) {
    document.querySelectorAll('.whatsapp-link').forEach(a => {
        a.setAttribute('href', window.CONTACT_CONFIG.whatsappUrl);
    });

    document.querySelectorAll('.email-link').forEach(a => {
        const existing = a.getAttribute('href') || '';
        const subjectMatch = existing.match(/subject=([^&]*)/);
        const subjectParam = subjectMatch ? `?subject=${subjectMatch[1]}` : '';
        a.setAttribute('href', `mailto:${window.CONTACT_CONFIG.recipientEmail}${subjectParam}`);
    });

    const accessKeyInput = document.querySelector('input[name="access_key"]');
    if (accessKeyInput) accessKeyInput.value = window.CONTACT_CONFIG.web3formsAccessKey;
}


/* ========================================================== */
/* =================== CONTACT FORM (Web3Forms) =================== */
/* ========================================================== */

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.contact-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText ? btnText.textContent : 'Send Message';

        submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending...';
        formNote.classList.remove('show', 'success', 'error');

        const formData = new FormData(contactForm);

        // If subject left empty, give it a sensible default
        if (!formData.get('subject')) {
            formData.set('subject', 'New Project Inquiry — YSN Works Portfolio');
        }

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' }
            });

            const result = await response.json();

            if (result.success) {
                formNote.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
                formNote.classList.add('show', 'success');
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Something went wrong.');
            }
        } catch (err) {
            formNote.textContent = "Oops! Something went wrong. Please try again or email me directly.";
            formNote.classList.add('show', 'error');
        } finally {
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = originalText;
        }
    });
}