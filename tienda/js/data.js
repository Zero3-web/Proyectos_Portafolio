// Base de datos simulada de productos
const products = [
    {
        id: 1,
        name: "Labial Mate Ruby Red",
        brand: "MAC",
        category: "labios",
        price: 28.99,
        originalPrice: 35.99,
        discount: 20,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Labial mate de larga duración con acabado sedoso y pigmentación intensa.",
        rating: 4.8,
        reviews: 245,
        featured: true,
        colors: ["Ruby Red", "Classic Red", "Cherry"],
        inStock: true
    },
    {
        id: 2,
        name: "Paleta de Sombras Urban Dreams",
        brand: "Urban Decay",
        category: "ojos",
        price: 65.99,
        originalPrice: 79.99,
        discount: 18,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "12 tonos vibrantes con acabados mate y shimmer para looks versátiles.",
        rating: 4.9,
        reviews: 189,
        featured: true,
        colors: ["Multicolor"],
        inStock: true
    },
    {
        id: 3,
        name: "Base Fluida Fit Me",
        brand: "Maybelline",
        category: "rostro",
        price: 18.99,
        originalPrice: 22.99,
        discount: 17,
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Base de maquillaje con cobertura media a completa y acabado natural.",
        rating: 4.6,
        reviews: 567,
        featured: true,
        colors: ["Ivory", "Natural Beige", "Caramel", "Mocha"],
        inStock: true
    },
    {
        id: 4,
        name: "Esmalte de Uñas Ballet Slippers",
        brand: "Essie",
        category: "unas",
        price: 12.99,
        originalPrice: 15.99,
        discount: 19,
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Esmalte de larga duración con acabado brillante y fórmula chip-resistant.",
        rating: 4.4,
        reviews: 123,
        featured: false,
        colors: ["Ballet Slippers", "Mademoiselle", "French Affair"],
        inStock: true
    },
    {
        id: 5,
        name: "Máscara de Pestañas Voluminizadora",
        brand: "L'Oréal",
        category: "ojos",
        price: 16.99,
        originalPrice: 19.99,
        discount: 15,
        image: "https://images.unsplash.com/photo-1631214540242-3e80dc912dd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Máscara que proporciona volumen y longitud extrema sin grumos.",
        rating: 4.7,
        reviews: 334,
        featured: true,
        colors: ["Black", "Brown"],
        inStock: true
    },
    {
        id: 6,
        name: "Gloss Labial Crystal Clear",
        brand: "Fenty Beauty",
        category: "labios",
        price: 24.99,
        originalPrice: null,
        discount: 0,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Gloss no pegajoso con acabado cristalino y brillo espejo.",
        rating: 4.5,
        reviews: 89,
        featured: false,
        colors: ["Clear", "Pink Tint", "Peach Glow"],
        inStock: true
    },
    {
        id: 7,
        name: "Corrector Instantáneo Anti-Edad",
        brand: "Maybelline",
        category: "rostro",
        price: 14.99,
        originalPrice: 17.99,
        discount: 17,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Corrector de cobertura completa con propiedades anti-edad.",
        rating: 4.3,
        reviews: 456,
        featured: false,
        colors: ["Fair", "Light", "Medium", "Deep"],
        inStock: true
    },
    {
        id: 8,
        name: "Delineador de Ojos Waterproof",
        brand: "Urban Decay",
        category: "ojos",
        price: 22.99,
        originalPrice: 26.99,
        discount: 15,
        image: "https://images.unsplash.com/photo-1583001255509-eb7dd2b3d278?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Delineador resistente al agua con aplicación precisa y larga duración.",
        rating: 4.8,
        reviews: 267,
        featured: true,
        colors: ["Black", "Brown", "Navy"],
        inStock: true
    },
    {
        id: 9,
        name: "Polvo Compacto Translúcido",
        brand: "Laura Mercier",
        category: "rostro",
        price: 42.99,
        originalPrice: 49.99,
        discount: 14,
        image: "https://images.unsplash.com/photo-1562887284-5a64ac94c8e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Polvo translúcido que fija el maquillaje y controla el brillo.",
        rating: 4.9,
        reviews: 178,
        featured: false,
        colors: ["Translucent"],
        inStock: false
    },
    {
        id: 10,
        name: "Kit de Pinceles Profesionales",
        brand: "Real Techniques",
        category: "herramientas",
        price: 35.99,
        originalPrice: 45.99,
        discount: 22,
        image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Set de 5 pinceles profesionales para aplicación perfecta del maquillaje.",
        rating: 4.6,
        reviews: 145,
        featured: false,
        colors: ["Rose Gold"],
        inStock: true
    },
    {
        id: 11,
        name: "Rubor en Polvo Peachy Pink",
        brand: "NARS",
        category: "rostro",
        price: 38.99,
        originalPrice: 44.99,
        discount: 13,
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Rubor en polvo con pigmentación intensa y acabado satinado.",
        rating: 4.7,
        reviews: 89,
        featured: true,
        colors: ["Peachy Pink", "Coral", "Berry"],
        inStock: true
    },
    {
        id: 12,
        name: "Iluminador Líquido Golden Glow",
        brand: "Fenty Beauty",
        category: "rostro",
        price: 36.99,
        originalPrice: null,
        discount: 0,
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Iluminador líquido que proporciona un brillo natural y radiante.",
        rating: 4.8,
        reviews: 234,
        featured: true,
        colors: ["Golden", "Champagne", "Rose Gold"],
        inStock: true
    },
    {
        id: 13,
        name: "Set de Labiales Matte Collection",
        brand: "Kylie Cosmetics",
        category: "labios",
        price: 54.99,
        originalPrice: 69.99,
        discount: 21,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Colección de 6 labiales mate en tonos neutros y vibrantes.",
        rating: 4.5,
        reviews: 167,
        featured: false,
        colors: ["Mixed Set"],
        inStock: true
    },
    {
        id: 14,
        name: "Primer Facial Pore Minimizer",
        brand: "Smashbox",
        category: "rostro",
        price: 42.99,
        originalPrice: 49.99,
        discount: 14,
        image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Primer que minimiza poros y alisa la textura de la piel.",
        rating: 4.6,
        reviews: 198,
        featured: false,
        colors: ["Clear"],
        inStock: true
    },
    {
        id: 15,
        name: "Esmalte Gel UV Long Lasting",
        brand: "OPI",
        category: "unas",
        price: 19.99,
        originalPrice: 24.99,
        discount: 20,
        image: "https://images.unsplash.com/photo-1610088987972-ede2d71b2670?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Esmalte gel que dura hasta 3 semanas con brillo profesional.",
        rating: 4.4,
        reviews: 276,
        featured: false,
        colors: ["Red Hot", "Pink Flamingo", "Nude Beige"],
        inStock: true
    }
];

// Códigos de descuento disponibles
const promoCodes = {
    'WELCOME10': { discount: 10, type: 'percentage', description: '10% de descuento' },
    'SAVE20': { discount: 20, type: 'percentage', description: '20% de descuento' },
    'FREESHIP': { discount: 5.99, type: 'fixed', description: 'Envío gratis' },
    'BEAUTY25': { discount: 25, type: 'percentage', description: '25% de descuento' }
};

// Categorías disponibles
const categories = [
    { id: 'labios', name: 'Labios', icon: 'fas fa-kiss' },
    { id: 'ojos', name: 'Ojos', icon: 'fas fa-eye' },
    { id: 'rostro', name: 'Rostro', icon: 'fas fa-smile' },
    { id: 'unas', name: 'Uñas', icon: 'fas fa-hand-sparkles' },
    { id: 'herramientas', name: 'Herramientas', icon: 'fas fa-paint-brush' }
];

// Marcas disponibles
const brands = [
    'MAC', 'Maybelline', 'L\'Oréal', 'Urban Decay', 'Fenty Beauty', 
    'NARS', 'Kylie Cosmetics', 'Smashbox', 'OPI', 'Essie', 
    'Laura Mercier', 'Real Techniques'
];

// Función para obtener productos por categoría
function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

// Función para obtener productos destacados
function getFeaturedProducts() {
    return products.filter(product => product.featured);
}

// Función para obtener producto por ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Función para buscar productos
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// Función para filtrar productos
function filterProducts(filters) {
    let filteredProducts = [...products];

    // Filtro por categoría
    if (filters.category && filters.category !== '') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === filters.category
        );
    }

    // Filtro por marca
    if (filters.brand && filters.brand !== '') {
        filteredProducts = filteredProducts.filter(product => 
            product.brand === filters.brand
        );
    }

    // Filtro por precio
    if (filters.price && filters.price !== '') {
        const [min, max] = filters.price.split('-').map(p => parseFloat(p));
        if (max) {
            filteredProducts = filteredProducts.filter(product => 
                product.price >= min && product.price <= max
            );
        } else {
            // Para el caso "100+"
            filteredProducts = filteredProducts.filter(product => 
                product.price >= min
            );
        }
    }

    // Filtro por disponibilidad
    if (filters.inStock) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    return filteredProducts;
}

// Función para ordenar productos
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];

    switch (sortBy) {
        case 'name':
            return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        case 'price':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        default:
            return sortedProducts;
    }
}

// Función para generar estrellas de rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }

    return starsHTML;
}

// Función para formatear precio
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Función para calcular descuento
function calculateDiscount(originalPrice, currentPrice) {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.productsData = {
        products,
        promoCodes,
        categories,
        brands,
        getProductsByCategory,
        getFeaturedProducts,
        getProductById,
        searchProducts,
        filterProducts,
        sortProducts,
        generateStars,
        formatPrice,
        calculateDiscount
    };
}
