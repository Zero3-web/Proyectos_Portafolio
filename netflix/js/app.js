// Aplicación principal del clon de Netflix
class NetflixClone {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('netflix-favorites')) || [];
        this.currentTheme = localStorage.getItem('netflix-theme') || 'dark';
        this.searchResults = [];
        this.sliders = {};
        this.isSearching = false;
        
        this.init();
    }
    
    init() {
        this.initTheme();
        this.initEventListeners();
        this.initParticles();
        this.loadContent();
        this.initAnimations();
        this.hideLoadingScreen();
    }
    
    // Inicialización del tema
    initTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Inicialización de event listeners
    initEventListeners() {
        // Navegación scroll
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Búsqueda
        const searchInput = document.querySelector('.search-input');
        const searchIcon = document.querySelector('.search-icon');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
            searchInput.addEventListener('focus', this.showSearchResults.bind(this));
            searchInput.addEventListener('blur', this.hideSearchResults.bind(this));
        }
        
        // Tema
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
        
        // Menú móvil
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Modal
        const modal = document.getElementById('contentModal');
        const modalClose = document.querySelector('.modal-close');
        const modalOverlay = document.querySelector('.modal-overlay');
        
        if (modalClose) {
            modalClose.addEventListener('click', this.closeModal.bind(this));
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', this.closeModal.bind(this));
        }
        
        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
        
        // Enlaces de navegación
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });
    }
    
    // Manejo del scroll
    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Manejo de la búsqueda
    handleSearch(e) {
        const query = e.target.value.trim();
        const searchResults = document.querySelector('.search-results');
        
        if (query.length === 0) {
            searchResults.style.display = 'none';
            this.searchResults = [];
            return;
        }
        
        if (query.length < 2) return;
        
        this.searchResults = searchContent(query);
        this.displaySearchResults();
    }
    
    // Mostrar resultados de búsqueda
    displaySearchResults() {
        const searchResults = document.querySelector('.search-results');
        
        if (this.searchResults.length === 0) {
            searchResults.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-muted);">No se encontraron resultados</div>';
        } else {
            searchResults.innerHTML = this.searchResults.slice(0, 5).map(item => `
                <div class="search-result-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}" class="search-result-img">
                    <div class="search-result-info">
                        <h4>${item.title}</h4>
                        <p>${item.year} • ${item.type === 'movie' ? 'Película' : 'Serie'} • ⭐ ${item.rating}</p>
                    </div>
                </div>
            `).join('');
            
            // Agregar event listeners a los resultados
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    const id = parseInt(item.dataset.id);
                    const content = getAllContent().find(c => c.id === id);
                    if (content) {
                        this.openModal(content);
                        this.hideSearchResults();
                    }
                });
            });
        }
        
        searchResults.style.display = 'block';
    }
    
    // Mostrar resultados de búsqueda
    showSearchResults() {
        if (this.searchResults.length > 0) {
            document.querySelector('.search-results').style.display = 'block';
        }
    }
    
    // Ocultar resultados de búsqueda
    hideSearchResults() {
        setTimeout(() => {
            document.querySelector('.search-results').style.display = 'none';
        }, 200);
    }
    
    // Cambiar tema
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('netflix-theme', this.currentTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Toggle menú móvil
    toggleMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const searchContainer = document.querySelector('.search-container');
        
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        searchContainer.classList.toggle('active');
    }
    
    // Navegación
    handleNavigation(e) {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        
        // Remover clase active de todos los links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Agregar clase active al link clickeado
        e.target.classList.add('active');
        
        // Scroll suave a la sección
        if (target && target.startsWith('#')) {
            const section = document.querySelector(target);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Cerrar menú móvil si está abierto
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    }
    
    // Inicializar partículas
    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', appConfig.particlesConfig);
        }
    }
    
    // Cargar contenido
    loadContent() {
        this.loadTrendingContent();
        this.loadMoviesContent();
        this.loadSeriesContent();
        this.loadActionContent();
        this.loadFavorites();
        
        // Inicializar sliders después de cargar el contenido
        setTimeout(() => {
            this.initSliders();
        }, 100);
    }
    
    // Cargar contenido tendencias
    loadTrendingContent() {
        const container = document.getElementById('trending-content');
        const trending = getMoviesByCategory('trending');
        container.innerHTML = this.generateContentSlides(trending);
    }
    
    // Cargar contenido películas
    loadMoviesContent() {
        const container = document.getElementById('movies-content');
        const movies = getMoviesByCategory('movies');
        container.innerHTML = this.generateContentSlides(movies);
    }
    
    // Cargar contenido series
    loadSeriesContent() {
        const container = document.getElementById('series-content');
        const series = getMoviesByCategory('series');
        container.innerHTML = this.generateContentSlides(series);
    }
    
    // Cargar contenido acción
    loadActionContent() {
        const container = document.getElementById('action-content');
        const action = getMoviesByCategory('action');
        container.innerHTML = this.generateContentSlides(action);
    }
    
    // Generar slides de contenido
    generateContentSlides(content) {
        return content.map(item => `
            <div class="swiper-slide">
                <div class="content-card" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="content-overlay">
                        <h3 class="content-title">${item.title}</h3>
                        <div class="content-meta">
                            <span class="content-rating">${item.rating}</span>
                            <span>${item.year}</span>
                            <span>${item.duration}</span>
                        </div>
                        <div class="content-actions">
                            <button class="action-btn play-btn" title="Reproducir">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="action-btn favorite-btn" title="Agregar a favoritos" data-id="${item.id}">
                                <i class="fas ${this.favorites.includes(item.id) ? 'fa-heart' : 'fa-heart-o'}"></i>
                            </button>
                            <button class="action-btn info-btn" title="Más información">
                                <i class="fas fa-info-circle"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Inicializar sliders
    initSliders() {
        const sliderSelectors = [
            '.trending-slider',
            '.movies-slider',
            '.series-slider',
            '.action-slider'
        ];
        
        sliderSelectors.forEach(selector => {
            const sliderElement = document.querySelector(selector);
            if (sliderElement && typeof Swiper !== 'undefined') {
                this.sliders[selector] = new Swiper(selector, appConfig.sliderSettings);
            }
        });
        
        // Agregar event listeners a las tarjetas
        this.addContentEventListeners();
    }
    
    // Agregar event listeners al contenido
    addContentEventListeners() {
        // Tarjetas de contenido
        document.querySelectorAll('.content-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.action-btn')) return;
                
                const id = parseInt(card.dataset.id);
                const content = getAllContent().find(c => c.id === id);
                if (content) {
                    this.openModal(content);
                }
            });
        });
        
        // Botones de favoritos
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.toggleFavorite(id);
                
                const icon = btn.querySelector('i');
                if (this.favorites.includes(id)) {
                    icon.className = 'fas fa-heart';
                    btn.title = 'Quitar de favoritos';
                } else {
                    icon.className = 'fas fa-heart-o';
                    btn.title = 'Agregar a favoritos';
                }
            });
        });
        
        // Botones de información
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.content-card');
                const id = parseInt(card.dataset.id);
                const content = getAllContent().find(c => c.id === id);
                if (content) {
                    this.openModal(content);
                }
            });
        });
        
        // Botones de reproducción
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.content-card');
                const id = parseInt(card.dataset.id);
                const content = getAllContent().find(c => c.id === id);
                if (content) {
                    this.playContent(content);
                }
            });
        });
    }
    
    // Abrir modal
    openModal(content) {
        const modal = document.getElementById('contentModal');
        
        // Llenar información del modal
        modal.querySelector('.modal-title').textContent = content.title;
        modal.querySelector('.rating').textContent = `⭐ ${content.rating}`;
        modal.querySelector('.year').textContent = content.year;
        modal.querySelector('.duration').textContent = content.duration;
        modal.querySelector('.modal-description').textContent = content.description;
        
        // Configurar video
        const video = modal.querySelector('video');
        video.src = content.trailer;
        
        // Configurar botón de favoritos
        const favoriteBtn = modal.querySelector('.add-to-favorites');
        const favoriteIcon = favoriteBtn.querySelector('i');
        if (this.favorites.includes(content.id)) {
            favoriteIcon.className = 'fas fa-check';
            favoriteBtn.innerHTML = '<i class="fas fa-check"></i> En Mi Lista';
        } else {
            favoriteIcon.className = 'fas fa-plus';
            favoriteBtn.innerHTML = '<i class="fas fa-plus"></i> Mi Lista';
        }
        
        favoriteBtn.onclick = () => {
            this.toggleFavorite(content.id);
            if (this.favorites.includes(content.id)) {
                favoriteBtn.innerHTML = '<i class="fas fa-check"></i> En Mi Lista';
            } else {
                favoriteBtn.innerHTML = '<i class="fas fa-plus"></i> Mi Lista';
            }
            this.loadFavorites();
        };
        
        // Configurar botón de reproducción
        const playBtn = modal.querySelector('.btn-primary');
        playBtn.onclick = () => {
            this.playContent(content);
        };
        
        // Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Cerrar modal
    closeModal() {
        const modal = document.getElementById('contentModal');
        const video = modal.querySelector('video');
        
        video.pause();
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Reproducir contenido
    playContent(content) {
        // Aquí se puede implementar la lógica de reproducción
        // Por ahora, solo mostraremos una notificación
        this.showNotification(`Reproduciendo: ${content.title}`, 'success');
        
        // En una implementación real, aquí se abriría el reproductor de video
        console.log('Reproduciendo:', content);
    }
    
    // Toggle favorito
    toggleFavorite(id) {
        const index = this.favorites.indexOf(id);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showNotification('Eliminado de Mi Lista', 'info');
        } else {
            this.favorites.push(id);
            this.showNotification('Agregado a Mi Lista', 'success');
        }
        
        localStorage.setItem('netflix-favorites', JSON.stringify(this.favorites));
        this.loadFavorites();
    }
    
    // Cargar favoritos
    loadFavorites() {
        const container = document.getElementById('favorites-grid');
        const allContent = getAllContent();
        const favoriteContent = allContent.filter(item => this.favorites.includes(item.id));
        
        if (favoriteContent.length === 0) {
            container.innerHTML = `
                <div class="empty-favorites">
                    <i class="fas fa-heart"></i>
                    <p>Agrega contenido a tu lista de favoritos</p>
                </div>
            `;
        } else {
            container.innerHTML = favoriteContent.map(item => `
                <div class="favorite-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="favorite-overlay">
                        <button class="remove-favorite" data-id="${item.id}" title="Quitar de favoritos">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Agregar event listeners
            container.querySelectorAll('.favorite-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-favorite')) return;
                    
                    const id = parseInt(item.dataset.id);
                    const content = allContent.find(c => c.id === id);
                    if (content) {
                        this.openModal(content);
                    }
                });
            });
            
            container.querySelectorAll('.remove-favorite').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = parseInt(btn.dataset.id);
                    this.toggleFavorite(id);
                });
            });
        }
    }
    
    // Inicializar animaciones
    initAnimations() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }
    }
    
    // Ocultar pantalla de carga
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 2000);
    }
    
    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Agregar estilos si no existen
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--dark-color);
                    color: var(--light-color);
                    padding: 1rem 1.5rem;
                    border-radius: var(--border-radius);
                    border-left: 4px solid var(--primary-color);
                    box-shadow: var(--shadow-heavy);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: var(--transition);
                    max-width: 300px;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .notification-success {
                    border-left-color: #28a745;
                }
                .notification-error {
                    border-left-color: #dc3545;
                }
                .notification-info {
                    border-left-color: #17a2b8;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Método para actualizar contenido dinámicamente
    updateContent(category, newContent) {
        movieData[category] = newContent;
        this.loadContent();
    }
    
    // Método para obtener estadísticas
    getStats() {
        return {
            totalContent: getAllContent().length,
            totalFavorites: this.favorites.length,
            totalMovies: getContentByType('movie').length,
            totalSeries: getContentByType('series').length,
            currentTheme: this.currentTheme
        };
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new NetflixClone();
    
    // Hacer la instancia disponible globalmente para debugging
    window.netflixApp = app;
});

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
});

// Manejar promesas rechazadas
window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesa rechazada:', e.reason);
});
