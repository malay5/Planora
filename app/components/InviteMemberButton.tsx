'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateInviteLink } from '@/app/actions/org';
import { Copy, Plus, Check } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function InviteMemberButton({ orgId }: { orgId: string }) {
    const [open, setOpen] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const link = await generateInviteLink(orgId);
            setInviteLink(link);
        } catch (error) {
            console.error('Failed to generate link', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto" onClick={() => setInviteLink('')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Invite Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Generate a link to invite a new member to your organization.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={inviteLink}
                            readOnly
                            placeholder="Click generate to get a link"
                            className="bg-zinc-950 border-zinc-700 focus-visible:ring-indigo-500"
                        />
                    </div>
                    {inviteLink ? (
                        <Button onClick={handleCopy} size="sm" className="px-3 bg-zinc-800 hover:bg-zinc-700">
                            {hasCopied ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                            <span className="sr-only">Copy</span>
                        </Button>
                    ) : (
                        <Button onClick={handleGenerate} size="sm" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                            {isLoading ? '...' : 'Generate'}
                        </Button>
                    )}
                </div>
                <DialogFooter className="sm:justify-start">
                    <p className="text-xs text-zinc-500">
                        This link is valid for 24 hours. Anyone with the link can join.
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
