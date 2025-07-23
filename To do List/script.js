// DOM Elements
const taskCheckboxes = document.querySelectorAll('.task-checkbox');
const addTaskBtn = document.querySelector('.add-task-btn');
const finishBtn = document.querySelector('.finish-btn');
const themeToggle = document.getElementById('theme-toggle');
const taskList = document.querySelector('.task-list');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Delay slightly to ensure all DOM elements are fully loaded
    setTimeout(() => {
        // Clear any existing default projects and tasks from localStorage on first load
        clearDefaultProjects();
        clearDefaultTasks();
        
        initializeEventListeners();
        updateGreeting();
        loadTasks();
        initializeFocusMode();
        initializeProjectInteractions();
        initializeListInteractions();
        updateTaskStatistics();
        initializeClock();
        loadCustomData();
        initializeModals();
        
        // Force update clock immediately
        updateClock();
    }, 50);
});

// Clear default projects from localStorage
function clearDefaultProjects() {
    const savedProjects = localStorage.getItem('customProjects');
    if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const defaultProjects = ['Sitio Web', 'Programacion', 'Diseño UI', 'App Móvil'];
        
        // Filter out default projects
        const filteredProjects = projects.filter(project => 
            !defaultProjects.includes(project.name)
        );
        
        // Save filtered projects back to localStorage
        localStorage.setItem('customProjects', JSON.stringify(filteredProjects));
    }
}

// Clear default tasks from localStorage
function clearDefaultTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        const defaultTasks = ['Crear sistema de diseño', 'Crear 3 secciones hero alternativas', 'Programacion'];
        
        // Filter out default tasks
        const filteredTasks = tasks.filter(task => 
            !defaultTasks.includes(task.text)
        );
        
        // Save filtered tasks back to localStorage
        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    }
}

// Event Listeners
function initializeEventListeners() {
    // Task checkbox handlers
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleTaskToggle);
    });

    // Task menu handlers for existing tasks
    const existingTaskMenus = document.querySelectorAll('.task-menu');
    existingTaskMenus.forEach(menu => {
        menu.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            showTaskMenu(e, taskItem);
        });
    });

    // Add task button
    addTaskBtn.addEventListener('click', showAddTaskDialog);

    // Finish button
    finishBtn.addEventListener('click', finishCompletedTasks);

    // Theme toggle
    themeToggle.addEventListener('change', toggleTheme);

    // Menu item interactions
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Initialize delete buttons for existing projects
    initializeExistingDeleteButtons();

    // Initialize project action buttons
    initializeProjectActionButtons();
}

// Task Management Functions
function handleTaskToggle(e) {
    const taskItem = e.target.closest('.task-item');
    const taskText = taskItem.querySelector('.task-text');
    
    if (e.target.checked) {
        taskText.style.textDecoration = 'line-through';
        taskText.style.color = '#999';
        taskItem.style.opacity = '0.6';
        
        // Add completion animation
        taskItem.style.transform = 'scale(0.98)';
        setTimeout(() => {
            taskItem.style.transform = 'scale(1)';
        }, 200);
    } else {
        taskText.style.textDecoration = 'none';
        taskText.style.color = '#333';
        taskItem.style.opacity = '1';
    }
    
    updateTaskProgress();
}

function showAddTaskDialog() {
    const modal = document.getElementById('taskModal');
    const taskInput = document.getElementById('taskInput');
    
    // Show modal
    modal.classList.add('show');
    
    // Focus on input
    setTimeout(() => {
        taskInput.focus();
    }, 100);
    
    // Clear previous values
    taskInput.value = '';
    
    // Reset priority selection to medium
    document.querySelectorAll('.priority-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector('.priority-option.medium').classList.add('selected');
}

function addNewTask(text) {
    // Use medium priority as default for backward compatibility
    addNewTaskWithPriority(text, 'medium');
}

function addNewTaskWithPriority(text, priority) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.style.animation = 'fadeIn 0.6s ease-out';
    
    const priorityNames = {
        'high': 'Alta',
        'medium': 'Media',
        'low': 'Baja'
    };
    
    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        <span class="task-text">${text}</span>
        <div class="task-priority ${priority}">
            <span class="priority-dot"></span>
            <span>${priorityNames[priority]}</span>
        </div>
        <i class="fas fa-ellipsis-h task-menu"></i>
    `;
    
    taskList.appendChild(taskItem);
    
    // Add event listener to new checkbox
    const newCheckbox = taskItem.querySelector('.task-checkbox');
    newCheckbox.addEventListener('change', handleTaskToggle);
      // Add menu functionality
    const taskMenu = taskItem.querySelector('.task-menu');
    taskMenu.addEventListener('click', (e) => showTaskMenu(e, taskItem));    updateTaskStatistics();
    showNotification(`Tarea "${text}" agregada con prioridad ${priorityNames[priority]}`);
    
    // Auto-save tasks
    saveTasks();
}

function showTaskMenu(e, taskItem) {
    e.stopPropagation();
    
    // Remove any existing menu
    const existingMenu = document.querySelector('.task-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create context menu
    const menu = document.createElement('div');
    menu.className = 'task-context-menu';
    menu.style.cssText = `
        position: absolute;
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        min-width: 180px;
        font-size: 14px;
        overflow: hidden;
    `;
    
    // Dark mode styles
    if (document.body.classList.contains('dark')) {
        menu.style.background = '#2c3e50';
        menu.style.borderColor = '#34495e';
        menu.style.color = '#ecf0f1';
    }
    
    menu.innerHTML = `
        <div class="menu-section">
            <div class="menu-header">Cambiar Prioridad</div>
            <div class="menu-item" data-priority="high">
                <span class="priority-dot high-dot"></span>
                <span>Alta</span>
            </div>
            <div class="menu-item" data-priority="medium">
                <span class="priority-dot medium-dot"></span>
                <span>Media</span>
            </div>
            <div class="menu-item" data-priority="low">
                <span class="priority-dot low-dot"></span>
                <span>Baja</span>
            </div>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item delete-item">
            <i class="fas fa-trash"></i>
            <span>Eliminar Tarea</span>
        </div>
    `;
    
    // Position menu
    const rect = e.target.getBoundingClientRect();
    menu.style.left = (rect.left - 160) + 'px';
    menu.style.top = (rect.top + 25) + 'px';
    
    document.body.appendChild(menu);
    
    // Add event listeners
    menu.querySelectorAll('[data-priority]').forEach(item => {
        item.addEventListener('click', () => {
            const priority = item.dataset.priority;
            changePriority(taskItem, priority);
            menu.remove();
        });
    });
    
    menu.querySelector('.delete-item').addEventListener('click', () => {
        deleteTask(taskItem);
        menu.remove();
    });
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        });
    }, 100);
}

function changePriority(taskItem, newPriority) {
    const priorityElement = taskItem.querySelector('.task-priority');
    const priorityText = priorityElement.querySelector('span:last-child');
    
    // Remove old priority class
    priorityElement.classList.remove('high', 'medium', 'low');
    
    // Add new priority class
    priorityElement.classList.add(newPriority);
    
    // Update text
    const priorityNames = {
        'high': 'Alta',
        'medium': 'Media',
        'low': 'Baja'
    };    priorityText.textContent = priorityNames[newPriority];
    
    showNotification(`Prioridad cambiada a ${priorityNames[newPriority]}`);
    
    // Auto-save tasks
    saveTasks();
}

function deleteTask(taskItem) {
    showConfirmation('¿Estás seguro de que quieres eliminar esta tarea?').then(confirmed => {
        if (confirmed) {
            taskItem.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                taskItem.remove();
                updateTaskProgress();
            }, 300);
        }
    });
}

function finishCompletedTasks() {
    const completedTasks = document.querySelectorAll('.task-checkbox:checked');
    
    if (completedTasks.length === 0) {
        showNotification('No hay tareas completadas para finalizar', 'warning');
        return;
    }
    
    showConfirmation(`¿Quieres finalizar ${completedTasks.length} tarea(s) completada(s)?`).then(confirmed => {
        if (confirmed) {
            completedTasks.forEach(checkbox => {
                const taskItem = checkbox.closest('.task-item');
                taskItem.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    taskItem.remove();
                }, 300);
            });
            
            setTimeout(() => {
                updateTaskProgress();
                showCompletionMessage();
            }, 400);
        }
    });
}

function updateTaskProgress() {
    updateTaskStatistics();
    
    const totalTasks = document.querySelectorAll('.task-checkbox').length;
    const completedTasks = document.querySelectorAll('.task-checkbox:checked').length;
    
    if (totalTasks === 0) return;
    
    const progressPercentage = (completedTasks / totalTasks) * 100;
    console.log(`Progreso: ${completedTasks}/${totalTasks} (${progressPercentage.toFixed(1)}%)`);
}

function showCompletionMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 20px 40px;
        border-radius: 15px;
        font-weight: 600;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: fadeIn 0.5s ease-out;
    `;
    message.textContent = '¡Tareas completadas! 🎉';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Theme Management
function toggleTheme() {
    const body = document.body;
    const isDark = themeToggle.checked;
    
    if (isDark) {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
    }
    
    // Store theme preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Greeting Management
function updateGreeting() {
    const greetingElement = document.querySelector('.greeting h1');
    const now = new Date();
    const hour = now.getHours();
    const userName = 'Benjamin'; // Could be dynamic
    
    let greeting;
    if (hour < 12) {
        greeting = `¡Buenos días, ${userName}!`;
    } else if (hour < 18) {
        greeting = `¡Buenas tardes, ${userName}!`;
    } else {
        greeting = `¡Buenas noches, ${userName}!`;
    }
    
    greetingElement.textContent = greeting;
}

function loadTasks() {
    // Solo cargar tareas guardadas por el usuario, no hay tareas predeterminadas
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            addNewTaskWithPriority(task.text, task.priority || 'medium');
            // Si la tarea estaba completada, marcarla como completada
            if (task.completed) {
                const lastTaskItem = taskList.lastElementChild;
                const checkbox = lastTaskItem.querySelector('.task-checkbox');
                checkbox.checked = true;
                handleTaskToggle({ target: checkbox });
            }
        });
    }
}

// Save Tasks
function saveTasks() {
    const taskTexts = Array.from(document.querySelectorAll('.task-item')).map(taskItem => {
        const text = taskItem.querySelector('.task-text').textContent;
        const completed = taskItem.querySelector('.task-checkbox').checked;
        const priorityElement = taskItem.querySelector('.task-priority');
        
        let priority = 'medium'; // default
        if (priorityElement.classList.contains('high')) priority = 'high';
        else if (priorityElement.classList.contains('low')) priority = 'low';
        else if (priorityElement.classList.contains('medium')) priority = 'medium';
        
        return { text, completed, priority };
    });
    
    localStorage.setItem('tasks', JSON.stringify(taskTexts));
}

// Auto-save tasks when page unloads
window.addEventListener('beforeunload', saveTasks);

// Load theme preference
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        document.body.classList.add('dark');
    }
});

// Add some interactive animations
function addInteractiveAnimations() {
    // Hover effects for task items
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Button click animations
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// Initialize animations after DOM load
document.addEventListener('DOMContentLoaded', addInteractiveAnimations);

// Add CSS for fade out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Focus Mode functionality
function initializeFocusMode() {
    const focusModeBtn = document.querySelector('.focus-mode');
    let focusModeActive = false;
    
    focusModeBtn.addEventListener('click', function() {
        focusModeActive = !focusModeActive;
        
        if (focusModeActive) {
            // Activar modo focus
            this.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            this.style.color = 'white';
            this.innerHTML = '<i class="fas fa-eye-slash"></i> Exit Focus';
            
            // Ocultar tareas completadas
            const completedTasks = document.querySelectorAll('.task-checkbox:checked');
            completedTasks.forEach(checkbox => {
                const taskItem = checkbox.closest('.task-item');
                taskItem.style.display = 'none';
            });
            
            // Mostrar mensaje
            showNotification('Modo Focus activado - Tareas completadas ocultas');
        } else {
            // Desactivar modo focus
            this.style.background = 'none';
            this.style.color = '#666';
            this.innerHTML = '<i class="fas fa-eye"></i> Focus Mode';
            
            // Mostrar todas las tareas
            const allTasks = document.querySelectorAll('.task-item');
            allTasks.forEach(taskItem => {
                taskItem.style.display = 'flex';
            });
            
            showNotification('Modo Focus desactivado');
        }
    });
}

// Custom confirmation system to replace alerts
function showConfirmation(options) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmationModal');
        const icon = document.getElementById('confirmationIcon');
        const title = document.getElementById('confirmationTitle');
        const message = document.getElementById('confirmationMessage');
        const cancelBtn = document.getElementById('confirmationCancel');
        const confirmBtn = document.getElementById('confirmationConfirm');
        
        // Handle both string and object parameters
        if (typeof options === 'string') {
            options = { message: options };
        }
        
        // Set content
        title.textContent = options.title || '¿Estás seguro?';
        message.textContent = options.message || 'Esta acción no se puede deshacer.';
        
        // Set icon
        icon.className = 'confirmation-icon';
        if (options.type === 'warning') {
            icon.className += ' warning';
            icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        } else if (options.type === 'danger') {
            icon.className += ' error';
            icon.innerHTML = '<i class="fas fa-trash"></i>';
            confirmBtn.className = 'confirmation-btn confirmation-btn-danger';
        } else {
            icon.innerHTML = '<i class="fas fa-question-circle"></i>';
            confirmBtn.className = 'confirmation-btn confirmation-btn-confirm';
        }
        
        // Set button texts
        cancelBtn.textContent = options.cancelText || 'Cancelar';
        confirmBtn.textContent = options.confirmText || 'Confirmar';
        
        // Show modal
        modal.classList.add('show');
        
        // Handle buttons
        const handleCancel = () => {
            modal.classList.remove('show');
            cleanup();
            resolve(false);
        };
        
        const handleConfirm = () => {
            modal.classList.remove('show');
            cleanup();
            resolve(true);
        };
        
        const cleanup = () => {
            cancelBtn.removeEventListener('click', handleCancel);
            confirmBtn.removeEventListener('click', handleConfirm);
            document.removeEventListener('keydown', handleKeydown);
        };
        
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                handleCancel();
            } else if (e.key === 'Enter') {
                handleConfirm();
            }
        };
        
        cancelBtn.addEventListener('click', handleCancel);
        confirmBtn.addEventListener('click', handleConfirm);        document.addEventListener('keydown', handleKeydown);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        });
    });
}

// Custom notification system (replacing alerts)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : 'linear-gradient(135deg, #667eea, #764ba2)'};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 4000;
        animation: slideIn 0.3s ease-out;
        transform: translateX(100%);
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const icon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    notification.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Clock functionality
function initializeClock() {
    updateClock();
    // Update clock every second
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    
    // Format time in Spanish
    const timeOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    const timeString = now.toLocaleTimeString('es-ES', timeOptions);
    
    // Format date in Spanish
    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateString = now.toLocaleDateString('es-ES', dateOptions);
    
    // Capitalize first letter of weekday and month
    const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);
    
    // Update DOM elements
    const timeDisplay = document.getElementById('current-time');
    const dateDisplay = document.getElementById('current-date');
    
    if (timeDisplay) {
        timeDisplay.textContent = timeString;
    }
    
    if (dateDisplay) {
        dateDisplay.textContent = formattedDate;
    }
}

// Project functionality - simplified
function initializeProjectInteractions() {
    const projectCategories = document.querySelectorAll('.project-category');
    
    projectCategories.forEach(category => {
        category.addEventListener('click', function(e) {
            // Don't toggle if clicking on action buttons
            if (e.target.classList.contains('fa-plus') || 
                e.target.classList.contains('fa-ellipsis-h') ||
                e.target.closest('.project-actions')) {
                return;
            }
            
            const chevron = this.querySelector('i');
            const projectItems = this.nextElementSibling;
            
            if (projectItems && projectItems.classList.contains('project-items')) {
                const isVisible = projectItems.style.display !== 'none';
                
                if (isVisible) {
                    projectItems.style.display = 'none';
                    chevron.style.transform = 'rotate(-90deg)';
                } else {
                    projectItems.style.display = 'block';
                    chevron.style.transform = 'rotate(0deg)';
                }
            }
        });
    });
}

// Project Management Functions
function initializeProjectModal() {
    const projectModal = document.getElementById('projectModal');
    const projectInput = document.getElementById('projectInput');
    const projectModalClose = document.getElementById('projectModalClose');
    const projectModalCancel = document.getElementById('projectModalCancel');
    const projectModalSubmit = document.getElementById('projectModalSubmit');
    
    if (!projectModal || !projectInput || !projectModalSubmit) {
        return;
    }
    
    // Handle color selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Close modal function
    const closeProjectModal = () => {
        projectModal.classList.remove('show');
    };
    
    // Handle form submission
    const handleSubmit = () => {
        const projectName = projectInput.value.trim();
        const selectedColorElement = document.querySelector('.color-option.selected');
        const selectedColor = selectedColorElement ? selectedColorElement.dataset.color : '#ff6b35';
        
        if (projectName) {
            addNewProject(projectName, selectedColor);
            closeProjectModal();
            projectInput.value = '';
            // Reset color selection
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            document.querySelector('.color-option')?.classList.add('selected');
        } else {
            projectInput.focus();
            projectInput.style.borderColor = '#e74c3c';
            showNotification('Por favor ingresa un nombre para el proyecto', 'warning');
            setTimeout(() => {
                projectInput.style.borderColor = '#e9ecef';
            }, 2000);
        }
    };
    
    // Event listeners for close buttons
    if (projectModalClose) {
        projectModalClose.addEventListener('click', closeProjectModal);
    }
    
    if (projectModalCancel) {
        projectModalCancel.addEventListener('click', closeProjectModal);
    }
    
    projectModalSubmit.addEventListener('click', handleSubmit);
    
    // Handle Enter key
    projectInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
    
    // Close on outside click
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });
}

function addNewProject(name, color) {
    const projectList = document.querySelector('.project-items');
    const newProject = document.createElement('li');
    newProject.className = 'project-item';
    
    newProject.innerHTML = `
        <i class="fas fa-circle" style="color: ${color};"></i>
        <span>${name}</span>
        <i class="fas fa-times delete-project"></i>
    `;
      // Add delete functionality
    newProject.querySelector('.delete-project').addEventListener('click', async function(e) {
        e.stopPropagation();
        const confirmed = await showConfirmation(`¿Estás seguro de que quieres eliminar el proyecto "${name}"?`);
        if (confirmed) {
            newProject.remove();
            saveCustomData();
            showNotification(`Proyecto "${name}" eliminado`);
        }
    });
    
    projectList.appendChild(newProject);
    saveCustomData();
    showNotification(`Proyecto "${name}" agregado exitosamente`);
}

// List Management Functions
function initializeListInteractions() {
    const listsToggle = document.querySelector('.lists-toggle');
    const listsContent = document.querySelector('.lists-content');
    const addListBtn = document.getElementById('addListBtn');
    
    // Toggle lists visibility
    listsToggle.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-btn') || e.target.classList.contains('fa-plus')) {
            return; // Don't toggle when clicking add button
        }
        
        listsContent.classList.toggle('collapsed');
        listsContent.classList.toggle('expanded');
    });
    
    // Add list button event listener
    if (addListBtn) {
        addListBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showListModal();
        });
    }
}

function addNewList(name) {
    const customLists = document.getElementById('customLists');
    const newList = document.createElement('div');
    newList.className = 'list-item';
    
    newList.innerHTML = `
        <i class="fas fa-list list-icon"></i>
        <span class="list-name">${name}</span>
        <i class="fas fa-times delete-list"></i>
    `;
      // Add delete functionality
    newList.querySelector('.delete-list').addEventListener('click', async function(e) {
        e.stopPropagation();
        const confirmed = await showConfirmation(`¿Estás seguro de que quieres eliminar la lista "${name}"?`);
        if (confirmed) {
            newList.remove();
            saveCustomData();
            showNotification(`Lista "${name}" eliminada`);
        }
    });
    
    customLists.appendChild(newList);
    saveCustomData();
    showNotification(`Lista "${name}" agregada exitosamente`);
}

// Data persistence functions
function saveCustomData() {
    const projects = [];
    const lists = [];
    
    // Save projects
    document.querySelectorAll('.project-item').forEach(item => {
        const name = item.querySelector('span').textContent;
        const color = item.querySelector('i').style.color;
        projects.push({ name, color });
    });
    
    // Save lists
    document.querySelectorAll('.list-item').forEach(item => {
        const name = item.querySelector('.list-name').textContent;
        lists.push({ name });
    });
    
    localStorage.setItem('customProjects', JSON.stringify(projects));
    localStorage.setItem('customLists', JSON.stringify(lists));
}

function loadCustomData() {
    // Load projects
    const savedProjects = localStorage.getItem('customProjects');
    if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        
        projects.forEach(project => {
            addNewProject(project.name, project.color);
        });
    }
    
    // Load lists
    const savedLists = localStorage.getItem('customLists');
    if (savedLists) {        const lists = JSON.parse(savedLists);
        lists.forEach(list => {
            addNewList(list.name);
        });
    }
}

// Initialize existing delete buttons and project actions
function initializeExistingDeleteButtons() {
    // Esta función ahora se llama dinámicamente cuando se agregan nuevos proyectos
    // No hay proyectos predeterminados en el HTML
}

function initializeProjectActionButtons() {
    // Add project buttons
    const addProjectBtns = document.querySelectorAll('#addProjectBtn, #addPersonalProjectBtn');
    addProjectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            showProjectModal();
        });
    });

    // Project ellipsis menus
    document.querySelectorAll('.project-actions .fa-ellipsis-h').forEach(ellipsis => {
        ellipsis.addEventListener('click', function(e) {
            e.stopPropagation();
            showProjectActionsMenu(e, this);
        });
    });
}

function showProjectModal() {
    const projectModal = document.getElementById('projectModal');
    const projectInput = document.getElementById('projectInput');
    
    projectModal.classList.add('show');
    
    // Focus on input
    setTimeout(() => {
        projectInput.focus();
    }, 100);
    
    // Clear previous values
    projectInput.value = '';
    
    // Reset color selection
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.color-option').classList.add('selected');
}

function showListModal() {
    const listModal = document.getElementById('listModal');
    const listInput = document.getElementById('listInput');
    
    listModal.classList.add('show');
    
    // Focus on input
    setTimeout(() => {
        listInput.focus();
    }, 100);
    
    // Clear previous values
    listInput.value = '';
}

function showProjectActionsMenu(e, ellipsisBtn) {
    // Remove any existing menu
    const existingMenu = document.querySelector('.project-actions-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create context menu
    const menu = document.createElement('div');
    menu.className = 'project-actions-menu';
    menu.style.cssText = `
        position: absolute;
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        min-width: 160px;
        font-size: 14px;
        overflow: hidden;
    `;
    
    // Dark mode styles
    if (document.body.classList.contains('dark')) {
        menu.style.background = '#2c3e50';
        menu.style.borderColor = '#34495e';
        menu.style.color = '#ecf0f1';
    }
    
    const categoryName = ellipsisBtn.closest('.project-category').querySelector('span').textContent;
    
    menu.innerHTML = `
        <div class="menu-item" data-action="add">
            <i class="fas fa-plus"></i>
            <span>Agregar Proyecto</span>
        </div>
        <div class="menu-item" data-action="rename">
            <i class="fas fa-edit"></i>
            <span>Renombrar Categoría</span>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item delete-item" data-action="delete">
            <i class="fas fa-trash"></i>
            <span>Eliminar Categoría</span>
        </div>
    `;
    
    // Position menu
    const rect = e.target.getBoundingClientRect();
    menu.style.left = (rect.left - 140) + 'px';
    menu.style.top = (rect.top + 25) + 'px';
    
    document.body.appendChild(menu);
    
    // Add event listeners
    menu.querySelectorAll('[data-action]').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            
            switch(action) {
                case 'add':
                    showProjectModal();
                    break;
                case 'rename':
                    renameProjectCategory(ellipsisBtn.closest('.project-category'));
                    break;
                case 'delete':
                    deleteProjectCategory(ellipsisBtn.closest('.project-category'));
                    break;
            }
            
            menu.remove();
        });
    });
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
            if (menu.parentNode) {
                menu.remove();
            }
            document.removeEventListener('click', closeMenu);
        });
    }, 100);
}

function renameProjectCategory(categoryElement) {
    const categorySpan = categoryElement.querySelector('span');
    const currentName = categorySpan.textContent;
    
    // Create a simple input modal for renaming
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        width: 400px;
        max-width: 90vw;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;
    
    if (document.body.classList.contains('dark')) {
        modalContent.style.background = '#2c3e50';
        modalContent.style.color = '#ecf0f1';
    }
    
    modalContent.innerHTML = `
        <h3 style="margin: 0 0 20px 0; font-size: 18px;">Renombrar Categoría</h3>
        <input type="text" id="renameInput" value="${currentName}" style="
            width: 100%;
            padding: 12px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 20px;
            box-sizing: border-box;
        ">
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="renameCancelBtn" style="
                padding: 10px 20px;
                border: 1px solid #ccc;
                border-radius: 6px;
                background: transparent;
                cursor: pointer;
            ">Cancelar</button>
            <button id="renameConfirmBtn" style="
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                cursor: pointer;
            ">Guardar</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    const input = modal.querySelector('#renameInput');
    const cancelBtn = modal.querySelector('#renameCancelBtn');
    const confirmBtn = modal.querySelector('#renameConfirmBtn');
    
    input.focus();
    input.select();
    
    const closeModal = () => {
        modal.remove();
    };
    
    const saveRename = () => {
        const newName = input.value.trim();
        if (newName && newName !== currentName) {
            categorySpan.textContent = newName;
            saveCustomData();
            showNotification(`Categoría renombrada a "${newName}"`);
        }
        closeModal();
    };
    
    cancelBtn.addEventListener('click', closeModal);
    confirmBtn.addEventListener('click', saveRename);
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveRename();
        } else if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

async function deleteProjectCategory(categoryElement) {
    const categoryName = categoryElement.querySelector('span').textContent;
    const projectList = categoryElement.nextElementSibling;
    const projectCount = projectList ? projectList.querySelectorAll('.project-item').length : 0;
    
    let confirmMessage = `¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`;
    if (projectCount > 0) {
        confirmMessage += `\n\nEsto también eliminará ${projectCount} proyecto(s) dentro de esta categoría.`;
    }
    
    const confirmed = await showConfirmation(confirmMessage);
    if (confirmed) {
        categoryElement.remove();
        if (projectList) {
            projectList.remove();
        }
        saveCustomData();
        showNotification(`Categoría "${categoryName}" eliminada`);
    }
}

// Initialize all modals
function initializeModals() {
    initializeTaskModal();
    initializeProjectModal();
    initializeListModal();
}

// Initialize task modal
function initializeTaskModal() {
    const modal = document.getElementById('taskModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalSubmit = document.getElementById('modalSubmit');
    const taskInput = document.getElementById('taskInput');
    
    if (!modal || !modalClose || !modalCancel || !modalSubmit || !taskInput) {
        return;
    }
    
    const closeModal = () => {
        modal.classList.remove('show');
    };
    
    const handleSubmit = () => {
        const taskText = taskInput.value.trim();
        const selectedPriority = document.querySelector('.priority-option.selected')?.dataset.priority || 'medium';
        
        if (taskText) {
            addNewTaskWithPriority(taskText, selectedPriority);
            closeModal();
            taskInput.value = '';
            // Reset priority selection
            document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
            document.querySelector('.priority-option.medium')?.classList.add('selected');
        } else {
            taskInput.focus();
            taskInput.style.borderColor = '#e74c3c';
            showNotification('Por favor ingresa una descripción para la tarea', 'warning');
            setTimeout(() => {
                taskInput.style.borderColor = '#e9ecef';
            }, 2000);
        }
    };
    
    // Event listeners
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modalSubmit.addEventListener('click', handleSubmit);
    
    // Enter key handler
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
    
    // Priority selection handlers
    document.querySelectorAll('.priority-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

// Initialize list modal
function initializeListModal() {
    const modal = document.getElementById('listModal');
    const modalClose = document.getElementById('listModalClose');
    const modalCancel = document.getElementById('listModalCancel');
    const modalSubmit = document.getElementById('listModalSubmit');
    const listInput = document.getElementById('listInput');
    
    if (!modal || !modalClose || !modalCancel || !modalSubmit || !listInput) {
        return;
    }
    
    const closeModal = () => {
        modal.classList.remove('show');
    };
    
    const handleSubmit = () => {
        const listName = listInput.value.trim();
        
        if (listName) {
            addNewList(listName);
            closeModal();
            listInput.value = '';
        } else {
            listInput.focus();
            listInput.style.borderColor = '#e74c3c';
            showNotification('Por favor ingresa un nombre para la lista', 'warning');
            setTimeout(() => {
                listInput.style.borderColor = '#e9ecef';
            }, 2000);
        }
    };
    
    // Event listeners
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modalSubmit.addEventListener('click', handleSubmit);
    
    // Enter key handler
    listInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Add missing functions
function updateTaskStatistics() {
    // Simple task statistics update
    const totalTasks = document.querySelectorAll('.task-checkbox').length;
    const completedTasks = document.querySelectorAll('.task-checkbox:checked').length;
    console.log(`Tareas: ${completedTasks}/${totalTasks} completadas`);
}
