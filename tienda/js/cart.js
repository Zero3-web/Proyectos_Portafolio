// Gestión del carrito de compras
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartUI();
        this.bindEvents();
    }

    // Cargar carrito desde localStorage
    loadCart() {
        const savedCart = localStorage.getItem('glamBeautyCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('glamBeautyCart', JSON.stringify(this.items));
    }

    // Agregar producto al carrito
    addItem(productId, quantity = 1, selectedColor = null) {
        const product = getProductById(productId);
        if (!product) return false;

        const existingItemIndex = this.items.findIndex(item => 
            item.id === productId && item.selectedColor === selectedColor
        );

        if (existingItemIndex > -1) {
            this.items[existingItemIndex].quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                quantity: quantity,
                selectedColor: selectedColor,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showAddToCartNotification(product.name);
        return true;
    }

    // Remover producto del carrito
    removeItem(productId, selectedColor = null) {
        this.items = this.items.filter(item => 
            !(item.id === productId && item.selectedColor === selectedColor)
        );
        this.saveCart();
        this.updateCartUI();
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, newQuantity, selectedColor = null) {
        const itemIndex = this.items.findIndex(item => 
            item.id === productId && item.selectedColor === selectedColor
        );

        if (itemIndex > -1) {
            if (newQuantity <= 0) {
                this.removeItem(productId, selectedColor);
            } else {
                this.items[itemIndex].quantity = newQuantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    // Limpiar carrito
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }

    // Obtener total de productos
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Obtener subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => {
            const product = getProductById(item.id);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }

    // Obtener impuestos (8.5%)
    getTaxes() {
        return this.getSubtotal() * 0.085;
    }

    // Obtener total con envío e impuestos
    getTotal(shippingCost = 0) {
        return this.getSubtotal() + this.getTaxes() + shippingCost;
    }

    // Actualizar UI del carrito
    updateCartUI() {
        this.updateCartCount();
        this.updateCartSidebar();
    }

    // Actualizar contador del carrito
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }
    }

    // Actualizar sidebar del carrito
    updateCartSidebar() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag" style="font-size: 48px; color: var(--gray-400); margin-bottom: 20px;"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="productos.html" class="btn btn-primary" style="margin-top: 20px;">
                        Ir de Compras
                    </a>
                </div>
            `;
            if (cartTotal) cartTotal.textContent = '0.00';
            return;
        }

        let itemsHTML = '';
        this.items.forEach(item => {
            const product = getProductById(item.id);
            if (product) {
                itemsHTML += `
                    <div class="cart-item" data-id="${item.id}" data-color="${item.selectedColor || ''}">
                        <div class="cart-item-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-name">${product.name}</div>
                            ${item.selectedColor ? `<div class="cart-item-color">Color: ${item.selectedColor}</div>` : ''}
                            <div class="cart-item-price">${formatPrice(product.price)}</div>
                            <div class="cart-item-controls">
                                <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1}, '${item.selectedColor || ''}')">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1}, '${item.selectedColor || ''}')">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button class="remove-item" onclick="cart.removeItem(${item.id}, '${item.selectedColor || ''}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        cartItems.innerHTML = itemsHTML;
        if (cartTotal) {
            cartTotal.textContent = this.getSubtotal().toFixed(2);
        }
    }

    // Mostrar notificación de producto agregado
    showAddToCartNotification(productName) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>¡${productName} agregado al carrito!</span>
            </div>
        `;

        // Estilos de la notificación
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, var(--success), #34ce57);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        // Agregar al DOM
        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Vincular eventos
    bindEvents() {
        // Evento para cerrar notificaciones al hacer click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cart-notification')) {
                const notification = e.target.closest('.cart-notification');
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        });
    }

    // Obtener items del carrito con información del producto
    getCartItemsWithProductInfo() {
        return this.items.map(item => {
            const product = getProductById(item.id);
            return {
                ...item,
                product: product
            };
        }).filter(item => item.product); // Filtrar items sin producto válido
    }
}

// Funciones globales para el carrito
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar && overlay) {
        cartSidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

function goToCheckout() {
    if (cart.items.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    window.location.href = 'checkout.html';
}

// Función para agregar producto al carrito desde las tarjetas de producto
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;

    // Si el producto tiene colores, mostrar selector
    if (product.colors && product.colors.length > 1) {
        showColorSelector(product, quantity);
    } else {
        cart.addItem(productId, quantity, product.colors ? product.colors[0] : null);
    }
}

// Mostrar selector de color
function showColorSelector(product, quantity = 1) {
    const modal = document.createElement('div');
    modal.className = 'color-selector-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeColorSelector()"></div>
        <div class="color-selector-content">
            <h3>Selecciona un color para ${product.name}</h3>
            <div class="color-options">
                ${product.colors.map(color => `
                    <button class="color-option" onclick="selectColorAndAdd(${product.id}, '${color}', ${quantity})">
                        ${color}
                    </button>
                `).join('')}
            </div>
            <button class="close-selector" onclick="closeColorSelector()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Estilos del modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(modal);
}

function selectColorAndAdd(productId, color, quantity) {
    cart.addItem(productId, quantity, color);
    closeColorSelector();
}

function closeColorSelector() {
    const modal = document.querySelector('.color-selector-modal');
    if (modal) {
        modal.remove();
    }
}

// Inicializar carrito global
const cart = new ShoppingCart();

// Hacer funciones disponibles globalmente
window.cart = cart;
window.toggleCart = toggleCart;
window.goToCheckout = goToCheckout;
window.addToCart = addToCart;

// CSS dinámico para las notificaciones y selector de color
const dynamicCSS = `
    .cart-notification .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
    }

    .cart-notification .notification-content i {
        font-size: 20px;
    }

    .color-selector-modal .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
    }

    .color-selector-content {
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        width: 90%;
        position: relative;
        z-index: 1;
    }

    .color-selector-content h3 {
        margin-bottom: 20px;
        color: var(--dark-color);
        text-align: center;
    }

    .color-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 10px;
        margin-bottom: 20px;
    }

    .color-option {
        background: var(--gray-100);
        border: 2px solid var(--gray-300);
        padding: 12px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
    }

    .color-option:hover {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: white;
    }

    .close-selector {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--gray-600);
    }

    .cart-item-color {
        font-size: 12px;
        color: var(--gray-600);
        margin-bottom: 5px;
    }
`;

// Agregar CSS dinámico al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicCSS;
document.head.appendChild(styleSheet);
