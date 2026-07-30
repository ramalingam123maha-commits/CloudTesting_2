/* =============================================
   Spicy Kitchen — script.js
   ============================================= */

/* ── 1. NAVBAR ── */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  /* Scroll → sticky dark-glass */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* Hamburger open / close */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    /* Close menu when a link is clicked */
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close when clicking outside */
    document.addEventListener('click', (e) => {
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

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── 3. SCROLL-REVEAL ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

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

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(easeOutCubic(progress) * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
})();

/* ── 5. HERO FLOATING PARTICLES ── */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const emojis  = ['🌶️','🍛','🧄','🌿','🍋','🍚','🥩','🫓','🧅','🥘','🌾','🥗','🍢','🫕','🍮','🍵','🌰','🍃'];
  const count   = 18;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className   = 'particle';
    el.textContent = emojis[i % emojis.length];

    const size   = Math.random() * 18 + 14;   // 14–32 px
    const left   = Math.random() * 100;        // 0–100 %
    const dur    = Math.random() * 14 + 10;    // 10–24 s
    const delay  = Math.random() * -20;        // stagger starts

    el.style.cssText = `
      font-size: ${size}px;
      left: ${left}%;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(el);
  }
})();

/* ── 6. MENU FILTER BAR ── */
(function () {
  const btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;

  const OFFSET = 140; // px above target (navbar + filter bar height)

  /* Click → scroll to section */
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (filter === 'all') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.getElementById(filter);
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* Scroll-spy: highlight active filter while scrolling */
  const sections = document.querySelectorAll('[data-category]');
  if (!sections.length) return;

  window.addEventListener('scroll', () => {
    let current = 'all';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.25) {
        current = sec.dataset.category;
      }
    });

    btns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === current);
    });
  }, { passive: true });
})();

/* ── 7. CART TOAST ── */
(function () {
  /* Create toast element once */
  const toast = document.createElement('div');
  toast.id    = 'cartToast';
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 24px;
    background: linear-gradient(135deg, #e63939, #ff7f2a);
    color: #fff;
    padding: 12px 22px;
    border-radius: 50px;
    font-size: .88rem;
    font-weight: 700;
    box-shadow: 0 8px 24px rgba(0,0,0,.4);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity .3s ease, transform .3s ease;
    pointer-events: none;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);

  let hideTimer = null;

  function showToast(itemName) {
    clearTimeout(hideTimer);
    toast.textContent = '✓  ' + itemName + ' added to order!';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    hideTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 2400);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;

    const card = btn.closest('.menu-item, .dish-card');
    const name = card ? (card.querySelector('h3') || {}).textContent || 'Item' : 'Item';

    /* Brief visual feedback on button */
    btn.textContent = '✓';
    setTimeout(() => { btn.textContent = '+'; }, 1200);

    showToast(name);
  });
})();

/* ── 8. CONTACT FORM ── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const reset   = document.getElementById('resetForm');
  if (!form) return;

  /* ── Validation helpers ── */
  function getError(field) {
    return field.parentElement.querySelector('.field-error');
  }

  function showError(field, msg) {
    let span = getError(field);
    if (!span) {
      span = document.createElement('span');
      span.className = 'field-error';
      span.style.cssText = 'display:block;font-size:.76rem;color:#e63939;margin-top:4px;';
      field.parentElement.appendChild(span);
    }
    span.textContent = msg;
    field.style.borderColor = '#e63939';
  }

  function clearError(field) {
    const span = getError(field);
    if (span) span.textContent = '';
    field.style.borderColor = '';
  }

  function validateField(field) {
    clearError(field);
    const val = field.value.trim();

    if (field.required && !val) {
      showError(field, 'This field is required.');
      return false;
    }
    if (field.type === 'email' && val) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(val)) {
        showError(field, 'Please enter a valid email address.');
        return false;
      }
    }
    return true;
  }

  /* Live blur validation */
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (getError(field) && getError(field).textContent) validateField(field);
    });
  });

  /* Submit */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields  = Array.from(form.querySelectorAll('input, select, textarea'));
    const allOk   = fields.map(f => validateField(f)).every(Boolean);
    if (!allOk) return;

    /* Simulate async send */
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled  = true;
    submitBtn.textContent = '⏳ Sending…';

    setTimeout(() => {
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    }, 1200);
  });

  /* Reset back to form */
  if (reset) {
    reset.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('input, select, textarea').forEach(f => {
        clearError(f);
      });
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>✉️</span> Send Message';
      }
      success.style.display = 'none';
      form.style.display    = 'block';
    });
  }
})();
