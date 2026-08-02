document.addEventListener('DOMContentLoaded', () => {
    // 1 & 15. Navbar scroll effect and active link
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Debounce function for performance
    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    const handleScroll = debounce(() => {
        // Navbar scrolled class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }, 15, false);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Mobile nav toggle
    const navToggle = document.querySelector('#navToggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
            document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navToggle.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navLinksContainer.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // 3. Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = 80; // navbar height offset
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Intersection Observer for Animations
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('visible');
                
                // Staggered delay via data-delay attribute
                if (el.dataset.delay) {
                    el.style.transitionDelay = `${el.dataset.delay}ms`;
                    el.style.animationDelay = `${el.dataset.delay}ms`;
                }

                // 6. Mission/Vision Card Auto Flip
                if (el.dataset.animation === 'flip') {
                    const parentCard = el.closest('.mv-card');
                    if (parentCard) {
                        setTimeout(() => parentCard.classList.add('flipped'), parseInt(el.dataset.delay || 0) + 200);
                    }
                }

                // 10. Social icons bounce-in
                if (el.classList.contains('landing-socials')) {
                    const icons = el.querySelectorAll('.social-icon');
                    icons.forEach((icon, index) => {
                        icon.style.animation = `bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 150}ms forwards`;
                    });
                }

                // 11. Tech Pills Rubber-band
                if (el.classList.contains('project-card')) {
                    const pills = el.querySelectorAll('.tech-pill');
                    pills.forEach((pill, index) => {
                        pill.style.animation = `rubberBand 0.8s ${index * 100 + 400}ms both`;
                    });
                }

                // 12. Highlight Items Reveal/Typewriter
                if (el.classList.contains('edu-card')) {
                    const items = el.querySelectorAll('.highlight-item');
                    items.forEach((item, index) => {
                        item.style.animation = `revealLeft 0.5s ease-out ${index * 200 + 400}ms both`;
                    });
                }

                // 13. Certification Cards Cascade
                if (el.classList.contains('cert-card')) {
                    const randomRotation = (Math.random() * 4) - 2; // -2 to 2 degrees
                    el.style.setProperty('--initial-rotation', `${randomRotation}deg`);
                    // CSS will handle the cascade animation from this initial state to 0
                }

                // 9. Send Button Pulse (trigger after contact section is visible)
                if (el.id === 'contact') {
                    const sendBtn = document.getElementById('sendBtn');
                    if (sendBtn) {
                        setTimeout(() => {
                            sendBtn.classList.add('pulse');
                        }, 1000); // Wait for input underline animations
                    }
                }

                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-item, .landing-socials, .project-card, .edu-card, .cert-card, #contact').forEach(item => {
        animationObserver.observe(item);
    });

    // 5. Skill Bar Animation
    let skillsAnimated = false;
    const skillsSection = document.querySelector('#skills');
    
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !skillsAnimated) {
                skillsAnimated = true;
                
                const skillFills = document.querySelectorAll('.skill-fill');
                const skillPercents = document.querySelectorAll('.skill-percent');

                skillFills.forEach(fill => {
                    const width = fill.dataset.width;
                    fill.style.width = width + '%';
                });

                skillPercents.forEach(percent => {
                    const target = parseInt(percent.dataset.target);
                    let count = 0;
                    const duration = 1000;
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Ease out cubic
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        count = Math.floor(easeOut * target);
                        percent.innerText = count + '%';

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            percent.innerText = target + '%';
                        }
                    }
                    requestAnimationFrame(updateCount);
                });
                
                skillsObserver.disconnect();
            }
        }, { threshold: 0.2 });
        skillsObserver.observe(skillsSection);
    }

    // 6. Mission/Vision Card Flip toggle on click
    const mvCards = document.querySelectorAll('.mv-card');
    mvCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // 7. Certification Card Mouse-follow Tilt
    const tiltElements = document.querySelectorAll('.cert-card, [data-tilt]');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -4; // Max -4deg to 4deg
            const rotateY = ((x - centerX) / centerX) * 4;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.transition = 'transform 0.1s ease';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            el.style.transition = 'transform 0.5s ease-out';
        });
    });

    // 8. Contact Form
    const contactForm = document.getElementById('contactForm');
    const sendBtn = document.getElementById('sendBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameEl = document.getElementById('fullName');
            const emailEl = document.getElementById('emailAddr');
            const subjectEl = document.getElementById('subject');
            const messageEl = document.getElementById('message');
            
            const fullName = nameEl ? nameEl.value : '';
            const email = emailEl ? emailEl.value : '';
            const subject = subjectEl ? subjectEl.value : '';
            const message = messageEl ? messageEl.value : '';
            
            const mailtoLink = `mailto:muhammadumar12414@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${fullName}\nEmail: ${email}\n\n${message}`)}`;
            
            window.location.href = mailtoLink;
            
            if (sendBtn) {
                const originalText = sendBtn.innerHTML;
                sendBtn.innerHTML = 'Message Sent! ✓';
                sendBtn.classList.add('sent');
                
                setTimeout(() => {
                    sendBtn.innerHTML = originalText;
                    sendBtn.classList.remove('sent');
                    contactForm.reset();
                }, 2000);
            }
        });
    }

    // 9. Send Button Pulse Reset (animationend)
    if (sendBtn) {
        sendBtn.addEventListener('animationend', (e) => {
            if (e.animationName === 'pulse') {
                sendBtn.classList.remove('pulse');
            }
        });
    }

    // 14. Download Button Bounce
    const downloadBtn = document.querySelector('.btn-outline'); // Assuming 'Download My Resume' is .btn-outline
    if (downloadBtn) {
        downloadBtn.addEventListener('mouseenter', () => {
            const icon = downloadBtn.querySelector('i, svg');
            if (icon) {
                icon.classList.add('bounce-icon');
            }
        });
        
        const icon = downloadBtn.querySelector('i, svg');
        if (icon) {
            icon.addEventListener('animationend', () => {
                icon.classList.remove('bounce-icon');
            });
        }
    }
    
    // 16. Year in Footer (Already hardcoded as per instructions, but adding dynamic backup just in case)
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        // yearSpan.textContent = new Date().getFullYear();
    }
});
