/**
 * Certificates page integration
 * Handles certificates listing and filtering
 */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize certificates page
        if (window.location.pathname.includes('certificates.html')) {
            initializeCertificatesPage();
        }
    } catch (error) {
        console.error('Error initializing certificates page:', error);
    }
});

/* ============================
   Certificates Page
=============================== */
async function initializeCertificatesPage() {
    try {
        const certificates = await ApiService.getCertificates();
        
        // Only show active certificates
        const activeCertificates = certificates.filter(cert => cert.isActive);
        
        updatePageTitle('Certificates');
        displayCertificates(activeCertificates);
    } catch (error) {
        console.error('Error loading certificates page:', error);
    }
}

function updatePageTitle(title) {
    const pageTitleElement = document.querySelector('.page-title-content h2');
    if (pageTitleElement) pageTitleElement.textContent = title;

    const breadcrumbElement = document.querySelector('.page-title-content ul li:last-child');
    if (breadcrumbElement) breadcrumbElement.textContent = title;
}

function displayCertificates(certificates) {
    const portfolioContainer = document.querySelector('.portfolio-section .row');
    if (!portfolioContainer) return;

    const sectionTitle = portfolioContainer.querySelector('.section-title').parentElement;

    // Remove old items except title
    while (portfolioContainer.children.length > 1) {
        portfolioContainer.removeChild(portfolioContainer.lastChild);
    }

    if (certificates.length === 0) {
        const noCertificatesMsg = document.createElement('div');
        noCertificatesMsg.className = 'col-12 text-center';
        noCertificatesMsg.innerHTML = '<p>No certificates available at the moment.</p>';
        portfolioContainer.appendChild(noCertificatesMsg);
        return;
    }

    certificates.forEach(certificate => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'col-lg-4 col-md-6';

        portfolioItem.innerHTML = `
            <div class="portfolio-item product-card" data-description="${certificate.description}" data-details='["Certificate", "Quality Assurance", "${certificate.name}"]'>
                <img src="${certificate.image}" alt="${certificate.name}">
                <div class="portfolio-content-overlay">
                    <h3 class="product-title">${certificate.name}</h3>
                    <p>${certificate.description.substring(0, 100)}${certificate.description.length > 100 ? '...' : ''}</p>
                </div>
            </div>
        `;
        portfolioContainer.appendChild(portfolioItem);
    });
}