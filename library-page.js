// Library Page JavaScript
// Loads books from library.json and localStorage

let allBooks = [];

document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    initScrollEffects();
});

// Load books from library.json and localStorage
async function loadBooks() {
    const libraryGrid = document.getElementById('libraryGrid');
    const noBooksMessage = document.getElementById('noBooksMessage');
    
    try {
        // Fetch books from library.json
        const response = await fetch('library.json');
        let jsonBooks = [];
        
        if (response.ok) {
            const data = await response.json();
            // Handle both array and single object formats
            if (Array.isArray(data)) {
                jsonBooks = data;
            } else if (data && typeof data === 'object') {
                jsonBooks = [data];
            }
        }
        
        // Get custom books from localStorage
        const customBooks = JSON.parse(localStorage.getItem('customBooks') || '[]');
        
        // Combine all books
        allBooks = [...jsonBooks, ...customBooks];
        
        if (allBooks.length === 0) {
            libraryGrid.style.display = 'none';
            noBooksMessage.style.display = 'block';
            return;
        }
        
        // Update stats
        updateStats();
        
        // Create category filters
        createCategoryFilters();
        
        // Display books
        displayBooks(allBooks);
        
    } catch (error) {
        console.error('Error loading books:', error);
        libraryGrid.innerHTML = '<p class="error-message">Error loading library. Please try again later.</p>';
    }
}

// Update statistics
function updateStats() {
    document.getElementById('totalBooks').textContent = allBooks.length;
    
    const categories = [...new Set(allBooks.map(book => book.category))];
    document.getElementById('totalCategories').textContent = categories.length;
}

// Create category filter buttons
function createCategoryFilters() {
    const filterContainer = document.querySelector('.category-filter');
    const categories = [...new Set(allBooks.map(book => book.category))];
    
    // Clear existing buttons except "All"
    filterContainer.innerHTML = '<button class="filter-btn active" data-category="all">All</button>';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.category = category;
        btn.textContent = category;
        filterContainer.appendChild(btn);
    });
    
    // Add click handlers
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            if (category === 'all') {
                displayBooks(allBooks);
            } else {
                displayBooks(allBooks.filter(book => book.category === category));
            }
        });
    });
}

// Display books in grid
function displayBooks(books) {
    const libraryGrid = document.getElementById('libraryGrid');
    const noBooksMessage = document.getElementById('noBooksMessage');
    
    if (books.length === 0) {
        libraryGrid.innerHTML = '';
        noBooksMessage.style.display = 'block';
        return;
    }
    
    noBooksMessage.style.display = 'none';
    
    libraryGrid.innerHTML = books.map((book, index) => `
        <div class="library-book-card" data-category="${book.category}" onclick="openBookModal(${index})">
            <div class="library-book-cover">
                <img src="${book.cover || 'cover/default-book.jpg'}" alt="${book.title}" onerror="this.src='cover/default-book.jpg'; this.onerror=null;">
                <div class="library-book-overlay">
                    <button class="view-btn">View Details</button>
                </div>
            </div>
            <div class="library-book-info">
                <h3 class="library-book-title">${book.title}</h3>
                <p class="library-book-author">by ${book.author}</p>
                <div class="library-book-meta">
                    <span class="category-tag">${book.category}</span>
                    <span class="year-tag">${book.year}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Open book modal
function openBookModal(index) {
    const book = allBooks[index];
    const modal = document.getElementById('bookModal');
    
    document.getElementById('modalBookCover').src = book.cover || 'cover/default-book.jpg';
    document.getElementById('modalBookTitle').textContent = book.title;
    document.getElementById('modalBookAuthor').textContent = `by ${book.author}`;
    document.getElementById('modalBookCategory').textContent = book.category;
    document.getElementById('modalBookYear').textContent = book.year;
    document.getElementById('modalBookPages').textContent = book.pages ? `${book.pages} pages` : '';
    document.getElementById('modalBookDescription').textContent = book.description || 'No description available.';
    
    const downloadBtn = document.getElementById('modalDownloadBtn');
    if (book.driveLink) {
        downloadBtn.href = book.driveLink;
        downloadBtn.style.display = 'inline-flex';
    } else {
        downloadBtn.style.display = 'none';
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close book modal
function closeBookModal() {
    const modal = document.getElementById('bookModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('bookModal');
    if (e.target === modal) {
        closeBookModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBookModal();
    }
});

// Scroll effects
function initScrollEffects() {
    const scrollTop = document.getElementById('scrollTop');
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', function() {
        // Scroll to top button
        if (window.scrollY > 300) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
        
        // Scroll progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
    
    scrollTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
