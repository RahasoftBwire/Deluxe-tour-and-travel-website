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
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Set active link based on current page
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/')) {
            link.classList.add('active');
        }
    });
}

// Load header and footer on page load
document.addEventListener('DOMContentLoaded', () => {
    // Only load if containers exist
    if (document.getElementById('header')) {
        loadComponent('header', '/includes/header.html');
    }
    if (document.getElementById('footer')) {
        loadComponent('footer', '/includes/footer.html');
    }
});
