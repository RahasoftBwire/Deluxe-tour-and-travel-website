// ===== GLOBAL VARIABLES =====
const API_URL = 'http://localhost:5000/api';
let currentUser = null;

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
if (heroSearch) {
    heroSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchQuery = heroSearch.value.trim();
            if (searchQuery) {
                window.location.href = `pages/tours.html?search=${encodeURIComponent(searchQuery)}`;
            }
        }
    });
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
