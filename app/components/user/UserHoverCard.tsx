'use client';

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail } from "lucide-react";

interface UserHoverCardProps {
    user: {
        name: string;
        avatar_url?: string;
        email?: string; // Optional if we want to show it
        bio?: string;
        title?: string;
        tags?: string[];
        role?: string;
        joined_at?: string | Date;
    };
    children: React.ReactNode;
}

export function UserHoverCard({ user, children }: UserHoverCardProps) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{user.name}</h4>
                        {user.title && (
                            <p className="text-sm text-muted-foreground">{user.title}</p>
                        )}
                        {user.bio && (
                            <p className="text-sm text-muted-foreground pt-2">
                                {user.bio}
                            </p>
                        )}

                        {(user.tags && user.tags.length > 0) && (
                            <div className="flex flex-wrap gap-1 pt-2">
                                {user.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center pt-2">
                            <span className="text-xs text-muted-foreground capitalize">
                                {user.role || 'Member'}
                            </span>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
