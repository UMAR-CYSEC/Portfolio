/* ═══════════════════════════════════════════════════════════════════
   MUHAMMAD UMAR — PORTFOLIO MAIN JAVASCRIPT
   Theme Switcher, iOS Liquid Glass Navbar, Animations, Lightbox, Formspree
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

(function () {
    /* ─── DOM ELEMENTS ─── */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const iosNav = document.getElementById('ios-glass-nav');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const navMobileBtn = document.getElementById('nav-mobile-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const backToTopBtn = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formStatus = document.getElementById('form-status');

    // Certificate Lightbox
    const certCards = document.querySelectorAll('.cert-card');
    const certModal = document.getElementById('cert-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalClose = document.getElementById('cert-modal-close');

    /* ═══════════════════════════════════════════════════════════════════
       1. THEME SWITCHER (DARK / LIGHT MODE)
       ═══════════════════════════════════════════════════════════════════ */
    function initTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let activeTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'dark'); // default dark
        applyTheme(activeTheme);

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                applyTheme(nextTheme);
                localStorage.setItem('portfolio-theme', nextTheme);
            });
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

    /* ═══════════════════════════════════════════════════════════════════
       2. iOS LIQUID GLASS NAVBAR SCROLL & ACTIVE TRACKING
       ═══════════════════════════════════════════════════════════════════ */
    function initNavScroll() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Nav shrink effect
            if (iosNav) {
                if (scrollY > 40) {
                    iosNav.classList.add('scrolled');
                } else {
                    iosNav.classList.remove('scrolled');
                }
            }

            // Back to top visibility
            if (backToTopBtn) {
                if (scrollY > 350) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }

            // Active section highlighting
            updateActiveSection(scrollY);
        }, { passive: true });

        // Mobile drawer toggle
        if (navMobileBtn && mobileDrawer) {
            navMobileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileDrawer.classList.toggle('open');
                const isOpen = mobileDrawer.classList.contains('open');
                navMobileBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
            });

            // Close mobile drawer on link click or outside click
            document.addEventListener('click', (e) => {
                if (!mobileDrawer.contains(e.target) && !navMobileBtn.contains(e.target)) {
                    mobileDrawer.classList.remove('open');
                    navMobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                }
            });
        }

        // Close drawer when any nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileDrawer) {
                    mobileDrawer.classList.remove('open');
                    if (navMobileBtn) navMobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                }
            });
        });
    }

    function updateActiveSection(scrollY) {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = scrollY + 140;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       3. FLOATING BACK TO TOP
       ═══════════════════════════════════════════════════════════════════ */
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       4. INTERSECTION OBSERVERS FOR SKILLS & STATS
       ═══════════════════════════════════════════════════════════════════ */
    function initObservers() {
        // Skill bars animation
        const skillFills = document.querySelectorAll('.skill-bar-fill');
        if (skillFills.length > 0) {
            const skillObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const targetWidth = entry.target.getAttribute('data-width') || '80';
                        entry.target.style.width = targetWidth + '%';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            skillFills.forEach(fill => skillObserver.observe(fill));
        }

        // Stat Counter animation
        const statCounters = document.querySelectorAll('.stat-number-box');
        if (statCounters.length > 0) {
            const statObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const targetNum = parseInt(el.getAttribute('data-target') || '0', 10);
                        const suffix = el.getAttribute('data-suffix') || '';
                        animateCounter(el, 0, targetNum, 1200, suffix);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.3 });

            statCounters.forEach(counter => statObserver.observe(counter));
        }
    }

    function animateCounter(element, start, end, duration, suffix) {
        if (start === end) {
            element.textContent = end + suffix;
            return;
        }
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            element.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    /* ═══════════════════════════════════════════════════════════════════
       5. CERTIFICATE LIGHTBOX MODAL
       ═══════════════════════════════════════════════════════════════════ */
    function initCertLightbox() {
        if (!certModal || !certModalImg) return;

        certCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('.cert-img');
                if (img) {
                    certModalImg.src = img.src;
                    certModalImg.alt = img.alt;
                    certModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeModal() {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (certModalClose) certModalClose.addEventListener('click', closeModal);
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════════
       6. CONTACT FORM HANDLING (FORMSPREE)
       ═══════════════════════════════════════════════════════════════════ */
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !subject || !message) {
                showStatus('Please fill out all fields before sending.', 'error');
                return;
            }

            // Basic email validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showStatus('Please enter a valid email address.', 'error');
                return;
            }

            // Submitting state
            if (formSubmitBtn) {
                formSubmitBtn.disabled = true;
                formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting...';
            }
            showStatus('Establishing secure connection...', 'info');

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, subject, message })
                });

                if (response.ok) {
                    showStatus('✓ Message transmitted successfully! I will reply shortly.', 'success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors && data.errors.length > 0) {
                        showStatus(data.errors.map(err => err.message).join(', '), 'error');
                    } else {
                        showStatus('An error occurred during transmission. Please email me directly.', 'error');
                    }
                }
            } catch (err) {
                showStatus('Network error. Please reach out via muhammadumar12414@gmail.com directly.', 'error');
            } finally {
                if (formSubmitBtn) {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                }
            }
        });
    }

    function showStatus(msg, type) {
        if (!formStatus) return;
        formStatus.textContent = msg;
        formStatus.style.display = 'block';
        formStatus.style.padding = '10px 14px';
        formStatus.style.marginTop = '14px';
        formStatus.style.borderRadius = '10px';
        formStatus.style.fontSize = '13px';
        formStatus.style.fontWeight = '500';

        if (type === 'success') {
            formStatus.style.background = 'rgba(16, 185, 129, 0.15)';
            formStatus.style.color = '#10b981';
            formStatus.style.border = '1px solid rgba(16, 185, 129, 0.3)';
        } else if (type === 'error') {
            formStatus.style.background = 'rgba(239, 68, 68, 0.15)';
            formStatus.style.color = '#ef4444';
            formStatus.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        } else {
            formStatus.style.background = 'rgba(56, 189, 248, 0.15)';
            formStatus.style.color = '#38bdf8';
            formStatus.style.border = '1px solid rgba(56, 189, 248, 0.3)';
        }
    }

    /* ═══════════════════════════════════════════════════════════════════
       INITIALIZE EVERYTHING ON DOM READY
       ═══════════════════════════════════════════════════════════════════ */
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initNavScroll();
        initObservers();
        initCertLightbox();
        initContactForm();
    });
})();
