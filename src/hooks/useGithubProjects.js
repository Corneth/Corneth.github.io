// hooks/useGithubProjects.js
import { useState, useEffect } from 'react';

const CATEGORY_KEYWORDS = {
    'web-development': ['web', 'site', 'frontend', 'react', 'vue', 'angular', 'html', 'css', 'javascript'],
    'machine-learning': ['ml', 'machine-learning', 'data', 'EDA', 'regression', 'classification', 'recommender', 'recommendation', 'analysis', 'ai', 'model', 'prediction'],
    'mobile-development': ['app', 'mobile', 'android', 'ios', 'react-native', 'flutter'],
    'game-development': ['game', 'unity', 'unreal', 'gameplay'],
    'labs': ['lab', 'dsc', 'bootcamp', 'workshop', 'exercise', 'assignment']
};

export default function useGithubProjects(username = 'corneth', options = {}) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState({});

    useEffect(() => {
        const fetchGithubProjects = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`https://api.github.com/users/${username}/repos`);

                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }

                const data = await response.json();

                // Process and categorize projects
                const processedProjects = data.map(repo => {
                    const category = determineCategoryByKeywords(repo);
                    const techStack = extractTechStack(repo);

                    return {
                        id: repo.id,
                        title: formatTitle(repo.name),
                        description: repo.description || `A ${category.replace('-', ' ')} project`,
                        category,
                        techStack,
                        image: '/api/placeholder/600/400',
                        liveUrl: repo.homepage || `https://github.com/${repo.full_name}`,
                        githubUrl: repo.html_url,
                        createdAt: repo.created_at,
                        updatedAt: repo.updated_at,
                        stars: repo.stargazers_count,
                        forks: repo.forks_count
                    };
                });

                // Group projects by category
                const categorizedProjects = {};
                Object.keys(CATEGORY_KEYWORDS).forEach(category => {
                    categorizedProjects[category] = processedProjects.filter(project =>
                        project.category === category
                    );
                });

                categorizedProjects.other = processedProjects.filter(project =>
                    !Object.keys(CATEGORY_KEYWORDS).includes(project.category)
                );

                setProjects(processedProjects);
                setCategories(categorizedProjects);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching GitHub projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGithubProjects();
    }, [username]);

    const formatTitle = (name) => {
        return name
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const determineCategoryByKeywords = (repo) => {
        // Check topics first
        if (repo.topics && repo.topics.length > 0) {
            for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
                if (repo.topics.some(topic => keywords.includes(topic.toLowerCase()))) {
                    return category;
                }
            }
        }

        // Check name and description
        const textToCheck = [
            repo.name.toLowerCase(),
            repo.description ? repo.description.toLowerCase() : ''
        ].join(' ');

        for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
            if (keywords.some(keyword => textToCheck.includes(keyword))) {
                if (category === 'machine-learning' && textToCheck.includes('dsc')) {
                    return 'labs';
                }
                return category;
            }
        }

        return 'other';
    };

    const extractTechStack = (repo) => {
        if (repo.topics && repo.topics.length > 0) {
            return repo.topics;
        }

        if (repo.language) {
            return [repo.language];
        }

        return ['GitHub'];
    };

    const getProjectsByCategory = (category) => {
        return categories[category] || [];
    };

    const getAllCategories = () => {
        return Object.keys(categories).filter(cat => categories[cat].length > 0);
    };

    return {
        projects,
        loading,
        error,
        categories,
        getProjectsByCategory,
        getAllCategories
    };
}