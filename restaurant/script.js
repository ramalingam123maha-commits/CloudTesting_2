/* ===============================================
   Spicy Kitchen — script.js
   =============================================== */

/* ── 1. Navbar: scroll-sticky + hamburger ──────── */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  // Scroll: add/remove .scrolled class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else if (!navbar.classList.contains('force-scrolled')) {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Auto-close on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Close on outside click
  document.addEventListener('click', e => {
    if (navLinks && !navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
    }
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
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();

/* ── 4. Animated stat counters ─────────────────── */
(function () {
  const numbers = document.querySelectorAll('.stat-number[data-count]');
  if (!numbers.length) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  numbers.forEach(el => observer.observe(el));
})();

/* ── 5. Hero floating particles ────────────────── */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const emojis = ['🌶️','🍛','🍲','🧄','🌿','🍅','🧅','🍋','🥬','🍗','🍚','🥘','🫓','🍮','🍨','🧆','🥗','🍱'];
  const count   = 18;

  for (let i = 0; i < count; i++) {
    const p    = document.createElement('span');
    p.classList.add('particle');
    p.textContent = emojis[i % emojis.length];

    const size = 14 + Math.random() * 18;
    p.style.cssText = `
      font-size: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${10 + Math.random() * 14}s;
      animation-delay: ${-Math.random() * 14}s;
    `;
    container.appendChild(p);
  }
})();

/* ── 6. Menu filter + scroll-spy ───────────────── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  // Click: scroll to section
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Activate button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (filter === 'all') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.getElementById(filter);
      if (target) {
        const offset = 140; // navbar + filter bar height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Scroll-spy: highlight active filter as user scrolls
  const sections = document.querySelectorAll('[data-category]');
  if (!sections.length) return;

  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cat = entry.target.getAttribute('data-category');
        filterBtns.forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-filter') === cat);
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-140px 0px -50% 0px' });

  sections.forEach(s => spyObserver.observe(s));
})();

/* ── 7. Add-to-order toast notification ─────────── */
(function () {
  // Create toast element
  const toast = document.createElement('div');
  toast.id = 'cartToast';
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 24px;
    background: linear-gradient(135deg, #e63939, #ff7f2a);
    color: #fff;
    padding: 14px 22px;
    border-radius: 50px;
    font-size: .88rem;
    font-weight: 700;
    box-shadow: 0 6px 24px rgba(230,57,57,.45);
    z-index: 9999;
    opacity: 0;
    transform: translateY(16px) scale(.92);
    transition: opacity .3s ease, transform .3s ease;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  document.body.appendChild(toast);

  let toastTimer = null;

  function showToast(name) {
    clearTimeout(toastTimer);
    toast.innerHTML = `<span>🛒</span> "${name}" added to order!`;
    toast.style.opacity  = '1';
    toast.style.transform = 'translateY(0) scale(1)';

    toastTimer = setTimeout(() => {
      toast.style.opacity  = '0';
      toast.style.transform = 'translateY(16px) scale(.92)';
    }, 2400);
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;

    const card = btn.closest('[class*="dish-card"], [class*="menu-item"]');
    const name = card ? (card.querySelector('h3') || { textContent: 'Item' }).textContent : 'Item';
    showToast(name.trim());

    // Brief visual feedback on button
    btn.textContent = '✓';
    btn.style.background = '#28b44a';
    setTimeout(() => {
      btn.textContent = '+';
      btn.style.background = '';
    }, 1200);
  });
})();

/* ── 8. Contact form validation ─────────────────── */
(function () {
  const form       = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');
  const resetBtn   = document.getElementById('resetForm');

  if (!form) return;

  function isEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function getError(field) {
    let el = field.nextElementSibling;
    if (!el || !el.classList.contains('field-error')) {
      el = document.createElement('span');
      el.className = 'field-error';
      el.style.cssText = 'display:block;color:#e63939;font-size:.78rem;margin-top:5px;';
      field.after(el);
    }
    return el;
  }

  function validateField(field) {
    const val = field.value.trim();
    const errEl = getError(field);

    if (field.required && !val) {
      errEl.textContent = `${field.labels?.[0]?.textContent.replace(' *','') || 'This field'} is required.`;
      field.style.borderColor = '#e63939';
      return false;
    }
    if (field.type === 'email' && val && !isEmail(val)) {
      errEl.textContent = 'Please enter a valid email address.';
      field.style.borderColor = '#e63939';
      return false;
    }
    // Clear error
    errEl.textContent = '';
    field.style.borderColor = '#28b44a';
    return true;
  }

  // Blur validation
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => {
      if (field.name !== 'phone') validateField(field);
    });
  });

  // Submit
  form.addEventListener('submit', e => {
    e.preventDefault();

    const fields = [...form.querySelectorAll('input[required], select[required], textarea[required]')];
    const allValid = fields.every(f => validateField(f));

    if (!allValid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = '⏳ Sending…';
    submitBtn.disabled = true;

    // Simulate async submit
    setTimeout(() => {
      form.style.display       = 'none';
      successBox.style.display = 'block';
    }, 1200);
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('.field-error').forEach(el => (el.textContent = ''));
      form.querySelectorAll('input, select, textarea').forEach(f => (f.style.borderColor = ''));
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<span>✉️</span> Send Message';
        submitBtn.disabled = false;
      }
      form.style.display       = '';
      successBox.style.display = 'none';
    });
  }
})();
