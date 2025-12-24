'use client';

import { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '@/app/actions/notification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    async function fetchNotifications() {
        setLoading(true);
        try {
            const data = await getNotifications(page);
            setNotifications(data.notifications);
            setTotalPages(data.totalPages);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    async function handleMarkAsRead(id: string, link?: string) {
        await markAsRead(id);
        // Optimistic update
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        if (link) {
            router.push(link);
        }
    }

    async function handleMarkAllRead() {
        await markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
                    <p className="text-muted-foreground mt-1">Updates and activity involving you.</p>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={handleMarkAllRead} variant="outline" size="sm" className="gap-2">
                        <CheckCheck className="h-4 w-4" />
                        Mark all read
                    </Button>
                )}
            </div>

            <Card className="bg-card border-border">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Recent Notifications</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-8 text-center text-muted-foreground">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">No notifications found.</div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={cn(
                                        "flex items-start justify-between p-4 rounded-lg border transition-colors",
                                        notification.read ? "bg-background border-border" : "bg-muted/30 border-primary/20"
                                    )}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                                                notification.type === 'mention' ? "bg-blue-500/10 text-blue-500" :
                                                    notification.type === 'assignment' ? "bg-amber-500/10 text-amber-500" :
                                                        "bg-zinc-500/10 text-zinc-500"
                                            )}>
                                                {notification.type}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(notification.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground">{notification.content}</p>
                                        {notification.link && (
                                            <Button
                                                variant="link"
                                                className="p-0 h-auto text-primary text-sm mt-1"
                                                onClick={() => handleMarkAsRead(notification._id, notification.link)}
                                            >
                                                View Details
                                            </Button>
                                        )}
                                    </div>
                                    {!notification.read && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                            onClick={() => handleMarkAsRead(notification._id)}
                                            title="Mark as read"
                                        >
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </Button>
                                    )}
                                </div>
                            ))}

                            <div className="flex items-center justify-between pt-4">
                                <div className="text-sm text-muted-foreground">
                                    Page {page} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
