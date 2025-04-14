document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle --- //
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const menuIconOpen = mobileMenuToggle?.querySelector('.fa-bars');
    const menuIconClose = mobileMenuToggle?.querySelector('.fa-times');

    if (mobileMenuToggle && mainNav && menuIconOpen && menuIconClose) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('is-open');
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
            menuIconOpen.style.display = isOpen ? 'none' : 'block';
            menuIconClose.style.display = isOpen ? 'block' : 'none';
            document.body.style.overflow = isOpen ? 'hidden' : ''; // Prevent scrolling when menu open
        });

        // Close menu when a nav link is clicked (optional)
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-open')) {
                    mobileMenuToggle.click(); // Simulate click to close
                }
            });
        });
    }

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('is-sticky');
                // Optional: Hide header on scroll down, show on scroll up
                // if (window.scrollY > lastScrollY) {
                //     header.classList.add('hide-header');
                // } else {
                //     header.classList.remove('hide-header');
                // }
            } else {
                header.classList.remove('is-sticky');
                // header.classList.remove('hide-header');
            }
            lastScrollY = window.scrollY;
        });
    }

    // --- Back to Top Button --- //
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Scroll Animations (using Intersection Observer) --- //
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, parseInt(delay));
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers: just show the elements
        animatedElements.forEach(el => el.classList.add('is-visible'));
    }

    // --- Dynamic Copyright Year --- //
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Active Nav Link Highlighting --- //
    // (More robust highlighting based on current page URL)
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav .nav-link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Check if the link's href matches the end of the current path
        if (linkHref && currentLocation.endsWith(linkHref)) {
            // Remove active class from all links first
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to the matching link
            link.classList.add('active');
        } else if (currentLocation === '/' || currentLocation.endsWith('index.html')) {
            // Special case for the homepage
            if (linkHref === 'index.html') {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});
