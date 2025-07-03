
// components/shared/PageLayout.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PageLayout({
                                       title,
                                       subtitle,
                                       color = "green",
                                       children,
                                       showBackButton = true
                                   }) {
    return (
        <div className={`min-h-screen bg-gradient-to-br from-${color}-900/20 via-black to-${color}-900/20 p-8`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`text-4xl font-bold text-${color}-400 mb-2`}>{title}</h1>
                        <p className={`text-${color}-300`}>{subtitle}</p>
                    </div>
                    {showBackButton && (
                        <Link
                            to="/"
                            className={`px-4 py-2 border border-${color}-500 text-${color}-400 rounded hover:bg-${color}-500/20 transition-colors flex items-center gap-2`}
                        >
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
}