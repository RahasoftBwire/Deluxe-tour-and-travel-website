// Load Header and Footer
function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            
            // Reinitialize hamburger menu after header loads
            if (elementId === 'header') {
                initializeNavigation();
            }
        })
        .catch(error => console.error('Error loading component:', error));
}

// Initialize Navigation
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (hamburger && navMenu) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Prevent menu close when clicking inside menu
        navMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Set active link based on current page
    const currentPage = window.location.pathname;
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage.includes(href) && href !== '/' && href !== '/index.html')) {
            link.classList.add('active');
        }
    });
    
    // Add scroll behavior for navbar
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Load header and footer on page load
document.addEventListener('DOMContentLoaded', () => {
    // Determine if we're in a subdirectory
    const isSubdirectory = window.location.pathname.includes('/pages/');
    const basePath = isSubdirectory ? '../includes/' : '/includes/';
    
    // Only load if containers exist
    if (document.getElementById('header')) {
        loadComponent('header', basePath + 'header.html');
    }
    if (document.getElementById('footer')) {
        loadComponent('footer', basePath + 'footer.html');
    }
    
    // Load cookie consent banner
    if (document.getElementById('cookie-consent')) {
        loadComponent('cookie-consent', basePath + 'cookie-consent.html');
    }
});
