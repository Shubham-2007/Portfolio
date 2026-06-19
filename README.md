# Shubham Mendapara — Portfolio

Personal portfolio website of **Shubham Mendapara**, Software Engineer & Full Stack / AI-ML Developer.

🔗 **Live site:** https://shubham-2007.github.io/Portfolio

## Overview

A responsive, single-page portfolio showcasing experience, technical skills, projects, and
design work. Built as a static site with vanilla HTML, CSS, and JavaScript.

## Tech Stack

- **HTML5 / CSS3** — semantic markup and custom styling
- **JavaScript** — interactivity (`assets/js/main.js`)
- **Bootstrap 5** — responsive grid and layout
- **Vendor libraries** — Swiper, GLightbox, Isotope, Typed.js, Boxicons, Bootstrap Icons

## Project Structure

```
Portfolio/
├── index.html              # Main landing page
├── pages/                  # Secondary pages
│   ├── blog-grid.html
│   ├── blog-single.html
│   └── portfolio-details.html
├── forms/
│   └── contact.php         # Contact form handler
├── assets/
│   ├── css/                # Stylesheets (style.css)
│   ├── js/                 # Scripts (main.js)
│   ├── img/                # Images (blog/, design/, portfolio/)
│   ├── icons/              # SVG / PNG icons
│   ├── docs/               # Documents (resume)
│   └── vendor/             # Third-party libraries
├── .gitignore
└── README.md
```

## Running Locally

The site is fully static. Serve it with any local web server so that relative asset paths
resolve correctly (opening `index.html` directly via `file://` may break some resources):

```bash
# Python 3
python3 -m http.server 8000

# or Node
npx serve .
```

Then open http://localhost:8000 in your browser.

## Deployment

Deployed via **GitHub Pages** from the repository root. Pushing to the default branch
publishes the site automatically.

## Contact

- **Email:** mendapara.s207@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/shubham2007/
- **GitHub:** https://github.com/Shubham-2007
