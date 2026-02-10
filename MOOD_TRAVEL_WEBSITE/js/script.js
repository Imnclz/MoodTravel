// MOOD Travel Website - JavaScript

// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenuWrapper.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenuWrapper.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar')) {
                hamburger.classList.remove('active');
                navMenuWrapper.classList.remove('active');
            }
        });
    }
});

// Navigate to package page
function navigateToPackage(packageType) {
    window.location.href = `packages.html?type=${packageType}`;
}

// Setup lightbox close handlers immediately
function setupLightboxHandlers() {
    const lightbox = document.getElementById('lightboxModal');
    if (lightbox) {
        lightbox.addEventListener('click', function(event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }
}

// Setup Escape key listener
function setupEscapeKey() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeLightbox();
        }
    });
}

// Defer non-critical interactions with requestIdleCallback
document.addEventListener('DOMContentLoaded', function() {
    // Critical: HERO VIDEO TOGGLE
    const watchVideoBtn = document.getElementById('watchVideoBtn');
    const heroSection = document.querySelector('.hero');
    const heroVideo = document.getElementById('heroVideo');
    let videoActive = false;

    if (watchVideoBtn) {
        // Try playing available videos; fall back if the first fails (some files may have been removed)
        const VIDEO_FALLBACKS = ['videos/V1.mp4', 'videos/V5.mp4'];

        function tryPlayWithFallback(index = 0) {
            if (index >= VIDEO_FALLBACKS.length) {
                console.log('No playable video found');
                return;
            }
            const src = VIDEO_FALLBACKS[index];
            // Replace source if different or missing
            const currentSource = heroVideo.querySelector('source');
            if (!currentSource || currentSource.getAttribute('src') !== src) {
                heroVideo.innerHTML = `<source src="${src}" type="video/mp4">`;
                heroVideo.load();
            }

            heroVideo.play().catch(err => {
                console.log('Video play error for', src, err);
                tryPlayWithFallback(index + 1);
            });
        }

        watchVideoBtn.addEventListener('click', function() {
            videoActive = !videoActive;
            if (videoActive) {
                heroSection.classList.add('video-active');
                tryPlayWithFallback(0);
                watchVideoBtn.textContent = 'Pause Video';
            } else {
                heroSection.classList.remove('video-active');
                heroVideo.pause();
                watchVideoBtn.textContent = 'Tonton Video';
            }
        });

        heroVideo.addEventListener('ended', function() {
            videoActive = false;
            heroSection.classList.remove('video-active');
            watchVideoBtn.textContent = 'Tonton Video';
        });
    }

    // Critical: SMOOTH SCROLLING (nav links)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Setup lightbox handlers
    setupLightboxHandlers();
    setupEscapeKey();

    // Defer less critical interactions
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(setupAnimations, { timeout: 2000 });
    } else {
        setTimeout(setupAnimations, 100);
    }
});

function setupAnimations() {
    // ===== INTERACTIVE EXPERIENCE CARDS =====
    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach(card => {
        card.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            experienceCards.forEach(c => {
                c.classList.remove('active');
            });
            if (!isActive) {
                this.classList.add('active');
            }
        });
    });

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.destination-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // ===== FAQ TOGGLE =====
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
}

// ===== LIGHTBOX FUNCTIONS =====
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightboxModal');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}
