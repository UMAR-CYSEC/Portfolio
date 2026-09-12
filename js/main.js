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
        if (window.scrollY > 300) {
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
        initCyberBackground();
    }

    /* ═══════════════════════════════════════════
       LIVE 3D CYBER GRID BACKGROUND (ALWAYS RUNNING)
       ═══════════════════════════════════════════ */
    function initCyberBackground() {
        const bgCanvas = document.getElementById('cyber-bg-canvas');
        if (!bgCanvas) return;
        const bgCtx = bgCanvas.getContext('2d');

        function resizeBg() {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeBg);
        resizeBg();

        let gridZ = 0;
        const stars = [];
        for (let i = 0; i < 60; i++) {
            stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * (window.innerHeight * 0.5),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.7 + 0.3,
                speed: Math.random() * 0.25 + 0.05
            });
        }

        function renderBg() {
            bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            const horizon = bgCanvas.height * 0.42;

            // Distant cyber stars
            stars.forEach(s => {
                s.y += s.speed;
                if (s.y > horizon) s.y = 0;
                bgCtx.fillStyle = `rgba(56, 189, 248, ${s.alpha * 0.5})`;
                bgCtx.fillRect(s.x, s.y, s.size, s.size);
            });

            // Horizon Glow
            const glow = bgCtx.createLinearGradient(0, horizon - 20, 0, horizon + 50);
            glow.addColorStop(0, 'rgba(6, 182, 212, 0)');
            glow.addColorStop(0.5, 'rgba(6, 182, 212, 0.2)');
            glow.addColorStop(1, 'rgba(6, 182, 212, 0)');
            bgCtx.fillStyle = glow;
            bgCtx.fillRect(0, horizon - 20, bgCanvas.width, 70);

            // Horizon boundary line
            bgCtx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
            bgCtx.lineWidth = 1;
            bgCtx.beginPath();
            bgCtx.moveTo(0, horizon);
            bgCtx.lineTo(bgCanvas.width, horizon);
            bgCtx.stroke();

            // 3D Perspective Lines
            gridZ = (gridZ + 0.35) % 40;
            const lines = 24;
            bgCtx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
            bgCtx.lineWidth = 1;

            for (let i = 0; i <= lines; i++) {
                const bottomX = (bgCanvas.width / lines) * i;
                const topX = bgCanvas.width * 0.5 + (bottomX - bgCanvas.width * 0.5) * 0.12;
                bgCtx.beginPath();
                bgCtx.moveTo(topX, horizon);
                bgCtx.lineTo(bottomX, bgCanvas.height);
                bgCtx.stroke();
            }

            // Moving horizontal grid lines
            for (let y = horizon; y < bgCanvas.height; y += 1) {
                const normalized = (y - horizon) / (bgCanvas.height - horizon);
                const dynamicSpacing = Math.pow(normalized, 2.3) * (bgCanvas.height - horizon);
                const finalY = horizon + ((dynamicSpacing + gridZ * normalized * 2.5) % (bgCanvas.height - horizon));

                if (finalY > horizon + 2 && finalY < bgCanvas.height) {
                    const alpha = Math.min(0.22, normalized * 0.35);
                    bgCtx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    bgCtx.beginPath();
                    bgCtx.moveTo(0, finalY);
                    bgCtx.lineTo(bgCanvas.width, finalY);
                    bgCtx.stroke();
                }
            }

            requestAnimationFrame(renderBg);
        }

        renderBg();
    }

    /* ═══════════════════════════════════════════
       INTERACTIVE CYBER-GRID INTERCEPTOR MINI-GAME
       ═══════════════════════════════════════════ */
    function initCyberGame() {
        const gameCanvas = document.getElementById('game-canvas');
        if (!gameCanvas) return;
        const gCtx = gameCanvas.getContext('2d');

        const scoreEl = document.getElementById('game-score');
        const comboEl = document.getElementById('game-combo');
        const shieldFill = document.getElementById('game-shield-fill');
        const overlay = document.getElementById('game-overlay');
        const startBtn = document.getElementById('game-start-btn');
        const overlayTitle = document.getElementById('overlay-title');
        const overlaySubtitle = document.getElementById('overlay-subtitle');
        const scoreBox = document.getElementById('overlay-score-box');
        const finalScoreEl = document.getElementById('overlay-final-score');
        const finalDodgedEl = document.getElementById('overlay-dodged');
        const resetBtn = document.getElementById('game-fullscreen-toggle');

        function resizeGame() {
            const rect = gameCanvas.getBoundingClientRect();
            gameCanvas.width = rect.width;
            gameCanvas.height = rect.height;
        }
        window.addEventListener('resize', resizeGame);
        resizeGame();

        let isRunning = false;
        let score = 0;
        let dodged = 0;
        let shield = 100;
        let combo = 1.0;
        let speed = 6;
        let meteors = [];
        let particles = [];
        let gridZ = 0;
        let lastSpawn = 0;

        const jet = {
            x: gameCanvas.width / 2,
            y: gameCanvas.height * 0.8,
            targetX: gameCanvas.width / 2,
            roll: 0,
            invulnerable: 0
        };

        // Controls
        const keys = {};
        window.addEventListener('keydown', e => { keys[e.key] = true; });
        window.addEventListener('keyup', e => { keys[e.key] = false; });

        gameCanvas.addEventListener('mousemove', e => {
            if (!isRunning) return;
            const rect = gameCanvas.getBoundingClientRect();
            jet.targetX = e.clientX - rect.left;
        });

        gameCanvas.addEventListener('touchmove', e => {
            if (!isRunning || !e.touches[0]) return;
            const rect = gameCanvas.getBoundingClientRect();
            jet.targetX = e.touches[0].clientX - rect.left;
        }, { passive: true });

        function startMission() {
            resizeGame();
            isRunning = true;
            score = 0;
            dodged = 0;
            shield = 100;
            combo = 1.0;
            speed = 6;
            meteors = [];
            particles = [];
            jet.x = gameCanvas.width / 2;
            jet.targetX = gameCanvas.width / 2;

            overlay.classList.add('hidden');
            scoreBox.style.display = 'none';
            updateGameHUD();
        }

        function gameOver() {
            isRunning = false;
            createExplosion(jet.x, jet.y, 40, '#06b6d4');
            createExplosion(jet.x, jet.y, 25, '#ffffff');

            overlayTitle.textContent = 'MISSION TELEMETRY';
            overlaySubtitle.textContent = 'Shield depleted! Telemetry anomaly encountered.';
            finalScoreEl.textContent = Math.floor(score).toLocaleString();
            finalDodgedEl.textContent = dodged;
            scoreBox.style.display = 'block';
            startBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> RE-ENGAGE JET';
            overlay.classList.remove('hidden');
        }

        function createExplosion(x, y, count, color) {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = Math.random() * 6 + 2;
                particles.push({
                    x: x, y: y,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    radius: Math.random() * 2.5 + 1,
                    color: color,
                    alpha: 1,
                    decay: Math.random() * 0.03 + 0.02
                });
            }
        }

        function spawnMeteor() {
            const horizonY = gameCanvas.height * 0.42;
            const startX = gameCanvas.width * 0.5 + (Math.random() - 0.5) * (gameCanvas.width * 0.5);
            const targetX = Math.random() * gameCanvas.width;
            const angle = Math.atan2(gameCanvas.height - horizonY, targetX - startX);
            const meteorSpeed = speed * (Math.random() * 0.4 + 0.8);

            meteors.push({
                x: startX,
                y: horizonY,
                vx: Math.cos(angle) * meteorSpeed,
                vy: Math.sin(angle) * meteorSpeed,
                scale: 0.15,
                maxRadius: Math.random() * 18 + 16,
                rotation: 0,
                rotSpeed: (Math.random() - 0.5) * 0.06,
                isAnomaly: Math.random() > 0.75
            });
        }

        function updateGameHUD() {
            scoreEl.textContent = Math.floor(score).toString().padStart(5, '0');
            comboEl.textContent = combo.toFixed(1) + 'x';
            shieldFill.style.width = Math.max(0, shield) + '%';

            if (shield <= 25) shieldFill.style.background = '#ef4444';
            else if (shield <= 50) shieldFill.style.background = '#eab308';
            else shieldFill.style.background = 'linear-gradient(90deg, #0284c7, #06b6d4)';
        }

        startBtn.addEventListener('click', startMission);
        if (resetBtn) resetBtn.addEventListener('click', () => { if (isRunning) gameOver(); else startMission(); });

        function gameLoop(timestamp) {
            gCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            const horizon = gameCanvas.height * 0.42;

            // Arena Background
            const arenaBg = gCtx.createLinearGradient(0, 0, 0, gameCanvas.height);
            arenaBg.addColorStop(0, '#04070d');
            arenaBg.addColorStop(0.42, '#081220');
            arenaBg.addColorStop(1, '#050912');
            gCtx.fillStyle = arenaBg;
            gCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

            // 3D Grid in Game Arena
            gridZ = (gridZ + speed * 0.75) % 40;
            const lines = 22;
            gCtx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
            gCtx.lineWidth = 1;

            for (let i = 0; i <= lines; i++) {
                const bottomX = (gameCanvas.width / lines) * i;
                const topX = gameCanvas.width * 0.5 + (bottomX - gameCanvas.width * 0.5) * 0.12;
                gCtx.beginPath();
                gCtx.moveTo(topX, horizon);
                gCtx.lineTo(bottomX, gameCanvas.height);
                gCtx.stroke();
            }

            for (let y = horizon; y < gameCanvas.height; y += 1) {
                const normalized = (y - horizon) / (gameCanvas.height - horizon);
                const dynamicSpacing = Math.pow(normalized, 2.2) * (gameCanvas.height - horizon);
                const finalY = horizon + ((dynamicSpacing + gridZ * normalized * 2.5) % (gameCanvas.height - horizon));

                if (finalY > horizon + 2 && finalY < gameCanvas.height) {
                    const alpha = Math.min(0.35, normalized * 0.5);
                    gCtx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    gCtx.beginPath();
                    gCtx.moveTo(0, finalY);
                    gCtx.lineTo(gameCanvas.width, finalY);
                    gCtx.stroke();
                }
            }

            // Logic Update
            if (isRunning) {
                score += (speed * 0.1) * combo;
                combo = Math.min(5.0, 1.0 + dodged * 0.1);
                speed = 6 + Math.min(7, score / 450);

                if (keys['ArrowLeft'] || keys['a'] || keys['A']) jet.targetX -= 10;
                if (keys['ArrowRight'] || keys['d'] || keys['D']) jet.targetX += 10;

                const dx = jet.targetX - jet.x;
                jet.x += dx * 0.14;
                jet.x = Math.max(25, Math.min(gameCanvas.width - 25, jet.x));
                jet.roll = Math.max(-0.35, Math.min(0.35, dx * 0.015));

                const spawnInterval = Math.max(380, 950 - speed * 40);
                if (timestamp - lastSpawn > spawnInterval) {
                    spawnMeteor();
                    lastSpawn = timestamp;
                }

                if (jet.invulnerable > 0) jet.invulnerable--;
                updateGameHUD();
            }

            // Meteors
            for (let i = meteors.length - 1; i >= 0; i--) {
                const m = meteors[i];
                m.x += m.vx;
                m.y += m.vy;
                m.rotation += m.rotSpeed;

                const prog = (m.y - horizon) / (gameCanvas.height - horizon);
                m.scale = Math.min(1.3, 0.15 + prog * 1.15);
                const curRadius = m.maxRadius * m.scale;

                gCtx.save();
                gCtx.translate(m.x, m.y);
                gCtx.rotate(m.rotation);

                if (m.isAnomaly) {
                    gCtx.beginPath();
                    gCtx.arc(0, 0, curRadius, 0, Math.PI * 2);
                    gCtx.fillStyle = '#061320';
                    gCtx.fill();
                    gCtx.strokeStyle = '#06b6d4';
                    gCtx.lineWidth = 2 * m.scale;
                    gCtx.shadowBlur = 10 * m.scale;
                    gCtx.shadowColor = '#06b6d4';
                    gCtx.stroke();
                } else {
                    gCtx.beginPath();
                    gCtx.arc(0, 0, curRadius, 0, Math.PI * 2);
                    gCtx.fillStyle = '#1e1c24';
                    gCtx.fill();
                    gCtx.strokeStyle = '#f97316';
                    gCtx.lineWidth = 1.5 * m.scale;
                    gCtx.shadowBlur = 6 * m.scale;
                    gCtx.shadowColor = '#ea580c';
                    gCtx.stroke();
                }
                gCtx.restore();

                // Hit Detection
                if (isRunning && jet.invulnerable === 0) {
                    const dist = Math.hypot(jet.x - m.x, jet.y - m.y);
                    if (dist < curRadius + 16) {
                        shield -= 34;
                        jet.invulnerable = 30;
                        createExplosion(m.x, m.y, 16, m.isAnomaly ? '#06b6d4' : '#f97316');
                        meteors.splice(i, 1);
                        if (shield <= 0) {
                            gameOver();
                            break;
                        }
                        continue;
                    }
                }

                if (m.y > gameCanvas.height + 30) {
                    meteors.splice(i, 1);
                    if (isRunning) dodged++;
                }
            }

            // Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }
                gCtx.beginPath();
                gCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                gCtx.fillStyle = p.color;
                gCtx.globalAlpha = p.alpha;
                gCtx.fill();
                gCtx.globalAlpha = 1;
            }

            // Draw Jet
            if (isRunning || !overlay.classList.contains('hidden')) {
                gCtx.save();
                gCtx.translate(jet.x, jet.y);
                gCtx.rotate(jet.roll);

                if (jet.invulnerable > 0 && Math.floor(jet.invulnerable / 4) % 2 === 0) {
                    gCtx.globalAlpha = 0.3;
                }

                // Thrusters
                const flame = 12 + Math.random() * 6 + speed;
                gCtx.beginPath();
                gCtx.moveTo(-7, 16);
                gCtx.lineTo(-4, 16 + flame);
                gCtx.lineTo(-1, 16);
                gCtx.fillStyle = '#38bdf8';
                gCtx.fill();

                gCtx.beginPath();
                gCtx.moveTo(1, 16);
                gCtx.lineTo(4, 16 + flame);
                gCtx.lineTo(7, 16);
                gCtx.fillStyle = '#38bdf8';
                gCtx.fill();

                // Fuselage
                gCtx.beginPath();
                gCtx.moveTo(0, -24);
                gCtx.lineTo(6, -10);
                gCtx.lineTo(20, 10);
                gCtx.lineTo(10, 14);
                gCtx.lineTo(6, 18);
                gCtx.lineTo(-6, 18);
                gCtx.lineTo(-10, 14);
                gCtx.lineTo(-20, 10);
                gCtx.lineTo(-6, -10);
                gCtx.closePath();

                gCtx.fillStyle = '#0a1626';
                gCtx.fill();
                gCtx.strokeStyle = '#06b6d4';
                gCtx.lineWidth = 1.8;
                gCtx.shadowBlur = 8;
                gCtx.shadowColor = '#06b6d4';
                gCtx.stroke();
                gCtx.shadowBlur = 0;

                gCtx.restore();
                gCtx.globalAlpha = 1;
            }

            requestAnimationFrame(gameLoop);
        }

        requestAnimationFrame(gameLoop);
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
