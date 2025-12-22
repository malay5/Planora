'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ListTodo, Settings, LogOut, ChevronRight, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { OrgNavigation } from './sidebar/OrgNavigation';

export function Sidebar() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-full z-40 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
                isHovered ? "w-64 shadow-2xl" : "w-16"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="h-16 flex items-center justify-center border-b border-sidebar-border px-2">
                <OrgNavigation isCollapsed={!isHovered} />
            </div>

            <div className="flex-1 py-4 flex flex-col gap-2 overflow-x-hidden">
                <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Board" isHovered={isHovered} />
                <NavItem href="/dashboard/backlog" icon={<ListTodo size={20} />} label="Backlog" isHovered={isHovered} />

                <div className={cn("my-2 border-t border-sidebar-border mx-4 transition-opacity", !isHovered && "opacity-0 group-hover:opacity-100")} />

                {isHovered && (
                    <div className="mt-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider animate-in fade-in slide-in-from-left-2">
                        Platform
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-sidebar-border mt-auto">
                <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Settings" isHovered={isHovered} />
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label, isHovered }: { href: string, icon: React.ReactNode, label: string, isHovered: boolean }) {
    return (
        <Link href={href} className={cn(
            "flex items-center gap-3 px-3 py-2 mx-2 rounded-lg transition-colors group relative",
            "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            !isHovered && "justify-center"
        )}>
            <span className="shrink-0">{icon}</span>
            <span className={cn(
                "whitespace-nowrap transition-all duration-300 overflow-hidden",
                isHovered ? "w-auto opacity-100" : "w-0 opacity-0"
            )}>
                {label}
            </span>
            {!isHovered && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-sidebar text-sidebar-foreground text-xs rounded border border-sidebar-border opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {label}
                </div>
            )}
        </Link>
    );
}
