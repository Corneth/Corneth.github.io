// components/mobile/MobilePage.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Smartphone, Wifi, Battery, Signal, Zap, Radio, Cpu } from 'lucide-react';
import ProjectCard from '../shared/ProjectCard';
import useGithubProjects from '../../hooks/useGithubProjects';

export default function MobilePage() {
    const { loading, error, getProjectsByCategory } = useGithubProjects('corneth');
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);

    const mobileProjects = getProjectsByCategory('mobile-development');

    const filteredProjects = selectedPlatform === 'all'
        ? mobileProjects
        : mobileProjects.filter(project =>
            project.techStack.some(tech =>
                tech.toLowerCase().includes(selectedPlatform.toLowerCase())
            )
        );

    const platformFilters = [
        { value: 'all', label: 'All Devices' },
        { value: 'react-native', label: 'React Native' },
        { value: 'flutter', label: 'Flutter' },
        { value: 'ios', label: 'iOS Native' },
        { value: 'android', label: 'Android Native' }
    ];

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

    // Mobile UI/Signal wave visualization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let animationId;
        const devices = [];
        const signalTowers = [];
        const uiElements = [];

        // Create mobile devices with screens - positioned safely within canvas bounds
        for (let i = 0; i < 6; i++) {
            const safeMargin = 100;
            devices.push({
                x: safeMargin + (i % 3) * ((canvas.width - safeMargin * 2) / 3),
                y: safeMargin * 2 + Math.floor(i / 3) * ((canvas.height - safeMargin * 4) / 2),
                width: Math.min(60, canvas.width * 0.04),
                height: Math.min(100, canvas.height * 0.08),
                screenGlow: Math.random() * Math.PI * 2,
                batteryLevel: Math.random(),
                signalStrength: Math.random(),
                appIcons: generateAppIcons()
            });
        }

        // Create signal towers - positioned within safe bounds
        for (let i = 0; i < 3; i++) {
            signalTowers.push({
                x: canvas.width * 0.25 + i * (canvas.width * 0.25),
                y: canvas.height * 0.15,
                height: 60 + Math.random() * 40,
                pulsePhase: Math.random() * Math.PI * 2,
                signalRadius: 0
            });
        }

        // Create floating UI elements
        for (let i = 0; i < 20; i++) {
            uiElements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                type: ['button', 'icon', 'notification', 'widget'][Math.floor(Math.random() * 4)],
                size: 8 + Math.random() * 12,
                opacity: Math.random() * 0.4 + 0.2
            });
        }

        function generateAppIcons() {
            return ['□', '○', '△', '⬟', '◇', '⚡'].sort(() => Math.random() - 0.5).slice(0, 6);
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw signal towers with propagating waves - with bounds checking
            signalTowers.forEach(tower => {
                tower.pulsePhase += 0.03;
                tower.signalRadius += 2;
                if (tower.signalRadius > 150) tower.signalRadius = 0;

                // Ensure tower is within bounds
                if (tower.x < 10) tower.x = 10;
                if (tower.x > canvas.width - 10) tower.x = canvas.width - 10;

                // Draw tower
                ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
                ctx.fillRect(tower.x - 3, tower.y, 6, tower.height);

                // Draw antenna
                ctx.fillRect(tower.x - 1, Math.max(0, tower.y - 10), 2, 10);

                // Draw signal waves - limited radius to prevent overflow
                for (let r = 20; r < Math.min(tower.signalRadius, 120); r += 25) {
                    const alpha = 0.5 * (1 - r / 120);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(tower.x, tower.y, r, Math.PI, 0);
                    ctx.stroke();
                }
            });

            // Draw mobile devices with screens - with bounds checking
            devices.forEach(device => {
                device.screenGlow += 0.05;

                // Ensure device stays within canvas bounds
                if (device.x + device.width > canvas.width) {
                    device.x = canvas.width - device.width - 10;
                }
                if (device.y + device.height > canvas.height) {
                    device.y = canvas.height - device.height - 10;
                }

                // Device body
                ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
                ctx.fillRect(device.x, device.y, device.width, device.height);

                // Screen with glow effect
                const glowIntensity = (Math.sin(device.screenGlow) + 1) * 0.5;
                ctx.fillStyle = `rgba(100, 180, 255, ${0.3 + glowIntensity * 0.4})`;
                const screenMargin = Math.min(5, device.width * 0.1);
                ctx.fillRect(
                    device.x + screenMargin,
                    device.y + screenMargin * 2,
                    device.width - screenMargin * 2,
                    device.height - screenMargin * 3
                );

                // App icons on screen - scaled to device size
                ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
                const iconSize = Math.max(6, device.width * 0.15);
                ctx.font = `${iconSize}px monospace`;
                device.appIcons.forEach((icon, index) => {
                    if (index < 6) { // Limit to 6 icons to prevent overflow
                        const row = Math.floor(index / 3);
                        const col = index % 3;
                        const iconSpacing = device.width / 4;
                        ctx.fillText(
                            icon,
                            device.x + screenMargin * 2 + col * iconSpacing,
                            device.y + screenMargin * 4 + row * iconSpacing
                        );
                    }
                });

                // Battery indicator - scaled and positioned safely
                const batteryWidth = Math.min(20, device.width * 0.3);
                const batteryHeight = Math.min(6, device.height * 0.06);
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
                ctx.lineWidth = 1;
                ctx.strokeRect(
                    device.x + device.width - batteryWidth - 5,
                    device.y + 2,
                    batteryWidth,
                    batteryHeight
                );

                ctx.fillStyle = device.batteryLevel > 0.3 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
                ctx.fillRect(
                    device.x + device.width - batteryWidth - 4,
                    device.y + 3,
                    (batteryWidth - 2) * device.batteryLevel,
                    batteryHeight - 2
                );

                // Signal strength bars - scaled to device
                const barSpacing = Math.max(2, device.width * 0.05);
                for (let i = 0; i < 4; i++) {
                    const barHeight = 3 + i * 2;
                    const alpha = i < (device.signalStrength * 4) ? 0.8 : 0.2;
                    ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
                    ctx.fillRect(
                        device.x + 5 + i * barSpacing,
                        device.y + 10 - barHeight,
                        Math.max(1, barSpacing - 1),
                        barHeight
                    );
                }
            });

            // Draw floating UI elements
            uiElements.forEach(element => {
                element.x += element.vx;
                element.y += element.vy;

                // Wrap around screen
                if (element.x < 0) element.x = canvas.width;
                if (element.x > canvas.width) element.x = 0;
                if (element.y < 0) element.y = canvas.height;
                if (element.y > canvas.height) element.y = 0;

                ctx.fillStyle = `rgba(59, 130, 246, ${element.opacity})`;

                switch (element.type) {
                    case 'button':
                        ctx.fillRect(element.x, element.y, element.size, element.size / 2);
                        break;
                    case 'icon':
                        ctx.beginPath();
                        ctx.arc(element.x, element.y, element.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 'notification':
                        ctx.fillRect(element.x, element.y, element.size * 1.5, element.size / 3);
                        break;
                    case 'widget':
                        ctx.strokeStyle = `rgba(59, 130, 246, ${element.opacity})`;
                        ctx.lineWidth = 1;
                        ctx.strokeRect(element.x, element.y, element.size, element.size);
                        break;
                }
            });

            // Draw data connections between devices
            devices.forEach((device, i) => {
                if (i < devices.length - 1 && Math.random() < 0.1) {
                    const nextDevice = devices[i + 1];
                    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([5, 5]);
                    ctx.beginPath();
                    ctx.moveTo(device.x + device.width/2, device.y + device.height/2);
                    ctx.lineTo(nextDevice.x + nextDevice.width/2, nextDevice.y + nextDevice.height/2);
                    ctx.stroke();
                    ctx.setLineDash([]);
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
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border border-blue-500 opacity-20"></div>
                        </div>
                        <p className="text-blue-400 mt-4 font-mono">CONNECTING_DEVICES...</p>
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
                        <Smartphone className="mx-auto mb-4" size={48} />
                        <p className="font-mono mb-4">CONNECTION_FAILED: {error}</p>
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
            {/* Mobile UI/Signal Canvas Background */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* UI particles */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-blue-400 opacity-40 font-mono text-xs"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        {['📱', '⚡', '📶', '🔋', '📡', '💬'][Math.floor(Math.random() * 6)]}
                    </div>
                ))}
            </div>

            {/* Network pulse lines */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
                <div className="w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse"
                     style={{ left: '25%', height: '100%' }} />
                <div className="w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse"
                     style={{ left: '50%', height: '100%', animationDelay: '0.5s' }} />
                <div className="w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse"
                     style={{ left: '75%', height: '100%', animationDelay: '1s' }} />
            </div>

            {/* Interactive signal glow */}
            <div
                className="absolute w-32 h-32 pointer-events-none z-20"
                style={{
                    left: mousePosition.x - 64,
                    top: mousePosition.y - 64,
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transition: 'left 0.1s ease-out, top 0.1s ease-out'
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-900/30 border border-blue-500 rounded-lg relative">
                                <Smartphone className="text-blue-400" size={28} />
                                <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-blue-400 mb-2 font-mono">
                                    MOBILE_DEVELOPMENT.EXE
                                </h1>
                                <p className="text-blue-300 font-mono">
                                    {'>'} CROSS_PLATFORM &amp; NATIVE_MOBILE_EXPERIENCES
                                </p>
                            </div>
                        </div>

                        {/* Device status indicators */}
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Signal className="text-blue-400" size={16} />
                                <span className="text-blue-300 font-mono">SIGNAL: 5G_READY</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Radio className="text-cyan-400" size={16} />
                                <span className="text-blue-300 font-mono">NETWORK: CONNECTED</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Battery className="text-green-400" size={16} />
                                <span className="text-blue-300 font-mono">POWER: OPTIMAL</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="px-6 py-3 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all duration-300 flex items-center gap-2 font-mono backdrop-blur-sm"
                    >
                        <ArrowLeft size={16} />
                        DISCONNECT_DEVICES
                    </Link>
                </div>

                {/* Platform Filter */}
                <div className="mb-8 p-6 bg-black/60 border border-blue-500/50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap className="text-blue-400" size={20} />
                        <h3 className="text-blue-400 font-mono font-semibold">PLATFORM_SELECTION:</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {platformFilters.map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setSelectedPlatform(filter.value)}
                                className={`px-4 py-2 rounded font-mono text-sm transition-all duration-300 border ${
                                    selectedPlatform === filter.value
                                        ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                                        : 'bg-blue-900/30 text-blue-300 border-blue-700 hover:bg-blue-800/40 hover:border-blue-500'
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
                            color="blue"
                        />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-16 bg-blue-900/20 rounded-2xl border border-blue-800 backdrop-blur-sm">
                        <Smartphone className="mx-auto mb-4 text-blue-400" size={48} />
                        <p className="text-gray-400 mb-4 font-mono">NO_MOBILE_PROJECTS_FOR_PLATFORM</p>
                        <button
                            onClick={() => setSelectedPlatform('all')}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-mono"
                        >
                            SHOW_ALL_DEVICES
                        </button>
                    </div>
                )}

                {/* Mobile Development Stack */}
                <div className="bg-black/60 border border-blue-500/50 rounded-lg p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <Smartphone className="text-blue-400" size={24} />
                        <h2 className="text-2xl font-bold text-blue-400 font-mono">MOBILE_DEVELOPMENT_ECOSYSTEM</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 hover:border-blue-500 transition-all group">
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className="text-blue-300 group-hover:text-blue-200" size={20} />
                                <h3 className="text-blue-300 font-semibold font-mono">CROSS_PLATFORM</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    React Native + Expo
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    Flutter + Dart SDK
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    Code Push Updates
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    Universal Components
                                </li>
                            </ul>
                        </div>

                        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 hover:border-blue-500 transition-all group">
                            <div className="flex items-center gap-3 mb-4">
                                <Cpu className="text-blue-300 group-hover:text-blue-200" size={20} />
                                <h3 className="text-blue-300 font-semibold font-mono">NATIVE_DEVELOPMENT</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    Swift + SwiftUI (iOS)
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    Kotlin + Jetpack (Android)
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    Native Module Bridge
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    Platform-specific APIs
                                </li>
                            </ul>
                        </div>

                        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6 hover:border-blue-500 transition-all group">
                            <div className="flex items-center gap-3 mb-4">
                                <Wifi className="text-blue-300 group-hover:text-blue-200" size={20} />
                                <h3 className="text-blue-300 font-semibold font-mono">BACKEND_SERVICES</h3>
                            </div>
                            <ul className="space-y-3 text-gray-300 font-mono text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    Firebase Suite
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    Push Notifications
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    App Store Connect
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                    Analytics & Crashlytics
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
      `}</style>
        </div>
    );
}