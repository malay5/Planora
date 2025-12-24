'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronsUpDown, Plus, Check, Search, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserOrganizations, switchOrganization, createOrganization } from '@/app/actions/org';
import { useRouter } from 'next/navigation';

interface Org {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
}

export function OrgNavigation({ isCollapsed }: { isCollapsed: boolean }) {
    const [open, setOpen] = useState(false);
    const [orgs, setOrgs] = useState<Org[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadOrgs();
    }, []);

    const loadOrgs = async () => {
        const data = await getUserOrganizations();
        setOrgs(data);
        const active = data.find((o: Org) => o.isActive);
        if (active) setSelectedOrg(active);
    };

    const handleSwitch = async (orgId: string) => {
        await switchOrganization(orgId);
        setOpen(false);
        window.location.href = `/${orgId}`;
    };

    const handleCreateOrg = async () => {
        if (!searchQuery.trim()) return;
        setIsCreating(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('orgName', searchQuery);

            const result = await createOrganization(null, formData);
            if (result?.success && result.orgId) {
                await switchOrganization(result.orgId);
                setOpen(false);
                setSearchQuery('');
                window.location.href = `/${result.orgId}`;
            } else {
                setError(result?.error || 'Failed to create organization');
            }
        } catch (e) {
            setError('An unexpected error occurred');
        } finally {
            setIsCreating(false);
        }
    };

    const filteredOrgs = useMemo(() => {
        if (!searchQuery) return orgs;
        return orgs.filter(org => org.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [orgs, searchQuery]);

    const activeOrg = orgs.find(o => o.isActive) || orgs[0];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 px-2",
                        isCollapsed ? "justify-center px-0" : "px-3"
                    )}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            {activeOrg?.name.charAt(0) || <Building2 className="h-4 w-4" />}
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col items-start text-left text-sm flex-1 overflow-hidden">
                                <span className="font-semibold truncate w-full">{activeOrg?.name || "Select Org"}</span>
                                <span className="text-xs text-muted-foreground truncate w-full">Free Plan</span>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0 ml-2 bg-popover border-border" align="start">
                <div className="flex flex-col">
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search organization..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="max-h-[200px] overflow-y-auto p-1">
                        {filteredOrgs.length > 0 && (
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                Organizations
                            </div>
                        )}
                        {filteredOrgs.map((org) => (
                            <button
                                key={org.id}
                                onClick={() => handleSwitch(org.id)}
                                className={cn(
                                    "w-full flex items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer",
                                    org.isActive && "bg-accent/50"
                                )}
                            >
                                <Avatar className="mr-2 h-5 w-5 rounded-md border">
                                    <AvatarFallback className="rounded-md bg-primary/10 text-xs">
                                        {org.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                {org.name}
                                <Check
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        org.isActive ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="p-1 border-t border-border">
                        <button
                            onClick={handleCreateOrg}
                            disabled={isCreating || !searchQuery.trim()}
                            className={cn(
                                "w-full flex items-center rounded-sm px-2 py-1.5 text-sm outline-none font-medium transition-colors",
                                !searchQuery.trim()
                                    ? "text-muted-foreground opacity-50 cursor-not-allowed"
                                    : "text-primary hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            )}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {isCreating
                                ? "Creating..."
                                : (searchQuery ? `Create "${searchQuery}"` : "Create New Organization")}
                        </button>
                        {error && <div className="px-2 pb-1.5 text-xs text-red-500 font-medium">{error}</div>}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
