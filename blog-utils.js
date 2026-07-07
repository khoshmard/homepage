// ─── Blog Utilities ───
// Shared between main portfolio, blog admin, and static pages

/**
 * Convert an array of content blocks to HTML.
 * @param {Array} blocks - Array of block objects { type, text, src, ... }
 * @returns {string} HTML string
 */
function renderBlocksToHTML(blocks) {
    if (!Array.isArray(blocks)) return '';
    return blocks.map(block => {
        switch (block.type) {
            case 'paragraph':
                return `<p>${block.text}</p>`;
            case 'heading':
                return `<h2>${block.text}</h2>`;
            case 'image':
                return `<figure><img src="${block.src}" alt="${block.alt || ''}" loading="lazy"><figcaption>${block.alt || ''}</figcaption></figure>`;
            case 'video':
                if (block.src.includes('youtube.com/embed') || block.src.includes('vimeo.com/video')) {
                    return `<div class="video-wrapper"><iframe src="${block.src}" allowfullscreen></iframe></div>`;
                }
                return `<video controls src="${block.src}"></video>`;
            case 'code':
                return `<pre><code class="language-${block.language || 'plaintext'}">${block.code}</code></pre>`;
            default:
                return '';
        }
    }).join('');
}

/**
 * Calculate estimated reading time in minutes.
 * @param {Array} blocks - Array of content blocks (English)
 * @returns {number} minutes
 */
function calculateReadingTime(blocks) {
    if (!Array.isArray(blocks)) return 0;
    let totalWords = 0;
    for (const block of blocks) {
        if (block.type === 'paragraph' || block.type === 'heading') {
            const text = block.text || '';
            const plainText = text.replace(/<[^>]*>/g, '');
            const words = plainText.split(/\s+/).filter(w => w.length > 0);
            totalWords += words.length;
        }
        if (block.type === 'code' && block.code) {
            const codeWords = block.code.split(/\s+/).filter(w => w.length > 0);
            totalWords += codeWords;
        }
    }
    const wordsPerMinute = 200;
    return Math.ceil(totalWords / wordsPerMinute);
}

/**
 * Strip HTML tags and return plain text.
 * @param {string} html
 * @returns {string}
 */
function stripHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}