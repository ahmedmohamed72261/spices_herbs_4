/**
 * Products page integration
 * Handles product listing, category filtering, and product details
 */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize homepage recent work (if exists)
        if (document.getElementById('recent-work-section')) {
            initializeRecentWorkSection();
        }

        // Initialize products page
        if (window.location.pathname.includes('products.html')) {
            initializeProductsPage();
        }

        // Initialize product details page
        if (window.location.pathname.includes('product-details.html')) {
            initializeProductDetailsPage();
        }
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

/* ============================
   Recent Work Section (Homepage)
=============================== */
async function initializeRecentWorkSection() {
    try {
        const productsContainer = document.getElementById('recent-products-container');
        if (!productsContainer) return;

        const products = await ApiService.getProducts();
        const displayProducts = products.slice(0, 6);

        productsContainer.innerHTML = '';

        displayProducts.forEach(product => {
            const productId = product._id || product.id;
            const productCol = document.createElement('div');
            productCol.className = 'col-lg-4 col-md-6 my-5';

            productCol.innerHTML = `
                <div class="protfolio-single-box">
                    <div class="protfolio-thumb">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="protfolio-icon">
                            <a href="product-details.html?id=${productId}">
                                <img src="assets/images/work-icon.png" alt="work icon">
                            </a>
                        </div>
                    </div>
                    <div class="protfolio-content">
                        <div class="protfolio-title">
                            <h3><a href="product-details.html?id=${productId}">${product.name}</a></h3>
                        </div>
                        <div class="protfolio-description">
                            <p>${product.category.name} - ${formatDate(product.createdAt)}</p>
                        </div>
                    </div>
                </div>
            `;
            productsContainer.appendChild(productCol);
        });
    } catch (error) {
        console.error('Error initializing Recent Work section:', error);
    }
}

/* ============================
   Products Page
=============================== */
async function initializeProductsPage() {
    try {
        updatePageTitle('Products');

        // Create loading containers
        const portfolioSection = document.querySelector('.portfolio-section .container .row');
        if (portfolioSection) {
            // Products loading container
            const productsLoadingContainer = document.createElement('div');
            productsLoadingContainer.className = 'loading-container is-loading col-12';
            productsLoadingContainer.innerHTML = `
                <div class="loading-overlay">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading Products...</div>
                </div>
            `;
            portfolioSection.appendChild(productsLoadingContainer);

            // Categories loading container
            const categoriesLoadingContainer = document.createElement('div');
            categoriesLoadingContainer.className = 'loading-container is-loading col-12';
            categoriesLoadingContainer.innerHTML = `
                <div class="loading-overlay">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading Categories...</div>
                </div>
            `;
            portfolioSection.appendChild(categoriesLoadingContainer);
        }
        
        // Fetch data in parallel
        const [products, categories] = await Promise.all([
            ApiService.getProducts(),
            ApiService.getCategories()
        ]);

        // Remove categories loading indicator
        const categoriesLoadingContainer = document.querySelector('.loading-container:nth-child(2)');
        if (categoriesLoadingContainer) {
            categoriesLoadingContainer.classList.remove('is-loading');
            setTimeout(() => {
                categoriesLoadingContainer.remove();
            }, 300);
        }

        // Create category filters
        createCategoryFilters(categories);

        // Remove products loading indicator
        const productsLoadingContainer = document.querySelector('.loading-container');
        if (productsLoadingContainer) {
            productsLoadingContainer.classList.remove('is-loading');
            setTimeout(() => {
                productsLoadingContainer.remove();
            }, 300);
        }

        // Display products and setup filters
        displayProducts(products);
        setupCategoryFilterEvents(products);
    } catch (error) {
        console.error('Error loading products page:', error);
        
        // Remove loading indicator in case of error
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) {
            loadingContainer.remove();
        }
    }
}

function updatePageTitle(title) {
    const pageTitleElement = document.querySelector('.page-title-content h2');
    if (pageTitleElement) pageTitleElement.textContent = title;

    const breadcrumbElement = document.querySelector('.page-title-content ul li:last-child');
    if (breadcrumbElement) breadcrumbElement.textContent = title;
}

function createCategoryFilters(categories) {
    let filterContainer = document.querySelector('.category-filters');

    if (!filterContainer) {
        const portfolioSection = document.querySelector('.portfolio-section .container');
        filterContainer = document.createElement('div');
        filterContainer.className = 'category-filters text-center mb-5';

        const sectionTitle = portfolioSection.querySelector('.section-title').parentElement;
        sectionTitle.after(filterContainer);
    }

    filterContainer.innerHTML = '';

    // "All Products" button
    const allFilter = document.createElement('button');
    allFilter.className = 'category-filter-btn active';
    allFilter.setAttribute('data-category', 'all');
    allFilter.textContent = 'All Products';
    filterContainer.appendChild(allFilter);

    // Category buttons
    categories.forEach(category => {
        const filterBtn = document.createElement('button');
        filterBtn.className = 'category-filter-btn';
        filterBtn.setAttribute('data-category', category.slug);
        filterBtn.textContent = `${category.name} (${category.productCount})`;
        filterContainer.appendChild(filterBtn);
    });

    // Styling
    const style = document.createElement('style');
    style.textContent = `
        .category-filters {
            margin-bottom: 30px;
        }
        .category-filter-btn {
            background-color: #f5f5f5;
            border: none;
            color: #333;
            padding: 8px 16px;
            margin: 0 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .category-filter-btn:hover, .category-filter-btn.active {
            background-color: #5fcb71;
            color: white;
        }
    `;
    document.head.appendChild(style);
}

function displayProducts(products) {
    const portfolioContainer = document.querySelector('.portfolio-section .row');
    if (!portfolioContainer) return;

    // Safely get section title element if it exists
    const sectionTitleElement = portfolioContainer.querySelector('.section-title');
    const sectionTitle = sectionTitleElement ? sectionTitleElement.parentElement : null;
    
    // Create loading container if products are present
    if (products.length > 0) {
        let loadingContainer = portfolioContainer.querySelector('.loading-container');
        if (!loadingContainer) {
            loadingContainer = document.createElement('div');
            loadingContainer.className = 'loading-container is-loading col-12';
            loadingContainer.innerHTML = `
                <div class="loading-overlay">
                    <div class="loading-spinner"></div>
                </div>
            `;
            portfolioContainer.appendChild(loadingContainer);
        } else {
            loadingContainer.classList.add('is-loading');
        }
    }

    // Remove old items except title and loading container
    const loadingContainer = portfolioContainer.querySelector('.loading-container');
    const children = Array.from(portfolioContainer.children);
    for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        // Check if sectionTitle exists and if the child is not the section title or loading container
        if ((sectionTitle && child !== sectionTitle) && child !== loadingContainer) {
            portfolioContainer.removeChild(child);
        }
    }

    if (products.length === 0) {
        const noProductsMsg = document.createElement('div');
        noProductsMsg.className = 'col-12 text-center';
        noProductsMsg.innerHTML = '<p>No products found in this category.</p>';
        portfolioContainer.appendChild(noProductsMsg);
        return;
    }

    products.forEach((product, index) => {
        const productId = product._id || product.id;
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'col-lg-4 col-md-6 p-2';
        portfolioItem.setAttribute('data-category', product.category.slug);
        

        portfolioItem.innerHTML = `
            <div class="portfolio-item product-card" data-description="${product.description || 'High-quality product from Kingdom Spices Herbs'}" data-details='["Premium Quality", "Export Grade", "${product.category.name}"]'>
                <img src="${product.image}" alt="${product.name}">
                <div class="portfolio-content-overlay">
                    <h3 class="product-title"><a href="product-details.html?id=${productId}">${product.name}</a></h3>
                    <p>${product.category.name}</p>
                    <a class="portfolio-link-icon" href="product-details.html?id=${productId}">
                        <i class="bi bi-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        portfolioContainer.appendChild(portfolioItem);
    });
    
    // Refresh AOS to detect new elements
    if (typeof AOS !== 'undefined') {
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    }
}

function setupCategoryFilterEvents(allProducts) {
    const filterButtons = document.querySelectorAll('.category-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show loading indicator
            const portfolioContainer = document.querySelector('.portfolio-section .row');
            if (portfolioContainer) {
                let loadingContainer = portfolioContainer.querySelector('.loading-container');
                if (!loadingContainer) {
                    loadingContainer = document.createElement('div');
                    loadingContainer.className = 'loading-container is-loading col-12';
                    loadingContainer.innerHTML = `
                        <div class="loading-overlay">
                            <div class="loading-spinner"></div>
                        </div>
                    `;
                    portfolioContainer.appendChild(loadingContainer);
                } else {
                    loadingContainer.classList.add('is-loading');
                }
            }

            const category = this.getAttribute('data-category');
            
            // Filter products based on category
            let filteredProducts;
            if (category === 'all') {
                filteredProducts = allProducts;
            } else {
                filteredProducts = allProducts.filter(product => product.category.slug === category);
            }

            displayProducts(filteredProducts);

            // Remove loading indicator
            const loadingContainer = portfolioContainer.querySelector('.loading-container');
            if (loadingContainer) {
                loadingContainer.classList.remove('is-loading');
                setTimeout(() => {
                    loadingContainer.remove();
                }, 300);
            }

        });
    });
}

/* ============================
   Product Details Page
=============================== */
async function initializeProductDetailsPage() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            console.error('No product ID in URL');
            return;
        }

        const product = await ApiService.getProductById(productId);
        if (!product) {
            console.error('Product not found');
            return;
        }

        document.title = `${product.name} - Gardenic`;

        const breadcrumbTitle = document.querySelector('.breadcumb-title h1');
        if (breadcrumbTitle) breadcrumbTitle.textContent = product.name;

        const breadcrumbText = document.querySelector('.breadcumb-content-text span');
        if (breadcrumbText) breadcrumbText.textContent = product.name;

        const productName = document.getElementById('product-name');
        if (productName) productName.textContent = product.name;

        const productDescription = document.getElementById('product-description');
        if (productDescription) productDescription.textContent = product.description;

        const productCategory = document.getElementById('product-category');
        if (productCategory) productCategory.textContent = product.category.name;

        const productDate = document.getElementById('product-date');
        if (productDate) productDate.textContent = formatDate(product.createdAt);

        const productImage = document.getElementById('product-image');
        if (productImage) {
            productImage.src = product.image;
            productImage.alt = product.name;
        }

        const shareButton = document.getElementById('share-button');
        const shareMessage = document.getElementById('share-message');
        if (shareButton && shareMessage) {
            shareButton.addEventListener('click', async () => {
                const success = await copyToClipboard(window.location.href);
                if (success) {
                    shareMessage.style.display = 'inline';
                    setTimeout(() => shareMessage.style.display = 'none', 3000);
                }
            });
        }

        // Related Products
        const relatedContainer = document.querySelector('.portfolio-details-overview + .row');
        if (relatedContainer) {
            const allProducts = await ApiService.getProducts();
            const currentCategory = product.category?.slug || product.category?.name || product.category;

            const relatedProducts = allProducts.filter(p => {
                const pCategory = p.category?.slug || p.category?.name || p.category;
                const pId = p._id || p.id;
                return pCategory === currentCategory && pId !== (product._id || product.id);
            });

            const displayRelated = relatedProducts.slice(0, 3);
            relatedContainer.innerHTML = '';

            displayRelated.forEach(rp => {
                const rpId = rp._id || rp.id;
                const col = document.createElement('div');
                col.className = 'col-lg-4 col-md-6';
                col.innerHTML = `
                    <div class="portfolio-details-thumb">
                        <a href="product-details.html?id=${rpId}">
                            <img src="${rp.image}" alt="${rp.name}">
                        </a>
                    </div>
                `;
                relatedContainer.appendChild(col);
            });

            if (displayRelated.length === 0) {
                relatedContainer.innerHTML = `<p>No related projects found.</p>`;
            }
        }
    } catch (error) {
        console.error('Error initializing Product Details page:', error);
    }
}
