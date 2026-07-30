/* ================================================
   Spicy Kitchen — script.js
   ================================================ */

/* ── 1. Navbar: scroll-sticky + hamburger ──────── */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll → sticky
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  hamburger && hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close mobile nav on link click
  navLinks && navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
    });
  });
})();


/* ── 2. Scroll-to-top button ───────────────────── */
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


/* ── 3. Scroll-reveal via IntersectionObserver ─── */
(function () {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

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


/* ── 4. Animated stat counters ─────────────────── */
(function () {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current  = Math.round(easeOutCubic(progress) * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
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


/* ── 5. Hero floating emoji particles ──────────── */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const EMOJIS = ['🌶️','🍛','🧄','🌿','🍅','🫚','🍗','🥘','🌱','🍃','✨','🔥','🍲','🥗','🫙','🍚','🧅','🌾'];

  for (let i = 0; i < 18; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = EMOJIS[i % EMOJIS.length];

    const size     = Math.random() * 20 + 16;
    const leftPct  = Math.random() * 100;
    const duration = Math.random() * 12 + 10;
    const delay    = Math.random() * 14;

    el.style.cssText = `
      font-size: ${size}px;
      left: ${leftPct}%;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(el);
  }
})();


/* ── 6. Menu category filter ────────────────────── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      if (filter === 'all') {
        // Smooth scroll to top of menu content
        const firstSection = document.querySelector('.menu-section');
        firstSection && firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // Scroll to the matching category section
      const target = document.getElementById(filter);
      if (target) {
        const offset = 120; // account for sticky navbar + filter bar
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Highlight active filter on scroll
  const sections = document.querySelectorAll('.menu-section[data-category]');
  if (!sections.length) return;

  const scrollSpy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cat = entry.target.getAttribute('data-category');
        filterBtns.forEach(b => {
          const match = b.getAttribute('data-filter') === cat;
          b.classList.toggle('active', match);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-120px 0px -40% 0px' });

  sections.forEach(s => scrollSpy.observe(s));
})();


/* ── 7. Add-to-order toast ──────────────────────── */
(function () {
  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'cartToast';
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 24px;
    background: linear-gradient(135deg, #e63939, #ff7f2a);
    color: white;
    padding: 12px 20px;
    border-radius: 50px;
    font-size: .88rem;
    font-weight: 700;
    box-shadow: 0 6px 24px rgba(230, 57, 57, .45);
    z-index: 9999;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity .3s, transform .3s;
    pointer-events: none;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);

  let toastTimeout;

  function showToast(msg) {
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px)';
    }, 2400);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;

    const card = btn.closest('.dish-card, .menu-item');
    const name = card ? card.querySelector('h3')?.textContent : 'Item';
    showToast(`🛒 ${name} added to your order!`);

    // Brief scale animation on the button
    btn.style.transform = 'scale(1.35)';
    setTimeout(() => { btn.style.transform = ''; }, 220);
  });
})();


/* ── 8. Contact form validation & submit ─────────── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const reset   = document.getElementById('resetForm');
  if (!form) return;

  // Field validators
  const validators = {
    firstName: (v) => v.trim().length >= 2 ? '' : 'First name must be at least 2 characters.',
    lastName:  (v) => v.trim().length >= 2 ? '' : 'Last name must be at least 2 characters.',
    email:     (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    subject:   (v) => v !== '' ? '' : 'Please select a subject.',
    message:   (v) => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.',
  };

  // Show / clear inline error
  function showError(field, message) {
    let errEl = field.parentElement.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'field-error';
      errEl.style.cssText = 'font-size:.75rem;color:#ff6b6b;margin-top:4px;display:block;';
      field.parentElement.appendChild(errEl);
    }
    errEl.textContent = message;
    field.style.borderColor = message ? '#e63939' : '';
  }

  function clearError(field) { showError(field, ''); }

  // Blur validation
  Object.keys(validators).forEach(name => {
    const field = form.elements[name];
    if (!field) return;
    field.addEventListener('blur', () => {
      const err = validators[name](field.value);
      showError(field, err);
    });
    field.addEventListener('input', () => clearError(field));
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    Object.keys(validators).forEach(name => {
      const field = form.elements[name];
      if (!field) return;
      const err = validators[name](field.value);
      showError(field, err);
      if (err) valid = false;
    });

    if (!valid) return;

    // Simulate async submit
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳</span> Sending…';

    await new Promise(r => setTimeout(r, 1400));

    // Show success state
    form.style.display = 'none';
    success.style.display = 'block';
  });

  // Reset form
  reset && reset.addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    form.querySelectorAll('input, select, textarea').forEach(f => f.style.borderColor = '');
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>✉️</span> Send Message';
    form.style.display = 'block';
    success.style.display = 'none';
  });
})();
