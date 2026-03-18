/**
 * Bailey Kennedy-Wall — CV Website
 * script.js — Navigation, animations, interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     PAGE NAVIGATION
  ───────────────────────────────────────── */
  const navLinks   = document.querySelectorAll('.nav-link');
  const pages      = document.querySelectorAll('.page');
  const sidebar    = document.querySelector('.sidebar');
  const hamburger  = document.getElementById('hamburger');

  /**
   * Show a specific page by its id, update nav state.
   * @param {string} pageId - The id of the section to show
   */
  function showPage(pageId) {
    // Deactivate all pages
    pages.forEach(page => page.classList.remove('active'));

    // Activate target page
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      // Re-trigger animation
      target.style.animation = 'none';
      requestAnimationFrame(() => {
        target.style.animation = '';
      });
    }

    // Update nav links
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });

    // Trigger page-specific animations
    triggerPageAnimations(pageId);

    // Close mobile sidebar
    if (sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
    }
  }

  // Nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  // CTA buttons on home page
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      showPage(btn.dataset.goto);
    });
  });

  // Hash-based deep linking
  function handleHash() {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'about', 'experience', 'skills', 'qualifications', 'interests', 'contact'];
    if (hash && validPages.includes(hash)) {
      showPage(hash);
    }
  }
  window.addEventListener('hashchange', handleHash);
  handleHash();


  /* ─────────────────────────────────────────
     HAMBURGER — MOBILE
  ───────────────────────────────────────── */
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }


  /* ─────────────────────────────────────────
     PAGE-SPECIFIC ANIMATIONS
  ───────────────────────────────────────── */

  /**
   * Run staggered entrance animations for a given page.
   * @param {string} pageId
   */
  function triggerPageAnimations(pageId) {
    switch (pageId) {

      case 'experience':
        animateTimeline();
        break;

      case 'skills':
        animateSkillBars();
        break;

      case 'qualifications':
        animateQualCards();
        break;

      case 'interests':
        animateInterestCards();
        break;
    }
  }

  /** Stagger-reveal timeline items */
  function animateTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
      item.classList.remove('visible');
      setTimeout(() => item.classList.add('visible'), 120 * i);
    });
  }

  /** Animate skill bar fills */
  function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    fills.forEach((fill, i) => {
      fill.style.width = '0%';
      const target = fill.dataset.w || '80';
      setTimeout(() => {
        fill.style.width = target + '%';
      }, 100 + 100 * i);
    });
  }

  /** Stagger-reveal qualification cards */
  function animateQualCards() {
    const cards = document.querySelectorAll('.qual-card');
    cards.forEach((card, i) => {
      card.classList.remove('visible');
      setTimeout(() => card.classList.add('visible'), 120 * i);
    });
  }

  /** Stagger-reveal interest cards */
  function animateInterestCards() {
    const cards = document.querySelectorAll('.interest-card');
    cards.forEach((card, i) => {
      card.classList.remove('visible');
      setTimeout(() => card.classList.add('visible'), 100 * i);
    });
  }

  // Run animations for the initially active page
  const activePage = document.querySelector('.page.active');
  if (activePage) triggerPageAnimations(activePage.id);


  /* ─────────────────────────────────────────
     KEYBOARD NAVIGATION
  ───────────────────────────────────────── */
  const pageOrder = ['home', 'about', 'experience', 'skills', 'qualifications', 'interests', 'contact'];

  document.addEventListener('keydown', (e) => {
    const currentPage = document.querySelector('.page.active');
    if (!currentPage) return;
    const idx = pageOrder.indexOf(currentPage.id);

    if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && idx < pageOrder.length - 1) {
      e.preventDefault();
      showPage(pageOrder[idx + 1]);
    } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && idx > 0) {
      e.preventDefault();
      showPage(pageOrder[idx - 1]);
    }
  });


  /* ─────────────────────────────────────────
     KEYBOARD SHORTCUT HINTS (subtle)
  ───────────────────────────────────────── */
  const hint = document.querySelector('.home-scroll-hint');
  if (hint) {
    const messages = [
      'Scroll or use the nav →',
      'Press ← → arrow keys to navigate',
      'Click nav icons to jump to a section'
    ];
    let mi = 0;
    setInterval(() => {
      mi = (mi + 1) % messages.length;
      hint.style.opacity = '0';
      setTimeout(() => {
        hint.textContent = messages[mi];
        hint.style.opacity = '1';
      }, 400);
    }, 3500);
    hint.style.transition = 'opacity 0.4s';
  }


  /* ─────────────────────────────────────────
     SIDEBAR HOVER EXPAND — close on outside click (mobile)
  ───────────────────────────────────────── */
  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('mobile-open') &&
      !sidebar.contains(e.target) &&
      e.target !== hamburger
    ) {
      sidebar.classList.remove('mobile-open');
    }
  });


  /* ─────────────────────────────────────────
     ACTIVE NAV HIGHLIGHT — map hash to page
  ───────────────────────────────────────── */
  function updateNavFromPage(pageId) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });
  }

  // Observe page visibility changes (optional future enhancement)
  // Currently handled directly in showPage()

  /* ─────────────────────────────────────────
     SWIPE / TOUCH SUPPORT
  ───────────────────────────────────────── */
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only trigger on mostly-horizontal swipes
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.8) return;

    const currentPage = document.querySelector('.page.active');
    if (!currentPage) return;
    const idx = pageOrder.indexOf(currentPage.id);

    if (dx < 0 && idx < pageOrder.length - 1) {
      showPage(pageOrder[idx + 1]); // swipe left = next
    } else if (dx > 0 && idx > 0) {
      showPage(pageOrder[idx - 1]); // swipe right = prev
    }
  }, { passive: true });


  /* ─────────────────────────────────────────
     TIMELINE CARD — hover expand note (desktop)
  ───────────────────────────────────────── */
  document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'rgba(196,168,130,0.35)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '';
    });
  });


  /* ─────────────────────────────────────────
     PRINT / DOWNLOAD as PDF hint
  ───────────────────────────────────────── */
  // Allow Ctrl/Cmd + P to print natively (no override needed)
  // All pages visible when printing — handled by @media print in CSS if desired


  /* ─────────────────────────────────────────
     INITIAL LOAD — animate home page elements
  ───────────────────────────────────────── */
  (function animateHomeLoad() {
    const elements = [
      document.querySelector('.home-overline'),
      document.querySelector('.home-name'),
      document.querySelector('.home-tagline'),
      document.querySelector('.home-chips'),
      document.querySelector('.home-actions'),
    ];
    elements.forEach((el, i) => {
      if (!el) return;
      el.style.opacity  = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + 120 * i);
    });

    const photoFrame = document.querySelector('.photo-frame');
    if (photoFrame) {
      photoFrame.style.opacity  = '0';
      photoFrame.style.transform = 'scale(0.92)';
      photoFrame.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      setTimeout(() => {
        photoFrame.style.opacity   = '1';
        photoFrame.style.transform = 'scale(1)';
      }, 150);
    }
  })();

}); // end DOMContentLoaded
