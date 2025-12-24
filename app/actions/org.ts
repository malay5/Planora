'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Organization, Invitation, User, Project, OrgMembership, Notification } from '@/app/models';
import connectToDatabase from '@/app/lib/db';
import { randomBytes } from 'crypto';
import { getSession } from './auth';
import { logAction } from './log';

export async function createOrganization(prevState: any, formData: FormData) {
    await connectToDatabase();
    const session = await getSession();
    if (!session) redirect('/login');

    const name = formData.get('orgName') as string;
    if (!name) return { error: 'Name is required' };

    try {
        // Enforce unique name
        const existingOrg = await Organization.findOne({ name });
        if (existingOrg) {
            return { error: 'Organization name already exists' };
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

        const org: any = await (Organization as any).create({
            name,
            slug,
            members: [session.userId],
        });

        // Create OrgMembership for the creator
        // Default username to their global name for now, handling duplicates if needed? 
        // Creator usually gets their name.
        const user = await User.findById(session.userId);
        const orgUsername = user ? user.name.replace(/\s+/g, '').toLowerCase() : 'user' + Math.floor(Math.random() * 1000);

        await (OrgMembership as any).create({
            org_id: org._id,
            user_id: session.userId,
            org_username: orgUsername,
            role: 'owner'
        });

        // Create Default Project for the new Org
        await Project.create({
            name: 'General',
            key: 'GEN',
            org_id: org._id,
            description: 'Default project for ' + name,
            task_count: 0
        });

        // Return ID for client-side redirect or just success
        return { success: true, orgId: org._id.toString() };

    } catch (e) {
        console.error(e);
        return { error: 'Failed to create organization' };
    }
}

export async function generateInviteLink(orgId: string) {
    await connectToDatabase();
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    // Check if user is member of org
    const org: any = await Organization.findOne({ _id: orgId, members: session.userId } as any);
    if (!org) throw new Error('Unauthorized');

    const token = randomBytes(32).toString('hex');

    await (Invitation as any).create({
        token,
        organization_id: orgId,
        inviter_id: session.userId,
    });

    // In prod, use actual domain
    const headersList = await import('next/headers').then(h => h.headers());
    const domain = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    return `${protocol}://${domain}/invite/${token}`;
}

export async function joinOrganization(prevState: any, formData: FormData) {
    await connectToDatabase();
    const session = await getSession();
    const token = formData.get('token') as string;
    const username = formData.get('username') as string;

    if (!session) redirect('/login?next=/invite/' + token);
    if (!username) return { error: 'Username is required' };

    const invite: any = await Invitation.findOne({ token, status: 'pending' });
    if (!invite) return { error: 'Invalid or expired invite' };

    const org: any = await Organization.findById(invite.organization_id);
    if (!org) return { error: 'Organization not found' };

    // Check availability of username in this org
    const existingMembership = await OrgMembership.findOne({ org_id: org._id, org_username: username });
    if (existingMembership) {
        return { error: 'Username already taken in this organization' };
    }

    // Add user to org if not already there
    const isMember = org.members.some((m: any) => m.toString() === session.userId);
    if (!isMember) {
        org.members.push(session.userId);
        await org.save();

        await (OrgMembership as any).create({
            org_id: org._id,
            user_id: session.userId,
            org_username: username,
            role: 'member'
        });
    }

    // Update invite status
    invite.status = 'accepted';
    await invite.save();

    await logAction(org._id.toString(), session.userId as string, 'joined org', org._id.toString(), 'Organization', `Joined organization ${org.name}`);

    // Notify other members
    const otherMembers = org.members.filter((m: any) => m.toString() !== session.userId);
    const notifications = otherMembers.map((memberId: any) => ({
        user_id: memberId,
        type: 'system',
        content: `New member joined: ${username}`,
        read: false,
        timestamp: new Date()
    }));

    if (notifications.length > 0) {
        await Notification.insertMany(notifications);
    }

    redirect(`/${org._id.toString()}/dashboard`);
}

export async function leaveOrganization(orgId: string) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    await connectToDatabase();

    const org: any = await Organization.findById(orgId);
    if (!org) return { error: 'Organization not found' };

    // Remove from Organization.members
    org.members = org.members.filter((m: any) => m.toString() !== session.userId);
    await org.save();

    // Remove OrgMembership
    await (OrgMembership as any).deleteOne({ org_id: orgId, user_id: session.userId });

    await logAction(org._id.toString(), session.userId as string, 'left org', org._id.toString(), 'Organization', `Left organization ${org.name}`);

    return { success: true };
}

export async function getOrganizationDetails() {
    const session = await getSession();
    if (!session) return null;

    await connectToDatabase();
    const org = await Organization.findById(session.orgId).lean();
    return JSON.parse(JSON.stringify(org));
}

export async function getUserOrganizations() {
    const session = await getSession();
    if (!session) return [];

    await connectToDatabase();
    // Return all orgs where user is a member
    const orgs: any = await Organization.find({ members: session.userId } as any)
        .select('_id name slug')
        .lean();

    return orgs.map((org: any) => ({
        id: org._id.toString(),
        name: org.name,
        slug: org.slug,
        isActive: org._id.toString() === session.orgId
    }));
}

export async function getOrgMembers(orgId: string) {
    await connectToDatabase();

    // Try OrgMembership first (preferred for Phase 5+)
    const memberships = await OrgMembership.find({ org_id: orgId }).populate('user_id', 'name email avatar_url');

    if (memberships && memberships.length > 0) {
        return memberships.map((m: any) => ({
            userId: m.user_id?._id.toString() || 'unknown', // Handle potential null if user deleted
            name: m.user_id?.name || 'Unknown User',
            email: m.user_id?.email,
            username: m.org_username,
            role: m.role,
            joinedAt: m.joined_at
        })).filter(m => m.userId !== 'unknown');
    }

    // Fallback: Fetch from Organization.members (legacy/migration support)
    const org = await Organization.findById(orgId).populate('members', 'name email avatar_url');
    if (!org) return [];

    return (org.members as any[]).map((user: any) => ({
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.name?.replace(/\s+/g, '').toLowerCase() || 'user', // Fallback username
        role: 'member', // Default role
        joinedAt: new Date() // Fallback date
    }));
}

export async function switchOrganization(orgId: string) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    await connectToDatabase();

    // Verify membership
    const org: any = await Organization.findOne({ _id: orgId, members: session.userId } as any);
    if (!org) return { error: 'Not a member of this organization' };

    // Create new session
    const { SignJWT } = await import('jose');
    const { cookies } = await import('next/headers');

    const SECRET_KEY = process.env.JWT_SECRET || 'default-secret-key-change-me';
    const key = new TextEncoder().encode(SECRET_KEY);

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newSessionToken = await new SignJWT({ userId: session.userId, orgId: org._id.toString() })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);

    const cookieStore = await cookies();
    cookieStore.set('session', newSessionToken, { expires, httpOnly: true });

    return { success: true };
}
