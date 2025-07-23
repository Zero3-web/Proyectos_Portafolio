# NetflixClone - Clon de Netflix Moderno y Responsive

Un clon completo y funcional de Netflix desarrollado con HTML5, CSS3 y JavaScript vanilla. Incluye características únicas como modo oscuro/claro, efectos de partículas, animaciones suaves y una interfaz completamente responsive.

## 🚀 Características

### ✨ Interfaz y Diseño
- **Diseño Completamente Responsive** - Optimizado para móviles, tablets y desktop
- **Modo Oscuro/Claro** - Cambio dinámico de tema con localStorage
- **Animaciones Suaves** - Efectos visuales modernos con GSAP y AOS
- **Efectos de Partículas** - Fondo animado con particles.js
- **UI/UX Moderna** - Interfaz inspirada en Netflix con toques únicos

### 🎬 Funcionalidades
- **Catálogo de Contenido** - Películas y series organizadas por categorías
- **Sistema de Búsqueda** - Búsqueda en tiempo real con resultados instantáneos
- **Lista de Favoritos** - Agregar/quitar contenido de "Mi Lista"
- **Modal de Información** - Vista detallada de películas y series
- **Reproductor de Video** - Preview de trailers y contenido
- **Navegación Intuitiva** - Sliders interactivos y navegación suave

### 📱 Responsive Design
- **Mobile First** - Diseñado primero para dispositivos móviles
- **Breakpoints Optimizados** - Adaptación perfecta a cualquier pantalla
- **Menú Hamburguesa** - Navegación móvil intuitiva
- **Touch Gestures** - Soporte para gestos táctiles en sliders

### ⚡ Rendimiento
- **Lazy Loading** - Carga de imágenes bajo demanda
- **Optimización de Animaciones** - Respeta las preferencias de accesibilidad
- **LocalStorage** - Persistencia de favoritos y preferencias
- **Código Limpio** - Arquitectura modular y mantenible

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica moderna
- **CSS3** - Estilos avanzados con variables CSS y Grid/Flexbox
- **JavaScript ES6+** - Funcionalidad moderna con clases y módulos

### Librerías Externas
- **Swiper.js** - Sliders interactivos y touch-friendly
- **AOS (Animate On Scroll)** - Animaciones al hacer scroll
- **Particles.js** - Efectos de partículas en el fondo
- **GSAP** - Animaciones avanzadas y efectos visuales
- **Font Awesome** - Iconografía moderna
- **Google Fonts** - Tipografía (Inter)

## 📁 Estructura del Proyecto

```
NetflixClone/
├── index.html              # Página principal
├── css/
│   ├── styles.css          # Estilos principales
│   └── responsive.css      # Estilos responsive
├── js/
│   ├── app.js             # Aplicación principal
│   ├── data.js            # Datos de películas y series
│   └── animations.js      # Controlador de animaciones
└── README.md              # Documentación
```

## 🚀 Instalación y Uso

### Opción 1: Servidor Local Simple
```bash
# Clona o descarga el proyecto
cd NetflixClone

# Inicia un servidor HTTP simple
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000

# Node.js (si tienes http-server instalado)
npx http-server -p 3000

# Abre http://localhost:3000 en tu navegador
```

### Opción 2: Live Server (VS Code)
1. Instala la extensión "Live Server" en VS Code
2. Abre el proyecto en VS Code
3. Click derecho en `index.html` → "Open with Live Server"

### Opción 3: Servidor Web
- Sube los archivos a cualquier servidor web
- Accede a `index.html` desde tu navegador

## 🎨 Personalización

### Cambiar Colores del Tema
Edita las variables CSS en `css/styles.css`:
```css
:root {
    --primary-color: #e50914;    /* Color principal (rojo Netflix) */
    --secondary-color: #0f1419;  /* Fondo principal */
    --dark-color: #141414;       /* Fondo oscuro */
    /* ... más variables */
}
```

### Agregar Contenido
Modifica el archivo `js/data.js` para agregar más películas y series:
```javascript
const movieData = {
    trending: [
        {
            id: 1,
            title: "Tu Película",
            type: "movie",
            year: 2024,
            rating: 8.5,
            duration: "120 min",
            genre: ["Acción", "Drama"],
            description: "Descripción de tu película...",
            image: "url-de-la-imagen",
            trailer: "url-del-trailer"
        }
        // ... más contenido
    ]
};
```

### Configurar Partículas
Personaliza el efecto de partículas en `js/data.js`:
```javascript
const appConfig = {
    particlesConfig: {
        particles: {
            number: { value: 80 },    // Cantidad de partículas
            color: { value: "#e50914" }, // Color
            // ... más configuraciones
        }
    }
};
```

## 📱 Características Responsive

### Breakpoints
- **320px+** - Móviles pequeños
- **480px+** - Móviles grandes
- **768px+** - Tablets
- **1024px+** - Desktop pequeño
- **1200px+** - Desktop mediano
- **1400px+** - Desktop grande

### Adaptaciones Móviles
- Menú hamburguesa en pantallas pequeñas
- Sliders optimizados para touch
- Botones y textos de tamaño apropiado
- Navegación simplificada

## 🎯 Funcionalidades Destacadas

### Sistema de Favoritos
- Persistencia en localStorage
- Interfaz intuitiva para agregar/quitar
- Sección dedicada "Mi Lista"

### Búsqueda Avanzada
- Búsqueda en tiempo real
- Resultados por título, descripción y género
- Interfaz de resultados elegante

### Modal de Contenido
- Vista detallada de películas/series
- Reproductor de trailer integrado
- Información completa (rating, año, duración, género)

### Animaciones y Efectos
- Hover effects en tarjetas
- Scroll animations
- Parallax effects
- Loading animations
- Particle effects

## 🔧 APIs y Extensiones

### Integración con TMDB (The Movie Database)
El proyecto está preparado para integrarse con la API de TMDB:
```javascript
// Ejemplo de función para obtener datos reales
async function fetchMoviesFromTMDB(category) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=TU_API_KEY`);
    const data = await response.json();
    return data.results;
}
```

### Extensiones Posibles
- Sistema de usuarios y perfiles
- Reproducción de video completa
- Sistema de recomendaciones
- Integración con servicios de streaming
- PWA (Progressive Web App)

## 🎨 Temas y Personalización

### Tema Automático
El tema se adapta automáticamente a las preferencias del sistema:
```css
@media (prefers-color-scheme: dark) {
    [data-theme="auto"] {
        /* Variables para tema oscuro */
    }
}
```

### Accesibilidad
- Soporte para `prefers-reduced-motion`
- Contraste alto disponible
- Navegación por teclado
- Lectores de pantalla compatibles

## 📊 Rendimiento y Optimización

### Optimizaciones Implementadas
- Lazy loading de imágenes
- Debouncing en búsqueda
- Throttling en eventos de scroll
- Minificación de estilos
- Optimización de animaciones

### Métricas de Rendimiento
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms

## 🔒 Seguridad

### Medidas Implementadas
- Sanitización de contenido HTML
- Validación de entrada del usuario
- Protección XSS básica
- Manejo seguro de localStorage

## 🐛 Solución de Problemas

### Problemas Comunes

**Las imágenes no cargan:**
- Verifica la conexión a internet
- Comprueba las URLs de las imágenes en `data.js`

**Las animaciones no funcionan:**
- Verifica que GSAP se haya cargado correctamente
- Comprueba la consola del navegador por errores

**El tema no se guarda:**
- Verifica que localStorage esté habilitado
- Comprueba la configuración de privacidad del navegador

## 🚀 Próximas Características

- [ ] Sistema de usuarios
- [ ] Integración con APIs reales
- [ ] Reproductor de video avanzado
- [ ] Sistema de reseñas
- [ ] Recomendaciones personalizadas
- [ ] PWA con notificaciones
- [ ] Modo sin conexión

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 👨‍💻 Autor

Desarrollado con ❤️ como un proyecto de demostración de tecnologías web modernas.

---

¡Disfruta explorando este clon de Netflix! 🍿🎬
