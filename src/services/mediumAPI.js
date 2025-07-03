// src/services/mediumApi.js

/**
 * Service for fetching and processing Medium blog posts
 */

/**
 * Fetches blog posts from Medium via RSS feed
 * @param {string} username - Medium username (without @)
 * @returns {Promise<Array>} - Processed blog post data
 */
export async function fetchMediumPosts(username = 'corneth') {
    try {
        // Use RSS to JSON converter service for Medium feed
        const rssUrl = `https://medium.com/feed/@${username}`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        // Cache control parameters
        const cacheTime = 30 * 60 * 1000; // 30 minutes in milliseconds
        const cachedData = sessionStorage.getItem('medium_posts');
        const cachedTimestamp = sessionStorage.getItem('medium_posts_timestamp');

        // Check if we have valid cached data
        if (cachedData && cachedTimestamp) {
            const now = new Date().getTime();
            if (now - cachedTimestamp < cacheTime) {
                // Return cached data if it's still fresh
                return JSON.parse(cachedData);
            }
        }

        // Fetch new data with error handling
        const response = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error(data.message || 'Failed to fetch Medium posts');
        }

        // Process the posts
        const processedPosts = data.items.map(item => {
            return {
                id: item.guid,
                title: item.title,
                author: item.author,
                publishedAt: item.pubDate,
                link: item.link,
                thumbnail: extractFirstImage(item.content),
                excerpt: extractExcerpt(item.content),
                categories: item.categories || []
            };
        });

        // Cache the processed data
        sessionStorage.setItem('medium_posts', JSON.stringify(processedPosts));
        sessionStorage.setItem('medium_posts_timestamp', new Date().getTime().toString());

        return processedPosts;
    } catch (error) {
        console.error('Error fetching Medium posts:', error);

        // Fallback to cached data if available, even if expired
        const cachedData = sessionStorage.getItem('medium_posts');
        if (cachedData) {
            console.log('Using cached Medium posts due to fetch error');
            return JSON.parse(cachedData);
        }

        // Re-throw the error if we can't recover
        throw error;
    }
}

/**
 * Extracts the first image from HTML content
 * @param {string} content - HTML content
 * @returns {string|null} - Image URL or placeholder
 */
function extractFirstImage(content) {
    if (!content) return null;

    // Use regex to find the first image
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
    const match = content.match(imgRegex);

    return match ? match[1] : '/api/placeholder/600/400';
}

/**
 * Extracts a clean text excerpt from HTML content
 * @param {string} content - HTML content
 * @returns {string} - Plain text excerpt
 */
function extractExcerpt(content) {
    if (!content) return '';

    // Create a temporary element to parse HTML safely
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // Get text content, limit length, and clean up
    let text = doc.body.textContent || '';
    text = text.replace(/\s+/g, ' ').trim();

    // Limit to 160 characters (good for SEO previews)
    return text.length > 160
        ? text.substring(0, 160) + '...'
        : text;
}