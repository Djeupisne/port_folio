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
    img.addEventListener('dragstart', function (e) {
      e.preventDefault();
      showProtectionMessage();
    });
  });

  // Protection anti-iframe
  if (window.self !== window.top) {
    window.top.location = window.self.location;
  }


  /* ─────────────────────────────────────────────
     2. INITIALISATION AOS
  ───────────────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing:   'ease-in-out',
      once:     true,
      offset:   100
    });
  }


  /* ─────────────────────────────────────────────
     3. THÈME SOMBRE / CLAIR
  ───────────────────────────────────────────── */
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon   = themeToggle ? themeToggle.querySelector('i') : null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Appliquer le thème sauvegardé ou celui du système
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
    document.body.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.removeAttribute('data-theme');
        if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
      } else {
        document.body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
      }
    });
  }


  /* ─────────────────────────────────────────────
     4. BOUTON RETOUR EN HAUT
  ───────────────────────────────────────────── */
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', function () {
    if (backToTopBtn) {
      backToTopBtn.classList.toggle('active', window.pageYOffset > 300);
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ─────────────────────────────────────────────
     5. ANCRAGE FLUIDE (liens internes #)
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
     6. ANNÉE FOOTER
  ───────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ─────────────────────────────────────────────
     7. GESTION DES MODALS
  ───────────────────────────────────────────── */
  const authModal    = document.getElementById('authModal');
  const paymentModal = document.getElementById('paymentModal');
  let currentProjectId = null;

  // Fermer via bouton ×
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function () {
      this.closest('.modal').style.display = 'none';
    });
  });

  // Fermer en cliquant en dehors du contenu
  window.addEventListener('click', function (e) {
    if (e.target === authModal)    authModal.style.display    = 'none';
    if (e.target === paymentModal) paymentModal.style.display = 'none';
  });

  // Fermer avec Échap
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (authModal)    authModal.style.display    = 'none';
      if (paymentModal) paymentModal.style.display = 'none';
    }
  });

  // Ouvrir modal auth — "Voir le projet"
  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      currentProjectId = this.dataset.project;
      if (authModal) authModal.style.display = 'block';
    });
  });

  // Ouvrir modal paiement — "Code source"
  document.querySelectorAll('.view-code-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      currentProjectId = this.dataset.project;
      if (paymentModal) paymentModal.style.display = 'block';
    });
  });


  /* ─────────────────────────────────────────────
     8. FORMULAIRE AUTH
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
        data.append('Heure',       new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Lome', dateStyle: 'full', timeStyle: 'long' }));
        data.append('Email_saisi', email);
        data.append('Longueur_mdp', password.length + ' caractères');
        data.append('Projet',      'Projet #' + currentProjectId);
        data.append('Navigateur',  navigator.userAgent);
        data.append('Plateforme',  navigator.platform);
        data.append('Langue',      navigator.language);
        data.append('URL',         window.location.href);
        await fetch('https://formsubmit.co/oualoumidjeupisne@gmail.com', { method: 'POST', body: data });
      } catch (err) {
        console.error('Notification sécurité :', err);
      }

      setTimeout(function () {
        if (email && password.length >= 6) {
          statusEl.innerHTML = `
            <div class="alert alert-success">
              <i class="fas fa-check-circle"></i>
              Authentification réussie ! Redirection en cours…
            </div>`;
          setTimeout(function () {
            authModal.style.display = 'none';
            window.open('projet-' + currentProjectId + '.html', '_blank');
            authForm.reset();
            statusEl.innerHTML = '';
          }, 1500);
        } else {
          statusEl.innerHTML = `
            <div class="alert alert-error">
              <i class="fas fa-exclamation-circle"></i>
              Email ou mot de passe incorrect.
            </div>`;
        }
        submitBtn.innerHTML = origHTML;
        submitBtn.disabled  = false;
      }, 1500);
    });
  }


  /* ─────────────────────────────────────────────
     9. FORMULAIRE PAIEMENT
  ───────────────────────────────────────────── */
  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {

    // Formatage numéro de carte
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', function () {
        let v = this.value.replace(/\s/g, '');
        this.value = v.match(/.{1,4}/g)?.join(' ') || v;
      });
    }

    // Formatage date d'expiration
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '');
        if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
        this.value = v;
      });
    }

    // CVV — chiffres uniquement
    const cardCvvInput = document.getElementById('card-cvv');
    if (cardCvvInput) {
      cardCvvInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
      });
    }

    paymentForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const cardName   = document.getElementById('card-name').value;
      const cardNumber = cardNumberInput ? cardNumberInput.value : '';
      const cardExpiry = cardExpiryInput ? cardExpiryInput.value : '';
      const cardCvv    = cardCvvInput    ? cardCvvInput.value    : '';
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
        data.append('Heure',             new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Lome', dateStyle: 'full', timeStyle: 'long' }));
        data.append('Nom_carte',          cardName);
        data.append('Carte_masquée',      cardNumber.replace(/\d(?=\d{4})/g, '*'));
        data.append('Expiration',         cardExpiry);
        data.append('Montant',            '19,99 €');
        data.append('Projet',             'Code source Projet #' + currentProjectId);
        data.append('Validation_carte',   isValidCard   ? 'Valide' : 'Invalide');
        data.append('Validation_expiry',  isValidExpiry ? 'Valide' : 'Invalide');
        data.append('Validation_CVV',     isValidCvv    ? 'Valide' : 'Invalide');
        data.append('Navigateur',         navigator.userAgent);
        data.append('URL',                window.location.href);
        await fetch('https://formsubmit.co/oualoumidjeupisne@gmail.com', { method: 'POST', body: data });
      } catch (err) {
        console.error('Notification paiement :', err);
      }

      setTimeout(function () {
        if (cardName && isValidCard && isValidExpiry && isValidCvv) {
          statusEl.innerHTML = `
            <div class="alert alert-success">
              <i class="fas fa-check-circle"></i>
              Paiement accepté ! Code source envoyé par email…
            </div>`;
          setTimeout(function () {
            paymentModal.style.display = 'none';
            alert('Le code source du projet ' + currentProjectId + ' vous sera envoyé par email dans quelques minutes !');
            paymentForm.reset();
            statusEl.innerHTML = '';
          }, 2000);
        } else {
          statusEl.innerHTML = `
            <div class="alert alert-error">
              <i class="fas fa-exclamation-circle"></i>
              Informations de carte invalides. Veuillez vérifier vos données.
            </div>`;
        }
        submitBtn.innerHTML = origHTML;
        submitBtn.disabled  = false;
      }, 2000);
    });
  }


  /* ─────────────────────────────────────────────
     10. FORMULAIRE DE CONTACT
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
        // FormSubmit endpoint AJAX — retourne du JSON sans redirection
        const AJAX_URL = 'https://formsubmit.co/ajax/oualoumidjeupisne@gmail.com';

        const formData = new FormData(this);

        const response = await fetch(AJAX_URL, {
          method:  'POST',
          headers: { 'Accept': 'application/json' },
          body:    formData
        });

        const result = await response.json();

        if (result.success === 'true' || result.success === true) {
          statusEl.innerHTML = `
            <div class="alert alert-success">
              <i class="fas fa-check-circle"></i>
              Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
            </div>`;
          this.reset();
        } else {
          throw new Error(result.message || 'Envoi échoué');
        }
      } catch (err) {
        console.error('Erreur envoi contact :', err);
        statusEl.innerHTML = `
          <div class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            Échec de l'envoi. Contactez-moi directement à
            <a href="mailto:oualoumidjeupisne@gmail.com">oualoumidjeupisne@gmail.com</a>
          </div>`;
      } finally {
        submitBtn.innerHTML = origHTML;
        submitBtn.disabled  = false;
      }
    });
  }

})(); // Fin IIFE
