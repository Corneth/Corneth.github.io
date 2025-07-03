// components/projects/ProjectsPage.jsx
import { useState } from 'react';
import PageLayout from '../shared/PageLayout';
import ProjectCard from '../shared/ProjectCard';
import useGithubProjects from '../../hooks/useGithubProjects';
import { Search, Filter, TrendingUp } from 'lucide-react';

export default function ProjectsPage() {
    const { loading, error, projects, categories, getProjectsByCategory } = useGithubProjects('corneth');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('updated');

    // Filter and sort projects
    const filteredProjects = projects
        .filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'stars':
                    return b.stars - a.stars;
                case 'updated':
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                case 'created':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'web-development', label: 'Web Development' },
        { value: 'machine-learning', label: 'AI/ML' },
        { value: 'mobile-development', label: 'Mobile' },
        { value: 'game-development', label: 'Games' },
        { value: 'labs', label: 'Labs' },
        { value: 'other', label: 'Other' }
    ];

    const sortOptions = [
        { value: 'updated', label: 'Recently Updated' },
        { value: 'created', label: 'Recently Created' },
        { value: 'stars', label: 'Most Starred' }
    ];

    if (loading) {
        return (
            <PageLayout
                title="All Projects"
                subtitle="Loading project database..."
                color="indigo"
            >
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout
                title="All Projects"
                subtitle="Error accessing project database"
                color="indigo"
            >
                <div className="bg-red-900/20 border border-red-800 text-red-400 p-6 rounded-xl text-center">
                    <p>{error}</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title="All Projects"
            subtitle="Complete overview of my development work"
            color="indigo"
        >
            {/* Search and Filter Controls */}
            <div className="mb-8 p-6 bg-gray-900/50 border border-indigo-500/30 rounded-lg">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                        >
                            {categoryOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
                    <span>
            {selectedCategory !== 'all' && `Filtered by: ${categoryOptions.find(c => c.value === selectedCategory)?.label}`}
          </span>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => {
                    // Determine color based on category
                    const getProjectColor = (category) => {
                        switch (category) {
                            case 'web-development': return 'purple';
                            case 'machine-learning': return 'green';
                            case 'mobile-development': return 'blue';
                            case 'game-development': return 'yellow';
                            case 'labs': return 'cyan';
                            default: return 'gray';
                        }
                    };

                    return (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            color={getProjectColor(project.category)}
                        />
                    );
                })}
            </div>

            {/* No Results */}
            {filteredProjects.length === 0 && (
                <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-indigo-800">
                    <p className="text-gray-400 mb-4">No projects found matching your criteria.</p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('all');
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Stats Section */}
            <div className="mt-16 grid md:grid-cols-4 gap-6">
                <div className="bg-gray-900/50 border border-indigo-500/30 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-indigo-400">{projects.length}</div>
                    <div className="text-gray-400">Total Projects</div>
                </div>
                <div className="bg-gray-900/50 border border-indigo-500/30 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-indigo-400">
                        {projects.reduce((sum, p) => sum + p.stars, 0)}
                    </div>
                    <div className="text-gray-400">Total Stars</div>
                </div>
                <div className="bg-gray-900/50 border border-indigo-500/30 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-indigo-400">
                        {projects.reduce((sum, p) => sum + p.forks, 0)}
                    </div>
                    <div className="text-gray-400">Total Forks</div>
                </div>
                <div className="bg-gray-900/50 border border-indigo-500/30 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-indigo-400">
                        {new Set(projects.flatMap(p => p.techStack)).size}
                    </div>
                    <div className="text-gray-400">Technologies Used</div>
                </div>
            </div>
        </PageLayout>
    );
}