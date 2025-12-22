'use client';

import { useState, useEffect } from 'react';
import { getTrashTasks, restoreTask, permanentlyDeleteTask } from '@/app/actions/task';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TrashPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchTrash() {
        setLoading(true);
        try {
            const data = await getTrashTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch trash:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTrash();
    }, []);

    async function handleRestore(id: string) {
        await restoreTask(id);
        setTasks(prev => prev.filter(t => t._id !== id));
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
            await permanentlyDeleteTask(id);
            setTasks(prev => prev.filter(t => t._id !== id));
        }
    }

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Trash</h1>
                    <p className="text-muted-foreground mt-1">Manage deleted tasks. Items here are effectively archived until permanently deleted.</p>
                </div>
            </div>

            <Card className="bg-card border-border">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Deleted Tasks</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-8 text-center text-muted-foreground">Loading trash...</div>
                    ) : tasks.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">Trash is empty.</div>
                    ) : (
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <div key={task._id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-xs">{task.taskId}</Badge>
                                            <span className="text-sm font-medium">{task.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground px-2">
                                            Deleted: {task.deleted_at ? new Date(task.deleted_at).toLocaleString() : 'Unknown'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRestore(task._id)}
                                            className="gap-2"
                                        >
                                            <RotateCcw className="h-3 w-3" />
                                            Restore
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(task._id)}
                                            className="gap-2"
                                        >
                                            <AlertTriangle className="h-3 w-3" />
                                            Delete Forever
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
