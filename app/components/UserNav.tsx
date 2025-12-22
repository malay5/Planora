'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from '@/app/actions/auth';
import Link from 'next/link';

export function UserNav() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="outline-none rounded-full ring-offset-2 ring-offset-zinc-950 focus:ring-2 focus:ring-indigo-500 transition-all">
                    <Avatar className="h-8 w-8 hover:opacity-90 transition-opacity">
                        <AvatarImage src="/avatars/01.png" alt="@user" />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-medium text-xs">
                            SC
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-zinc-200" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">Guest User</p>
                        <p className="text-xs leading-none text-zinc-400">user@example.com</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white">
                    Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                    className="text-red-400 focus:text-red-400 hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                    onClick={() => logout()}
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
