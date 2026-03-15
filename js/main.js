/* =============================================
   HART SOUND & AIR TESTING LTD — JAVASCRIPT
   Interactivity, animations, form handling
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ===== CHECK FOR FORM REDIRECT SUCCESS =====
    const urlParams = new URLSearchParams(window.location.search);
    const sentParam = urlParams.get('sent');
    if (sentParam) {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            setTimeout(() => {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
        if (sentParam === 'quote') {
            const formWrap = document.querySelector('.contact-form-wrap');
            if (formWrap) {
                formWrap.innerHTML = `
                    <div class="form-success">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank You!</h3>
                        <p>Your quote request has been sent successfully. We'll get back to you within 24 hours.</p>
                    </div>
                `;
            }
        } else if (sentParam === 'callback') {
            const callbackBox = document.querySelector('.callback-box');
            if (callbackBox) {
                callbackBox.innerHTML = `
                    <div class="form-success">
                        <i class="fas fa-check-circle"></i>
                        <h3>Callback Requested!</h3>
                        <p>We'll call you back as soon as possible.</p>
                    </div>
                `;
            }
        }
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load

    // ===== BACK TO TOP =====
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== MOBILE NAVIGATION =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking the overlay
    navMenu.addEventListener('click', (e) => {
        if (e.target === navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

    function setActiveLink() {
        let current = '';
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // ms
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(ease * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    // Trigger counters when hero stats are visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }

    // ===== SCROLL ANIMATIONS (FADE IN) =====
    const animElements = document.querySelectorAll(
        '.service-card, .process-step, .feature-card, .testimonial-card, ' +
        '.about-content, .about-image, .contact-info, .contact-form-wrap'
    );

    animElements.forEach(el => el.classList.add('fade-in'));

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger animations for grid items
                const parent = entry.target.parentElement;
                const siblings = parent ? Array.from(parent.children).filter(
                    c => c.classList.contains('fade-in')
                ) : [];
                const index = siblings.indexOf(entry.target);
                const delay = index >= 0 ? index * 100 : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animElements.forEach(el => fadeObserver.observe(el));

    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);

            // Basic validation
            if (!formData.get('name') || !formData.get('phone') || !formData.get('email') || !formData.get('service')) {
                alert('Please fill in all required fields.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.get('email'))) {
                alert('Please enter a valid email address.');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            fetch('https://formsubmit.co/ajax/info@hartsoundairtesting.co.uk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    contactForm.parentElement.innerHTML = `
                        <div class="form-success">
                            <i class="fas fa-check-circle"></i>
                            <h3>Thank You!</h3>
                            <p>Your quote request has been sent successfully. We'll get back to you within 24 hours.</p>
                        </div>
                    `;
                } else {
                    // Fallback: submit form natively
                    contactForm.submit();
                }
            })
            .catch(() => {
                // Fallback: submit form natively (will redirect via _next)
                contactForm.submit();
            });
        });
    }

    // ===== FAQ ACCORDION =====
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('active');

            // Close all other FAQ items
            document.querySelectorAll('.faq-item.active').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('active');
                    openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('active', !isOpen);
            btn.setAttribute('aria-expanded', String(!isOpen));
        });
    });

    // ===== CALLBACK FORM HANDLING =====
    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(callbackForm);

            if (!formData.get('name') || !formData.get('phone')) {
                alert('Please enter your name and phone number.');
                return;
            }

            const submitBtn = callbackForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            fetch('https://formsubmit.co/ajax/info@hartsoundairtesting.co.uk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    callbackForm.parentElement.innerHTML = `
                        <div class="form-success">
                            <i class="fas fa-check-circle"></i>
                            <h3>Callback Requested!</h3>
                            <p>We'll call you back as soon as possible.</p>
                        </div>
                    `;
                } else {
                    callbackForm.submit();
                }
            })
            .catch(() => {
                callbackForm.submit();
            });
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== FOOTER YEAR =====
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});
