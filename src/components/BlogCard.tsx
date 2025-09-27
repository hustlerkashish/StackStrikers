import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, User, Bookmark, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  publishedAt: string;
  commentCount: number;
  imageUrl?: string;
  readTime?: number;
}

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <article className="py-8 border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer group">
      <Link to={`/post/${post.id}`} className="block">
        <div className="flex gap-8">
          {/* Content */}
          <div className="flex-1">
            {/* Author and publication info */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-700 font-medium">{post.author}</span>
              <span className="text-gray-400">·</span>
              <span className="text-sm text-gray-500">{formatDate(post.publishedAt)}</span>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
              {post.title}
            </h3>
            
            {/* Excerpt */}
            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
            
            {/* Meta info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs px-2 py-1">
                  {post.category}
                </Badge>
                <span className="text-sm text-gray-500">
                  {post.readTime || Math.ceil(post.content.length / 200)} min read
                </span>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Image */}
          {post.imageUrl && (
            <div className="w-32 h-24 flex-shrink-0">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};