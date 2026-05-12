// ── PRELOADER
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 1200);
    }
});

// ── NAV SCROLL EFFECT
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ── MOBILE HAMBURGER MENU
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

// ── SCROLL REVEAL ANIMATION
const reveals = document.querySelectorAll('.reveal');
if (reveals.length > 0) {
    const observer = new IntersectionObserver(
        function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );
    reveals.forEach(function(el) {
        observer.observe(el);
    });
}

// ── COUNTER ANIMATION
function animateCounter(el) {
    const target = parseInt(el.innerText.replace(/\D/g, ''));
    const suffix = el.innerText.replace(/[0-9]/g, '');
    let current = 0;
    const step = target / 60;
    const timer = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.innerText = Math.floor(current) + suffix;
    }, 20);
}

const statNums = document.querySelectorAll('.stat-num');
if (statNums.length > 0) {
    const statObserver = new IntersectionObserver(
        function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    statNums.forEach(function(num) {
        statObserver.observe(num);
    });
}

// ── BACK TO TOP BUTTON
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
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
        }, 2000);
    }
}
function acceptCookies() {
    localStorage.setItem('arokelix_cookies', 'accepted');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('show');
}
function declineCookies() {
    localStorage.setItem('arokelix_cookies', 'essential');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('show');
}
showCookieBanner();

// ── ACTIVE NAV LINK
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-links a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage ||
       (currentPage === '' && href === 'index.html')) {
        link.style.color = 'var(--ivory)';
    }
});