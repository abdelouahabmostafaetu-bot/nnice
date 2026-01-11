// Library Management System
let allBooks = [];
let currentFilter = 'all';

// Load books from JSON and localStorage
async function loadBooks() {
    try {
        const response = await fetch('library.json');
        const jsonBooks = await response.json();
        
        // Also load custom books from localStorage
        const customBooks = JSON.parse(localStorage.getItem('customBooks') || '[]');
        
        // Combine both sources
        allBooks = [...customBooks, ...jsonBooks];
        
        displayBooks(allBooks);
        updateStats();
    } catch (error) {
        console.error('Error loading books:', error);
        // Try to load only custom books if JSON fails
        const customBooks = JSON.parse(localStorage.getItem('customBooks') || '[]');
        allBooks = customBooks;
        displayBooks(allBooks);
        updateStats();
    }
}

// Display books in grid
function displayBooks(books) {
    const grid = document.getElementById('booksGrid');
    
    if (books.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #d4a574;">No books found.</p>';
        return;
    }
    
    grid.innerHTML = books.map(book => `
        <div class="book-card" data-category="${book.category}">
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/200x280/8b7355/ffffff?text=${encodeURIComponent(book.title)}'">
                <div class="book-overlay">
                    <button class="download-btn" onclick="downloadBook('${book.driveLink}', '${book.title}')">
                        📥 Download
                    </button>
                </div>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <p class="book-details">
                    <span class="book-category">${book.category}</span>
                    <span class="book-pages">${book.pages} pages</span>
                    <span class="book-year">${book.year}</span>
                </p>
                <p class="book-description">${book.description}</p>
            </div>
        </div>
    `).join('');
}

// Filter books by category
function filterBooks(category) {
    currentFilter = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter and display
    if (category === 'all') {
        displayBooks(allBooks);
    } else {
        const filtered = allBooks.filter(book => book.category === category);
        displayBooks(filtered);
    }
}

// Search books
function searchBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allBooks.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
    );
    displayBooks(filtered);
}

// Download book
function downloadBook(driveLink, title) {
    if (driveLink.includes('YOUR_FILE_ID')) {
        alert('Download link not configured yet. Please update the library.json file with actual Google Drive links.');
        return;
    }
    
    // Convert Google Drive view link to download link
    const fileId = driveLink.match(/\/d\/([^\/]+)/)?.[1];
    if (fileId) {
        const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
        window.open(downloadLink, '_blank');
    } else {
        window.open(driveLink, '_blank');
    }
}

// Update library statistics
function updateStats() {
    const totalBooks = allBooks.length;
    const categories = [...new Set(allBooks.map(book => book.category))].length;
    const totalPages = allBooks.reduce((sum, book) => sum + book.pages, 0);
    
    document.getElementById('totalBooks').textContent = totalBooks;
    document.getElementById('totalCategories').textContent = categories;
    document.getElementById('totalPages').textContent = totalPages.toLocaleString();
}

// Initialize library on page load
document.addEventListener('DOMContentLoaded', loadBooks);
