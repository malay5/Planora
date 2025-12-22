'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { login } from '@/app/actions/auth';

const initialState = {
    error: '',
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-zinc-900/0 pointers-events-none" />
                <div className="z-10">
                    <h1 className="text-2xl font-bold tracking-tighter">Startup OS</h1>
                </div>
                <div className="z-10 max-w-md space-y-4">
                    <blockquote className="text-lg font-medium leading-relaxed text-zinc-300">
                        &ldquo;The only way to build a great company is to focus on what matters. Startup OS helps us do exactly that.&rdquo;
                    </blockquote>
                    <div className="text-sm text-zinc-500">- Malay, Co-founder</div>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex items-center justify-center p-8 bg-black/95 text-zinc-100">
                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-zinc-400">Enter your credentials to access your workspace</p>
                    </div>

                    <Card className="border-zinc-800 bg-zinc-900/50 text-zinc-100">
                        <form action={formAction}>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Sign in with your email and password
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@startup.os"
                                        className="bg-zinc-950 border-zinc-700 focus-visible:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="bg-zinc-950 border-zinc-700 focus-visible:ring-indigo-500"
                                        required
                                    />
                                </div>
                                {state?.error && (
                                    <p className="text-sm text-red-500">{state.error}</p>
                                )}
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                                    disabled={isPending}
                                >
                                    {isPending ? 'Signing In...' : 'Sign In'}
                                </Button>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-zinc-800" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300">
                                    Google
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    <p className="px-8 text-center text-sm text-zinc-500">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="underline underline-offset-4 hover:text-indigo-400">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
