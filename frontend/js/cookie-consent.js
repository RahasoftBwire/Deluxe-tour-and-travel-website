// Cookie Consent Management
(function() {
    'use strict';

    // Cookie utility functions
    const CookieManager = {
        // Set a cookie with expiration
        setCookie: function(name, value, days) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
        },

        // Get a cookie value
        getCookie: function(name) {
            const nameEQ = name + "=";
            const cookies = document.cookie.split(';');
            for(let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.indexOf(nameEQ) === 0) {
                    return cookie.substring(nameEQ.length, cookie.length);
                }
            }
            return null;
        },

        // Delete a cookie
        deleteCookie: function(name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        }
    };

    // Check consent status
    function checkConsent() {
        const consent = CookieManager.getCookie('deluxe_cookie_consent');
        const localConsent = localStorage.getItem('cookieConsent');
        
        if (consent === 'accepted' || localConsent === 'accepted') {
            return 'accepted';
        } else if (consent === 'declined' || localConsent === 'declined') {
            return 'declined';
        }
        return null;
    }

    // Show the cookie banner
    function showCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            setTimeout(() => {
                banner.classList.add('show');
            }, 1000); // Show after 1 second delay
        }
    }

    // Hide the cookie banner
    function hideCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300); // Wait for animation to complete
        }
    }

    // Accept cookies
    function acceptCookies() {
        // Set cookie and localStorage
        CookieManager.setCookie('deluxe_cookie_consent', 'accepted', 365);
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        
        // Hide banner
        hideCookieBanner();
        
        // Initialize analytics or tracking here if needed
        console.log('✅ Cookies accepted - Analytics enabled');
        
        // Show success message
        showToast('Cookie preferences saved! Thank you.', 'success');
    }

    // Decline cookies
    function declineCookies() {
        // Set cookie and localStorage
        CookieManager.setCookie('deluxe_cookie_consent', 'declined', 30);
        localStorage.setItem('cookieConsent', 'declined');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        
        // Hide banner
        hideCookieBanner();
        
        // Remove any tracking cookies
        console.log('❌ Cookies declined - Limited functionality');
        
        // Show info message
        showToast('You have declined cookies. Some features may be limited.', 'info');
    }

    // Show toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `cookie-toast cookie-toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Initialize cookie consent
    function initCookieConsent() {
        const consentStatus = checkConsent();
        
        if (consentStatus === null) {
            // No consent given yet, show banner
            showCookieBanner();
        } else {
            // Consent already given
            console.log(`Cookie consent: ${consentStatus}`);
        }

        // Add event listeners
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptCookies);
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', declineCookies);
        }
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieConsent);
    } else {
        initCookieConsent();
    }

    // Expose API for manual control
    window.CookieConsent = {
        accept: acceptCookies,
        decline: declineCookies,
        getStatus: checkConsent,
        showBanner: showCookieBanner
    };

})();
