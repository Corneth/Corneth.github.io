// components/home/HomePage.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {Mail, FileText, Monitor, Eye, Smartphone, Code} from 'lucide-react';
import MatrixBackground from './MatrixBackground';
import TypewriterText from '../shared/TypewriterText';

export default function HomePage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 2000);
        return () => clearTimeout(timer);
    }, []);

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

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <MatrixBackground />

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="max-w-4xl w-full text-center">
                    {/* Dynamic glow effect */}
                    <div
                        className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"
                        style={{
                            transform: `translate(${(mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth/2 : 400)) * 0.02}px, ${(mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight/2 : 400)) * 0.02}px)`
                        }}
                    />

                    <h1 className="text-6xl md:text-8xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400">
              <TypewriterText text="THOMAS CORNETT" delay={100} />
            </span>
                    </h1>

                    <p className="text-cyan-400 text-xl md:text-2xl font-mono mb-6">
                        <TypewriterText
                            text="< SOFTWARE_DEVELOPER.EXE />"
                            delay={50}
                            startDelay={1500}
                        />
                    </p>

                    <p className="max-w-2xl mx-auto text-gray-400 mb-12">
                        <TypewriterText
                            text="Crafting digital experiences and AI-powered solutions. 10+ years of self-taught programming across web, mobile, and machine learning domains."
                            delay={20}
                            startDelay={3000}
                        />
                    </p>

                    {/* Status indicators */}
                    <div className="flex items-center justify-center gap-4 text-green-400 mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="font-mono text-sm">AI_ACTIVE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            <span className="font-mono text-sm">WEB_READY</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            <span className="font-mono text-sm">MOBILE_SYNC</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <Link
                            to="/contact"
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-md transition-all duration-300 flex items-center gap-2"
                        >
                            <Mail size={18} />
                            Contact Me
                        </Link>
                        <Link
                            to="/about"
                            className="px-8 py-3 bg-green-600 border border-green-600 hover:bg-green-900/30 rounded-md transition-all duration-300 flex items-center gap-2"
                        >
                            <FileText size={18} />
                            About Me
                        </Link>
                    </div>

                    {/* Quick Access Navigation */}
                    {isLoaded && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                // { to: '/web', label: 'WEB_DEV', icon: <Monitor className="w-5 h-5" />, color: 'text-purple-400' },
                                { to: '/general', label: 'GENERAL', icon: <Code className="w-5 h-5" />, color: 'text-orange-400' },
                                { to: '/ai', label: 'AI_LAB', icon: <Eye className="w-5 h-5" />, color: 'text-green-400' },
                                { to: '/mobile', label: 'MOBILE', icon: <Smartphone className="w-5 h-5" />, color: 'text-blue-400' },
                                { to: '/blog', label: 'ARTICLES', icon: <FileText className="w-5 h-5" />, color: 'text-cyan-400' }
                            ].map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="group relative p-4 bg-gray-900/50 border border-gray-700 rounded hover:border-green-500 transition-all hover:bg-gray-800/50 flex flex-col items-center gap-2"
                                >
                                    <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                                        {item.icon}
                                    </div>
                                    <span className={`${item.color} text-xs font-mono`}>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
