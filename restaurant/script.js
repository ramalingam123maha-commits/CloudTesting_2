/* =================================================================
   SPICY KITCHEN — script.js
   Handles: Navbar, Hamburger, Particles, Scroll Reveal,
            Counters, Menu Filter, Cart Toast, Contact Form
   ================================================================= */

// ── Utility ──────────────────────────────────────────────────────
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =================================================================
   NAVBAR — scroll behaviour + hamburger
   ================================================================= */
(function initNavbar() {
  const navbar    = qs('#navbar');
  const hamburger = qs('#hamburger');
  const navLinks  = qs('#navLinks');
  if (!navbar) return;

  // Scroll → add .scrolled class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    qs('#scrollTop')?.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close when a link is tapped (mobile)
    navLinks.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  // Scroll-to-top button
  qs('#scrollTop')?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
})();

/* =================================================================
   FLOATING PARTICLES (hero only)
   ================================================================= */
(function initParticles() {
  const container = qs('#heroParticles');
  if (!container) return;

  const emojis = ['🌶️', '🧄', '🌿', '🍅', '⭐', '✨', '🔥', '🫙'];
  const COUNT  = 14;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.classList.add('particle');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const size     = Math.random() * 18 + 12;  // 12–30 px
    const left     = Math.random() * 100;       // 0–100 %
    const duration = Math.random() * 18 + 12;  // 12–30 s
    const delay    = Math.random() * 12;        // 0–12 s

    el.style.cssText = `
      font-size: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: .55;
    `;
    container.appendChild(el);
  }
})();

/* =================================================================
   SCROLL REVEAL — IntersectionObserver
   ================================================================= */
(function initReveal() {
  const targets = qsa('.reveal');
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => io.observe(el));
})();

/* =================================================================
   NUMBER COUNTERS (Home hero stats)
   ================================================================= */
(function initCounters() {
  const counters = qsa('[data-count]');
  if (!counters.length) return;

  const formatNum = n => {
    if (n >= 1000) return (n / 1000).toFixed(0) + ',000+';
    return n + '+';
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const end   = parseInt(el.dataset.count, 10);
      const dur   = 1600;
      const step  = 16;
      const steps = dur / step;
      let   cur   = 0;

      const tick = () => {
        cur = Math.min(cur + end / steps, end);
        el.textContent = formatNum(Math.round(cur));
        if (cur < end) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();

/* =================================================================
   MENU PAGE — filter tabs
   ================================================================= */
(function initMenuFilter() {
  const filterBtns = qsa('.filter-btn');
  if (!filterBtns.length) return;

  const sections = qsa('.menu-section[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      sections.forEach(sec => {
        if (filter === 'all' || sec.dataset.category === filter) {
          sec.style.display = '';
          // Re-trigger reveal on items that just became visible
          qsa('.reveal', sec).forEach(el => {
            el.classList.remove('visible');
            requestAnimationFrame(() => el.classList.add('visible'));
          });
        } else {
          sec.style.display = 'none';
        }
      });

      // Smooth scroll to first visible section
      const firstVisible = sections.find(s => s.style.display !== 'none');
      if (firstVisible) {
        const offset = 120;
        const y = firstVisible.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
})();

/* =================================================================
   CART / ADD BUTTON TOASTS
   ================================================================= */
(function initAddButtons() {
  let toastTimeout;

  function createToast(itemName) {
    // Remove existing toast
    qs('#cartToast')?.remove();
    clearTimeout(toastTimeout);

    const toast = document.createElement('div');
    toast.id = 'cartToast';
    Object.assign(toast.style, {
      position:      'fixed',
      bottom:        '28px',
      left:          '50%',
      transform:     'translateX(-50%) translateY(60px)',
      background:    'linear-gradient(135deg, #e63939, #ff7f2a)',
      color:         '#fff',
      padding:       '14px 28px',
      borderRadius:  '50px',
      fontWeight:    '600',
      fontSize:      '.9rem',
      boxShadow:     '0 8px 28px rgba(230,57,57,.45)',
      zIndex:        '9999',
      whiteSpace:    'nowrap',
      transition:    'transform .3s ease, opacity .3s ease',
      opacity:       '0',
    });
    toast.textContent = `🛒 "${itemName}" added to your order!`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform  = 'translateX(-50%) translateY(0)';
      toast.style.opacity    = '1';
    });

    toastTimeout = setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(60px)';
      toast.style.opacity   = '0';
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;

    // Animate the button
    btn.style.transform = 'scale(1.35)';
    setTimeout(() => (btn.style.transform = ''), 200);

    // Get dish name
    const card  = btn.closest('.menu-item, .dish-card');
    const title = card?.querySelector('h3')?.textContent?.trim() || 'Item';
    createToast(title);
  });
})();

/* =================================================================
   CONTACT FORM — validation + success state
   ================================================================= */
(function initContactForm() {
  const form    = qs('#contactForm');
  const success = qs('#formSuccess');
  const reset   = qs('#resetForm');
  if (!form) return;

  function showError(input, msg) {
    clearError(input);
    input.style.borderColor = '#e63939';
    input.style.boxShadow   = '0 0 0 3px rgba(230,57,57,.12)';
    const span = document.createElement('span');
    span.className = 'field-error';
    Object.assign(span.style, {
      color:     '#e63939',
      fontSize:  '.78rem',
      marginTop: '4px',
      display:   'block',
    });
    span.textContent = msg;
    input.parentNode.appendChild(span);
  }

  function clearError(input) {
    input.style.borderColor = '';
    input.style.boxShadow   = '';
    input.parentNode.querySelector('.field-error')?.remove();
  }

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'firstName', msg: 'Please enter your first name.'  },
      { id: 'lastName',  msg: 'Please enter your last name.'   },
      { id: 'email',     msg: null },
      { id: 'subject',   msg: 'Please select a subject.'       },
      { id: 'message',   msg: 'Please enter your message.'     },
    ];

    fields.forEach(({ id, msg }) => {
      const el = qs(`#${id}`, form);
      if (!el) return;
      clearError(el);
      const val = el.value.trim();

      if (!val) {
        showError(el, msg || `This field is required.`);
        valid = false;
        return;
      }
      if (id === 'email' && !validateEmail(val)) {
        showError(el, 'Please enter a valid email address.');
        valid = false;
      }
    });

    if (!valid) {
      // Scroll to first error
      const firstErr = form.querySelector('.field-error');
      if (firstErr) {
        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate successful send (replace with real fetch/XHR call if needed)
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = '⏳ Sending…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      form.style.display    = 'none';
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  });

  // Clear errors on input
  form.addEventListener('input', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      clearError(e.target);
    }
  });

  // Reset form button in success state
  reset?.addEventListener('click', () => {
    form.reset();
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = '📨 Send Message';
    submitBtn.disabled    = false;
    success.style.display = 'none';
    form.style.display    = '';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
