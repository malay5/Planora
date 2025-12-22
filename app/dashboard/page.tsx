import { getBoardData } from '@/app/actions/task';
import KanbanBoard from '@/app/components/board/KanbanBoard';
import { InviteMemberButton } from '@/app/components/InviteMemberButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const { project, columns } = await getBoardData();

    if (!project) {
        return (
            <div className="h-[calc(100vh-8rem)] flex items-center justify-center text-zinc-500">
                <div>No project found. Create an organization to get started.</div>
            </div>
        )
    }

    // Serialize IDs for Client Component
    // Mongoose IDs are objects, need strings for React props
    const serializedColumns = Object.entries(columns).reduce((acc, [key, tasks]) => {
        acc[key] = (tasks as any[]).map(t => {
            const assignee = t.assignee as any;
            return {
                _id: t._id.toString(),
                title: t.title,
                type: t.type,
                priority: t.priority,
                order: t.order,
                assignee: assignee ? {
                    name: assignee.name,
                    avatar_url: assignee.avatar_url,
                } : undefined
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
                <InviteMemberButton orgId={project.org_id.toString()} />
            </div>

            <div className="flex-1 min-h-0">
                <KanbanBoard initialColumns={serializedColumns} projectKey={project.key} />
            </div>
        </div>
    );
}
