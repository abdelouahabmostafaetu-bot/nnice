// Read Article Page JavaScript - Optimized for Speed
let currentFontSize = 1.15;
let currentArticle = null;
let allArticles = [];

// Initialize immediately when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Use requestAnimationFrame for smooth initialization
    requestAnimationFrame(() => {
        loadArticle();
        setupEventListeners();
    });
});

// Setup event listeners with passive option for better scroll performance
function setupEventListeners() {
    // Reading progress - use passive for better scroll performance
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    
    // Font size controls
    document.getElementById('decreaseFont').addEventListener('click', () => {
        if (currentFontSize > 0.9) {
            currentFontSize -= 0.1;
            updateFontSize();
        }
    });

    document.getElementById('increaseFont').addEventListener('click', () => {
        if (currentFontSize < 1.5) {
            currentFontSize += 0.1;
            updateFontSize();
        }
    });
}

// Load article from sessionStorage or URL - optimized
function loadArticle() {
    const container = document.getElementById('articleContainer');
    
    // Get all articles from localStorage (cached for performance)
    allArticles = JSON.parse(localStorage.getItem('userArticles') || '[]');
    
    // Try to get article from sessionStorage first (from "Read Article" click)
    const storedArticle = sessionStorage.getItem('viewArticle');
    
    if (storedArticle) {
        currentArticle = JSON.parse(storedArticle);
        sessionStorage.removeItem('viewArticle'); // Clear after reading
        displayArticle(container, currentArticle);
    } else {
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        
        if (articleId && allArticles.length > 0) {
            currentArticle = allArticles.find(a => a.id === articleId || a.title === articleId);
            if (currentArticle) {
                displayArticle(container, currentArticle);
            } else {
                displayNotFound(container);
            }
        } else if (allArticles.length > 0) {
            // Show the first article
            currentArticle = allArticles[0];
            displayArticle(container, currentArticle);
        } else {
            displayNotFound(container);
        }
    }
}

// Display the article
function displayArticle(container, article) {
    // Update page title
    document.title = `${article.title} - Abdelouahab Mostafa`;
    
    // Calculate read time
    const wordCount = article.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    
    // Format content - convert line breaks to paragraphs while preserving LaTeX
    let formattedContent = formatContentWithMath(article.content);
    
    container.innerHTML = `
        <div class="article-header">
            <span class="article-category">${article.category || 'Article'}</span>
            <h1 class="article-title">${article.title}</h1>
            <div class="article-meta">
                <div class="meta-item">
                    <span class="meta-icon">✍️</span>
                    <span>Abdelouahab Mostafa</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span>${article.date || 'January 2026'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">⏱️</span>
                    <span>${readTime} min read</span>
                </div>
            </div>
        </div>
        
        <div class="article-body" id="articleBody">
            ${formattedContent}
        </div>
        
        <div class="article-actions">
            <button class="action-btn" onclick="window.print()">
                <span>🖨️</span>
                <span>Print</span>
            </button>
            <button class="action-btn" onclick="shareArticle()">
                <span>📤</span>
                <span>Share</span>
            </button>
            <a href="topics.html" class="action-btn">
                <span>📚</span>
                <span>All Articles</span>
            </a>
            <a href="index.html" class="action-btn">
                <span>🏠</span>
                <span>Home</span>
            </a>
        </div>
        
        ${generateRelatedArticles(article)}
    `;
    
    // Render MathJax for LaTeX formulas
    renderMathJax();
}

// Generate related articles section
function generateRelatedArticles(currentArticle) {
    // Get related articles (same category or different ones)
    let relatedArticles = allArticles.filter(a => 
        a.title !== currentArticle.title && 
        a.category === currentArticle.category
    );
    
    // If not enough same category, add other articles
    if (relatedArticles.length < 3) {
        const otherArticles = allArticles.filter(a => 
            a.title !== currentArticle.title && 
            a.category !== currentArticle.category
        );
        relatedArticles = [...relatedArticles, ...otherArticles].slice(0, 3);
    } else {
        relatedArticles = relatedArticles.slice(0, 3);
    }
    
    if (relatedArticles.length === 0) {
        return `
            <div class="related-section">
                <div class="related-header">
                    <h2 class="related-title">📖 Continue Reading</h2>
                    <p class="related-subtitle">Explore more articles and insights</p>
                </div>
                <div class="no-related">
                    <div class="no-related-icon">📚</div>
                    <p>More articles coming soon!</p>
                    <a href="topics.html" class="action-btn" style="display: inline-flex; margin-top: 20px;">
                        <span>📝</span>
                        <span>Browse All Topics</span>
                    </a>
                </div>
            </div>
        `;
    }
    
    const cardsHTML = relatedArticles.map(article => {
        const excerpt = article.content
            .replace(/<[^>]*>/g, '')
            .substring(0, 120) + '...';
        
        return `
            <div class="related-card" onclick="viewRelatedArticle('${encodeURIComponent(JSON.stringify(article))}')">
                <span class="related-card-category">${article.category || 'Article'}</span>
                <h3 class="related-card-title">${article.title}</h3>
                <p class="related-card-excerpt">${excerpt}</p>
                <span class="related-card-date">${article.date || 'January 2026'}</span>
                <span class="related-card-arrow">→</span>
            </div>
        `;
    }).join('');
    
    return `
        <div class="related-section">
            <div class="related-header">
                <h2 class="related-title">📖 Continue Reading</h2>
                <p class="related-subtitle">More articles you might enjoy</p>
            </div>
            <div class="related-grid">
                ${cardsHTML}
            </div>
        </div>
    `;
}

// View related article
function viewRelatedArticle(articleData) {
    const article = JSON.parse(decodeURIComponent(articleData));
    sessionStorage.setItem('viewArticle', JSON.stringify(article));
    window.scrollTo(0, 0);
    loadArticle();
}

// Display not found message
function displayNotFound(container) {
    container.innerHTML = `
        <div class="not-found">
            <div class="not-found-icon">📄</div>
            <h1 class="not-found-title">Article Not Found</h1>
            <p class="not-found-text">The article you're looking for doesn't exist or has been removed.</p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="topics.html" class="action-btn">
                    <span>📚</span>
                    <span>Browse Articles</span>
                </a>
                <a href="index.html" class="action-btn">
                    <span>🏠</span>
                    <span>Go Home</span>
                </a>
            </div>
        </div>
    `;
}

// Share article
function shareArticle() {
    const url = window.location.href;
    const title = currentArticle ? currentArticle.title : 'Article';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `Check out this article: ${title}`,
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #8b7355;
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        font-size: 1rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Update reading progress - throttled for performance
let ticking = false;
function updateReadingProgress() {
    if (!ticking) {
        requestAnimationFrame(() => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = Math.min((scrolled / documentHeight) * 100, 100);
            
            const progressBar = document.getElementById('readingProgress');
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            ticking = false;
        });
        ticking = true;
    }
}

// Update font size with smooth transition
function updateFontSize() {
    const content = document.getElementById('articleBody');
    if (content) {
        content.style.transition = 'font-size 0.2s ease';
        content.style.fontSize = currentFontSize + 'rem';
    }
}

// Format content preserving LaTeX math expressions
function formatContentWithMath(content) {
    // If already has HTML tags, return as is
    if (content.includes('<p>') || content.includes('<h')) {
        return content;
    }
    
    // Protect LaTeX expressions before processing
    const mathPlaceholders = [];
    let protectedContent = content;
    
    // Protect display math $$...$$ and \[...\]
    protectedContent = protectedContent.replace(/\$\$[\s\S]*?\$\$/g, (match) => {
        mathPlaceholders.push(match);
        return `%%MATH_${mathPlaceholders.length - 1}%%`;
    });
    protectedContent = protectedContent.replace(/\\\[[\s\S]*?\\\]/g, (match) => {
        mathPlaceholders.push(match);
        return `%%MATH_${mathPlaceholders.length - 1}%%`;
    });
    
    // Protect inline math $...$ and \(...\)
    protectedContent = protectedContent.replace(/\$[^$\n]+\$/g, (match) => {
        mathPlaceholders.push(match);
        return `%%MATH_${mathPlaceholders.length - 1}%%`;
    });
    protectedContent = protectedContent.replace(/\\\(.*?\\\)/g, (match) => {
        mathPlaceholders.push(match);
        return `%%MATH_${mathPlaceholders.length - 1}%%`;
    });
    
    // Convert double newlines to paragraphs
    let formattedContent = protectedContent
        .split('\n\n')
        .filter(p => p.trim())
        .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
        .join('');
    
    // Restore math expressions
    mathPlaceholders.forEach((math, index) => {
        formattedContent = formattedContent.replace(`%%MATH_${index}%%`, math);
    });
    
    return formattedContent;
}

// Re-render MathJax after content is loaded
function renderMathJax() {
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise().catch(function(err) {
            console.log('MathJax rendering error:', err);
        });
    }
}
