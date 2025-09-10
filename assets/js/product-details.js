/**
 * Product details page integration
 * Handles displaying product details and share functionality
 */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Get product ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            console.error('No product ID provided in URL');
            return;
        }
        
        // Fetch product details
        const product = await ApiService.getProductById(productId);
        
        if (!product) {
            console.error('Product not found');
            return;
        }
        
        // Update page with product details
        updateProductDetails(product);
        
        // Setup share button functionality
        setupShareButton();
        
    } catch (error) {
        console.error('Error loading product details:', error);
    }
});

/**
 * Update the page with product details
 * @param {Object} product - Product object
 */
function updateProductDetails(product) {
    // Update page title
    document.title = `${product.name} - Green Globe Herbs`;
    
    // Update breadcrumb
    const breadcrumbTitle = document.querySelector('.page-title-content h2');
    if (breadcrumbTitle) {
        breadcrumbTitle.textContent = product.name;
    }
    
    const breadcrumbItem = document.querySelector('.page-title-content ul li:last-child');
    if (breadcrumbItem) {
        breadcrumbItem.textContent = product.name;
    }
    
    // Update product image section with AOS
    const productImageSection = document.querySelector('.portfolio-details-image');
    if (productImageSection && !productImageSection.hasAttribute('data-aos')) {
        productImageSection.setAttribute('data-aos', 'fade-up');
    }
    
    // Update product image
    const productImage = document.querySelector('.portfolio-details-image img');
    if (productImage) {
        productImage.src = product.image;
        productImage.alt = product.name;
    }
    
    // Add AOS to description section
    const descSection = document.querySelector('.portfolio-details-desc');
    if (descSection && !descSection.hasAttribute('data-aos')) {
        descSection.setAttribute('data-aos', 'fade-up');
        descSection.setAttribute('data-aos-delay', '100');
    }
    
    // Update product title
    const productTitle = document.querySelector('.portfolio-details-desc h3');
    if (productTitle) {
        productTitle.textContent = product.name;
    }
    
    // Update product description
    const productDesc = document.querySelector('.portfolio-details-desc > p');
    if (productDesc) {
        productDesc.textContent = product.description.split('\r\n')[0]; // First paragraph
    }
    
    // Update product details
    const detailsContainer = document.querySelector('.portfolio-details-info');
    if (detailsContainer) {
        // Add AOS to details container if not already present
        if (!detailsContainer.hasAttribute('data-aos')) {
            detailsContainer.setAttribute('data-aos', 'fade-up');
            detailsContainer.setAttribute('data-aos-delay', '200');
        }
        
        // Format the full description with line breaks
        const formattedDescription = product.description.replace(/\r\n/g, '<br>');
        
        detailsContainer.innerHTML = `
            <div class="info-list">
                <ul>
                    <li><span class="fs-6 fw-bolder">Category:</span> ${product.category.name}</li>
                    <li><span class="fs-6 fw-bolder">Added:</span> ${ApiService.formatDate(product.createdAt)}</li>
                </ul>
            </div>
            <div class="share-btn mt-4">
                <button id="shareButton" class="default-btn">Share Product <span></span></button>
            </div>
        `;
    } else {
        // If the container doesn't exist, create it
        const descContainer = document.querySelector('.portfolio-details-desc');
        if (descContainer) {
            const infoContainer = document.createElement('div');
            infoContainer.className = 'portfolio-details-info mt-4';
            infoContainer.setAttribute('data-aos', 'fade-up');
            infoContainer.setAttribute('data-aos-delay', '200');
            
            // Format the full description with line breaks
            const formattedDescription = product.description.replace(/\r\n/g, '<br>');
            
            infoContainer.innerHTML = `
                <div class="info-list">
                    <ul>
                        <li><span>Category:</span> ${product.category.name}</li>
                        <li><span>Added:</span> ${ApiService.formatDate(product.createdAt)}</li>
                        <li><span>Availability:</span> ${product.inStock ? 'In Stock' : 'Out of Stock'}</li>
                    </ul>
                </div>
                <div class="full-description mt-4">
                    <h4>Product Description</h4>
                    <p>${formattedDescription}</p>
                </div>
                <div class="share-btn mt-4">
                    <button id="shareButton" class="default-btn">Share Product <span></span></button>
                </div>
            `;
            
            descContainer.appendChild(infoContainer);
        }
    }
}

/**
 * Setup share button functionality
 */
function setupShareButton() {
    // Add event listener after a short delay to ensure the button exists
    setTimeout(() => {
        const shareButton = document.getElementById('shareButton');
        if (shareButton) {
            shareButton.addEventListener('click', function() {
                // Copy current URL to clipboard
                navigator.clipboard.writeText(window.location.href)
                    .then(() => {
                        // Show success message
                        const originalText = shareButton.textContent;
                        shareButton.textContent = 'Link Copied!';
                        
                        // Reset button text after 2 seconds
                        setTimeout(() => {
                            shareButton.textContent = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy link: ', err);
                    });
            });
        }
    }, 500);
}