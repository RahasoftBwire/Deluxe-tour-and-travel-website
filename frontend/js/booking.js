// Booking.js - Handle tour booking functionality

let currentStep = 1;
let bookingData = {
    tourId: null,
    tourDetails: null,
    travelers: {
        adults: 1,
        children: 0,
        infants: 0
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set minimum date to tomorrow
    const dateInput = document.querySelector('input[name="bookingDate"]');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.setDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    // Get tour details from URL or localStorage
    loadTourDetails();
    
    // Update price display
    updatePriceSummary();

    // Handle form submission
    document.getElementById('bookingForm').addEventListener('submit', handleSubmit);
});

// Load tour details from URL parameters or localStorage
function loadTourDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');
    const tourData = urlParams.get('tour');

    if (tourData) {
        // Tour data passed via URL
        try {
            bookingData.tourDetails = JSON.parse(decodeURIComponent(tourData));
            displayTourSummary();
        } catch (error) {
            console.error('Error parsing tour data:', error);
        }
    } else if (tourId) {
        // Tour ID provided, fetch from localStorage or API
        const storedTour = localStorage.getItem(`selectedTour_${tourId}`);
        if (storedTour) {
            bookingData.tourDetails = JSON.parse(storedTour);
            displayTourSummary();
        }
    } else {
        // No tour info, show default
        bookingData.tourDetails = {
            title: 'Custom Tour Package',
            destination: 'Multiple Destinations',
            duration: 'Flexible',
            price: 1500,
            image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg'
        };
        displayTourSummary();
    }
}

// Display tour summary
function displayTourSummary() {
    const tour = bookingData.tourDetails;
    const summaryHTML = `
        <img src="${tour.image || tour.heroImage || 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg'}" 
             alt="${tour.title}" 
             class="tour-image"
             onerror="this.src='https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg'">
        <h3 class="tour-title">${tour.title}</h3>
        <div class="tour-detail">
            <i class="fas fa-map-marker-alt"></i>
            <span>${tour.destination}</span>
        </div>
        <div class="tour-detail">
            <i class="fas fa-clock"></i>
            <span>${tour.duration}</span>
        </div>
        ${tour.category ? `
        <div class="tour-detail">
            <i class="fas fa-tag"></i>
            <span>${tour.category}</span>
        </div>
        ` : ''}
    `;
    
    document.getElementById('tourInfoSummary').innerHTML = summaryHTML;
}

// Update traveler counter
function updateCounter(type, change) {
    const current = bookingData.travelers[type];
    let newValue = current + change;

    // Validation
    if (type === 'adults' && newValue < 1) return;
    if (newValue < 0) return;
    if (newValue > 20) return;

    bookingData.travelers[type] = newValue;
    document.getElementById(`${type}Count`).textContent = newValue;
    
    updatePriceSummary();
}

// Update price summary
function updatePriceSummary() {
    const tour = bookingData.tourDetails;
    if (!tour) return;

    const basePrice = tour.price || 1500;
    const adults = bookingData.travelers.adults;
    const children = bookingData.travelers.children;
    const infants = bookingData.travelers.infants;

    // Calculate prices
    const adultPrice = adults * basePrice;
    const childPrice = children * (basePrice * 0.7); // 30% discount
    const infantPrice = infants * (basePrice * 0.5); // 50% discount
    
    const subtotal = adultPrice + childPrice + infantPrice;
    const tax = subtotal * 0.16; // 16% VAT
    const total = subtotal + tax;

    // Update display
    const totalTravelers = adults + children + infants;
    document.getElementById('totalTravelersDisplay').textContent = totalTravelers;
    document.getElementById('basePriceDisplay').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxDisplay').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalPriceDisplay').textContent = `$${total.toFixed(2)}`;

    // Store pricing
    bookingData.pricing = {
        basePrice: basePrice,
        subtotal: subtotal,
        tax: tax,
        total: total
    };
}

// Navigate to next step
function nextStep() {
    if (!validateStep(currentStep)) return;

    // Mark current step as completed
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('completed');
    
    // Hide current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Move to next step
    currentStep++;
    
    // Show next step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');

    // If on review step, populate review section
    if (currentStep === 4) {
        populateReviewSection();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigate to previous step
function prevStep() {
    // Hide current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Move to previous step
    currentStep--;
    
    // Show previous step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validate current step
function validateStep(step) {
    const formStep = document.querySelector(`.form-step[data-step="${step}"]`);
    const requiredFields = formStep.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            alert(`Please fill in the ${field.name || 'required'} field`);
            field.focus();
            return false;
        }
    }

    return true;
}

// Populate review section
function populateReviewSection() {
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);
    const tour = bookingData.tourDetails;
    
    const reviewHTML = `
        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h4 style="color: #333; margin-bottom: 15px;">Tour Details</h4>
            <p><strong>Tour:</strong> ${tour.title}</p>
            <p><strong>Date:</strong> ${formData.get('bookingDate')}</p>
            <p><strong>Travelers:</strong> ${bookingData.travelers.adults} Adults, ${bookingData.travelers.children} Children, ${bookingData.travelers.infants} Infants</p>
            ${formData.get('specialRequests') ? `<p><strong>Special Requests:</strong> ${formData.get('specialRequests')}</p>` : ''}
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h4 style="color: #333; margin-bottom: 15px;">Contact Information</h4>
            <p><strong>Name:</strong> ${formData.get('contactName')}</p>
            <p><strong>Email:</strong> ${formData.get('contactEmail')}</p>
            <p><strong>Phone:</strong> ${formData.get('contactPhone')}</p>
            ${formData.get('contactAddress') ? `<p><strong>Address:</strong> ${formData.get('contactAddress')}</p>` : ''}
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
            <h4 style="color: #333; margin-bottom: 15px;">Payment</h4>
            <p><strong>Method:</strong> ${getPaymentMethodName(formData.get('paymentMethod'))}</p>
            <p><strong>Total Amount:</strong> <span style="color: #e97730; font-size: 1.3rem; font-weight: 700;">$${bookingData.pricing.total.toFixed(2)}</span></p>
        </div>
    `;
    
    document.getElementById('reviewSection').innerHTML = reviewHTML;
}

// Get payment method display name
function getPaymentMethodName(method) {
    const methods = {
        'mpesa': 'M-Pesa',
        'card': 'Credit/Debit Card',
        'bank': 'Bank Transfer',
        'paypal': 'PayPal'
    };
    return methods[method] || method;
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    // Check terms acceptance
    const termsAccepted = document.querySelector('input[name="termsAccepted"]').checked;
    if (!termsAccepted) {
        alert('Please accept the Terms & Conditions to continue');
        return;
    }

    // Prepare booking data
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);
    
    const bookingPayload = {
        tourId: bookingData.tourId,
        tourDetails: bookingData.tourDetails,
        bookingDate: formData.get('bookingDate'),
        numberOfTravelers: {
            adults: bookingData.travelers.adults,
            children: bookingData.travelers.children,
            infants: bookingData.travelers.infants
        },
        contactInfo: {
            name: formData.get('contactName'),
            email: formData.get('contactEmail'),
            phone: formData.get('contactPhone'),
            address: formData.get('contactAddress') || '',
            emergencyContact: {
                name: formData.get('emergencyName') || '',
                phone: formData.get('emergencyPhone') || ''
            }
        },
        paymentMethod: formData.get('paymentMethod'),
        specialRequests: formData.get('specialRequests') || ''
    };

    // Show loading
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    try {
        // Submit booking
        const response = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingPayload)
        });

        const result = await response.json();

        if (result.success) {
            // Show success message
            document.getElementById('bookingForm').style.display = 'none';
            document.querySelector('.step-indicator').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('bookingRefDisplay').textContent = result.data.bookingReference;
            document.getElementById('confirmEmail').textContent = bookingPayload.contactInfo.email;

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            throw new Error(result.message || 'Booking failed');
        }

    } catch (error) {
        console.error('Booking error:', error);
        alert('Error creating booking: ' + error.message + '\n\nPlease contact us at +254 725 442 618 for assistance.');
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Make functions global
window.updateCounter = updateCounter;
window.nextStep = nextStep;
window.prevStep = prevStep;
