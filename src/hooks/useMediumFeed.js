// src/hooks/useMediumPosts.js
import { useState, useEffect } from 'react';
import { fetchMediumPosts } from '../services/mediumAPI';

/**
 * Custom hook to fetch and manage Medium blog posts
 *
 * @param {string} username - Medium username
 * @param {number} limit - Maximum number of posts to fetch
 * @returns {Object} { posts, loading, error, refetch }
 */
export default function useMediumFeed(username, limit = 6) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const fetchedPosts = await fetchMediumPosts(username, limit);
            setPosts(fetchedPosts);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch blog posts');
            console.error('Error in useMediumPosts hook:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [username, limit]);

    // Return the posts, loading state, error state, and a refetch function
    return {
        posts,
        loading,
        error,
        refetch: fetchPosts
    };
}