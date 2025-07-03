// components/web/WebDevPage.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Terminal, Globe, Zap, Layers, Database } from 'lucide-react';
import ProjectCard from '../shared/ProjectCard';
import useGithubProjects from '../../hooks/useGithubProjects';

export default function WebDevPage() {
    const { loading, error, getProjectsByCategory } = useGithubProjects('corneth');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [glitchEffect, setGlitchEffect] = useState(false);
    const canvasRef = useRef(null);

    const webProjects = getProjectsByCategory('web-development');

    // Filter projects based on selected technology
    const filteredProjects = selectedFilter === 'all'
        ? webProjects
        : webProjects.filter(project =>
            project.techStack.some(tech =>
                tech.toLowerCase().includes(selectedFilter.toLowerCase())
            )
        );

    const techFilters = [
        { value: 'all', label: 'All Projects' },
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue.js' },
        { value: 'node', label: 'Node.js' },
        { value: 'typescript', label: 'TypeScript' }
    ];

    // Mouse tracking for interactive effects
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

    // Glitch effect
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            setGlitchEffect(true);
            setTimeout(() => setGlitchEffect(false), 150);
        }, 12000);
        return () => clearInterval(glitchInterval);
    }, []);

    // Code/Circuit board pattern background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let animationId;
        const codeLines = [];
        const circuits = [];

        // Create falling code lines
        for (let i = 0; i < 15; i++) {
            codeLines.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                speed: 1 + Math.random() * 3,
                opacity: Math.random() * 0.5 + 0.3,
                characters: generateCodeLine()
            });
        }

        // Create circuit patterns
        for (let i = 0; i < 25; i++) {
            circuits.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 20 + Math.random() * 80,
                height: 20 + Math.random() * 80,
                pulse: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.3 + 0.1
            });
        }

        function generateCodeLine() {
            const codeSnippets = [
                'const app = express();',
                'function useState()',
                'return <Component />',
                'async/await fetch()',
                'import React from',
                'export default',
                'console.log()',
                'document.query',
                '.then(response =>',
                'margin: 0 auto;',
                'display: flex;',
                'position: relative;'
            ];
            return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw falling code
            ctx.font = '12px monospace';
            codeLines.forEach(line => {
                line.y += line.speed;

                if (line.y > canvas.height + 50) {
                    line.y = -50;
                    line.x = Math.random() * canvas.width;
                    line.characters = generateCodeLine();
                }

                ctx.fillStyle = `rgba(168, 85, 247, ${line.opacity})`;
                ctx.fillText(line.characters, line.x, line.y);

                // Add some trailing dots
                for (let i = 1; i <= 3; i++) {
                    ctx.fillStyle = `rgba(168, 85, 247, ${line.opacity * (1 - i * 0.3)})`;
                    ctx.fillText('...', line.x, line.y + (i * 15));
                }
            });

            // Draw circuit patterns
            circuits.forEach(circuit => {
                circuit.pulse += 0.02;
                const pulseAlpha = (Math.sin(circuit.pulse) + 1) * 0.5;

                ctx.strokeStyle = `rgba(168, 85, 247, ${circuit.opacity * pulseAlpha})`;
                ctx.lineWidth = 1;

                // Draw circuit board style rectangles and lines
                ctx.strokeRect(circuit.x, circuit.y, circuit.width, circuit.height);

                // Add connecting lines
                if (Math.random() < 0.3) {
                    ctx.beginPath();
                    ctx.moveTo(circuit.x + circuit.width/2, circuit.y);
                    ctx.lineTo(circuit.x + circuit.width/2, circuit.y - 20);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(circuit.x + circuit.width, circuit.y + circuit.height/2);
                    ctx.lineTo(circuit.x + circuit.width + 20, circuit.y + circuit.height/2);
                    ctx.stroke();
                }
            });

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
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                            <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border border-purple-500 opacity-20"></div>
                        </div>
                        <p className="text-purple-400 mt-4 font-mono">COMPILING WEB_SYSTEMS...</p>
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
                        <Terminal className="mx-auto mb-4" size={48} />
                        <p className="font-mono mb-4">COMPILATION ERROR: {error}</p>
                        <Link
                            to="/"
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors inline-block"
                        >
                            Return to Base
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-black relative overflow-hidden ${glitchEffect ? 'animate-glitch' : ''}`}>
            {/* Code/Circuit Background Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Code particles */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-purple-400 opacity-30 font-mono text-xs"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        {['<>', '{}', '[]', '();', '=>', '&&', '||'][Math.floor(Math.random() * 7)]}
                    </div>
                ))}
            </div>

            {/* Scan lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scan-line" />
            </div>

            {/* Interactive cursor glow */}
            <div
                className="absolute w-32 h-32 pointer-events-none z-20"
                style={{
                    left: mousePosition.x - 64,
                    top: mousePosition.y - 64,
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transition: 'left 0.1s ease-out, top 0.1s ease-out'
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-900/30 border border-purple-500 rounded-lg">
                                <Code className="text-purple-400" size={28} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-purple-400 mb-2 font-mono">
                                    WEB_DEVELOPMENT.EXE
                                </h1>
                                <p className="text-purple-300 font-mono">
                                    {'>'} FULL_STACK_APPLICATIONS &amp; MODERN_WEB_EXPERIENCES
                                </p>
                            </div>
                        </div>

                        {/* Status indicators */}
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Layers className="text-purple-400" size={16} />
                                <span className="text-purple-300 font-mono">FRONTEND: COMPILED</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Database className="text-pink-400" size={16} />
                                <span className="text-purple-300 font-mono">BACKEND: DEPLOYED</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="text-blue-400" size={16} />
                                <span className="text-purple-300 font-mono">SERVER: ONLINE</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="px-6 py-3 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-all duration-300 flex items-center gap-2 font-mono backdrop-blur-sm"
                    >
                        <ArrowLeft size={16} />
                        RETURN_TO_BASE
                    </Link>
                </div>

                {/* Terminal-style Filter Section */}
                <div className="mb-8 p-6 bg-black/60 border border-purple-500/50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Terminal className="text-purple-400" size={20} />
                        <h3 className="text-purple-400 font-mono font-semibold">TECHNOLOGY_FILTER:</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {techFilters.map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setSelectedFilter(filter.value)}
                                className={`px-4 py-2 rounded font-mono text-sm transition-all duration-300 border ${
                                    selectedFilter === filter.value
                                        ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/20'
                                        : 'bg-purple-900/30 text-purple-300 border-purple-700 hover:bg-purple-800/40 hover:border-purple-500'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filteredProjects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            color="purple"
                        />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-16 bg-purple-900/20 rounded-2xl border border-purple-800 backdrop-blur-sm">
                        <Terminal className="mx-auto mb-4 text-purple-400" size={48} />
                        <p className="text-gray-400 mb-4 font-mono">NO_PROJECTS_FOUND_FOR_FILTER</p>
                        <button
                            onClick={() => setSelectedFilter('all')}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-mono"
                        >
                            RESET_FILTERS
                        </button>
                    </div>
                )}

                {/* Skills Section with code styling */}
                <div className="bg-black/60 border border-purple-500/50 rounded-lg p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <Zap className="text-purple-400" size={24} />
                        <h2 className="text-2xl font-bold text-purple-400 font-mono">WEB_DEVELOPMENT_STACK</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6 hover:border-purple-500 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Layers className="text-purple-300" size={20} />
                                <h3 className="text-purple-300 font-semibold font-mono">FRONTEND_STACK</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    React.js + Redux Toolkit
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    Vue.js + Vuex/Pinia
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    TypeScript + ES6+
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    Tailwind CSS + SCSS
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    Responsive Design
                                </li>
                            </ul>
                        </div>

                        <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6 hover:border-purple-500 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="text-purple-300" size={20} />
                                <h3 className="text-purple-300 font-semibold font-mono">BACKEND_STACK</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    Node.js + Express.js
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    RESTful API Design
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    GraphQL + Apollo
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    JWT Authentication
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    MongoDB + PostgreSQL
                                </li>
                            </ul>
                        </div>

                        <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-6 hover:border-purple-500 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="text-purple-300" size={20} />
                                <h3 className="text-purple-300 font-semibold font-mono">DEPLOYMENT_STACK</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    Docker Containers
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    AWS/Vercel/Netlify
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    CI/CD Pipelines
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    CDN + Caching
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                    Performance Monitoring
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan-line {
                    0% { transform: translateY(-100vh); }
                    100% { transform: translateY(100vh); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .animate-scan-line {
                    animation: scan-line 4s linear infinite;
                }

                .animate-glitch {
                    animation: glitch 0.3s ease-in-out;
                }

                @keyframes glitch {
                    0%, 100% {
                        filter: hue-rotate(0deg) saturate(100%);
                        transform: translate(0);
                    }
                    20% {
                        filter: hue-rotate(180deg) saturate(200%);
                        transform: translate(-2px, 2px);
                    }
                    40% {
                        filter: hue-rotate(90deg) saturate(150%);
                        transform: translate(2px, -2px);
                    }
                    60% {
                        filter: hue-rotate(270deg) saturate(120%);
                        transform: translate(-1px, -1px);
                    }
                    80% {
                        filter: hue-rotate(45deg) saturate(180%);
                        transform: translate(1px, 1px);
                    }
                }
            `}</style>
        </div>
    );
}