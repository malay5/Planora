'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';
import { getUserOrganizations } from '@/app/actions/org';

export default function OrganizationSettingsPage() {
    const [orgName, setOrgName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch current org details
        getUserOrganizations().then((orgs: any[]) => {
            const active = orgs.find(o => o.isActive);
            if (active) setOrgName(active.name);
        });
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement update logic
        alert("Organization Update Copilot: Pending Implementation");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-semibold tracking-tight">Organization Settings</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your organization's profile and settings.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Organization Profile</CardTitle>
                    <CardDescription>
                        Display name and public information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="orgName">Organization Name</Label>
                            <Input
                                id="orgName"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                placeholder="Enter organization name"
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>
                        Irreversible and destructive actions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive">
                        Delete Organization
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
