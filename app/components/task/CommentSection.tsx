'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addComment, getComments } from '@/app/actions/comment';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
    _id: string;
    content: string;
    user_id: {
        _id: string;
        name: string;
        avatar_url?: string;
    };
    createdAt: string;
}

export function CommentSection({ taskId }: { taskId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            const data = await getComments(taskId);
            setComments(data);
        };
        fetchComments();
    }, [taskId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsLoading(true);
        const result = await addComment(taskId, newComment);
        if (result.success) {
            setComments([...comments, result.comment]); // Optimistic-ish update (using returned data)
            setNewComment('');
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-4 mt-6 border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Activity</h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20 shrink-0">
                            {comment.user_id.name ? comment.user_id.name.charAt(0) : '?'}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-baseline justify-between">
                                <span className="text-xs font-medium text-foreground">{comment.user_id.name}</span>
                                <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed bg-muted/50 p-2 rounded-lg border border-border">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="gap-2">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="min-h-[80px] bg-muted/30 border-border focus:ring-primary/50 mb-2"
                />
                <div className="flex justify-end">
                    <Button
                        size="sm"
                        disabled={!newComment.trim() || isLoading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {isLoading ? 'Posting...' : 'Comment'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
