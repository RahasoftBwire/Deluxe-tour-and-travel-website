// Tour Detail Page JavaScript

// Sample tour data (in production, this would come from your API)
const toursData = {
    'maldives-beach-paradise': {
        title: 'Maldives Beach Paradise',
        category: 'Beach Holiday',
        destination: 'Maldives',
        duration: '7 Days / 6 Nights',
        price: '$1,200',
        rating: 4.8,
        heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920&h=1080&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1540202404-1b927e27fa8b?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&h=400&fit=crop'
        ],
        overview: 'Experience the ultimate tropical getaway in the Maldives! This 7-day package includes stays in luxurious overwater villas, pristine white sand beaches, crystal-clear turquoise waters, and world-class snorkeling and diving opportunities. Perfect for honeymooners, families, and anyone seeking paradise.',
        highlights: [
            'Stay in luxurious overwater villas with private pools',
            'Daily breakfast and dinner at award-winning restaurants',
            'Complimentary snorkeling equipment and water sports',
            'Sunset dolphin watching cruise',
            'Spa treatment session included',
            'Airport transfers by speedboat or seaplane',
            'Professional photography session on the beach',
            'Private beach dinner under the stars'
        ],
        itinerary: [
            {
                day: 1,
                title: 'Arrival in Paradise',
                description: 'Arrive at Malé International Airport. Meet and greet by our representative. Transfer to your resort by speedboat or seaplane. Check-in to your overwater villa. Evening welcome dinner at the resort.'
            },
            {
                day: 2,
                title: 'Beach & Water Sports',
                description: 'Breakfast at the villa. Morning snorkeling session at nearby coral reefs. Lunch at beach restaurant. Afternoon kayaking or paddle boarding. Sunset cocktails at the beach bar. Dinner at your choice of resort restaurants.'
            },
            {
                day: 3,
                title: 'Island Hopping',
                description: 'Full-day island hopping excursion. Visit local islands and experience Maldivian culture. Picnic lunch on a private sandbank. Swimming and snorkeling at multiple locations. Return to resort in the evening. Dinner at the resort.'
            },
            {
                day: 4,
                title: 'Spa & Relaxation',
                description: 'Leisure morning at the resort. Spa treatment session (massage and facial). Lunch by the pool. Afternoon at leisure - enjoy resort facilities. Sunset dolphin watching cruise. Romantic private beach dinner.'
            },
            {
                day: 5,
                title: 'Diving Adventure',
                description: 'Optional scuba diving excursion (additional cost). Discover vibrant marine life and coral formations. Lunch at the resort. Afternoon photography session on the beach. Evening entertainment and dinner at the resort.'
            },
            {
                day: 6,
                title: 'Free Day',
                description: 'Day at leisure to enjoy resort facilities. Optional activities: fishing trip, jet skiing, or parasailing. Spa time and pool relaxation. Farewell dinner with live music and cultural performance.'
            },
            {
                day: 7,
                title: 'Departure',
                description: 'Breakfast at the villa. Check-out from the resort. Transfer to Malé International Airport. Depart with unforgettable memories of paradise.'
            }
        ]
    },
    'dubai-luxury-experience': {
        title: 'Dubai Luxury Experience',
        category: 'City Tour',
        destination: 'Dubai, UAE',
        duration: '5 Days / 4 Nights',
        price: '$1,500',
        rating: 4.9,
        heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
        ],
        overview: 'Discover the dazzling city of Dubai with this luxury package! Experience world-class shopping, iconic landmarks like Burj Khalifa, luxury hotels, desert safaris, and authentic Arabian culture. Perfect blend of modern luxury and traditional charm.',
        highlights: [
            'Visit Burj Khalifa - world\'s tallest building',
            'Stay in 5-star luxury hotels',
            'Desert safari with BBQ dinner',
            'Dubai Marina cruise with dinner',
            'Shopping at Dubai Mall and Gold Souk',
            'Visit Palm Jumeirah and Atlantis',
            'Professional city tour guide',
            'Airport transfers in luxury vehicles'
        ],
        itinerary: [
            {
                day: 1,
                title: 'Welcome to Dubai',
                description: 'Arrival at Dubai International Airport. VIP meet and greet. Transfer to 5-star hotel. Check-in and relaxation. Evening Dubai Marina dinner cruise. Return to hotel.'
            },
            {
                day: 2,
                title: 'Modern Dubai Tour',
                description: 'Visit Burj Khalifa - 124th floor observation deck. Explore Dubai Mall and watch the fountain show. Lunch at Sky View restaurant. Visit Palm Jumeirah and Atlantis. Evening at leisure. Dinner at hotel or nearby restaurants.'
            },
            {
                day: 3,
                title: 'Desert Safari Adventure',
                description: 'Morning at leisure - hotel facilities or optional activities. Afternoon pick-up for desert safari. Dune bashing in 4x4 vehicles. Camel riding and sandboarding. Sunset photography. Traditional BBQ dinner with cultural show. Return to hotel.'
            },
            {
                day: 4,
                title: 'Old Dubai & Shopping',
                description: 'Visit Gold Souk and Spice Souk. Abra boat ride on Dubai Creek. Lunch at traditional Arabian restaurant. Visit Dubai Museum and Al Fahidi Historical District. Shopping at Dubai Mall. Burj Khalifa fountain show. Dinner and leisure time.'
            },
            {
                day: 5,
                title: 'Departure',
                description: 'Breakfast at hotel. Last-minute shopping or hotel relaxation. Check-out from hotel. Transfer to Dubai International Airport. Depart with luxury memories.'
            }
        ]
    },
    'masai-mara-safari': {
        title: 'Masai Mara Safari Adventure',
        category: 'Safari',
        destination: 'Kenya',
        duration: '6 Days / 5 Nights',
        price: '$1,800',
        rating: 5.0,
        heroImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&h=1080&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1535338788996-6d69e29f9e41?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=400&fit=crop'
        ],
        overview: 'Embark on an unforgettable wildlife safari in the world-famous Masai Mara National Reserve! Witness the Great Migration, see the Big Five, stay in luxury tented camps, and experience authentic Masai culture. This is Africa at its finest!',
        highlights: [
            'Game drives in Masai Mara National Reserve',
            'Witness the Big Five (lion, elephant, buffalo, leopard, rhino)',
            'Stay in luxury tented camps',
            'Visit authentic Masai villages',
            'Hot air balloon safari option',
            'Professional safari guide and 4x4 vehicles',
            'All meals and park fees included',
            'Sundowner drinks in the bush'
        ],
        itinerary: [
            {
                day: 1,
                title: 'Nairobi to Masai Mara',
                description: 'Pick-up from Nairobi hotel or airport. Scenic drive to Masai Mara (approx. 5-6 hours). Stop at Great Rift Valley viewpoint. Arrive at luxury tented camp. Lunch at the camp. Afternoon game drive. Dinner and overnight at camp.'
            },
            {
                day: 2,
                title: 'Full Day Game Drive',
                description: 'Early morning game drive at sunrise (best time for wildlife viewing). Return to camp for breakfast. Mid-morning game drive. Picnic lunch in the reserve. Continue afternoon game drive. Search for the Big Five. Sunset sundowner drinks. Return to camp for dinner.'
            },
            {
                day: 3,
                title: 'Masai Village & Game Drive',
                description: 'Optional hot air balloon safari at dawn (additional cost). Breakfast at camp. Visit authentic Masai village - experience traditional culture. Lunch at camp. Afternoon game drive focusing on big cats. Dinner and evening around the campfire.'
            },
            {
                day: 4,
                title: 'Mara River & Wildlife',
                description: 'Early morning game drive to Mara River. Witness hippos and crocodiles (possible wildebeest crossing in season). Breakfast picnic in the bush. Continue game drive exploring different areas. Lunch at camp. Late afternoon game drive. Farewell dinner with cultural entertainment.'
            },
            {
                day: 5,
                title: 'Lake Nakuru National Park',
                description: 'After breakfast, drive to Lake Nakuru National Park. Game drive en route. Check-in to lodge near the lake. Lunch. Afternoon game drive around Lake Nakuru - famous for flamingos and rhinos. Dinner and overnight at lodge.'
            },
            {
                day: 6,
                title: 'Return to Nairobi',
                description: 'Early morning game drive in Lake Nakuru. Breakfast at lodge. Check-out and drive back to Nairobi. Arrive Nairobi around 2 PM. Drop-off at hotel or airport. Safari ends with unforgettable memories.'
            }
        ]
    }
};

// Sample reviews data
const reviewsData = [
    {
        name: 'Sarah Johnson',
        rating: 5,
        date: 'September 2025',
        comment: 'Absolutely amazing experience! The accommodations were top-notch and the staff was incredibly helpful. Every detail was perfect. Highly recommend!',
        avatar: 'SJ'
    },
    {
        name: 'Michael Chen',
        rating: 5,
        date: 'August 2025',
        comment: 'Best vacation ever! The itinerary was well-planned, guides were knowledgeable, and we saw so much. Worth every penny!',
        avatar: 'MC'
    },
    {
        name: 'Emma Williams',
        rating: 4,
        date: 'July 2025',
        comment: 'Great tour with beautiful locations. Only minor issue was timing on day 3, but otherwise perfect. Would definitely book again!',
        avatar: 'EW'
    }
];

// Get tour ID from URL
function getTourId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 'maldives-beach-paradise';
}

// Load tour details
function loadTourDetails() {
    const tourId = getTourId();
    const tour = toursData[tourId];

    if (!tour) {
        document.getElementById('tourTitle').textContent = 'Tour Not Found';
        return;
    }

    // Update page title
    document.title = `${tour.title} - Deluxe Tour and Travel`;

    // Update hero section
    document.getElementById('tourHeroImage').src = tour.heroImage;
    document.getElementById('tourTitle').textContent = tour.title;
    document.getElementById('tourCategory').textContent = tour.category;
    document.getElementById('tourDuration').textContent = tour.duration;
    document.getElementById('tourDestination').textContent = tour.destination;
    document.getElementById('tourRating').textContent = tour.rating;

    // Update overview
    document.getElementById('tourOverview').textContent = tour.overview;

    // Update highlights
    const highlightsList = document.getElementById('tourHighlights');
    highlightsList.innerHTML = tour.highlights.map(highlight => 
        `<li><i class="fas fa-check"></i> ${highlight}</li>`
    ).join('');

    // Update itinerary
    const itineraryContainer = document.getElementById('tourItinerary');
    itineraryContainer.innerHTML = tour.itinerary.map(day => `
        <div class="itinerary-day">
            <div class="day-number">Day ${day.day}</div>
            <div class="day-content">
                <h3>${day.title}</h3>
                <p>${day.description}</p>
            </div>
        </div>
    `).join('');

    // Update gallery
    const galleryContainer = document.getElementById('tourGallery');
    galleryContainer.innerHTML = tour.gallery.map((img, index) => `
        <div class="gallery-item" onclick="openImageModal('${img}')">
            <img src="${img}" alt="${tour.title} - Image ${index + 1}" onerror="this.src='https://via.placeholder.com/600x400?text=Tour+Image'">
            <div class="gallery-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
        </div>
    `).join('');

    // Update pricing
    document.getElementById('tourPrice').textContent = tour.price;
    document.getElementById('sidebarDuration').textContent = tour.duration;

    // Load reviews
    loadReviews();

    // Load related tours
    loadRelatedTours(tourId);
}

// Load reviews
function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = reviewsData.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-avatar">${review.avatar}</div>
                <div class="reviewer-info">
                    <strong>${review.name}</strong>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <p class="review-text">${review.comment}</p>
        </div>
    `).join('');
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Load related tours
function loadRelatedTours(currentTourId) {
    const relatedToursContainer = document.getElementById('relatedTours');
    const allTourIds = Object.keys(toursData);
    const relatedTourIds = allTourIds.filter(id => id !== currentTourId).slice(0, 3);

    relatedToursContainer.innerHTML = relatedTourIds.map(tourId => {
        const tour = toursData[tourId];
        return `
            <div class="tour-card">
                <div class="tour-image">
                    <img src="${tour.heroImage}" alt="${tour.title}" onerror="this.src='https://via.placeholder.com/400x300?text=Tour+Image'">
                    <span class="tour-badge">${tour.category}</span>
                </div>
                <div class="tour-content">
                    <h3>${tour.title}</h3>
                    <div class="tour-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${tour.destination}</span>
                        <span><i class="fas fa-clock"></i> ${tour.duration}</span>
                    </div>
                    <div class="tour-footer">
                        <div class="tour-price">
                            <span class="from">From</span>
                            <span class="price">${tour.price}</span>
                        </div>
                        <a href="tour-detail.html?id=${tourId}" class="btn-view-details">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Book now function
function bookNow() {
    // Get the tour ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('tour');
    
    if (!tourId || !toursData[tourId]) {
        alert('Tour not found. Please select a valid tour.');
        return;
    }
    
    // Get tour data
    const tour = toursData[tourId];
    
    // Create tour data object to pass to booking page
    const tourData = {
        id: tourId,
        title: tour.title,
        category: tour.category,
        destination: tour.destination,
        duration: tour.duration,
        price: tour.price,
        image: tour.heroImage,
        rating: tour.rating
    };
    
    // Store in localStorage as backup
    localStorage.setItem('selectedTour', JSON.stringify(tourData));
    
    // Redirect to booking page with tour data
    window.location.href = `booking.html?tour=${encodeURIComponent(JSON.stringify(tourData))}`;
}

// Open image modal (simple version)
function openImageModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="this.parentElement.remove()">
            <div class="modal-content">
                <img src="${imageSrc}" alt="Tour Image">
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadTourDetails();
});
