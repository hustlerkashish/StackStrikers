import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Comment } from "@/lib/supabase";

interface CommentSystemProps {
  comments: (Comment & { user?: { full_name: string } })[];
  onCommentSubmit: (content: string) => Promise<void>;
  onCommentDelete: (id: string) => Promise<void>;
  currentUserId?: string;
}

export function CommentSystem({
  comments,
  onCommentSubmit,
  onCommentDelete,
  currentUserId,
}: CommentSystemProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    try {
      setSubmitting(true);
      await onCommentSubmit(content);
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={submitting || !content.trim()}>
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      ) : (
        <div className="p-4 border rounded-lg bg-muted">
          <p>Please sign in to leave a comment.</p>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar className="h-10 w-10" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">
                    {comment.user?.full_name || "Anonymous"}
                  </span>
                  <span className="text-muted-foreground ml-2 text-sm">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                {comment.user_id === currentUserId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCommentDelete(comment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-foreground">{comment.content}</p>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}