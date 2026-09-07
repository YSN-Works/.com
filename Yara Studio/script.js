const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const overlay = document.getElementById('themeOverlay');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

let currentTheme = 'dark';
let menuOpen = false;
let W, H, tick = 0;

// ════════════════════════════════════════
// GRID CANVAS
// ════════════════════════════════════════
function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

function drawGrid() {
    ctx.clearRect(0, 0, W, H);
    const cell = 60;
    const cols = Math.ceil(W / cell) + 1;
    const rows = Math.ceil(H / cell) + 1;
    const pulse = Math.sin(tick * 0.010) * 0.5 + 0.5;
    const isDark = currentTheme === 'dark';

    const lineAlpha = isDark ? 0.04 + pulse * 0.018 : 0.03 + pulse * 0.012;
    ctx.strokeStyle = isDark ? `rgba(255,255,255,${lineAlpha})` : `rgba(0,0,0,${lineAlpha})`;
    ctx.lineWidth = 0.6;

    for (let c = 0; c <= cols; c++) {
        ctx.beginPath(); ctx.moveTo(c * cell, 0); ctx.lineTo(c * cell, H); ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
        ctx.beginPath(); ctx.moveTo(0, r * cell); ctx.lineTo(W, r * cell); ctx.stroke();
    }

    for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
            const x = c * cell, y = r * cell;
            const dx = (x - W / 2) / W, dy = (y - H / 2) / H;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const fade = Math.max(0, 1 - dist * 2.2);
            const big = (c % 5 === 0) && (r % 5 === 0);
            const dotR = big ? 2.2 : 1.1;
            const alpha = isDark ? (big ? 0.2 : 0.08) + pulse * 0.06 : (big ? 0.13 : 0.05) + pulse * 0.04;

            ctx.beginPath();
            ctx.arc(x, y, dotR * fade + 0.3, 0, Math.PI * 2);
            ctx.fillStyle = big
                ? `rgba(21,101,255,${alpha * fade})`
                : isDark ? `rgba(255,255,255,${alpha * fade})` : `rgba(0,0,0,${alpha * fade})`;
            ctx.fill();
        }
    }

    const glowA = (isDark ? 0.028 : 0.016) + pulse * 0.016;
    ['h', 'v'].forEach(dir => {
        const g = dir === 'h' ? ctx.createLinearGradient(0, 0, W, 0) : ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, 'transparent');
        g.addColorStop(0.5, `rgba(21,101,255,${glowA})`);
        g.addColorStop(1, 'transparent');
        ctx.strokeStyle = g; ctx.lineWidth = 1;
        ctx.beginPath();
        if (dir === 'h') { ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); }
        else { ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); }
        ctx.stroke();
    });

    tick++;
    requestAnimationFrame(drawGrid);
}

resizeCanvas();
drawGrid();
window.addEventListener('resize', resizeCanvas, { passive: true });

// ════════════════════════════════════════
// THEME TOGGLE
// ════════════════════════════════════════
function toggleTheme(e) {
    addRipple(e, themeToggle);
    const x = e ? (e.clientX / window.innerWidth * 100) : 50;
    const y = e ? (e.clientY / window.innerHeight * 100) : 50;
    overlay.style.setProperty('--ox', x + '%');
    overlay.style.setProperty('--oy', y + '%');
    overlay.classList.add('active');
    setTimeout(() => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', currentTheme);
    }, 150);
    setTimeout(() => overlay.classList.remove('active'), 520);
}
themeToggle.addEventListener('click', toggleTheme);

// ════════════════════════════════════════
// MOBILE MENU
// ════════════════════════════════════════
function toggleMenu() {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
}
hamburger.addEventListener('click', toggleMenu);

document.addEventListener('click', (e) => {
    if (menuOpen && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        menuOpen = false;
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    }
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

// ════════════════════════════════════════
// RIPPLE
// ════════════════════════════════════════
function addRipple(e, target) {
    const el = target || e.currentTarget;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (e.clientX - rect.left) - size / 2;
    const y = (e.clientY - rect.top) - size / 2;
    const r = document.createElement('span');
    r.className = 'ripple';
    r.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    el.appendChild(r);
    setTimeout(() => r.remove(), 650);
}

document.querySelectorAll('.btn-glass, .social-btn, .nav-links a, .mobile-link, .footer-link, .logo, .footer-logo, .service-btn, .work-link-btn').forEach(el => {
    el.addEventListener('click', addRipple);
});

// ════════════════════════════════════════
// NAVBAR SCROLL
// ════════════════════════════════════════
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ════════════════════════════════════════
// SCROLL REVEAL
// ════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 70);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ════════════════════════════════════════
// COUNTER ANIMATION
// ════════════════════════════════════════
function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const dur = 2000;
    const start = performance.now();
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { animateCount(entry.target); counterObserver.unobserve(entry.target); }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ════════════════════════════════════════
// FAQ ACCORDION
// ════════════════════════════════════════
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// ════════════════════════════════════════
// CONTACT FORM — Web3Forms
// ════════════════════════════════════════
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitIcon = document.getElementById('submitIcon');
const submitText = document.getElementById('submitText');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI: loading state
    submitBtn.disabled = true;
    submitIcon.className = 'fa-solid fa-spinner fa-spin btn-icon';
    submitText.textContent = 'Sending...';
    formSuccess.classList.remove('show');
    formError.classList.remove('show');

    const formData = new FormData(contactForm);
    const object = {};
    formData.forEach((val, key) => { object[key] = val; });
    const json = JSON.stringify(object);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: json
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Success
            submitIcon.className = 'fa-solid fa-check btn-icon';
            submitText.textContent = 'Sent!';
            formSuccess.classList.add('show');
            contactForm.reset();

            setTimeout(() => {
                submitIcon.className = 'fa-solid fa-paper-plane btn-icon';
                submitText.textContent = 'Send Message';
                submitBtn.disabled = false;
                formSuccess.classList.remove('show');
            }, 5000);
        } else {
            throw new Error(result.message || 'Failed');
        }
    } catch (err) {
        // Error
        submitIcon.className = 'fa-solid fa-exclamation btn-icon';
        submitText.textContent = 'Try Again';
        formError.classList.add('show');
        submitBtn.disabled = false;

        setTimeout(() => {
            submitIcon.className = 'fa-solid fa-paper-plane btn-icon';
            submitText.textContent = 'Send Message';
            formError.classList.remove('show');
        }, 4000);
    }
});

// ════════════════════════════════════════
// SMOOTH SCROLL
// ════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ════════════════════════════════════════
// MOUSE PARALLAX
// ════════════════════════════════════════
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 15;
    const y = (e.clientY / window.innerHeight - 0.5) * 15;
    document.querySelectorAll('.orb').forEach((orb, i) => {
        const f = (i + 1) * 0.25;
        orb.style.transform = `translate(${x * f}px, ${y * f}px)`;
    });
}, { passive: true });

// ════════════════════════════════════════
// TILT ON CARDS
// ════════════════════════════════════════
function initTilt() {
    // Only on non-touch devices
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.service-card, .testi-card, .work-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translateY(-8px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }
}
initTilt();