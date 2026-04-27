/* ══════════════════════════════════════════════════════
   Asesorías Externas — Main JS
   Micro-interactions, Scroll Animations, Counter, Form
══════════════════════════════════════════════════════ */

'use strict';

// ── 1. Navbar Scroll Behavior ────────────────────────────────
const navbar = document.getElementById('navbar');

const handleNavScroll = () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleNavScroll, { passive: true });


// ── 2. Mobile Menu Toggle ────────────────────────────────────
const menuToggle  = document.getElementById('menuToggle');
const mobileMenu  = document.getElementById('mobileMenu');
let menuOpen = false;

const openMenu = () => {
  menuOpen = true;
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Cerrar menú');
  // Animate hamburger → X
  const bars = menuToggle.querySelectorAll('span');
  bars[0].style.transform = 'translateY(7px) rotate(45deg)';
  bars[1].style.opacity   = '0';
  bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
};

const closeMenu = () => {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  const bars = menuToggle.querySelectorAll('span');
  bars[0].style.transform = '';
  bars[1].style.opacity   = '';
  bars[2].style.transform = '';
};

menuToggle.addEventListener('click', () => {
  menuOpen ? closeMenu() : openMenu();
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) closeMenu();
});


// ── 3. Smooth Scroll for Anchor Links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


// ── 4. Intersection Observer — Reveal on Scroll ──────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


// ── 5. Animated Counters ─────────────────────────────────────
const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

const animateCounter = (el, target, duration = 1800) => {
  const start      = performance.now();
  const startValue = 0;
  const suffix     = el.closest('.trust-stat')
    ? (target === 98 ? '' : '')
    : '';

  const tick = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current  = Math.round(easeOutQuart(progress) * (target - startValue) + startValue);
    el.textContent = current.toLocaleString('es-CL');
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString('es-CL');
  };

  requestAnimationFrame(tick);
};

// Observe counter elements and trigger when visible
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-count]').forEach(el => {
  el.textContent = '0';
  counterObserver.observe(el);
});

// Also animate the stat numbers in the nosotros section
document.querySelectorAll('.counter').forEach(el => {
  // These are already rendered with text; reset for animation
  const target = parseInt(el.dataset.count, 10);
  el.dataset.count = target;
  el.textContent   = '0';
  counterObserver.observe(el);
});


// ── 6. Contact Form — Client-Side Handling ───────────────────
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');
const submitBtn     = document.getElementById('form-submit-btn');

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const showError = (input, message) => {
  clearError(input);
  input.style.borderColor = '#EF4444';
  input.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.15)';
  const err  = document.createElement('span');
  err.className   = 'field-error';
  err.style.cssText = 'font-size:11px;color:#DC2626;margin-top:4px;display:block;';
  err.textContent = message;
  input.parentNode.appendChild(err);
};

const clearError = (input) => {
  input.style.borderColor = '';
  input.style.boxShadow   = '';
  const existing = input.parentNode.querySelector('.field-error');
  if (existing) existing.remove();
};

const resetFieldOnFocus = (input) => {
  input.addEventListener('focus', () => clearError(input), { once: true });
};

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;

  const nombre  = document.getElementById('nombre');
  const email   = document.getElementById('email');
  const servicio = document.getElementById('servicio');

  // Validate nombre
  if (!nombre.value.trim() || nombre.value.trim().length < 2) {
    showError(nombre, 'Por favor ingresa tu nombre completo.');
    resetFieldOnFocus(nombre);
    valid = false;
  }

  // Validate email
  if (!email.value.trim() || !validateEmail(email.value)) {
    showError(email, 'Por favor ingresa un email válido.');
    resetFieldOnFocus(email);
    valid = false;
  }

  // Validate servicio
  if (!servicio.value) {
    showError(servicio, 'Por favor selecciona un servicio.');
    resetFieldOnFocus(servicio);
    valid = false;
  }

  if (!valid) return;

  // Simulate async submission
  submitBtn.disabled     = true;
  submitBtn.textContent  = 'Enviando…';
  submitBtn.style.opacity = '0.75';

  await new Promise(resolve => setTimeout(resolve, 1200));

  // Show success state
  contactForm.style.display   = 'none';
  formSuccess.style.display   = 'block';

  // Scroll to success message
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
});


// ── 7. Service Card Keyboard Accessibility ───────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('focused');
    }
  });
});


// ── 8. Parallax Subtle Effect on Hero ───────────────────────
const heroBgPattern = document.querySelector('.hero-bg-pattern');

if (heroBgPattern && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBgPattern.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
}


// ── 9. Active Nav Link Indicator on Scroll ───────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--teal-400)'
            : '';
        });
      }
    });
  },
  { threshold: 0.45 }
);

sections.forEach(sec => sectionObserver.observe(sec));


// ── 10. Init ─────────────────────────────────────────────────
handleNavScroll();
console.log('✅ Asesorías Externas — site loaded');
