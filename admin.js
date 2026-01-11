// Admin Panel JavaScript

// Admin credentials
const ADMIN_USER = 'Mostafa';
const ADMIN_PASS = 'moustapha2003';

document.addEventListener('DOMContentLoaded', function() {
    initLoginSystem();
    initAdminTabs();
    initArticleForm();
    initQuoteForm();
    initBookForm();
    checkLoginStatus();
});

// ==========================================
// LOGIN SYSTEM
// ==========================================

function initLoginSystem() {
    const loginBtn = document.getElementById('adminLoginBtn');
    const loginForm = document.getElementById('loginForm');
    const loginModal = document.getElementById('loginModal');

    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            if (isLoggedIn()) {
                logout();
            } else {
                openLoginModal();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('loginError').textContent = '';
    }
}

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        closeLoginModal();
        updateUIForLogin(true);
        showNotification('Welcome, Admin!');
    } else {
        errorEl.textContent = 'Invalid username or password';
        errorEl.style.display = 'block';
    }
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    updateUIForLogin(false);
    showNotification('Logged out successfully');
}

function isLoggedIn() {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
}

function checkLoginStatus() {
    updateUIForLogin(isLoggedIn());
}

function updateUIForLogin(loggedIn) {
    const loginBtn = document.getElementById('adminLoginBtn');
    const adminPanel = document.getElementById('adminPanel');
    const loginRequired = document.getElementById('loginRequired');

    if (loginBtn) {
        if (loggedIn) {
            loginBtn.textContent = '🔓 Logout';
            loginBtn.classList.add('logged-in');
        } else {
            loginBtn.textContent = '🔐 Login';
            loginBtn.classList.remove('logged-in');
        }
    }

    if (adminPanel) {
        adminPanel.style.display = loggedIn ? 'block' : 'none';
    }
    
    if (loginRequired) {
        loginRequired.style.display = loggedIn ? 'none' : 'block';
    }

    // Load data when logged in
    if (loggedIn) {
        loadArticles();
        loadQuotes();
        loadBooks();
    }
}

// ==========================================
// ADMIN TABS
// ==========================================

function initAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById('tab-' + tabId).classList.add('active');
        });
    });
}

// ==========================================
// ARTICLES MANAGEMENT
// ==========================================

function initArticleForm() {
    const form = document.getElementById('articleForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (isLoggedIn()) {
                publishArticle();
            }
        });
    }
}

function loadArticles() {
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    const articles = JSON.parse(localStorage.getItem('userArticles') || '[]');
    container.innerHTML = '';
    
    if (articles.length === 0) {
        container.innerHTML = '<p style="color: #999; font-style: italic;">No articles published yet.</p>';
        return;
    }
    
    articles.forEach((article, index) => {
        const articleEl = document.createElement('div');
        articleEl.className = 'admin-item';
        articleEl.innerHTML = `
            <div class="admin-item-info">
                <h4>${escapeHtml(article.title)}</h4>
                <p>${capitalizeFirst(article.category)} • ${article.date}</p>
            </div>
            <button class="delete-btn" onclick="deleteArticle(${index})">🗑️</button>
        `;
        container.appendChild(articleEl);
    });
}

function publishArticle() {
    const title = document.getElementById('articleTitle').value.trim();
    const category = document.getElementById('articleCategory').value;
    const content = document.getElementById('articleContent').value.trim();

    if (!title || !category || !content) {
        showNotification('Please fill in all fields');
        return;
    }

    const article = {
        id: Date.now(),
        title,
        category,
        content,
        excerpt: content.substring(0, 150) + '...',
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        readTime: Math.ceil(content.split(' ').length / 200)
    };

    let articles = JSON.parse(localStorage.getItem('userArticles') || '[]');
    articles.unshift(article);
    localStorage.setItem('userArticles', JSON.stringify(articles));

    clearArticleForm();
    loadArticles();
    showNotification('Article published successfully!');
}

function deleteArticle(index) {
    if (confirm('Delete this article?')) {
        let articles = JSON.parse(localStorage.getItem('userArticles') || '[]');
        articles.splice(index, 1);
        localStorage.setItem('userArticles', JSON.stringify(articles));
        loadArticles();
        showNotification('Article deleted');
    }
}

function clearArticleForm() {
    document.getElementById('articleTitle').value = '';
    document.getElementById('articleCategory').value = '';
    document.getElementById('articleContent').value = '';
}

// ==========================================
// QUOTES MANAGEMENT
// ==========================================

function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (isLoggedIn()) {
                addQuote();
            }
        });
    }
}

function loadQuotes() {
    const container = document.getElementById('quotesContainer');
    if (!container) return;
    
    const quotes = JSON.parse(localStorage.getItem('customQuotes') || '[]');
    container.innerHTML = '';
    
    if (quotes.length === 0) {
        container.innerHTML = '<p style="color: #999; font-style: italic;">No custom quotes added yet.</p>';
        return;
    }
    
    quotes.forEach((quote, index) => {
        const quoteEl = document.createElement('div');
        quoteEl.className = 'quote-item';
        quoteEl.innerHTML = `
            <p class="quote-text-item">"${escapeHtml(quote.text)}"</p>
            <p class="quote-author-item">— ${escapeHtml(quote.author)}</p>
            <button class="delete-btn quote-delete" onclick="deleteQuote(${index})">🗑️</button>
        `;
        container.appendChild(quoteEl);
    });
}

function addQuote() {
    const text = document.getElementById('quoteText').value.trim();
    const author = document.getElementById('quoteAuthor').value.trim();
    
    if (!text || !author) {
        showNotification('Please fill in all fields');
        return;
    }
    
    const quote = { text, author, id: Date.now() };
    
    let quotes = JSON.parse(localStorage.getItem('customQuotes') || '[]');
    quotes.unshift(quote);
    localStorage.setItem('customQuotes', JSON.stringify(quotes));
    
    clearQuoteForm();
    loadQuotes();
    showNotification('Quote added successfully!');
}

function deleteQuote(index) {
    if (confirm('Delete this quote?')) {
        let quotes = JSON.parse(localStorage.getItem('customQuotes') || '[]');
        quotes.splice(index, 1);
        localStorage.setItem('customQuotes', JSON.stringify(quotes));
        loadQuotes();
        showNotification('Quote deleted');
    }
}

function clearQuoteForm() {
    document.getElementById('quoteText').value = '';
    document.getElementById('quoteAuthor').value = '';
}

// ==========================================
// BOOKS MANAGEMENT
// ==========================================

function initBookForm() {
    const form = document.getElementById('bookForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (isLoggedIn()) {
                addBook();
            }
        });
    }
}

function loadBooks() {
    const container = document.getElementById('booksContainer');
    if (!container) return;
    
    const books = JSON.parse(localStorage.getItem('customBooks') || '[]');
    container.innerHTML = '';
    
    if (books.length === 0) {
        container.innerHTML = '<p style="color: #999; font-style: italic;">No custom books added yet.</p>';
        return;
    }
    
    books.forEach((book, index) => {
        const bookEl = document.createElement('div');
        bookEl.className = 'book-item';
        bookEl.innerHTML = `
            <div class="book-item-info">
                <h4>${escapeHtml(book.title)}</h4>
                <p>by ${escapeHtml(book.author)} • ${book.category} • ${book.year}</p>
            </div>
            <button class="delete-btn" onclick="deleteBook(${index})">🗑️</button>
        `;
        container.appendChild(bookEl);
    });
}

function addBook() {
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const category = document.getElementById('bookCategory').value;
    const year = document.getElementById('bookYear').value.trim();
    const description = document.getElementById('bookDescription').value.trim();
    const cover = document.getElementById('bookCover').value.trim();
    const download = document.getElementById('bookDownload').value.trim();
    
    if (!title || !author || !category || !year || !description || !download) {
        showNotification('Please fill in all required fields');
        return;
    }
    
    const book = {
        id: Date.now(),
        title,
        author,
        category,
        year,
        description,
        cover: cover || 'cover/default-book.jpg',
        driveLink: download
    };
    
    let books = JSON.parse(localStorage.getItem('customBooks') || '[]');
    books.unshift(book);
    localStorage.setItem('customBooks', JSON.stringify(books));
    
    clearBookForm();
    loadBooks();
    showNotification('Book added successfully!');
}

function deleteBook(index) {
    if (confirm('Delete this book?')) {
        let books = JSON.parse(localStorage.getItem('customBooks') || '[]');
        books.splice(index, 1);
        localStorage.setItem('customBooks', JSON.stringify(books));
        loadBooks();
        showNotification('Book deleted');
    }
}

function clearBookForm() {
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
    document.getElementById('bookCategory').value = '';
    document.getElementById('bookYear').value = '';
    document.getElementById('bookDescription').value = '';
    document.getElementById('bookCover').value = '';
    document.getElementById('bookDownload').value = '';
}

// ==========================================
// UTILITIES
// ==========================================

function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLoginModal();
    }
});
