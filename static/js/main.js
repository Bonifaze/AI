/**
 * AI Companion Platform - Main JavaScript
 * Handles theme switching, global interactions, and utility functions
 */

(function() {
    'use strict';

    // DOM ready function
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    // Theme management
    class ThemeManager {
        constructor() {
            this.theme = localStorage.getItem('theme') || 'light';
            this.init();
        }

        init() {
            this.setTheme(this.theme);
            this.bindEvents();
        }

        setTheme(theme) {
            this.theme = theme;
            document.documentElement.setAttribute('data-bs-theme', theme);
            localStorage.setItem('theme', theme);
            this.updateThemeIcon();
        }

        toggleTheme() {
            const newTheme = this.theme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        }

        updateThemeIcon() {
            const icon = document.getElementById('theme-icon');
            if (icon) {
                icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }

        bindEvents() {
            const toggleBtn = document.getElementById('theme-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggleTheme());
            }
        }
    }

    // Alert manager
    class AlertManager {
        static show(message, type = 'info', duration = 5000) {
            const alertContainer = document.querySelector('.container');
            if (!alertContainer) return;

            const alertId = 'alert-' + Date.now();
            const alertHTML = `
                <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;

            alertContainer.insertAdjacentHTML('afterbegin', alertHTML);

            // Auto dismiss
            if (duration > 0) {
                setTimeout(() => {
                    const alert = document.getElementById(alertId);
                    if (alert) {
                        const bsAlert = new bootstrap.Alert(alert);
                        bsAlert.close();
                    }
                }, duration);
            }
        }

        static success(message, duration = 5000) {
            this.show(message, 'success', duration);
        }

        static error(message, duration = 7000) {
            this.show(message, 'danger', duration);
        }

        static warning(message, duration = 6000) {
            this.show(message, 'warning', duration);
        }

        static info(message, duration = 5000) {
            this.show(message, 'info', duration);
        }
    }

    // Form enhancement
    class FormEnhancer {
        constructor() {
            this.init();
        }

        init() {
            this.enhanceForms();
            this.addLoadingStates();
            this.autoResizeTextareas();
        }

        enhanceForms() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                // Add novalidate to use custom validation
                form.setAttribute('novalidate', '');
                
                // Validate on submit
                form.addEventListener('submit', (e) => {
                    if (!form.checkValidity()) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    form.classList.add('was-validated');
                });

                // Real-time validation
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => {
                        if (input.value.trim() !== '') {
                            input.classList.toggle('is-valid', input.checkValidity());
                            input.classList.toggle('is-invalid', !input.checkValidity());
                        }
                    });
                });
            });
        }

        addLoadingStates() {
            const submitButtons = document.querySelectorAll('button[type="submit"]');
            submitButtons.forEach(button => {
                const form = button.closest('form');
                if (form) {
                    form.addEventListener('submit', () => {
                        button.disabled = true;
                        const originalText = button.innerHTML;
                        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
                        
                        // Re-enable after 10 seconds as fallback
                        setTimeout(() => {
                            button.disabled = false;
                            button.innerHTML = originalText;
                        }, 10000);
                    });
                }
            });
        }

        autoResizeTextareas() {
            const textareas = document.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                textarea.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = (this.scrollHeight) + 'px';
                });
            });
        }
    }

    // Notification system
    class NotificationManager {
        constructor() {
            this.createContainer();
        }

        createContainer() {
            if (document.getElementById('notification-container')) return;

            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'position-fixed top-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }

        show(message, type = 'info', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `toast align-items-center text-white bg-${type} border-0`;
            notification.setAttribute('role', 'alert');
            
            notification.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            `;

            const container = document.getElementById('notification-container');
            container.appendChild(notification);

            const toast = new bootstrap.Toast(notification, { delay: duration });
            toast.show();

            // Remove element after it's hidden
            notification.addEventListener('hidden.bs.toast', () => {
                notification.remove();
            });
        }
    }

    // Utility functions
    const Utils = {
        // Debounce function
        debounce(func, wait, immediate) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        },

        // Throttle function
        throttle(func, limit) {
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

        // Format date
        formatDate(date, options = {}) {
            const defaultOptions = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
        },

        // Copy to clipboard
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    return true;
                } catch (fallbackErr) {
                    console.error('Could not copy text: ', fallbackErr);
                    return false;
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        },

        // Show loading spinner
        showLoading(element) {
            const originalContent = element.innerHTML;
            element.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            element.disabled = true;
            return originalContent;
        },

        // Hide loading spinner
        hideLoading(element, originalContent) {
            element.innerHTML = originalContent;
            element.disabled = false;
        }
    };

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Initialize tooltips and popovers
    function initBootstrapComponents() {
        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

        // Initialize popovers
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    }

    // Auto-dismiss alerts
    function initAutoDismissAlerts() {
        const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
        alerts.forEach(alert => {
            if (!alert.querySelector('.btn-close')) return;
            
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alert);
                if (bsAlert) {
                    bsAlert.close();
                }
            }, 5000);
        });
    }

    // Handle keyboard shortcuts
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search (if implemented)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                // Implement search functionality
            }

            // Escape key to close modals/dropdowns
            if (e.key === 'Escape') {
                // Close any open dropdowns
                document.querySelectorAll('.dropdown-menu.show').forEach(dropdown => {
                    const bsDropdown = bootstrap.Dropdown.getInstance(dropdown.previousElementSibling);
                    if (bsDropdown) bsDropdown.hide();
                });
            }
        });
    }

    // Monitor connection status
    function initConnectionMonitor() {
        function updateConnectionStatus() {
            const isOnline = navigator.onLine;
            const indicator = document.getElementById('connection-status');
            
            if (!isOnline) {
                if (!indicator) {
                    const statusBar = document.createElement('div');
                    statusBar.id = 'connection-status';
                    statusBar.className = 'alert alert-warning text-center mb-0';
                    statusBar.innerHTML = '<i class="fas fa-wifi me-2"></i>You are currently offline';
                    document.body.insertBefore(statusBar, document.body.firstChild);
                }
            } else if (indicator) {
                indicator.remove();
            }
        }

        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        updateConnectionStatus(); // Check initial status
    }

    // Performance monitoring
    function initPerformanceMonitoring() {
        // Monitor page load time
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page load time: ${pageLoadTime}ms`);
            }
        });
    }

    // Initialize everything when DOM is ready
    ready(() => {
        // Initialize core components
        const themeManager = new ThemeManager();
        const formEnhancer = new FormEnhancer();
        const notificationManager = new NotificationManager();

        // Initialize other features
        initSmoothScroll();
        initBootstrapComponents();
        initAutoDismissAlerts();
        initKeyboardShortcuts();
        initConnectionMonitor();
        initPerformanceMonitoring();

        // Make utilities globally available
        window.AICompanion = {
            AlertManager,
            NotificationManager: notificationManager,
            Utils,
            ThemeManager: themeManager
        };

        console.log('AI Companion Platform initialized successfully');
    });

})();
