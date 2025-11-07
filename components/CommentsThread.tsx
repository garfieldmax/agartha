"use client";

import { useState } from "react";
import type { Comment } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

interface CommentsThreadProps {
  comments: Comment[];
  onSubmit?: (body: string) => Promise<void>;
}

export function CommentsThread({ comments, onSubmit }: CommentsThreadProps) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!onSubmit || !body.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(body.trim());
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card padding="sm" className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <p className="text-sm text-slate-900">{comment.body}</p>
              <p className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </Card>
      {onSubmit && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Share your thoughts"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={isSubmitting || body.trim().length === 0}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      )}
    </div>
  );
}
