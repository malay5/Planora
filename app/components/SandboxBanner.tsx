'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

interface SandboxBannerProps {
    isSandbox: boolean;
}

export function SandboxBanner({ isSandbox }: SandboxBannerProps) {
    if (!isSandbox) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
            <div className="bg-amber-500/10 border border-amber-500/20 backdrop-blur-md text-amber-200 px-4 py-3 rounded-lg shadow-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    <div className="text-sm">
                        <p className="font-semibold text-amber-400">Sandbox/Demo Mode</p>
                        <p className="opacity-90">Data is temporary and visible only to you.</p>
                    </div>
                </div>
                <Link href="/signup" className="shrink-0">
                    <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm px-4 py-2 rounded-md transition-colors">
                        Sign Up to Save
                    </button>
                </Link>
            </div>
        </div>
    );
}
