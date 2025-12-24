import { getOrgProjects } from '@/app/actions/task';
import { getSession } from '@/app/actions/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';
import Link from 'next/link';
import { CreateTeamDialog } from '@/app/components/teams/CreateTeamDialog';

export default async function OrgTeamsPage({ params }: { params: Promise<{ orgId: string }> }) {
    const { orgId } = await params;
    const session = await getSession();
    const projects = await getOrgProjects(orgId);

    if (!projects || projects.length === 0) {
        // Fallback to check if it's just empty or invalid?
        // Since getOrgProjects handles validation and auth, empty array likely means invalid/no-access.
        // (Valid orgs usually have at least 'General' project created on signup).
        return (
            <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">Organization Not Found</h1>
                <p className="text-muted-foreground">The organization you are looking for does not exist or you do not have access.</p>
                <Link href="/" className="text-primary hover:underline">
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
                    <p className="text-muted-foreground mt-2">Select a team to view their board or create a new one.</p>
                </div>
                <CreateTeamDialog orgId={orgId} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: any) => (
                    <Link key={project._id} href={`/${orgId}/dashboard?projectId=${project._id}`}>
                        <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full group bg-card">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        {project.key.substring(0, 2)}
                                    </div>
                                    <Users className="text-muted-foreground w-4 h-4 group-hover:text-primary transition-colors" />
                                </div>
                                <CardTitle className="text-xl">{project.name}</CardTitle>
                                <CardDescription className="line-clamp-2">{project.description || 'No description provided'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 w-fit px-2 py-1 rounded">
                                    <span className="font-medium text-foreground">{project.task_count}</span> Tasks
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
