'use client';

import { useState, useEffect } from 'react';
import { getBoardData, updateTaskStatus } from '@/app/actions/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Loader2 } from 'lucide-react';
import { TaskSheet } from '@/app/components/task/TaskSheet';

export default function BacklogPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    useEffect(() => {
        loadBacklog();
    }, []);

    const loadBacklog = async () => {
        setLoading(true);
        try {
            const data: any = await getBoardData();
            // Filter strictly for Backlog
            const backlogTasks = data.columns['Backlog'] || [];
            setTasks(backlogTasks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const moveToBoard = async (taskId: string) => {
        // Move to 'Todo' (index 0 for simplicity, or append)
        await updateTaskStatus(taskId, 'Todo', 0);
        await loadBacklog(); // Refresh
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-zinc-500" /></div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Backlog</h1>
                    <p className="text-zinc-500">Tasks that are not currently prioritized for the active sprint.</p>
                </div>
                <Badge variant="outline" className="text-zinc-400 border-zinc-700 bg-zinc-900">
                    {tasks.length} Issues
                </Badge>
            </div>

            <div className="space-y-4">
                {tasks.length === 0 ? (
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardContent className="flex flex-col items-center justify-center h-48 text-zinc-500">
                            No tasks in backlog.
                        </CardContent>
                    </Card>
                ) : (
                    tasks.map((task) => (
                        <Card key={task._id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors group">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => { setSelectedTask(task); setSheetOpen(true); }}>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700">
                                            {task.type}
                                        </Badge>
                                        <span className="font-mono text-xs text-zinc-600">
                                            {task._id.substring(task._id.length - 4)}
                                        </span>
                                    </div>
                                    <div className="font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors">
                                        {task.title}
                                    </div>
                                    {task.backlog_reason && (
                                        <span className="text-xs text-amber-500/80 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/50">
                                            Reason: {task.backlog_reason}
                                        </span>
                                    )}
                                </div>
                                <Button size="sm" variant="ghost" className="text-zinc-400 hover:text-white hover:bg-indigo-600/20" onClick={() => moveToBoard(task._id)}>
                                    Move to Board <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <TaskSheet
                task={selectedTask}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            />
        </div>
    );
}
