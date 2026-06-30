/**
 * N.A. Enterprises – Main JavaScript
 * script.js
 *
 * Sections:
 *  1. Utility helpers
 *  2. Top bar hide on scroll
 *  3. Header scroll behaviour
 *  4. Mobile navigation (hamburger + accordion)
 *  5. Active nav link tracking
 *  6. Hero counter animation
 *  7. Scroll-reveal animations (custom AOS)
 *  8. Hero floating particles
 *  9. Ticker pause on hover  (handled in CSS)
 * 10. Gallery filter tabs
 * 11. Lightbox viewer
 * 12. Testimonials slider
 * 13. Contact form validation & submission
 * 14. Back-to-top button
 * 15. Footer year
 * 16. Smooth scrolling for anchor links
 */

/* =====================================================
   1. UTILITY HELPERS
   ===================================================== */

/**
 * Shorthand querySelector
 * @param {string} sel - CSS selector
 * @param {Element} ctx - optional context (defaults to document)
 */
function qs(sel, ctx = document) {
  return ctx.querySelector(sel);
}

/**
 * Shorthand querySelectorAll, returns real Array
 * @param {string} sel - CSS selector
 * @param {Element} ctx - optional context (defaults to document)
 */
function qsAll(sel, ctx = document) {
  return Array.from(ctx.querySelectorAll(sel));
}

/**
 * Clamp a number between min and max
 */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/* =====================================================
   2. TOP BAR – HIDE AFTER A LITTLE SCROLL
   ===================================================== */
(function initTopBar() {
  const topBar = qs('#topBar');
  if (!topBar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const current = window.scrollY;
    // Hide the top bar once the user scrolls past 80px
    if (current > 80) {
      topBar.style.transform = 'translateY(-100%)';
      topBar.style.marginBottom = '0';
    } else {
      topBar.style.transform = 'translateY(0)';
    }
    lastScroll = current;
  }, { passive: true });
})();

/* =====================================================
   3. HEADER SCROLL BEHAVIOUR
   ===================================================== */
(function initHeader() {
  const header = qs('#header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* =====================================================
   4. MOBILE NAVIGATION
   ===================================================== */
(function initMobileNav() {
  const hamburger = qs('#hamburger');
  const mobileNav  = qs('#mobileNav');
  const mobileLinks = qsAll('.mobile-nav__link');

  if (!hamburger || !mobileNav) return;

  // Toggle menu open/close
  hamburger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when any link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileNav();
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    const header = qs('#header');
    if (!header.contains(e.target) && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Mobile accordion for Products submenu
  const accordionBtns = qsAll('.mobile-nav__accordion');
  accordionBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const submenu = this.nextElementSibling;
      const isOpen = submenu.classList.toggle('open');
      this.classList.toggle('open', isOpen);
      this.setAttribute('aria-expanded', String(isOpen));
    });
  });
})();

/* =====================================================
   5. ACTIVE NAV LINK TRACKING (Intersection Observer)
   ===================================================== */
(function initNavTracking() {
  const sections = qsAll('section[id]');
  const navLinks  = qsAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(function (sec) { observer.observe(sec); });
})();

/* =====================================================
   6. HERO COUNTER ANIMATION
   ===================================================== */
(function initCounters() {
  const counters = qsAll('[data-target]');
  if (!counters.length) return;

  let started = false;

  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;        // ms
    const step     = 16;          // ~60fps
    const increment = target / (duration / step);
    let current = 0;

    const interval = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = Math.floor(current);
    }, step);
  }

  // Trigger only when the hero stats come into view
  const heroStats = qs('.hero__stats');
  if (!heroStats) return;

  const statsObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !started) {
      started = true;
      counters.forEach(animateCounter);
      statsObserver.disconnect();
    }
  }, { threshold: 0.3 });

  statsObserver.observe(heroStats);
})();

/* =====================================================
   7. SCROLL-REVEAL ANIMATIONS (custom AOS)
   ===================================================== */
(function initScrollReveal() {
  const revealEls = qsAll('[data-aos]');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Honour the data-aos-delay attribute if present
        const delay = parseInt(entry.target.getAttribute('data-aos-delay') || '0', 10);
        setTimeout(function () {
          entry.target.classList.add('aos-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(function (el) { observer.observe(el); });
})();

/* =====================================================
   8. HERO FLOATING PARTICLES
   ===================================================== */
(function initParticles() {
  const container = qs('#particles');
  if (!container) return;

  // Reduce on lower-power devices – skip if 8 or fewer logical processors reported
  const maxParticles = (navigator.hardwareConcurrency || 4) <= 4 ? 14 : 28;

  for (let i = 0; i < maxParticles; i++) {
    const dot = document.createElement('div');

    // Random sizes: tiny (~2-5px)
    const size = Math.random() * 3 + 2;
    const x    = Math.random() * 100;      // vw %
    const y    = Math.random() * 100;      // vh %
    const dur  = Math.random() * 12 + 8;  // animation duration seconds
    const del  = Math.random() * -15;     // staggered start

    dot.style.cssText = [
      'position:absolute',
      'border-radius:50%',
      'pointer-events:none',
      `width:${size}px`,
      `height:${size}px`,
      `left:${x}%`,
      `top:${y}%`,
      `background:rgba(212,160,23,${Math.random() * 0.4 + 0.08})`,
      `animation:particleFloat ${dur}s ${del}s ease-in-out infinite`
    ].join(';');

    container.appendChild(dot);
  }

  // Inject keyframes once
  if (!document.getElementById('particle-keyframes')) {
    const style = document.createElement('style');
    style.id = 'particle-keyframes';
    style.textContent = `
      @keyframes particleFloat {
        0%,100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
        25%      { transform: translateY(-18px) translateX(10px); opacity: 1; }
        50%      { transform: translateY(-32px) translateX(-8px); opacity: 0.4; }
        75%      { transform: translateY(-14px) translateX(14px); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* =====================================================
   10. GALLERY FILTER TABS
   ===================================================== */
(function initGalleryFilter() {
  const filterBtns  = qsAll('.gallery__filter-btn');
  const galleryItems = qsAll('.gallery__item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      // Show/hide items
      galleryItems.forEach(function (item) {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          // Re-trigger entry animation
          item.style.animation = 'none';
          void item.offsetWidth; // force reflow
          item.style.animation = '';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

/* =====================================================
   11. LIGHTBOX VIEWER
   ===================================================== */
(function initLightbox() {
  const galleryItems = qsAll('.gallery__item');
  const lightbox     = qs('#lightbox');
  const lbImg        = qs('#lightboxImg');
  const lbCaption    = qs('#lightboxCaption');
  const lbClose      = qs('#lightboxClose');
  const lbPrev       = qs('#lightboxPrev');
  const lbNext       = qs('#lightboxNext');

  if (!lightbox || !galleryItems.length) return;

  // Build image list (only visible items)
  let imageList = [];
  let currentIdx = 0;

  function buildImageList() {
    imageList = galleryItems
      .filter(function (item) { return !item.classList.contains('hidden'); })
      .map(function (item) {
        const img     = item.querySelector('img');
        const caption = item.querySelector('h4');
        return {
          src:     img ? img.src : '',
          alt:     img ? img.alt : '',
          caption: caption ? caption.textContent : ''
        };
      });
  }

  function openLightbox(idx) {
    buildImageList();
    if (!imageList.length) return;
    currentIdx = clamp(idx, 0, imageList.length - 1);
    showImage(currentIdx);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showImage(idx) {
    const data = imageList[idx];
    if (!data) return;
    lbImg.src         = data.src;
    lbImg.alt         = data.alt;
    lbCaption.textContent = data.caption;
  }

  function prevImage() {
    currentIdx = (currentIdx - 1 + imageList.length) % imageList.length;
    showImage(currentIdx);
  }

  function nextImage() {
    currentIdx = (currentIdx + 1) % imageList.length;
    showImage(currentIdx);
  }

  // Open on gallery item click
  galleryItems.forEach(function (item, idx) {
    item.addEventListener('click', function () { openLightbox(idx); });
    // Keyboard support
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevImage);
  lbNext.addEventListener('click', nextImage);

  // Keyboard nav
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')       closeLightbox();
    if (e.key === 'ArrowLeft')    prevImage();
    if (e.key === 'ArrowRight')   nextImage();
  });

  // Click outside image to close
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
})();

/* =====================================================
   12. TESTIMONIALS SLIDER (auto + manual)
   ===================================================== */
(function initTestimonials() {
  const cards    = qsAll('.testimonial-card');
  const dotsWrap = qs('#testimonialDots');
  const prevBtn  = qs('#testimonialPrev');
  const nextBtn  = qs('#testimonialNext');

  if (!cards.length) return;

  let current = 0;
  let autoTimer = null;
  const AUTO_DELAY = 5000; // 5 seconds

  // Build dots
  cards.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });

  function getDots() { return qsAll('.testimonials__dot', dotsWrap); }

  function goTo(idx) {
    cards[current].classList.remove('active');
    getDots()[current].classList.remove('active');

    current = (idx + cards.length) % cards.length;

    cards[current].classList.add('active');
    getDots()[current].classList.add('active');

    // Reset auto-play timer on manual interaction
    restartAuto();
  }

  function startAuto() {
    autoTimer = setInterval(function () {
      goTo(current + 1);
    }, AUTO_DELAY);
  }

  function restartAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

  // Pause on hover
  const sliderEl = qs('#testimonialsSlider');
  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    sliderEl.addEventListener('mouseleave', startAuto);
  }

  // Swipe support (touch)
  let touchStartX = 0;
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', function (e) {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) {
        goTo(delta < 0 ? current + 1 : current - 1);
      }
    }, { passive: true });
  }

  startAuto();
})();

/* =====================================================
   13. CONTACT FORM VALIDATION & SUBMISSION
   ===================================================== */
(function initContactForm() {
  const form       = qs('#contactForm');
  const submitBtn  = qs('#formSubmitBtn');
  const feedback   = qs('#formFeedback');

  if (!form) return;

  // Helper: show field error
  function showError(fieldId, errorId, msg) {
    const field = qs('#' + fieldId);
    const errEl = qs('#' + errorId);
    if (field) field.classList.add('error');
    if (errEl) errEl.textContent = msg;
  }

  // Helper: clear field error
  function clearError(fieldId, errorId) {
    const field = qs('#' + fieldId);
    const errEl = qs('#' + errorId);
    if (field) field.classList.remove('error');
    if (errEl) errEl.textContent = '';
  }

  // Live validation: clear errors on input
  ['name', 'phone', 'email', 'message'].forEach(function (id) {
    const el = qs('#' + id);
    if (!el) return;
    el.addEventListener('input', function () {
      clearError(id, id + 'Error');
    });
  });

  // Validate all fields
  function validateForm() {
    let valid = true;

    const name    = qs('#name');
    const phone   = qs('#phone');
    const email   = qs('#email');
    const message = qs('#message');

    // Name: required, min 2 chars
    if (!name || name.value.trim().length < 2) {
      showError('name', 'nameError', 'Please enter your full name (at least 2 characters).');
      valid = false;
    } else {
      clearError('name', 'nameError');
    }

    // Phone: required, basic pattern
    const phonePattern = /^[+]?[\d\s\-().]{7,15}$/;
    if (!phone || !phonePattern.test(phone.value.trim())) {
      showError('phone', 'phoneError', 'Please enter a valid phone number.');
      valid = false;
    } else {
      clearError('phone', 'phoneError');
    }

    // Email: required, format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email.value.trim())) {
      showError('email', 'emailError', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('email', 'emailError');
    }

    // Message: required, min 10 chars
    if (!message || message.value.trim().length < 10) {
      showError('message', 'messageError', 'Please write at least 10 characters in your message.');
      valid = false;
    } else {
      clearError('message', 'messageError');
    }

    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Reset feedback
    feedback.className = 'form__feedback';
    feedback.textContent = '';

    if (!validateForm()) return;

    // Disable button and show loading state
    submitBtn.disabled = true;
    const btnSpan = qs('span', submitBtn);
    const btnIcon = qs('i', submitBtn);
    if (btnSpan) btnSpan.textContent = 'Sending...';
    if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';

    // Simulate a small delay as if submitting to a server
    // In a real project you'd use fetch() to POST to a backend endpoint
    setTimeout(function () {
      submitBtn.disabled = false;
      if (btnSpan) btnSpan.textContent = 'Send Enquiry';
      if (btnIcon) btnIcon.className = 'fas fa-paper-plane';

      // Show success message
      feedback.textContent =
        '✅ Thank you! Your enquiry has been sent. Our team will contact you within 24 hours.';
      feedback.classList.add('success');
      form.reset();

      // Scroll feedback into view
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Auto-hide feedback after 8 seconds
      setTimeout(function () {
        feedback.className = 'form__feedback';
        feedback.textContent = '';
      }, 8000);
    }, 1500);
  });
})();

/* =====================================================
   14. BACK-TO-TOP BUTTON
   ===================================================== */
(function initBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* =====================================================
   15. FOOTER – CURRENT YEAR
   ===================================================== */
(function initFooterYear() {
  const yearEl = qs('#currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* =====================================================
   16. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
   ===================================================== */
(function initSmoothScroll() {
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href').slice(1);
    if (!targetId) {
      // href="#" – just prevent jump
      e.preventDefault();
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    // Get the offset to account for sticky header + any top bar still visible
    const headerH = qs('#header') ? qs('#header').offsetHeight : 76;

    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - headerH - 8;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
})();

/* =====================================================
   END OF script.js
   ===================================================== */
