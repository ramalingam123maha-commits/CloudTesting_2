/* ==============================================
   Spicy Kitchen — script.js
   Interactive JS for all 3 pages
   ============================================== */

/* ── 1. NAVBAR ── */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  // Scroll sticky
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


/* ── 4. ANIMATED STAT COUNTERS ── */
(function () {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString();
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


/* ── 5. HERO FLOATING PARTICLES ── */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const emojis = ['🌶️','🍛','🧄','🌿','🫙','🍚','🥗','🔥','🍢','🍮','☕','🥭','🧅','🌹','🍖','🥬','🧀','🍰'];

  emojis.forEach(emoji => {
    const span = document.createElement('span');
    span.className = 'particle';
    span.textContent = emoji;
    span.style.cssText = `
      font-size: ${14 + Math.random() * 18}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${10 + Math.random() * 14}s;
      animation-delay: -${Math.random() * 12}s;
    `;
    container.appendChild(span);
  });
})();


/* ── 6. MENU FILTER + SCROLL-SPY ── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  // Click: scroll to section
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
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

  // Scroll-spy: highlight btn for visible section
  const sections = document.querySelectorAll('.menu-section[data-category]');
  if (!sections.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const viewportThreshold = window.innerHeight * 0.25;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < viewportThreshold && rect.bottom > 0) {
        const cat = section.dataset.category;
        filterBtns.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.filter === cat);
        });
      }
    });
  }, { passive: true });
})();


/* ── 7. ADD-TO-ORDER TOAST ── */
(function () {
  const toast = document.createElement('div');
  toast.id = 'cartToast';
  toast.style.cssText = `
    position: fixed;
    bottom: 84px;
    right: 28px;
    background: linear-gradient(135deg, #e63939, #ff7f2a);
    color: #fff;
    padding: 13px 22px;
    border-radius: 50px;
    font-size: .875rem;
    font-weight: 700;
    box-shadow: 0 8px 28px rgba(230,57,57,.5);
    z-index: 1200;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity .3s ease, transform .3s ease;
    pointer-events: none;
    white-space: nowrap;
  `;
  toast.textContent = '🛒 Added to your order!';
  document.body.appendChild(toast);

  let toastTimer = null;

  function showToast(itemName) {
    toast.textContent = `🛒 ${itemName} added!`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px)';
    }, 2400);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;

    const card = btn.closest('.dish-card, .menu-item');
    const name = card ? (card.querySelector('h3')?.textContent || 'Item') : 'Item';

    showToast(name);
    btn.textContent = '✓';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
      btn.textContent = '+';
      btn.style.background = '';
    }, 900);
  });
})();


/* ── 8. CONTACT FORM ── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const reset   = document.getElementById('resetForm');
  if (!form || !success) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(input, msg) {
    let err = input.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.style.cssText = 'color:#ff6b6b;font-size:.75rem;margin-top:4px;display:block;';
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
    input.style.borderColor = '#e63939';
  }

  function clearError(input) {
    const err = input.parentElement.querySelector('.field-error');
    if (err) err.textContent = '';
    input.style.borderColor = '';
  }

  function validateField(input) {
    const val = input.value.trim();
    if (input.required && !val) {
      showError(input, 'This field is required.');
      return false;
    }
    if (input.type === 'email' && val && !EMAIL_RE.test(val)) {
      showError(input, 'Please enter a valid email address.');
      return false;
    }
    clearError(input);
    return true;
  }

  // Blur validation
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur',  () => validateField(field));
    field.addEventListener('input', () => { if (field.style.borderColor) validateField(field); });
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = '⏳ Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display     = 'none';
      success.style.display  = 'block';
    }, 1200);
  });

  // Reset
  if (reset) {
    reset.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('.field-error').forEach(e => e.textContent = '');
      form.querySelectorAll('input, select, textarea').forEach(f => f.style.borderColor = '');
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = '✉️ Send Message';
      submitBtn.disabled = false;
      success.style.display = 'none';
      form.style.display    = '';
    });
  }
})();
