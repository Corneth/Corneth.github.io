// components/blog/BlogPage.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, RefreshCw, ExternalLink, BookOpen, Rss, Zap, BarChart3, TrendingUp } from 'lucide-react';
import BlogCard from '../shared/BlogCard';
import useMediumFeed from '../../hooks/useMediumFeed';

export default function BlogPage() {
    const { posts, loading, error, refetch } = useMediumFeed('corneth', 12);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scanAnimation, setScanAnimation] = useState(false);
    const canvasRef = useRef(null);

    // Calculate estimated read time
    const calculateReadTime = (text) => {
        if (!text) return '5 min read';
        const wordsPerMinute = 200;
        const words = text.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${Math.max(1, minutes)} min read`;
    };

    // Transform posts to ensure consistent format
    const transformedPosts = posts.map(post => ({
        id: post.id || post.guid,
        title: post.title,
        description: post.excerpt || post.description || '',
        link: post.link,
        pubDate: post.publishedAt || post.pubDate,
        readTime: calculateReadTime(post.excerpt || post.description || ''),
        categories: post.categories || [],
        thumbnail: post.thumbnail || '/api/placeholder/400/200'
    }));

    const filteredPosts = transformedPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' ||
            (post.categories && post.categories.includes(selectedCategory));
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...new Set(transformedPosts.flatMap(post => post.categories || []))];

    // Mouse tracking
    useEffect(() => {
        let rafId;
        const handleMouseMove = (e) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                setMousePosition({ x: e.clientX, y: e.clientY });
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    // Trigger scan animation when searching
    useEffect(() => {
        if (searchTerm) {
            setScanAnimation(true);
            const timer = setTimeout(() => setScanAnimation(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [searchTerm]);

    // Information flow visualization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let animationId;
        const textStreams = [];
        const knowledgeNodes = [];
        const readingMetrics = [];
        const rssPackets = [];

        // Sample article titles and tech terms
        const sampleContent = [
            'React Hooks Deep Dive',
            'AI in Web Development',
            'TypeScript Best Practices',
            'Mobile App Architecture',
            'Machine Learning Trends',
            'Cloud Infrastructure',
            'Data Visualization',
            'API Design Patterns',
            'Performance Optimization',
            'Modern CSS Techniques'
        ];

        // Create flowing text streams
        for (let i = 0; i < 8; i++) {
            textStreams.push({
                x: (canvas.width / 9) * (i + 1),
                y: Math.random() * canvas.height,
                speed: 0.5 + Math.random() * 1.5,
                content: sampleContent[Math.floor(Math.random() * sampleContent.length)],
                opacity: 0.3 + Math.random() * 0.4,
                progress: Math.random()
            });
        }

        // Create knowledge nodes (article topics)
        for (let i = 0; i < 12; i++) {
            knowledgeNodes.push({
                x: 100 + Math.random() * (canvas.width - 200),
                y: 100 + Math.random() * (canvas.height - 200),
                radius: 15 + Math.random() * 25,
                connections: [],
                category: ['Tech', 'AI', 'Web', 'Mobile', 'Data'][Math.floor(Math.random() * 5)],
                pulse: Math.random() * Math.PI * 2,
                readCount: Math.floor(Math.random() * 500) + 50
            });
        }

        // Create connections between nearby nodes
        knowledgeNodes.forEach((node, i) => {
            knowledgeNodes.slice(i + 1).forEach((otherNode, j) => {
                const distance = Math.sqrt(
                    Math.pow(node.x - otherNode.x, 2) +
                    Math.pow(node.y - otherNode.y, 2)
                );
                if (distance < 150 && Math.random() < 0.3) {
                    node.connections.push(otherNode);
                }
            });
        });

        // Create reading metrics
        for (let i = 0; i < 15; i++) {
            readingMetrics.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                type: ['45%', '3min', '★★★★☆', '1.2k views', '85% read'][Math.floor(Math.random() * 5)],
                opacity: Math.random() * 0.4 + 0.2,
                size: 10 + Math.random() * 8
            });
        }

        // Create RSS data packets
        for (let i = 0; i < 20; i++) {
            rssPackets.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: 3 + Math.random() * 5,
                opacity: Math.random() * 0.6 + 0.3,
                type: Math.random() < 0.5 ? 'new' : 'trending'
            });
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw text streams
            textStreams.forEach(stream => {
                stream.y += stream.speed;
                stream.progress += 0.01;

                if (stream.y > canvas.height + 100) {
                    stream.y = -100;
                    stream.content = sampleContent[Math.floor(Math.random() * sampleContent.length)];
                }

                // Main text
                ctx.fillStyle = `rgba(6, 182, 212, ${stream.opacity})`;
                ctx.font = '14px monospace';
                ctx.fillText(stream.content, stream.x, stream.y);

                // Reading progress bar
                const barWidth = Math.min(stream.content.length * 8, 120);
                ctx.fillStyle = `rgba(6, 182, 212, ${stream.opacity * 0.3})`;
                ctx.fillRect(stream.x, stream.y + 20, barWidth, 2);
                ctx.fillStyle = `rgba(34, 197, 94, ${stream.opacity * 0.8})`;
                ctx.fillRect(stream.x, stream.y + 20, barWidth * stream.progress, 2);

                // Add flowing particles
                for (let i = 0; i < 3; i++) {
                    ctx.fillStyle = `rgba(6, 182, 212, ${stream.opacity * 0.5})`;
                    ctx.fillRect(stream.x + i * 20, stream.y - 30 - i * 10, 2, 2);
                }
            });

            // Draw knowledge nodes and connections
            knowledgeNodes.forEach(node => {
                node.pulse += 0.03;

                // Draw connections first
                node.connections.forEach(connectedNode => {
                    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 3]);
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(connectedNode.x, connectedNode.y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                });

                // Draw node
                const pulseIntensity = (Math.sin(node.pulse) + 1) * 0.5;
                ctx.fillStyle = `rgba(6, 182, 212, ${0.3 + pulseIntensity * 0.4})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();

                // Node label
                ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(node.category, node.x, node.y + 3);

                // Read count
                ctx.fillStyle = `rgba(6, 182, 212, 0.6)`;
                ctx.font = '8px monospace';
                ctx.fillText(`${node.readCount}`, node.x, node.y + 15);
                ctx.textAlign = 'left';
            });

            // Draw floating reading metrics
            readingMetrics.forEach(metric => {
                metric.x += metric.vx;
                metric.y += metric.vy;

                // Wrap around screen
                if (metric.x < 0) metric.x = canvas.width;
                if (metric.x > canvas.width) metric.x = 0;
                if (metric.y < 0) metric.y = canvas.height;
                if (metric.y > canvas.height) metric.y = 0;

                ctx.fillStyle = `rgba(34, 197, 94, ${metric.opacity})`;
                ctx.font = `${metric.size}px monospace`;
                ctx.fillText(metric.type, metric.x, metric.y);
            });

            // Draw RSS data packets
            rssPackets.forEach(packet => {
                packet.x += packet.vx;
                packet.y += packet.vy;

                // Bounce off edges
                if (packet.x <= 0 || packet.x >= canvas.width) packet.vx *= -1;
                if (packet.y <= 0 || packet.y >= canvas.height) packet.vy *= -1;

                const color = packet.type === 'new' ? '6, 182, 212' : '34, 197, 94';
                ctx.fillStyle = `rgba(${color}, ${packet.opacity})`;
                ctx.beginPath();
                ctx.arc(packet.x, packet.y, packet.size, 0, Math.PI * 2);
                ctx.fill();

                // Add glow for new articles
                if (packet.type === 'new') {
                    ctx.shadowColor = '#06b6d4';
                    ctx.shadowBlur = 5;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            // Draw search scan line if active
            if (scanAnimation) {
                const scanY = (Date.now() % 3000) / 3000 * canvas.height;
                ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(0, scanY);
                ctx.lineTo(canvas.width, scanY);
                ctx.stroke();

                // Scan glow
                ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
                ctx.lineWidth = 8;
                ctx.stroke();
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, [scanAnimation]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                            <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border border-cyan-500 opacity-20"></div>
                        </div>
                        <p className="text-cyan-400 mt-4 font-mono">SCANNING_INFORMATION_STREAMS...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="bg-red-900/20 border border-red-800 text-red-400 p-6 rounded-xl text-center max-w-md">
                        <BookOpen className="mx-auto mb-4" size={48} />
                        <p className="font-mono mb-4">INFORMATION_FEED_ERROR: {error}</p>
                        <button
                            onClick={refetch}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors mr-4"
                        >
                            RETRY_SCAN
                        </button>
                        <Link
                            to="/"
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors inline-block"
                        >
                            RETURN_TO_BASE
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Information Flow Canvas Background */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Information particles */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-cyan-400 opacity-30 font-mono text-xs"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        {['📄', '📊', '💡', '🔍', '📈', '🔗', '📝', '💬'][Math.floor(Math.random() * 8)]}
                    </div>
                ))}
            </div>

            {/* Data flow lines */}
            <div className="absolute inset-0 pointer-events-none opacity-15">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"
                        style={{
                            top: `${15 + i * 12}%`,
                            width: '100%',
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: '2s'
                        }}
                    />
                ))}
            </div>

            {/* Interactive reading glow */}
            <div
                className="absolute w-40 h-40 pointer-events-none z-20"
                style={{
                    left: mousePosition.x - 80,
                    top: mousePosition.y - 80,
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transition: 'left 0.1s ease-out, top 0.1s ease-out'
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-cyan-900/30 border border-cyan-500 rounded-lg relative">
                                <BookOpen className="text-cyan-400" size={28} />
                                <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-cyan-400 mb-2 font-mono">
                                    KNOWLEDGE_DATABASE.EXE
                                </h1>
                                <p className="text-cyan-300 font-mono">
                                    {'>'} INFORMATION_STREAMS &amp; CONTENT_ANALYSIS
                                </p>
                            </div>
                        </div>

                        {/* Stream status indicators */}
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Rss className="text-cyan-400" size={16} />
                                <span className="text-cyan-300 font-mono">RSS_SYNC: ACTIVE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BarChart3 className="text-blue-400" size={16} />
                                <span className="text-cyan-300 font-mono">ANALYTICS: TRACKING</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="text-green-400" size={16} />
                                <span className="text-cyan-300 font-mono">ARTICLES: {transformedPosts.length}</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="px-6 py-3 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-all duration-300 flex items-center gap-2 font-mono backdrop-blur-sm"
                    >
                        <ArrowLeft size={16} />
                        CLOSE_DATABASE
                    </Link>
                </div>

                {/* Search and Analytics Controls */}
                <div className="mb-8 p-6 bg-black/60 border border-cyan-500/50 rounded-lg backdrop-blur-sm">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Scan articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white font-mono"
                            />
                            {scanAnimation && (
                                <div className="absolute inset-0 border-2 border-green-400 rounded-lg animate-pulse"></div>
                            )}
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 font-mono"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Topics' : category}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={refetch}
                            className="p-3 text-cyan-400 hover:text-cyan-300 transition-colors bg-gray-800/50 rounded-lg hover:bg-gray-700/50 border border-gray-700"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
                        <div className="text-center">
                            <div className="text-cyan-400 text-lg">{filteredPosts.length}</div>
                            <div className="text-gray-400">ARTICLES_FOUND</div>
                        </div>
                        <div className="text-center">
                            <div className="text-green-400 text-lg">{categories.length - 1}</div>
                            <div className="text-gray-400">CATEGORIES</div>
                        </div>
                        <div className="text-center">
                            <div className="text-blue-400 text-lg">
                                {Math.round(filteredPosts.reduce((acc, post) => acc + (post.readTime ? parseInt(post.readTime) : 5), 0) / Math.max(filteredPosts.length, 1))}min
                            </div>
                            <div className="text-gray-400">AVG_READ_TIME</div>
                        </div>
                        <div className="text-center">
                            <div className="text-purple-400 text-lg">{transformedPosts.length}</div>
                            <div className="text-gray-400">TOTAL_POSTS</div>
                        </div>
                    </div>
                </div>

                {/* Articles Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filteredPosts.map(post => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-16 bg-cyan-900/20 rounded-2xl border border-cyan-800 backdrop-blur-sm">
                        <Search className="mx-auto mb-4 text-cyan-400" size={48} />
                        <p className="text-gray-400 mb-4 font-mono">NO_INFORMATION_MATCHES_SCAN_CRITERIA</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors font-mono"
                        >
                            RESET_SEARCH_PARAMETERS
                        </button>
                    </div>
                )}

                {/* Knowledge Base Access */}
                <div className="text-center">
                    <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-cyan-700">
                        <div className="flex items-center gap-3 mb-2">
                            <Rss className="text-cyan-400" size={24} />
                            <p className="text-gray-400 font-mono">ACCESS_FULL_KNOWLEDGE_BASE?</p>
                        </div>
                        <a
                            href="https://medium.com/@thomascornett"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl transition-all duration-300 transform hover:scale-105 font-mono"
                        >
                            ENTER_INFORMATION_MATRIX
                            <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-6px) rotate(3deg); }
                }
            `}</style>
        </div>
    );
}