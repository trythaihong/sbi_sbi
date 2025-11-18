// =========================================
// Authentication System
// =========================================

// Test credentials
const TEST_CREDENTIALS = {
    email: 'demo@test.com',
    password: 'password123'
};
<script>
// JS Example (optional hover animation)
console.log("Feature Section Loaded");
</script>


// Check if user is logged in
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Update UI based on login status
function updateAuthUI() {
    const authButton = document.getElementById('authButton');
    const loginBtn = document.getElementById('loginBtn');
    
    if (isLoggedIn && currentUser) {
        loginBtn.textContent = `សួស្តី, ${currentUser.name || 'អ្នកប្រើប្រាស់'}`;
        loginBtn.onclick = (e) => {
            e.preventDefault();
            logout();
        };
    } else {
        loginBtn.textContent = 'ចូលប្រើប្រាស់';
        loginBtn.onclick = (e) => {
            e.preventDefault();
            showLoginModal();
        };
    }
}

// Show login modal
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    loginModal.classList.add('show');
}

// Hide login modal
function hideLoginModal() {
    const loginModal = document.getElementById('loginModal');
    loginModal.classList.remove('show');
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
        // Success login
        isLoggedIn = true;
        currentUser = {
            email: email,
            name: 'អ្នកប្រើប្រាស់',
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        hideLoginModal();
        updateAuthUI();
        
        // Show success message
        showNotification('ចូលប្រើប្រាស់ដោយជោគជ័យ! 🎉', 'success');
    } else {
        // Failed login
        showNotification('អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ! សូមព្យាយាមម្តងទៀត។', 'error');
    }
});

// Logout function
function logout() {
    if (confirm('តើអ្នកចង់ចាកចេញពីប្រព័ន្ធមែនទេ?')) {
        isLoggedIn = false;
        currentUser = null;
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        updateAuthUI();
        showNotification('អ្នកបានចាកចេញដោយជោគជ័យ!', 'info');
    }
}

// =========================================
// Order System
// =========================================

let selectedProduct = {
    name: '',
    price: 0
};

// Show order modal
function showOrderModal(productName, productPrice) {
    if (!isLoggedIn) {
        showNotification('សូមចូលប្រើប្រាស់ជាមុនសិន!', 'warning');
        showLoginModal();
        return;
    }
    
    selectedProduct = {
        name: productName,
        price: parseFloat(productPrice)
    };
    
    // Update order details
    document.getElementById('orderDetails').innerHTML = `
        <h3>${selectedProduct.name}</h3>
        <p>តម្លៃ: $${selectedProduct.price.toFixed(2)}</p>
    `;
    
    // Update display price
    document.getElementById('displayPrice').value = `$${selectedProduct.price.toFixed(2)}`;
    
    // Reset form
    document.getElementById('orderForm').reset();
    document.getElementById('orderQuantity').value = 1;
    document.getElementById('displayPrice').value = `$${selectedProduct.price.toFixed(2)}`;
    
    // Update summary
    updateOrderSummary();
    
    // Show modal
    const orderModal = document.getElementById('orderModal');
    orderModal.classList.add('show');
}

// Hide order modal
function hideOrderModal() {
    const orderModal = document.getElementById('orderModal');
    orderModal.classList.remove('show');
}

// Update order summary
function updateOrderSummary() {
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 1;
    const productTotal = selectedProduct.price * quantity;
    const shipping = 5.00;
    const total = productTotal + shipping;
    
    document.getElementById('summaryPrice').textContent = `$${productTotal.toFixed(2)}`;
    document.getElementById('summaryQty').textContent = quantity;
    document.getElementById('summaryShipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
    document.getElementById('displayPrice').value = `$${productTotal.toFixed(2)}`;
}

// Quantity change handler
document.getElementById('orderQuantity').addEventListener('change', updateOrderSummary);
document.getElementById('orderQuantity').addEventListener('input', updateOrderSummary);

// Payment method change handler
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const bankingDetails = document.getElementById('bankingDetails');
        if (e.target.value === 'cod') {
            bankingDetails.style.display = 'none';
        } else {
            bankingDetails.style.display = 'block';
        }
    });
});

// Order form submission
document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const orderData = {
        customer: {
            name: document.getElementById('orderName').value,
            phone: document.getElementById('orderPhone').value,
            address: document.getElementById('orderAddress').value,
            email: currentUser.email
        },
        product: selectedProduct.name,
        quantity: parseInt(document.getElementById('orderQuantity').value),
        price: selectedProduct.price,
        total: parseFloat(document.getElementById('summaryTotal').textContent.replace('$', '')),
        payment: document.querySelector('input[name="payment"]:checked').value,
        notes: document.getElementById('orderNotes').value,
        orderDate: new Date().toISOString()
    };
    
    // Save order (in real app, send to server)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    console.log('Order placed:', orderData);
    
    hideOrderModal();
    showNotification('ការបញ្ជាទិញបានជោគជ័យ! 🎉 យើងនឹងទាក់ទងអ្នកក្នុងពេលឆាប់ៗនេះ។', 'success');
    
    // Send WhatsApp message (optional)
    const message = `ការបញ្ជាទិញថ្មី:
ឈ្មោះ: ${orderData.customer.name}
ទូរស័ព្ទ: ${orderData.customer.phone}
ផលិតផល: ${orderData.product}
ចំនួន: ${orderData.quantity}
តម្លៃសរុប: $${orderData.total.toFixed(2)}
វិធីបង់ប្រាក់: ${orderData.payment}`;
    
    // Uncomment to enable WhatsApp
    // sendWhatsAppMessage('85512345678', message);
});

// =========================================
// CTA Button Handlers
// =========================================

// Handle all CTA order buttons
document.querySelectorAll('.cta-order').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = btn.getAttribute('data-product') || 'ផលិតផលទូទៅ';
        const productPrice = btn.getAttribute('data-price') || '50';
        showOrderModal(productName, productPrice);
    });
});

// =========================================
// Modal Close Handlers
// =========================================

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.remove('show');
    });
});

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// =========================================
// Mobile Menu Toggle
// =========================================

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// =========================================
// FAQ Accordion
// =========================================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// =========================================
// Smooth Scrolling
// =========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href.includes('#')) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =========================================
// Contact Form Submission
// =========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: contactForm.querySelector('input[type="text"]').value,
            phone: contactForm.querySelector('input[type="tel"]').value,
            email: contactForm.querySelector('input[type="email"]').value,
            message: contactForm.querySelector('textarea').value,
            date: new Date().toISOString()
        };
        
        console.log('Contact form submitted:', formData);
        
        // Show success message
        showNotification('សូមអរគុណ! សារបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ។ យើងនឹងទាក់ទងមកអ្នកក្នុងពេលឆាប់ៗ។', 'success');
        
        // Reset form
        contactForm.reset();
    });
}

// =========================================
// Scroll Animations
// =========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.product-card, .review-card, .blog-card, .benefit-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// =========================================
// Header Scroll Effect
// =========================================

let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    }
    
    lastScroll = currentScroll;
});

// =========================================
// Counter Animation for Stats
// =========================================

const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
};

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.stat-item h3');
            statItems.forEach((item, index) => {
                const values = [1000, 50, 10];
                animateCounter(item, values[index], 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// =========================================
// Notification System
// =========================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifs = document.querySelectorAll('.notification');
    existingNotifs.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notif">&times;</button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: '100000',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s',
        fontSize: '0.95rem',
        fontWeight: '500'
    });
    
    // Type-specific styling
    const colors = {
        success: { bg: '#dcfce7', color: '#166534', border: '#22c55e' },
        error: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' },
        warning: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
        info: { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' }
    };
    
    const colorSet = colors[type] || colors.info;
    notification.style.background = colorSet.bg;
    notification.style.color = colorSet.color;
    notification.style.borderLeft = `4px solid ${colorSet.border}`;
    
    // Close button styling
    const closeBtn = notification.querySelector('.close-notif');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: colorSet.color,
        padding: '0',
        marginLeft: '10px'
    });
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// =========================================
// WhatsApp Integration
// =========================================

function sendWhatsAppMessage(phone, message) {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// =========================================
// Back to Top Button
// =========================================

const createBackToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 55px;
        height: 55px;
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        } else {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
        button.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.5)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.4)';
    });
};

// =========================================
// Initialization
// =========================================

// Initialize on page load
window.addEventListener('load', () => {
    // Update auth UI
    updateAuthUI();
    
    // Create back to top button
    createBackToTopButton();
    
    // Page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('%c🌱 CAMBO NET Website Loaded!', 'color: #22c55e; font-size: 18px; font-weight: bold;');
    console.log('Version: 2.0.0');
    console.log('Language: ភាសាខ្មែរ (Khmer)');
    console.log('Features: Login System ✓, Order System ✓, Payment Gateway ✓');
});

// Handle registration link
document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('មុខងារចុះឈ្មោះនឹងមកដល់ឆាប់ៗនេះ!', 'info');
});