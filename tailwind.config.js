// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdf4',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    900: '#14532d'
                }
            },
            animation: {
                'matrix-fall': 'matrix-fall 10s linear infinite',
                'scan-line': 'scan-line 3s linear infinite',
                'glitch': 'glitch 0.3s ease-in-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'glow': 'glow 2s ease-in-out infinite alternate'
            },
            keyframes: {
                'matrix-fall': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(1000px)' }
                },
                'scan-line': {
                    '0%': { transform: 'translateY(-100vh)' },
                    '100%': { transform: 'translateY(100vh)' }
                },
                'glitch': {
                    '0%, 100%': {
                        filter: 'hue-rotate(0deg) saturate(100%)',
                        transform: 'translate(0)'
                    },
                    '20%': {
                        filter: 'hue-rotate(180deg) saturate(200%)',
                        transform: 'translate(-2px, 2px)'
                    },
                    '40%': {
                        filter: 'hue-rotate(90deg) saturate(150%)',
                        transform: 'translate(2px, -2px)'
                    },
                    '60%': {
                        filter: 'hue-rotate(270deg) saturate(120%)',
                        transform: 'translate(-1px, -1px)'
                    },
                    '80%': {
                        filter: 'hue-rotate(45deg) saturate(180%)',
                        transform: 'translate(1px, 1px)'
                    }
                },
                'fade-in': {
                    'from': {
                        opacity: '0',
                        transform: 'translateX(-10px)'
                    },
                    'to': {
                        opacity: '1',
                        transform: 'translateX(0)'
                    }
                },
                'glow': {
                    'from': {
                        boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
                    },
                    'to': {
                        boxShadow: '0 0 30px rgba(34, 197, 94, 0.6)'
                    }
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'circuit': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
                'matrix': 'linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, 0.03) 25%, rgba(0, 255, 0, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.03) 75%, rgba(0, 255, 0, 0.03) 76%, transparent 77%, transparent), linear-gradient(transparent 24%, rgba(0, 255, 0, 0.03) 25%, rgba(0, 255, 0, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.03) 75%, rgba(0, 255, 0, 0.03) 76%, transparent 77%, transparent)'
            },
            backgroundSize: {
                'circuit': '20px 20px',
                'matrix': '20px 20px'
            }
        },
    },
    plugins: [],
    safelist: [
        // Dynamic color classes that might not be detected
        'text-purple-400',
        'text-green-400',
        'text-blue-400',
        'text-cyan-400',
        'text-yellow-400',
        'text-pink-400',
        'text-indigo-400',
        'border-purple-500',
        'border-green-500',
        'border-blue-500',
        'border-cyan-500',
        'border-yellow-500',
        'border-pink-500',
        'border-indigo-500',
        'bg-purple-600',
        'bg-green-600',
        'bg-blue-600',
        'bg-cyan-600',
        'bg-yellow-600',
        'bg-pink-600',
        'bg-indigo-600',
        'hover:bg-purple-500',
        'hover:bg-green-500',
        'hover:bg-blue-500',
        'hover:bg-cyan-500',
        'hover:bg-yellow-500',
        'hover:bg-pink-500',
        'hover:bg-indigo-500',
        'focus:ring-purple-500',
        'focus:ring-green-500',
        'focus:ring-blue-500',
        'focus:ring-cyan-500',
        'focus:ring-yellow-500',
        'focus:ring-pink-500',
        'focus:ring-indigo-500'
    ]
}









