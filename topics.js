// Topics Page JavaScript - Display Articles Only

// Global variable to store articles
let allArticles = [];

document.addEventListener('DOMContentLoaded', function() {
    loadArticles();
    checkForFeaturedArticle();
});

// Check if coming from featured article link - redirect to read-article page
function checkForFeaturedArticle() {
    const storedArticle = sessionStorage.getItem('viewArticle');
    if (storedArticle) {
        // Redirect to full article page
        window.location.href = 'read-article.html';
    }
}

async function loadArticles() {
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    // Show loading state
    container.innerHTML = `
        <div class="loading-articles">
            <p>Loading articles...</p>
        </div>
    `;
    
    try {
        // Load articles from JSON file (for all visitors)
        const response = await fetch('articles.json?' + Date.now());
        const data = await response.json();
        allArticles = data.articles || [];
        
        // Also check localStorage for admin's unpublished articles (only visible to admin)
        const localArticles = JSON.parse(localStorage.getItem('pendingArticles') || '[]');
        
        // Combine: JSON file articles are public, localStorage are pending
        const combinedArticles = [...allArticles];
        
        displayArticles(combinedArticles);
    } catch (error) {
        console.error('Error loading articles:', error);
        // Fallback to localStorage only
        const localArticles = JSON.parse(localStorage.getItem('userArticles') || '[]');
        allArticles = localArticles;
        displayArticles(localArticles);
    }
}

function displayArticles(articles) {
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    if (articles.length === 0) {
        container.innerHTML = `
            <div class="no-articles">
                <p>No articles published yet.</p>
                <p style="font-size: 0.9rem; color: #999;">Check back soon for new content!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = articles.map(article => `
        <article class="article-card" data-category="${article.category}">
            <div class="article-meta">
                <span class="article-category">${capitalizeFirst(article.category)}</span>
                <span class="article-date">${article.date}</span>
            </div>
            <h2 class="article-title">${escapeHtml(article.title)}</h2>
            <p class="article-excerpt">${escapeHtml(article.excerpt)}</p>
            <div class="article-footer">
                <span class="read-time">📖 ${article.readTime} min read</span>
                <button class="read-more-btn" onclick="viewArticle(${article.id})">Read Article →</button>
            </div>
        </article>
    `).join('');
}

function viewArticle(id) {
    // Search in all articles (both from JSON and localStorage)
    const article = allArticles.find(a => a.id === id);
    
    if (article) {
        // Store article and redirect to full reading page
        sessionStorage.setItem('viewArticle', JSON.stringify(article));
        window.location.href = 'read-article.html';
    }
}

function showArticleModal(article) {
    const modal = document.createElement('div');
    modal.className = 'article-modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <div class="modal-header">
                <span class="article-category">${capitalizeFirst(article.category)}</span>
                <span class="article-date">${article.date}</span>
            </div>
            <h1 class="modal-title">${escapeHtml(article.title)}</h1>
            <div class="modal-body mathjax-content">
                ${formatMathContent(article.content)}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Render MathJax in the modal
    if (window.MathJax && window.MathJax.typesetPromise) {
        MathJax.typesetPromise([modal]).catch(function(err) {
            console.log('MathJax error:', err);
        });
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Format content preserving math delimiters
function formatMathContent(content) {
    // Preserve math delimiters while converting newlines to <br>
    // Don't escape $ signs as they are math delimiters
    return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
}

function closeModal() {
    const modal = document.querySelector('.article-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
