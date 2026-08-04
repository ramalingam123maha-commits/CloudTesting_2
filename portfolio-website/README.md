# Personal Portfolio Website

A responsive personal portfolio built with plain HTML, CSS, and JavaScript
(no frameworks or build tools required).

## Features

- **Navigation bar** — fixed header with smooth-scroll links, active-section
  highlighting, and a mobile hamburger menu.
- **Hero section** — animated typewriter text cycling through a list of
  phrases, plus fade-in entrance animations and a bouncing scroll indicator.
- **About me** — bio, tech list, and animated stat counters that count up
  when scrolled into view.
- **Skills** — animated progress bars with percentage labels that fill in
  when scrolled into view (via `IntersectionObserver`).
- **Projects gallery** — responsive card grid with hover overlays revealing
  project details and links.
- **Contact form** — client-side validation (required fields, email format,
  minimum lengths) with inline error messages and a success message on
  submit; no page reload.
- **Extras** — scroll-triggered reveal animations, "back to top" button,
  and a fully responsive layout down to mobile widths.

## Structure

```
portfolio-website/
├── index.html      # Markup for all sections
├── css/
│   └── style.css    # Styling, layout, and CSS animations
└── js/
    └── script.js    # Nav behavior, smooth scroll, animations, form validation
```

## Running locally

Since this is a static site, just open `index.html` in a browser, or serve
the folder with any static file server, e.g.:

```bash
npx serve portfolio-website
```
