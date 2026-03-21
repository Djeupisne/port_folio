/* ═══════════════════════════════════════════════════════════
   PROTECTION DU PORTFOLIO
═══════════════════════════════════════════════════════════ */
(function () {
    const overlay = document.getElementById('protectionOverlay');
    let violationCount = 0;

    function showProtection() {
        violationCount++;
        overlay.classList.add('show');
        setTimeout(() => overlay.classList.remove('show'), 2200);
        if (violationCount >= 3) {
            setTimeout(() => { window.location.href = 'about:blank'; }, 2700);
        }
    }

    // Clic droit
    document.addEventListener('contextmenu', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault(); showProtection();
    });

    // Raccourcis d'inspection
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.key.toLowerCase() === 'u') ||
            (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase()))) {
            e.preventDefault(); showProtection();
        }
    });

    // Copie (sauf inputs)
    document.addEventListener('copy', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault(); showProtection();
    });

    // Drag d'images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', e => { e.preventDefault(); showProtection(); });
    });

    // Anti-iframe
    if (window.self !== window.top) window.top.location = window.self.location;
})();


/* ═══════════════════════════════════════════════════════════
   ⚙️  CONFIGURATION — MODIFIEZ ICI VOS IDENTIFIANTS
═══════════════════════════════════════════════════════════ */
const CONFIG = {
    // 🔐 Identifiants pour "Voir le projet"
    auth: {
        email:    'admin@portfolio.com',   // ← changez ici
        password: 'djeupisne2025'          // ← changez ici
    },
    // 📧 Votre adresse email de contact
    email: 'oualoumidjeupisne@gmail.com'
};


/* ═══════════════════════════════════════════════════════════
   AOS
═══════════════════════════════════════════════════════════ */
AOS.init({ duration: 750, easing: 'ease-out-cubic', once: true, offset: 80 });


/* ═══════════════════════════════════════════════════════════
   CANVAS PARTICLES
═══════════════════════════════════════════════════════════ */
(function () {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); init(); });

    function rand(min, max) { return Math.random() * (max - min) + min; }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = rand(0, W);
            this.y = rand(0, H);
            this.r = rand(0.5, 2.2);
            this.dx = rand(-0.3, 0.3);
            this.dy = rand(-0.5, -0.1);
            this.alpha = rand(0.2, 0.8);
            this.color = Math.random() > .5
                ? `rgba(123,151,255,${this.alpha})`
                : `rgba(76,201,240,${this.alpha})`;
        }
        update() {
            this.x += this.dx;
            this.y += this.dy;
            if (this.y < -4 || this.x < -4 || this.x > W + 4) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        const count = Math.floor((W * H) / 8000);
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });

        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(123,151,255,${0.08 * (1 - dist / 100)})`;
                    ctx.lineWidth = .5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    init();
    animate();
})();


/* ═══════════════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════════════ */
(function () {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const texts = [
        'Développeur Full Stack',
        'Designer UI/UX',
        'Passionné de Code',
        'Créateur de Solutions Web',
    ];
    let textIndex = 0, charIndex = 0, deleting = false;

    function type() {
        const current = texts[textIndex];
        if (!deleting) {
            el.textContent = current.substring(0, ++charIndex);
            if (charIndex === current.length) {
                deleting = true;
                return setTimeout(type, 1800);
            }
        } else {
            el.textContent = current.substring(0, --charIndex);
            if (charIndex === 0) {
                deleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        }
        setTimeout(type, deleting ? 60 : 90);
    }
    setTimeout(type, 500);
})();


/* ═══════════════════════════════════════════════════════════
   COUNTERS
═══════════════════════════════════════════════════════════ */
(function () {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.getAttribute('data-target');
            const suffix = el.getAttribute('data-suffix') || '';
            let count = 0;
            const step = Math.ceil(target / 50);
            const interval = setInterval(() => {
                count = Math.min(count + step, target);
                el.textContent = count + suffix;
                if (count >= target) clearInterval(interval);
            }, 30);
            observer.unobserve(el);
        });
    }, { threshold: .5 });
    counters.forEach(c => observer.observe(c));
})();


/* ═══════════════════════════════════════════════════════════
   THÈME
═══════════════════════════════════════════════════════════ */
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.className = 'fas fa-sun';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        if (themeIcon) themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        if (isDark) document.body.removeAttribute('data-theme');
    });
}


/* ═══════════════════════════════════════════════════════════
   BURGER MENU
═══════════════════════════════════════════════════════════ */
const burger = document.querySelector('.burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });
}


/* ═══════════════════════════════════════════════════════════
   NAV SCROLL STYLE
═══════════════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.style.boxShadow = window.scrollY > 50
        ? '0 4px 30px rgba(0,0,0,.12)' : '';
});


/* ═══════════════════════════════════════════════════════════
   BACK TO TOP
═══════════════════════════════════════════════════════════ */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
    if (!backTop) return;
    backTop.classList.toggle('active', window.scrollY > 400);
});
if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ═══════════════════════════════════════════════════════════
   SMOOTH ANCHORS
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});


/* ═══════════════════════════════════════════════════════════
   FOOTER YEAR
═══════════════════════════════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ═══════════════════════════════════════════════════════════
   MODALS HELPER
═══════════════════════════════════════════════════════════ */
let currentProjectId = null;
let currentProjectName = '';

function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow = '';
}

// Fermeture via boutons ×
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.getAttribute('data-modal')));
});

// Fermeture en cliquant hors du modal-box
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal(modal.id);
    });
});

// Fermeture avec Échap
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.open').forEach(m => closeModal(m.id));
    }
});


/* ═══════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════ */
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.background = type === 'success'
        ? 'linear-gradient(135deg,#16a34a,#15803d)'
        : 'linear-gradient(135deg,#dc2626,#b91c1c)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}


/* ═══════════════════════════════════════════════════════════
   BOUTON "VOIR LE PROJET" → Modal auth
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        currentProjectId = btn.getAttribute('data-project');
        currentProjectName = btn.getAttribute('data-name') || `Projet #${currentProjectId}`;
        document.getElementById('authForm').reset();
        document.getElementById('authStatus').innerHTML = '';
        openModal('authModal');
    });
});


/* ═══════════════════════════════════════════════════════════
   BOUTON "CODE SOURCE" → Modal paiement
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.view-code-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        currentProjectId = btn.getAttribute('data-project');
        currentProjectName = btn.getAttribute('data-name') || `Projet #${currentProjectId}`;
        document.getElementById('paymentProjectName').textContent =
            `Accédez au code source complet de « ${currentProjectName} » pour 19,99€.`;
        document.getElementById('paymentForm').reset();
        document.getElementById('paymentStatus').innerHTML = '';
        openModal('paymentModal');
    });
});


/* ═══════════════════════════════════════════════════════════
   FORMATAGE CARTE BANCAIRE
═══════════════════════════════════════════════════════════ */
document.getElementById('card-number').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 16);
    this.value = v.match(/.{1,4}/g)?.join('  ') || v;
});
document.getElementById('card-expiry').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
    this.value = v;
});
document.getElementById('card-cvv').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').substring(0, 3);
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE PAIEMENT (simulation — examen local)
═══════════════════════════════════════════════════════════ */
document.getElementById('paymentForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const cardName   = document.getElementById('card-name').value.trim();
    // ✅ Nettoyage correct — supprime TOUS les caractères non numériques
    const cardNumber = document.getElementById('card-number').value.replace(/\D/g, '');
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv    = document.getElementById('card-cvv').value;
    const status     = document.getElementById('paymentStatus');
    const btn        = this.querySelector('button[type="submit"]');
    const orig       = btn.innerHTML;

    // Validation basique
    const validCard   = cardNumber.length === 16;
    const validExpiry = /^\d{2}\/\d{2}$/.test(cardExpiry);
    const validCvv    = cardCvv.length === 3;

    if (!cardName || !validCard || !validExpiry || !validCvv) {
        status.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Informations de carte invalides. Veuillez vérifier vos données.</div>`;
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';
    btn.disabled = true;
    status.innerHTML = '';

    // Notification via mailto (fonctionne en local)
    try {
        const subject = encodeURIComponent(`💳 Tentative d'achat — ${currentProjectName}`);
        const body    = encodeURIComponent(
            `Projet : ${currentProjectName}\nMontant : 19,99€\nCarte : **** **** **** ${cardNumber.slice(-4)}\nExpiration : ${cardExpiry}\nHeure : ${new Date().toLocaleString('fr-FR')}\nNavigateur : ${navigator.userAgent}`
        );
        const link = document.createElement('a');
        link.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (_) {}

    // Simulation paiement (2s de suspense)
    setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;

        // Succès simulé
        status.innerHTML = `
            <div class="payment-success">
                <div class="success-icon"><i class="fas fa-check"></i></div>
                <h3>Paiement accepté !</h3>
                <p>Le code source de <strong>${currentProjectName}</strong> sera envoyé à votre email dans quelques minutes.</p>
            </div>`;

        setTimeout(() => {
            closeModal('paymentModal');
            this.reset();
            status.innerHTML = '';
            showToast('✅ Paiement validé ! Code source envoyé par email.');
        }, 3000);
    }, 2000);
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE AUTH
═══════════════════════════════════════════════════════════ */
document.getElementById('authForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const email    = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const status   = document.getElementById('authStatus');
    const btn      = this.querySelector('button[type="submit"]');
    const orig     = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Vérification...';
    btn.disabled = true;
    status.innerHTML = '';

    // Notification email via mailto (fonctionne en local)
    try {
        const subject = encodeURIComponent(`🔐 Tentative d'accès — ${currentProjectName}`);
        const body = encodeURIComponent(
            `Email saisi : ${email}\nProjet : ${currentProjectName}\nHeure : ${new Date().toLocaleString('fr-FR')}\nNavigateur : ${navigator.userAgent}`
        );
        // Notification silencieuse (s'ouvre en arrière-plan)
        const link = document.createElement('a');
        link.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (_) {}

    setTimeout(() => {
        // ✅ Vérification avec les identifiants définis dans CONFIG
        if (email === CONFIG.auth.email && password === CONFIG.auth.password) {
            status.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i> Connexion réussie ! Redirection en cours...</div>`;
            setTimeout(() => {
                closeModal('authModal');
                window.open(`projet-${currentProjectId}.html`, '_blank');
                this.reset();
                status.innerHTML = '';
            }, 1600);
        } else {
            status.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Email ou mot de passe incorrect.</div>`;
        }
        btn.innerHTML = orig;
        btn.disabled = false;
    }, 1400);
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE DEMANDE CODE SOURCE
═══════════════════════════════════════════════════════════ */
document.getElementById('codeAccessForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name   = document.getElementById('access-name').value.trim();
    const email  = document.getElementById('access-email').value.trim();
    const reason = document.getElementById('access-reason').value.trim();
    const status = document.getElementById('codeAccessStatus');
    const btn    = this.querySelector('button[type="submit"]');
    const orig   = btn.innerHTML;

    if (!name || !email || !reason) return;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    btn.disabled = true;
    status.innerHTML = '';

    // Envoi via mailto (fonctionne en local)
    try {
        const subject = encodeURIComponent(`🔓 Demande d'accès code source — ${currentProjectName}`);
        const body = encodeURIComponent(
            `Nom : ${name}\nEmail : ${email}\nProjet : ${currentProjectName}\nMotif : ${reason}\nHeure : ${new Date().toLocaleString('fr-FR')}`
        );
        window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;

        status.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i> Demande envoyée ! Vous recevrez une réponse par email.</div>`;
        setTimeout(() => {
            closeModal('codeAccessModal');
            this.reset();
            status.innerHTML = '';
            showToast('✅ Demande d\'accès envoyée avec succès !');
        }, 2000);
    } catch (_) {
        status.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Erreur. Contactez directement : ${CONFIG.email}</div>`;
    }

    btn.innerHTML = orig;
    btn.disabled = false;
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE CONTACT — mailto (fonctionne en local)
═══════════════════════════════════════════════════════════ */
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn    = this.querySelector('button[type="submit"]');
    const orig   = btn.innerHTML;

    const nom     = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const sujet   = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    btn.disabled = true;
    status.innerHTML = '';

    try {
        const subject = encodeURIComponent(`[Portfolio] ${sujet} — de ${nom}`);
        const body    = encodeURIComponent(
            `Nom : ${nom}\nEmail : ${email}\n\nMessage :\n${message}`
        );
        window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;

        setTimeout(() => {
            status.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i> Votre client email s'est ouvert. Envoyez le message depuis votre boîte mail.</div>`;
            this.reset();
            showToast('✅ Message prêt à envoyer !');
            btn.innerHTML = orig;
            btn.disabled = false;
        }, 800);
    } catch (_) {
        status.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Échec. Écrivez directement à <a href="mailto:${CONFIG.email}" style="color:inherit;text-decoration:underline">${CONFIG.email}</a></div>`;
        btn.innerHTML = orig;
        btn.disabled = false;
    }
});
