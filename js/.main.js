// ── NAV SCROLL EFFECT ──────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', function() {
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ── MOBILE HAMBURGER MENU ──────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', function() {
    mobileMenu.classList.toggle('open');
});

const mobileLinks = document.querySelectorAll('.mobile-menu a');
mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
    });
});

// ── SCROLL REVEAL ANIMATION ────────────
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
    function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1 }
);

reveals.forEach(function(el) {
    observer.observe(el);
});