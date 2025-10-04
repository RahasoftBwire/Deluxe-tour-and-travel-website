// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');
    const submitBtn = contactForm.querySelector('.btn-submit-modern');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim(),
            type: 'inquiry'
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        if (!isValidEmail(formData.email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }

        // Disable submit button and show loader
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';

        try {
            // Use FormSubmit.co to send email directly to developer
            // FormSubmit is a free service that sends form data to your email
            const formSubmitUrl = 'https://formsubmit.co/bsccs202367547@mylife.mku.ac.ke';
            
            // Create FormData for submission
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('subject', formData.subject);
            submitData.append('message', formData.message);
            submitData.append('_subject', `Deluxe Tour & Travel - ${formData.subject}`);
            submitData.append('_template', 'table');
            submitData.append('_captcha', 'false'); // Disable captcha for testing
            
            const response = await fetch(formSubmitUrl, {
                method: 'POST',
                body: submitData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showAlert('Thank you! Your message has been sent successfully to bsccs202367547@mylife.mku.ac.ke. We will get back to you within 24 hours.', 'success');
                contactForm.reset();
                
                // Scroll to alert
                formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Sorry, there was an error sending your message. Please try again or contact us directly at bsccs202367547@mylife.mku.ac.ke', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });

    // Show alert message
    function showAlert(message, type) {
        formAlert.textContent = message;
        formAlert.className = `form-alert-modern ${type}`;
        formAlert.style.display = 'block';

        // Auto-hide success messages after 8 seconds
        if (type === 'success') {
            setTimeout(() => {
                formAlert.style.display = 'none';
            }, 8000);
        }
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Real-time validation feedback
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#e5e5e5';
        }
    });

    // Character counter for message
    const messageTextarea = document.getElementById('message');
    const maxLength = 1000;
    
    // Create character counter element
    const counterDiv = document.createElement('div');
    counterDiv.style.cssText = 'text-align: right; font-size: 0.9rem; color: #6b7280; margin-top: 8px;';
    messageTextarea.parentElement.appendChild(counterDiv);
    
    messageTextarea.addEventListener('input', function() {
        const remaining = maxLength - this.value.length;
        counterDiv.textContent = `${this.value.length}/${maxLength} characters`;
        
        if (remaining < 50) {
            counterDiv.style.color = '#ef4444';
        } else if (remaining < 100) {
            counterDiv.style.color = '#f59e0b';
        } else {
            counterDiv.style.color = '#6b7280';
        }
    });
    
    // Initialize counter
    messageTextarea.dispatchEvent(new Event('input'));

    // Phone number formatting (optional)
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        // Remove non-numeric characters except + and spaces
        let value = this.value.replace(/[^\d+\s]/g, '');
        this.value = value;
    });

    // Form field animations
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});

// Smooth scroll for CTA buttons
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta-buttons-modern a');
    ctaButtons.forEach(button => {
        if (button.getAttribute('href').startsWith('#')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });
});

// Add floating animation to social buttons on hover
document.addEventListener('DOMContentLoaded', function() {
    const socialButtons = document.querySelectorAll('.social-btn-modern');
    socialButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'float 2s ease-in-out infinite';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });
});
