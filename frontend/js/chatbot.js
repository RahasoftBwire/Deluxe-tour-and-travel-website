// Deluxe Tours AI Chatbot
class TravelChatbot {
    constructor() {
        this.messages = [];
        this.isThinking = false;
        this.thinkingTime = 2000; // 2 seconds thinking time
        this.init();
    }

    init() {
        // DOM elements
        this.toggle = document.getElementById('chatbot-toggle');
        this.window = document.getElementById('chatbot-window');
        this.closeBtn = document.getElementById('chatbot-close');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
        this.thinkingIndicator = document.getElementById('chatbot-thinking');
        this.badge = document.getElementById('chatbot-badge');
        this.quickActions = document.querySelectorAll('.quick-action-btn');

        // Event listeners
        this.toggle.addEventListener('click', () => this.toggleWindow());
        this.closeBtn.addEventListener('click', () => this.closeWindow());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick action buttons
        this.quickActions.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                this.input.value = message;
                this.sendMessage();
            });
        });

        // Add welcome message
        this.addWelcomeMessage();
    }

    toggleWindow() {
        this.window.classList.toggle('active');
        if (this.window.classList.contains('active')) {
            this.input.focus();
            this.badge.style.display = 'none';
        }
    }

    closeWindow() {
        this.window.classList.remove('active');
    }

    addWelcomeMessage() {
        const welcomeMsg = {
            text: "👋 Hello! I'm your Deluxe Tours travel assistant. I'm here to help you with:\n\n✈️ Tour information\n📅 Booking assistance\n💳 Payment & cancellation policies\n📍 Destination details\n\nHow can I assist you today?",
            isBot: true,
            time: this.getCurrentTime()
        };
        this.displayMessage(welcomeMsg);
    }

    sendMessage() {
        const text = this.input.value.trim();
        if (!text || this.isThinking) return;

        // Add user message
        const userMsg = {
            text: text,
            isBot: false,
            time: this.getCurrentTime()
        };
        this.displayMessage(userMsg);
        this.input.value = '';

        // Show thinking animation
        this.showThinking();

        // Generate response after thinking time
        setTimeout(() => {
            this.hideThinking();
            const response = this.generateResponse(text);
            const botMsg = {
                text: response,
                isBot: true,
                time: this.getCurrentTime()
            };
            this.displayMessage(botMsg);
        }, this.thinkingTime);
    }

    showThinking() {
        this.isThinking = true;
        this.thinkingIndicator.style.display = 'flex';
        this.sendBtn.disabled = true;
        this.scrollToBottom();
    }

    hideThinking() {
        this.isThinking = false;
        this.thinkingIndicator.style.display = 'none';
        this.sendBtn.disabled = false;
    }

    displayMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${message.isBot ? 'bot-message' : 'user-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = `message-avatar ${message.isBot ? 'bot-avatar' : 'user-avatar'}`;
        avatar.innerHTML = message.isBot ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = message.text.replace(/\n/g, '<br>');
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = message.time;
        
        content.appendChild(bubble);
        content.appendChild(time);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    generateResponse(userMessage) {
        const msg = userMessage.toLowerCase();

        // Knowledge base for tours
        const responses = {
            // Greetings
            greeting: [
                "Hello! 👋 How can I help you plan your perfect getaway today?",
                "Hi there! Welcome to Deluxe Tours. What can I assist you with?",
                "Greetings! Ready to explore amazing destinations? Let me help you!"
            ],

            // Tours
            tours: `We offer amazing tour packages to incredible destinations! 🌍

Our Featured Tours:
🦁 **Masai Mara Safari** - Kenya ($1,800, 6 days)
   Experience wildlife at its finest!

🏝️ **Maldives Beach Paradise** - Maldives ($1,200, 7 days)
   Luxury resorts & crystal waters

🏙️ **Dubai Luxury Experience** - UAE ($1,500, 5 days)
   Modern marvels & Arabian culture

Plus tours to Zanzibar, Bali, Santorini, Seychelles, and more!

Would you like to know more about a specific destination?`,

            // Booking
            booking: `Booking with Deluxe Tours is easy! 📝

**How to Book:**
1️⃣ Browse our tours at deluxetour.co.ke/tours
2️⃣ Select your preferred package
3️⃣ Fill in your details
4️⃣ Choose payment method
5️⃣ Receive confirmation via email

**Payment Options:**
💳 Credit/Debit Cards
📱 Mobile Money (M-Pesa, etc.)
🏦 Bank Transfer

Need help with a specific booking? Call us at +254 725 442 618`,

            // Prices
            prices: `Our tour packages offer great value! 💰

**Price Range:**
🌟 Budget Tours: From $950
🌟 Standard Tours: $1,200 - $1,500
🌟 Premium Tours: $1,600 - $1,900

Prices include:
✅ Accommodation
✅ Meals (as specified)
✅ Guided tours
✅ Transportation
✅ Selected activities

*Flights usually separate unless stated. Group discounts available!*

Which destination interests you?`,

            // Cancellation Policy
            cancellation: `Our Cancellation Policy is fair & transparent: 📋

**Refund Schedule:**
• 60+ days before: 90% refund
• 45-60 days: 75% refund
• 30-44 days: 50% refund
• 15-29 days: 25% refund
• Under 15 days: No refund

**Special Cases:**
🏥 Medical emergencies (with certificate)
🌪️ Force majeure events
📝 Booking modifications available

View full policy: deluxetour.co.ke/cancellation-policy

We recommend travel insurance for peace of mind!`,

            // Destinations
            destinations: `We cover amazing destinations worldwide! 🗺️

**By Region:**
🌍 **Africa:** Kenya, Tanzania, Egypt, Morocco, Seychelles
🌏 **Asia:** Maldives, Bali, Thailand, Dubai
🌍 **Europe:** Greece (Santorini), Turkey (Istanbul)
🏝️ **Islands:** Mauritius, Zanzibar, Maldives

**Most Popular:**
⭐ Masai Mara (wildlife safari)
⭐ Maldives (beach luxury)
⭐ Dubai (modern luxury)

Which region interests you most?`,

            // Contact
            contact: `Get in touch with us! 📞

**Contact Information:**
📧 Email: info@deluxetour.co.ke
📱 Phone: +254 725 442 618
📍 Office: Moi Avenue, Nairobi, Kenya
⏰ Hours: Sat-Thu: 9AM-6PM (Fri Closed)

**Social Media:**
Facebook: @deluxetour
Instagram: @deluxetour
Twitter: @deluxetour

Or visit our contact page for the contact form!`,

            // Duration
            duration: `Our tours range from 4 to 8 days! ⏱️

**Typical Durations:**
🌴 Beach holidays: 6-8 days
🏙️ City tours: 4-6 days
🦁 Safari adventures: 5-7 days
🏔️ Adventure tours: 6-8 days

**Flexible Options:**
✅ Extend your stay
✅ Combine multiple tours
✅ Custom itineraries available

What type of trip are you planning?`,

            // Payment
            payment: `We accept multiple payment methods! 💳

**Payment Options:**
1. Credit/Debit Cards (Visa, Mastercard)
2. Mobile Money (M-Pesa, Airtel Money)
3. Bank Transfer
4. PayPal (international)

**Payment Plan:**
💵 Deposit: 30% to confirm booking
💵 Balance: 30 days before departure

**Secure Payments:**
🔒 SSL encrypted
🔒 PCI compliant
🔒 Money-back guarantee

Ready to book? Call +254 725 442 618`,

            // Group bookings
            group: `Planning a group trip? We offer special rates! 👥

**Group Benefits:**
🎉 10% off for 5+ people
🎉 15% off for 10+ people
🎉 20% off for 20+ people
🎉 Custom packages available

**Perfect For:**
• Family reunions
• Corporate team building
• School trips
• Friend getaways
• Wedding groups

Contact us for a custom quote: info@deluxetour.co.ke`,

            // Safety
            safety: `Your safety is our priority! 🛡️

**Safety Measures:**
✅ Experienced guides
✅ Licensed operators
✅ Insurance coverage
✅ 24/7 emergency support
✅ COVID-19 protocols
✅ Safe transportation

**Recommendations:**
📋 Travel insurance
💉 Necessary vaccinations
📱 Emergency contacts
🆘 Travel advisory updates

We follow all international safety standards!`,

            // Thanks
            thanks: [
                "You're very welcome! 😊 Is there anything else I can help you with?",
                "Happy to help! Feel free to ask if you have more questions. 🌟",
                "My pleasure! Let me know if you need anything else about your travel plans!"
            ],

            // Default
            default: `I'm here to help you with:

✈️ **Tour Packages** - Available destinations & prices
📅 **Booking** - How to book & payment options
📋 **Policies** - Cancellation & refund information
📍 **Destinations** - Where we travel
📞 **Contact** - Get in touch with us

Could you please be more specific about what you'd like to know?`
        };

        // Greeting detection
        if (msg.match(/\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/)) {
            return this.randomResponse(responses.greeting);
        }

        // Thanks detection
        if (msg.match(/\b(thank|thanks|appreciate)\b/)) {
            return this.randomResponse(responses.thanks);
        }

        // Tours
        if (msg.match(/\b(tour|package|trip|vacation|holiday)\b/) && !msg.match(/\b(book|cancel|price)\b/)) {
            return responses.tours;
        }

        // Booking
        if (msg.match(/\b(book|booking|reserve|reservation|how do i book)\b/)) {
            return responses.booking;
        }

        // Prices
        if (msg.match(/\b(price|cost|how much|expensive|cheap|budget)\b/)) {
            return responses.prices;
        }

        // Cancellation
        if (msg.match(/\b(cancel|cancellation|refund|policy)\b/)) {
            return responses.cancellation;
        }

        // Destinations
        if (msg.match(/\b(destination|where|place|country|location)\b/)) {
            return responses.destinations;
        }

        // Contact
        if (msg.match(/\b(contact|phone|email|call|reach|address)\b/)) {
            return responses.contact;
        }

        // Duration
        if (msg.match(/\b(duration|how long|days|week)\b/)) {
            return responses.duration;
        }

        // Payment
        if (msg.match(/\b(payment|pay|mpesa|card|bank)\b/)) {
            return responses.payment;
        }

        // Group bookings
        if (msg.match(/\b(group|team|family|friends|corporate)\b/)) {
            return responses.group;
        }

        // Safety
        if (msg.match(/\b(safe|safety|secure|insurance|covid)\b/)) {
            return responses.safety;
        }

        // Specific destinations
        if (msg.match(/\b(maldives|dubai|masai mara|kenya|zanzibar|bali)\b/)) {
            return `Great choice! 🌟 Let me get you details about that destination.

For detailed information about this tour, please visit our tours page or call +254 725 442 618.

Would you like to know about:
• Tour itinerary
• Pricing & inclusions
• Booking process
• Other destinations`;
        }

        // Default response
        return responses.default;
    }

    randomResponse(responses) {
        if (Array.isArray(responses)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        return responses;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TravelChatbot();
});
