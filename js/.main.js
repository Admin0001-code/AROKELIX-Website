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

// ── SCROLL PROGRESS
var prog = document.getElementById('scrollProgress');
if (prog) {
    window.addEventListener('scroll', function() {
        var scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        prog.style.width = scrolled + '%';
    });
}

// ── FORM VALIDATION
var contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var valid = true;
        var inputs = contactForm.querySelectorAll('[required]');
        inputs.forEach(function(input) {
            if (!input.value.trim()) {
                input.classList.add('error');
                input.classList.remove('success');
                valid = false;
            } else {
                input.classList.remove('error');
                input.classList.add('success');
            }
            if (input.type === 'email' && input.value) {
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.classList.add('error');
                    valid = false;
                }
            }
        });
        if (valid) {
            var btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.innerText = 'Sending...';
                btn.style.opacity = '0.7';
                setTimeout(function() {
                    contactForm.style.display = 'none';
                    var success = document.createElement('div');
                    success.style.cssText = 'text-align:center;padding:60px 0;';
                    success.innerHTML = '<div style="font-family:Bebas Neue,sans-serif;font-size:40px;letter-spacing:0.1em;color:var(--gold2);margin-bottom:16px;">✦ Message Sent</div><p style="font-size:14px;color:var(--muted-light);line-height:1.7;">Thank you for reaching out. We will respond within 24 hours.</p>';
                    contactForm.parentNode.appendChild(success);
                }, 1500);
            }
        }
    });

    contactForm.querySelectorAll('.form-input').forEach(function(input) {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
                if (this.value.trim()) this.classList.add('success');
            }
        });
        input.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });
}

// ── KEYBOARD HAMBURGER
var hamburgerBtn = document.getElementById('hamburger');
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            var menu = document.getElementById('mobileMenu');
            if (menu) menu.classList.toggle('open');
        }
    });
}

// ── LAZY LOADING IMAGES
if ('IntersectionObserver' in window) {
    var lazyImages = document.querySelectorAll('img[data-src]');
    var imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    lazyImages.forEach(function(img) {
        imageObserver.observe(img);
    });
}