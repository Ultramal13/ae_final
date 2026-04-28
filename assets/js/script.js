/**
 * ============================================================
 * ASESORÍAS EXTERNAS — script.js
 * Animaciones, interacciones y utilidades
 * ============================================================
 */

'use strict';

/* ============================================================
   1. PARTÍCULAS DE FONDO
   ============================================================ */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = window.innerWidth < 768 ? 20 : 50;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';

        const size = Math.random() * 3 + 1;
        p.style.cssText = `
            left: ${Math.random() * 100}%;
            top:  ${Math.random() * 100}%;
            width:  ${size}px;
            height: ${size}px;
            opacity: ${Math.random() * .5 + .1};
            animation: float-particle ${15 + Math.random() * 12}s ease-in-out infinite;
            animation-delay: -${Math.random() * 20}s;
        `;
        fragment.appendChild(p);
    }
    container.appendChild(fragment);
}

/* ============================================================
   2. NAVBAR — sticky + scroll effect
   ============================================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = debounce(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, 10);

    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   3. MOBILE MENU
   ============================================================ */
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        toggle.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', open);
    });

    // Close on any link click
    menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.classList.remove('active');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            menu.classList.remove('open');
            toggle.classList.remove('active');
        }
    });
}

/* ============================================================
   4. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

/* ============================================================
   5. FLIP CARDS (mobile tap support)
   ============================================================ */
function initFlipCards() {
    const cards = document.querySelectorAll('.service-card-flip');

    cards.forEach(card => {
        // Touch / click flip for mobile and tablets
        card.addEventListener('click', () => {
            if (window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth <= 900) {
                card.classList.toggle('flipped');
            }
        });
    });
}

/* ============================================================
   6. SCROLL REVEAL (Intersection Observer)
   ============================================================ */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const delay = parseInt(entry.target.dataset.delay || 0);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);

            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ============================================================
   7. ANIMATED COUNTERS
   ============================================================ */
function animateCounter(el, target, duration = 2500) {
    const startTime = performance.now();
    const start = 0;

    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        const current = Math.round(start + (target - start) * eased);

        el.textContent = current >= 1000
            ? current.toLocaleString('es-CL')
            : current;

        if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
}

function initCounters() {
    // Hero inline stats
    const heroStats = document.querySelectorAll('.stat-num[data-target]');
    const bigCounters = document.querySelectorAll('.counter[data-target]');

    const allCounters = [...heroStats, ...bigCounters];
    if (!allCounters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    allCounters.forEach(el => observer.observe(el));
}

function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/* ============================================================
   8. CONTACT FORM
   ============================================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;

        btn.textContent = 'Enviando...';
        btn.disabled = true;

        // Simulate async send (replace with actual fetch/API)
        setTimeout(() => {
            btn.textContent = '✅ ¡Enviado!';

            if (success) {
                success.classList.add('show');
                success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            setTimeout(() => {
                form.reset();
                btn.textContent = original;
                btn.disabled = false;
                if (success) success.classList.remove('show');
            }, 5000);
        }, 1200);
    });
}

/* ============================================================
   9. PARALLAX BACKGROUND (subtle)
   ============================================================ */
function initParallax() {
    const parallaxImg = document.querySelector('.parallax-img');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (parallaxImg) {
                    const rect = parallaxImg.parentElement.getBoundingClientRect();
                    // Si el contenedor está en pantalla
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const yPos = (window.innerHeight - rect.top) * 0.15;
                        parallaxImg.style.transform = `translateY(-${yPos}px)`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ============================================================
   10. ACTIVE NAV LINK on scroll
   ============================================================ */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const isActive = link.getAttribute('href') === `#${id}`;
                    link.style.color = isActive ? 'var(--p-300)' : '';
                });
            }
        });
    }, { threshold: 0.45 });

    sections.forEach(s => observer.observe(s));
}

/* ============================================================
   11. TYPING ANIMATION
   ============================================================ */
function initTypingAnimation() {
    const elements = document.querySelectorAll('.type-writer');
    if (!elements.length) return;

    const typeEffect = (el) => {
        // Use textContent to preserve all whitespace characters
        const fullText = el.getAttribute('data-text') || el.textContent;
        
        if (!el.getAttribute('data-text')) {
            el.setAttribute('data-text', fullText);
        }
        
        el.textContent = '';
        el.classList.add('is-typing');
        el.classList.remove('typing-done');

        setTimeout(() => {
            el.classList.add('visible-typing');
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < fullText.length) {
                    el.textContent += fullText.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                    el.classList.add('typing-done');
                }
            }, 70 + Math.random() * 50);
        }, 300);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeEffect(entry.target);
                // We might want to re-type if it leaves and comes back, 
                // but usually once is better for titles.
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.8,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ============================================================
   UTILITY: debounce
   ============================================================ */
function debounce(fn, wait) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
}

/* ============================================================
   INIT — run everything on DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initFlipCards();
    initScrollReveal();
    initCounters();
    initContactForm();
    initParallax();
    initActiveNav();
    initTypingAnimation();
});
