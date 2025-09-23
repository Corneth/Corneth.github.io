// App.jsx - Main Router Component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './components/home/HomePage';
import WebDevPage from './components/web/WebDevPage';
import AILabPage from './components/ai/AILabPage';
import MobilePage from './components/mobile/MobilePage';
import BlogPage from './components/blog/BlogPage';
import AboutPage from './components/about/AboutPage';
import ContactPage from './components/contact/ContactPage';
import ProjectsPage from './components/projects/ProjectsPage';
import Terminal from './components/shared/Terminal';
import './App.css';
import ProgrammingPage from "./components/programming/ProgrammingPage";

function App() {
    const [showTerminal, setShowTerminal] = useState(false);

    return (
        <Router>
            <div className="App">

                {/*/!* Global Terminal Overlay *!/*/}
                {/*{showTerminal && (*/}
                {/*    <Terminal*/}
                {/*        onClose={() => setShowTerminal(false)}*/}
                {/*        isOverlay={true}*/}
                {/*    />*/}
                {/*)}*/}

                {/*/!* Terminal Toggle Button (Available on all pages) *!/*/}
                {/*<button*/}
                {/*    onClick={() => setShowTerminal(true)}*/}
                {/*    className="fixed top-4 right-4 z-40 p-3 bg-green-600/80 hover:bg-green-600 rounded-lg transition-all duration-300 backdrop-blur-sm border border-green-500"*/}
                {/*    title="Open Neural Terminal"*/}
                {/*>*/}
                {/*    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />*/}
                {/*    </svg>*/}
                {/*</button>*/}

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/general" element={<ProgrammingPage />} />
                    {/*<Route path="/web" element={<WebDevPage />} />*/}
                    <Route path="/ai" element={<AILabPage />} />
                    <Route path="/mobile" element={<MobilePage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    {/*<Route path="/about" element={<AboutPage />} />*/}
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;




