# Library Management Guide

## How to Add New Books

To add a new book to your library, simply edit the `library.json` file and add a new book object to the array.

### Book Template

```json
{
    "id": 4,
    "title": "Book Title Here",
    "author": "Author Name",
    "category": "Mathematics",
    "year": "2024",
    "pages": 350,
    "description": "Short description of the book content.",
    "cover": "https://via.placeholder.com/200x280/8b7355/ffffff?text=Book+Title",
    "driveLink": "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
}
```

### Step-by-Step Instructions

1. **Open library.json** file
2. **Add a comma** after the last book entry
3. **Copy and paste** the template above
4. **Fill in the details**:
   - `id`: Unique number (increment from last book)
   - `title`: Book title
   - `author`: Author name
   - `category`: Choose from: Mathematics, Physics, Computer Science, or add new category
   - `year`: Publication year
   - `pages`: Number of pages
   - `description`: Brief description (2-3 sentences)
   - `cover`: Book cover image URL (optional - will use placeholder if not provided)
   - `driveLink`: Google Drive link to download the book

### How to Get Google Drive Download Link

1. Upload your PDF/book to Google Drive
2. Right-click the file → **Get shareable link**
3. Make sure it's set to **"Anyone with the link can view"**
4. Copy the link (format: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`)
5. Paste it in the `driveLink` field

### Example: Adding a New Book

```json
[
    {
        "id": 1,
        "title": "Introduction to Linear Algebra",
        "author": "Gilbert Strang",
        "category": "Mathematics",
        "year": "2016",
        "pages": 574,
        "description": "A comprehensive introduction to linear algebra concepts and applications.",
        "cover": "https://via.placeholder.com/200x280/8b7355/ffffff?text=Linear+Algebra",
        "driveLink": "https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing"
    },
    {
        "id": 2,
        "title": "YOUR NEW BOOK",
        "author": "Author Name",
        "category": "Physics",
        "year": "2024",
        "pages": 450,
        "description": "Description here.",
        "cover": "https://example.com/cover.jpg",
        "driveLink": "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
    }
]
```

### Adding New Categories

To add a new category button:

1. Open `index.html`
2. Find the filter buttons section
3. Add a new button:
```html
<button class="filter-btn" onclick="filterBooks('YourCategory')">Your Category</button>
```

### Tips

- Keep descriptions concise (2-3 sentences)
- Use high-quality cover images (200x280px recommended)
- Always test your Google Drive links before adding them
- You can have up to 100 books
- Books appear automatically after refreshing the page

### Troubleshooting

- **Books not showing?** Check if library.json has valid JSON syntax
- **Download not working?** Make sure Google Drive link is public
- **Cover image broken?** Check if image URL is accessible

---

Created for easy library management on your portfolio website.
