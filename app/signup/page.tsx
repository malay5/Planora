'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { signup } from '@/app/actions/auth';

const initialState = {
    error: '',
}

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(signup, initialState);

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
                        &ldquo;Join thousands of founders building the future. Your operating system for success starts here.&rdquo;
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex items-center justify-center p-8 bg-black/95 text-zinc-100">
                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
                        <p className="text-zinc-400">Get started with your organization</p>
                    </div>

                    <Card className="border-zinc-800 bg-zinc-900/50 text-zinc-100">
                        <form action={formAction}>
                            <CardHeader>
                                <CardTitle>Sign Up</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Enter your details to create your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        className="bg-zinc-950 border-zinc-700 focus-visible:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
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
                                    {isPending ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    <p className="px-8 text-center text-sm text-zinc-500">
                        Already have an account?{' '}
                        <Link href="/login" className="underline underline-offset-4 hover:text-indigo-400">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
