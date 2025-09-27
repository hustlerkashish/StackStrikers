import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, User } from "lucide-react";
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
}

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <article className="blog-card rounded-xl overflow-hidden bg-card border border-border h-full flex flex-col">
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
        </div>
        
        <h3 className="post-title text-card-foreground mb-3 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 flex-1 blog-content line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {post.commentCount}
          </span>
        </div>
        
        <Link to={`/post/${post.id}`}>
          <Button variant="blog" className="w-full">
            Read More
          </Button>
        </Link>
      </div>
    </article>
  );
};