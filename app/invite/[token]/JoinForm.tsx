'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming button is available
import { Input } from '@/components/ui/input'; // Assuming input is available
import { Label } from '@/components/ui/label'; // Assuming label is available
import { joinOrganization } from '@/app/actions/org';

const initialState = {
    error: '',
};

export function JoinForm({ token, orgName }: { token: string; orgName: string }) {
    const [state, formAction, isPending] = useActionState(joinOrganization, initialState);

    return (
        <form action={formAction} className="w-full space-y-4">
            <input type="hidden" name="token" value={token} />

            <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-200">
                    Choose your username for {orgName}
                </Label>
                <Input
                    id="username"
                    name="username"
                    placeholder="e.g. jsmith or john.doe"
                    required
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-zinc-400">
                    This will be your unique identity within this organization.
                </p>
            </div>

            {state?.error && (
                <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-sm">
                    {state.error}
                </div>
            )}

            <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                size="lg"
                disabled={isPending}
            >
                {isPending ? 'Joining...' : 'Accept Invite & Join'}
            </Button>
        </form>
    );
}
