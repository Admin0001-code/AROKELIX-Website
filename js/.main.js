/* ══════════════════════════════════════
   AROKELIX — main.js Final Version
══════════════════════════════════════ */

// ── SCROLL PROGRESS
var prog = document.getElementById('scrollProgress');
if (prog) {
    window.addEventListener('scroll', function() {
        var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        prog.style.width = pct + '%';
    }, { passive: true });
}

// ── NAV SCROLL + BACK TO TOP
var nav = document.getElementById('nav');
var btt = document.getElementById('backToTop');
window.addEventListener('scroll', function() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 60);
    if (btt) btt.classList.toggle('show', y > 400);
}, { passive: true });
if (btt) {
    btt.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── MOBILE MENU
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
        var open = mobileMenu.classList.toggle('open');
        document.body.style.overflow = open ? 'hidden' : '';
        hamburger.setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.mobile-menu a').forEach(function(a) {
        a.addEventListener('click', function() {
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

// ── AUTO REVEAL GRID CHILDREN
['why-grid', 'services-grid', 'testi-grid', 'stats-grid', 'pt-grid'].forEach(function(cls) {
    var grid = document.querySelector('.' + cls);
    if (!grid) return;
    Array.from(grid.children).forEach(function(child, i) {
        child.classList.add('reveal');
        child.style.transitionDelay = (i * 0.08) + 's';
        revealObs.observe(child);
    });
});

// ── COUNTER ANIMATION
function animateCount(el) {
    var text = el.innerText;
    var num = parseInt(text.replace(/\D/g, ''));
    var suffix = text.replace(/[0-9]/g, '');
    if (!num) return;
    var start = null;
    var dur = 1800;
    function step(ts) {
        if (!start) start = ts;
        var prog2 = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - prog2, 3);
        el.innerText = Math.floor(eased * num) + suffix;
        if (prog2 < 1) requestAnimationFrame(step);
        else {
            // Gold flash on complete
            el.style.color = 'var(--gold3)';
            setTimeout(function() { el.style.color = ''; }, 600);
        }
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
document.querySelectorAll('.stat-num, .proof-big-num, .pm-num, .result-num').forEach(function(el) {
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
        input.addEventListener('blur', function() { validateField(this); });
        input.addEventListener('focus', function() { this.classList.remove('error'); });
    });
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var valid = true;
        form.querySelectorAll('[required]').forEach(function(f) {
            if (!validateField(f)) valid = false;
        });
        if (valid) {
            var btn = form.querySelector('button[type="submit"]');
            if (btn) { btn.innerText = 'Sending...'; btn.style.opacity = '0.6'; btn.disabled = true; }
            setTimeout(function() {
                form.innerHTML = '<div style="text-align:center;padding:64px 0;">' +
                    '<div style="font-family:var(--fh),sans-serif;font-size:44px;letter-spacing:0.1em;color:var(--gold2);margin-bottom:16px;">✦ Message Sent</div>' +
                    '<p style="font-size:15px;color:var(--text3);line-height:1.7;max-width:380px;margin:0 auto;">Thank you for reaching out.<br>We will respond within 24 hours.</p>' +
                    '<p style="font-size:11px;color:var(--gray2);margin-top:20px;letter-spacing:0.15em;">Where craft meets eternal.</p>' +
                    '</div>';
            }, 1600);
        }
    });
}
function validateField(input) {
    var val = input.value.trim();
    var ok = true;
    if (input.hasAttribute('required') && !val) ok = false;
    if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) ok = false;
    input.classList.toggle('error', !ok);
    input.classList.toggle('success', ok && val.length > 0);
    return ok;
}

// ── CURSOR GLOW (desktop only)
if (window.innerWidth > 1024) {
    var glow = document.createElement('div');
    glow.style.cssText = 'position:fixed;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(201,148,10,0.055) 0%,transparent 70%);pointer-events:none;z-index:9996;transform:translate(-50%,-50%);transition:opacity 0.3s;opacity:0;';
    document.body.appendChild(glow);
    var mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; glow.style.opacity = '1'; });
    document.addEventListener('mouseleave', function() { glow.style.opacity = '0'; });
    (function animG() {
        gx += (mx - gx) * 0.07; gy += (my - gy) * 0.07;
        glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
        requestAnimationFrame(animG);
    })();
}

// ── MAGNETIC BUTTONS
document.querySelectorAll('.btn-primary-hero, .nav-cta').forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.1;
        var y = (e.clientY - r.top - r.height / 2) * 0.1;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px) translateY(-3px)';
    });
    btn.addEventListener('mouseleave', function() {
        btn.style.transform = '';
    });
});

// ── PAGE TRANSITIONS
document.querySelectorAll('a[href]').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') &&
        !href.startsWith('mailto') && !href.startsWith('tel') &&
        !href.startsWith('https://wa') && href.endsWith('.html')) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.style.cssText += 'opacity:0;transform:translateY(-8px);transition:opacity 0.3s ease,transform 0.3s ease;';
            setTimeout(function() { window.location.href = href; }, 300);
        });
    }
});

// ── PORTFOLIO FILTER
window.filterProjects = function(btn, cat) {
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('.port-item').forEach(function(item) {
        var match = cat === 'all' || item.dataset.cat === cat;
        item.style.opacity = match ? '1' : '0.15';
        item.style.pointerEvents = match ? '' : 'none';
        item.style.transform = match ? '' : 'scale(0.97)';
    });
};

// ── LAZY IMAGES
if ('IntersectionObserver' in window) {
    var imgObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                var img = e.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.6s ease';
                    img.onload = function() { img.style.opacity = '1'; };
                    img.removeAttribute('data-src');
                }
                imgObs.unobserve(img);
            }
        });
    }, { rootMargin: '300px' });
    document.querySelectorAll('img[data-src]').forEach(function(img) { imgObs.observe(img); });
}

// ── CONSOLE SIGNATURE
console.log('%c\n ✦ AROKELIX ✦ \n Where craft meets eternal. \n Built from Africa — for the world. \n hello@arokelix.com \n', 'color:#E5AB18;font-family:monospace;font-size:13px;background:#04050A;padding:16px;border-left:3px solid #C9940A;');