'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Check, Briefcase } from 'lucide-react';
import { createOrganization, getUserOrganizations, switchOrganization } from '@/app/actions/org';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Org {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
}

export function OrgSwitcherDialog({ trigger, isHovered }: { trigger?: React.ReactNode, isHovered?: boolean }) {
    const [open, setOpen] = useState(false);
    const [orgs, setOrgs] = useState<Org[]>([]);
    const [loading, setLoading] = useState(false);
    const [newOrgName, setNewOrgName] = useState('');
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'switch' | 'create'>('switch');
    const router = useRouter();

    useEffect(() => {
        if (open) {
            loadOrgs();
            setError('');
            setNewOrgName('');
            setMode('switch');
        }
    }, [open]);

    const loadOrgs = async () => {
        const data = await getUserOrganizations();
        setOrgs(data);
    };

    const handleSwitch = async (orgId: string) => {
        setLoading(true);
        const result = await switchOrganization(orgId);
        if (result?.success) {
            setOpen(false);
            window.location.href = `/${orgId}/dashboard`;
        }
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const formData = new FormData();
        formData.append('orgName', newOrgName);

        const result = await createOrganization(null, formData);
        if (result?.success && result.orgId) {
            await switchOrganization(result.orgId);
            setOpen(false);
            setMode('switch');
            setNewOrgName('');
            window.location.href = `/${result.orgId}/dashboard`;
        } else if (result?.error) {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <button className={cn(
                        "flex items-center gap-3 px-3 py-2 mx-2 rounded-lg transition-colors group relative w-full",
                        "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        !isHovered && "justify-center"
                    )}>
                        <Briefcase size={20} className="shrink-0" />
                        <span className={cn(
                            "whitespace-nowrap transition-all duration-300 overflow-hidden text-left",
                            isHovered ? "w-auto opacity-100" : "w-0 opacity-0"
                        )}>
                            Switch Org
                        </span>
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background border-border text-foreground">
                <DialogHeader>
                    <DialogTitle>{mode === 'switch' ? 'Switch Organization' : 'Create Organization'}</DialogTitle>
                </DialogHeader>

                {mode === 'switch' ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {orgs.map((org) => (
                                <button
                                    key={org.id}
                                    onClick={() => handleSwitch(org.id)}
                                    disabled={loading}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 rounded-md transition-colors border",
                                        org.isActive
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "bg-card border-border hover:bg-muted/50 hover:border-muted-foreground/50"
                                    )}
                                >
                                    <span className="font-medium">{org.name}</span>
                                    {org.isActive && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-dashed border-muted-foreground/30 hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                            onClick={() => setMode('create')}
                        >
                            <Plus size={16} className="mr-2" />
                            Create New Organization
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="orgName">Organization Name</Label>
                            <Input
                                id="orgName"
                                value={newOrgName}
                                onChange={(e) => setNewOrgName(e.target.value)}
                                className="bg-input border-border"
                                placeholder="Acme Corp"
                                required
                            />
                        </div>
                        {error && <div className="text-sm text-red-500">{error}</div>}
                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="ghost" onClick={() => setMode('switch')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
                                {loading ? 'Creating...' : 'Create & Switch'}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
