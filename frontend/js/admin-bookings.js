// Admin Bookings Dashboard JavaScript

const API_URL = 'http://localhost:5000/api';
let currentPage = 1;
let bookingsData = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadBookings();
});

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/bookings/stats/overview`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) throw new Error('Failed to load stats');

        const result = await response.json();
        const stats = result.data;

        document.getElementById('totalBookings').textContent = stats.totalBookings || 0;
        document.getElementById('pendingBookings').textContent = stats.pendingBookings || 0;
        document.getElementById('confirmedBookings').textContent = stats.confirmedBookings || 0;
        document.getElementById('totalRevenue').textContent = 
            `$${(stats.revenue?.totalRevenue || 0).toFixed(2)}`;

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load bookings
async function loadBookings(page = 1) {
    try {
        // Get filter values
        const status = document.getElementById('filterStatus').value;
        const paymentStatus = document.getElementById('filterPayment').value;
        const search = document.getElementById('filterSearch').value;

        // Build query string
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (paymentStatus) params.append('paymentStatus', paymentStatus);
        if (search) params.append('search', search);
        params.append('page', page);
        params.append('limit', 20);

        const response = await fetch(`${API_URL}/bookings?${params}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) throw new Error('Failed to load bookings');

        const result = await response.json();
        bookingsData = result.data;
        currentPage = page;

        displayBookings(bookingsData);
        displayPagination(result.currentPage, result.pages);

    } catch (error) {
        console.error('Error loading bookings:', error);
        displayError('Failed to load bookings. Using sample data for demonstration.');
        loadSampleData();
    }
}

// Display bookings in table
function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsTableBody');

    if (!bookings || bookings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="no-bookings">
                    <i class="fas fa-inbox"></i>
                    <p>No bookings found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = bookings.map(booking => {
        const tourTitle = booking.tourDetails?.title || booking.tour?.title || 'Tour Package';
        const customerName = booking.contactInfo?.name || booking.user?.name || 'N/A';
        const customerEmail = booking.contactInfo?.email || booking.user?.email || '';
        const totalTravelers = booking.totalTravelers || 
            ((booking.numberOfTravelers?.adults || 0) + 
             (booking.numberOfTravelers?.children || 0) + 
             (booking.numberOfTravelers?.infants || 0));
        
        return `
            <tr>
                <td><strong>${booking.bookingReference}</strong></td>
                <td>
                    <div>${customerName}</div>
                    <small style="color: #999;">${customerEmail}</small>
                </td>
                <td>${tourTitle}</td>
                <td>${formatDate(booking.bookingDate)}</td>
                <td>${totalTravelers}</td>
                <td><strong>$${(booking.pricing?.totalPrice || 0).toFixed(2)}</strong></td>
                <td>
                    <span class="status-badge ${booking.status}">
                        ${booking.status}
                    </span>
                </td>
                <td>
                    <span class="payment-badge ${booking.payment?.status}">
                        ${booking.payment?.status || 'pending'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewBooking('${booking._id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" onclick="updateStatus('${booking._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteBooking('${booking._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Display pagination
function displayPagination(currentPage, totalPages) {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';
    
    // Previous button
    if (currentPage > 1) {
        html += `<button onclick="loadBookings(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" 
                     onclick="loadBookings(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<button disabled>...</button>`;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        html += `<button onclick="loadBookings(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }

    pagination.innerHTML = html;
}

// View booking details
async function viewBooking(id) {
    try {
        const response = await fetch(`${API_URL}/bookings/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) throw new Error('Failed to load booking details');

        const result = await response.json();
        const booking = result.data;

        displayBookingDetails(booking);
        document.getElementById('bookingModal').classList.add('active');

    } catch (error) {
        console.error('Error loading booking details:', error);
        // Show sample data for demo
        const sampleBooking = bookingsData.find(b => b._id === id);
        if (sampleBooking) {
            displayBookingDetails(sampleBooking);
            document.getElementById('bookingModal').classList.add('active');
        }
    }
}

// Display booking details in modal
function displayBookingDetails(booking) {
    const tourTitle = booking.tourDetails?.title || booking.tour?.title || 'Tour Package';
    const customerName = booking.contactInfo?.name || booking.user?.name || 'N/A';
    const customerEmail = booking.contactInfo?.email || booking.user?.email || 'N/A';
    const customerPhone = booking.contactInfo?.phone || booking.user?.phone || 'N/A';
    
    const html = `
        <div class="detail-section">
            <h3>Booking Information</h3>
            <div class="detail-row">
                <span class="detail-label">Reference:</span>
                <span class="detail-value"><strong>${booking.bookingReference}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">
                    <span class="status-badge ${booking.status}">${booking.status}</span>
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Booking Date:</span>
                <span class="detail-value">${formatDate(booking.bookingDate)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Created:</span>
                <span class="detail-value">${formatDateTime(booking.createdAt)}</span>
            </div>
        </div>

        <div class="detail-section">
            <h3>Tour Details</h3>
            <div class="detail-row">
                <span class="detail-label">Tour:</span>
                <span class="detail-value">${tourTitle}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Destination:</span>
                <span class="detail-value">${booking.tourDetails?.destination || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${booking.tourDetails?.duration || 'N/A'}</span>
            </div>
        </div>

        <div class="detail-section">
            <h3>Customer Information</h3>
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${customerName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${customerEmail}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${customerPhone}</span>
            </div>
            ${booking.contactInfo?.address ? `
            <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${booking.contactInfo.address}</span>
            </div>
            ` : ''}
        </div>

        <div class="detail-section">
            <h3>Travelers</h3>
            <div class="detail-row">
                <span class="detail-label">Adults:</span>
                <span class="detail-value">${booking.numberOfTravelers?.adults || 0}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Children:</span>
                <span class="detail-value">${booking.numberOfTravelers?.children || 0}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Infants:</span>
                <span class="detail-value">${booking.numberOfTravelers?.infants || 0}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total:</span>
                <span class="detail-value"><strong>${booking.totalTravelers || 0}</strong></span>
            </div>
        </div>

        <div class="detail-section">
            <h3>Payment Information</h3>
            <div class="detail-row">
                <span class="detail-label">Method:</span>
                <span class="detail-value">${booking.payment?.method || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">
                    <span class="payment-badge ${booking.payment?.status}">
                        ${booking.payment?.status || 'pending'}
                    </span>
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Base Price:</span>
                <span class="detail-value">$${(booking.pricing?.basePrice || 0).toFixed(2)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Tax:</span>
                <span class="detail-value">$${(booking.pricing?.tax || 0).toFixed(2)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value"><strong style="font-size: 1.2rem; color: #e97730;">$${(booking.pricing?.totalPrice || 0).toFixed(2)}</strong></span>
            </div>
        </div>

        ${booking.specialRequests ? `
        <div class="detail-section">
            <h3>Special Requests</h3>
            <p style="color: #666;">${booking.specialRequests}</p>
        </div>
        ` : ''}

        <div style="display: flex; gap: 10px; margin-top: 25px;">
            <button class="btn-filter" onclick="updateBookingStatus('${booking._id}', 'confirmed')" 
                    style="flex: 1; ${booking.status === 'confirmed' ? 'opacity: 0.5;' : ''}">
                <i class="fas fa-check"></i> Confirm
            </button>
            <button class="btn-filter" onclick="updateBookingStatus('${booking._id}', 'completed')" 
                    style="flex: 1; background: #4caf50; ${booking.status === 'completed' ? 'opacity: 0.5;' : ''}">
                <i class="fas fa-check-circle"></i> Complete
            </button>
            <button class="btn-filter" onclick="updateBookingStatus('${booking._id}', 'cancelled')" 
                    style="flex: 1; background: #e74c3c; ${booking.status === 'cancelled' ? 'opacity: 0.5;' : ''}">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;

    document.getElementById('bookingDetails').innerHTML = html;
}

// Update booking status
async function updateBookingStatus(id, newStatus) {
    if (!confirm(`Are you sure you want to change status to "${newStatus}"?`)) return;

    try {
        const response = await fetch(`${API_URL}/bookings/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Failed to update status');

        alert('Status updated successfully!');
        closeModal();
        loadBookings(currentPage);
        loadStats();

    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status. For demo purposes, the change will be reflected locally.');
        // Update locally for demo
        const booking = bookingsData.find(b => b._id === id);
        if (booking) {
            booking.status = newStatus;
            displayBookings(bookingsData);
        }
        closeModal();
    }
}

// Update status (quick action)
function updateStatus(id) {
    const newStatus = prompt('Enter new status (pending, confirmed, completed, cancelled):');
    if (newStatus) {
        updateBookingStatus(id, newStatus.toLowerCase());
    }
}

// Delete booking
async function deleteBooking(id) {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;

    try {
        const response = await fetch(`${API_URL}/bookings/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) throw new Error('Failed to delete booking');

        alert('Booking deleted successfully!');
        loadBookings(currentPage);
        loadStats();

    } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Error deleting booking. For demo purposes, the booking will be removed locally.');
        // Remove locally for demo
        bookingsData = bookingsData.filter(b => b._id !== id);
        displayBookings(bookingsData);
    }
}

// Close modal
function closeModal() {
    document.getElementById('bookingModal').classList.remove('active');
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Format date and time
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Display error
function displayError(message) {
    console.error(message);
}

// Load sample data for demonstration
function loadSampleData() {
    bookingsData = [
        {
            _id: '1',
            bookingReference: 'DLX-ABC123',
            tourDetails: {
                title: 'Masai Mara Safari',
                destination: 'Kenya',
                duration: '6 days',
                price: 1800
            },
            contactInfo: {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+254700000001'
            },
            bookingDate: new Date('2025-11-15'),
            numberOfTravelers: { adults: 2, children: 1, infants: 0 },
            totalTravelers: 3,
            pricing: { basePrice: 1800, tax: 864, totalPrice: 6264 },
            payment: { method: 'mpesa', status: 'completed' },
            status: 'confirmed',
            createdAt: new Date()
        },
        {
            _id: '2',
            bookingReference: 'DLX-XYZ456',
            tourDetails: {
                title: 'Maldives Beach Paradise',
                destination: 'Maldives',
                duration: '7 days',
                price: 1200
            },
            contactInfo: {
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+254700000002'
            },
            bookingDate: new Date('2025-12-20'),
            numberOfTravelers: { adults: 2, children: 0, infants: 0 },
            totalTravelers: 2,
            pricing: { basePrice: 1200, tax: 556.8, totalPrice: 2956.8 },
            payment: { method: 'card', status: 'pending' },
            status: 'pending',
            createdAt: new Date()
        },
        {
            _id: '3',
            bookingReference: 'DLX-PQR789',
            tourDetails: {
                title: 'Dubai Luxury Experience',
                destination: 'UAE',
                duration: '5 days',
                price: 1500
            },
            contactInfo: {
                name: 'Michael Johnson',
                email: 'michael@example.com',
                phone: '+254700000003'
            },
            bookingDate: new Date('2025-10-25'),
            numberOfTravelers: { adults: 1, children: 0, infants: 0 },
            totalTravelers: 1,
            pricing: { basePrice: 1500, tax: 240, totalPrice: 1740 },
            payment: { method: 'paypal', status: 'completed' },
            status: 'completed',
            createdAt: new Date()
        }
    ];

    displayBookings(bookingsData);
    
    // Update stats with sample data
    document.getElementById('totalBookings').textContent = '3';
    document.getElementById('pendingBookings').textContent = '1';
    document.getElementById('confirmedBookings').textContent = '1';
    document.getElementById('totalRevenue').textContent = '$10,960.80';
}

// Close modal when clicking outside
document.getElementById('bookingModal').addEventListener('click', (e) => {
    if (e.target.id === 'bookingModal') {
        closeModal();
    }
});
