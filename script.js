// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Auto-change navigation links with smooth transitions
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPage = window.location.pathname.split('/').pop() || 'home.html';
    
    // Remove active class from all nav links
    function removeActiveClass() {
        navLinks.forEach(link => link.classList.remove('active'));
    }
    
    // Add active class to current page
    function setActiveNav() {
        removeActiveClass();
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'home.html')) {
                link.classList.add('active');
            }
        });
    }
    
    // Set initial active nav
    setActiveNav();
    
    // Enhanced click effects for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add ripple effect
            createRippleEffect(this, e);
            
            // Handle internal navigation
            const href = this.getAttribute('href');
            if (href && href.includes('.html')) {
                e.preventDefault();
                // Add loading animation
                showPageTransition(href);
            }
        });
        
        // Add hover effects
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.backgroundColor = 'white';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-card, .skill-card, .project-card, .contact-card');
    animateElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });

    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.innerHTML += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelector('input[placeholder="Subject"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // Skill cards hover effect
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Project cards click effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectLink = this.querySelector('.project-overlay a');
            if (projectLink) {
                // Simulate project view
                showNotification('Opening project...', 'info');
            }
        });
    });

    // Social links hover effect
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Mobile menu close on link click
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    // Loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // Counter animation for skills (if you want to add numbers)
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter when element is visible
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterObserver.observe(counter);
    });

    // Preloader (optional)
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        }
    });

    // Add focus styles for accessibility
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
            this.style.outlineOffset = '0';
        });
    });

    // Performance optimization: Throttle scroll events
    let ticking = false;
    function updateOnScroll() {
        // Scroll-based animations go here
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);

    // Auto-rotate through navigation items (optional feature)
    let autoNavIndex = 0;
    const navItems = ['home.html', 'about.html', 'skills.html', 'projects.html', 'contact.html'];
    
    function autoNavigate() {
        if (navItems[autoNavIndex]) {
            const currentNav = document.querySelector(`[href="${navItems[autoNavIndex]}"]`);
            if (currentNav) {
                createRippleEffect(currentNav, { clientX: 100, clientY: 50 });
                setTimeout(() => {
                    window.location.href = navItems[autoNavIndex];
                }, 500);
            }
            autoNavIndex = (autoNavIndex + 1) % navItems.length;
        }
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    navigateToPage('home.html');
                    break;
                case '2':
                    e.preventDefault();
                    navigateToPage('about.html');
                    break;
                case '3':
                    e.preventDefault();
                    navigateToPage('skills.html');
                    break;
                case '4':
                    e.preventDefault();
                    navigateToPage('projects.html');
                    break;
                case '5':
                    e.preventDefault();
                    navigateToPage('contact.html');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    navigateToPreviousPage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    navigateToNextPage();
                    break;
            }
        }
    });

    console.log('Portfolio website loaded successfully! 🚀');
});

// Ripple effect function
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Page transition function
function showPageTransition(targetPage) {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.innerHTML = `
        <div class="transition-content">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        window.location.href = targetPage;
    }, 800);
}

// Navigate to specific page
function navigateToPage(page) {
    if (window.location.pathname.split('/').pop() !== page) {
        showPageTransition(page);
    }
}

// Navigate to previous page
function navigateToPreviousPage() {
    const pages = ['home.html', 'about.html', 'skills.html', 'projects.html', 'contact.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const currentIndex = pages.indexOf(currentPage);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : pages.length - 1;
    navigateToPage(pages[previousIndex]);
}

// Navigate to next page
function navigateToNextPage() {
    const pages = ['home.html', 'about.html', 'skills.html', 'projects.html', 'contact.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const currentIndex = pages.indexOf(currentPage);
    const nextIndex = currentIndex < pages.length - 1 ? currentIndex + 1 : 0;
    navigateToPage(pages[nextIndex]);
}

// Enhanced click effects for all buttons and links
function enhanceClickEffects() {
    const clickableElements = document.querySelectorAll('button, .btn, .project-card, .skill-card, .about-card, .contact-card');
    
    clickableElements.forEach(element => {
        element.addEventListener('click', function(e) {
            createRippleEffect(this, e);
            
            // Add scale effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
        
        // Enhanced hover effects
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// Initialize enhanced click effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    enhanceClickEffects();
});

// Additional utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
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

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debounce, createRippleEffect, navigateToPage };
}
