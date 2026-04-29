/* ═══════════════════════════════════════════════════
   SREEJON BISWAS ANTOR — PORTFOLIO SCRIPT
   Handles: Preloader, Cursor, Particles, Typing,
            Navbar, Scroll Reveal, Skill Bars, Form
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─── UTILITY: Wait for DOM ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCursor();
  initParticles();
  initTypingEffect();
  initNavbar();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initSmoothScroll();
});

/* ══════════════════════════════════════════════════
   1. PRELOADER
══════════════════════════════════════════════════ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Match the CSS fill animation duration (2s)
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Trigger entrance animations after preloader
    setTimeout(() => {
      document.querySelectorAll('#hero .reveal-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 150);
      });
    }, 300);
  }, 2200);
}

/* ══════════════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  // Lerp ring to mouse for smooth trailing
  function animateRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover expansion
  const hoverTargets = 'a, button, .project-card, .award-card, .skill-card, .pub-item, .ri-item';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });
}

/* ══════════════════════════════════════════════════
   3. PARTICLE CANVAS
══════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouseX = -9999, mouseY = -9999;
  const PARTICLE_COUNT = window.innerWidth < 768 ? 60 : 110;
  const CONNECTION_DIST = 120;
  const MOUSE_DIST = 160;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.size   = Math.random() * 1.8 + 0.4;
      this.alpha  = Math.random() * 0.5 + 0.1;
      this.color  = Math.random() > 0.6 ? '#00d2ff' : '#00ffcc';
    }

    update() {
      // Mouse repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.6;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }

      // Damping
      this.vx *= 0.98;
      this.vy *= 0.98;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap horizontally
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      // Respawn from bottom if gone off top
      if (this.y < -20) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Create particles
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ══════════════════════════════════════════════════
   4. TYPING EFFECT
══════════════════════════════════════════════════ */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Computer Science Researcher',
    'TinyML Enthusiast',
    'Edge Intelligence Builder',
    'LLM Agent Developer',
    'Embedded Systems Architect',
    'Problem Solver at the Edge'
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  const SPEED_TYPE   = 65;
  const SPEED_DELETE = 35;
  const PAUSE_END    = 1800;
  const PAUSE_START  = 400;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; tick(); }, PAUSE_END);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
    }

    setTimeout(tick, deleting ? SPEED_DELETE : SPEED_TYPE);
  }

  // Delay start until after preloader
  setTimeout(tick, 2400);
}

/* ══════════════════════════════════════════════════
   5. NAVBAR
══════════════════════════════════════════════════ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  // Scroll: add class when not at top
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
  }, { passive: true });

  // Mobile toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active section highlight
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');
    const scrollY  = window.scrollY + 120;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }
}

/* ══════════════════════════════════════════════════
   6. SCROLL REVEAL (Intersection Observer)
══════════════════════════════════════════════════ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) * 120 : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => {
    // Skip hero elements — handled by preloader
    if (!el.closest('#hero')) observer.observe(el);
  });
}

/* ══════════════════════════════════════════════════
   7. SKILL BARS (animate on scroll into view)
══════════════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.dataset.width + '%';
        // Small delay for visual stagger
        const idx   = Array.from(bars).indexOf(bar);
        setTimeout(() => {
          bar.style.width = width;
        }, idx * 80 + 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ══════════════════════════════════════════════════
   8. CONTACT FORM
══════════════════════════════════════════════════ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');

    // Loading state
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';

    // Simulate async send (replace with real API call)
    setTimeout(() => {
      btn.querySelector('span').textContent = 'Sent ✓';
      btn.style.background = 'linear-gradient(135deg, #00ffcc, #00d2ff)';
      if (success) success.classList.add('visible');
      form.reset();

      // Reset after 4s
      setTimeout(() => {
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Send Message';
        btn.style.background = '';
        if (success) success.classList.remove('visible');
      }, 4000);
    }, 1400);
  });

  // Subtle floating label on focus
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'scale(1.01)';
    });
    input.addEventListener('blur', () => {
      input.parentElement.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════════════
   9. SMOOTH SCROLL (for older browsers / extra polish)
══════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════════════════
   10. MISC: Card tilt effect on mouse move
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const tiltCards = document.querySelectorAll('.project-card, .award-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 4;
      const rotY   =  dx * 4;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
});
