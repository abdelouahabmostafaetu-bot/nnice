// Topics Page JavaScript - Display Articles Only

document.addEventListener('DOMContentLoaded', function() {
    loadArticles();
    checkForFeaturedArticle();
});

// Check if coming from featured article link
function checkForFeaturedArticle() {
    const storedArticle = sessionStorage.getItem('viewArticle');
    if (storedArticle) {
        const article = JSON.parse(storedArticle);
        sessionStorage.removeItem('viewArticle');
        showArticleModal(article);
    }
}

function loadArticles() {
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    const articles = JSON.parse(localStorage.getItem('userArticles') || '[]');
    
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
                <button class="read-more-btn" onclick="viewArticle(${article.id})">Read More →</button>
            </div>
        </article>
    `).join('');
}

function viewArticle(id) {
    const articles = JSON.parse(localStorage.getItem('userArticles') || '[]');
    const article = articles.find(a => a.id === id);
    
    if (article) {
        showArticleModal(article);
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
