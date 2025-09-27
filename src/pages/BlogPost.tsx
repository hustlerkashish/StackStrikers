import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentSystem, Comment } from "@/components/CommentSystem";
import { Navigation } from "@/components/Navigation";
import { BlogPost as BlogPostType } from "@/components/BlogCard";
import { getPostById, getCommentsByPostId, addComment } from "@/data/mockData";
import { ArrowLeft, Calendar, User, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const foundPost = getPostById(id);
      const postComments = getCommentsByPostId(id);
      
      setPost(foundPost || null);
      setComments(postComments);
      setLoading(false);
    }
  }, [id]);

  const handleAddComment = async (commentData: Omit<Comment, "id" | "createdAt">) => {
    try {
      const newComment = addComment(commentData);
      setComments(prev => [...prev, newComment]);
      
      if (post) {
        setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
      }
    } catch (error) {
      throw error; // Re-throw to let CommentSystem handle the error
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
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {post.commentCount} comments
              </span>
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
            {post.content.split('\n').map((paragraph, index) => {
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