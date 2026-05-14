window.addEventListener('load', function() {
    var pre = document.getElementById('preloader');
    if (pre) {
        setTimeout(function() {
            pre.classList.add('hidden');
        }, 800);
    }
});

var nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');
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

var obs = new IntersectionObserver(function(entries) {
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

function animateCount(el) {
    var text = el.innerText;
    var target = parseInt(text.replace(/\D/g, ''));
    var suffix = text.replace(/[0-9]/g, '');
    if (!target) return;
    var count = 0;
    var step = target / 50;
    var timer = setInterval(function() {
        count += step;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        el.innerText = Math.floor(count) + suffix;
    }, 30);
}

var statObs = new IntersectionObserver(function(entries) {
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

var backToTop = document.getElementById('backToTop');
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

if (!localStorage.getItem('arokelix_cookies')) {
    setTimeout(function() {
        var banner = document.getElementById('cookieBanner');
        if (banner) banner.classList.add('show');
    }, 3000);
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

// ── SCROLL PROGRESS BAR
var progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.body.scrollHeight - window.innerHeight;
    var progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
});