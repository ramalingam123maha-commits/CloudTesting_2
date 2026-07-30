/* ================================================
   Spicy Kitchen — script.js
   Shared JavaScript for all 3 pages
   ================================================ */

'use strict';

/* ── 1. NAVBAR ── */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar || !hamburger || !navLinks) return;

  /* Scroll-sticky */
  window.addEventListener('scroll', function () {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      /* Only remove on index.html (hero pages) — other pages keep .scrolled via HTML */
      if (!navbar.classList.contains('page-nav')) {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  /* Hamburger toggle */
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  /* Close on link click */
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* Close on outside click */
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ── 2. SCROLL-TO-TOP BUTTON ── */
(function () {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── 3. SCROLL-REVEAL ── */
(function () {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(function (el) { observer.observe(el); });
})();

/* ── 4. ANIMATED STAT COUNTERS ── */
(function () {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (!statNumbers.length) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = Math.min(now - start, duration);
      const progress = easeOutCubic(elapsed / duration);
      const current  = Math.round(progress * target);
      el.textContent = current.toLocaleString();
      if (elapsed < duration) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (el) { observer.observe(el); });
})();

/* ── 5. HERO FLOATING PARTICLES ── */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const emojis = ['🌶️','🧄','🌿','🫙','🍛','🍗','🥗','🌾','⭐','🔥','🧅','🫓','🍚','🥭','☕','🌹','🧀','🍮'];

  emojis.forEach(function (emoji) {
    const span = document.createElement('span');
    span.classList.add('particle');
    span.textContent = emoji;
    span.style.fontSize       = (14 + Math.random() * 18) + 'px';
    span.style.left           = (Math.random() * 100) + '%';
    span.style.animationDuration = (10 + Math.random() * 14) + 's';
    span.style.animationDelay    = '-' + (Math.random() * 12) + 's';
    container.appendChild(span);
  });
})();

/* ── 6. MENU FILTER + SCROLL-SPY ── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sections   = document.querySelectorAll('.menu-section[data-category]');
  if (!filterBtns.length || !sections.length) return;

  /* Click → scroll to section */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.getElementById(filter);
      if (target) {
        const offset = target.getBoundingClientRect().top + window.scrollY - 140;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  /* Scroll-spy: highlight active filter based on scroll position */
  window.addEventListener('scroll', function () {
    let current = 'all';
    sections.forEach(function (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.25) {
        current = section.getAttribute('data-category');
      }
    });
    filterBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === current);
    });
  }, { passive: true });
})();

/* ── 7. ADD-TO-ORDER CART TOAST ── */
(function () {
  /* Create toast element once */
  const toast = document.createElement('div');
  toast.id = 'cartToast';
  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '80px',
    right:        '24px',
    background:   'linear-gradient(135deg, #e63939, #ff7f2a)',
    color:        '#fff',
    padding:      '12px 22px',
    borderRadius: '50px',
    fontWeight:   '700',
    fontSize:     '.88rem',
    boxShadow:    '0 6px 24px rgba(230,57,57,.5)',
    zIndex:       '9999',
    opacity:      '0',
    transform:    'translateY(12px)',
    transition:   'opacity .3s ease, transform .3s ease',
    pointerEvents: 'none',
  });
  document.body.appendChild(toast);

  let hideTimer;

  function showToast(name) {
    clearTimeout(hideTimer);
    toast.textContent = '🛒 ' + name + ' added to order!';
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';
    hideTimer = setTimeout(function () {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateY(12px)';
    }, 2400);
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;

    /* Get dish name from sibling h3 */
    const card = btn.closest('.dish-card, .menu-item');
    const name = card ? (card.querySelector('h3') || {}).textContent || 'Item' : 'Item';

    /* Button feedback */
    const original = btn.textContent;
    btn.textContent = '✓';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    setTimeout(function () {
      btn.textContent = original;
      btn.style.background = '';
    }, 900);

    showToast(name);
  });
})();

/* ── 8. CONTACT FORM VALIDATION ── */
(function () {
  const form       = document.getElementById('contactForm');
  const success    = document.getElementById('formSuccess');
  const resetBtn   = document.getElementById('resetBtn');
  const submitBtn  = document.getElementById('submitBtn');
  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getError(field) {
    const id = 'err-' + field.id;
    let span = document.getElementById(id);
    if (!span) {
      span = document.createElement('span');
      span.id = id;
      span.style.cssText = 'color:#ff6b6b;font-size:.75rem;margin-top:4px;display:block;';
      field.parentNode.appendChild(span);
    }
    return span;
  }

  function validate(field) {
    const err = getError(field);
    const val = field.value.trim();

    if (field.hasAttribute('required') && !val) {
      field.style.borderColor = '#e63939';
      err.textContent = 'This field is required.';
      return false;
    }
    if (field.type === 'email' && val && !EMAIL_RE.test(val)) {
      field.style.borderColor = '#e63939';
      err.textContent = 'Please enter a valid email address.';
      return false;
    }
    field.style.borderColor = 'rgba(34,197,94,.6)';
    err.textContent = '';
    return true;
  }

  /* Blur-time validation */
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur',  function () { validate(field); });
    field.addEventListener('input', function () { if (getError(field).textContent) validate(field); });
  });

  /* Submit */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let allValid = true;
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      if (!validate(field)) allValid = false;
    });
    if (!allValid) return;

    submitBtn.textContent = '⏳ Sending…';
    submitBtn.disabled = true;

    setTimeout(function () {
      form.style.display    = 'none';
      success.style.display = 'block';
    }, 1200);
  });

  /* Reset */
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      form.querySelectorAll('input, select, textarea').forEach(function (f) {
        f.style.borderColor = '';
        const err = document.getElementById('err-' + f.id);
        if (err) err.textContent = '';
      });
      submitBtn.textContent = '✉️ Send Message';
      submitBtn.disabled = false;
      success.style.display = 'none';
      form.style.display    = '';
    });
  }
})();
