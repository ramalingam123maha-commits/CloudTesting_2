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

  if (!navbar) return;

  // Scroll → add/remove .scrolled (unless the page pre-sets it)
  const isSubPage = navbar.classList.contains('scrolled');

  window.addEventListener('scroll', function () {
    if (!isSubPage) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Auto-close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}());

/* ── 2. SCROLL-TO-TOP ── */
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

/* ── 3. SCROLL-REVEAL ── */
(function () {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(function (el) { observer.observe(el); });
}());

/* ── 4. ANIMATED STAT COUNTERS ── */
(function () {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (counter) { observer.observe(counter); });
}());

/* ── 5. HERO PARTICLES ── */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const emojis = ['🌶️', '🧄', '🌿', '🫙', '🍛', '🍲', '🥘', '🔥', '⭐', '🫚', '🌰', '🧅', '🍃', '✨', '🍴', '🫕', '🥗', '🍮'];
  const count   = 18;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className   = 'particle';
    p.textContent = emojis[i % emojis.length];

    const size = 14 + Math.random() * 18;
    p.style.cssText = [
      'font-size:'    + size.toFixed(1) + 'px',
      'left:'         + (Math.random() * 100).toFixed(1) + '%',
      'animation-duration:'  + (10 + Math.random() * 14).toFixed(1) + 's',
      'animation-delay:'     + (-(Math.random() * 10)).toFixed(1) + 's'
    ].join(';');

    container.appendChild(p);
  }
}());

/* ── 6. MENU CATEGORY FILTER ── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sections   = document.querySelectorAll('.menu-section[data-category]');
  if (!filterBtns.length || !sections.length) return;

  // Click → scroll to section
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      if (filter === 'all') {
        window.scrollTo({ top: sections[0].getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
        return;
      }

      const target = document.getElementById(filter);
      if (target) {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
      }
    });
  });

  // Scroll-spy → highlight active filter
  window.addEventListener('scroll', function () {
    let current = 'all';
    sections.forEach(function (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.25) {
        current = section.dataset.category;
      }
    });
    filterBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.filter === current || (current === 'all' && btn.dataset.filter === 'all'));
    });
  }, { passive: true });
}());

/* ── 7. CART TOAST NOTIFICATION ── */
(function () {
  const toast = (function buildToast() {
    const el = document.createElement('div');
    el.id = 'cartToast';
    el.style.cssText = [
      'position:fixed',
      'bottom:88px',
      'right:28px',
      'background:linear-gradient(135deg,#e63939,#ff7f2a)',
      'color:#fff',
      'padding:12px 20px',
      'border-radius:50px',
      'font-size:.88rem',
      'font-weight:700',
      'box-shadow:0 6px 24px rgba(230,57,57,.55)',
      'z-index:2000',
      'opacity:0',
      'transform:translateY(14px)',
      'transition:opacity .3s ease,transform .3s ease',
      'pointer-events:none',
      'white-space:nowrap'
    ].join(';');
    document.body.appendChild(el);
    return el;
  }());

  let hideTimer = null;

  function showToast(name) {
    toast.textContent = '🛒 "' + name + '" added to your order!';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(14px)';
    }, 2400);
  }

  // Event delegation on the whole page
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;

    const card   = btn.closest('.dish-card, .menu-item');
    const nameEl = card && card.querySelector('h3');
    const name   = nameEl ? nameEl.textContent.trim() : 'Item';

    // Visual feedback on button
    btn.textContent = '✓';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    setTimeout(function () {
      btn.textContent = '+';
      btn.style.background = '';
    }, 900);

    showToast(name);
  });
}());

/* ── 8. CONTACT FORM VALIDATION ── */
(function () {
  const form      = document.getElementById('contactForm');
  const success   = document.getElementById('formSuccess');
  const resetBtn  = document.getElementById('resetBtn') || document.getElementById('resetForm');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function getErrorEl(field) {
    let err = field.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.style.cssText = 'color:#e63939;font-size:.76rem;margin-top:4px;display:block;';
      field.parentElement.appendChild(err);
    }
    return err;
  }

  function validateField(field) {
    const err = getErrorEl(field);
    const val = field.value.trim();
    let msg = '';

    if (field.required && !val) {
      msg = 'This field is required.';
    } else if (field.type === 'email' && val && !EMAIL_RE.test(val)) {
      msg = 'Please enter a valid email address.';
    }

    err.textContent = msg;
    field.style.borderColor = msg ? '#e63939' : '';
    return !msg;
  }

  // Blur-time validation
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur',  function () { validateField(field); });
    field.addEventListener('input', function () { if (field.style.borderColor) validateField(field); });
  });

  // Submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (field) {
      if (!validateField(field)) valid = false;
    });

    if (!valid) return;

    // Simulate async submit
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Sending…';
    }

    setTimeout(function () {
      form.style.display    = 'none';
      if (success) success.style.display = 'block';
    }, 1200);
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      form.querySelectorAll('.field-error').forEach(function (el) { el.textContent = ''; });
      form.querySelectorAll('input, select, textarea').forEach(function (f) { f.style.borderColor = ''; });
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<span>✉️</span> Send Message'; }
      form.style.display    = '';
      if (success) success.style.display = 'none';
    });
  }
}());
