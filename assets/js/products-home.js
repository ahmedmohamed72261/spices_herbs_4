/**
 * Products integration for home page
 * Handles the 'Featured Works' and 'Our Projects' sections
 */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch products from API
        const products = await ApiService.getProducts();
        
        // Get only the first 6 products for display
        const featuredProducts = products.slice(0, 6);
        
        // Update the 'Our Projects' section
        updateProjectsSection(featuredProducts);
        
    } catch (error) {
        console.error('Error loading products on home page:', error);
    }
});

/**
 * Update the Projects section with product data
 * @param {Array} products - Array of products to display
 */
function updateProjectsSection(products) {
    const projectsContainer = document.querySelector('.portfolio-section .row');
    
    // Keep the section title div (first child)
    const sectionTitle = projectsContainer.querySelector('.section-title').parentElement;
    
    // Clear existing portfolio items except the section title
    while (projectsContainer.children.length > 1) {
        projectsContainer.removeChild(projectsContainer.lastChild);
    }
    
    // Add products to the projects section
    products.forEach(product => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'col-lg-4 col-md-6 p-2';
        portfolioItem.innerHTML = `
            <div class="portfolio-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="portfolio-content-overlay">
                    <h3><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
                    <p>${product.category.name}</p>
                    <a class="portfolio-link-icon" href="product-details.html?id=${product.id}"><i class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        `;
        projectsContainer.appendChild(portfolioItem);
    });
    
    // Add 'View All Products' button
    const viewAllContainer = document.createElement('div');
    viewAllContainer.className = 'col-lg-12 col-md-12 text-center mt-4';
    viewAllContainer.innerHTML = `
        <a href="products.html" class="default-btn mt-5">View All Products <span></span></a>
    `;
    projectsContainer.appendChild(viewAllContainer);
}