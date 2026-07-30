/* ============================================================
   SPICY KITCHEN — script.js
   Handles: Navbar scroll, Mobile menu, Hero particles,
            Scroll-reveal, Counter animation, Menu filters,
            Add-to-cart toast, Contact form validation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar: add .scrolled on scroll ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleNavScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  /* ---- Mobile hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  /* ---- Hero floating particles ---- */
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    const emojis = ['🌶️','🍅','🧅','🥕','🧄','🫚','🌿','🫙','🍋','🧆'];
    for (let i = 0; i < 18; i++) {
      const el = document.createElement('span');
      el.className = 'particle';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left   = `${Math.random() * 100}%`;
      el.style.fontSize = `${1.2 + Math.random() * 1.6}rem`;
      const dur = 10 + Math.random() * 18;
      el.style.animationDuration = `${dur}s`;
      el.style.animationDelay   = `${-Math.random() * dur}s`;
      particleContainer.appendChild(el);
    }
  }

  /* ---- Intersection Observer — scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---- Animated counters (hero stats) ---- */
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const dur    = 1800;
        const start  = performance.now();
        const tick   = (now) => {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / dur, 1);
          const ease     = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
          const val      = Math.round(ease * target);
          el.textContent = target >= 1000 ? val.toLocaleString() + '+' : val + (target < 100 ? '+' : '+');
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---- Scroll-to-top button ---- */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Menu page: category filter tabs ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const sections = document.querySelectorAll('.menu-section[data-category]');
        sections.forEach(sec => {
          if (filter === 'all' || sec.dataset.category === filter) {
            sec.style.display = '';
            setTimeout(() => { sec.style.opacity = '1'; }, 10);
          } else {
            sec.style.opacity = '0';
            setTimeout(() => { sec.style.display = 'none'; }, 300);
          }
        });

        // Scroll to first visible section
        if (filter !== 'all') {
          const target = document.querySelector(`.menu-section[data-category="${filter}"]`);
          if (target) {
            const offset = 140;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    });
  }

  /* ---- Add-to-cart: toast notification ---- */
  const addBtns = document.querySelectorAll('.add-btn');
  if (addBtns.length) {
    // Create toast container once
    const toast = document.createElement('div');
    toast.id = 'cartToast';
    Object.assign(toast.style, {
      position:       'fixed',
      bottom:         '80px',
      right:          '28px',
      background:     '#1a1a2e',
      color:          '#fff',
      padding:        '12px 22px',
      borderRadius:   '50px',
      fontSize:       '.88rem',
      fontWeight:     '600',
      fontFamily:     'Poppins, sans-serif',
      boxShadow:      '0 8px 28px rgba(0,0,0,.25)',
      transform:      'translateY(20px)',
      opacity:        '0',
      transition:     'all .3s ease',
      zIndex:         '9999',
      border:         '1px solid rgba(255,255,255,.12)',
      pointerEvents:  'none',
    });
    document.body.appendChild(toast);

    let toastTimer;
    const showToast = (msg) => {
      toast.textContent = msg;
      toast.style.opacity    = '1';
      toast.style.transform  = 'translateY(0)';
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.style.opacity   = '0';
        toast.style.transform = 'translateY(20px)';
      }, 2400);
    };

    addBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card      = btn.closest('.menu-item');
        const dishName  = card?.querySelector('h3')?.textContent || 'Item';
        showToast(`🛒 "${dishName}" added to cart!`);
        btn.style.transform = 'scale(1.35) rotate(180deg)';
        setTimeout(() => { btn.style.transform = ''; }, 350);
      });
    });
  }

  /* ---- Contact form: validation + submit ---- */
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');
  const resetFormBtn = document.getElementById('resetForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear old error styles
      contactForm.querySelectorAll('input, select, textarea').forEach(el => {
        el.style.borderColor = '';
      });

      // Required field check
      contactForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e63946';
          field.focus();
          valid = false;
        }
      });

      // Email format check
      const emailField = document.getElementById('email');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.style.borderColor = '#e63946';
        valid = false;
      }

      if (!valid) {
        // Shake animation on invalid
        contactForm.style.animation = 'none';
        void contactForm.offsetWidth;
        return;
      }

      // Simulate submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = '⏳ Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.style.display   = 'none';
        formSuccess.style.display   = 'block';
      }, 1200);
    });
  }

  if (resetFormBtn && contactForm && formSuccess) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      contactForm.querySelectorAll('input, select, textarea').forEach(el => {
        el.style.borderColor = '';
      });
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = '📨 Send Message';
        submitBtn.disabled = false;
      }
      formSuccess.style.display  = 'none';
      contactForm.style.display  = '';
    });
  }

  /* ---- Active nav link highlighting ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.btn-nav)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

});
