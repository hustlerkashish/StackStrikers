import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, User, Calendar, Heart, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createComment, toggleLike } from "@/lib/database";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  postId: string;
  likes: string[];
}

interface CommentSystemProps {
  postId: string;
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, "id" | "createdAt" | "likes">) => void;
}

export const CommentSystem = ({ postId, comments, onAddComment }: CommentSystemProps) => {
  // Ensure comments is always an array
  const safeComments = Array.isArray(comments) ? comments : [];
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to post comments.",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Comment required", 
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newComment = await createComment(user.id, {
        content: content.trim(),
        postId,
      });
      
      onAddComment({
        author: newComment.author,
        content: newComment.content,
        postId: newComment.postId,
      });
      
      setContent("");
      
      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like comments.",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleLike(user.id, undefined, commentId);
      // The comment likes will be updated in the parent component
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-primary" />
        <h3 className="section-title">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <Card className="p-6 mb-8 shadow-comment">
          <h4 className="font-semibold mb-4">Leave a Comment</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Write your comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={1000}
              required
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {content.length}/1000 characters
              </span>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                variant="success"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="p-6 mb-8 shadow-comment">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please log in to post comments.</p>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Sign In
            </Button>
          </div>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {safeComments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          safeComments.map((comment) => (
            <Card key={comment.id} className="p-6 shadow-comment">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>
                      {comment.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="font-semibold text-card-foreground">{comment.author.name}</h5>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                      {new Date(comment.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center gap-1"
                  >
                    <Heart className={`h-4 w-4 ${user && comment.likes.includes(user.id) ? 'fill-current text-red-500' : ''}`} />
                    {comment.likes.length}
                  </Button>
                  
                  {user && user.id === comment.author.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              <p className="blog-content text-card-foreground">
                {comment.content}
              </p>
            </Card>
          ))
        )}
      </div>
    </section>
  );
};