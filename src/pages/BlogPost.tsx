import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentSystem, Comment } from "@/components/CommentSystem";
import { Navigation } from "@/components/Navigation";
import { BlogPost as BlogPostType } from "@/components/BlogCard";
import { getPostById, getCommentsByPostId, createComment } from "@/lib/database";
import { ArrowLeft, Calendar, User, MessageCircle, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { toggleLike, sharePost } from "@/lib/database";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const foundPost = await getPostById(id);
        const postComments = await getCommentsByPostId(id);
        
        console.log('Loaded post:', foundPost);
        console.log('Post author:', foundPost?.author);
        
        setPost(foundPost || null);
        setComments(postComments || []);
        
        if (foundPost) {
          setIsLiked(user ? (foundPost.likes || []).includes(user.id) : false);
          setLikeCount((foundPost.likes || []).length);
          setShareCount(foundPost.shares || 0);
        }
      } catch (error) {
        console.error('Failed to load post:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the blog post. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, user, toast]);

  const handleAddComment = async (commentData: Omit<Comment, "id" | "createdAt" | "likes">) => {
    try {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      const newComment = await createComment({
        content: commentData.content,
        postId: commentData.postId,
      }, user.id);
      
      setComments(prev => [...prev, newComment]);
      
      if (post) {
        setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
      }
    } catch (error) {
      throw error; // Re-throw to let CommentSystem handle the error
    }
  };

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
      const liked = await toggleLike(user.id, post?.id);
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
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied!',
          description: 'Post link has been copied to clipboard.',
        });
      } else {
        await sharePost(user.id, post!.id, platform);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="post-title mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/">
              <Button variant="default">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-block mb-6">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Button>
          </Link>

          {/* Post Header */}
          <header className="mb-8">
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            
            <h1 className="blog-title text-foreground mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author?.avatar} alt={post.author?.name || 'Unknown Author'} />
                  <AvatarFallback>
                    {post.author?.name ? post.author.name.split(' ').map(n => n[0]).join('') : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{post.author?.name || 'Unknown Author'}</span>
              </div>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Date not available'}
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {post.commentCount} comments
              </span>
            </div>
            
            {/* Like and Share Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                {likeCount}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('copy')}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-12 blog-content text-foreground">
            {(post.content || '').split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={index} className="blog-title mt-8 mb-4">{paragraph.substring(2)}</h1>;
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="post-title mt-6 mb-3">{paragraph.substring(3)}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="section-title mt-4 mb-2">{paragraph.substring(4)}</h3>;
              }
              if (paragraph.startsWith('```')) {
                return null; // Skip code block markers for now
              }
              if (paragraph.trim() === '') {
                return <br key={index} />;
              }
              return <p key={index} className="mb-4">{paragraph}</p>;
            })}
          </div>

          {/* Comment System */}
          <CommentSystem 
            postId={post.id}
            comments={comments}
            onAddComment={handleAddComment}
          />
        </div>
      </article>
    </div>
  );
}