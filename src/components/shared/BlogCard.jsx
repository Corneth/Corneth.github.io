
// components/shared/BlogCard.jsx
import { ExternalLink, Calendar, Clock } from 'lucide-react';

export default function BlogCard({ post }) {
    return (
        <div className="bg-gray-900/80 border border-blue-500/50 rounded-lg overflow-hidden hover:border-blue-400 transition-all group transform hover:scale-105">
            <div className="h-48 overflow-hidden">
                <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
            </div>
            <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-2">
                    {post.categories.map((category, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">
              {category}
            </span>
                    ))}
                </div>
                <h3 className="text-blue-400 font-semibold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">{post.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
              {new Date(post.pubDate).toLocaleDateString()}
          </span>
                    <span className="flex items-center gap-1">
            <Clock size={12} />
                        {post.readTime}
          </span>
                </div>
                <a
                    href={post.link}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <ExternalLink size={14} />
                    Read Article
                </a>
            </div>
        </div>
    );
}