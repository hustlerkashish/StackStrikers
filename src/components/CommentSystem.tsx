import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  postId: string;
}

interface CommentSystemProps {
  postId: string;
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, "id" | "createdAt">) => void;
}

export const CommentSystem = ({ postId, comments, onAddComment }: CommentSystemProps) => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Input validation
    if (!author.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
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

    // Check for duplicate comments (same author and content)
    const isDuplicate = comments.some(
      comment => comment.author.toLowerCase() === author.toLowerCase().trim() && 
                comment.content.toLowerCase() === content.toLowerCase().trim()
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate comment",
        description: "You've already posted this comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAddComment({
        author: author.trim(),
        content: content.trim(),
        postId,
      });
      
      setAuthor("");
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

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-primary" />
        <h3 className="section-title">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <Card className="p-6 mb-8 shadow-comment">
        <h4 className="font-semibold mb-4">Leave a Comment</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={100}
            required
          />
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

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-6 shadow-comment">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h5 className="font-semibold text-card-foreground">{comment.author}</h5>
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
              <p className="blog-content text-card-foreground pl-13">
                {comment.content}
              </p>
            </Card>
          ))
        )}
      </div>
    </section>
  );
};