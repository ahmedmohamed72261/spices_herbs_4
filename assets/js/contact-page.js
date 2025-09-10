/**
 * Contact page integration
 * Handles contact information display and form submission
 */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize contact page
        if (window.location.pathname.includes('contact.html')) {
            initializeContactPage();
        }
    } catch (error) {
        console.error('Error initializing contact page:', error);
    }
});

/* ============================
   Contact Page
=============================== */
async function initializeContactPage() {
    try {
        // Create loading container
        const contactSection = document.querySelector('.contact-info-area');
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'loading-container is-loading';
        loadingContainer.style.width = '100%';
        loadingContainer.style.height = '300px';
        
        // Create loading overlay with spinner
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        
        loadingOverlay.appendChild(loadingSpinner);
        loadingContainer.appendChild(loadingOverlay);
        
        // Insert loading container at the beginning of contact section
        contactSection.insertBefore(loadingContainer, contactSection.firstChild);
        
        // Fetch contact info from API
        const contactInfo = await ApiService.getContactInfo();
        
        // Add a small delay to show loading animation
        setTimeout(() => {
            updatePageTitle('Contact Us');
            updateContactInfo(contactInfo);
            setupContactForm();
            
            // Remove loading container
            contactSection.removeChild(loadingContainer);
        }, 300);
    } catch (error) {
        console.error('Error loading contact page:', error);
        
        // Remove loading container if it exists
        const loadingContainer = document.querySelector('.contact-info-area .loading-container');
        if (loadingContainer) {
            loadingContainer.parentNode.removeChild(loadingContainer);
        }
    }
}

function updatePageTitle(title) {
    const pageTitleElement = document.querySelector('.page-title-content h2');
    if (pageTitleElement) pageTitleElement.textContent = title;

    const breadcrumbElement = document.querySelector('.page-title-content ul li:last-child');
    if (breadcrumbElement) breadcrumbElement.textContent = title;
}

function updateContactInfo(contactInfo) {
    // Update phone information
    if (contactInfo.phone) {
        // Update in contact info section
        const contactPhoneElement = document.getElementById('contact-phone');
        if (contactPhoneElement) {
            contactPhoneElement.textContent = contactInfo.phone.value;
            contactPhoneElement.href = `tel:${contactInfo.phone.value}`;
        }
        
        // Update in footer
        const footerPhoneElement = document.querySelector('.footer-info-contact:has(i.flaticon-phone-call) span a');
        if (footerPhoneElement) {
            footerPhoneElement.textContent = contactInfo.phone.value;
            footerPhoneElement.href = `tel:${contactInfo.phone.value}`;
        }
    }
    
    // Update email information
    if (contactInfo.email) {
        // Update in contact info section
        const contactEmailElement = document.getElementById('contact-email');
        if (contactEmailElement) {
            contactEmailElement.textContent = contactInfo.email.value;
            contactEmailElement.href = `mailto:${contactInfo.email.value}`;
        }
        
        // Update in footer
        const footerEmailElement = document.querySelector('.footer-info-contact:has(i.flaticon-envelope) span a');
        if (footerEmailElement) {
            footerEmailElement.textContent = contactInfo.email.value;
            footerEmailElement.href = `mailto:${contactInfo.email.value}`;
        }
    }
    
    // Update address information
    if (contactInfo.address) {
        // Update in contact info section
        const contactAddressElement = document.getElementById('contact-address');
        if (contactAddressElement) {
            contactAddressElement.textContent = contactInfo.address.value;
        }
        
        // Update in footer
        const footerAddressElement = document.querySelector('.footer-info-contact:has(i.flaticon-placeholder) span');
        if (footerAddressElement) {
            footerAddressElement.textContent = contactInfo.address.value;
        }
    }
}

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Override the default form submission
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Create loading container for form
        const formContainer = contactForm.closest('.contact-form');
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'loading-container is-loading';
        loadingContainer.style.position = 'absolute';
        loadingContainer.style.top = '0';
        loadingContainer.style.left = '0';
        loadingContainer.style.width = '100%';
        loadingContainer.style.height = '100%';
        
        // Create loading overlay with spinner
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        
        loadingOverlay.appendChild(loadingSpinner);
        loadingContainer.appendChild(loadingOverlay);
        
        // Add relative positioning to form container if not already set
        if (getComputedStyle(formContainer).position === 'static') {
            formContainer.style.position = 'relative';
        }
        
        // Insert loading container
        formContainer.appendChild(loadingContainer);
        
        const formMessage = document.querySelector('.form-message');
        if (formMessage) formMessage.textContent = '';
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;
        
        try {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            const response = await ApiService.sendContactMessage(formData);
            
            if (formMessage) {
                formMessage.textContent = 'Your message has been sent successfully!';
                formMessage.style.color = '#5fcb71';
            }
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            if (formMessage) {
                formMessage.textContent = error.message || 'Failed to send message. Please try again later.';
                formMessage.style.color = '#ff0000';
            }
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });
}