'use server';

import connectToDatabase from '@/app/lib/db';
import { Comment } from '@/app/models';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

export async function addComment(taskId: string, content: string) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    await connectToDatabase();

    try {
        const comment = await Comment.create({
            task_id: taskId,
            user_id: session.userId,
            content,
        });

        revalidatePath('/dashboard');
        return { success: true, comment: JSON.parse(JSON.stringify(comment)) };
    } catch (error) {
        console.error('Error adding comment:', error);
        return { error: 'Failed to add comment' };
    }
}

export async function getComments(taskId: string) {
    const session = await getSession();
    if (!session) return [];

    await connectToDatabase();

    try {
        const comments = await Comment.find({ task_id: taskId })
            .populate('user_id', 'name avatar_url')
            .sort({ createdAt: 1 }); // Oldest first

        return JSON.parse(JSON.stringify(comments));
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}
