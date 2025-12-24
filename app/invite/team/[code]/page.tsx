import { getSession } from '@/app/actions/auth';
import { Project, Organization, OrgMembership } from '@/app/models';
import connectToDatabase from '@/app/lib/db';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function joinTeam(code: string) {
    'use server';
    await connectToDatabase();
    const session = await getSession();
    if (!session) return { error: 'Please login first', redirect: '/login' };

    const project = await Project.findOne({ invite_code: code });
    if (!project) return { error: 'Invalid invite code' };

    const userId = session.userId as string;
    const orgId = project.org_id;

    // 1. Ensure Org Membership
    const existingOrgMember = await OrgMembership.findOne({ org_id: orgId, user_id: userId });
    if (!existingOrgMember) {
        // Add to Org
        // Logic similar to org invite acceptance
        // We'll simplisticly add them as 'member'
        // Need to generate org_username
        const user = await (await import('@/app/models')).User.findById(userId);
        const orgUsername = user?.name.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).slice(-4);

        await OrgMembership.create({
            org_id: orgId,
            user_id: userId,
            org_username: orgUsername,
            role: 'member'
        });

        await Organization.findByIdAndUpdate(orgId, { $addToSet: { members: userId } });
    }

    // 2. Add to Project Members
    await Project.findByIdAndUpdate(project._id, { $addToSet: { members: userId } });

    return { success: true, redirect: `/${orgId}/dashboard?projectId=${project._id}` };
}

export default async function TeamInvitePage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;

    // We can pre-fetch project info to show "Join Team X?"
    await connectToDatabase();
    const project = await Project.findOne({ invite_code: code }).populate('org_id', 'name');

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-500">Invalid Invite</CardTitle>
                        <CardDescription>This invite code does not exist or has expired.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Join Team</CardTitle>
                    <CardDescription>
                        You have been invited to join <strong>{project.name}</strong> in {(project.org_id as any).name}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={async () => {
                        'use server';
                        const res = await joinTeam(code);
                        if (res.redirect) redirect(res.redirect);
                    }}>
                        <Button className="w-full">Accept Invitation</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
