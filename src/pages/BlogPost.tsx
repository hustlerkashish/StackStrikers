import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentSystem } from "@/components/CommentSystem";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Calendar, User, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { blogService } from "@/lib/blog-service";
import { useAuth } from "@/hooks/use-auth";
import type { Post, Comment } from "@/lib/supabase";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const postData = await blogService.getPostBySlug(slug);
        setPost(postData);
        const commentsData = await blogService.getComments(postData.id);
        setComments(commentsData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load the blog post.",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, toast, navigate]);

  const handleCommentSubmit = async (content: string) => {
    if (!user || !post) return;

    try {
      const newComment = await blogService.createComment({
        content,
        post_id: post.id,
        user_id: user.id,
      });
      setComments((prev) => [...prev, newComment]);
      toast({
        title: "Success",
        description: "Comment added successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message || "Failed to add comment.",
      });
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      await blogService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast({
        title: "Success",
        description: "Comment deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment.",
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
              {post.category?.name || 'Uncategorized'}
            </Badge>
            
            <h1 className="blog-title text-foreground mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author?.full_name || 'Anonymous'}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {comments.length} comments
              </span>
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            {post.content}
          </div>

          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">Comments</h2>
            </div>

            <CommentSystem
              comments={comments}
              onCommentSubmit={handleCommentSubmit}
              onCommentDelete={handleCommentDelete}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </article>
    </div>
  );
}