/**
 * Performance optimizations for Kingdom Spices Herbs website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Optimize image loading
    optimizeImageLoading();
    
    // Optimize scroll performance
    optimizeScrollPerformance();
    
    // Optimize slider performance
    optimizeSliderPerformance();
});

/**
 * Optimize image loading with lazy loading and proper sizing
 */
function optimizeImageLoading() {
    // Add lazy loading to images that don't already have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
    
    // Prevent layout shifts by setting dimensions where missing
    const undimensionedImages = document.querySelectorAll('img:not([width]):not([height])');
    undimensionedImages.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });
}

/**
 * Optimize scroll performance with throttling and passive event listeners
 */
function optimizeScrollPerformance() {
    // Use passive scroll listeners
    const supportsPassive = checkPassiveSupport();
    const wheelOpt = supportsPassive ? { passive: true } : false;
    
    // Add passive listeners to common events
    window.addEventListener('scroll', scrollHandler, wheelOpt);
    window.addEventListener('touchmove', scrollHandler, wheelOpt);
    window.addEventListener('wheel', scrollHandler, wheelOpt);
    
    // Throttle scroll events
    let scrollTimeout;
    function scrollHandler() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                // Handle scroll events here if needed
            }, 100);
        }
    }
}

/**
 * Optimize slider performance
 */
function optimizeSliderPerformance() {
    // Reduce animation complexity on mobile
    if (window.innerWidth < 768) {
        const sliderElements = document.querySelectorAll('.slide-zoom-in, .slide-pan-right, .slide-pan-up');
        sliderElements.forEach(el => {
            el.style.animation = 'none';
        });
    }
    
    // Optimize swiper slider if it exists
    if (typeof Swiper !== 'undefined' && document.querySelector('.swiper-container')) {
        // Swiper is already initialized in main.js, but we can add additional optimizations
        document.addEventListener('visibilitychange', function() {
            // Pause animations when tab is not visible
            const swiperContainer = document.querySelector('.swiper-container');
            if (swiperContainer && swiperContainer.swiper) {
                if (document.hidden) {
                    swiperContainer.swiper.autoplay.stop();
                } else {
                    swiperContainer.swiper.autoplay.start();
                }
            }
        });
    }
}

/**
 * Check if browser supports passive event listeners
 */
function checkPassiveSupport() {
    let supportsPassive = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get: function() {
                supportsPassive = true;
                return true;
            }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
    } catch (e) {}
    return supportsPassive;
}