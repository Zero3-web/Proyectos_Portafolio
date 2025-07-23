// Funciones principales de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Inicializar navegación responsive
    initMobileMenu();
    
    // Inicializar búsqueda
    initSearch();
    
    // Cargar productos destacados si estamos en la página principal
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadFeaturedProducts();
    }
    
    // Inicializar eventos del formulario de newsletter
    initNewsletter();
    
    // Inicializar efectos de scroll
    initScrollEffects();
    
    // Actualizar año en el footer
    updateFooterYear();
}

// Menú móvil responsive
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}

// Sistema de búsqueda
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            } else {
                hideSearchResults();
            }
        });

        // Búsqueda al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = e.target.value.trim();
                if (query) {
                    redirectToProductsWithSearch(query);
                }
            }
        });

        // Focus y blur events para el input de búsqueda
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('focused');
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                searchInput.parentElement.classList.remove('focused');
                hideSearchResults();
            }, 200);
        });
    }
}

function performSearch(query) {
    const results = searchProducts(query);
    showSearchResults(results, query);
}

function showSearchResults(results, query) {
    // Remover resultados anteriores
    hideSearchResults();
    
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;

    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-no-results">
                <p>No se encontraron productos para "${query}"</p>
            </div>
        `;
    } else {
        const maxResults = 5;
        const displayResults = results.slice(0, maxResults);
        
        resultsContainer.innerHTML = `
            ${displayResults.map(product => `
                <div class="search-result-item" onclick="goToProduct(${product.id})">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="search-result-info">
                        <div class="search-result-name">${product.name}</div>
                        <div class="search-result-brand">${product.brand}</div>
                        <div class="search-result-price">${formatPrice(product.price)}</div>
                    </div>
                </div>
            `).join('')}
            ${results.length > maxResults ? `
                <div class="search-see-all" onclick="redirectToProductsWithSearch('${query}')">
                    Ver todos los ${results.length} resultados
                </div>
            ` : ''}
        `;
    }
    
    searchContainer.appendChild(resultsContainer);
}

function hideSearchResults() {
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.remove();
    }
}

function redirectToProductsWithSearch(query) {
    window.location.href = `productos.html?search=${encodeURIComponent(query)}`;
}

function goToProduct(productId) {
    // Por ahora, redirigir a la página de productos con el filtro correspondiente
    const product = getProductById(productId);
    if (product) {
        window.location.href = `productos.html?category=${product.category}`;
    }
}

// Cargar productos destacados en la página principal
function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products-grid');
    if (!featuredGrid) return;

    const featuredProducts = getFeaturedProducts();
    const maxProducts = 8; // Mostrar máximo 8 productos
    
    featuredGrid.innerHTML = featuredProducts.slice(0, maxProducts).map(product => 
        createProductCard(product)
    ).join('');
}

// Crear tarjeta de producto
function createProductCard(product) {
    const discountBadge = product.discount > 0 ? 
        `<div class="product-badge">-${product.discount}%</div>` : '';
    
    const originalPriceDisplay = product.originalPrice ? 
        `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : '';
    
    const discountDisplay = product.discount > 0 ? 
        `<span class="discount">${product.discount}% OFF</span>` : '';

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${discountBadge}
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-text">(${product.reviews} reseñas)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${originalPriceDisplay}
                    ${discountDisplay}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? '<i class="fas fa-shopping-cart"></i> Agregar al Carrito' : 'Agotado'}
                </button>
            </div>
        </div>
    `;
}

// Newsletter
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Simular suscripción
                showNotification('¡Gracias por suscribirte! Recibirás nuestras mejores ofertas.', 'success');
                emailInput.value = '';
            } else {
                showNotification('Por favor, ingresa un email válido.', 'error');
            }
        });
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        closeNotification(notification.querySelector('.notification-close'));
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return 'linear-gradient(135deg, #28a745, #34ce57)';
        case 'error': return 'linear-gradient(135deg, #dc3545, #e55368)';
        case 'warning': return 'linear-gradient(135deg, #ffc107, #ffcd39)';
        default: return 'linear-gradient(135deg, #17a2b8, #3dd5f3)';
    }
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Efectos de scroll
function initScrollEffects() {
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Parallax effect para hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroSection.style.transform = `translateY(${parallax}px)`;
        });
    }
}

// Filtrar por categoría desde la página principal
function filterByCategory(category) {
    window.location.href = `productos.html?category=${category}`;
}

// Actualizar año en el footer
function updateFooterYear() {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }
}

// Lazy loading para imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src || image.src;
                    image.classList.remove('lazy');
                    imageObserver.unobserve(image);
                }
            });
        });

        images.forEach(image => imageObserver.observe(image));
    }
}

// Smooth scroll para enlaces internos
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Función para manejar errores de imágenes
function handleImageError(img) {
    img.src = 'https://via.placeholder.com/400x300/f0f0f0/cccccc?text=Imagen+no+disponible';
    img.alt = 'Imagen no disponible';
}

// Event listeners para imágenes
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
});

// Mejorar funcionalidad táctil y responsive
function initTouchEnhancements() {
    // Mejorar hover en dispositivos táctiles
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Eliminar hover states en dispositivos táctiles
        const hoverElements = document.querySelectorAll('.product-card, .category-card, .btn');
        hoverElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 300);
            });
        });
    }
    
    // Mejorar navegación con gestos de deslizamiento
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!startX || !startY) return;
        
        const xDiff = startX - e.touches[0].clientX;
        const yDiff = startY - e.touches[0].clientY;
        
        // Prevenir scroll horizontal accidental
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (Math.abs(xDiff) > 50) {
                // Opcional: implementar navegación por gestos
            }
        }
    });
    
    document.addEventListener('touchend', function() {
        startX = 0;
        startY = 0;
    });
}

// Optimizar rendimiento en dispositivos móviles
function initPerformanceOptimizations() {
    // Lazy loading mejorado
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Throttle para scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Código de scroll optimizado aquí
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
}

// Mejorar accesibilidad
function initAccessibilityEnhancements() {
    // Mejorar navegación por teclado
    const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });
    
    // Anunciar cambios importantes para screen readers
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Hacer disponible globalmente
    window.announceToScreenReader = announceToScreenReader;
}

// CSS adicional para mejoras móviles
const mobileEnhancementsCSS = `
    .touch-device .product-card:hover,
    .touch-device .category-card:hover,
    .touch-device .btn:hover {
        transform: none;
    }
    
    .touch-active {
        transform: scale(0.98);
        transition: transform 0.1s ease;
    }
    
    .keyboard-focus {
        outline: 3px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    /* Mejoras para dispositivos táctiles */
    @media (max-width: 768px) {
        .btn,
        .cart-btn,
        .menu-toggle,
        .add-to-cart,
        .category-card {
            min-height: 44px;
            min-width: 44px;
        }
        
        .nav-link {
            padding: 15px 10px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .product-card {
            -webkit-tap-highlight-color: transparent;
        }
        
        /* Mejorar área de toque para elementos pequeños */
        .quantity-btn,
        .remove-item,
        .close-cart {
            min-width: 44px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Scroll suave en contenedores */
        .cart-items {
            -webkit-overflow-scrolling: touch;
        }
        
        /* Evitar zoom en inputs */
        input, select, textarea {
            font-size: 16px;
        }
    }
    
    /* Optimizaciones para pantallas muy pequeñas */
    @media (max-width: 320px) {
        .container {
            padding: 0 8px;
        }
        
        .product-info {
            padding: 8px;
        }
        
        .btn {
            font-size: 13px;
            padding: 10px 12px;
        }
        
        .nav-logo {
            font-size: 18px;
        }
        
        .nav-logo i {
            font-size: 20px;
        }
    }
    
    /* Animaciones reducidas para usuarios que prefieren menos movimiento */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    
    /* Alto contraste mejorado */
    @media (prefers-contrast: high) {
        .btn-primary {
            background: #000;
            color: #fff;
            border: 2px solid #fff;
        }
        
        .product-card {
            border: 2px solid #000;
        }
        
        .nav-link:hover,
        .nav-link.active {
            background-color: #000;
            color: #fff;
        }
    }
`;

// Mejoras adicionales para dispositivos móviles y touch

// Función para detectar dispositivos móviles
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Función para detectar dispositivos táctiles
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Mejoras para dispositivos móviles
function initMobileEnhancements() {
    if (isMobileDevice() || isTouchDevice()) {
        // Agregar clase para estilos específicos móviles
        document.body.classList.add('mobile-device');
        
        // Mejorar el scroll suave en móviles
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Prevenir zoom accidental en inputs
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="number"], select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.fontSize = '16px';
            });
        });
        
        // Mejorar el área de toque de botones pequeños
        const smallButtons = document.querySelectorAll('.btn-sm, .close-btn, .quantity-btn');
        smallButtons.forEach(btn => {
            btn.style.minHeight = '44px';
            btn.style.minWidth = '44px';
        });
        
        // Optimizar imágenes para móviles
        optimizeImagesForMobile();
        
        // Añadir soporte para gestos de swipe
        initSwipeGestures();
    }
}

// Optimización de imágenes para móviles
function optimizeImagesForMobile() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Lazy loading mejorado
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
        
        // Evitar que las imágenes se desborden
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });
}

// Sistema de gestos de swipe para carruseles
function initSwipeGestures() {
    const testimonials = document.querySelector('.testimonials-grid');
    const products = document.querySelector('.products-grid');
    
    if (testimonials) {
        addSwipeSupport(testimonials);
    }
    
    if (products) {
        addSwipeSupport(products);
    }
}

function addSwipeSupport(element) {
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    let threshold = 100;
    let restraint = 100;
    
    element.addEventListener('touchstart', e => {
        const touchobj = e.changedTouches[0];
        startX = touchobj.pageX;
        startY = touchobj.pageY;
    }, { passive: true });
    
    element.addEventListener('touchend', e => {
        const touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            if (distX > 0) {
                // Swipe derecha
                element.scrollBy({ left: -200, behavior: 'smooth' });
            } else {
                // Swipe izquierda
                element.scrollBy({ left: 200, behavior: 'smooth' });
            }
        }
    }, { passive: true });
}

// Mejorar la navegación por teclado
function improveKeyboardNavigation() {
    // Hacer que todos los elementos interactivos sean accesibles por teclado
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .product-card, .add-to-cart');
    
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        // Agregar soporte para activación con Enter y Espacio
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
}

// Manejo inteligente de orientación
function handleOrientationChange() {
    window.addEventListener('orientationchange', () => {
        // Pequeño delay para que la orientación se complete
        setTimeout(() => {
            // Recalcular alturas y posiciones
            window.dispatchEvent(new Event('resize'));
            
            // Scroll al top si es necesario
            if (window.scrollY > window.innerHeight) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
    });
}

// Mejora del rendimiento en dispositivos móviles
function optimizePerformance() {
    // Usar requestAnimationFrame para animaciones suaves
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .product-card, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Debounce para eventos de scroll y resize
    let scrollTimeout;
    let resizeTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateScrollElements();
        }, 16); // ~60fps
    }, { passive: true });
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateResponsiveElements();
        }, 250);
    });
}

function updateScrollElements() {
    // Actualizar elementos que dependen del scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

function updateResponsiveElements() {
    // Recalcular elementos responsive
    const grids = document.querySelectorAll('.products-grid, .categories-grid, .testimonials-grid');
    grids.forEach(grid => {
        grid.style.gridTemplateColumns = '';
        // Forzar recálculo del layout
        grid.offsetHeight;
    });
}

// Inicializar todas las mejoras móviles
function initAllMobileEnhancements() {
    initMobileEnhancements();
    improveKeyboardNavigation();
    handleOrientationChange();
    optimizePerformance();
    
    // Agregar indicador de carga
    document.body.classList.add('mobile-optimized');
}

// Ejecutar mejoras móviles cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllMobileEnhancements);
} else {
    initAllMobileEnhancements();
}

// Aplicar mejoras al cargar
document.addEventListener('DOMContentLoaded', function() {
    initTouchEnhancements();
    initPerformanceOptimizations();
    initAccessibilityEnhancements();
    
    // Agregar CSS de mejoras móviles
    const mobileStyleSheet = document.createElement('style');
    mobileStyleSheet.textContent = mobileEnhancementsCSS;
    document.head.appendChild(mobileStyleSheet);
});

// Hacer funciones disponibles globalmente
window.filterByCategory = filterByCategory;
window.createProductCard = createProductCard;
window.showNotification = showNotification;
window.closeNotification = closeNotification;
