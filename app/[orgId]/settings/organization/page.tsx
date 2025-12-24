'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getOrganizationDetails, getOrgMembers, generateInviteLink } from '@/app/actions/org';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Copy, Users, Building, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function OrganizationSettingsPage() {
    const [org, setOrg] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteLink, setInviteLink] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const orgData = await getOrganizationDetails();
        const membersData = await getOrgMembers(orgData?._id);
        setOrg(orgData);
        setMembers(membersData);
        setLoading(false);
    };

    const handleInvite = async () => {
        if (!org) return;
        try {
            const link = await generateInviteLink(org._id);
            setInviteLink(link);
        } catch (error) {
            console.error(error);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        // Toast?
    };

    if (loading) {
        return <div className="p-8 text-muted-foreground">Loading organization settings...</div>;
    }

    if (!org) {
        return <div className="p-8 text-red-500">Organization not found.</div>;
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Organization Settings</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-muted/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{members.length}</div>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Created</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Date(org.created_at || Date.now()).toLocaleDateString()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Details about your organization.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input id="orgName" value={org.name} readOnly className="bg-muted" />
                        <p className="text-xs text-muted-foreground">Organization names cannot be changed at this time.</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>Manage your team members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end mb-4">
                        <Button onClick={handleInvite} className="bg-primary text-primary-foreground">
                            Generate Invite Link
                        </Button>
                    </div>
                    {inviteLink && (
                        <div className="mb-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between border border-border">
                            <code className="text-xs bg-black/20 p-2 rounded flex-1 mr-4 overflow-hidden text-ellipsis">
                                {inviteLink}
                            </code>
                            <Button size="icon" variant="ghost" onClick={copyLink}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.userId}>
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{member.name}</span>
                                            <span className="text-xs text-muted-foreground">{member.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{member.role}</TableCell>
                                    <TableCell>{new Date(member.joinedAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
