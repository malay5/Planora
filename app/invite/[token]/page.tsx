import { JoinForm } from './JoinForm';
import { Invitation, Organization } from '@/app/models';
import connectToDatabase from '@/app/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getSession } from '@/app/actions/auth';
import Link from 'next/link';

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    await connectToDatabase();

    const invite = await Invitation.findOne({ token, status: 'pending' });

    if (!invite) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Card className="items-center justify-center p-8 bg-zinc-900 border-zinc-800 text-zinc-100">
                    <CardHeader>
                        <CardTitle className="text-red-500">Invalid Invite</CardTitle>
                        <CardDescription>This invite link is invalid or has expired.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link href="/">
                            <Button variant="outline">Go Home</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const org: any = await Organization.findById(invite.organization_id);
    if (!org) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Card className="items-center justify-center p-8 bg-zinc-900 border-zinc-800 text-zinc-100">
                    <CardHeader>
                        <CardTitle className="text-red-500">Organization Not Found</CardTitle>
                        <CardDescription>The organization associated with this invite does not exist.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link href="/">
                            <Button variant="outline">Go Home</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }
    const session = await getSession();

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Join {String(org.name)}</CardTitle>
                    <CardDescription className="text-zinc-400">
                        You have been invited to join this organization on Startup OS.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {session ? (
                        <div className="text-center text-sm text-zinc-300">
                            Logged in as <span className="font-semibold text-white">{session.email}</span>
                        </div>
                    ) : (
                        <div className="p-4 bg-zinc-800/50 rounded-lg text-sm text-zinc-300 mb-4">
                            Note: You need to be logged in to accept this invite. If you don't have an account, please <Link href="/signup" className="text-indigo-400 underline">Sign up</Link> first.
                        </div>
                    )}

                    {session && <JoinForm token={token} orgName={org.name} />}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    {!session && (
                        <div className="w-full">
                            <Link href={`/login?next=/invite/${token}`}>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Login to Join</Button>
                            </Link>
                        </div>
                    )}
                    <Link href="/" className="w-full">
                        <Button variant="ghost" className="w-full text-zinc-400">
                            Decline
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
