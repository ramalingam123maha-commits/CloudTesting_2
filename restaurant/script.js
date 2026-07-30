/* ================================================
   Spicy Kitchen — script.js
   8 self-contained IIFE modules
   ================================================ */

/* ── 1. NAVBAR: scroll-sticky + hamburger ── */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  function syncScrolled () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      /* Only remove on home page (no persistent .scrolled class in HTML) */
      if (!navbar.classList.contains('always-scrolled')) {
        navbar.classList.remove('scrolled');
      }
    }
  }
  window.addEventListener('scroll', syncScrolled, { passive: true });
  syncScrolled();

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    /* Auto-close when a link is clicked */
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
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
  }
}());

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
}());

/* ── 3. SCROLL-REVEAL via IntersectionObserver ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
}());

/* ── 4. ANIMATED STAT COUNTERS ── */
(function () {
  const statEls = document.querySelectorAll('.stat-number[data-count]');
  if (!statEls.length) return;

  function easeOutCubic (t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter (el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start    = performance.now();

    function tick (now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(function (el) { io.observe(el); });
}());

/* ── 5. HERO FLOATING PARTICLES ── */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const emojis = ['🌶️','🍛','🧄','🌿','🫙','🔥','⭐','🍗','🥗','🫓','🍮','☕','🥭','🌾','🧅','🍢','🍚','🧀'];

  emojis.forEach(function (emoji, i) {
    const span    = document.createElement('span');
    span.className = 'particle';
    span.textContent = emoji;
    span.style.left       = (Math.random() * 95) + '%';
    span.style.fontSize   = (14 + Math.random() * 18) + 'px';
    span.style.animationDuration  = (10 + Math.random() * 14) + 's';
    span.style.animationDelay     = (-Math.random() * 12) + 's';
    container.appendChild(span);
  });
}());

/* ── 6. MENU FILTER + SCROLL-SPY ── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sections   = document.querySelectorAll('.menu-section[data-category]');
  if (!filterBtns.length || !sections.length) return;

  const OFFSET = 140; /* navbar (68px) + filter bar (~50px) + buffer */

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      if (filter === 'all') {
        window.scrollTo({ top: sections[0].getBoundingClientRect().top + window.scrollY - OFFSET, behavior: 'smooth' });
        return;
      }
      const target = document.getElementById(filter);
      if (target) {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - OFFSET, behavior: 'smooth' });
      }
    });
  });

  /* Scroll-spy: highlight active filter based on scroll position */
  window.addEventListener('scroll', function () {
    let current = 'all';
    const viewportTrigger = window.scrollY + window.innerHeight * 0.25 + OFFSET;
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top + window.scrollY <= viewportTrigger) {
        current = sec.dataset.category;
      }
    });
    filterBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.filter === current);
    });
  }, { passive: true });
}());

/* ── 7. CART TOAST (add-btn click) ── */
(function () {
  const addBtns = document.querySelectorAll('.add-btn');
  if (!addBtns.length) return;

  /* Create toast element */
  const toast = document.createElement('div');
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '80px',
    right:        '24px',
    padding:      '12px 22px',
    background:   'linear-gradient(135deg, #e63939, #ff7f2a)',
    color:        '#fff',
    borderRadius: '50px',
    fontWeight:   '700',
    fontSize:     '.88rem',
    boxShadow:    '0 6px 20px rgba(230,57,57,.45)',
    transform:    'translateY(20px)',
    opacity:      '0',
    transition:   'opacity .3s ease, transform .3s ease',
    zIndex:       '9999',
    pointerEvents:'none',
  });
  document.body.appendChild(toast);

  let hideTimer = null;

  function showToast (name) {
    clearTimeout(hideTimer);
    toast.textContent = '🛒 Added: ' + name;
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';
    hideTimer = setTimeout(function () {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateY(20px)';
    }, 2400);
  }

  addBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const card = btn.closest('.dish-card, .menu-item');
      const name = card ? (card.querySelector('h3') || { textContent: 'Item' }).textContent : 'Item';

      /* Visual feedback on button */
      const orig = btn.textContent;
      btn.textContent = '✓';
      btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      setTimeout(function () {
        btn.textContent = orig;
        btn.style.background = '';
      }, 900);

      showToast(name.trim());
    });
  });
}());

/* ── 8. CONTACT FORM VALIDATION + SUBMIT ── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const resetBtn= document.getElementById('resetBtn');
  const submitBtn=document.getElementById('submitBtn');
  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getErrorEl (input) {
    let err = input.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      Object.assign(err.style, { color: '#e63939', fontSize: '.75rem', marginTop: '4px', display: 'block' });
      input.parentElement.appendChild(err);
    }
    return err;
  }

  function validateField (input) {
    const err = getErrorEl(input);
    if (input.required && !input.value.trim()) {
      err.textContent = 'This field is required.';
      input.style.borderColor = '#e63939';
      return false;
    }
    if (input.type === 'email' && input.value.trim() && !EMAIL_RE.test(input.value.trim())) {
      err.textContent = 'Please enter a valid email address.';
      input.style.borderColor = '#e63939';
      return false;
    }
    err.textContent = '';
    input.style.borderColor = '';
    return true;
  }

  /* Blur-time validation */
  form.querySelectorAll('input, select, textarea').forEach(function (input) {
    input.addEventListener('blur',  function () { validateField(input); });
    input.addEventListener('input', function () { validateField(input); });
  });

  /* Submit */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (input) {
      if (!validateField(input)) valid = false;
    });
    if (!valid) return;

    /* Simulate async submit */
    submitBtn.textContent = '⏳ Sending…';
    submitBtn.disabled = true;
    setTimeout(function () {
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    }, 1200);
  });

  /* Reset */
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      form.querySelectorAll('.field-error').forEach(function (el) { el.textContent = ''; });
      form.querySelectorAll('input, select, textarea').forEach(function (el) { el.style.borderColor = ''; });
      submitBtn.textContent = '✉️ Send Message';
      submitBtn.disabled = false;
      success.style.display = 'none';
      form.style.display = 'block';
    });
  }
}());
