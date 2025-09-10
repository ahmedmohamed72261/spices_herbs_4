/**
 * API Service for Green Globe Herbs
 * Handles all API calls to the backend
 */

const API_BASE_URL = 'https://kingdom-spices-herbs-backend-dashbo.vercel.app/api';

const ApiService = {
    /**
     * Fetch all categories
     * @returns {Promise<Array>} Array of categories
     */
    getCategories: async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Failed to fetch categories');
            }
            
            return data.data.map(category => ({
                id: category._id,
                name: category.name,
                productCount: category.productCount || 0,
                slug: category.slug
            }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },
    
    /**
     * Fetch all products
     * @returns {Promise<Array>} Array of products
     */
    getProducts: async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Failed to fetch products');
            }
            
            return data.data.map(product => ({
                id: product._id,
                name: product.name,
                description: product.description,
                image: product.image,
                category: product.category,
                createdAt: product.createdAt,
                inStock: product.inStock
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },
    
    /**
     * Fetch a single product by ID
     * @param {string} id - Product ID
     * @returns {Promise<Object>} Product object
     */
    getProductById: async function(id) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === id) || null;
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            return null;
        }
    },
    
    /**
     * Fetch products by category slug
     * @param {string} categorySlug - Category slug
     * @returns {Promise<Array>} Array of products in the category
     */
    getProductsByCategory: async function(categorySlug) {
        try {
            const products = await this.getProducts();
            return products.filter(product => product.category.slug === categorySlug);
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return [];
        }
    },
    
    /**
     * Format date to readable format
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate: function(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },
    
    /**
     * Fetch all certificates
     * @returns {Promise<Array>} Array of certificates
     */
    getCertificates: async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/certificates`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Failed to fetch certificates');
            }
            
            return data.data.map(certificate => ({
                id: certificate._id,
                name: certificate.name,
                description: certificate.description,
                image: certificate.image,
                isActive: certificate.isActive,
                category: certificate.category,
                createdAt: certificate.createdAt
            }));
        } catch (error) {
            console.error('Error fetching certificates:', error);
            return [];
        }
    },
    
    /**
     * Fetch all team members
     * @returns {Promise<Array>} Array of team members
     */
    getTeamMembers: async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/team`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Failed to fetch team members');
            }
            
            return data.data.map(member => ({
                id: member._id,
                name: member.name,
                position: member.position,
                image: member.image,
                email: member.email,
                phone: member.phone,
                whatsapp: member.whatsapp,
                isActive: member.isActive,
                startDate: member.startDate
            }));
        } catch (error) {
            console.error('Error fetching team members:', error);
            return [];
        }
    },
    
    /**
     * Fetch contact information
     * @returns {Promise<Object>} Contact information
     */
    getContactInfo: async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/contact`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error('Failed to fetch contact information');
            }
            
            // Transform the array into an object with type as keys
            const contactInfo = {};
            data.data.forEach(item => {
                contactInfo[item.type] = {
                    label: item.label,
                    value: item.value
                };
            });
            
            return contactInfo;
        } catch (error) {
            console.error('Error fetching contact information:', error);
            return {};
        }
    },
    
    /**
     * Send contact message
     * @param {Object} messageData - Message data
     * @returns {Promise<Object>} Response data
     */
    sendContactMessage: async function(messageData) {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to send message');
            }
            
            return data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
};