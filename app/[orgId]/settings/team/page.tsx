'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TeamSettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-semibold tracking-tight">Team Settings</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your team preferences.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Team Details</CardTitle>
                    <CardDescription>
                        Configure your team's display name.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="teamName">Team Name</Label>
                            <Input id="teamName" placeholder="Engineering" />
                        </div>
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
