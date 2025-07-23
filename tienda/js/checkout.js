// Funciones específicas para la página de checkout
let currentStep = 1;
let orderData = {
    shipping: {},
    payment: {},
    items: [],
    totals: {
        subtotal: 0,
        shipping: 5.99,
        tax: 0,
        total: 0
    }
};

let appliedPromoCode = null;

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('checkout.html')) {
        initCheckoutPage();
    }
});

function initCheckoutPage() {
    // Verificar que hay items en el carrito
    if (cart.items.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        setTimeout(() => {
            window.location.href = 'productos.html';
        }, 2000);
        return;
    }
    
    // Cargar datos del carrito
    loadCheckoutItems();
    
    // Calcular totales
    calculateTotals();
    
    // Inicializar eventos
    initCheckoutEvents();
    
    // Configurar formularios
    initFormValidation();
    
    // Configurar métodos de pago
    initPaymentMethods();
    
    // Auto-llenar datos si están guardados
    loadSavedData();
}

function loadCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    if (!checkoutItems) return;
    
    orderData.items = cart.getCartItemsWithProductInfo();
    
    let itemsHTML = '';
    orderData.items.forEach(item => {
        itemsHTML += `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${item.product.image}" alt="${item.product.name}">
                </div>
                <div class="order-item-info">
                    <div class="order-item-name">${item.product.name}</div>
                    ${item.selectedColor ? `<div class="order-item-color">Color: ${item.selectedColor}</div>` : ''}
                    <div class="order-item-quantity">Cantidad: ${item.quantity}</div>
                </div>
                <div class="order-item-price">${formatPrice(item.product.price * item.quantity)}</div>
            </div>
        `;
    });
    
    checkoutItems.innerHTML = itemsHTML;
}

function calculateTotals() {
    orderData.totals.subtotal = cart.getSubtotal();
    orderData.totals.tax = cart.getTaxes();
    orderData.totals.total = orderData.totals.subtotal + orderData.totals.shipping + orderData.totals.tax;
    
    // Aplicar descuento si hay código promocional
    if (appliedPromoCode) {
        const discount = promoCodes[appliedPromoCode];
        if (discount.type === 'percentage') {
            orderData.totals.total *= (1 - discount.discount / 100);
        } else {
            orderData.totals.total -= discount.discount;
        }
    }
    
    updateTotalsDisplay();
}

function updateTotalsDisplay() {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping-cost');
    const taxElement = document.getElementById('tax-amount');
    const totalElement = document.getElementById('final-total');
    
    if (subtotalElement) subtotalElement.textContent = formatPrice(orderData.totals.subtotal);
    if (shippingElement) shippingElement.textContent = formatPrice(orderData.totals.shipping);
    if (taxElement) taxElement.textContent = formatPrice(orderData.totals.tax);
    if (totalElement) totalElement.textContent = formatPrice(orderData.totals.total);
}

function initCheckoutEvents() {
    // Eventos de opciones de envío
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            orderData.totals.shipping = parseFloat(e.target.value);
            calculateTotals();
        });
    });
    
    // Eventos de métodos de pago
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            showPaymentForm(e.target.value);
        });
    });
    
    // Eventos para formateo de campos
    initFieldFormatting();
}

function initFieldFormatting() {
    // Formatear número de tarjeta
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
            e.target.value = formattedValue;
        });
    }
    
    // Formatear fecha de vencimiento
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV solo números
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}

function initFormValidation() {
    // Validación en tiempo real
    const requiredFields = document.querySelectorAll('input[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(field);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Validación básica de requerido
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es requerido';
    }
    
    // Validaciones específicas
    switch (field.type) {
        case 'email':
            if (value && !validateEmail(value)) {
                isValid = false;
                errorMessage = 'Email inválido';
            }
            break;
        case 'tel':
            if (value && value.length < 10) {
                isValid = false;
                errorMessage = 'Teléfono debe tener al menos 10 dígitos';
            }
            break;
    }
    
    // Validaciones específicas por ID
    if (field.id === 'cardNumber' && value) {
        const cleanNumber = value.replace(/\s/g, '');
        if (cleanNumber.length < 13 || cleanNumber.length > 19) {
            isValid = false;
            errorMessage = 'Número de tarjeta inválido';
        }
    }
    
    if (field.id === 'expiryDate' && value) {
        const [month, year] = value.split('/');
        const currentDate = new Date();
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
        
        if (!month || !year || month < 1 || month > 12 || expiryDate < currentDate) {
            isValid = false;
            errorMessage = 'Fecha de vencimiento inválida';
        }
    }
    
    if (field.id === 'cvv' && value) {
        if (value.length < 3 || value.length > 4) {
            isValid = false;
            errorMessage = 'CVV inválido';
        }
    }
    
    // Aplicar estilos de validación
    if (isValid) {
        field.classList.remove('error');
        removeFieldError(field);
    } else {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    removeFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function initPaymentMethods() {
    showPaymentForm('card'); // Mostrar tarjeta por defecto
}

function showPaymentForm(method) {
    // Ocultar todos los formularios
    const paymentForms = document.querySelectorAll('.payment-form');
    paymentForms.forEach(form => form.classList.add('hidden'));
    
    // Mostrar el formulario seleccionado
    const selectedForm = document.getElementById(`${method}-form`);
    if (selectedForm) {
        selectedForm.classList.remove('hidden');
    }
}

function nextStep(step) {
    if (!validateCurrentStep()) {
        return;
    }
    
    // Guardar datos del paso actual
    saveStepData();
    
    // Cambiar al siguiente paso
    currentStep = step;
    showStep(step);
    
    // Actualizar indicadores de paso
    updateStepIndicators();
}

function previousStep(step) {
    currentStep = step;
    showStep(step);
    updateStepIndicators();
}

function showStep(step) {
    // Ocultar todos los pasos
    const steps = document.querySelectorAll('.checkout-step');
    steps.forEach(stepElement => stepElement.classList.add('hidden'));
    
    // Mostrar el paso actual
    const currentStepElement = document.getElementById(`step-${step}`);
    if (currentStepElement) {
        currentStepElement.classList.remove('hidden');
    }
    
    // Actualizar resumen si estamos en el paso 3
    if (step === 3) {
        updateOrderReview();
    }
}

function updateStepIndicators() {
    const stepIndicators = document.querySelectorAll('.step');
    
    stepIndicators.forEach((indicator, index) => {
        const stepNumber = index + 1;
        
        indicator.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            indicator.classList.add('active');
        } else if (stepNumber < currentStep) {
            indicator.classList.add('completed');
        }
    });
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (!currentStepElement) return true;
    
    const requiredFields = currentStepElement.querySelectorAll('input[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Por favor completa todos los campos requeridos', 'error');
    }
    
    return isValid;
}

function saveStepData() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (!currentStepElement) return;
    
    // Guardar datos de envío
    if (currentStep === 1) {
        const formData = new FormData(currentStepElement.querySelector('form'));
        orderData.shipping = Object.fromEntries(formData);
        
        // Guardar método de envío seleccionado
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        if (selectedShipping) {
            orderData.shipping.method = selectedShipping.value;
            orderData.totals.shipping = parseFloat(selectedShipping.value);
        }
    }
    
    // Guardar datos de pago
    if (currentStep === 2) {
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        if (selectedPayment) {
            orderData.payment.method = selectedPayment.value;
            
            if (selectedPayment.value === 'card') {
                orderData.payment.cardNumber = document.getElementById('cardNumber')?.value;
                orderData.payment.expiryDate = document.getElementById('expiryDate')?.value;
                orderData.payment.cardName = document.getElementById('cardName')?.value;
                // No guardar CVV por seguridad
            }
        }
    }
    
    // Guardar en localStorage para recuperación
    localStorage.setItem('checkoutData', JSON.stringify(orderData));
}

function loadSavedData() {
    const savedData = localStorage.getItem('checkoutData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Cargar datos de envío
            if (data.shipping) {
                Object.keys(data.shipping).forEach(key => {
                    const field = document.getElementById(key);
                    if (field && data.shipping[key]) {
                        field.value = data.shipping[key];
                    }
                });
            }
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

function updateOrderReview() {
    // Actualizar resumen de envío
    const shippingReview = document.getElementById('shipping-review');
    if (shippingReview && orderData.shipping) {
        shippingReview.innerHTML = `
            <p><strong>${orderData.shipping.firstName} ${orderData.shipping.lastName}</strong></p>
            <p>${orderData.shipping.address}</p>
            <p>${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipCode}</p>
            <p>Email: ${orderData.shipping.email}</p>
            <p>Teléfono: ${orderData.shipping.phone}</p>
        `;
    }
    
    // Actualizar resumen de pago
    const paymentReview = document.getElementById('payment-review');
    if (paymentReview && orderData.payment) {
        let paymentHTML = '';
        
        switch (orderData.payment.method) {
            case 'card':
                const maskedCard = orderData.payment.cardNumber ? 
                    '**** **** **** ' + orderData.payment.cardNumber.slice(-4) : '';
                paymentHTML = `
                    <p><strong>Tarjeta de Crédito/Débito</strong></p>
                    <p>${maskedCard}</p>
                    <p>${orderData.payment.cardName}</p>
                `;
                break;
            case 'paypal':
                paymentHTML = '<p><strong>PayPal</strong></p>';
                break;
            case 'apple-pay':
                paymentHTML = '<p><strong>Apple Pay</strong></p>';
                break;
        }
        
        paymentReview.innerHTML = paymentHTML;
    }
}

function applyPromoCode() {
    const promoInput = document.getElementById('promo-input');
    if (!promoInput) return;
    
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Ingresa un código promocional', 'warning');
        return;
    }
    
    if (promoCodes[code]) {
        appliedPromoCode = code;
        calculateTotals();
        
        promoInput.value = '';
        promoInput.placeholder = `Código aplicado: ${code}`;
        promoInput.disabled = true;
        
        const discount = promoCodes[code];
        showNotification(`¡Código aplicado! ${discount.description}`, 'success');
    } else {
        showNotification('Código promocional inválido', 'error');
    }
}

function processPayment() {
    if (!validateCurrentStep()) {
        return;
    }
    
    saveStepData();
    
    // Simular procesamiento de pago
    const processingOverlay = document.createElement('div');
    processingOverlay.className = 'processing-overlay';
    processingOverlay.innerHTML = `
        <div class="processing-content">
            <i class="fas fa-spinner fa-spin"></i>
            <h3>Procesando pago...</h3>
            <p>Por favor espera mientras procesamos tu orden</p>
        </div>
    `;
    
    processingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        text-align: center;
    `;
    
    document.body.appendChild(processingOverlay);
    
    // Simular delay de procesamiento
    setTimeout(() => {
        processingOverlay.remove();
        showSuccessModal();
        
        // Limpiar carrito y datos guardados
        cart.clearCart();
        localStorage.removeItem('checkoutData');
    }, 3000);
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    const overlay = document.getElementById('overlay');
    const orderNumber = document.getElementById('order-number');
    
    // Generar número de orden
    const orderNum = 'GB' + Date.now().toString().slice(-8);
    if (orderNumber) {
        orderNumber.textContent = orderNum;
    }
    
    if (modal && overlay) {
        modal.classList.add('open');
        overlay.classList.add('open');
    }
}

function goToHome() {
    window.location.href = 'index.html';
}

// CSS dinámico para validación
const checkoutCSS = `
    .field-error {
        color: var(--danger);
        font-size: 14px;
        margin-top: 5px;
    }
    
    .form-group input.error,
    .form-group select.error {
        border-color: var(--danger);
        background-color: rgba(220, 53, 69, 0.1);
    }
    
    .processing-content {
        background: white;
        color: var(--dark-color);
        padding: 40px;
        border-radius: var(--border-radius);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .processing-content i {
        font-size: 48px;
        color: var(--primary-color);
        margin-bottom: 20px;
    }
`;

// Agregar CSS al documento
const checkoutStyleSheet = document.createElement('style');
checkoutStyleSheet.textContent = checkoutCSS;
document.head.appendChild(checkoutStyleSheet);

// Funciones globales
window.nextStep = nextStep;
window.previousStep = previousStep;
window.applyPromoCode = applyPromoCode;
window.processPayment = processPayment;
window.goToHome = goToHome;
