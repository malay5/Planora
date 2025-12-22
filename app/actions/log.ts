'use server';

import connectToDatabase from '@/app/lib/db';
import { ActionLog, OrgMembership } from '@/app/models';
import { getSession } from './auth';

export async function logAction(
    orgId: string,
    userId: string,
    action: string,
    targetId?: string,
    targetType?: string,
    details?: string
) {
    try {
        await connectToDatabase();
        await (ActionLog as any).create({
            org_id: orgId,
            user_id: userId,
            action,
            target_id: targetId,
            target_type: targetType,
            details,
        });
    } catch (error) {
        console.error('Failed to log action:', error);
        // Don't throw, just log error so we don't block main flow
    }
}

export async function getLogs(page: number = 1) {
    const session = await getSession();
    if (!session) return { logs: [], totalPages: 0 };

    await connectToDatabase();

    const limit = 30;
    const skip = (page - 1) * limit;

    // Hard limit of 500 actions logic
    // Actually, user just wants "last 500 (with pagination, 30 per page)"
    // So we assume the query shouldn't go beyond 500 items total.
    const maxItems = 500;

    // We only fetch if skip is < 500
    if (skip >= maxItems) return { logs: [], totalPages: Math.ceil(maxItems / limit) };

    const logs = await ActionLog.find({ org_id: session.orgId } as any)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user_id', 'name email avatar_url')
        .lean();

    const count = await ActionLog.countDocuments({ org_id: session.orgId } as any).limit(maxItems); // Optimized count? 
    // Mongoose countDocuments with limit option? 
    // Actually, if we want to simulate "keeping only 500", we might need to cap the count we return to the UI.
    const effectiveCount = Math.min(count, maxItems);

    return {
        logs: JSON.parse(JSON.stringify(logs)),
        totalPages: Math.ceil(effectiveCount / limit),
        currentPage: page
    };
}
