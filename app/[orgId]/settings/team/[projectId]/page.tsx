'use client';

import { useState, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function TeamSettingsPage({ params }: { params: Promise<{ orgId: string, projectId: string }> }) {
    const { orgId, projectId } = use(params);
    const [isPrivate, setIsPrivate] = useState(false); // Should fetch initial state

    // This is a placeholder for now. 
    // We need to implement actions for updating project settings.

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Team Settings</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Privacy</CardTitle>
                        <CardDescription>
                            Control who can see this team and its tasks.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label htmlFor="private-mode">Private Team</Label>
                            <p className="text-sm text-muted-foreground">
                                Only invited members can see this team.
                            </p>
                        </div>
                        <Switch
                            id="private-mode"
                            checked={isPrivate}
                            onCheckedChange={setIsPrivate}
                        />
                    </CardContent>
                </Card>

                <Card className="border-red-500/20 bg-red-500/5">
                    <CardHeader>
                        <CardTitle className="text-red-500">Danger Zone</CardTitle>
                        <CardDescription>
                            Irreversible actions for this team.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive">Delete Team</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
