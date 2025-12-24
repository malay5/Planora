'use client';

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>
                            Customize the look and feel of the application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium leading-none">Theme</h4>
                                <p className="text-sm text-muted-foreground">
                                    Select your preferred theme.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                                >
                                    <div className="w-full h-20 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                                        <Sun className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <span className="text-sm font-medium">Light</span>
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                                >
                                    <div className="w-full h-20 rounded-lg bg-slate-950 border border-slate-800 shadow-sm flex items-center justify-center">
                                        <Moon className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium">Dark</span>
                                </button>
                                <button
                                    onClick={() => setTheme('soothing')}
                                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'soothing' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                                >
                                    <div className="w-full h-20 rounded-lg bg-[#f0f9fa] border border-cyan-100 shadow-sm flex items-center justify-center">
                                        <div className="h-6 w-6 rounded-full bg-cyan-200" />
                                    </div>
                                    <span className="text-sm font-medium">Soothing</span>
                                </button>
                                <button
                                    onClick={() => setTheme('nature')}
                                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'nature' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
                                >
                                    <div className="w-full h-20 rounded-lg bg-[#f0fdf4] border border-green-100 shadow-sm flex items-center justify-center">
                                        <div className="h-6 w-6 rounded-full bg-green-200" />
                                    </div>
                                    <span className="text-sm font-medium">Nature</span>
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <Link href="/dashboard/settings/organization">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle>Organization Settings</CardTitle>
                                <CardDescription>
                                    Manage members, invites, and organization details.
                                </CardDescription>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                    </Link>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                            Manage your public profile and account settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Profile settings coming soon...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
