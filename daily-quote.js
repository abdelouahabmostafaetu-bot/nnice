/**
 * Daily Mathematics Quote System
 * 
 * Deterministic quote selection based on current date.
 * Same quote appears for all visitors on the same day.
 * Automatically changes at midnight.
 * 
 * Selection Algorithm:
 * 1. Get current date (YYYY-MM-DD)
 * 2. Calculate days since Unix epoch (1970-01-01)
 * 3. Use modulo operation: daysSinceEpoch % totalQuotes
 * 4. Result is the quote index for today
 * 
 * Scalability:
 * - Can be extended to multiple JSON files (mathematics-1.json, mathematics-2.json, etc.)
 * - File selection can be based on date range or hash
 * - Only one file loads per request
 */

class DailyQuoteSystem {
    constructor(quotesPath = 'quotes/mathematics.json') {
        this.quotesPath = quotesPath;
        this.quotes = [];
    }

    /**
     * Calculate days since Unix epoch for deterministic selection
     */
    getDaysSinceEpoch() {
        const now = new Date();
        const epochStart = new Date('1970-01-01');
        const diffTime = now.setHours(0, 0, 0, 0) - epochStart.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    /**
     * Get formatted date string for display
     */
    getFormattedDate() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    }

    /**
     * Load quotes from JSON file and localStorage
     */
    async loadQuotes() {
        try {
            const response = await fetch(this.quotesPath);
            if (!response.ok) {
                throw new Error(`Failed to load quotes: ${response.status}`);
            }
            const data = await response.json();
            this.quotes = data.quotes;
            
            // Also load custom quotes from localStorage and merge them
            const customQuotes = JSON.parse(localStorage.getItem('customQuotes') || '[]');
            if (customQuotes.length > 0) {
                const customQuoteStrings = customQuotes.map(q => `${q.text} — ${q.author}`);
                this.quotes = [...customQuoteStrings, ...this.quotes];
            }
            
            return true;
        } catch (error) {
            console.error('Error loading quotes:', error);
            // Try custom quotes first, then fallback
            const customQuotes = JSON.parse(localStorage.getItem('customQuotes') || '[]');
            if (customQuotes.length > 0) {
                this.quotes = customQuotes.map(q => `${q.text} — ${q.author}`);
            } else {
                this.quotes = ["Mathematics is the language in which God has written the universe. — Galileo Galilei"];
            }
            return false;
        }
    }

    /**
     * Get today's quote using deterministic selection
     */
    getTodaysQuote() {
        if (this.quotes.length === 0) {
            return null;
        }

        const daysSinceEpoch = this.getDaysSinceEpoch();
        const quoteIndex = daysSinceEpoch % this.quotes.length;
        
        return this.quotes[quoteIndex];
    }

    /**
     * Render the quote into the specified element
     */
    render(elementId) {
        const container = document.getElementById(elementId);
        if (!container) {
            console.error(`Element with id "${elementId}" not found`);
            return;
        }

        const quote = this.getTodaysQuote();
        if (!quote) {
            container.innerHTML = '<p style="color: #999;">Quote unavailable</p>';
            return;
        }

        const dateString = this.getFormattedDate();

        container.innerHTML = `
            <div class="daily-quote">
                <p class="quote-text">${quote}</p>
                <p class="quote-date">${dateString}</p>
            </div>
        `;
    }

    /**
     * Initialize the system
     */
    async init(elementId) {
        await this.loadQuotes();
        this.render(elementId);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const quoteSystem = new DailyQuoteSystem();
    quoteSystem.init('daily-mathematics-quote');
});
