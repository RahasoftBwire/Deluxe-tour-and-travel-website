// ===== GLOBAL VARIABLES =====
const API_URL = 'http://localhost:5000/api';
let currentUser = null;

// ===== STICKY NAVBAR ENHANCEMENT =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ===== HERO VIDEO INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        console.log('Hero video element found');
        
        // Set video properties
        heroVideo.muted = true;
        heroVideo.loop = true;
        heroVideo.autoplay = true;
        heroVideo.playsInline = true;
        
        // Force video to load and play
        heroVideo.load();
        
        setTimeout(() => {
            heroVideo.play().then(() => {
                console.log('Video is playing!');
            }).catch(err => {
                console.error('Video autoplay failed:', err);
                // Try again on any user interaction
                document.body.addEventListener('click', () => {
                    heroVideo.play().then(() => {
                        console.log('Video playing after click');
                    });
                }, { once: true });
            });
        }, 100);
        
        // Monitor video state
        heroVideo.addEventListener('loadeddata', () => {
            console.log('Video data loaded');
        });
        
        heroVideo.addEventListener('playing', () => {
            console.log('Video is actually playing now');
        });
        
        heroVideo.addEventListener('error', (e) => {
            console.error('Video error:', heroVideo.error);
        });
    } else {
        console.error('Hero video element not found');
    }
});

// ===== DOM ELEMENTS =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// ===== NAVIGATION =====
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
        }
    }
});

// ===== CHECK USER AUTHENTICATION =====
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        currentUser = JSON.parse(user);
        updateNavForLoggedInUser();
        return true;
    }
    return false;
}

function updateNavForLoggedInUser() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu && currentUser) {
        const loginBtn = navMenu.querySelector('.btn-login');
        const registerBtn = navMenu.querySelector('.btn-register');
        
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        
        const userMenu = document.createElement('li');
        userMenu.innerHTML = `
            <div class="user-menu">
                <span>Welcome, ${currentUser.name}</span>
                <a href="pages/profile.html">Profile</a>
                <a href="#" onclick="logout()">Logout</a>
            </div>
        `;
        navMenu.appendChild(userMenu);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

// ===== HERO SEARCH =====
const heroSearch = document.getElementById('heroSearch');
const searchButton = document.querySelector('.btn-search');

// Function to perform search
function performSearch() {
    const searchQuery = heroSearch.value.trim();
    if (searchQuery) {
        window.location.href = `pages/tours.html?search=${encodeURIComponent(searchQuery)}`;
    } else {
        // If empty, just go to tours page
        window.location.href = 'pages/tours.html';
    }
}

// Search on Enter key
if (heroSearch) {
    heroSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Search on button click
if (searchButton) {
    searchButton.addEventListener('click', performSearch);
}

// ===== LOAD FEATURED TOURS =====
async function loadFeaturedTours() {
    const toursContainer = document.getElementById('featuredTours');
    if (!toursContainer) return;

    try {
        const response = await fetch(`${API_URL}/tours?featured=true&limit=6`);
        if (!response.ok) throw new Error('Failed to fetch tours');
        
        const data = await response.json();
        
        if (data.success && data.tours && data.tours.length > 0) {
            toursContainer.innerHTML = data.tours.map(tour => `
                <div class="tour-card">
                    <div class="tour-image">
                        <img src="${tour.image || 'https://via.placeholder.com/400x300?text=Tour+Image'}" alt="${tour.title}">
                        ${tour.badge ? `<span class="tour-badge">${tour.badge}</span>` : ''}
                    </div>
                    <div class="tour-details">
                        <h3>${tour.title}</h3>
                        <p class="tour-location"><i class="fas fa-map-marker-alt"></i> ${tour.location}</p>
                        <p class="tour-description">${tour.description}</p>
                        <div class="tour-footer">
                            <span class="tour-price">From $${tour.price}</span>
                            <a href="pages/tour-detail.html?id=${tour._id}" class="btn-view">View Details</a>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading tours:', error);
        // Keep the static tours if API fails
    }
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// ===== FORM VALIDATION =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Load featured tours if on homepage
    if (document.getElementById('featuredTours')) {
        loadFeaturedTours();
    }
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
