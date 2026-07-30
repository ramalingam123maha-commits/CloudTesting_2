/* =============================================
   Spicy Kitchen — script.js
   All interactive behaviours across 3 pages
   ============================================= */

/* ── 1. NAVBAR — scroll sticky + hamburger ── */
(function () {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');

  if (!navbar) return;

  // Scroll: add/remove .scrolled class
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      // Keep scrolled on sub-pages that start with it
      if (!navbar.classList.contains('scrolled') || window.scrollY === 0) {
        if (!document.querySelector('.navbar.scrolled[id]')) {
          navbar.classList.remove('scrolled');
        }
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Auto-close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();

/* ── 2. SCROLL-TO-TOP BUTTON ── */
(function () {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── 3. SCROLL-REVEAL via IntersectionObserver ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach(el => io.observe(el));
})();

/* ── 4. ANIMATED STAT COUNTERS ── */
(function () {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => io.observe(el));
})();

/* ── 5. HERO FLOATING PARTICLES ── */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const emojis = ['🌶️', '🧄', '🌿', '🍋', '🫙', '🌰', '🍃', '🌾', '🧅', '🫚',
                  '✨', '🔥', '🍽️', '🥄', '🫕', '🍛', '🌱', '🌺'];

  for (let i = 0; i < 18; i++) {
    const span = document.createElement('span');
    span.className = 'particle';
    span.textContent = emojis[i % emojis.length];

    const size     = 14 + Math.random() * 18;          // 14–32px
    const left     = Math.random() * 100;               // 0–100%
    const duration = 10 + Math.random() * 14;           // 10–24s
    const delay    = -(Math.random() * duration);       // stagger

    span.style.cssText = `
      font-size: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(span);
  }
})();

/* ── 6. MENU FILTER (menu.html only) ── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sections   = document.querySelectorAll('.menu-section');
  if (!filterBtns.length) return;

  // Click → scroll to section
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (filter === 'all') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.getElementById(filter);
      if (target) {
        const offset = 140;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Scroll-spy: highlight active filter while scrolling
  function updateActiveFilter() {
    let current = 'all';
    const threshold = window.innerHeight * 0.25;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < threshold && rect.bottom > 0) {
        current = section.dataset.category;
      }
    });

    filterBtns.forEach(btn => {
      const isActive = btn.dataset.filter === current ||
        (current === 'all' && btn.dataset.filter === 'all');
      btn.classList.toggle('active', isActive);
    });
  }

  window.addEventListener('scroll', updateActiveFilter, { passive: true });
})();

/* ── 7. CART TOAST NOTIFICATION ── */
(function () {
  // Create toast element once
  const toast = document.createElement('div');
  toast.id = 'cartToast';
  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '24px',
    left:         '50%',
    transform:    'translateX(-50%) translateY(80px)',
    background:   'linear-gradient(135deg, #e63939, #ff7f2a)',
    color:        '#fff',
    padding:      '12px 28px',
    borderRadius: '50px',
    fontSize:     '.9rem',
    fontWeight:   '700',
    zIndex:       '9999',
    boxShadow:    '0 8px 32px rgba(230,57,57,.5)',
    transition:   'transform .3s ease, opacity .3s ease',
    opacity:      '0',
    pointerEvents:'none',
    whiteSpace:   'nowrap',
  });
  document.body.appendChild(toast);

  let hideTimer = null;

  function showToast(name) {
    toast.textContent = `✅ "${name}" added to your order!`;
    toast.style.transform   = 'translateX(-50%) translateY(0)';
    toast.style.opacity     = '1';
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(80px)';
      toast.style.opacity   = '0';
    }, 2400);
  }

  // Delegate click on all .add-btn elements
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;

    const card = btn.closest('.dish-card, .menu-item');
    const name = card ? (card.querySelector('h3')?.textContent || 'Item') : 'Item';

    showToast(name);

    // Brief button feedback
    btn.textContent = '✓';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
      btn.textContent = '+';
      btn.style.background = '';
    }, 900);
  });
})();

/* ── 8. CONTACT FORM VALIDATION ── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const reset   = document.getElementById('resetForm');
  if (!form) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getError(field) {
    let err = field.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      Object.assign(err.style, {
        display:   'block',
        fontSize:  '.78rem',
        color:     '#ef4444',
        marginTop: '4px',
      });
      field.parentElement.appendChild(err);
    }
    return err;
  }

  function validateField(field) {
    const err = getError(field);
    const val = field.value.trim();

    if (field.required && !val) {
      err.textContent = `${field.labels?.[0]?.textContent?.replace('*','').trim() || 'This field'} is required.`;
      field.style.borderColor = '#ef4444';
      return false;
    }
    if (field.type === 'email' && val && !emailRe.test(val)) {
      err.textContent = 'Please enter a valid email address.';
      field.style.borderColor = '#ef4444';
      return false;
    }
    err.textContent = '';
    field.style.borderColor = '#22c55e';
    return true;
  }

  // Blur-time validation
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.style.borderColor === 'rgb(239, 68, 68)') validateField(field);
    });
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('input, select, textarea').forEach(field => {
      if (!validateField(field)) valid = false;
    });
    if (!valid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled    = true;
    submitBtn.textContent = '⏳ Sending…';

    setTimeout(() => {
      form.style.display    = 'none';
      if (success) success.style.display = 'block';
    }, 1200);
  });

  // Reset
  if (reset) {
    reset.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('input, select, textarea').forEach(f => {
        f.style.borderColor = '';
        const err = f.parentElement.querySelector('.field-error');
        if (err) err.textContent = '';
      });
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled    = false;
        submitBtn.textContent = '✉️ Send Message';
      }
      form.style.display    = '';
      if (success) success.style.display = 'none';
    });
  }
})();
