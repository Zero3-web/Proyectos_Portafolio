// Animaciones y efectos visuales adicionales para NetflixClone

class AnimationController {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }
    
    init() {
        this.initHoverEffects();
        this.initScrollAnimations();
        this.initLoadingAnimations();
        this.initParallaxEffects();
        this.initTypewriterEffect();
    }
    
    // Efectos de hover mejorados
    initHoverEffects() {
        if (this.isReducedMotion) return;
        
        // Efecto de hover para tarjetas de contenido
        document.addEventListener('mouseover', (e) => {
            const contentCard = e.target.closest('.content-card');
            if (contentCard) {
                this.animateCardHover(contentCard, true);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            const contentCard = e.target.closest('.content-card');
            if (contentCard) {
                this.animateCardHover(contentCard, false);
            }
        });
        
        // Efecto de hover para botones
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.animateButtonHover(btn, true);
            });
            
            btn.addEventListener('mouseleave', () => {
                this.animateButtonHover(btn, false);
            });
        });
    }
    
    // Animación de hover para tarjetas
    animateCardHover(card, isHover) {
        const img = card.querySelector('img');
        const overlay = card.querySelector('.content-overlay');
        
        if (isHover) {
            gsap.to(card, {
                scale: 1.05,
                rotationY: 5,
                z: 50,
                duration: 0.3,
                ease: "power2.out",
                transformOrigin: "center center"
            });
            
            gsap.to(img, {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(overlay, {
                y: 0,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Efecto de partículas
            this.createHoverParticles(card);
        } else {
            gsap.to(card, {
                scale: 1,
                rotationY: 0,
                z: 0,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(img, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(overlay, {
                y: "100%",
                opacity: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }
    
    // Animación de hover para botones
    animateButtonHover(btn, isHover) {
        if (isHover) {
            gsap.to(btn, {
                scale: 1.05,
                y: -2,
                duration: 0.2,
                ease: "power2.out"
            });
            
            // Efecto de brillo
            this.createButtonGlow(btn);
        } else {
            gsap.to(btn, {
                scale: 1,
                y: 0,
                duration: 0.2,
                ease: "power2.out"
            });
        }
    }
    
    // Crear partículas en hover
    createHoverParticles(element) {
        const rect = element.getBoundingClientRect();
        const particleCount = 5;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
            `;
            
            document.body.appendChild(particle);
            
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                scale: 0,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    document.body.removeChild(particle);
                }
            });
        }
    }
    
    // Crear efecto de brillo en botones
    createButtonGlow(btn) {
        const glow = document.createElement('div');
        glow.className = 'button-glow';
        glow.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            pointer-events: none;
            z-index: 1;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(glow);
        
        gsap.to(glow, {
            left: "100%",
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                btn.removeChild(glow);
            }
        });
    }
    
    // Animaciones de scroll
    initScrollAnimations() {
        if (this.isReducedMotion) return;
        
        // Intersection Observer para elementos que aparecen al hacer scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElementInView(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar elementos animables
        document.querySelectorAll('.section-title, .content-section, .hero-text').forEach(el => {
            observer.observe(el);
        });
        
        // Parallax en el hero
        window.addEventListener('scroll', () => {
            this.updateParallax();
        });
    }
    
    // Animar elemento cuando entra en vista
    animateElementInView(element) {
        if (element.classList.contains('section-title')) {
            gsap.fromTo(element, 
                {
                    x: -50,
                    opacity: 0
                },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }
            );
        } else if (element.classList.contains('content-section')) {
            const cards = element.querySelectorAll('.swiper-slide');
            gsap.fromTo(cards,
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out"
                }
            );
        } else if (element.classList.contains('hero-text')) {
            gsap.fromTo(element.children,
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out"
                }
            );
        }
    }
    
    // Efecto parallax
    updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-video');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            gsap.to(element, {
                y: scrolled * speed,
                duration: 0.1,
                ease: "none"
            });
        });
    }
    
    // Inicializar efectos parallax
    initParallaxEffects() {
        if (this.isReducedMotion) return;
        
        // Mouse parallax en el hero
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                gsap.to('.hero-content', {
                    x: (x - 0.5) * 20,
                    y: (y - 0.5) * 20,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            hero.addEventListener('mouseleave', () => {
                gsap.to('.hero-content', {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        }
    }
    
    // Animaciones de carga
    initLoadingAnimations() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            // Animación del logo
            gsap.to('.loading-logo', {
                scale: 1.1,
                duration: 1,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1
            });
            
            // Animación del spinner
            gsap.to('.loading-spinner', {
                rotation: 360,
                duration: 1,
                ease: "none",
                repeat: -1
            });
        }
    }
    
    // Efecto typewriter para títulos
    initTypewriterEffect() {
        const titles = document.querySelectorAll('[data-typewriter]');
        
        titles.forEach(title => {
            const text = title.textContent;
            title.textContent = '';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                title.textContent += text.charAt(i);
                i++;
                
                if (i >= text.length) {
                    clearInterval(typeInterval);
                }
            }, 100);
        });
    }
    
    // Animación de modal
    animateModalOpen(modal) {
        gsap.set(modal, { display: 'flex' });
        gsap.fromTo(modal.querySelector('.modal-overlay'),
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );
        gsap.fromTo(modal.querySelector('.modal-content'),
            { 
                scale: 0.8,
                opacity: 0,
                y: 50
            },
            { 
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "back.out(1.7)"
            }
        );
    }
    
    // Animación de cierre de modal
    animateModalClose(modal) {
        gsap.to(modal.querySelector('.modal-overlay'),
            { opacity: 0, duration: 0.3 }
        );
        gsap.to(modal.querySelector('.modal-content'),
            { 
                scale: 0.8,
                opacity: 0,
                y: 50,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    modal.style.display = 'none';
                }
            }
        );
    }
    
    // Animación de notificación
    animateNotification(notification) {
        gsap.fromTo(notification,
            {
                x: 300,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.5,
                ease: "back.out(1.7)"
            }
        );
        
        // Auto-hide después de 3 segundos
        setTimeout(() => {
            gsap.to(notification, {
                x: 300,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    notification.remove();
                }
            });
        }, 3000);
    }
    
    // Animación de búsqueda
    animateSearchResults(container) {
        const items = container.querySelectorAll('.search-result-item');
        gsap.fromTo(items,
            {
                y: 20,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.out"
            }
        );
    }
    
    // Animación de favoritos
    animateFavoriteToggle(element, isAdding) {
        if (isAdding) {
            gsap.to(element, {
                scale: 1.3,
                duration: 0.2,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(element, {
                        scale: 1,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });
            
            // Efecto de corazón
            this.createHeartEffect(element);
        } else {
            gsap.to(element, {
                scale: 0.8,
                duration: 0.2,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(element, {
                        scale: 1,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });
        }
    }
    
    // Crear efecto de corazón
    createHeartEffect(element) {
        const rect = element.getBoundingClientRect();
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(heart);
        
        gsap.to(heart, {
            y: -50,
            scale: 0,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                document.body.removeChild(heart);
            }
        });
    }
    
    // Limpiar animaciones
    cleanup() {
        gsap.killTweensOf("*");
    }
}

// Crear instancia del controlador de animaciones
let animationController;

// Inicializar cuando GSAP esté disponible
if (typeof gsap !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        animationController = new AnimationController();
    });
} else {
    // Cargar GSAP si no está disponible
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
        document.addEventListener('DOMContentLoaded', () => {
            animationController = new AnimationController();
        });
    };
    document.head.appendChild(script);
}

// Exportar para uso global
window.AnimationController = AnimationController;
