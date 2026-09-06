/* ═══════════════════════════════════════════════════════════
   MUHAMMAD UMAR — PORTFOLIO JAVASCRIPT
   Scroll animations, navigation, form handling, counters
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── CONFIG ─── */
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrpzgrvj';

    /* ─── DOM REFERENCES ─── */
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('.section');
    const backToTop = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const btnSend = document.getElementById('btn-send');
    const formStatus = document.getElementById('form-status');

    /* ═══════════════════════════════════════════
       NAVIGATION
       ═══════════════════════════════════════════ */

    // Scroll effect on navbar
    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Active link on scroll
    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    // Close mobile nav on link click
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ═══════════════════════════════════════════
       BACK TO TOP
       ═══════════════════════════════════════════ */
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    /* ═══════════════════════════════════════════
       SCROLL ANIMATIONS — INTERSECTION OBSERVER
       ═══════════════════════════════════════════ */

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function createScrollObserver() {
        if (prefersReducedMotion) {
            // Show everything immediately
            document.querySelectorAll('[data-animate]').forEach(function (el) {
                el.classList.add('in-view');
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.getAttribute('data-delay')) || 0;

                    setTimeout(function () {
                        el.classList.add('in-view');

                        // Trigger child animations for specific containers
                        triggerChildAnimations(el);
                    }, delay);

                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        // Observe all data-animate elements
        document.querySelectorAll('[data-animate]').forEach(function (el) {
            observer.observe(el);
        });

        // Observe specific container elements for child animations
        const containers = [
            '.social-icons',
            '.view-work-buttons',
            '.experience-card',
            '.education-card',
            '.project-card',
            '.contact-form-wrapper',
            '.contact-info-wrapper'
        ];

        const containerObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    containerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        containers.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el) {
                containerObserver.observe(el);
            });
        });
    }

    function triggerChildAnimations(el) {
        // No additional actions needed - CSS handles child animations via .in-view parent
    }

    /* ═══════════════════════════════════════════
       SKILL BARS ANIMATION
       ═══════════════════════════════════════════ */
    function animateSkillBars() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        let animated = false;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;

                    const fills = skillsSection.querySelectorAll('.skill-fill');
                    const percents = skillsSection.querySelectorAll('.skill-percent');

                    fills.forEach(function (fill, index) {
                        const width = fill.getAttribute('data-width');
                        setTimeout(function () {
                            fill.style.width = width + '%';
                            fill.classList.add('animated');
                        }, index * 50);
                    });

                    // Animate percentage counters
                    percents.forEach(function (el, index) {
                        const target = parseInt(el.getAttribute('data-value'));
                        setTimeout(function () {
                            animateCounter(el, 0, target, 1000, '%');
                        }, index * 50);
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(skillsSection);
    }

    /* ═══════════════════════════════════════════
       STAT COUNTERS ANIMATION
       ═══════════════════════════════════════════ */
    function animateStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length === 0) return;

        let animated = false;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;

                    statNumbers.forEach(function (el) {
                        const target = parseInt(el.getAttribute('data-target'));
                        animateCounter(el, 0, target, 800, '');
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const statContainer = document.querySelector('.stat-counters');
        if (statContainer) {
            observer.observe(statContainer);
        }
    }

    /* ─── COUNTER HELPER ─── */
    function animateCounter(element, start, end, duration, suffix) {
        if (prefersReducedMotion) {
            element.textContent = end + suffix;
            return;
        }

        const range = end - start;
        if (range === 0) {
            element.textContent = end + suffix;
            return;
        }

        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + range * eased);

            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /* ═══════════════════════════════════════════
       CERTIFICATION CARDS — RANDOM ROTATION
       ═══════════════════════════════════════════ */
    function setCertRotations() {
        document.querySelectorAll('.cert-card[data-animate="waterfall"]').forEach(function (card) {
            const randomRotate = (Math.random() * 4 - 2).toFixed(1); // -2 to +2 degrees
            card.style.setProperty('--random-rotate', randomRotate + 'deg');
        });
    }

    /* ═══════════════════════════════════════════
       CONTACT FORM — FORMSPREE SUBMISSION
       ═══════════════════════════════════════════ */
    function setupContactForm() {
        if (!contactForm) return;

        // Set form action from config
        contactForm.setAttribute('action', FORMSPREE_ENDPOINT);

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Prevent duplicate submissions
            if (btnSend.classList.contains('loading')) return;

            // Basic validation
            const name = contactForm.querySelector('[name="name"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const subject = contactForm.querySelector('[name="subject"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();

            if (!name || !email || !subject || !message) {
                showFormStatus('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormStatus('Please enter a valid email address.', 'error');
                return;
            }

            // Check if endpoint is configured
            if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
                showFormStatus('Contact form endpoint is not configured. Please set up Formspree.', 'error');
                return;
            }

            // Show loading state
            btnSend.classList.add('loading');
            showFormStatus('', '');

            // Submit via fetch
            const formData = new FormData(contactForm);

            fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Submission failed');
            })
            .then(function () {
                // Success
                btnSend.classList.remove('loading');
                btnSend.classList.add('success');
                showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success-msg');
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(function () {
                    btnSend.classList.remove('success');
                }, 3000);
            })
            .catch(function () {
                // Error
                btnSend.classList.remove('loading');
                showFormStatus('Something went wrong. Please try again or email me directly.', 'error');
            });
        });

        // Floating label support (for browsers where :placeholder-shown doesn't work)
        contactForm.querySelectorAll('input, textarea').forEach(function (field) {
            field.addEventListener('input', function () {
                if (this.value.trim()) {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });
        });

        // Send button initial pulse after form is visible
        const formObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setTimeout(function () {
                        btnSend.classList.add('pulse');
                        btnSend.addEventListener('animationend', function () {
                            btnSend.classList.remove('pulse');
                        }, { once: true });
                    }, 1200);
                    formObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        formObserver.observe(contactForm);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFormStatus(message, className) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + (className || '');
    }

    /* ═══════════════════════════════════════════
       ABOUT SECTION — PROFILE PHOTO SHADOW BLOOM
       ═══════════════════════════════════════════ */
    function setupPhotoBloom() {
        const aboutPhoto = document.querySelector('.about-photo-wrapper');
        if (!aboutPhoto || prefersReducedMotion) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    aboutPhoto.style.transition = 'box-shadow 0.8s ease';
                    aboutPhoto.style.boxShadow = '0 8px 40px rgba(45, 42, 38, 0.12), 0 0 60px rgba(196, 162, 101, 0.08)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(aboutPhoto);
    }

    /* ═══════════════════════════════════════════
       EXPERIENCE CARD — BULLET STAGGER
       ═══════════════════════════════════════════ */
    function setupExpBulletStagger() {
        const cards = document.querySelectorAll('.experience-card');
        if (prefersReducedMotion) return;

        cards.forEach(function (card) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const bullets = card.querySelectorAll('.exp-bullet');
                        bullets.forEach(function (bullet, i) {
                            bullet.style.opacity = '0';
                            bullet.style.transform = 'translateY(15px)';
                            bullet.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

                            setTimeout(function () {
                                bullet.style.opacity = '1';
                                bullet.style.transform = 'translateY(0)';
                            }, 400 + i * 150);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(card);
        });
    }

    /* ═══════════════════════════════════════════
       PROJECT OUTCOME BOXES — POP IN
       ═══════════════════════════════════════════ */
    function setupOutcomeBoxPop() {
        if (prefersReducedMotion) return;

        document.querySelectorAll('.project-card').forEach(function (card) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const boxes = card.querySelectorAll('.outcome-box');
                        boxes.forEach(function (box, i) {
                            box.style.opacity = '0';
                            box.style.transform = 'scale(0.85)';
                            box.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';

                            setTimeout(function () {
                                box.style.opacity = '1';
                                box.style.transform = 'scale(1)';
                            }, 300 + i * 120);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            observer.observe(card);
        });
    }

    /* ═══════════════════════════════════════════
       INITIALIZE
       ═══════════════════════════════════════════ */
    function init() {
        handleNavScroll();
        updateActiveNav();
        handleBackToTop();
        setCertRotations();
        createScrollObserver();
        animateSkillBars();
        animateStatCounters();
        setupContactForm();
        setupPhotoBloom();
        setupExpBulletStagger();
        setupOutcomeBoxPop();
    }

    // Scroll event handler (throttled)
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                handleNavScroll();
                updateActiveNav();
                handleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
