import { Sidebar } from '@/app/components/Sidebar';
import { UserNav } from '@/app/components/UserNav';
import { getSession } from '@/app/actions/auth';
import { SandboxBanner } from '@/app/components/SandboxBanner';
import { User } from '@/app/models';
import connectToDatabase from '@/app/lib/db';

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ orgId: string }>;
}) {
    const { orgId } = await params;
    const session = await getSession();
    let isSandbox = false;

    if (session) {
        await connectToDatabase();
        const user = await User.findById(session.userId);
        if (user && user.email.startsWith('demo-')) {
            isSandbox = true;
        }
    }

    return (
        <div className="min-h-screen flex bg-background text-foreground">
            <SandboxBanner isSandbox={isSandbox} />
            <Sidebar orgId={orgId} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-16 peer-hover:ml-64 transition-all duration-300">
                <header className="h-14 border-b border-border flex items-center justify-end px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <UserNav />
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
