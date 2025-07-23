// Funciones específicas para la página de productos
let currentFilters = {
    category: '',
    brand: '',
    price: '',
    search: '',
    sort: 'name'
};

let currentPage = 1;
const itemsPerPage = 12;
let allProducts = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('productos.html')) {
        initProductsPage();
    }
});

function initProductsPage() {
    // Cargar todos los productos
    allProducts = [...products];
    
    // Obtener parámetros de URL
    parseURLParams();
    
    // Inicializar filtros
    initFilters();
    
    // Inicializar vista
    initViewToggle();
    
    // Cargar y mostrar productos
    applyFiltersAndSort();
    
    // Inicializar eventos
    bindFilterEvents();
    
    // Inicializar búsqueda
    initProductSearch();
}

function parseURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Aplicar filtros desde URL
    if (urlParams.get('category')) {
        currentFilters.category = urlParams.get('category');
    }
    
    if (urlParams.get('search')) {
        currentFilters.search = urlParams.get('search');
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = currentFilters.search;
        }
    }
    
    if (urlParams.get('brand')) {
        currentFilters.brand = urlParams.get('brand');
    }
    
    if (urlParams.get('price')) {
        currentFilters.price = urlParams.get('price');
    }
    
    if (urlParams.get('sort')) {
        currentFilters.sort = urlParams.get('sort');
    }
}

function initFilters() {
    // Configurar selectores de filtros con valores actuales
    const categoryFilter = document.getElementById('category-filter');
    const brandFilter = document.getElementById('brand-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (categoryFilter) categoryFilter.value = currentFilters.category;
    if (brandFilter) brandFilter.value = currentFilters.brand;
    if (priceFilter) priceFilter.value = currentFilters.price;
    if (sortFilter) sortFilter.value = currentFilters.sort;
    
    // Mostrar filtros activos
    updateActiveFilters();
}

function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('products-grid');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            if (productsGrid) {
                productsGrid.className = view === 'list' ? 'products-grid list-view' : 'products-grid';
            }
            
            // Guardar preferencia
            localStorage.setItem('productsView', view);
        });
    });
    
    // Restaurar vista guardada
    const savedView = localStorage.getItem('productsView');
    if (savedView) {
        const targetBtn = document.querySelector(`[data-view="${savedView}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    }
}

function bindFilterEvents() {
    // Filtros de select
    const filterSelects = ['category-filter', 'brand-filter', 'price-filter', 'sort-filter'];
    
    filterSelects.forEach(filterId => {
        const filterElement = document.getElementById(filterId);
        if (filterElement) {
            filterElement.addEventListener('change', (e) => {
                const filterType = filterId.replace('-filter', '');
                currentFilters[filterType] = e.target.value;
                currentPage = 1;
                applyFiltersAndSort();
                updateURL();
            });
        }
    });
}

function initProductSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentFilters.search = e.target.value.trim();
                currentPage = 1;
                applyFiltersAndSort();
                updateURL();
            }, 500);
        });
    }
}

function applyFiltersAndSort() {
    // Mostrar loading
    showProductsLoading();
    
    setTimeout(() => {
        // Aplicar filtros
        filteredProducts = filterProducts(currentFilters);
        
        // Aplicar búsqueda
        if (currentFilters.search) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                product.brand.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                product.description.toLowerCase().includes(currentFilters.search.toLowerCase())
            );
        }
        
        // Ordenar productos
        filteredProducts = sortProducts(filteredProducts, currentFilters.sort);
        
        // Mostrar productos
        displayProducts();
        
        // Actualizar información
        updateProductsInfo();
        
        // Generar paginación
        generatePagination();
        
        // Actualizar filtros activos
        updateActiveFilters();
    }, 300);
}

function showProductsLoading() {
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div class="loading" style="grid-column: 1 / -1;">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando productos...</p>
            </div>
        `;
    }
}

function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros o buscar algo diferente</p>
                <button class="btn btn-primary" onclick="clearAllFilters()">
                    Limpiar Filtros
                </button>
            </div>
        `;
        return;
    }
    
    // Calcular productos para la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Generar HTML de productos
    productsGrid.innerHTML = pageProducts.map(product => 
        createProductCard(product)
    ).join('');
    
    // Animar productos
    animateProductsEntrance();
}

function animateProductsEntrance() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function updateProductsInfo() {
    const productsCount = document.getElementById('products-count');
    if (productsCount) {
        const total = filteredProducts.length;
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, total);
        
        if (total === 0) {
            productsCount.textContent = '0 productos encontrados';
        } else {
            productsCount.textContent = `Mostrando ${start}-${end} de ${total} productos`;
        }
    }
}

function generatePagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Botón anterior
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Anterior
        </button>
    `;
    
    // Números de página
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
        paginationHTML += `<button onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Botón siguiente
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Siguiente <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    // Información de página
    paginationHTML += `
        <div class="page-info">
            Página ${currentPage} de ${totalPages}
        </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayProducts();
    generatePagination();
    
    // Scroll al inicio de productos
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateActiveFilters() {
    const activeFiltersContainer = document.querySelector('.active-filters');
    
    // Crear contenedor si no existe
    if (!activeFiltersContainer) {
        const filtersSection = document.querySelector('.filters-section');
        if (filtersSection) {
            const activeFiltersDiv = document.createElement('div');
            activeFiltersDiv.className = 'active-filters';
            filtersSection.appendChild(activeFiltersDiv);
        }
    }
    
    const container = document.querySelector('.active-filters');
    if (!container) return;
    
    let activeFiltersHTML = '';
    
    // Filtro de categoría
    if (currentFilters.category) {
        const categoryName = categories.find(cat => cat.id === currentFilters.category)?.name || currentFilters.category;
        activeFiltersHTML += `
            <div class="filter-tag">
                Categoría: ${categoryName}
                <button onclick="removeFilter('category')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
    
    // Filtro de marca
    if (currentFilters.brand) {
        activeFiltersHTML += `
            <div class="filter-tag">
                Marca: ${currentFilters.brand}
                <button onclick="removeFilter('brand')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
    
    // Filtro de precio
    if (currentFilters.price) {
        const priceText = currentFilters.price === '100+' ? '$100+' : `$${currentFilters.price.replace('-', ' - $')}`;
        activeFiltersHTML += `
            <div class="filter-tag">
                Precio: ${priceText}
                <button onclick="removeFilter('price')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
    
    // Filtro de búsqueda
    if (currentFilters.search) {
        activeFiltersHTML += `
            <div class="filter-tag">
                Búsqueda: "${currentFilters.search}"
                <button onclick="removeFilter('search')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
    
    container.innerHTML = activeFiltersHTML;
}

function removeFilter(filterType) {
    currentFilters[filterType] = '';
    currentPage = 1;
    
    // Actualizar UI
    const filterElement = document.getElementById(`${filterType}-filter`);
    if (filterElement) {
        filterElement.value = '';
    }
    
    if (filterType === 'search') {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }
    }
    
    applyFiltersAndSort();
    updateURL();
}

function clearAllFilters() {
    currentFilters = {
        category: '',
        brand: '',
        price: '',
        search: '',
        sort: 'name'
    };
    currentPage = 1;
    
    // Limpiar UI
    const filterElements = ['category-filter', 'brand-filter', 'price-filter', 'sort-filter'];
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    applyFiltersAndSort();
    updateURL();
}

function updateURL() {
    const params = new URLSearchParams();
    
    Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key]) {
            params.set(key, currentFilters[key]);
        }
    });
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
}

// Funciones globales
window.changePage = changePage;
window.removeFilter = removeFilter;
window.clearAllFilters = clearAllFilters;
