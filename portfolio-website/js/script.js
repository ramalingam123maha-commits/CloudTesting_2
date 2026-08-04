/* ==========================================================================
   Navbar: scroll background + mobile toggle + active link highlighting
   ========================================================================== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  toggleBackToTop();
  highlightActiveLink();
});

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ==========================================================================
   Smooth scrolling for all in-page anchor links
   ========================================================================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

function highlightActiveLink() {
  const sections = document.querySelectorAll('main section, .hero');
  let currentId = 'home';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
  });
}

/* ==========================================================================
   Back to top button
   ========================================================================== */
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}

/* ==========================================================================
   Hero typing animation
   ========================================================================== */
const typedTextEl = document.getElementById('typedText');
const phrases = [
  'responsive websites.',
  'accessible interfaces.',
  'delightful experiences.',
  'scalable web apps.',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    charIndex -= 1;
  } else {
    charIndex += 1;
  }

  typedTextEl.textContent = currentPhrase.substring(0, charIndex);

  let delay = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    delay = 1400;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}

typeLoop();

/* ==========================================================================
   Animated stat counters (About section)
   ========================================================================== */
function animateCounter(el) {
  const target = Number(el.getAttribute('data-count'));
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

/* ==========================================================================
   Animated skill progress bars
   ========================================================================== */
function animateSkillBar(bar) {
  const percent = bar.getAttribute('data-percent');
  const fill = bar.querySelector('.skill-bar__fill');
  const label = bar.querySelector('.skill-bar__percent');

  fill.style.width = `${percent}%`;

  let current = 0;
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    current = Math.floor(progress * percent);
    label.textContent = `${current}%`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      label.textContent = `${percent}%`;
    }
  }

  requestAnimationFrame(step);
}

/* ==========================================================================
   Scroll-reveal via IntersectionObserver
   ========================================================================== */
const revealTargets = document.querySelectorAll(
  '.about__grid, .skills__grid, .projects__grid, .contact-form'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const skillBars = document.querySelectorAll('.skill-bar');
const statNumbers = document.querySelectorAll('.stat__number');

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');

      if (entry.target.classList.contains('skills__grid')) {
        skillBars.forEach((bar) => animateSkillBar(bar));
      }

      if (entry.target.classList.contains('about__grid')) {
        statNumbers.forEach((stat) => animateCounter(stat));
      }

      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.3 }
);

revealTargets.forEach((el) => observer.observe(el));

/* ==========================================================================
   Contact form validation
   ========================================================================== */
const form = document.getElementById('contactForm');
const fields = {
  name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
  email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
  subject: { input: document.getElementById('subject'), error: document.getElementById('subjectError') },
  message: { input: document.getElementById('message'), error: document.getElementById('messageError') },
};
const formSuccess = document.getElementById('formSuccess');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(key) {
  const { input, error } = fields[key];
  const value = input.value.trim();
  let message = '';

  if (key === 'name') {
    if (!value) message = 'Please enter your name.';
    else if (value.length < 2) message = 'Name must be at least 2 characters.';
  }

  if (key === 'email') {
    if (!value) message = 'Please enter your email.';
    else if (!emailPattern.test(value)) message = 'Please enter a valid email address.';
  }

  if (key === 'subject') {
    if (!value) message = 'Please enter a subject.';
  }

  if (key === 'message') {
    if (!value) message = 'Please enter a message.';
    else if (value.length < 10) message = 'Message must be at least 10 characters.';
  }

  error.textContent = message;
  input.classList.toggle('invalid', Boolean(message));
  return !message;
}

Object.keys(fields).forEach((key) => {
  fields[key].input.addEventListener('blur', () => validateField(key));
  fields[key].input.addEventListener('input', () => {
    if (fields[key].input.classList.contains('invalid')) validateField(key);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.textContent = '';

  const results = Object.keys(fields).map((key) => validateField(key));
  const isValid = results.every(Boolean);

  if (!isValid) {
    return;
  }

  formSuccess.textContent = "Thanks for reaching out! I'll get back to you soon.";
  form.reset();
  Object.values(fields).forEach(({ input }) => input.classList.remove('invalid'));
});

/* Initial state on load */
highlightActiveLink();
toggleBackToTop();
