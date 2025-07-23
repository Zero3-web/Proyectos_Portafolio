// Funciones específicas para la página de inicio
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
        initHomePage();
    }
});

function initHomePage() {
    // Cargar productos destacados
    loadFeaturedProductsHome();
    
    // Inicializar animaciones de entrada
    initHomeAnimations();
    
    // Inicializar efectos de hover en categorías
    initCategoryHoverEffects();
    
    // Inicializar carrusel de testimonios
    initTestimonials();
    
    // Inicializar contador de estadísticas
    initStatsCounter();
}

function loadFeaturedProductsHome() {
    const featuredGrid = document.getElementById('featured-products-grid');
    if (!featuredGrid) return;

    // Mostrar loading
    featuredGrid.innerHTML = `
        <div class="loading-container" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: var(--primary-color);"></i>
            <p style="margin-top: 20px; color: var(--gray-600);">Cargando productos...</p>
        </div>
    `;

    // Simular carga asíncrona
    setTimeout(() => {
        const featuredProducts = getFeaturedProducts();
        const maxProducts = 8;
        
        if (featuredProducts.length === 0) {
            featuredGrid.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-circle" style="font-size: 48px; color: var(--gray-400);"></i>
                    <p style="margin-top: 20px; color: var(--gray-600);">No hay productos destacados disponibles</p>
                </div>
            `;
            return;
        }

        featuredGrid.innerHTML = featuredProducts.slice(0, maxProducts).map(product => 
            createProductCard(product)
        ).join('');

        // Animar productos al cargar
        animateProductCards();
    }, 800);
}

function animateProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initHomeAnimations() {
    // Animación del hero al cargar
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent && heroImage) {
        // Ocultar inicialmente
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateX(-50px)';
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(50px)';
        
        // Animar después de un delay
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroImage.style.transition = 'opacity 1s ease, transform 1s ease';
            
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateX(0)';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 200);
    }

    // Animaciones al hacer scroll
    initScrollAnimations();
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elementos para animar
    const elementsToAnimate = document.querySelectorAll('.featured-categories, .featured-products, .newsletter');
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

function initCategoryHoverEffects() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Efecto de elevación y escala
            card.style.transform = 'translateY(-15px) scale(1.02)';
            card.style.transition = 'transform 0.3s ease';
            
            // Efecto en la imagen
            const img = card.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.1)';
                img.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            
            const img = card.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
        
        // Efecto de click
        card.addEventListener('click', (e) => {
            // Efecto de ripple
            createRippleEffect(e, card);
        });
    });
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(233, 30, 99, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function initTestimonials() {
    // Testimonios de clientes (datos simulados)
    const testimonials = [
        {
            name: "María González",
            rating: 5,
            comment: "¡Increíble calidad! Los productos llegaron perfectos y el envío fue súper rápido.",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        {
            name: "Ana López",
            rating: 5,
            comment: "Mi tienda favorita de maquillaje. Siempre encuentro lo que busco a excelente precio.",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        {
            name: "Carmen Ruiz",
            rating: 4,
            comment: "Excelente servicio al cliente y productos de calidad. Totalmente recomendado.",
            avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        }
    ];

    // Crear sección de testimonios dinámicamente si no existe
    createTestimonialsSection(testimonials);
}

function createTestimonialsSection(testimonials) {
    const featuredProducts = document.querySelector('.featured-products');
    const newsletter = document.querySelector('.newsletter');
    
    if (!featuredProducts || !newsletter) return;

    const testimonialsSection = document.createElement('section');
    testimonialsSection.className = 'testimonials';
    testimonialsSection.innerHTML = `
        <div class="container">
            <h2>Lo que dicen nuestras clientas</h2>
            <div class="testimonials-grid">
                ${testimonials.map(testimonial => `
                    <div class="testimonial-card">
                        <div class="testimonial-rating">
                            ${generateStars(testimonial.rating)}
                        </div>
                        <p class="testimonial-comment">"${testimonial.comment}"</p>
                        <div class="testimonial-author">
                            <img src="${testimonial.avatar}" alt="${testimonial.name}">
                            <span class="author-name">${testimonial.name}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Insertar entre productos destacados y newsletter
    newsletter.parentNode.insertBefore(testimonialsSection, newsletter);
}

function initStatsCounter() {
    const stats = [
        { number: 10000, label: "Clientes Felices", suffix: "+" },
        { number: 500, label: "Productos", suffix: "+" },
        { number: 50, label: "Marcas", suffix: "+" },
        { number: 99, label: "Satisfacción", suffix: "%" }
    ];

    createStatsSection(stats);
}

function createStatsSection(stats) {
    const heroSection = document.querySelector('.hero');
    const categoriesSection = document.querySelector('.featured-categories');
    
    if (!heroSection || !categoriesSection) return;

    const statsSection = document.createElement('section');
    statsSection.className = 'stats-section';
    statsSection.innerHTML = `
        <div class="container">
            <div class="stats-grid">
                ${stats.map(stat => `
                    <div class="stat-item">
                        <div class="stat-number" data-target="${stat.number}">0</div>
                        <div class="stat-suffix">${stat.suffix}</div>
                        <div class="stat-label">${stat.label}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Insertar después del hero
    heroSection.parentNode.insertBefore(statsSection, categoriesSection);

    // Inicializar contador animado
    initAnimatedCounter();
}

function initAnimatedCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 segundos
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, duration / steps);
}

// CSS dinámico para las nuevas secciones
const homePageCSS = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 1s ease, transform 1s ease;
    }

    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .testimonials {
        padding: 80px 0;
        background-color: var(--gray-100);
    }

    .testimonials h2 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 50px;
        color: var(--dark-color);
    }

    .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
    }

    .testimonial-card {
        background: var(--white);
        padding: 30px;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        text-align: center;
        transition: var(--transition);
    }

    .testimonial-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .testimonial-rating {
        margin-bottom: 20px;
        color: var(--accent-color);
    }

    .testimonial-comment {
        font-style: italic;
        margin-bottom: 20px;
        color: var(--gray-700);
        line-height: 1.6;
    }

    .testimonial-author {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }

    .testimonial-author img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
    }

    .author-name {
        font-weight: 600;
        color: var(--dark-color);
    }

    .stats-section {
        padding: 60px 0;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: var(--white);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 40px;
        text-align: center;
    }

    .stat-item {
        padding: 20px;
    }

    .stat-number {
        font-size: 3rem;
        font-weight: bold;
        display: inline;
    }

    .stat-suffix {
        font-size: 2rem;
        font-weight: bold;
        display: inline;
        opacity: 0.9;
    }

    .stat-label {
        font-size: 1.1rem;
        margin-top: 10px;
        opacity: 0.9;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
        .testimonials-grid {
            grid-template-columns: 1fr;
        }
        
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
        }
        
        .stat-number {
            font-size: 2.5rem;
        }
        
        .stat-suffix {
            font-size: 1.8rem;
        }
    }

    @media (max-width: 480px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// Agregar CSS al documento
const homeStyleSheet = document.createElement('style');
homeStyleSheet.textContent = homePageCSS;
document.head.appendChild(homeStyleSheet);
