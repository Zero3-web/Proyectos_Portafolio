// Sistema de Facturación - JavaScript
class InvoiceSystem {
    constructor() {
        this.invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        this.clients = JSON.parse(localStorage.getItem('clients')) || [];
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.currentInvoiceId = localStorage.getItem('currentInvoiceId') || 1;
        
        this.initializeApp();
        this.setupEventListeners();
        this.loadSampleData();
        this.updateDashboard();
    }

    initializeApp() {
        this.showPage('dashboard');
        this.setupNavigation();
        this.initializeCharts();
        this.setCurrentDate();
        this.generateInvoiceNumber();
    }

    // Sample Data
    loadSampleData() {
        if (this.clients.length === 0) {
            this.clients = [
                {
                    id: 1,
                    name: 'Empresa ABC S.A. de C.V.',
                    email: 'contacto@empresaabc.com',
                    phone: '555-1234',
                    rfc: 'ABC123456789',
                    address: 'Av. Principal 123, Col. Centro, Ciudad, CP 12345'
                },
                {
                    id: 2,
                    name: 'Servicios XYZ',
                    email: 'admin@serviciosxyz.com',
                    phone: '555-5678',
                    rfc: 'XYZ987654321',
                    address: 'Calle Secundaria 456, Col. Norte, Ciudad, CP 67890'
                }
            ];
            this.saveData();
        }

        if (this.products.length === 0) {
            this.products = [
                {
                    id: 1,
                    code: 'PRD001',
                    name: 'Consultoría Web',
                    description: 'Servicios de consultoría para desarrollo web',
                    price: 1500.00,
                    stock: 100
                },
                {
                    id: 2,
                    code: 'PRD002',
                    name: 'Diseño Gráfico',
                    description: 'Servicios de diseño gráfico profesional',
                    price: 800.00,
                    stock: 50
                },
                {
                    id: 3,
                    code: 'PRD003',
                    name: 'Hosting Anual',
                    description: 'Servicio de hosting por 12 meses',
                    price: 2400.00,
                    stock: 25
                }
            ];
            this.saveData();
        }

        this.loadClients();
        this.loadProducts();
    }

    // Navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.showPage(page);
                
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Menu toggle for mobile
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        menuToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    showPage(pageId) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Update page title
            const titles = {
                'dashboard': 'Dashboard',
                'create-invoice': 'Nueva Factura',
                'invoices': 'Gestión de Facturas',
                'clients': 'Gestión de Clientes',
                'products': 'Gestión de Productos',
                'reports': 'Reportes'
            };
            
            document.getElementById('page-title').textContent = titles[pageId] || 'Dashboard';
            
            // Load page-specific data
            this.loadPageData(pageId);
        }
    }

    loadPageData(pageId) {
        switch(pageId) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'invoices':
                this.loadInvoicesTable();
                break;
            case 'clients':
                this.loadClientsTable();
                break;
            case 'products':
                this.loadProductsTable();
                break;
            case 'reports':
                this.loadReports();
                break;
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Invoice form
        document.getElementById('invoice-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createInvoice();
        });

        // Client form
        document.getElementById('client-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveClient();
        });

        // Product form
        document.getElementById('product-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        // Modal events
        this.setupModalEvents();
        
        // Button events
        this.setupButtonEvents();
        
        // Client selection change
        document.getElementById('client-select')?.addEventListener('change', (e) => {
            this.showClientInfo(e.target.value);
        });

        // Search and filters
        this.setupSearchAndFilters();
    }

    setupModalEvents() {
        // Client modal
        const clientModal = document.getElementById('client-modal');
        const productModal = document.getElementById('product-modal');
        
        // Close modals
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                clientModal.classList.remove('active');
                productModal.classList.remove('active');
            });
        });

        // Close on outside click
        [clientModal, productModal].forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    setupButtonEvents() {
        // New client button
        document.getElementById('new-client-btn')?.addEventListener('click', () => {
            this.openClientModal();
        });

        // Add client button in invoice form
        document.getElementById('add-client-btn')?.addEventListener('click', () => {
            this.openClientModal();
        });

        // New product button
        document.getElementById('new-product-btn')?.addEventListener('click', () => {
            this.openProductModal();
        });

        // Add product button in invoice form
        document.getElementById('add-product-btn')?.addEventListener('click', () => {
            this.addProductToInvoice();
        });

        // Save draft button
        document.getElementById('save-draft-btn')?.addEventListener('click', () => {
            this.saveDraft();
        });
    }

    setupSearchAndFilters() {
        // Invoice search
        document.getElementById('invoice-search')?.addEventListener('input', (e) => {
            this.filterInvoices();
        });

        // Status filter
        document.getElementById('status-filter')?.addEventListener('change', () => {
            this.filterInvoices();
        });

        // Date filters
        document.getElementById('date-from')?.addEventListener('change', () => {
            this.filterInvoices();
        });

        document.getElementById('date-to')?.addEventListener('change', () => {
            this.filterInvoices();
        });
    }

    // Dashboard
    updateDashboard() {
        // Update stats
        document.getElementById('total-invoices').textContent = this.invoices.length;
        document.getElementById('total-clients').textContent = this.clients.length;
        
        const totalRevenue = this.invoices
            .filter(inv => inv.status === 'pagada')
            .reduce((sum, inv) => sum + inv.total, 0);
        document.getElementById('total-revenue').textContent = this.formatCurrency(totalRevenue);
        
        const pendingInvoices = this.invoices.filter(inv => inv.status === 'pendiente').length;
        document.getElementById('pending-invoices').textContent = pendingInvoices;

        // Update recent invoices
        this.loadRecentInvoices();
        
        // Update charts
        this.updateCharts();
    }

    loadRecentInvoices() {
        const tbody = document.querySelector('#recent-invoices-table tbody');
        if (!tbody) return;

        const recentInvoices = this.invoices
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        tbody.innerHTML = recentInvoices.map(invoice => {
            const client = this.clients.find(c => c.id == invoice.clientId);
            return `
                <tr>
                    <td>${invoice.number}</td>
                    <td>${client ? client.name : 'Cliente no encontrado'}</td>
                    <td>${this.formatDate(invoice.date)}</td>
                    <td>${this.formatCurrency(invoice.total)}</td>
                    <td><span class="status-badge ${invoice.status}">${invoice.status}</span></td>
                </tr>
            `;
        }).join('');
    }

    // Charts
    initializeCharts() {
        // Sales Chart
        const salesCtx = document.getElementById('salesChart');
        if (salesCtx) {
            this.salesChart = new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Ventas',
                        data: [12000, 15000, 8000, 22000, 18000, 25000],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }

        // Status Chart
        const statusCtx = document.getElementById('statusChart');
        if (statusCtx) {
            this.statusChart = new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Pagadas', 'Pendientes', 'Vencidas'],
                    datasets: [{
                        data: [65, 25, 10],
                        backgroundColor: [
                            '#28a745',
                            '#ffc107',
                            '#dc3545'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    updateCharts() {
        // Update charts with real data
        if (this.salesChart) {
            const salesData = this.getSalesDataByMonth();
            this.salesChart.data.datasets[0].data = salesData;
            this.salesChart.update();
        }

        if (this.statusChart) {
            const statusData = this.getInvoiceStatusData();
            this.statusChart.data.datasets[0].data = statusData;
            this.statusChart.update();
        }
    }

    getSalesDataByMonth() {
        const monthlyData = new Array(6).fill(0);
        const currentDate = new Date();
        
        this.invoices.forEach(invoice => {
            if (invoice.status === 'pagada') {
                const invoiceDate = new Date(invoice.date);
                const monthDiff = currentDate.getMonth() - invoiceDate.getMonth();
                
                if (monthDiff >= 0 && monthDiff < 6) {
                    monthlyData[5 - monthDiff] += invoice.total;
                }
            }
        });
        
        return monthlyData;
    }

    getInvoiceStatusData() {
        const paid = this.invoices.filter(inv => inv.status === 'pagada').length;
        const pending = this.invoices.filter(inv => inv.status === 'pendiente').length;
        const overdue = this.invoices.filter(inv => inv.status === 'vencida').length;
        
        return [paid, pending, overdue];
    }

    // Invoice Management
    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        const invoiceDate = document.getElementById('invoice-date');
        const dueDate = document.getElementById('due-date');
        
        if (invoiceDate) invoiceDate.value = today;
        
        // Set due date to 30 days from today
        if (dueDate) {
            const dueDateValue = new Date();
            dueDateValue.setDate(dueDateValue.getDate() + 30);
            dueDate.value = dueDateValue.toISOString().split('T')[0];
        }
    }

    generateInvoiceNumber() {
        const invoiceNumber = document.getElementById('invoice-number');
        if (invoiceNumber) {
            invoiceNumber.value = `FAC-${String(this.currentInvoiceId).padStart(6, '0')}`;
        }
    }

    loadClients() {
        const clientSelect = document.getElementById('client-select');
        if (!clientSelect) return;

        clientSelect.innerHTML = '<option value="">Seleccionar cliente...</option>';
        this.clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            clientSelect.appendChild(option);
        });
    }

    loadProducts() {
        // This will be used when adding products to invoice
        this.productsList = this.products;
    }

    showClientInfo(clientId) {
        const clientInfo = document.getElementById('client-info');
        if (!clientInfo) return;

        if (!clientId) {
            clientInfo.innerHTML = '';
            return;
        }

        const client = this.clients.find(c => c.id == clientId);
        if (client) {
            clientInfo.innerHTML = `
                <div class="client-details">
                    <h4>${client.name}</h4>
                    <p><strong>Email:</strong> ${client.email}</p>
                    <p><strong>Teléfono:</strong> ${client.phone}</p>
                    <p><strong>RFC:</strong> ${client.rfc}</p>
                    <p><strong>Dirección:</strong> ${client.address}</p>
                </div>
            `;
        }
    }

    addProductToInvoice() {
        Swal.fire({
            title: 'Agregar Producto',
            html: this.getProductSelectionHTML(),
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const productId = document.getElementById('swal-product-select').value;
                const quantity = document.getElementById('swal-quantity').value;
                
                if (!productId || !quantity || quantity <= 0) {
                    Swal.showValidationMessage('Por favor selecciona un producto y cantidad válida');
                    return false;
                }
                
                return { productId: parseInt(productId), quantity: parseInt(quantity) };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.addProductRow(result.value.productId, result.value.quantity);
            }
        });
    }

    getProductSelectionHTML() {
        const productsOptions = this.products.map(product => 
            `<option value="${product.id}">${product.name} - ${this.formatCurrency(product.price)}</option>`
        ).join('');

        return `
            <div style="text-align: left;">
                <div style="margin-bottom: 1rem;">
                    <label for="swal-product-select" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Producto:</label>
                    <select id="swal-product-select" class="swal2-input" style="width: 100%;">
                        <option value="">Seleccionar producto...</option>
                        ${productsOptions}
                    </select>
                </div>
                <div>
                    <label for="swal-quantity" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Cantidad:</label>
                    <input type="number" id="swal-quantity" class="swal2-input" min="1" value="1" style="width: 100%;">
                </div>
            </div>
        `;
    }

    addProductRow(productId, quantity) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const tbody = document.querySelector('#invoice-products-table tbody');
        if (!tbody) return;

        const row = document.createElement('tr');
        const total = product.price * quantity;
        
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${quantity}</td>
            <td>${this.formatCurrency(product.price)}</td>
            <td>${this.formatCurrency(total)}</td>
            <td>
                <button type="button" class="btn-danger" onclick="invoiceSystem.removeProductRow(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        // Store product data in row
        row.dataset.productId = productId;
        row.dataset.quantity = quantity;
        row.dataset.price = product.price;
        row.dataset.total = total;

        tbody.appendChild(row);
        this.calculateInvoiceTotals();
    }

    removeProductRow(button) {
        const row = button.closest('tr');
        row.remove();
        this.calculateInvoiceTotals();
    }

    calculateInvoiceTotals() {
        const rows = document.querySelectorAll('#invoice-products-table tbody tr');
        let subtotal = 0;

        rows.forEach(row => {
            const total = parseFloat(row.dataset.total || 0);
            subtotal += total;
        });

        const tax = subtotal * 0.16; // 16% IVA
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = this.formatCurrency(subtotal);
        document.getElementById('tax').textContent = this.formatCurrency(tax);
        document.getElementById('total').textContent = this.formatCurrency(total);
    }

    createInvoice() {
        const formData = new FormData(document.getElementById('invoice-form'));
        const clientId = document.getElementById('client-select').value;
        const products = this.getInvoiceProducts();

        if (!clientId) {
            this.showAlert('error', 'Error', 'Por favor selecciona un cliente');
            return;
        }

        if (products.length === 0) {
            this.showAlert('error', 'Error', 'Por favor agrega al menos un producto');
            return;
        }

        const invoice = {
            id: parseInt(this.currentInvoiceId),
            number: document.getElementById('invoice-number').value,
            clientId: parseInt(clientId),
            date: document.getElementById('invoice-date').value,
            dueDate: document.getElementById('due-date').value,
            products: products,
            subtotal: this.calculateSubtotal(products),
            tax: this.calculateTax(products),
            total: this.calculateTotal(products),
            status: 'pendiente',
            createdAt: new Date().toISOString()
        };

        this.invoices.push(invoice);
        this.currentInvoiceId++;
        this.saveData();

        this.showAlert('success', '¡Éxito!', 'Factura creada correctamente').then(() => {
            this.resetInvoiceForm();
            this.showPage('invoices');
        });
    }

    getInvoiceProducts() {
        const rows = document.querySelectorAll('#invoice-products-table tbody tr');
        const products = [];

        rows.forEach(row => {
            products.push({
                productId: parseInt(row.dataset.productId),
                quantity: parseInt(row.dataset.quantity),
                price: parseFloat(row.dataset.price),
                total: parseFloat(row.dataset.total)
            });
        });

        return products;
    }

    calculateSubtotal(products) {
        return products.reduce((sum, product) => sum + product.total, 0);
    }

    calculateTax(products) {
        return this.calculateSubtotal(products) * 0.16;
    }

    calculateTotal(products) {
        const subtotal = this.calculateSubtotal(products);
        return subtotal + (subtotal * 0.16);
    }

    resetInvoiceForm() {
        document.getElementById('invoice-form').reset();
        document.querySelector('#invoice-products-table tbody').innerHTML = '';
        document.getElementById('client-info').innerHTML = '';
        this.generateInvoiceNumber();
        this.setCurrentDate();
        this.calculateInvoiceTotals();
    }

    saveDraft() {
        this.showAlert('info', 'Borrador Guardado', 'La factura se ha guardado como borrador');
    }

    // Client Management
    openClientModal(clientId = null) {
        const modal = document.getElementById('client-modal');
        const form = document.getElementById('client-form');
        const title = document.getElementById('client-modal-title');

        if (clientId) {
            const client = this.clients.find(c => c.id === clientId);
            if (client) {
                title.textContent = 'Editar Cliente';
                form.dataset.clientId = clientId;
                document.getElementById('client-name').value = client.name;
                document.getElementById('client-email').value = client.email;
                document.getElementById('client-phone').value = client.phone;
                document.getElementById('client-rfc').value = client.rfc;
                document.getElementById('client-address').value = client.address;
            }
        } else {
            title.textContent = 'Nuevo Cliente';
            form.reset();
            delete form.dataset.clientId;
        }

        modal.classList.add('active');
    }

    saveClient() {
        const form = document.getElementById('client-form');
        const clientId = form.dataset.clientId;
        
        const clientData = {
            name: document.getElementById('client-name').value,
            email: document.getElementById('client-email').value,
            phone: document.getElementById('client-phone').value,
            rfc: document.getElementById('client-rfc').value,
            address: document.getElementById('client-address').value
        };

        if (clientId) {
            // Edit existing client
            const index = this.clients.findIndex(c => c.id === parseInt(clientId));
            if (index !== -1) {
                this.clients[index] = { ...this.clients[index], ...clientData };
            }
        } else {
            // Add new client
            const newClient = {
                id: this.clients.length > 0 ? Math.max(...this.clients.map(c => c.id)) + 1 : 1,
                ...clientData
            };
            this.clients.push(newClient);
        }

        this.saveData();
        this.loadClients();
        this.loadClientsTable();
        
        document.getElementById('client-modal').classList.remove('active');
        
        this.showAlert('success', '¡Éxito!', 
            clientId ? 'Cliente actualizado correctamente' : 'Cliente agregado correctamente');
    }

    loadClientsTable() {
        const tbody = document.querySelector('#clients-table tbody');
        if (!tbody) return;

        tbody.innerHTML = this.clients.map(client => {
            const invoiceCount = this.invoices.filter(inv => inv.clientId === client.id).length;
            
            return `
                <tr>
                    <td>${client.name}</td>
                    <td>${client.email}</td>
                    <td>${client.phone}</td>
                    <td>${client.rfc}</td>
                    <td>${invoiceCount}</td>
                    <td>
                        <button class="action-btn edit" onclick="invoiceSystem.openClientModal(${client.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="invoiceSystem.deleteClient(${client.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    deleteClient(clientId) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.clients = this.clients.filter(c => c.id !== clientId);
                this.saveData();
                this.loadClientsTable();
                this.loadClients();
                
                Swal.fire('¡Eliminado!', 'El cliente ha sido eliminado.', 'success');
            }
        });
    }

    // Product Management
    openProductModal(productId = null) {
        const modal = document.getElementById('product-modal');
        const form = document.getElementById('product-form');
        const title = document.getElementById('product-modal-title');

        if (productId) {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                title.textContent = 'Editar Producto';
                form.dataset.productId = productId;
                document.getElementById('product-code').value = product.code;
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-description').value = product.description;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-stock').value = product.stock;
            }
        } else {
            title.textContent = 'Nuevo Producto';
            form.reset();
            delete form.dataset.productId;
        }

        modal.classList.add('active');
    }

    saveProduct() {
        const form = document.getElementById('product-form');
        const productId = form.dataset.productId;
        
        const productData = {
            code: document.getElementById('product-code').value,
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value) || 0
        };

        if (productId) {
            // Edit existing product
            const index = this.products.findIndex(p => p.id === parseInt(productId));
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...productData };
            }
        } else {
            // Add new product
            const newProduct = {
                id: this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1,
                ...productData
            };
            this.products.push(newProduct);
        }

        this.saveData();
        this.loadProducts();
        this.loadProductsTable();
        
        document.getElementById('product-modal').classList.remove('active');
        
        this.showAlert('success', '¡Éxito!', 
            productId ? 'Producto actualizado correctamente' : 'Producto agregado correctamente');
    }

    loadProductsTable() {
        const tbody = document.querySelector('#products-table tbody');
        if (!tbody) return;

        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${this.formatCurrency(product.price)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="action-btn edit" onclick="invoiceSystem.openProductModal(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="invoiceSystem.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    deleteProduct(productId) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.products = this.products.filter(p => p.id !== productId);
                this.saveData();
                this.loadProductsTable();
                this.loadProducts();
                
                Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
            }
        });
    }

    // Invoice Table
    loadInvoicesTable() {
        const tbody = document.querySelector('#invoices-table tbody');
        if (!tbody) return;

        tbody.innerHTML = this.invoices.map(invoice => {
            const client = this.clients.find(c => c.id === invoice.clientId);
            
            return `
                <tr>
                    <td>${invoice.number}</td>
                    <td>${client ? client.name : 'Cliente no encontrado'}</td>
                    <td>${this.formatDate(invoice.date)}</td>
                    <td>${this.formatDate(invoice.dueDate)}</td>
                    <td>${this.formatCurrency(invoice.total)}</td>
                    <td><span class="status-badge ${invoice.status}">${invoice.status}</span></td>
                    <td>
                        <button class="action-btn view" onclick="invoiceSystem.viewInvoice(${invoice.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="invoiceSystem.editInvoice(${invoice.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="invoiceSystem.deleteInvoice(${invoice.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    filterInvoices() {
        const searchTerm = document.getElementById('invoice-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('status-filter')?.value || '';
        const dateFrom = document.getElementById('date-from')?.value || '';
        const dateTo = document.getElementById('date-to')?.value || '';

        let filteredInvoices = this.invoices.filter(invoice => {
            const client = this.clients.find(c => c.id === invoice.clientId);
            const matchesSearch = !searchTerm || 
                invoice.number.toLowerCase().includes(searchTerm) ||
                (client && client.name.toLowerCase().includes(searchTerm));
            
            const matchesStatus = !statusFilter || invoice.status === statusFilter;
            
            const matchesDateFrom = !dateFrom || invoice.date >= dateFrom;
            const matchesDateTo = !dateTo || invoice.date <= dateTo;

            return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
        });

        this.displayFilteredInvoices(filteredInvoices);
    }

    displayFilteredInvoices(invoices) {
        const tbody = document.querySelector('#invoices-table tbody');
        if (!tbody) return;

        tbody.innerHTML = invoices.map(invoice => {
            const client = this.clients.find(c => c.id === invoice.clientId);
            
            return `
                <tr>
                    <td>${invoice.number}</td>
                    <td>${client ? client.name : 'Cliente no encontrado'}</td>
                    <td>${this.formatDate(invoice.date)}</td>
                    <td>${this.formatDate(invoice.dueDate)}</td>
                    <td>${this.formatCurrency(invoice.total)}</td>
                    <td><span class="status-badge ${invoice.status}">${invoice.status}</span></td>
                    <td>
                        <button class="action-btn view" onclick="invoiceSystem.viewInvoice(${invoice.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="invoiceSystem.editInvoice(${invoice.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="invoiceSystem.deleteInvoice(${invoice.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    viewInvoice(invoiceId) {
        const invoice = this.invoices.find(inv => inv.id === invoiceId);
        const client = this.clients.find(c => c.id === invoice.clientId);
        
        if (!invoice) return;

        let productsHTML = '';
        let subtotal = 0;

        invoice.products.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                productsHTML += `
                    <tr>
                        <td>${product.name}</td>
                        <td>${item.quantity}</td>
                        <td>${this.formatCurrency(item.price)}</td>
                        <td>${this.formatCurrency(item.total)}</td>
                    </tr>
                `;
                subtotal += item.total;
            }
        });

        const tax = subtotal * 0.16;
        const total = subtotal + tax;

        Swal.fire({
            title: `Factura ${invoice.number}`,
            html: `
                <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                    <div style="margin-bottom: 1rem;">
                        <strong>Cliente:</strong> ${client ? client.name : 'N/A'}<br>
                        <strong>Fecha:</strong> ${this.formatDate(invoice.date)}<br>
                        <strong>Vencimiento:</strong> ${this.formatDate(invoice.dueDate)}<br>
                        <strong>Estado:</strong> <span class="status-badge ${invoice.status}">${invoice.status}</span>
                    </div>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 8px; border: 1px solid #dee2e6;">Producto</th>
                                <th style="padding: 8px; border: 1px solid #dee2e6;">Cant.</th>
                                <th style="padding: 8px; border: 1px solid #dee2e6;">Precio</th>
                                <th style="padding: 8px; border: 1px solid #dee2e6;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productsHTML}
                        </tbody>
                    </table>
                    
                    <div style="text-align: right; margin-top: 1rem;">
                        <div><strong>Subtotal:</strong> ${this.formatCurrency(subtotal)}</div>
                        <div><strong>IVA (16%):</strong> ${this.formatCurrency(tax)}</div>
                        <div style="font-size: 1.2rem; margin-top: 0.5rem;"><strong>Total:</strong> ${this.formatCurrency(total)}</div>
                    </div>
                </div>
            `,
            width: '600px',
            confirmButtonText: 'Cerrar'
        });
    }

    editInvoice(invoiceId) {
        this.showAlert('info', 'Función en desarrollo', 'La edición de facturas estará disponible próximamente');
    }

    deleteInvoice(invoiceId) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.invoices = this.invoices.filter(inv => inv.id !== invoiceId);
                this.saveData();
                this.loadInvoicesTable();
                this.updateDashboard();
                
                Swal.fire('¡Eliminada!', 'La factura ha sido eliminada.', 'success');
            }
        });
    }

    // Reports
    loadReports() {
        this.loadClientSalesChart();
        this.loadProductSalesChart();
    }

    loadClientSalesChart() {
        const ctx = document.getElementById('clientSalesChart');
        if (!ctx) return;

        const clientSales = this.clients.map(client => {
            const sales = this.invoices
                .filter(inv => inv.clientId === client.id && inv.status === 'pagada')
                .reduce((sum, inv) => sum + inv.total, 0);
            
            return {
                name: client.name,
                sales: sales
            };
        }).sort((a, b) => b.sales - a.sales).slice(0, 5);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: clientSales.map(c => c.name),
                datasets: [{
                    label: 'Ventas',
                    data: clientSales.map(c => c.sales),
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    loadProductSalesChart() {
        const ctx = document.getElementById('productSalesChart');
        if (!ctx) return;

        const productSales = {};
        
        this.invoices.forEach(invoice => {
            if (invoice.status === 'pagada') {
                invoice.products.forEach(item => {
                    if (!productSales[item.productId]) {
                        productSales[item.productId] = 0;
                    }
                    productSales[item.productId] += item.quantity;
                });
            }
        });

        const topProducts = Object.entries(productSales)
            .map(([productId, quantity]) => {
                const product = this.products.find(p => p.id == productId);
                return {
                    name: product ? product.name : 'Producto no encontrado',
                    quantity: quantity
                };
            })
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: topProducts.map(p => p.name),
                datasets: [{
                    data: topProducts.map(p => p.quantity),
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Utility Functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-MX');
    }

    showAlert(type, title, text) {
        return Swal.fire({
            icon: type,
            title: title,
            text: text,
            confirmButtonColor: '#667eea'
        });
    }

    saveData() {
        localStorage.setItem('invoices', JSON.stringify(this.invoices));
        localStorage.setItem('clients', JSON.stringify(this.clients));
        localStorage.setItem('products', JSON.stringify(this.products));
        localStorage.setItem('currentInvoiceId', this.currentInvoiceId);
    }
}

// Initialize the application
let invoiceSystem;

document.addEventListener('DOMContentLoaded', function() {
    invoiceSystem = new InvoiceSystem();
});

// Make functions globally available
window.showPage = function(page) {
    invoiceSystem.showPage(page);
};
