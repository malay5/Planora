'use server';

import connectToDatabase from '@/app/lib/db';
import { Task, Project, ActionLog, OrgMembership, User, Notification } from '@/app/models';
import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';
import { getSession } from './auth';
import { logAction } from './log';

export async function getBoardData() {
    try {
        const session = await getSession();
        if (!session) throw new Error('Unauthorized');

        await connectToDatabase();

        // Find primary project for the org
        const projectDoc = await Project.findOne({ org_id: session.orgId } as any).lean();

        if (!projectDoc) return { project: null, columns: {} };

        const project = JSON.parse(JSON.stringify(projectDoc));

        // Find tasks
        const tasksDocs = await Task.find({ project_id: project._id, deleted_at: null })
            .populate('assignee', 'name avatar_url')
            .sort({ order: 1 })
            .lean();

        const tasks = JSON.parse(JSON.stringify(tasksDocs));

        // Group by status
        const columns = {
            'Backlog': tasks.filter((t: any) => t.status === 'Backlog'),
            'Todo': tasks.filter((t: any) => t.status === 'Todo'),
            'In Progress': tasks.filter((t: any) => t.status === 'In Progress'),
            'Review': tasks.filter((t: any) => t.status === 'Review'),
            'Done': tasks.filter((t: any) => t.status === 'Done'),
        };

        return { project, columns };
    } catch (error) {
        console.error("Error in getBoardData:", error);
        return { project: null, columns: {} };
    }
}

export async function updateTaskStatus(taskId: string, newStatus: string, newIndex: number) {
    await connectToDatabase();

    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    task.status = newStatus;
    task.order = newIndex;
    await task.save();

    const session = await getSession();
    if (session) {
        await logAction(session.orgId as string, session.userId as string, 'moved task', taskId, 'Task', `Moved task to ${newStatus}`);
    }

    revalidatePath('/dashboard');
}

export async function createTask(prevState: any, formData: FormData) {
    await connectToDatabase();
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const priority = formData.get('priority') as string;
    const assigneeId = formData.get('assignee') as string;
    const status = formData.get('status') as string || 'Todo';
    const tagsInfo = formData.get('tags') as string;
    const tags = tagsInfo ? tagsInfo.split(',').map(t => t.trim()).filter(Boolean) : [];
    const storyPointsStr = formData.get('story_points') as string;
    const story_points = storyPointsStr ? parseInt(storyPointsStr) : undefined;

    // Extract hashtags from description
    const hashtags = (description.match(/#[a-zA-Z0-9_]+/g) || []).map(t => t.slice(1));
    const finalTags = Array.from(new Set([...tags, ...hashtags]));

    // Find the project for the current org and increment task count atomically
    const project: any = await Project.findOneAndUpdate(
        { org_id: session.orgId } as any,
        { $inc: { task_count: 1 } },
        { new: true } // Return updated document
    ).lean();

    if (!project) throw new Error('Project not found');

    const taskId = `${project.key}-${project.task_count}`;

    await Task.create({
        title,
        description,
        type,
        priority,
        status,
        project_id: project._id,
        assignee: assigneeId || undefined,
        tags: finalTags,
        taskId,
        story_points,
    } as any);

    // Phase 5: Action Log
    await logAction(session.orgId as string, session.userId as string, 'created task', taskId, 'Task', `Created task ${taskId}: ${title}`);

    // Process Mentions
    await processMentions(description, session.orgId as string, taskId, session.userId as string);

    revalidatePath('/dashboard');
    return { message: 'Task created' };
}

export async function updateTask(taskId: string, formData: FormData) {
    await connectToDatabase();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const priority = formData.get('priority') as string;
    const status = formData.get('status') as string;
    const tagsInfo = formData.get('tags') as string;
    const tags = tagsInfo ? tagsInfo.split(',').map(t => t.trim()).filter(Boolean) : [];
    const storyPointsStr = formData.get('story_points') as string;
    const story_points = storyPointsStr ? parseInt(storyPointsStr) : undefined;

    // Extract hashtags from description
    const hashtags = (description.match(/#[a-zA-Z0-9_]+/g) || []).map(t => t.slice(1));
    const finalTags = Array.from(new Set([...tags, ...hashtags]));

    const backlog_reason = formData.get('backlog_reason') as string;

    const updateData: any = {
        title,
        description,
        type,
        priority,
        status,
        tags: finalTags,
        story_points
    };

    if (backlog_reason) {
        updateData.backlog_reason = backlog_reason;
    }

    await Task.findByIdAndUpdate(taskId, updateData);

    const session = await getSession();
    if (session) {
        await logAction(session.orgId as string, session.userId as string, 'updated task', taskId, 'Task', `Updated task properties for ${title}`);

        // Process Mentions
        await processMentions(description, session.orgId as string, taskId, session.userId as string);
    }

    revalidatePath('/dashboard');
}

export async function deleteTask(taskId: string) {
    await connectToDatabase();

    await Task.findByIdAndUpdate(taskId, { deleted_at: new Date() });

    const session = await getSession();
    if (session) {
        await logAction(session.orgId as string, session.userId as string, 'deleted task', taskId, 'Task', `Moved task ${taskId} to trash`);
    }

    revalidatePath('/dashboard');
    return { message: 'Task moved to trash' };
}

export async function getTrashTasks() {
    await connectToDatabase();
    const session = await getSession();
    if (!session) return [];

    // Find all projects in this org to get tasks from
    const projects = await Project.find({ org_id: session.orgId } as any).select('_id');
    const projectIds = projects.map((p: any) => p._id);

    const tasks = await Task.find({
        project_id: { $in: projectIds },
        deleted_at: { $ne: null }
    })
        .populate('assignee', 'name avatar_url')
        .sort({ deleted_at: -1 })
        .lean();

    return JSON.parse(JSON.stringify(tasks));
}

export async function restoreTask(taskId: string) {
    await connectToDatabase();

    await Task.findByIdAndUpdate(taskId, { deleted_at: null });

    const session = await getSession();
    if (session) {
        await logAction(session.orgId as string, session.userId as string, 'restored task', taskId, 'Task', `Restored task ${taskId} from trash`);
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/trash');
}

export async function permanentlyDeleteTask(taskId: string) {
    await connectToDatabase();

    await Task.findByIdAndDelete(taskId);

    const session = await getSession();
    if (session) {
        await logAction(session.orgId as string, session.userId as string, 'permanently deleted task', taskId, 'Task', `Permanently deleted task ${taskId}`);
    }

    revalidatePath('/dashboard/trash');
}

async function processMentions(
    description: string,
    orgId: string,
    taskId: string,
    actorId: string
) {
    if (!description) return;

    const mentions = (description.match(/@[a-zA-Z0-9_]+/g) || []).map(m => m.slice(1));

    if (mentions.length > 0) {
        // Find users by org_username
        const memberships = await OrgMembership.find({
            org_id: orgId,
            org_username: { $in: mentions }
        } as any).populate('user_id');

        for (const membership of memberships as any[]) {
            const mentionedUserId = membership.user_id._id.toString();
            if (mentionedUserId === actorId) continue; // Don't notify self

            await Notification.create({
                user_id: mentionedUserId,
                org_id: orgId,
                type: 'mention',
                content: `You were mentioned in task ${taskId}`,
                link: `/dashboard?taskId=${taskId}`,
                read: false,
                related_entity_id: taskId,
                related_entity_type: 'Task'
            });
        }
    }
}
