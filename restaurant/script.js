/* ================================================
   Spicy Kitchen — script.js
   Shared JavaScript for all 3 pages
   ================================================ */

/* ── 1. NAVBAR ── */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  // Scroll: add/remove .scrolled class (skip pages that already have it)
  const alwaysScrolled = navbar.classList.contains('scrolled');
  if (!alwaysScrolled) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Auto-close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
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
})();

/* ── 2. SCROLL-TO-TOP ── */
(function () {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── 3. SCROLL REVEAL ── */
(function () {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length || !window.IntersectionObserver) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();

/* ── 4. ANIMATED STAT COUNTERS ── */
(function () {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length || !window.IntersectionObserver) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start    = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(easeOut(progress) * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ── 5. HERO PARTICLES ── */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const emojis = ['🌶️','🧄','🌿','🍛','🥘','🍗','🫙','🧅','🌾','🔥','✨','🍚','🥗','🍖','🫓','🧀','🍮','🥭'];
  const count  = 18;

  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.classList.add('particle');
    span.textContent = emojis[i % emojis.length];
    span.style.cssText = [
      `font-size: ${14 + Math.random() * 18}px`,
      `left: ${Math.random() * 100}%`,
      `animation-duration: ${10 + Math.random() * 14}s`,
      `animation-delay: ${-(Math.random() * 12)}s`,
    ].join(';');
    container.appendChild(span);
  }
})();

/* ── 6. MENU FILTER + SCROLL-SPY ── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sections   = document.querySelectorAll('.menu-section[data-category]');
  if (!filterBtns.length) return;

  // Click: scroll to section
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

  // Scroll-spy: highlight active filter button
  if (!sections.length) return;
  window.addEventListener('scroll', () => {
    const viewportMid = window.scrollY + window.innerHeight * 0.25;
    let current = 'all';

    sections.forEach(sec => {
      if (sec.offsetTop <= viewportMid) current = sec.dataset.category;
    });

    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === current);
    });
  }, { passive: true });
})();

/* ── 7. CART TOAST ── */
(function () {
  // Create toast element once
  const toast = document.createElement('div');
  toast.id = 'cartToast';
  Object.assign(toast.style, {
    position:       'fixed',
    bottom:         '28px',
    left:           '50%',
    transform:      'translateX(-50%) translateY(80px)',
    background:     'linear-gradient(135deg,#e63939,#ff7f2a)',
    color:          '#fff',
    padding:        '13px 28px',
    borderRadius:   '50px',
    fontWeight:     '700',
    fontSize:       '.9rem',
    boxShadow:      '0 6px 24px rgba(230,57,57,.5)',
    zIndex:         '9999',
    opacity:        '0',
    transition:     'opacity .3s, transform .3s',
    pointerEvents:  'none',
    whiteSpace:     'nowrap',
  });
  document.body.appendChild(toast);

  let hideTimer = null;

  function showToast(name) {
    toast.textContent = `🛒 "${name}" added to your order!`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(80px)';
    }, 2400);
  }

  // Event delegation on document
  document.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;

    const card = btn.closest('.dish-card, .menu-item');
    const name = card ? (card.querySelector('h3') || {}).textContent || 'Item' : 'Item';

    // Button feedback
    const original = btn.textContent;
    btn.textContent = '✓';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 900);

    showToast(name);
  });
})();

/* ── 8. CONTACT FORM ── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const resetBtn = document.getElementById('resetBtn');
  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getError(field) {
    const v = field.value.trim();
    if (field.required && !v) return 'This field is required.';
    if (field.type === 'email' && v && !EMAIL_RE.test(v)) return 'Please enter a valid email address.';
    return '';
  }

  function showError(field, msg) {
    let span = field.parentElement.querySelector('.field-error');
    if (!span) {
      span = document.createElement('span');
      span.className = 'field-error';
      Object.assign(span.style, { color: '#ef4444', fontSize: '.78rem', marginTop: '4px', display: 'block' });
      field.parentElement.appendChild(span);
    }
    span.textContent = msg;
    field.style.borderColor = msg ? '#ef4444' : '';
  }

  // Blur validation
  form.querySelectorAll('input,select,textarea').forEach(field => {
    field.addEventListener('blur', () => showError(field, getError(field)));
    field.addEventListener('input', () => { if (getError(field) === '') showError(field, ''); });
  });

  // Submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('input,select,textarea').forEach(field => {
      const err = getError(field);
      showError(field, err);
      if (err) valid = false;
    });

    if (!valid) return;

    const btn = form.querySelector('#submitBtn');
    btn.textContent = '⏳ Sending…';
    btn.disabled = true;

    // Simulate async submit
    await new Promise(r => setTimeout(r, 1200));

    form.style.display = 'none';
    if (success) success.style.display = 'block';
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('.field-error').forEach(s => s.remove());
      form.querySelectorAll('input,select,textarea').forEach(f => f.style.borderColor = '');
      const btn = form.querySelector('#submitBtn');
      if (btn) { btn.textContent = '✉️ Send Message'; btn.disabled = false; }
      success.style.display = 'none';
      form.style.display = 'block';
    });
  }
})();
