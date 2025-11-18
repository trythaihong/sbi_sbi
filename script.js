// Mobile Menu Toggle
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

// FAQ Accordion
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

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
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

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Show success message
        alert('សូមអរគុណ! សារបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ។ យើងនឹងទាក់ទងមកអ្នកក្នុងពេលឆាប់ៗ។');
        
        // Reset form
        contactForm.reset();
        
        // In a real application, you would send this data to a server
        console.log('Form submitted:', { name, phone, email, message });
    });
}

// Scroll Animation for Elements
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

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// Counter Animation for Stats
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

// Product Card Click Tracking
document.querySelectorAll('.product-card .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productTitle = e.target.closest('.product-card').querySelector('.product-title').textContent;
        console.log('Product ordered:', productTitle);
        
        // Show confirmation message
        alert(`អ្នកបានជ្រើសរើស: ${productTitle}\n\nយើងនឹងទាក់ទងអ្នកឆាប់ៗនេះ។`);
    });
});

// Blog Card Hover Effect Enhancement
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Review Cards Animation
document.querySelectorAll('.review-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Add to Cart Functionality (Basic)
let cart = [];

function addToCart(productName, price) {
    cart.push({ product: productName, price: price });
    console.log('Cart:', cart);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCount = cart.length;
    console.log(`Items in cart: ${cartCount}`);
}

// Price Formatter
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

// WhatsApp Integration (if needed)
function sendWhatsAppMessage(phone, message) {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Add click handlers for "Order Now" buttons with WhatsApp
document.querySelectorAll('.product-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = e.target.closest('.product-card');
        const productName = card.querySelector('.product-title').textContent;
        const productPrice = card.querySelector('.product-price').textContent;
        
        const message = `សួស្តី! ខ្ញុំចង់បញ្ជាទិញ:\n${productName}\nតម្លៃ: ${productPrice}\n\nសូមផ្តល់ព័ត៌មានបន្ថែម។`;
        
        // Replace with actual phone number
        const phoneNumber = '85512345678';
        
        // Option 1: WhatsApp
        // sendWhatsAppMessage(phoneNumber, message);
        
        // Option 2: Show confirmation
        const confirmed = confirm(`បញ្ជាទិញ: ${productName}\n\nតើអ្នកចង់បន្តទេ?`);
        if (confirmed) {
            // Scroll to contact form
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Loading Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// Back to Top Button (Optional)
const createBackToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #22c55e;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
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
};

// Initialize back to top button
createBackToTopButton();

// Print Debug Info
console.log('%c🌱 CAMBO NET Website Loaded Successfully!', 'color: #22c55e; font-size: 16px; font-weight: bold;');
console.log('Version: 1.0.0');
console.log('Language: Khmer (ភាសាខ្មែរ)');