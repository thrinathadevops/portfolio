/**
 * Thrinatha Reddy Y - DevSecOps Portfolio
 * Main JavaScript File
 */

// ===================================
// DOM Content Loaded
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize all modules
    LoadingScreen.init();
    ThemeManager.init();
    Navigation.init();
    TypingAnimation.init();
    CounterAnimation.init();
    ScrollAnimations.init();
    FloatingIcons.init();
    ContactForm.init();
    BackToTop.init();
}

// ===================================
// Loading Screen Module
// ===================================
const LoadingScreen = {
    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            }, 1500);
        });
    }
};

// ===================================
// Theme Manager Module
// ===================================
const ThemeManager = {
    init() {
        this.toggle = document.getElementById('themeToggle');
        this.currentTheme = this.getSavedTheme() || this.getSystemTheme();
        
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    },

    getSavedTheme() {
        return localStorage.getItem('theme');
    },

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    },

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    },

    bindEvents() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'light' : 'dark');
            }
        });

        // Keyboard shortcut: Ctrl/Cmd + Shift + T
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
};

// ===================================
// Navigation Module
// ===================================
const Navigation = {
    init() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.bindEvents();
        this.updateActiveLink();
    },

    bindEvents() {
        // Hamburger menu toggle
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Update active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
    },

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    },

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    },

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
};

// ===================================
// Typing Animation Module
// ===================================
const TypingAnimation = {
    init() {
        this.element = document.getElementById('typingText');
        if (!this.element) return;

        this.phrases = [
            'DevSecOps Engineer',
            'DevOps Engineer',
            'Cloud Infrastructure Specialist',
            'CI/CD Architect',
            'Kubernetes Expert',
            'Automation Engineer'
        ];
        
        this.phraseIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;

        this.type();
    },

    type() {
        const currentPhrase = this.phrases[this.phraseIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentPhrase.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentPhrase.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let timeout = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.charIndex === currentPhrase.length) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
            timeout = 500;
        }

        setTimeout(() => this.type(), timeout);
    }
};

// ===================================
// Counter Animation Module
// ===================================
const CounterAnimation = {
    init() {
        this.counters = document.querySelectorAll('.stat-number');
        this.observed = new Set();
        
        this.setupObserver();
    },

    setupObserver() {
        const options = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed.has(entry.target)) {
                    this.observed.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, options);

        this.counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = parseFloat(element.dataset.target);
        const duration = 2000;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = target * easeOutQuart;

            if (isDecimal) {
                element.textContent = currentValue.toFixed(2);
            } else {
                element.textContent = Math.floor(currentValue);
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = isDecimal ? target.toFixed(2) : target;
            }
        };

        requestAnimationFrame(updateCounter);
    }
};

// ===================================
// Scroll Animations Module
// ===================================
const ScrollAnimations = {
    init() {
        this.animatedElements = document.querySelectorAll('[data-aos]');
        this.setupObserver();
    },

    setupObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.aosDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, delay);
                }
            });
        }, options);

        this.animatedElements.forEach(el => observer.observe(el));
    }
};

// ===================================
// Floating Icons Module
// ===================================
const FloatingIcons = {
    init() {
        this.container = document.getElementById('floatingIcons');
        if (!this.container) return;

        this.icons = [
            'fab fa-docker',
            'fab fa-aws',
            'fab fa-jenkins',
            'fab fa-git-alt',
            'fab fa-github',
            'fab fa-linux',
            'fab fa-python',
            'fas fa-dharmachakra',
            'fas fa-code-branch',
            'fas fa-server',
            'fas fa-shield-halved',
            'fas fa-cloud',
            'fas fa-terminal',
            'fas fa-database'
        ];

        this.createIcons();
    },

    createIcons() {
        for (let i = 0; i < 15; i++) {
            const icon = document.createElement('div');
            icon.className = 'floating-icon';
            icon.innerHTML = `<i class="${this.icons[i % this.icons.length]}"></i>`;
            
            icon.style.left = `${Math.random() * 100}%`;
            icon.style.top = `${Math.random() * 100}%`;
            icon.style.animationDelay = `${Math.random() * 10}s`;
            icon.style.animationDuration = `${15 + Math.random() * 15}s`;
            
            this.container.appendChild(icon);
        }
    }
};

// ===================================
// Contact Form Module
// ===================================
const ContactForm = {
    init() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;

        this.bindEvents();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show success message (in production, this would send to a server)
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.form.reset();
        }, 3000);
        
        // Log form data (for demo purposes)
        console.log('Form submitted:', data);
        
        // In production, you would send this to your backend:
        // fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
    }
};

// ===================================
// Back to Top Button Module
// ===================================
const BackToTop = {
    init() {
        this.button = document.getElementById('backToTop');
        if (!this.button) return;

        this.bindEvents();
    },

    bindEvents() {
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());
    },

    toggleVisibility() {
        if (window.scrollY > 500) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Preload Critical Resources
// ===================================
window.addEventListener('load', () => {
    // Preload images
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
});

// ===================================
// Performance Optimization
// ===================================
// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
