// Menu Toggle para móviles
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animación del botón hamburguesa
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(45deg) translate(5px, 5px)' 
        : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(-45deg) translate(7px, -6px)' 
        : 'none';
});

// Cerrar menú al hacer click en un link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Animación de números en estadísticas
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                setTimeout(updateNumber, stepTime);
            } else {
                stat.textContent = target;
            }
        };
        
        updateNumber();
    });
}

// Intersection Observer para animaciones al hacer scroll
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animar tarjetas
            if (entry.target.classList.contains('stat-card')) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
            if (entry.target.classList.contains('resource-card')) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
            
            // Animar números de estadísticas solo una vez
            if (entry.target.classList.contains('stats')) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Observar elementos para animación
document.querySelectorAll('.stat-card').forEach(card => {
    observer.observe(card);
});

document.querySelectorAll('.resource-card').forEach(card => {
    observer.observe(card);
});

observer.observe(document.querySelector('.stats'));

// Scroll suave para navegación
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

// Efecto de header al hacer scroll
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    }
    
    lastScroll = currentScroll;
});

// Carrusel de testimonios
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-slide');
const totalTestimonials = testimonials.length;
const prevButton = document.getElementById('prevTestimonial');
const nextButton = document.getElementById('nextTestimonial');
const indicatorsContainer = document.getElementById('carouselIndicators');

// Crear indicadores
for (let i = 0; i < totalTestimonials; i++) {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToTestimonial(i));
    indicatorsContainer.appendChild(indicator);
}

const indicators = document.querySelectorAll('.indicator');

function showTestimonial(index) {
    testimonials.forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i === index) {
            slide.classList.add('active');
        } else if (i < index) {
            slide.classList.add('prev');
        }
    });
    
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    showTestimonial(currentTestimonial);
}

function goToTestimonial(index) {
    currentTestimonial = index;
    showTestimonial(currentTestimonial);
}

nextButton.addEventListener('click', nextTestimonial);
prevButton.addEventListener('click', prevTestimonial);

// Auto-avance del carrusel cada 5 segundos
let autoplayInterval = setInterval(nextTestimonial, 5000);

// Pausar auto-avance al pasar el mouse sobre el carrusel
const carousel = document.querySelector('.testimonial-carousel');
carousel.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
});

carousel.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(nextTestimonial, 5000);
});

// Soporte para teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevTestimonial();
    } else if (e.key === 'ArrowRight') {
        nextTestimonial();
    }
});

// Efecto parallax suave en hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroOverlay = document.querySelector('.hero-overlay');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 500);
        heroOverlay.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Añadir clase de entrada a elementos cuando son visibles
const fadeElements = document.querySelectorAll('.about-text, .about-image, .testimonial-carousel');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

fadeElements.forEach(element => {
    if (element) {
        fadeObserver.observe(element);
    }
});

// Console message
console.log('%c🌟 Voces en Equilibrio', 'color: #8b5cf6; font-size: 24px; font-weight: bold;');
console.log('%cLorem ipsum dolor sit amet, consectetur adipiscing elit.', 'color: #6b7280; font-size: 14px;');
