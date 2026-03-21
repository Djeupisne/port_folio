/* ═══════════════════════════════════════════════════════════
   ⚙️  CONFIGURATION — MODIFIEZ CES VALEURS
═══════════════════════════════════════════════════════════

   📌 ÉTAPES EMAILJS (5 minutes) :
   1. Allez sur https://www.emailjs.com → créez un compte gratuit
   2. "Add New Service" → Gmail → connectez votre Gmail → copiez le Service ID
   3. "Create New Template" → copiez le Template ID
      Dans le template EmailJS, ajoutez ces variables :
        Sujet  : {{subject}}
        De     : {{from_name}} ({{from_email}})
        Corps  : {{message}}
        À      : {{to_email}}
   4. "Account" → copiez votre Public Key
   5. Remplacez les 3 valeurs VOTRE_... ci-dessous

═══════════════════════════════════════════════════════════ */
const CONFIG = {
    emailjs_public_key:  'lHZxVLfk008tn4vdi',   // ← Account > API Keys > Public Key
    emailjs_service_id:  'Oualoumi Service',   // ← Email Services > service_xxxxxxx
    emailjs_template_id: 'template_k6mivvs',  // ← Email Templates > template_xxxxxxx

    // 🔐 Identifiants pour "Voir le projet"
    auth: {
        email:    'admin@portfolio.com',        // ← changez votre email de connexion
        password: 'djeupisne2025'               // ← changez votre mot de passe
    },
    email: 'oualoumidjeupisne@gmail.com'        // ← votre email de réception
};


/* ═══════════════════════════════════════════════════════════
   PROTECTION DU PORTFOLIO
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
AOS.init({ duration: 750, easing: 'ease-out-cubic', once: true, offset: 80 });


/* ═══════════════════════════════════════════════════════════
   EMAILJS — Chargement dynamique
═══════════════════════════════════════════════════════════ */
let emailJSReady = false;

(function () {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => { emailjs.init(CONFIG.emailjs_public_key); emailJSReady = true; };
    s.onerror = () => console.warn('EmailJS non chargé (vérifiez votre connexion internet)');
    document.head.appendChild(s);
})();

function sendEmail(params) {
    return new Promise((resolve, reject) => {
        if (!emailJSReady) { reject(new Error('EmailJS non prêt')); return; }
        emailjs.send(CONFIG.emailjs_service_id, CONFIG.emailjs_template_id, params)
            .then(resolve).catch(reject);
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
        constructor() { this.r(); }
        r() {
            this.x = rnd(0,W); this.y = rnd(0,H);
            this.s = rnd(0.5,2.2); this.vx = rnd(-0.3,0.3); this.vy = rnd(-0.5,-0.1);
            this.a = rnd(0.2,0.8);
            this.c = Math.random()>.5 ? `rgba(123,151,255,${this.a})` : `rgba(76,201,240,${this.a})`;
        }
        move() { this.x+=this.vx; this.y+=this.vy; if(this.y<-4||this.x<-4||this.x>W+4) this.r(); }
        draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.s,0,Math.PI*2); ctx.fillStyle=this.c; ctx.fill(); }
    }

    function init() { pts=[]; const n=Math.floor((W*H)/8000); for(let i=0;i<n;i++) pts.push(new P()); }

    function loop() {
        ctx.clearRect(0,0,W,H);
        pts.forEach(p=>{p.move();p.draw();});
        for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) {
            const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
            if(d<100){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(123,151,255,${0.08*(1-d/100)})`;ctx.lineWidth=.5;ctx.stroke();}
        }
        requestAnimationFrame(loop);
    }
    init(); loop();
})();


/* ═══════════════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════════════ */
(function () {
    const el = document.getElementById('typewriter'); if (!el) return;
    const texts = ['Développeur Full Stack','Designer UI/UX','Passionné de Code','Créateur de Solutions Web'];
    let ti=0,ci=0,del=false;
    function t() {
        const cur=texts[ti];
        if(!del){el.textContent=cur.substring(0,++ci);if(ci===cur.length){del=true;return setTimeout(t,1800);}}
        else{el.textContent=cur.substring(0,--ci);if(ci===0){del=false;ti=(ti+1)%texts.length;}}
        setTimeout(t,del?60:90);
    }
    setTimeout(t,500);
})();


/* ═══════════════════════════════════════════════════════════
   COUNTERS
═══════════════════════════════════════════════════════════ */
(function () {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if(!e.isIntersecting) return;
            const el=e.target, target=+el.getAttribute('data-target'), step=Math.ceil(target/50);
            let n=0; const iv=setInterval(()=>{n=Math.min(n+step,target);el.textContent=n;if(n>=target)clearInterval(iv);},30);
            obs.unobserve(el);
        });
    },{threshold:.5});
    document.querySelectorAll('.counter').forEach(c=>obs.observe(c));
})();


/* ═══════════════════════════════════════════════════════════
   THÈME
═══════════════════════════════════════════════════════════ */
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon   = themeToggle?.querySelector('i');
if (localStorage.getItem('theme')==='dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
    document.body.setAttribute('data-theme','dark');
    if(themeIcon) themeIcon.className='fas fa-sun';
}
themeToggle?.addEventListener('click',()=>{
    const d=document.body.getAttribute('data-theme')==='dark';
    if(d){document.body.removeAttribute('data-theme');if(themeIcon)themeIcon.className='fas fa-moon';localStorage.setItem('theme','light');}
    else{document.body.setAttribute('data-theme','dark');if(themeIcon)themeIcon.className='fas fa-sun';localStorage.setItem('theme','dark');}
});


/* ═══════════════════════════════════════════════════════════
   BURGER
═══════════════════════════════════════════════════════════ */
const burger=document.querySelector('.burger'), mobileMenu=document.getElementById('mobileMenu');
burger?.addEventListener('click',()=>{burger.classList.toggle('open');mobileMenu?.classList.toggle('open');});
mobileMenu?.querySelectorAll('.mobile-link').forEach(l=>l.addEventListener('click',()=>{burger.classList.remove('open');mobileMenu.classList.remove('open');}));


/* ═══════════════════════════════════════════════════════════
   NAV / SCROLL / ANCHORS / YEAR
═══════════════════════════════════════════════════════════ */
const navbar=document.getElementById('navbar'), backTop=document.getElementById('backTop');
window.addEventListener('scroll',()=>{
    if(navbar) navbar.style.boxShadow=window.scrollY>50?'0 4px 30px rgba(0,0,0,.12)':'';
    backTop?.classList.toggle('active',window.scrollY>400);
});
backTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const id=a.getAttribute('href'); if(id==='#') return;
    const t=document.querySelector(id);
    if(t){e.preventDefault();window.scrollTo({top:t.offsetTop-80,behavior:'smooth'});}
}));
const yr=document.getElementById('year'); if(yr) yr.textContent=new Date().getFullYear();


/* ═══════════════════════════════════════════════════════════
   MODALS
═══════════════════════════════════════════════════════════ */
let currentProjectId=null, currentProjectName='';
function openModal(id){document.getElementById(id).classList.add('open');document.body.style.overflow='hidden';}
function closeModal(id){document.getElementById(id).classList.remove('open');document.body.style.overflow='';}
document.querySelectorAll('.modal-close').forEach(b=>b.addEventListener('click',()=>closeModal(b.getAttribute('data-modal'))));
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id);}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal.open').forEach(m=>closeModal(m.id));});


/* ═══════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════ */
function showToast(msg, type='success'){
    const t=document.getElementById('toast'); if(!t) return;
    t.textContent=msg;
    t.style.background=type==='success'?'linear-gradient(135deg,#16a34a,#15803d)':'linear-gradient(135deg,#dc2626,#b91c1c)';
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),4000);
}


/* ═══════════════════════════════════════════════════════════
   VOIR LE PROJET → Auth
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.view-project-btn').forEach(btn=>btn.addEventListener('click',e=>{
    e.preventDefault();
    currentProjectId=btn.getAttribute('data-project');
    currentProjectName=btn.getAttribute('data-name')||`Projet #${currentProjectId}`;
    document.getElementById('authForm').reset();
    document.getElementById('authStatus').innerHTML='';
    openModal('authModal');
}));


/* ═══════════════════════════════════════════════════════════
   CODE SOURCE → Paiement
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.view-code-btn').forEach(btn=>btn.addEventListener('click',e=>{
    e.preventDefault();
    currentProjectId=btn.getAttribute('data-project');
    currentProjectName=btn.getAttribute('data-name')||`Projet #${currentProjectId}`;
    document.getElementById('paymentProjectName').textContent=`Accédez au code source de « ${currentProjectName} » pour 19,99€.`;
    document.getElementById('paymentForm').reset();
    document.getElementById('paymentStatus').innerHTML='';
    openModal('paymentModal');
}));


/* ═══════════════════════════════════════════════════════════
   FORMATAGE CARTE
═══════════════════════════════════════════════════════════ */
document.getElementById('card-number').addEventListener('input',function(){
    let v=this.value.replace(/\D/g,'').substring(0,16);
    this.value=v.match(/.{1,4}/g)?.join('  ')||v;
});
document.getElementById('card-expiry').addEventListener('input',function(){
    let v=this.value.replace(/\D/g,'');
    if(v.length>=2) v=v.slice(0,2)+'/'+v.slice(2,4);
    this.value=v;
});
document.getElementById('card-cvv').addEventListener('input',function(){
    this.value=this.value.replace(/\D/g,'').substring(0,3);
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE AUTH ✅
═══════════════════════════════════════════════════════════ */
document.getElementById('authForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const email=document.getElementById('auth-email').value.trim();
    const pwd=document.getElementById('auth-password').value;
    const status=document.getElementById('authStatus');
    const btn=this.querySelector('button[type="submit"]');
    const orig=btn.innerHTML;
    btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Vérification...'; btn.disabled=true; status.innerHTML='';

    try {
        await sendEmail({
            to_email: CONFIG.email,
            subject: `🔐 Tentative connexion — ${currentProjectName}`,
            from_name: email, from_email: email,
            message: `Email : ${email}\nProjet : ${currentProjectName}\nHeure : ${new Date().toLocaleString('fr-FR')}\nNavigateur : ${navigator.userAgent}`,
        });
    } catch(_){}

    setTimeout(()=>{
        if(email===CONFIG.auth.email && pwd===CONFIG.auth.password){
            status.innerHTML=`<div class="alert alert-success"><i class="fas fa-check-circle"></i> Connexion réussie !</div>`;
            setTimeout(()=>{closeModal('authModal');window.open(`projet-${currentProjectId}.html`,'_blank');this.reset();status.innerHTML='';},1600);
        } else {
            status.innerHTML=`<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Email ou mot de passe incorrect.</div>`;
        }
        btn.innerHTML=orig; btn.disabled=false;
    },1400);
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE PAIEMENT ✅
   → Envoie email via EmailJS avec les 4 derniers chiffres uniquement
═══════════════════════════════════════════════════════════ */
document.getElementById('paymentForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const cardName   = document.getElementById('card-name').value.trim();
    const cardNumber = document.getElementById('card-number').value.replace(/\D/g,'');
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv    = document.getElementById('card-cvv').value;
    const status = document.getElementById('paymentStatus');
    const btn = this.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;

    // Validation
    if(!cardName || cardNumber.length!==16 || !/^\d{2}\/\d{2}$/.test(cardExpiry) || cardCvv.length!==3){
        status.innerHTML=`<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Informations invalides. Vérifiez tous les champs.</div>`;
        return;
    }

    btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Traitement...'; btn.disabled=true; status.innerHTML='';

    // ✅ Email via EmailJS — 4 derniers chiffres seulement
    try {
        await sendEmail({
            to_email:   CONFIG.email,
            subject:    `💳 Achat code source — ${currentProjectName}`,
            from_name:  cardName,
            from_email: CONFIG.email,
            message:
                `=== ACHAT CODE SOURCE ===\n` +
                `Projet : ${currentProjectName}\n` +
                `Montant : 19,99€\n` +
                `Titulaire : ${cardName}\n` +
                `Carte masquée : **** **** **** ${cardNumber.slice(-4)}\n` +
                `Expiration : ${cardExpiry}\n` +
                `Date/Heure : ${new Date().toLocaleString('fr-FR')}\n` +
                `Navigateur : ${navigator.userAgent}`,
        });
        console.log('✅ Notification paiement envoyée');
    } catch(err){
        console.warn('EmailJS erreur:', err.text||err);
    }

    setTimeout(()=>{
        btn.innerHTML=orig; btn.disabled=false;
        status.innerHTML=`
            <div class="payment-success">
                <div class="success-icon"><i class="fas fa-check"></i></div>
                <h3>Paiement accepté !</h3>
                <p>Le code source de <strong>${currentProjectName}</strong> sera envoyé à votre email sous peu.</p>
            </div>`;
        setTimeout(()=>{closeModal('paymentModal');this.reset();status.innerHTML='';showToast('✅ Paiement validé ! Code source en route.');},3000);
    },2000);
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE CONTACT ✅
   → Envoie directement dans votre boîte Gmail via EmailJS
═══════════════════════════════════════════════════════════ */
document.getElementById('contactForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn    = this.querySelector('button[type="submit"]');
    const orig   = btn.innerHTML;
    const nom     = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const sujet   = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Envoi en cours...'; btn.disabled=true; status.innerHTML='';

    try {
        await sendEmail({
            to_email:   CONFIG.email,
            subject:    `[Portfolio] ${sujet}`,
            from_name:  nom,
            from_email: email,
            message:    `Nom : ${nom}\nEmail : ${email}\nSujet : ${sujet}\n\nMessage :\n${message}`,
        });
        status.innerHTML=`<div class="alert alert-success"><i class="fas fa-check-circle"></i> Message envoyé avec succès ! Je vous répondrai rapidement.</div>`;
        this.reset();
        showToast('✅ Message envoyé !');
    } catch(err){
        console.error('EmailJS:', err);
        status.innerHTML=`<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Échec. Écrivez directement à <a href="mailto:${CONFIG.email}" style="color:inherit;text-decoration:underline">${CONFIG.email}</a></div>`;
    }
    btn.innerHTML=orig; btn.disabled=false;
});


/* ═══════════════════════════════════════════════════════════
   FORMULAIRE DEMANDE D'ACCÈS CODE SOURCE
═══════════════════════════════════════════════════════════ */
document.getElementById('codeAccessForm')?.addEventListener('submit', async function(e){
    e.preventDefault();
    const name   = document.getElementById('access-name').value.trim();
    const email  = document.getElementById('access-email').value.trim();
    const reason = document.getElementById('access-reason').value.trim();
    const status = document.getElementById('codeAccessStatus');
    const btn    = this.querySelector('button[type="submit"]');
    const orig   = btn.innerHTML;
    btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Envoi...'; btn.disabled=true;

    try {
        await sendEmail({
            to_email: CONFIG.email, subject:`🔓 Demande accès — ${currentProjectName}`,
            from_name: name, from_email: email,
            message:`Nom:${name}\nEmail:${email}\nProjet:${currentProjectName}\nMotif:${reason}`,
        });
        status.innerHTML=`<div class="alert alert-success"><i class="fas fa-check-circle"></i> Demande envoyée !</div>`;
        setTimeout(()=>{closeModal('codeAccessModal');this.reset();status.innerHTML='';showToast('✅ Demande envoyée !');},2000);
    } catch(_){
        status.innerHTML=`<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Erreur. Contactez : ${CONFIG.email}</div>`;
    }
    btn.innerHTML=orig; btn.disabled=false;
});
