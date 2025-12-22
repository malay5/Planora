'use server';

import connectToDatabase from '@/app/lib/db';
import { Notification } from '@/app/models';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

export async function getNotifications(page = 1) {
    await connectToDatabase();
    const session = await getSession();
    if (!session) return { notifications: [], totalPages: 0, unreadCount: 0 };

    const limit = 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user_id: session.userId, org_id: session.orgId } as any)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const count = await Notification.countDocuments({ user_id: session.userId, org_id: session.orgId } as any);
    const unreadCount = await Notification.countDocuments({ user_id: session.userId, org_id: session.orgId, read: false } as any);

    return {
        notifications: JSON.parse(JSON.stringify(notifications)),
        totalPages: Math.ceil(count / limit),
        unreadCount
    };
}

export async function markAsRead(notificationId: string) {
    await connectToDatabase();
    const session = await getSession();
    if (!session) return;

    await Notification.updateOne(
        { _id: notificationId, user_id: session.userId } as any,
        { read: true }
    );

    revalidatePath('/dashboard');
    return { success: true };
}

export async function markAllAsRead() {
    await connectToDatabase();
    const session = await getSession();
    if (!session) return;

    await Notification.updateMany(
        { user_id: session.userId, org_id: session.orgId, read: false } as any,
        { read: true }
    );

    revalidatePath('/dashboard');
    return { success: true };
}
