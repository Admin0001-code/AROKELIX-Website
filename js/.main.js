/* ══════════════════════════════════════
   AROKELIX — main.js — Final Version
══════════════════════════════════════ */

// ── SCROLL PROGRESS BAR
var prog = document.getElementById('scrollProgress');
if (!prog) {
    prog = document.createElement('div');
    prog.className = 'scroll-progress';
    prog.id = 'scrollProgress';
    document.body.prepend(prog);
}

// ── NAV SCROLL + PROGRESS
window.addEventListener('scroll', function() {
    var scrolled = window.scrollY;
    var docH = document.body.scrollHeight - window.innerHeight;

    // Progress bar
    if (prog) prog.style.width = ((scrolled / docH) * 100) + '%';

    // Nav
    var nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', scrolled > 60);

    // Back to top
    var btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('show', scrolled > 400);
}, { passive: true });

// ── MOBILE MENU
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
        var isOpen = mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
    document.querySelectorAll('.mobile-menu a').forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// ── BACK TO TOP
var btt = document.getElementById('backToTop');
if (btt) {
    btt.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── SCROLL REVEAL
var revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.07, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('.reveal').forEach(function(el) {
    revealObs.observe(el);
});

// ── COUNTER ANIMATION
function animateCount(el) {
    var text = el.innerText;
    var target = parseInt(text.replace(/\D/g, ''));
    var suffix = text.replace(/[0-9]/g, '');
    if (!target) return;
    var start = 0;
    var duration = 1800;
    var startTime = null;
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.innerText = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
var countObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
        if (e.isIntersecting) {
            animateCount(e.target);
            countObs.unobserve(e.target);
        }
    });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-num, .cs-result-num, .case-num').forEach(function(el) {
    countObs.observe(el);
});

// ── COOKIE BANNER
function showCookieBanner() {
    if (!localStorage.getItem('arokelix_cookies')) {
        setTimeout(function() {
            var b = document.getElementById('cookieBanner');
            if (b) b.classList.add('show');
        }, 3500);
    }
}
function acceptCookies() {
    localStorage.setItem('arokelix_cookies', 'accepted');
    var b = document.getElementById('cookieBanner');
    if (b) b.classList.remove('show');
}
function declineCookies() {
    localStorage.setItem('arokelix_cookies', 'essential');
    var b = document.getElementById('cookieBanner');
    if (b) b.classList.remove('show');
}
showCookieBanner();

// ── FORM VALIDATION
var form = document.querySelector('.contact-form');
if (form) {
    form.querySelectorAll('.form-input').forEach(function(input) {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        input.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var valid = true;
        form.querySelectorAll('[required]').forEach(function(input) {
            if (!validateField(input)) valid = false;
        });
        if (valid) {
            var btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerText = 'Sending...';
                btn.style.opacity = '0.6';
                btn.disabled = true;
            }
            setTimeout(function() {
                form.innerHTML = '<div style="text-align:center;padding:64px 0;">' +
                    '<div style="font-family:Bebas Neue,sans-serif;font-size:44px;letter-spacing:0.1em;color:var(--gold2);margin-bottom:16px;">✦ Message Sent</div>' +
                    '<p style="font-size:15px;color:var(--muted-light);line-height:1.7;max-width:380px;margin:0 auto;">Thank you for reaching out.<br>We will respond within 24 hours.</p>' +
                    '<p style="font-size:11px;color:var(--muted);margin-top:20px;letter-spacing:0.15em;">Anointed to Build. Appointed to Lead.</p>' +
                    '</div>';
            }, 1600);
        }
    });
}
function validateField(input) {
    var val = input.value.trim();
    var valid = true;
    if (input.hasAttribute('required') && !val) valid = false;
    if (input.type === 'email' && val) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(val)) valid = false;
    }
    input.classList.toggle('error', !valid);
    input.classList.toggle('success', valid && val.length > 0);
    return valid;
}

// ── ACTIVE NAV LINK
var page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(function(a) {
    if (a.getAttribute('href') === page) {
        a.style.color = 'var(--ivory)';
    }
});

// ── LAZY LOAD IMAGES
if ('IntersectionObserver' in window) {
    var imgObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                var img = e.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imgObs.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });
    document.querySelectorAll('img[data-src]').forEach(function(img) {
        imgObs.observe(img);
    });
}

// ── SERVICE CARD STAGGER
document.querySelectorAll('.service-card').forEach(function(card, i) {
    card.style.transitionDelay = (i * 0.06) + 's';
});

// ── PORTFOLIO FILTER
window.filterProjects = function(btn, cat) {
    document.querySelectorAll('.filter-btn').forEach(function(b) {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    document.querySelectorAll('.port-item').forEach(function(item) {
        var match = cat === 'all' || item.dataset.cat === cat;
        item.style.opacity = match ? '1' : '0.15';
        item.style.pointerEvents = match ? '' : 'none';
        item.style.transform = match ? '' : 'scale(0.97)';
    });
};

// ── PRELOADER
window.addEventListener('load', function() {
    var pre = document.getElementById('preloader');
    if (pre && pre.style.display !== 'none') {
        setTimeout(function() {
            pre.classList.add('hidden');
        }, 800);
    }
});

// ── PROOF SECTION COUNTER
document.querySelectorAll('.proof-number, .psc-num').forEach(function(el) {
    countObs.observe(el);
});

// ── SERVICE CARDS — ADD STAGGER
document.querySelectorAll('.service-card').forEach(function(card, i) {
    card.style.transitionDelay = (i * 0.055) + 's';
});

// ── WHY CARDS — ADD STAGGER
document.querySelectorAll('.why-card').forEach(function(card, i) {
    card.classList.add('reveal');
    card.style.transitionDelay = (i * 0.08) + 's';
});

// ── PROOF CARDS — REVEAL
document.querySelectorAll('.proof-card-large, .proof-stat-card').forEach(function(card, i) {
    card.classList.add('reveal');
    card.style.transitionDelay = (i * 0.1) + 's';
    revealObs.observe(card);
});