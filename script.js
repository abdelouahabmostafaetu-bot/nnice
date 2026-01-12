// Mobile detection and optimization
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Performance: Use requestIdleCallback for non-critical tasks
const scheduleTask = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

// Optimize performance for mobile
if (isMobile) {
    // Disable heavy animations
    document.body.classList.add('mobile-device');
    
    // Remove spotlight and floating shapes on mobile
    scheduleTask(() => {
        const spotlight = document.getElementById('spotlight');
        const floatingShapes = document.querySelector('.floating-shapes');
        if (spotlight) spotlight.style.display = 'none';
        if (floatingShapes) floatingShapes.style.display = 'none';
    });
}

// Throttled scroll handler for better performance
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            const scrollProgress = document.getElementById('scrollProgress');
            const scrollTop = document.getElementById('scrollTop');
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrolled = window.pageYOffset;
            const progress = (scrolled / (documentHeight - windowHeight)) * 100;
            scrollProgress.style.width = progress + '%';
            
            // Show scroll to top button
            if (scrolled > 300) {
                scrollTop.classList.add('visible');
            } else {
                scrollTop.classList.remove('visible');
            }
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

// Scroll to top
document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Spotlight effect with throttling for smooth movement
let spotlightTicking = false;
const spotlight = document.getElementById('spotlight');
document.addEventListener('mousemove', (e) => {
    if (!spotlightTicking && spotlight) {
        requestAnimationFrame(() => {
            spotlight.style.left = (e.clientX - 150) + 'px';
            spotlight.style.top = (e.clientY - 150) + 'px';
            spotlightTicking = false;
        });
        spotlightTicking = true;
    }
}, { passive: true });

// Create floating particles
function createParticles() {
    const floatingShapes = document.querySelector('.floating-shapes');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        floatingShapes.appendChild(particle);
    }
}
createParticles();

// Reveal on scroll animation
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(section => {
    section.classList.add('reveal-on-scroll');
    revealObserver.observe(section);
});

// Newsletter subscription
const newsletterBtn = document.querySelector('.newsletter-btn');
const newsletterInput = document.querySelector('.newsletter-input');

if (newsletterBtn) {
    newsletterBtn.addEventListener('click', () => {
        if (newsletterInput.value) {
            alert('Thank you for subscribing! 🎉');
            newsletterInput.value = '';
        } else {
            alert('Please enter your email address');
        }
    });
}

// Animate stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'none';
            setTimeout(() => {
                entry.target.style.animation = '';
            }, 10);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(stat => {
    observer.observe(stat);
});

// Smooth scroll for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add parallax effect to profile image
window.addEventListener('scroll', () => {
    const profileImage = document.querySelector('.profile-image');
    const scrolled = window.pageYOffset;
    if (profileImage) {
        profileImage.style.transform = `translateY(${scrolled * 0.1}px) scale(${1 + scrolled * 0.0001})`;
    }
});

// Typewriter effect for tagline
const taglineText = "Master's Degree Student";
const taglineElement = document.getElementById('tagline');
let charIndex = 0;

function typeWriter() {
    if (charIndex < taglineText.length) {
        taglineElement.textContent += taglineText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100);
    }
}

setTimeout(() => {
    typeWriter();
}, 500);

// 3D Tilt effect on cards
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// Click ripple effect
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// Toast notification system
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Floating navigation
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.nav-dot');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = index;
        }
    });
    
    navDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === current) {
            dot.classList.add('active');
        }
    });
});

navDots.forEach((dot) => {
    dot.addEventListener('click', () => {
        // Check if this is a link to another page
        const link = dot.getAttribute('data-link');
        if (link) {
            window.location.href = link;
            return;
        }
        
        const sectionIndex = parseInt(dot.getAttribute('data-section'));
        if (!isNaN(sectionIndex) && sections[sectionIndex]) {
            sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Easter egg - click profile 5 times
let clickCount = 0;
document.getElementById('profileImage').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        showToast('🎉 You found the secret! You\'re awesome!');
        document.getElementById('profileImage').classList.add('shake');
        setTimeout(() => {
            document.getElementById('profileImage').classList.remove('shake');
        }, 500);
        clickCount = 0;
    }
});

// Animate achievement cards on hover
document.querySelectorAll('.achievement-card, .project-card, .info-card').forEach(card => {
    card.classList.add('tilt-card');
});

// Double click anywhere for surprise
let lastClickTime = 0;
document.addEventListener('click', (e) => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;
    
    if (timeDiff < 300 && timeDiff > 0) {
        showToast('✨ Double click detected! Keep exploring!');
    }
    
    lastClickTime = currentTime;
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        window.scrollBy({ top: -100, behavior: 'smooth' });
    } else if (e.key === 'ArrowDown') {
        window.scrollBy({ top: 100, behavior: 'smooth' });
    } else if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (e.key === 'End') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// ==========================================
// FEATURED CONTENT LOADER
// ==========================================

let featuredArticleData = null;

// Load featured article on page load
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedArticle();
});

async function loadFeaturedArticle() {
    const container = document.getElementById('featuredArticleContainer');
    const noMessage = document.getElementById('noFeaturedMessage');
    
    if (!container) return;
    
    let articles = [];
    
    try {
        // Load articles from JSON file (visible to all visitors)
        const response = await fetch('articles.json?' + Date.now());
        const data = await response.json();
        articles = data.articles || [];
    } catch (error) {
        console.error('Error loading articles:', error);
        // Fallback to localStorage
        articles = JSON.parse(localStorage.getItem('userArticles') || '[]');
    }
    
    if (articles.length === 0) {
        container.style.display = 'none';
        if (noMessage) noMessage.style.display = 'block';
        return;
    }
    
    // Get the most recent article as featured
    featuredArticleData = articles[0];
    
    // Update UI - compact version (just title and meta)
    document.getElementById('featuredArticleTitle').textContent = featuredArticleData.title;
    document.getElementById('featuredArticleCategory').textContent = featuredArticleData.category;
    document.getElementById('featuredArticleDate').textContent = featuredArticleData.date;
    
    container.style.display = 'block';
    if (noMessage) noMessage.style.display = 'none';
}

function viewFeaturedArticle() {
    if (featuredArticleData) {
        // Store article data and redirect to read-article page
        sessionStorage.setItem('viewArticle', JSON.stringify(featuredArticleData));
        window.location.href = 'read-article.html';
    }
}
