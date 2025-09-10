// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Add WhatsApp floating icon to all pages
    addWhatsAppIcon();
    
    // Initialize product review functionality
    initProductReview();
});

// Function to add WhatsApp floating icon
function addWhatsAppIcon() {
    const whatsappNumber = '2001009480722'; // Egypt country code (20) + number
    const whatsappLink = document.createElement('a');
    whatsappLink.href = `https://wa.me/${whatsappNumber}`;
    whatsappLink.className = 'whatsapp-float';
    whatsappLink.setAttribute('target', '_blank');
    whatsappLink.setAttribute('rel', 'noopener noreferrer');
    whatsappLink.innerHTML = '<i class="bi bi-whatsapp"></i>';
    document.body.appendChild(whatsappLink);
}

// Function to initialize product review functionality
function initProductReview() {
    // Create the product review overlay element
    const overlay = document.createElement('div');
    overlay.className = 'product-review-overlay';
    overlay.innerHTML = `
        <div class="product-review-content">
            <span class="product-review-close">&times;</span>
            <img class="product-review-image" src="" alt="Product Image">
            <h2 class="product-review-title"></h2>
            <div class="product-review-description"></div>
            <div class="product-review-details"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Add click event to close button
    const closeBtn = overlay.querySelector('.product-review-close');
    closeBtn.addEventListener('click', function() {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close on click outside content
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Add click event to all product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productImage = this.querySelector('img').src;
            const productTitle = this.querySelector('.product-title') ? 
                               this.querySelector('.product-title').textContent : 
                               'Product Details';
            const productDesc = this.getAttribute('data-description') || 
                              'No description available for this product.';
            const productDetails = this.getAttribute('data-details') ? 
                                 JSON.parse(this.getAttribute('data-details')) : 
                                 [];

            // Populate the overlay with product information
            overlay.querySelector('.product-review-image').src = productImage;
            overlay.querySelector('.product-review-title').textContent = productTitle;
            overlay.querySelector('.product-review-description').textContent = productDesc;
            
            // Add product details if available
            const detailsContainer = overlay.querySelector('.product-review-details');
            detailsContainer.innerHTML = '';
            if (productDetails.length > 0) {
                productDetails.forEach(detail => {
                    const detailElem = document.createElement('span');
                    detailElem.className = 'product-review-detail';
                    detailElem.textContent = detail;
                    detailsContainer.appendChild(detailElem);
                });
            }

            // Show the overlay
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
}

// Add AOS attributes to elements that should be animated
function addAOSAttributes() {
    // Common sections to animate
    const sections = [
        { selector: '.hero-section, .slider-section', attr: 'fade-up', delay: '0' },
        { selector: '.about-section', attr: 'fade-right', delay: '100' },
        { selector: '.services-section', attr: 'fade-left', delay: '100' },
        { selector: '.products-section', attr: 'fade-up', delay: '200' },
        { selector: '.testimonial-section', attr: 'fade-in', delay: '100' },
        { selector: '.contact-section', attr: 'zoom-in', delay: '100' },
        { selector: '.footer-section', attr: 'fade-up', delay: '0' },
        { selector: '.section-title', attr: 'fade-up', delay: '0' },
        { selector: '.product-card', attr: 'fade-up', delay: '' }
    ];

    // Apply AOS attributes to each section
    sections.forEach(section => {
        const elements = document.querySelectorAll(section.selector);
        elements.forEach((el, index) => {
            el.setAttribute('data-aos', section.attr);
            if (section.delay) {
                const calculatedDelay = parseInt(section.delay) + (index * 100);
                el.setAttribute('data-aos-delay', calculatedDelay.toString());
            }
        });
    });
}

// Call this function after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addAOSAttributes();
});