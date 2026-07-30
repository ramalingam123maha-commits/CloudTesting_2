/* ============================================================
   Spicy Kitchen — script.js
   ============================================================ */

'use strict';

/* ── Utilities ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. NAVBAR — scroll-to-solid + hamburger
   ============================================================ */
(function initNavbar() {
  const navbar    = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');

  if (!navbar) return;

  // Sticky style on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close when a link is clicked
    navLinks.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Highlight active nav link based on current page
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

/* ============================================================
   2. SCROLL-TO-TOP BUTTON
   ============================================================ */
(function initScrollTop() {
  const btn = $('#scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============================================================
   3. SCROLL REVEAL — IntersectionObserver
   ============================================================ */
(function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   4. ANIMATED COUNTERS (hero stats)
   ============================================================ */
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const DURATION = 2000;

  const animateCounter = el => {
    const target = parseInt(el.dataset.count, 10);
    const start  = performance.now();

    const tick = now => {
      const t = Math.min((now - start) / DURATION, 1);
      const val = Math.round(easeOut(t) * target);
      el.textContent = val >= 1000 ? val.toLocaleString() : val;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target >= 1000 ? target.toLocaleString() : target;
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. HERO FLOATING PARTICLES
   ============================================================ */
(function initParticles() {
  const container = $('#heroParticles');
  if (!container) return;

  const emojis = ['🌶️','🍅','🧄','🌿','🫚','🧅','🍋','🥬','🌰','🫛'];
  const TOTAL   = 18;

  for (let i = 0; i < TOTAL; i++) {
    const p   = document.createElement('span');
    p.classList.add('particle');
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const size     = 14 + Math.random() * 18;
    const left     = Math.random() * 100;
    const delay    = Math.random() * 12;
    const duration = 10 + Math.random() * 14;

    p.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(p);
  }
})();

/* ============================================================
   6. MENU PAGE — category filter
   ============================================================ */
(function initMenuFilter() {
  const filterBtns = $$('.filter-btn');
  const sections   = $$('.menu-section[data-category]');
  if (!filterBtns.length || !sections.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      sections.forEach(sec => {
        const show = filter === 'all' || sec.dataset.category === filter;
        sec.style.display = show ? '' : 'none';

        // Smooth scroll to the first visible section on mobile
        if (show && filter !== 'all') {
          setTimeout(() => {
            const offset = 120;
            const top    = sec.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }, 50);
        }
      });
    });
  });
})();

/* ============================================================
   7. ADD TO ORDER — toast notification
   ============================================================ */
(function initAddButtons() {
  const addBtns = $$('.add-btn');
  if (!addBtns.length) return;

  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '80px',
    left:         '50%',
    transform:    'translateX(-50%) translateY(20px)',
    background:   'linear-gradient(135deg, #e63939, #ff7f2a)',
    color:        '#fff',
    padding:      '12px 24px',
    borderRadius: '50px',
    fontWeight:   '700',
    fontSize:     '.88rem',
    boxShadow:    '0 8px 28px rgba(230,57,57,.45)',
    zIndex:       '9999',
    opacity:      '0',
    transition:   'opacity .3s, transform .3s',
    pointerEvents:'none',
    whiteSpace:   'nowrap',
  });
  document.body.appendChild(toast);

  let hideTimeout;

  const showToast = msg => {
    clearTimeout(hideTimeout);
    toast.textContent = msg;
    toast.style.opacity   = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    hideTimeout = setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2400);
  };

  addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.dish-card, .menu-item');
      const name = card ? (card.querySelector('h3')?.textContent || 'Item') : 'Item';
      const price = card ? (card.querySelector('.dish-price, .menu-price')?.textContent || '') : '';
      showToast(`🛒 Added: ${name} ${price}`);

      // Brief scale animation on the button
      btn.style.transform = 'scale(1.35)';
      setTimeout(() => { btn.style.transform = ''; }, 220);
    });
  });
})();

/* ============================================================
   8. CONTACT FORM — validation + success state
   ============================================================ */
(function initContactForm() {
  const form        = $('#contactForm');
  const successDiv  = $('#formSuccess');
  const resetBtn    = $('#resetForm');
  if (!form) return;

  // Helper: show / clear error
  const setError = (field, msg) => {
    let errEl = field.parentElement.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'field-error';
      Object.assign(errEl.style, { color: '#ff7070', fontSize: '.78rem', marginTop: '4px', display: 'block' });
      field.parentElement.appendChild(errEl);
    }
    if (msg) {
      errEl.textContent = msg;
      field.style.borderColor = '#e63939';
    } else {
      errEl.textContent = '';
      field.style.borderColor = '';
    }
  };

  const isEmpty = v => !v.trim();
  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Live validation on blur
  $$('[data-required], #firstName, #lastName, #email, #subject, #message', form).forEach(el => {
    el.addEventListener('blur', () => validateField(el));
  });

  const validateField = field => {
    const { id, value } = field;
    if (['firstName','lastName','message'].includes(id) && isEmpty(value)) {
      setError(field, 'This field is required.'); return false;
    }
    if (id === 'email') {
      if (isEmpty(value)) { setError(field, 'Email is required.'); return false; }
      if (!isEmail(value)) { setError(field, 'Please enter a valid email address.'); return false; }
    }
    if (id === 'subject' && !value) {
      setError(field, 'Please select a topic.'); return false;
    }
    setError(field, '');
    return true;
  };

  const validateAll = () => {
    const fields = [
      $('#firstName', form), $('#lastName', form),
      $('#email', form),     $('#subject', form),
      $('#message', form),
    ];
    return fields.every(f => f && validateField(f));
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateAll()) return;

    // Simulate async submission
    const btn = form.querySelector('[type="submit"]');
    const origText = btn.innerHTML;
    btn.disabled  = true;
    btn.innerHTML = '⏳ Sending…';

    setTimeout(() => {
      btn.disabled  = false;
      btn.innerHTML = origText;
      form.style.display    = 'none';
      successDiv.style.display = 'block';
    }, 1200);
  });

  // Reset form
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      $$('.field-error', form).forEach(el => { el.textContent = ''; });
      $$('input, select, textarea', form).forEach(el => { el.style.borderColor = ''; });
      form.style.display       = '';
      successDiv.style.display = 'none';
    });
  }
})();
