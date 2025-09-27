import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MessageCircle, User, Heart, Share2, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toggleLike, sharePost } from "@/lib/database";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  publishedAt: string;
  commentCount: number;
  likes: string[];
  shares: number;
  imageUrl?: string;
}

interface BlogCardProps {
  post: BlogPost;
  viewMode?: 'grid' | 'list';
}

export const BlogCard = ({ post, viewMode = 'grid' }: BlogCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user.id) : false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [shareCount, setShareCount] = useState(post.shares);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to like posts.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const liked = await toggleLike(user.id, post.id);
      setIsLiked(liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to like post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'copy') => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to share posts.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`);
        toast({
          title: 'Link copied!',
          description: 'Post link has been copied to clipboard.',
        });
      } else {
        await sharePost(user.id, post.id, platform);
        setShareCount(prev => prev + 1);
        toast({
          title: 'Shared!',
          description: `Post shared on ${platform}.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share post. Please try again.',
        variant: 'destructive',
      });
    }
  };

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
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleShare('copy')}>
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('twitter')}>
                Share on Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('facebook')}>
                Share on Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                Share on LinkedIn
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h3 className="post-title text-card-foreground mb-3 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 flex-1 blog-content line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback className="text-xs">
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span>{post.author.name}</span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.commentCount}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="w-4 h-4" />
              {shareCount}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 ${
              isLiked 
                ? 'indo-button-primary' 
                : 'border-indo-primary text-indo-primary hover:bg-indo-primary hover:text-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            {likeCount}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('copy')}
            className="border-indo-secondary text-indo-secondary hover:bg-indo-secondary hover:text-white flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
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