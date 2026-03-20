// ============================================================
//  PROTECTION DU PORTFOLIO
// ============================================================
(function () {
    const overlay = document.querySelector('.protection-overlay');
    let violationCount = 0;
    const maxViolations = 3;

    function showProtectionMessage() {
        violationCount++;
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 2000);
        if (violationCount >= maxViolations) {
            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 2500);
        }
    }

    // Empêcher le clic droit (sauf dans les champs de formulaire)
    document.addEventListener('contextmenu', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        showProtectionMessage();
    });

    // Empêcher les raccourcis d'inspection
    document.addEventListener('keydown', function (e) {
        if (
            (e.ctrlKey && e.key.toLowerCase() === 'u') ||
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey &&
                (e.key.toLowerCase() === 'i' ||
                    e.key.toLowerCase() === 'j' ||
                    e.key.toLowerCase() === 'c'))
        ) {
            e.preventDefault();
            showProtectionMessage();
        }
    });

    // Empêcher la copie (sauf dans les champs de formulaire)
    document.addEventListener('copy', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        showProtectionMessage();
    });

    // Empêcher le glisser-déposer des images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
            showProtectionMessage();
        });
    });

    // Protection contre les iframes
    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }
})();


// ============================================================
//  INITIALISATION AOS
// ============================================================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});


// ============================================================
//  THÈME SOMBRE / CLAIR
// ============================================================
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    document.body.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.removeAttribute('data-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    }
});


// ============================================================
//  BOUTON RETOUR EN HAUT
// ============================================================
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('active');
    } else {
        backToTopBtn.classList.remove('active');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ============================================================
//  DÉFILEMENT FLUIDE POUR LES ANCRES
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});


// ============================================================
//  ANNÉE DANS LE FOOTER
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();


// ============================================================
//  GESTION DES MODALS
// ============================================================
const authModal = document.getElementById('authModal');
const codeAccessModal = document.getElementById('codeAccessModal');
let currentProjectId = null;
let currentProjectName = '';

// Fermer les modals via le bouton ×
document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', function () {
        this.closest('.modal').style.display = 'none';
    });
});

// Fermer les modals en cliquant à l'extérieur
window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});


// ============================================================
//  BOUTON "VOIR LE PROJET" → Modal d'authentification
// ============================================================
document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        currentProjectId = this.getAttribute('data-project');
        currentProjectName = this.getAttribute('data-name') || `Projet #${currentProjectId}`;
        authModal.style.display = 'block';
        // Réinitialiser le formulaire et le statut
        document.getElementById('authForm').reset();
        document.getElementById('authStatus').innerHTML = '';
    });
});


// ============================================================
//  BOUTON "CODE SOURCE" → Modal de demande d'accès
// ============================================================
document.querySelectorAll('.view-code-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        currentProjectId = this.getAttribute('data-project');
        currentProjectName = this.getAttribute('data-name') || `Projet #${currentProjectId}`;

        // Renseigner les champs cachés avec le nom du projet
        document.getElementById('codeAccessProjectField').value = currentProjectName;
        document.getElementById('codeAccessSubject').value =
            `🔓 Demande d'accès au code source — ${currentProjectName}`;
        document.getElementById('codeAccessProjectName').textContent =
            `Remplissez ce formulaire pour demander l'accès au code source de « ${currentProjectName} ». Je vous répondrai dans les plus brefs délais.`;

        // Réinitialiser le formulaire
        document.getElementById('codeAccessForm').reset();
        // Restaurer les champs cachés après reset
        document.getElementById('codeAccessProjectField').value = currentProjectName;
        document.getElementById('codeAccessSubject').value =
            `🔓 Demande d'accès au code source — ${currentProjectName}`;

        codeAccessModal.style.display = 'block';
    });
});


// ============================================================
//  FORMULAIRE D'AUTHENTIFICATION (notification email + accès)
// ============================================================
document.getElementById('authForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const statusElement = document.getElementById('authStatus');
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Vérification...';
    submitBtn.disabled = true;
    statusElement.innerHTML = '';

    // Envoyer une notification de tentative de connexion à ton email
    try {
        const notificationData = new FormData();
        notificationData.append('_captcha', 'false');
        notificationData.append('_subject', '🔐 ALERTE : Tentative d\'authentification sur votre portfolio');
        notificationData.append('_template', 'table');
        notificationData.append('Heure', new Date().toLocaleString('fr-FR', {
            timeZone: 'Africa/Lome', dateStyle: 'full', timeStyle: 'long'
        }));
        notificationData.append('Email_saisi', email);
        notificationData.append('Projet_demandé', `${currentProjectName} (Projet #${currentProjectId})`);
        notificationData.append('Navigateur', navigator.userAgent);
        notificationData.append('Plateforme', navigator.platform);
        notificationData.append('Langue', navigator.language);
        notificationData.append('URL', window.location.href);

        await fetch('https://formsubmit.co/oualoumidjeupisne@gmail.com', {
            method: 'POST',
            body: notificationData
        });
    } catch (err) {
        console.warn('Notification non envoyée :', err);
    }

    // Simulation d'authentification
    setTimeout(() => {
        if (email && password.length >= 6) {
            statusElement.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> Authentification réussie ! Redirection en cours...
                </div>`;
            setTimeout(() => {
                authModal.style.display = 'none';
                window.open(`projet-${currentProjectId}.html`, '_blank');
                this.reset();
                statusElement.innerHTML = '';
            }, 1500);
        } else {
            statusElement.innerHTML = `
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-circle"></i> Email ou mot de passe incorrect.
                </div>`;
        }
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
});


// ============================================================
//  FORMULAIRE DE DEMANDE D'ACCÈS AU CODE SOURCE
// ============================================================
document.getElementById('codeAccessForm').addEventListener('submit', function (e) {
    // On laisse FormSubmit envoyer le formulaire normalement (target="_blank")
    // On affiche juste un feedback visuel avant la soumission native
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;

    // Fermer le modal après un délai (le formulaire s'ouvre dans un onglet)
    setTimeout(() => {
        codeAccessModal.style.display = 'none';
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer la demande';
        submitBtn.disabled = false;
        this.reset();
        // Restaurer les champs cachés
        document.getElementById('codeAccessProjectField').value = currentProjectName;
        document.getElementById('codeAccessSubject').value =
            `🔓 Demande d'accès au code source — ${currentProjectName}`;

        // Afficher une confirmation discrète
        showToast('✅ Demande envoyée ! Je vous répondrai par email.');
    }, 2500);
});


// ============================================================
//  FORMULAIRE DE CONTACT
// ============================================================
document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const statusElement = document.getElementById('formStatus');

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    statusElement.innerHTML = '';

    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            statusElement.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
                </div>`;
            form.reset();
        } else {
            throw new Error('Erreur serveur');
        }
    } catch (error) {
        statusElement.innerHTML = `
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i> Échec de l'envoi. Contactez-moi directement à
                <a href="mailto:oualoumidjeupisne@gmail.com" style="color:inherit;text-decoration:underline;">
                    oualoumidjeupisne@gmail.com
                </a>
            </div>`;
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});


// ============================================================
//  TOAST DE NOTIFICATION (usage interne)
// ============================================================
function showToast(message) {
    const existing = document.getElementById('portfolioToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'portfolioToast';
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
        font-weight: 500;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        opacity: 0;
        transition: all 0.4s ease;
        white-space: nowrap;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 50);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
