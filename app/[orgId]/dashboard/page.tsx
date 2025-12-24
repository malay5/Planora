import { CreateTaskDialog } from '@/app/components/task/CreateTaskDialog';
import { getBoardData } from '@/app/actions/task';
import { getOrgMembers } from '@/app/actions/org';
import KanbanBoard from '@/app/components/board/KanbanBoard';
import { InviteMemberButton } from '@/app/components/InviteMemberButton';
import { getSession } from '@/app/actions/auth';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params, searchParams }: { params: Promise<{ orgId: string }>, searchParams: Promise<{ projectId?: string }> }) {
    const { orgId } = await params;
    const { projectId } = await searchParams;
    const session = await getSession();
    // Pass orgId and projectId to getBoardData
    const { project, columns } = await getBoardData(orgId, projectId);

    if (!project || !session) {
        return (
            <div className="h-[calc(100vh-8rem)] flex items-center justify-center text-zinc-500">
                <div>No project found. Create an organization to get started.</div>
            </div>
        )
    }

    const members = await getOrgMembers(orgId);

    // Serialize IDs for Client Component
    const serializedColumns = Object.entries(columns).reduce((acc, [key, tasks]) => {
        acc[key] = (tasks as any[]).map(t => {
            const assignee = t.assignee as any;
            return {
                _id: t._id.toString(),
                title: t.title,
                type: t.type,
                priority: t.priority,
                order: t.order,
                tags: t.tags || [],
                story_points: t.story_points,
                assignee: assignee ? {
                    _id: assignee._id ? assignee._id.toString() : undefined,
                    name: assignee.name,
                    avatar_url: assignee.avatar_url,
                } : undefined,
                description: t.description
            };
        });
        return acc;
    }, {} as any);

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{project.name}</h2>
                    <p className="text-zinc-500">{project.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/${orgId}/settings/team/${project._id}`}>
                        <Button variant="outline" size="icon">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </Link>
                    <CreateTaskDialog projectId={project._id} />
                    <InviteMemberButton orgId={orgId} />
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <KanbanBoard
                    initialColumns={serializedColumns}
                    projectKey={project.key}
                    members={members}
                    currentUserId={session.userId as string}
                />
            </div>
        </div>
    );
}
