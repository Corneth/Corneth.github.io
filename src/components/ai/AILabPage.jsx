import { useState, useEffect, useRef } from 'react';
// Mock Link component for demo
const Link = ({ to, children, ...props }) => (
    <a href={to} {...props}>{children}</a>
);
import { ArrowLeft, Brain, Eye, Cpu, Zap, Activity } from 'lucide-react';

// Enhanced AI Background Component
const AILabBackground = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const matrixRef = useRef([]);
    const dataStreamRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        const initializeParticles = () => {
            // Floating AI particles with validation
            particlesRef.current = Array.from({ length: 100 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.max(0.5, Math.random() * 3 + 1),
                speedX: Math.max(-1, Math.min(1, (Math.random() - 0.5) * 0.5)),
                speedY: Math.max(-1, Math.min(1, (Math.random() - 0.5) * 0.5)),
                opacity: Math.max(0.1, Math.min(0.8, Math.random() * 0.5 + 0.3)),
                pulse: Math.random() * Math.PI * 2,
                color: Math.random() > 0.7 ? 'cyan' : 'green'
            }));

            // Matrix-style data streams with validation
            const columns = Math.max(1, Math.floor(canvas.width / 20));
            matrixRef.current = Array.from({ length: columns }, (_, i) => ({
                x: i * 20,
                y: Math.random() * canvas.height,
                speed: Math.max(0.5, Math.min(5, Math.random() * 2 + 1)),
                opacity: Math.max(0.1, Math.min(1, Math.random() * 0.8 + 0.2)),
                chars: Array.from({ length: 20 }, () =>
                    Math.random() > 0.5 ? Math.floor(Math.random() * 2) : String.fromCharCode(65 + Math.floor(Math.random() * 26))
                )
            }));

            // Data connection streams with validation
            dataStreamRef.current = Array.from({ length: 15 }, () => ({
                startX: Math.random() * canvas.width,
                startY: Math.random() * canvas.height,
                endX: Math.random() * canvas.width,
                endY: Math.random() * canvas.height,
                progress: 0,
                speed: Math.max(0.005, Math.min(0.05, Math.random() * 0.02 + 0.01)),
                opacity: Math.max(0.1, Math.min(0.8, Math.random() * 0.6 + 0.2)),
                particles: []
            }));
        };

        initializeParticles();

        const animate = (time = 0) => {
            // Validate time parameter
            if (!isFinite(time) || time < 0) {
                time = Date.now() * 0.001; // Fallback to current time
            }

            // Ensure canvas dimensions are valid
            if (canvas.width <= 0 || canvas.height <= 0) {
                animationId = requestAnimationFrame(animate);
                return;
            }

            // Clear canvas with trailing effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Animate floating particles
            particlesRef.current.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.pulse += 0.02;

                // Wrap around screen
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Draw particle with pulsing effect
                const pulseSize = Math.max(0.5, particle.size + Math.sin(particle.pulse) * 0.5);
                const color = particle.color === 'green' ? '34, 197, 94' : '6, 182, 212';

                // Validate opacity and size values
                const validOpacity = Math.max(0, Math.min(1, particle.opacity || 0.5));
                const validSize = Math.max(0.1, Math.min(10, pulseSize));

                if (isFinite(validOpacity) && isFinite(validSize) && validSize > 0) {
                    ctx.fillStyle = `rgba(${color}, ${validOpacity})`;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, validSize, 0, Math.PI * 2);
                    ctx.fill();

                    // Add glow effect with validation
                    const glowColor = particle.color === 'green' ? '#22c55e' : '#06b6d4';
                    ctx.shadowColor = glowColor;
                    ctx.shadowBlur = Math.max(0, Math.min(20, 10));
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            // Animate matrix streams
            matrixRef.current.forEach(stream => {
                stream.y += stream.speed;
                if (stream.y > canvas.height + 100) {
                    stream.y = -100;
                    stream.speed = Math.random() * 2 + 1;
                }

                // Draw characters
                stream.chars.forEach((char, index) => {
                    const y = stream.y + index * 20;
                    if (y > -20 && y < canvas.height + 20) {
                        const alpha = Math.max(0, stream.opacity - (index * 0.05));
                        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
                        ctx.font = '14px monospace';
                        ctx.fillText(char, stream.x, y);
                    }
                });
            });

            // Animate data connection streams
            dataStreamRef.current.forEach(stream => {
                stream.progress += stream.speed;

                if (stream.progress >= 1) {
                    // Reset stream
                    stream.startX = Math.random() * canvas.width;
                    stream.startY = Math.random() * canvas.height;
                    stream.endX = Math.random() * canvas.width;
                    stream.endY = Math.random() * canvas.height;
                    stream.progress = 0;
                    stream.particles = [];
                }

                // Calculate current position
                const currentX = stream.startX + (stream.endX - stream.startX) * stream.progress;
                const currentY = stream.startY + (stream.endY - stream.startY) * stream.progress;

                // Add particle to trail
                stream.particles.push({ x: currentX, y: currentY, life: 1 });

                // Remove old particles
                stream.particles = stream.particles.filter(p => {
                    p.life -= 0.02;
                    return p.life > 0;
                });

                // Draw particle trail with validation
                stream.particles.forEach((particle, index) => {
                    const alpha = Math.max(0, Math.min(1, particle.life * stream.opacity));
                    const size = Math.max(0.1, Math.min(5, particle.life * 2));

                    if (isFinite(alpha) && isFinite(size) && alpha > 0 && size > 0 &&
                        isFinite(particle.x) && isFinite(particle.y)) {
                        ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
            });

            // Draw scanning lines with validation
            if (canvas.height > 0 && canvas.width > 0 && isFinite(time)) {
                const scanY = (time * 0.1) % canvas.height;
                if (isFinite(scanY) && scanY >= 0 && scanY <= canvas.height) {
                    try {
                        const gradient = ctx.createLinearGradient(0, Math.max(0, scanY - 50), 0, Math.min(canvas.height, scanY + 50));
                        gradient.addColorStop(0, 'rgba(34, 197, 94, 0)');
                        gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.3)');
                        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, Math.max(0, scanY - 50), canvas.width, Math.min(100, canvas.height - Math.max(0, scanY - 50)));
                    } catch (e) {
                        // Skip scanning line if gradient creation fails
                        console.warn('Gradient creation failed:', e);
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ background: 'linear-gradient(135deg, #000000 0%, #001a00 50%, #000000 100%)' }}
            />

            {/* Additional overlay effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-cyan-900/10" />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Floating data elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-green-400 font-mono text-xs opacity-30 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }}
                    >
                        {Math.random() > 0.5 ? '01011001' : 'AI_PROC'}
                    </div>
                ))}
            </div>

            {/* Cyber hexagons */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute border border-green-500/20 transform rotate-45"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${30 + Math.random() * 40}px`,
                            height: `${30 + Math.random() * 40}px`,
                            animation: `spin ${10 + Math.random() * 20}s linear infinite`,
                            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                        }}
                    />
                ))}
            </div>
        </>
    );
};

// Mock project card for demonstration
const ProjectCard = ({ project, color }) => (
    <div className="bg-black/60 border border-green-500/50 rounded-lg p-6 backdrop-blur-sm hover:border-green-400 transition-all group">
        <h3 className="text-green-400 font-mono text-lg mb-2">{project.title}</h3>
        <p className="text-gray-300 text-sm mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded font-mono border border-green-700">
                    {tech}
                </span>
            ))}
        </div>
    </div>
);

// Mock hook for demonstration
const useGithubProjects = () => ({
    loading: false,
    error: null,
    getProjectsByCategory: () => [
        {
            id: 1,
            title: "Neural_Vision_System",
            description: "Computer vision system for real-time object detection and classification using deep learning",
            techStack: ["TensorFlow", "OpenCV", "Python", "CUDA"]
        },
        {
            id: 2,
            title: "Language_Processing_AI",
            description: "Natural language processing pipeline with sentiment analysis and text generation",
            techStack: ["PyTorch", "BERT", "Transformers", "spaCy"]
        },
        {
            id: 3,
            title: "Predictive_Analytics_Engine",
            description: "Machine learning pipeline for predictive analytics and data forecasting",
            techStack: ["Scikit-learn", "Pandas", "NumPy", "Jupyter"]
        }
    ]
});

export default function AILabPage() {
    const { loading, error, getProjectsByCategory } = useGithubProjects('corneth');
    const [selectedDomain, setSelectedDomain] = useState('all');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const aiProjects = getProjectsByCategory('machine-learning');

    const filteredProjects = selectedDomain === 'all'
        ? aiProjects
        : aiProjects.filter(project =>
            project.description.toLowerCase().includes(selectedDomain.toLowerCase()) ||
            project.techStack.some(tech => tech.toLowerCase().includes(selectedDomain.toLowerCase()))
        );

    const domainFilters = [
        { value: 'all', label: 'All Systems' },
        { value: 'vision', label: 'Computer Vision' },
        { value: 'nlp', label: 'Neural Language' },
        { value: 'tensorflow', label: 'TensorFlow' },
        { value: 'pytorch', label: 'PyTorch' }
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

    if (loading) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden">
                <AILabBackground />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                            <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border border-green-500 opacity-20"></div>
                        </div>
                        <p className="text-green-400 mt-4 font-mono">INITIALIZING_NEURAL_NETWORKS...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden">
                <AILabBackground />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="bg-red-900/20 border border-red-800 text-red-400 p-6 rounded-xl text-center max-w-md backdrop-blur-sm">
                        <Brain className="mx-auto mb-4" size={48} />
                        <p className="font-mono mb-4">NEURAL_NETWORK_ERROR: {error}</p>
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
            {/* Enhanced AI Background */}
            <AILabBackground />

            {/* Interactive neural glow following mouse */}
            <div
                className="absolute w-40 h-40 pointer-events-none z-20"
                style={{
                    left: mousePosition.x - 80,
                    top: mousePosition.y - 80,
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transition: 'left 0.1s ease-out, top 0.1s ease-out',
                    filter: 'blur(20px)'
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-900/30 border border-green-500 rounded-lg relative backdrop-blur-sm">
                                <Brain className="text-green-400" size={28} />
                                <div className="absolute inset-0 bg-green-500/20 rounded-lg animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-green-400 mb-2 font-mono">
                                    AI_RESEARCH_LAB.EXE
                                </h1>
                                <p className="text-green-300 font-mono">
                                    {'>'} NEURAL_NETWORKS &amp; MACHINE_INTELLIGENCE_SYSTEMS
                                </p>
                            </div>
                        </div>

                        {/* Neural activity indicators */}
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Activity className="text-green-400" size={16} />
                                <span className="text-green-300 font-mono">NEURAL_ACTIVITY: OPTIMAL</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="text-cyan-400" size={16} />
                                <span className="text-green-300 font-mono">VISION_SYSTEMS: ONLINE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Cpu className="text-blue-400" size={16} />
                                <span className="text-green-300 font-mono">PROCESSING_CORES: 100%</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="px-6 py-3 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/20 transition-all duration-300 flex items-center gap-2 font-mono backdrop-blur-sm"
                    >
                        <ArrowLeft size={16} />
                        EXIT_NEURAL_LAB
                    </Link>
                </div>

                {/* AI Domain Filter */}
                <div className="mb-8 p-6 bg-black/60 border border-green-500/50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap className="text-green-400" size={20} />
                        <h3 className="text-green-400 font-mono font-semibold">AI_DOMAIN_SELECTION:</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {domainFilters.map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setSelectedDomain(filter.value)}
                                className={`px-4 py-2 rounded font-mono text-sm transition-all duration-300 border ${
                                    selectedDomain === filter.value
                                        ? 'bg-green-600 text-white border-green-400 shadow-lg shadow-green-500/20'
                                        : 'bg-green-900/30 text-green-300 border-green-700 hover:bg-green-800/40 hover:border-green-500'
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
                            color="green"
                        />
                    ))}
                </div>

                {/* Research Areas */}
                <div className="bg-black/60 border border-green-500/50 rounded-lg p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <Brain className="text-green-400" size={24} />
                        <h2 className="text-2xl font-bold text-green-400 font-mono">RESEARCH_DOMAINS &amp; NEURAL_EXPERTISE</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 hover:border-green-500 transition-all group backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="text-green-300 group-hover:text-green-200" size={20} />
                                <h3 className="text-green-300 font-semibold font-mono">COMPUTER_VISION</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    Object Detection &amp; Recognition
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    Image Classification Networks
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    Food Freshness Analysis
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    Real-time Processing Systems
                                </li>
                            </ul>
                        </div>

                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 hover:border-green-500 transition-all group backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Activity className="text-green-300 group-hover:text-green-200" size={20} />
                                <h3 className="text-green-300 font-semibold font-mono">NATURAL_LANGUAGE</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    Text-to-Speech Synthesis
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    Sentiment Analysis Networks
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    Language Understanding
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    Voice Processing Algorithms
                                </li>
                            </ul>
                        </div>

                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 hover:border-green-500 transition-all group backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Cpu className="text-green-300 group-hover:text-green-200" size={20} />
                                <h3 className="text-green-300 font-semibold font-mono">NEURAL_FRAMEWORKS</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    TensorFlow &amp; Keras
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    PyTorch Neural Networks
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    OpenCV Vision Libraries
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    Scikit-learn ML Pipeline
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}