
// components/shared/ProjectCard.jsx
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectCard({ project, color = "green" }) {
    return (
        <div className={`bg-gray-900/80 border border-${color}-500/50 rounded-lg overflow-hidden hover:border-${color}-400 transition-all group relative transform hover:scale-105`}>
            <div className="h-48 overflow-hidden">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
            </div>
            <div className="p-4">
                <h3 className={`text-${color}-400 font-semibold mb-2`}>{project.title}</h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                    {project.techStack.slice(0, 4).map((tech, index) => (
                        <span key={index} className={`px-2 py-1 bg-${color}-900/30 text-${color}-300 text-xs rounded`}>
              {tech}
            </span>
                    ))}
                    {project.techStack.length > 4 && (
                        <span className={`px-2 py-1 bg-${color}-900/30 text-${color}-300 text-xs rounded`}>
              +{project.techStack.length - 4}
            </span>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                        <a
                            href={project.liveUrl}
                            className={`text-${color}-400 hover:text-${color}-300 text-sm flex items-center gap-1 transition-colors`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink size={14} />
                            Live Demo
                        </a>
                        <a
                            href={project.githubUrl}
                            className={`text-${color}-400 hover:text-${color}-300 text-sm flex items-center gap-1 transition-colors`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github size={14} />
                            Code
                        </a>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-400">
                        <span>⭐ {project.stars}</span>
                        <span>🍴 {project.forks}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
