import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Code, User, Briefcase, Coffee, Heart, Terminal, BookOpen, Settings } from 'lucide-react';

// Clean Technical Background Component
const TechnicalDiagramsBackground = () => {
    return (
        <>
            {/* Clean gradient background */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    background: 'linear-gradient(135deg, #0f0f0f 0%, #2a1f0a 50%, #1a1200 100%)'
                }}
            />

            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '100px 100px'
                }}
            />

            {/* Clean floating elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute opacity-30"
                        style={{
                            left: `${20 + (i * 15)}%`,
                            top: `${10 + (i * 10)}%`,
                            animation: `float ${5 + i}s ease-in-out infinite`,
                            animationDelay: `${i * 0.5}s`
                        }}
                    >
                        {/* Simple geometric shapes representing code blocks */}
                        <div className="w-16 h-12 border border-yellow-500/30 rounded bg-yellow-500/5 backdrop-blur-sm">
                            <div className="p-2 space-y-1">
                                <div className="h-1 bg-yellow-400/40 rounded w-3/4"></div>
                                <div className="h-1 bg-yellow-400/30 rounded w-1/2"></div>
                                <div className="h-1 bg-yellow-400/20 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Subtle scanning line */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute w-full h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"
                    style={{
                        animation: 'scanLine 8s linear infinite',
                        top: '0%'
                    }}
                />
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(-10px) translateX(5px); }
                    66% { transform: translateY(5px) translateX(-5px); }
                }

                @keyframes scanLine {
                    0% { top: -2px; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </>
    );
};

// Mock Link component
const Link = ({ to, children, ...props }) => (
    <a href={to} {...props}>{children}</a>
);

export default function AboutMePage() {
    const [activeSection, setActiveSection] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading documentation
        setTimeout(() => setIsLoading(false), 1500);
    }, []);

    const sections = [
        { id: 'overview', label: 'Overview', icon: <User size={16} /> },
        { id: 'constructor', label: 'Constructor', icon: <Settings size={16} /> },
        { id: 'experience', label: 'Experience', icon: <Briefcase size={16} /> },
        { id: 'skills', label: 'Skills & Methods', icon: <Code size={16} /> },
        { id: 'interests', label: 'Personal Config', icon: <Heart size={16} /> },
        { id: 'contact', label: 'API Endpoints', icon: <Terminal size={16} /> }
    ];

    const documentationContent = {
        overview: {
            title: "Thomas Cornett - Full-Stack Developer",
            version: "Currently Available",
            content: `
Welcome to my corner of the development world! I'm Thomas, a passionate full-stack developer with over 10 years of experience building digital solutions that make a difference.

What drives me is the intersection of creativity and problem-solving that programming offers. Every project is a puzzle waiting to be solved, and I love diving deep into both the technical challenges and the human needs behind every application.

🚀 Quick Overview:
• 10+ years of self-taught development experience
• Specializing in modern web technologies and AI/ML applications
• Based in Holley, New York
• Always learning, always building, always improving

📊 By the Numbers:
• 50+ projects completed across various domains
• 25+ technologies and frameworks mastered
• Countless hours spent debugging (and loving it)
• 1 unwavering commitment to clean, maintainable code

I believe in learning by doing, teaching by sharing, and building solutions that actually solve real problems. Whether it's a complex web application, a machine learning model, or a simple automation script, I approach every project with curiosity and attention to detail.
            `
        },
        constructor: {
            title: "My Origin Story & Values",
            content: `
My journey into development started in 2014, not in a classroom, but out of pure curiosity and necessity. I needed to solve a problem, and code seemed like the answer. That first "Hello, World!" moment sparked something that has driven me for over a decade.

🎯 Core Values & Philosophy:
I believe that great software comes from understanding both the technology and the people who use it. My approach is built on:

• Continuous Learning: Technology evolves rapidly, and so do I. I'm constantly exploring new frameworks, languages, and methodologies.

• User-Centered Design: The best code in the world means nothing if it doesn't solve real problems for real people.

• Clean, Maintainable Code: Code is read far more often than it's written. I prioritize clarity and maintainability.

• Collaborative Problem-Solving: The best solutions come from diverse perspectives and open communication.

• Teaching & Sharing: Knowledge grows when shared. I believe in contributing back to the community that has taught me so much.

🌱 The Self-Taught Journey:
Being self-taught has given me a unique perspective on learning and problem-solving. I've had to:
• Develop strong research and debugging skills
• Learn to break down complex problems into manageable pieces
• Build resilience through countless late-night debugging sessions
• Cultivate a deep appreciation for documentation and clear communication

This journey has taught me that the most important skill in development isn't knowing every syntax detail—it's knowing how to learn, adapt, and find solutions.
            `
        },
        experience: {
            title: "Professional Experience & Expertise",
            content: `
Over the past decade, I've worn many hats and worked across diverse domains, each experience adding new tools to my toolkit and perspectives to my approach.

💼 Professional Highlights:

Full-Stack Development (2014 - Present)
I've built everything from small business websites to complex enterprise applications. My experience spans:
• Frontend applications with React, Vue, and Angular
• Backend APIs and services with Node.js, Python, and Java
• Database design and optimization across SQL and NoSQL systems
• Cloud deployment and DevOps practices
• Real-time applications with WebSocket and similar technologies

Machine Learning & AI Applications
What started as curiosity about "smart" applications has grown into a significant area of expertise:
• Computer vision projects for quality control and analysis
• Natural language processing for text analysis and generation
• Predictive analytics and recommendation systems
• Model deployment and MLOps practices

🎯 Project Types I've Tackled:
• E-commerce platforms with real-time inventory and analytics
• Data visualization dashboards for business intelligence
• Automated testing and CI/CD pipeline implementations
• Mobile-responsive web applications
• API integrations and microservices architectures

🏆 What I'm Proud Of:
• Successfully mentored junior developers and helped teams adopt new technologies
• Built systems that have processed millions of transactions
• Contributed to open-source projects used by thousands of developers
• Maintained 99.9% uptime on critical business applications
• Led technical architecture decisions that improved performance by 300%

The variety of projects has taught me that while technologies change, the fundamentals of good software engineering remain constant: understand the problem, design thoughtfully, implement carefully, and iterate based on feedback.
            `
        },
        skills: {
            title: "Technical Skills & Expertise",
            content: `
My technical toolkit has grown organically through real-world projects and continuous learning. Here's what I bring to the table:

🎨 Frontend Development:
I love creating user interfaces that are both beautiful and functional:
• Frameworks: React (my go-to), Vue.js, Angular, and exploring Svelte
• Styling: Tailwind CSS, SCSS, CSS-in-JS, responsive design principles
• Build Tools: Vite, Webpack, modern development workflows
• Testing: Jest, Cypress, React Testing Library
• State Management: Redux, Context API, Vuex

⚙️ Backend Development:
Building robust, scalable server-side applications:
• Languages: JavaScript/Node.js (primary), Python, Java, exploring Go
• Frameworks: Express, Django, FastAPI, Spring Boot
• Databases: PostgreSQL, MongoDB, Redis, MySQL
• APIs: REST, GraphQL, WebSocket, real-time communications
• Authentication: JWT, OAuth, session management

🤖 Machine Learning & Data:
Bringing intelligence to applications:
• Frameworks: TensorFlow, PyTorch, Scikit-learn
• Specializations: Computer Vision, NLP, Predictive Analytics
• Tools: Jupyter, OpenCV, Pandas, NumPy
• Deployment: MLflow, model serving, ONNX
• Data Processing: ETL pipelines, data cleaning, feature engineering

☁️ DevOps & Infrastructure:
Making sure applications run smoothly in production:
• Cloud Platforms: AWS, Google Cloud Platform
• Containerization: Docker, Kubernetes, Docker Compose
• CI/CD: GitHub Actions, Jenkins, GitLab CI
• Monitoring: Application performance monitoring, logging
• Infrastructure as Code: Terraform, CloudFormation

🛠️ Development Practices:
• Version Control: Git workflows, branching strategies
• Testing: Unit, integration, and end-to-end testing
• Code Quality: ESLint, Prettier, code reviews
• Agile Methodologies: Scrum, Kanban, collaborative development
• Documentation: Technical writing, API documentation

The key isn't just knowing these technologies—it's understanding when and how to use them effectively to solve real problems.
            `
        },
        interests: {
            title: "Beyond the Code",
            content: `
While I love coding, there's more to me than just technology. Here's what makes me tick outside of development:

🎵 Music & Creativity:
Music has always been a huge part of my life. I play guitar and love discovering new artists across genres. There's something about the creative process in music that parallels software development—both involve building something meaningful from individual components.

📚 Continuous Learning:
I'm an avid reader, especially drawn to:
• Technical books that deepen my understanding of software engineering
• Science fiction that sparks imagination about future possibilities
• Biographies of innovators and creators
• Philosophy and psychology books that help me understand human behavior

🎮 Gaming & Interactive Media:
I appreciate well-designed games, particularly:
• Strategy games that challenge problem-solving skills
• Indie games with innovative mechanics
• Games that push technical boundaries
• Exploring game development as a creative outlet

🌲 Outdoor Activities:
Balancing screen time with nature:
• Hiking and exploring local trails
• Photography, especially landscape and nature
• Camping and disconnecting from technology periodically

🔧 Current Learning Goals:
I'm always working on expanding my knowledge:
• Advanced machine learning architectures and techniques
• WebAssembly and performance optimization
• Distributed systems and microservices patterns
• New programming languages like Rust and Zig
• Game development with modern engines

💭 Working Style & Philosophy:
• I thrive in collaborative environments where ideas can be shared freely
• I prefer direct, solution-oriented communication
• My approach to problems: break them down, research thoroughly, prototype quickly, iterate based on feedback
• I believe the best code is clean, readable, and well-tested
• I learn best through hands-on experimentation and building real projects

🎯 Fun Facts:
• I often have 20+ browser tabs open while researching solutions
• My best debugging happens after the first cup of coffee
• I've built my first web application before fully understanding HTTP (we all start somewhere!)
• I genuinely enjoy explaining complex technical concepts in simple terms
• I keep a collection of interesting code snippets and solutions for future reference

These interests and approaches shape how I work and collaborate. They remind me that behind every application are real people with real needs, and that perspective keeps me grounded in human-centered development.
            `
        },
        contact: {
            title: "Let's Connect",
            content: `
I'm always interested in connecting with fellow developers, potential collaborators, and anyone working on interesting projects. Here's how you can reach me:

📧 Email: tcornett@gmail.com
This is my preferred method for project discussions, job opportunities, and technical questions. I typically respond within 24 hours.

💼 LinkedIn: linkedin.com/in/corneth
Great for professional networking, career discussions, and staying connected with the development community.

🐙 GitHub: github.com/corneth
Check out my code, contribute to my projects, or just see what I've been working on lately. I believe in open source and love collaborating on interesting problems.

🌐 Portfolio: corneth.github.io
My personal website with detailed project case studies, technical blog posts, and the most up-to-date information about my work.

📱 Response Times:
• Email: Usually within 24 hours
• LinkedIn: Within 48 hours
• GitHub: I check regularly and respond to issues/PRs quickly

🤝 What I'm Open To:
• Full-time opportunities with innovative companies
• Freelance projects that present interesting challenges
• Open source collaboration
• Technical mentorship (both giving and receiving)
• Speaking at conferences or meetups
• Technical writing and content creation partnerships

💬 Great Conversation Starters:
• Interesting technical challenges you're facing
• New technologies or frameworks you're excited about
• Project ideas that could benefit from collaboration
• Questions about my experience with specific technologies
• Opportunities to contribute to meaningful projects

🎯 Current Status:
I'm actively looking for new opportunities where I can contribute to meaningful projects and continue growing as a developer. I'm particularly interested in roles that combine full-stack development with machine learning applications.

Whether you're a fellow developer, a potential employer, or someone with an interesting project idea, I'd love to hear from you. The best solutions come from collaboration and diverse perspectives, and I'm always eager to learn from others in the community.

Let's build something amazing together!
            `
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black relative overflow-hidden">
                <TechnicalDiagramsBackground />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="relative mb-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
                            <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border border-yellow-500 opacity-20"></div>
                        </div>
                        <p className="text-yellow-400 font-mono">LOADING_DOCUMENTATION...</p>
                        <div className="mt-4 flex items-center justify-center space-x-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Technical Diagrams Background */}
            <TechnicalDiagramsBackground />

            {/* Documentation Interface */}
            <div className="relative z-10 max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-900/30 border border-yellow-500 rounded-lg backdrop-blur-sm">
                            <BookOpen className="text-yellow-400" size={28} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-yellow-400 mb-2 font-mono">
                                DEVELOPER_DOCUMENTATION
                            </h1>
                            <p className="text-yellow-300 font-mono">
                                {'>'} thomas-cornett.dev/docs/about
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="px-6 py-3 border border-yellow-500 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-all duration-300 flex items-center gap-2 font-mono backdrop-blur-sm"
                    >
                        <ArrowLeft size={16} />
                        RETURN_TO_PORTFOLIO
                    </Link>
                </div>

                {/* Documentation Layout */}
                <div className="flex gap-8">
                    {/* Table of Contents Sidebar */}
                    <div className="w-80 bg-black/60 border border-yellow-500/50 rounded-lg p-6 backdrop-blur-sm h-fit sticky top-8">
                        <h3 className="text-yellow-400 font-mono font-semibold mb-4 flex items-center gap-2">
                            <Terminal size={16} />
                            TABLE_OF_CONTENTS
                        </h3>
                        <nav className="space-y-2">
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full text-left px-3 py-2 rounded font-mono text-sm transition-all duration-300 flex items-center gap-2 ${
                                        activeSection === section.id
                                            ? 'bg-yellow-600 text-white border-yellow-400'
                                            : 'text-yellow-300 hover:bg-yellow-800/40 hover:text-yellow-200'
                                    }`}
                                >
                                    {section.icon}
                                    {section.label}
                                </button>
                            ))}
                        </nav>

                        {/* Version Info */}
                        <div className="mt-8 pt-6 border-t border-yellow-500/30">
                            <div className="text-xs text-yellow-400 font-mono space-y-1">
                                <div>Version: v10.0.0</div>
                                <div>Last Updated: {new Date().toLocaleDateString()}</div>
                                <div>Status: ✅ Active</div>
                            </div>
                        </div>
                    </div>

                    {/* Main Documentation Content */}
                    <div className="flex-1 bg-black/60 border border-yellow-500/50 rounded-lg backdrop-blur-sm">
                        {/* Documentation Header */}
                        <div className="border-b border-yellow-500/30 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-yellow-400 font-mono">
                                        {documentationContent[activeSection].title}
                                    </h2>
                                    {documentationContent[activeSection].version && (
                                        <p className="text-yellow-300 font-mono text-sm mt-1">
                                            {documentationContent[activeSection].version}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-yellow-400 font-mono">
                                    <Coffee size={12} />
                                    <span>Last compiled with ☕</span>
                                </div>
                            </div>
                        </div>

                        {/* Documentation Content */}
                        <div className="p-6">
                            <div className="text-yellow-300 leading-relaxed whitespace-pre-wrap overflow-x-auto prose prose-yellow max-w-none">
                                {documentationContent[activeSection].content}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-yellow-500/30 p-6">
                            <div className="flex items-center justify-between text-xs text-yellow-400 font-mono">
                                <div>© 2024 Thomas Cornett - All methods documented</div>
                                <div className="flex items-center gap-4">
                                    <span>Build: Successful ✅</span>
                                    <span>Tests: Passing ✅</span>
                                    <span>Docs: Up to date ✅</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}