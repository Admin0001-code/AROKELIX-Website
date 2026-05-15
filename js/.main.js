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

/* ══════════════════════════════════════
   PREMIUM JAVASCRIPT TOUCHES
══════════════════════════════════════ */

// ── TOUCH 1: CURSOR GLOW EFFECT
// Subtle gold glow that follows the cursor on desktop
if (window.innerWidth > 768) {
    var cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = [
        'position:fixed',
        'width:300px',
        'height:300px',
        'border-radius:50%',
        'background:radial-gradient(circle,rgba(201,148,10,0.06) 0%,transparent 70%)',
        'pointer-events:none',
        'z-index:9996',
        'transform:translate(-50%,-50%)',
        'transition:opacity 0.3s',
        'opacity:0'
    ].join(';');
    document.body.appendChild(cursorGlow);

    var mouseX = 0, mouseY = 0;
    var glowX = 0, glowY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function() {
        cursorGlow.style.opacity = '0';
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

// ── TOUCH 2: MAGNETIC BUTTONS
// Premium buttons attract the cursor slightly
document.querySelectorAll('.btn-gold, .btn-primary, .nav-cta').forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.12) + 'px,' + (y * 0.12) + 'px) translateY(-3px)';
    });
    btn.addEventListener('mouseleave', function() {
        btn.style.transform = '';
    });
});

// ── TOUCH 3: SMOOTH NUMBER FORMATTING
// Add commas to large numbers when animated
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ── TOUCH 4: PAGE TRANSITION
// Smooth fade when navigating between pages
document.querySelectorAll('a[href]').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href &&
        !href.startsWith('#') &&
        !href.startsWith('http') &&
        !href.startsWith('mailto') &&
        !href.startsWith('tel') &&
        !href.startsWith('https://wa') &&
        href.endsWith('.html')) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(-8px)';
            document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            setTimeout(function() {
                window.location.href = href;
            }, 300);
        });
    }
});

// ── TOUCH 5: SECTION REVEAL WITH STAGGER
// Children inside revealed sections stagger in
document.querySelectorAll('.services-grid, .why-grid, .home-testi-grid, .stats-grid').forEach(function(grid) {
    var children = grid.children;
    Array.from(children).forEach(function(child, i) {
        child.classList.add('reveal');
        child.style.transitionDelay = (i * 0.1) + 's';
        revealObs.observe(child);
    });
});

// ── TOUCH 6: TYPING EFFECT ON HERO
// The hero eyebrow types in letter by letter
var eyebrow = document.querySelector('.hero-eyebrow');
if (eyebrow) {
    var spans = eyebrow.querySelectorAll('span:not(.hero-dot)');
    spans.forEach(function(span, i) {
        span.style.opacity = '0';
        span.style.transition = 'opacity 0.4s ease';
        setTimeout(function() {
            span.style.opacity = '1';
        }, 400 + (i * 200));
    });
}

// ── TOUCH 7: MARQUEE SPEED ON HOVER
var marqueeEl = document.querySelector('.marquee-inner');
if (marqueeEl) {
    marqueeEl.parentElement.addEventListener('mouseenter', function() {
        marqueeEl.style.animationPlayState = 'paused';
    });
    marqueeEl.parentElement.addEventListener('mouseleave', function() {
        marqueeEl.style.animationPlayState = 'running';
    });
}

// ── TOUCH 8: STATS COUNT WITH EASING
// Already handled — but now add gold color flash on complete
document.querySelectorAll('.stat-num').forEach(function(el) {
    var origColor = 'var(--c-gold2)';
    var flashColor = 'var(--c-gold3)';
    var obs2 = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                setTimeout(function() {
                    el.style.color = flashColor;
                    setTimeout(function() {
                        el.style.color = origColor;
                    }, 600);
                }, 1800);
                obs2.unobserve(el);
            }
        });
    }, { threshold: 0.6 });
    obs2.observe(el);
});

// ── TOUCH 9: SCROLL TO ANCHOR SMOOTH
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── TOUCH 10: LAZY LOAD ALL IMAGES
if ('IntersectionObserver' in window) {
    var imgObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.6s ease';
                    img.onload = function() {
                        img.style.opacity = '1';
                    };
                    img.removeAttribute('data-src');
                }
                imgObs.unobserve(img);
            }
        });
    }, { rootMargin: '300px' });
    document.querySelectorAll('img[data-src]').forEach(function(img) {
        imgObs.observe(img);
    });
}

// ── TOUCH 11: PRINT AROKELIX IN CONSOLE
console.log('%c\n ✦ AROKELIX ✦ \n Built from Africa. Built for the world. \n hello@arokelix.com \n', 'color:#E5AB18;font-family:monospace;font-size:14px;font-weight:bold;background:#04050A;padding:16px;border-left:3px solid #C9940A;');