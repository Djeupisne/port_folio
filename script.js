// PROTECTION DU PORTFOLIO
(function() {
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
    
    // Empêcher le clic droit
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        e.preventDefault();
        showProtectionMessage();
    });
    
    // Empêcher les raccourcis d'inspection
    document.addEventListener('keydown', function(e) {
        if (
            (e.ctrlKey && e.key.toLowerCase() === 'u') ||
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'j' || e.key.toLowerCase() === 'c'))
        ) {
            e.preventDefault();
            showProtectionMessage();
        }
    });
    
    // Empêcher la copie
    document.addEventListener('copy', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
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

// Initialisation AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Gestion du thème sombre/clair
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

// Gestion du bouton "Retour en haut"
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('active');
    } else {
        backToTopBtn.classList.remove('active');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animation fluide pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Mettre à jour l'année dans le footer
document.getElementById('year').textContent = new Date().getFullYear();

// GESTION DES MODALS
const authModal = document.getElementById('authModal');
const paymentModal = document.getElementById('paymentModal');
let currentProjectId = null;

// Fermer les modals
document.querySelectorAll('.close-modal').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Fermer modal en cliquant à l'extérieur
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// GESTION DES BOUTONS "VOIR LE PROJET"
document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        currentProjectId = this.getAttribute('data-project');
        authModal.style.display = 'block';
    });
});

// GESTION DES BOUTONS "CODE SOURCE"
document.querySelectorAll('.view-code-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        currentProjectId = this.getAttribute('data-project');
        paymentModal.style.display = 'block';
    });
});

// FORMULAIRE D'AUTHENTIFICATION
document.getElementById('authForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const statusElement = document.getElementById('authStatus');
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Vérification...';
    submitBtn.disabled = true;
    statusElement.innerHTML = '';
    
    // Envoyer un email de notification de tentative d'authentification
    try {
        const notificationData = new FormData();
        notificationData.append('_captcha', 'false');
        notificationData.append('_subject', '🔐 ALERTE: Tentative d\'authentification sur votre portfolio');
        notificationData.append('_template', 'table');
        
        // Informations de la tentative
        const attemptTime = new Date().toLocaleString('fr-FR', { 
            timeZone: 'Africa/Lome',
            dateStyle: 'full',
            timeStyle: 'long'
        });
        
        // Obtenir des informations supplémentaires
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const language = navigator.language;
        
        notificationData.append('Heure_de_tentative', attemptTime);
        notificationData.append('Email_saisi', email);
        notificationData.append('Longueur_mot_de_passe', password.length + ' caractères');
        notificationData.append('Projet_demande', `Projet #${currentProjectId}`);
        notificationData.append('Navigateur', userAgent);
        notificationData.append('Plateforme', platform);
        notificationData.append('Langue', language);
        notificationData.append('URL_page', window.location.href);
        
        // Envoyer la notification à votre email
        await fetch('https://formsubmit.co/oualoumidjeupisne@gmail.com', {
            method: 'POST',
            body: notificationData
        });
        
        console.log('✅ Notification de sécurité envoyée');
    } catch (error) {
        console.error('⚠️ Erreur lors de l\'envoi de la notification:', error);
    }
    
    // Simulation d'authentification
    setTimeout(() => {
        // Vérification simple (à remplacer par une vraie authentification)
        if (email && password.length >= 6) {
            statusElement.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> Authentification réussie ! Redirection vers le projet...
                </div>
            `;
            
            setTimeout(() => {
                authModal.style.display = 'none';
                // Rediriger vers le projet
                window.open(`projet-${currentProjectId}.html`, '_blank');
                this.reset();
                statusElement.innerHTML = '';
            }, 1500);
        } else {
            statusElement.innerHTML = `
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-circle"></i> Email ou mot de passe incorrect
                </div>
            `;
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// FORMULAIRE DE PAIEMENT
document.getElementById('paymentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const cardName = document.getElementById('card-name').value;
    const cardNumber = document.getElementById('card-number').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv = document.getElementById('card-cvv').value;
    const statusElement = document.getElementById('paymentStatus');
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement du paiement...';
    submitBtn.disabled = true;
    statusElement.innerHTML = '';
    
    // Validation basique
    const isValidCard = cardNumber.replace(/\s/g, '').length === 16;
    const isValidExpiry = /^\d{2}\/\d{2}$/.test(cardExpiry);
    const isValidCvv = cardCvv.length === 3;
    
    // Envoyer un email de notification de tentative de paiement
    try {
        const notificationData = new FormData();
        notificationData.append('_captcha', 'false');
        notificationData.append('_subject', '💳 ALERTE: Tentative de paiement sur votre portfolio');
        notificationData.append('_template', 'table');
        
        const attemptTime = new Date().toLocaleString('fr-FR', { 
            timeZone: 'Africa/Lome',
            dateStyle: 'full',
            timeStyle: 'long'
        });
        
        // Masquer partiellement les informations sensibles
        const maskedCardNumber = cardNumber.replace(/\d(?=\d{4})/g, '*');
        
        notificationData.append('Heure_de_tentative', attemptTime);
        notificationData.append('Nom_sur_carte', cardName);
        notificationData.append('Numero_carte_masque', maskedCardNumber);
        notificationData.append('Date_expiration', cardExpiry);
        notificationData.append('Montant', '19,99€');
        notificationData.append('Projet_demande', `Code source Projet #${currentProjectId}`);
        notificationData.append('Navigateur', navigator.userAgent);
        notificationData.append('Plateforme', navigator.platform);
        notificationData.append('URL_page', window.location.href);
        notificationData.append('Validation_carte', isValidCard ? 'Format valide' : 'Format invalide');
        notificationData.append('Validation_expiration', isValidExpiry ? 'Format valide' : 'Format invalide');
        notificationData.append('Validation_CVV', isValidCvv ? 'Format valide' : 'Format invalide');
        
        // Envoyer la notification
        await fetch('https://formsubmit.co/oualoumidjeupisne@gmail.com', {
            method: 'POST',
            body: notificationData
        });
        
        console.log('✅ Notification de paiement envoyée');
    } catch (error) {
        console.error('⚠️ Erreur lors de l\'envoi de la notification:', error);
    }
    
    // Simulation de paiement
    setTimeout(() => {
        if (cardName && isValidCard && isValidExpiry && isValidCvv) {
            statusElement.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> Paiement accepté ! Envoi du code source par email...
                </div>
            `;
            
            setTimeout(() => {
                paymentModal.style.display = 'none';
                alert(`Code source du projet ${currentProjectId} sera envoyé à votre email dans quelques minutes !`);
                this.reset();
                statusElement.innerHTML = '';
            }, 2000);
        } else {
            statusElement.innerHTML = `
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-circle"></i> Informations de carte invalides. Veuillez vérifier vos données.
                </div>
            `;
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Formatage automatique du numéro de carte
document.getElementById('card-number').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Formatage automatique de la date d'expiration
document.getElementById('card-expiry').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// Limiter le CVV aux chiffres uniquement
document.getElementById('card-cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// GESTION DU FORMULAIRE DE CONTACT
document.getElementById('contactForm').addEventListener('submit', async function(e) {
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
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            statusElement.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
                </div>
            `;
            form.reset();
        } else {
            throw new Error("Erreur lors de l'envoi");
        }
    } catch (error) {
        console.error('Erreur:', error);
        statusElement.innerHTML = `
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i> Échec de l'envoi. Essayez de m'envoyer un email directement à <a href="mailto:oualoumidjeupisne@gmail.com">oualoumidjeupisne@gmail.com</a>
            </div>
        `;
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});
