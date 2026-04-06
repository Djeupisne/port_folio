/* ═══════════════════════════════════════════════════════════
   ⚙️  CONFIGURATION — MODIFIEZ CES VALEURS
   ─────────────────────────────────────────────────────────
   Pour trouver votre Service ID EmailJS :
   → emailjs.com > "Services de messagerie" > ID sous le nom
     (ressemble à  service_abc1234)
═══════════════════════════════════════════════════════════ */
const CONFIG = {
    emailjs_public_key:  'lHZxVLfk008tn4vdi',
    emailjs_service_id:  'service_ih9utt5',     // ← REMPLACEZ PAR VOTRE VRAI ID
    emailjs_template_id: 'template_k6mivvs',

    auth: {
        email:    'admin@portfolio.com',         // ← email pour "Voir le projet"
        password: 'djeupisne2025'                // ← mot de passe
    },
    email: 'oualoumidjeupisne@gmail.com'
};


/* ═══════════════════════════════════════════════════════════
   PROTECTION
═══════════════════════════════════════════════════════════ */
(function () {
    const overlay = document.getElementById('protectionOverlay');
    let count = 0;

    function show() {
        count++;
        overlay.classList.add('show');
        setTimeout(() => overlay.classList.remove('show'), 2200);
        if (count >= 3) setTimeout(() => { window.location.href = 'about:blank'; }, 2700);
    }

    document.addEventListener('contextmenu', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault(); show();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.key.toLowerCase() === 'u') ||
            (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase()))) {
            e.preventDefault(); show();
        }
    });
    document.addEventListener('copy', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault(); show();
    });
    document.querySelectorAll('img').forEach(img =>
        img.addEventListener('dragstart', e => { e.preventDefault(); show(); })
    );
    if (window.self !== window.top) window.top.location = window.self.location;
})();


/* ═══════════════════════════════════════════════════════════
   AOS
═══════════════════════════════════════════════════════════ */
AOS.init({ duration: 720, easing: 'ease-out-cubic', once: true, offset: 70 });


/* ═══════════════════════════════════════════════════════════
   EMAILJS — chargement dynamique + auto-vérification
═══════════════════════════════════════════════════════════ */
let ejsReady = false;

(function () {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => {
        emailjs.init(CONFIG.emailjs_public_key);
        ejsReady = true;
        console.log('%c✅ EmailJS prêt', 'color:#22c55e;font-weight:bold');
        if (CONFIG.emailjs_service_id === 'service_XXXXXXX')
            console.warn('%c⚠️ SERVICE ID non configuré dans CONFIG !', 'color:#f59e0b;font-weight:bold');
    };
    s.onerror = () => console.error('%c❌ EmailJS non chargé (connexion internet ?)', 'color:#ef4444;font-weight:bold');
    document.head.appendChild(s);
})();

function sendEmail(params) {
    return new Promise((resolve, reject) => {
        if (!ejsReady) { reject(new Error('EmailJS non prêt')); return; }
        console.log('📤 Envoi → service:', CONFIG.emailjs_service_id);
        emailjs.send(CONFIG.emailjs_service_id, CONFIG.emailjs_template_id, params)
            .then(r => { console.log('%c✅ Envoyé', 'color:#22c55e', r.status); resolve(r); })
            .catch(e => { console.error('%c❌ Erreur EmailJS:', 'color:#ef4444', e); reject(e); });
    });
}


/* ═══════════════════════════════════════════════════════════
   CANVAS PARTICULES
═══════════════════════════════════════════════════════════ */
(function () {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];

    function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', () => { resize(); init(); });

    function rnd(a, b) { return Math.random() * (b - a) + a; }

    class P {
        constructor() { this.reset(); }
        reset() {
            this.x = rnd(0,W); this.y = rnd(0,H);
            this.s = rnd(0.5,2.2); this.vx = rnd(-0.3,0.3); this.vy = rnd(-0.5,-0.1);
            this.a = rnd(0.2,0.8);
            this.c = Math.random()>.5 ? `rgba(123,151,255,${this.a})` : `rgba(76,201,240,${this.a})`;
        }
        move() { this.x+=this.vx; this.y+=this.vy; if(this.y<-4||this.x<-4||this.x>W+4) this.reset(); }
        draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.s,0,Math.PI*2); ctx.fillStyle=this.c; ctx.fill(); }
    }

    function init() {
        pts = [];
        const n = Math.floor((W * H) / 8000);
        for (let i = 0; i < n; i++) pts.push(new P());
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(p => { p.move(); p.draw(); });
        for (let i = 0; i < pts.length; i++)
            for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < 100) {
                    ctx.beginPath();
                    ctx.moveTo(pts[i].x, pts[i].y);
                    ctx.lineTo(pts[j].x, pts[j].y);
                    ctx.strokeStyle = `rgba(123,151,255,${0.07*(1-d/100)})`;
                    ctx.lineWidth = .5;
                    ctx.stroke();
                }
            }
        requestAnimationFrame(loop);
    }
    init(); loop();
})();


/* ═══════════════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════════════ */
(function () {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const texts = ['Développeur Full Stack','Designer UI/UX','Passionné de Code','Créateur de Solutions Web'];
    let ti = 0, ci = 0, del = false;

    function type() {
        const cur = texts[ti];
        if (!del) {
            el.textContent = cur.substring(0, ++ci);
            if (ci === cur.length) { del = true; return setTimeout(type, 1800); }
        } else {
            el.textContent = cur.substring(0, --ci);
            if (ci === 0) { del = false; ti = (ti + 1) % texts.length; }
        }
        setTimeout(type, del ? 55 : 88);
    }
    setTimeout(type, 600);
})();


/* ═══════════════════════════════════════════════════════════
   COUNTERS
═══════════════════════════════════════════════════════════ */
(function () {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target, target = +el.getAttribute('data-target'), step = Math.ceil(target / 50);
            let n = 0;
            const iv = setInterval(() => { n = Math.min(n + step, target); el.textContent = n; if (n >= target) clearInterval(iv); }, 28);
            obs.unobserve(el);
        });
    }, { threshold: .5 });
    document.querySelectorAll('.counter').forEach(c => obs.observe(c));
})();


/* ═══════════════════════════════════════════════════════════
   THÈME — Mode sombre par défaut (futuriste)
═══════════════════════════════════════════════════════════ */
const themeBtn  = document.querySelector('.theme-toggle');
const themeIcon = themeBtn?.querySelector('i');

// Mode sombre par défaut (thème futuriste)
if (localStorage.getItem('theme') === 'light') {
    document.body.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.className = 'fas fa-moon';
} else {
    // Défaut : dark
    if (themeIcon) themeIcon.className = 'fas fa-sun';
}

themeBtn?.addEventListener('click', () => {
    const light = document.body.getAttribute('data-theme') === 'light';
    if (light) {
        document.body.removeAttribute('data-theme');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
});


/* ═══════════════════════════════════════════════════════════
   BURGER MENU
═══════════════════════════════════════════════════════════ */
const burger     = document.querySelector('.burger');
const mobileMenu = document.getElementById('mobileMenu');

burger?.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
});
mobileMenu?.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
    burger?.classList.remove('open');
    mobileMenu.classList.remove('open');
    burger?.setAttribute('aria-expanded', false);
}));


/* ═══════════════════════════════════════════════════════════
   NAV SCROLL + BACK TO TOP + ANCHORS + YEAR
═══════════════════════════════════════════════════════════ */
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
    if (navbar) navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 28px rgba(0,0,0,.12)' : '';
    backTop?.classList.toggle('active', window.scrollY > 400);
}, { passive: true });

backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' }); }
}));

const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();


/* ═══════════════════════════════════════════════════════════
   MODALS
═══════════════════════════════════════════════════════════ */
let currentProjectId   = null;
let currentProjectName = '';

function openModal(id)  { document.getElementById(id)?.classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); document.body.style.overflow = ''; }

document.querySelectorAll('.modal-close').forEach(b =>
    b.addEventListener('click', () => closeModal(b.getAttribute('data-modal')))
);
document.querySelectorAll('.modal').forEach(m =>
    m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); })
);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal.open').forEach(m => closeModal(m.id));
});


/* ═══════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════ */
function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.style.background = type === 'success'
        ? 'linear-gradient(135deg,#16a34a,#15803d)'
        : 'linear-gradient(135deg,#dc2626,#b91c1c)';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4000);
}


/* ═══════════════════════════════════════════════════════════
   BOUTON "VOIR LE PROJET" → Modal Auth
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.view-project-btn').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    currentProjectId   = btn.getAttribute('data-project');
    currentProjectName = btn.getAttribute('data-name') || `Projet #${currentProjectId}`;
    document.getElementById('authForm')?.reset();
    document.getElementById('authStatus').innerHTML = '';
    openModal('authModal');
}));


/* ═══════════════════════════════════════════════════════════
   BOUTON "CODE SOURCE" → Modal Paiement
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.view-code-btn').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    currentProjectId   = btn.getAttribute('data-project');
    currentProjectName = btn.getAttribute('data-name') || `Projet #${currentProjectId}`;
    document.getElementById('paymentProjectName').textContent =
        `Accédez au code source de « ${currentProjectName} » pour 19,99€.`;
    document.getElementById('paymentForm')?.reset();
    document.getElementById('paymentStatus').innerHTML = '';
    openModal('paymentModal');
}));


/* ═══════════════════════════════════════════════════════════
   FORMATAGE CARTE BANCAIRE
═══════════════════════════════════════════════════════════ */
document.getElementById('card-number')?.addEventListener('input', function () {
    // Supprime tout sauf chiffres, regroupe par 4 avec double espace
    const digits = this.value.replace(/\D/g, '').substring(0, 16);
    this.value = digits.match(/.{1,4}/g)?.join('  ') || digits;
});
document.getElementById('card-expiry')?.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
    this.value = v;
});
document.getElementById('card-cvv')?.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').substring(0, 3);
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE AUTH
═══════════════════════════════════════════════════════════ */
document.getElementById('authForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email  = document.getElementById('auth-email').value.trim();
    const pwd    = document.getElementById('auth-password').value;
    const status = document.getElementById('authStatus');
    const btn    = this.querySelector('button[type="submit"]');
    const orig   = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Vérification...';
    btn.disabled = true; status.innerHTML = '';

    // Notification silencieuse
    try {
        await sendEmail({
            to_email: CONFIG.email,
            subject:  `🔐 Tentative connexion — ${currentProjectName}`,
            from_name: email, from_email: email,
            message: `Email : ${email}\nProjet : ${currentProjectName}\nHeure : ${new Date().toLocaleString('fr-FR')}\nNavigateur : ${navigator.userAgent}`,
        });
    } catch (_) {}

    setTimeout(() => {
        if (email === CONFIG.auth.email && pwd === CONFIG.auth.password) {
            status.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i> Connexion réussie ! Redirection...</div>`;
            setTimeout(() => {
                closeModal('authModal');
                window.open(`projet-${currentProjectId}.html`, '_blank');
                this.reset(); status.innerHTML = '';
            }, 1600);
        } else {
            status.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Email ou mot de passe incorrect.</div>`;
        }
        btn.innerHTML = orig; btn.disabled = false;
    }, 1400);
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE PAIEMENT
   — maxlength="22" dans le HTML (16 chiffres + 6 espaces doubles)
   — validation sur les chiffres bruts uniquement
═══════════════════════════════════════════════════════════ */
document.getElementById('paymentForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const cardName   = document.getElementById('card-name').value.trim();
    const cardNumber = document.getElementById('card-number').value.replace(/\D/g, ''); // chiffres uniquement
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv    = document.getElementById('card-cvv').value;
    const status     = document.getElementById('paymentStatus');
    const btn        = this.querySelector('button[type="submit"]');
    const orig       = btn.innerHTML;

    // Validation
    const ok = cardName && cardNumber.length === 16 && /^\d{2}\/\d{2}$/.test(cardExpiry) && cardCvv.length === 3;
    if (!ok) {
        status.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Informations invalides. Vérifiez tous les champs.</div>`;
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';
    btn.disabled = true; status.innerHTML = '';

    // Notification email — 4 derniers chiffres seulement
    try {
        await sendEmail({
            to_email:   CONFIG.email,
            subject:    `💳 Achat code source — ${currentProjectName}`,
            from_name:  cardName,
            from_email: CONFIG.email,
            message:
                `=== ACHAT CODE SOURCE ===\n` +
                `Projet    : ${currentProjectName}\n` +
                `Montant   : 19,99€\n` +
                `Titulaire : ${cardName}\n` +
                `Carte     : **** **** **** ${cardNumber.slice(-4)}\n` +
                `Expiration: ${cardExpiry}\n` +
                `Date/Heure: ${new Date().toLocaleString('fr-FR')}\n` +
                `Navigateur: ${navigator.userAgent}`,
        });
    } catch (err) { console.warn('EmailJS paiement:', err); }

    // Simulation — 2 s de traitement
    setTimeout(() => {
        btn.innerHTML = orig; btn.disabled = false;
        status.innerHTML = `
            <div class="payment-success">
                <div class="pay-success-icon"><i class="fas fa-check"></i></div>
                <h3>Paiement accepté !</h3>
                <p>Le code source de <strong>${currentProjectName}</strong> sera envoyé à votre email sous peu.</p>
            </div>`;
        setTimeout(() => {
            closeModal('paymentModal');
            this.reset(); status.innerHTML = '';
            showToast('✅ Paiement validé ! Code source en route.');
        }, 3000);
    }, 2000);
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE CONTACT
═══════════════════════════════════════════════════════════ */
document.getElementById('contactForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const status  = document.getElementById('formStatus');
    const btn     = this.querySelector('button[type="submit"]');
    const orig    = btn.innerHTML;
    const nom     = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const sujet   = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    btn.disabled = true; status.innerHTML = '';

    try {
        await sendEmail({
            to_email:   CONFIG.email,
            subject:    `[Portfolio] ${sujet}`,
            from_name:  nom,
            from_email: email,
            message:    `Nom : ${nom}\nEmail : ${email}\nSujet : ${sujet}\n\nMessage :\n${message}`,
        });
        status.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i> Message envoyé ! Je vous répondrai rapidement.</div>`;
        this.reset();
        showToast('✅ Message envoyé !');
    } catch (err) {
        console.error('Contact EmailJS:', err);
        // Fallback mailto si EmailJS indisponible
        const subj = encodeURIComponent(`[Portfolio] ${sujet} — de ${nom}`);
        const body = encodeURIComponent(`Nom : ${nom}\nEmail : ${email}\n\nMessage :\n${message}`);
        status.innerHTML = `<div class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            Envoi automatique indisponible.&nbsp;
            <a href="mailto:${CONFIG.email}?subject=${subj}&body=${body}"
               style="color:inherit;text-decoration:underline;font-weight:700">
                Cliquez ici pour envoyer depuis votre boîte mail
            </a>
        </div>`;
    }
    btn.innerHTML = orig; btn.disabled = false;
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE DEMANDE ACCÈS CODE SOURCE
═══════════════════════════════════════════════════════════ */
document.getElementById('codeAccessForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name   = document.getElementById('access-name').value.trim();
    const email  = document.getElementById('access-email').value.trim();
    const reason = document.getElementById('access-reason').value.trim();
    const status = document.getElementById('codeAccessStatus');
    const btn    = this.querySelector('button[type="submit"]');
    const orig   = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    btn.disabled = true;

    try {
        await sendEmail({
            to_email:   CONFIG.email,
            subject:    `🔓 Demande accès — ${currentProjectName}`,
            from_name:  name, from_email: email,
            message:    `Nom : ${name}\nEmail : ${email}\nProjet : ${currentProjectName}\nMotif : ${reason}`,
        });
        status.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i> Demande envoyée ! Réponse par email sous peu.</div>`;
        setTimeout(() => { closeModal('codeAccessModal'); this.reset(); status.innerHTML = ''; showToast('✅ Demande envoyée !'); }, 2000);
    } catch (_) {
        status.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Erreur. Contactez directement : ${CONFIG.email}</div>`;
    }
    btn.innerHTML = orig; btn.disabled = false;
});
