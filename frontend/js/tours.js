// ===== TOURS PAGE FUNCTIONALITY =====

// Filter and Sort Functions
let allTours = [];
let filteredTours = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTours();
    setupEventListeners();
});

function initializeTours() {
    // Get all tour cards
    allTours = Array.from(document.querySelectorAll('.tour-card'));
    filteredTours = [...allTours];
    updateResultsCount();
}

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchTours');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }

    // Apply Filters Button
    const applyBtn = document.getElementById('applyFilters');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }

    // Clear Filters Button
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }

    // Sort
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortTours);
    }

    // View Toggle
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            toggleView(btn.dataset.view);
        });
    });

    // Filter selects - apply on change
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchTours').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const destination = document.getElementById('destinationFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    const duration = document.getElementById('durationFilter').value;

    filteredTours = allTours.filter(tour => {
        // Search filter
        const tourText = tour.textContent.toLowerCase();
        if (searchTerm && !tourText.includes(searchTerm)) {
            return false;
        }

        // Category filter
        if (category && tour.dataset.category !== category) {
            return false;
        }

        // Destination filter
        if (destination && tour.dataset.destination !== destination) {
            return false;
        }

        // Price filter
        if (priceRange) {
            const price = parseInt(tour.dataset.price);
            if (priceRange === '0-500' && price >= 500) return false;
            if (priceRange === '500-1000' && (price < 500 || price >= 1000)) return false;
            if (priceRange === '1000-2000' && (price < 1000 || price >= 2000)) return false;
            if (priceRange === '2000+' && price < 2000) return false;
        }

        // Duration filter (would need to add data-duration to cards)
        // Simplified for now

        return true;
    });

    displayTours();
    updateResultsCount();
}

function displayTours() {
    // Hide all tours first
    allTours.forEach(tour => {
        tour.style.display = 'none';
    });

    // Show filtered tours
    filteredTours.forEach(tour => {
        tour.style.display = 'block';
    });

    // Show "no results" message if needed
    if (filteredTours.length === 0) {
        showNoResults();
    } else {
        hideNoResults();
    }
}

function sortTours() {
    const sortBy = document.getElementById('sortBy').value;
    
    filteredTours.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'popular':
                // Could use data-popularity attribute
                return 0;
            case 'duration':
                // Would need data-duration attribute
                return 0;
            case 'rating':
                // Would need data-rating attribute
                return 0;
            default:
                return 0;
        }
    });

    // Reorder DOM elements
    const grid = document.getElementById('toursGrid');
    filteredTours.forEach(tour => {
        grid.appendChild(tour);
    });
}

function clearFilters() {
    // Reset all filter inputs
    document.getElementById('searchTours').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('destinationFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('durationFilter').value = '';

    // Show all tours
    filteredTours = [...allTours];
    displayTours();
    updateResultsCount();
}

function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        const count = filteredTours.length;
        countElement.textContent = `Showing ${count} tour${count !== 1 ? 's' : ''}`;
    }
}

function toggleView(view) {
    const grid = document.getElementById('toursGrid');
    if (view === 'list') {
        grid.style.gridTemplateColumns = '1fr';
    } else {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
    }
}

function showNoResults() {
    const grid = document.getElementById('toursGrid');
    if (!document.querySelector('.no-results')) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
                <h3>No tours found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onclick="clearFilters()" class="btn-primary" style="margin-top: 20px;">Clear Filters</button>
            </div>
        `;
        grid.appendChild(noResults);
    }
}

function hideNoResults() {
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        noResults.remove();
    }
}

// Utility: Debounce function
function debounce(func, wait) {
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

// Pagination (simplified - would need backend integration for real pagination)
document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.disabled) return;
        
        document.querySelectorAll('.page-btn').forEach(b => {
            if (b.textContent.match(/\d/)) {
                b.classList.remove('active');
            }
        });
        
        if (this.textContent.match(/\d/)) {
            this.classList.add('active');
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
