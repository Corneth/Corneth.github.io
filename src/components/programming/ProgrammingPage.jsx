// components/programming/ProgrammingPage.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Cpu, GitBranch, Zap, Terminal, Binary, Database } from 'lucide-react';
import ProjectCard from '../shared/ProjectCard';
import useGithubProjects from '../../hooks/useGithubProjects';

export default function ProgrammingPage() {
    const { loading, error, getProjectsByCategory, projects } = useGithubProjects('corneth');
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);

    // Get projects that don't fit into the main categories (web-dev, ML, mobile)
    // These would be your academic and general programming projects
    // Filter out DSC projects (data science bootcamp projects)
    const programmingProjects = [
        ...getProjectsByCategory('other'),
        ...getProjectsByCategory('labs'),
        ...getProjectsByCategory('game-development')
    ].filter(project => {
        return project &&
            !project.title.toLowerCase().startsWith('dsc') &&
            !project.title.toLowerCase().includes('dsc-')
    });

    const filteredProjects = selectedLanguage === 'all'
        ? programmingProjects
        : programmingProjects.filter(project =>
            project.techStack.some(tech =>
                tech.toLowerCase().includes(selectedLanguage.toLowerCase())
            )
        );

    // Generate dynamic language filters based on actual project tech stacks
    const getAllTechFromProjects = () => {
        const allTech = new Set();
        programmingProjects.forEach(project => {
            if (project.techStack) {
                project.techStack.forEach(tech => allTech.add(tech));
            }
        });
        return Array.from(allTech);
    };

    const availableTech = getAllTechFromProjects();

    const languageFilters = [
        { value: 'all', label: 'All Projects' },
        // Add common languages that might be in your projects
        ...(availableTech.includes('C++') ? [{ value: 'c++', label: 'C++' }] : []),
        ...(availableTech.includes('JavaScript') ? [{ value: 'javascript', label: 'JavaScript' }] : []),
        ...(availableTech.includes('Python') ? [{ value: 'python', label: 'Python' }] : []),
        ...(availableTech.some(tech => tech.toLowerCase().includes('algorithm')) ? [{ value: 'algorithms', label: 'Algorithms' }] : []),
        // Add first 3 other unique technologies found
        ...availableTech
            .filter(tech => !['C++', 'JavaScript', 'Python'].includes(tech) && !tech.toLowerCase().includes('algorithm'))
            .slice(0, 3)
            .map(tech => ({ value: tech.toLowerCase(), label: tech }))
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

    // Algorithm visualization background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let animationId;
        const binaryStreams = [];
        const sortingBars = [];
        const dataNodes = [];
        const connections = [];

        // Create binary data streams
        for (let i = 0; i < 20; i++) {
            binaryStreams.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                speed: 0.5 + Math.random() * 2,
                opacity: Math.random() * 0.4 + 0.3,
                binary: generateBinaryString()
            });
        }

        // Create sorting visualization bars
        for (let i = 0; i < 40; i++) {
            sortingBars.push({
                x: i * (canvas.width / 40),
                height: Math.random() * 100 + 20,
                targetHeight: Math.random() * 100 + 20,
                sortPhase: Math.random() * Math.PI * 2,
                isActive: false
            });
        }

        // Create data structure nodes
        for (let i = 0; i < 15; i++) {
            dataNodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 8 + Math.random() * 12,
                pulse: Math.random() * Math.PI * 2,
                value: Math.floor(Math.random() * 100),
                connections: []
            });
        }

        // Create connections between nodes
        dataNodes.forEach((node, index) => {
            const connectionCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < connectionCount; i++) {
                const targetIndex = Math.floor(Math.random() * dataNodes.length);
                if (targetIndex !== index) {
                    connections.push({
                        from: index,
                        to: targetIndex,
                        strength: Math.random(),
                        dataFlow: 0
                    });
                }
            }
        });

        function generateBinaryString() {
            return Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join('');
        }

        const draw = () => {
            // Clear with fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw binary streams
            ctx.font = '12px monospace';
            binaryStreams.forEach(stream => {
                stream.y += stream.speed;

                if (stream.y > canvas.height + 50) {
                    stream.y = -50;
                    stream.x = Math.random() * canvas.width;
                    stream.binary = generateBinaryString();
                }

                ctx.fillStyle = `rgba(255, 165, 0, ${stream.opacity})`;
                ctx.fillText(stream.binary, stream.x, stream.y);

                // Add trailing effect
                for (let i = 1; i <= 3; i++) {
                    const alpha = stream.opacity * (1 - i * 0.3);
                    ctx.fillStyle = `rgba(255, 165, 0, ${alpha})`;
                    ctx.fillText('...', stream.x, stream.y + (i * 15));
                }
            });

            // Draw sorting algorithm visualization
            sortingBars.forEach((bar, index) => {
                bar.sortPhase += 0.02;

                // Animate height changes (simulating sorting)
                const heightDiff = bar.targetHeight - bar.height;
                bar.height += heightDiff * 0.05;

                if (Math.random() < 0.002) {
                    bar.targetHeight = Math.random() * 100 + 20;
                    bar.isActive = true;
                    setTimeout(() => bar.isActive = false, 1000);
                }

                // Draw bar
                const intensity = bar.isActive ? 1 : 0.6;
                ctx.fillStyle = `rgba(255, 165, 0, ${intensity * 0.7})`;

                if (bar.x + 15 <= canvas.width && bar.height <= canvas.height) {
                    ctx.fillRect(bar.x, canvas.height - bar.height - 50, 15, bar.height);
                }

                // Add active indicator
                if (bar.isActive) {
                    ctx.fillStyle = 'rgba(255, 200, 100, 0.8)';
                    ctx.fillRect(bar.x, canvas.height - bar.height - 60, 15, 5);
                }
            });

            // Draw data structure connections
            connections.forEach((connection, index) => {
                const fromNode = dataNodes[connection.from];
                const toNode = dataNodes[connection.to];

                if (!fromNode || !toNode) return;

                connection.dataFlow += 0.02;
                if (connection.dataFlow > 1) connection.dataFlow = 0;

                // Draw connection line
                ctx.strokeStyle = `rgba(255, 165, 0, ${connection.strength * 0.4})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);
                ctx.lineTo(toNode.x, toNode.y);
                ctx.stroke();

                // Draw data packet moving along connection
                const packetX = fromNode.x + (toNode.x - fromNode.x) * connection.dataFlow;
                const packetY = fromNode.y + (toNode.y - fromNode.y) * connection.dataFlow;

                ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
                ctx.beginPath();
                ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw data structure nodes
            dataNodes.forEach(node => {
                node.pulse += 0.03;

                // Ensure node stays within bounds
                if (node.x < 0) node.x = 0;
                if (node.x > canvas.width) node.x = canvas.width;
                if (node.y < 0) node.y = 0;
                if (node.y > canvas.height) node.y = canvas.height;

                const pulseSize = node.radius + Math.sin(node.pulse) * 2;

                // Draw node
                ctx.fillStyle = 'rgba(255, 165, 0, 0.6)';
                ctx.beginPath();
                ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
                ctx.fill();

                // Draw node value
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(node.value.toString(), node.x, node.y + 3);
                ctx.textAlign = 'left';
            });

            // Draw algorithm execution indicators
            if (Math.random() < 0.1) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;

                ctx.fillStyle = 'rgba(255, 165, 0, 0.3)';
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
                ctx.lineWidth = 2;
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
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                            <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border border-orange-500 opacity-20"></div>
                        </div>
                        <p className="text-orange-400 mt-4 font-mono">COMPILING_ALGORITHMS...</p>
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
                    <div className="bg-red-900/20 border border-red-800 text-red-400 p-6 rounded-xl text-center max-w-md backdrop-blur-sm">
                        <Terminal className="mx-auto mb-4" size={48} />
                        <p className="font-mono mb-4">COMPILATION_ERROR: {error}</p>
                        <Link
                            to="/"
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors inline-block"
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
            {/* Algorithm Visualization Canvas Background */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Floating programming symbols */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 18 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-orange-400 opacity-30 font-mono text-sm"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        {['int', 'void', 'class', 'struct', '++', '--', '&&', '||', 'null', 'true'][Math.floor(Math.random() * 10)]}
                    </div>
                ))}
            </div>

            {/* Algorithm execution lines */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
                <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse"
                     style={{ top: '20%', width: '100%' }} />
                <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse"
                     style={{ top: '60%', width: '100%', animationDelay: '1s' }} />
                <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse"
                     style={{ top: '80%', width: '100%', animationDelay: '2s' }} />
            </div>

            {/* Interactive algorithm glow */}
            <div
                className="absolute w-36 h-36 pointer-events-none z-20"
                style={{
                    left: mousePosition.x - 72,
                    top: mousePosition.y - 72,
                    background: 'radial-gradient(circle, rgba(255, 165, 0, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transition: 'left 0.1s ease-out, top 0.1s ease-out'
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-orange-900/30 border border-orange-500 rounded-lg relative backdrop-blur-sm">
                                <Code className="text-orange-400" size={28} />
                                <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-orange-400 mb-2 font-mono">
                                    CORE_PROGRAMMING.EXE
                                </h1>
                                <p className="text-orange-300 font-mono">
                                    {'>'} ALGORITHMS &amp; DATA_STRUCTURES &amp; SYSTEMS_PROGRAMMING
                                </p>
                            </div>
                        </div>

                        {/* System status indicators */}
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Cpu className="text-orange-400" size={16} />
                                <span className="text-orange-300 font-mono">COMPILER: READY</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Binary className="text-yellow-400" size={16} />
                                <span className="text-orange-300 font-mono">ALGORITHMS: OPTIMIZED</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <GitBranch className="text-red-400" size={16} />
                                <span className="text-orange-300 font-mono">VERSION_CONTROL: ACTIVE</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="px-6 py-3 border border-orange-500 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-all duration-300 flex items-center gap-2 font-mono backdrop-blur-sm"
                    >
                        <ArrowLeft size={16} />
                        HALT_EXECUTION
                    </Link>
                </div>

                {/* Language/Technology Filter */}
                <div className="mb-8 p-6 bg-black/60 border border-orange-500/50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Terminal className="text-orange-400" size={20} />
                        <h3 className="text-orange-400 font-mono font-semibold">LANGUAGE_FILTER:</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {languageFilters.map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setSelectedLanguage(filter.value)}
                                className={`px-4 py-2 rounded font-mono text-sm transition-all duration-300 border ${
                                    selectedLanguage === filter.value
                                        ? 'bg-orange-600 text-white border-orange-400 shadow-lg shadow-orange-500/20'
                                        : 'bg-orange-900/30 text-orange-300 border-orange-700 hover:bg-orange-800/40 hover:border-orange-500'
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
                            color="orange"
                        />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-16 bg-orange-900/20 rounded-2xl border border-orange-800 backdrop-blur-sm">
                        <Code className="mx-auto mb-4 text-orange-400" size={48} />
                        <p className="text-gray-400 mb-4 font-mono">NO_PROGRAMS_FOUND_FOR_LANGUAGE</p>
                        <button
                            onClick={() => setSelectedLanguage('all')}
                            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors font-mono"
                        >
                            RESET_FILTER
                        </button>
                    </div>
                )}

                {/* Computer Science Fundamentals */}
                <div className="bg-black/60 border border-orange-500/50 rounded-lg p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <Cpu className="text-orange-400" size={24} />
                        <h2 className="text-2xl font-bold text-orange-400 font-mono">COMPUTER_SCIENCE_FOUNDATIONS</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-6 hover:border-orange-500 transition-all group backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Binary className="text-orange-300 group-hover:text-orange-200" size={20} />
                                <h3 className="text-orange-300 font-semibold font-mono">ALGORITHMS_&_DATA</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    Sorting &amp; Search Algorithms
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    Trees, Graphs &amp; Hash Tables
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    Dynamic Programming
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    Big O Analysis &amp; Optimization
                                </li>
                            </ul>
                        </div>

                        <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-6 hover:border-orange-500 transition-all group backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Cpu className="text-orange-300 group-hover:text-orange-200" size={20} />
                                <h3 className="text-orange-300 font-semibold font-mono">SYSTEMS_PROGRAMMING</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    C++ &amp; Memory Management
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    Object-Oriented Design
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    Concurrent Programming
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    Performance Optimization
                                </li>
                            </ul>
                        </div>

                        <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-6 hover:border-orange-500 transition-all group backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="text-orange-300 group-hover:text-orange-200" size={20} />
                                <h3 className="text-orange-300 font-semibold font-mono">SOFTWARE_ENGINEERING</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    Design Patterns &amp; Architecture
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    Version Control &amp; Git
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    Testing &amp; Debugging
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                                    Code Quality &amp; Documentation
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(2deg); }
                }
            `}</style>
        </div>
    );
}