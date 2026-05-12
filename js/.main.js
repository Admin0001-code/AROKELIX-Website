// ── PRELOADER — REMOVE AFTER 1.5 SECONDS
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(function() {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 600);
        }, 1500);
    }
});

// ── NAV SCROLL
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', function() {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });
}

// ── MOBILE MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
        mobileMenu.classList.toggle('open');
    });
    document.querySelectorAll('.mobile-menu a').forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
        });
    });
}

// ── SCROLL REVEAL
const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(function(el) {
    obs.observe(el);
});

// ── COUNTER ANIMATION
function animateCount(el) {
    const text = el.innerText;
    const target = parseInt(text.replace(/\D/g,''));
    const suffix = text.replace(/[0-9]/g,'');
    if (!target) return;
    let count = 0;
    const step = target / 50;
    const timer = setInterval(function() {
        count += step;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        el.innerText = Math.floor(count) + suffix;
    }, 30);
}
const statObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
        if (e.isIntersecting) {
            animateCount(e.target);
            statObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(function(el) {
    statObs.observe(el);
});

// ── BACK TO TOP
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', function() {
        backToTop.classList.toggle('show', window.scrollY > 400);
    });
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── COOKIE BANNER
function showCookieBanner() {
    if (!localStorage.getItem('arokelix_cookies')) {
        setTimeout(function() {
            const banner = document.getElementById('cookieBanner');
            if (banner) banner.classList.add('show');
        }, 3000);
    }
}
function acceptCookies() {
    localStorage.setItem('arokelix_cookies', 'accepted');
    const b = document.getElementById('cookieBanner');
    if (b) b.classList.remove('show');
}
function declineCookies() {
    localStorage.setItem('arokelix_cookies', 'essential');
    const b = document.getElementById('cookieBanner');
    if (b) b.classList.remove('show');
}
showCookieBanner();

// ── ACTIVE NAV LINK
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(function(link) {
    if (link.getAttribute('href') === page) {
        link.style.color = 'var(--ivory)';
        link.style.borderBottom = '1px solid var(--gold)';
    }
});