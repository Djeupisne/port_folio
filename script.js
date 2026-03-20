/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — DJEUPISNE Oualoumi
   script.js  ·  Toutes les fonctionnalités JS
═══════════════════════════════════════════════════════════════ */

(function () {

  /* ─────────────────────────────────────────────
     1. PROTECTION DU PORTFOLIO
  ───────────────────────────────────────────── */
  const overlay = document.querySelector('.protection-overlay');
  let violationCount = 0;
  const MAX_VIOLATIONS = 3;

  function showProtectionMessage() {
    violationCount++;
    overlay.style.display = 'flex';
    setTimeout(() => { overlay.style.display = 'none'; }, 2000);

    if (violationCount >= MAX_VIOLATIONS) {
      setTimeout(() => { window.location.href = 'about:blank'; }, 2500);
    }
  }

  // Bloquer le clic droit (sauf champs de formulaire)
  document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    showProtectionMessage();
  });

  // Bloquer les raccourcis clavier d'inspection
  document.addEventListener('keydown', function (e) {
    const key = e.key.toLowerCase();
    if (
      e.key === 'F12' ||
      (e.ctrlKey && key === 'u') ||
      (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c'))
    ) {
      e.preventDefault();
      showProtectionMessage();
    }
  });

  // Bloquer la copie (sauf champs de formulaire)
  document.addEventListener('copy', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    showProtectionMessage();
  });

  // Bloquer le glisser-déposer des images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => {
      e.preventDefault();
      showProtectionMessage();
    });
  });

  // Protection anti-iframe
  if (window.self !== window.top) {
    window.top.location = window.self.location;
  }


  /* ─────────────────────────────────────────────
     2. CURSOR GLOW
  ───────────────────────────────────────────── */
  const cursorGlow = document.getElementById('cursorGlow');
  document.addEventListener('mousemove', function (e) {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });


  /* ─────────────────────────────────────────────
     3. ANNÉE FOOTER
  ───────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ─────────────────────────────────────────────
     4. TYPEWRITER HERO
  ───────────────────────────────────────────── */
  const roles   = ['Développeur Full Stack', 'Designer UI/UX', 'Développeur Android', 'Créateur de solutions'];
  let ri = 0, ci = 0, deleting = false;
  const typedEl = document.getElementById('typed-role');

  function typeWriter() {
    if (!typedEl) return;
    const current = roles[ri];

    if (!deleting) {
      typedEl.textContent = current.slice(0, ++ci) + '|';
      if (ci === current.length) {
        deleting = true;
        setTimeout(typeWriter, 1800);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --ci) + '|';
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
    }
    setTimeout(typeWriter, deleting ? 50 : 80);
  }
  typeWriter();


  /* ─────────────────────────────────────────────
     5. CANVAS PARTICULES HERO
  ───────────────────────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resizeCanvas() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x     = Math.random() * W;
        this.y     = Math.random() * H;
        this.r     = Math.random() * 1.5 + 0.3;
        this.vx    = (Math.random() - 0.5) * 0.3;
        this.vy    = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.gold  = Math.random() > 0.5;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.gold
          ? `rgba(212,168,67,${this.alpha})`
          : `rgba(13,207,179,${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212,168,67,${0.07 * (1 - d / 100)})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }


  /* ─────────────────────────────────────────────
     6. SCROLL REVEAL
  ───────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));


  /* ─────────────────────────────────────────────
     7. BARRES DE COMPÉTENCES (scroll-triggered)
  ───────────────────────────────────────────── */
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.exp-fill').forEach(f => {
          f.style.width = f.dataset.w + '%';
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.experience-bar').forEach(b => barObs.observe(b));


  /* ─────────────────────────────────────────────
     8. NAVIGATION ACTIVE AU SCROLL
  ───────────────────────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
    });
  });


  /* ─────────────────────────────────────────────
     9. ANCRAGE FLUIDE (liens internes #)
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────────────────
     10. BOUTON RETOUR EN HAUT
  ───────────────────────────────────────────── */
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 400);
  });
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }


  /* ─────────────────────────────────────────────
     11. GESTION DES MODALS
  ───────────────────────────────────────────── */
  const authModal    = document.getElementById('authModal');
  const paymentModal = document.getElementById('paymentModal');
  let currentProjectId = null;

  // Ouvrir modal auth — bouton "Voir le projet"
  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      currentProjectId = this.dataset.project;
      authModal.classList.add('active');
    });
  });

  // Ouvrir modal paiement — bouton "Code source"
  document.querySelectorAll('.view-code-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      currentProjectId = this.dataset.project;
      paymentModal.classList.add('active');
    });
  });

  // Fermer via bouton ×
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function () {
      this.closest('.modal').classList.remove('active');
    });
  });

  // Fermer en cliquant en dehors
  window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('active');
    }
  });

  // Fermer avec Echap
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      authModal.classList.remove('active');
      paymentModal.classList.remove('active');
    }
  });


  /* ─────────────────────────────────────────────
     12. FORMULAIRE AUTH
  ───────────────────────────────────────────── */
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email     = document.getElementById('auth-email').value;
      const password  = document.getElementById('auth-password').value;
      const statusEl  = document.getElementById('authStatus');
      const submitBtn = this.querySelector('button[type="submit"]');
      const origHTML  = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Vérification…';
      submitBtn.disabled  = true;
      statusEl.innerHTML  = '';

      // Notification de sécurité par email
      try {
        const data = new FormData();
        data.append('_captcha', 'false');
        data.append('_subject', '🔐 ALERTE : Tentative d\'authentification — Portfolio');
        data.append('_template', 'table');
        data.append('Heure', new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Lome', dateStyle: 'full', timeStyle: 'long' }));
        data.append('Email_saisi', email);
        data.append('Longueur_mdp', password.length + ' caractères');
        data.append('Projet', `Projet #${currentProjectId}`);
        data.append('Navigateur', navigator.userAgent);
        data.append('Plateforme', navigator.platform);
        data.append('Langue', navigator.language);
        data.append('URL', window.location.href);
        await fetch('https://formsubmit.co/oualoumidjeupisne@gmail.com', { method: 'POST', body: data });
      } catch (err) {
        console.error('Notification sécurité :', err);
      }

      setTimeout(() => {
        if (email && password.length >= 6) {
          statusEl.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i> Authentification réussie ! Redirection…</div>`;
          setTimeout(() => {
            authModal.classList.remove('active');
            window.open(`projet-${currentProjectId}.html`, '_blank');
            authForm.reset();
            statusEl.innerHTML = '';
          }, 1500);
        } else {
          statusEl.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Email ou mot de passe incorrect.</div>`;
        }
        submitBtn.innerHTML = origHTML;
        submitBtn.disabled  = false;
      }, 1500);
    });
  }


  /* ─────────────────────────────────────────────
     13. FORMULAIRE PAIEMENT
  ───────────────────────────────────────────── */
  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {

    // Formatage numéro de carte
    document.getElementById('card-number').addEventListener('input', function () {
      let v = this.value.replace(/\s/g, '');
      this.value = v.match(/.{1,4}/g)?.join(' ') || v;
    });

    // Formatage date expiration
    document.getElementById('card-expiry').addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '');
      if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
      this.value = v;
    });

    // CVV — chiffres uniquement
    document.getElementById('card-cvv').addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '');
    });

    paymentForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const cardName   = document.getElementById('card-name').value;
      const cardNumber = document.getElementById('card-number').value;
      const cardExpiry = document.getElementById('card-expiry').value;
      const cardCvv    = document.getElementById('card-cvv').value;
      const statusEl   = document.getElementById('paymentStatus');
      const submitBtn  = this.querySelector('button[type="submit"]');
      const origHTML   = submitBtn.innerHTML;

      const isValidCard   = cardNumber.replace(/\s/g, '').length === 16;
      const isValidExpiry = /^\d{2}\/\d{2}$/.test(cardExpiry);
      const isValidCvv    = cardCvv.length === 3;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement…';
      submitBtn.disabled  = true;
      statusEl.innerHTML  = '';

      // Notification paiement par email
      try {
        const data = new FormData();
        data.append('_captcha', 'false');
        data.append('_subject', '💳 ALERTE : Tentative de paiement — Portfolio');
        data.append('_template', 'table');
        data.append('Heure', new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Lome', dateStyle: 'full', timeStyle: 'long' }));
        data.append('Nom_carte', cardName);
        data.append('Carte_masquée', cardNumber.replace(/\d(?=\d{4})/g, '*'));
        data.append('Expiration', cardExpiry);
        data.append('Montant', '19,99 €');
        data.append('Projet', `Code source Projet #${currentProjectId}`);
        data.append('Validation_carte', isValidCard   ? 'Valide' : 'Invalide');
        data.append('Validation_expiry', isValidExpiry ? 'Valide' : 'Invalide');
        data.append('Validation_CVV', isValidCvv    ? 'Valide' : 'Invalide');
        data.append('Navigateur', navigator.userAgent);
        data.append('URL', window.location.href);
        await fetch('https://formsubmit.co/oualoumidjeupisne@gmail.com', { method: 'POST', body: data });
      } catch (err) {
        console.error('Notification paiement :', err);
      }

      setTimeout(() => {
        if (cardName && isValidCard && isValidExpiry && isValidCvv) {
          statusEl.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i> Paiement accepté ! Code source envoyé par email…</div>`;
          setTimeout(() => {
            paymentModal.classList.remove('active');
            alert(`Le code source du projet ${currentProjectId} vous sera envoyé par email dans quelques minutes !`);
            paymentForm.reset();
            statusEl.innerHTML = '';
          }, 2000);
        } else {
          statusEl.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Informations de carte invalides. Veuillez vérifier vos données.</div>`;
        }
        submitBtn.innerHTML = origHTML;
        submitBtn.disabled  = false;
      }, 2000);
    });
  }


  /* ─────────────────────────────────────────────
     14. FORMULAIRE DE CONTACT
  ───────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      const origHTML  = submitBtn.innerHTML;
      const statusEl  = document.getElementById('formStatus');

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours…';
      submitBtn.disabled  = true;
      statusEl.innerHTML  = '';

      try {
        const response = await fetch(this.action, {
          method: 'POST',
          body: new FormData(this),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          statusEl.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i> Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.</div>`;
          this.reset();
        } else {
          throw new Error('Erreur réseau');
        }
      } catch (err) {
        statusEl.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Échec de l'envoi. Contactez-moi directement à <a href="mailto:oualoumidjeupisne@gmail.com" style="color:var(--gold)">oualoumidjeupisne@gmail.com</a></div>`;
      } finally {
        submitBtn.innerHTML = origHTML;
        submitBtn.disabled  = false;
      }
    });
  }

})(); // Fin IIFE
