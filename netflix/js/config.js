// Configuración y utilidades adicionales para NetflixClone

// Configuración de desarrollo
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Configuración de la aplicación
const CONFIG = {
    // API Configuration (para futuras integraciones)
    API: {
        TMDB_BASE_URL: 'https://api.themoviedb.org/3',
        TMDB_IMAGE_BASE: 'https://image.tmdb.org/t/p/w500',
        YOUTUBE_BASE: 'https://www.youtube.com/embed/'
    },
    
    // Configuración de la aplicación
    APP: {
        VERSION: '1.0.0',
        NAME: 'NetflixClone',
        DESCRIPTION: 'Un clon moderno de Netflix',
        AUTHOR: 'NetflixClone Developer',
        MAX_FAVORITES: 100,
        SEARCH_DEBOUNCE: 300,
        ANIMATION_DURATION: 300
    },
    
    // Configuración de storage
    STORAGE: {
        FAVORITES_KEY: 'netflix-favorites',
        THEME_KEY: 'netflix-theme',
        USER_PREFERENCES: 'netflix-preferences'
    },
    
    // Configuración de responsive
    BREAKPOINTS: {
        MOBILE_S: 320,
        MOBILE_M: 375,
        MOBILE_L: 425,
        TABLET: 768,
        LAPTOP: 1024,
        LAPTOP_L: 1440,
        DESKTOP: 2560
    },
    
    // Configuración de animaciones
    ANIMATIONS: {
        DURATION: {
            FAST: 200,
            NORMAL: 300,
            SLOW: 500
        },
        EASING: {
            EASE_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
            EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
            EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
    }
};

// Utilidades globales
const UTILS = {
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Format duration
    formatDuration: (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    },
    
    // Format rating
    formatRating: (rating) => {
        return `⭐ ${rating.toFixed(1)}`;
    },
    
    // Generate unique ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Check if device is mobile
    isMobile: () => {
        return window.innerWidth <= CONFIG.BREAKPOINTS.TABLET;
    },
    
    // Check if device supports touch
    isTouchDevice: () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    },
    
    // Get random item from array
    getRandomItem: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    // Shuffle array
    shuffleArray: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // Sanitize HTML
    sanitizeHTML: (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },
    
    // Copy to clipboard
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy: ', err);
            return false;
        }
    },
    
    // Share content
    shareContent: async (data) => {
        if (navigator.share) {
            try {
                await navigator.share(data);
                return true;
            } catch (err) {
                console.error('Error sharing:', err);
                return false;
            }
        } else {
            // Fallback para navegadores que no soportan Web Share API
            return UTILS.copyToClipboard(data.url || data.text);
        }
    },
    
    // Get image with fallback
    getImageWithFallback: (src, fallback = 'https://via.placeholder.com/300x450?text=No+Image') => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(fallback);
            img.src = src;
        });
    },
    
    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Format date
    formatDate: (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    // Calculate reading time
    calculateReadingTime: (text) => {
        const wordsPerMinute = 200;
        const words = text.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min de lectura`;
    }
};

// Event emitter para comunicación entre componentes
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
    
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
}

// Logger personalizado
const Logger = {
    log: (message, data = null) => {
        if (isDevelopment) {
            console.log(`[NetflixClone] ${message}`, data || '');
        }
    },
    
    error: (message, error = null) => {
        console.error(`[NetflixClone Error] ${message}`, error || '');
    },
    
    warn: (message, data = null) => {
        if (isDevelopment) {
            console.warn(`[NetflixClone Warning] ${message}`, data || '');
        }
    }
};

// Performance monitor
const Performance = {
    marks: {},
    
    start: (name) => {
        Performance.marks[name] = performance.now();
        if (isDevelopment) {
            console.time(name);
        }
    },
    
    end: (name) => {
        if (Performance.marks[name]) {
            const duration = performance.now() - Performance.marks[name];
            Logger.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
            if (isDevelopment) {
                console.timeEnd(name);
            }
            delete Performance.marks[name];
            return duration;
        }
    }
};

// Exportar configuración y utilidades
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.UTILS = UTILS;
    window.EventEmitter = EventEmitter;
    window.Logger = Logger;
    window.Performance = Performance;
}

// Analytics básico (para futuras implementaciones)
const Analytics = {
    track: (event, properties = {}) => {
        if (isDevelopment) {
            Logger.log(`Analytics: ${event}`, properties);
        }
        // Aquí se puede integrar con Google Analytics, Mixpanel, etc.
    },
    
    pageView: (page) => {
        Analytics.track('page_view', { page });
    },
    
    userAction: (action, element) => {
        Analytics.track('user_action', { action, element });
    }
};

window.Analytics = Analytics;
