'use client';

import { useEffect } from 'react';
import { loginAsDemo } from '@/app/actions/demo';

export default function SandboxPage() {
    useEffect(() => {
        // Trigger server action
        const initDemo = async () => {
            await loginAsDemo();
        };
        initDemo();
    }, []);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 animate-pulse">Initializing Sandbox Environment...</p>
        </div>
    );
}
