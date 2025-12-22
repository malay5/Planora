"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TaskSheet } from "@/app/components/task/TaskSheet"
import { updateTaskStatus } from "@/app/actions/task"
import { ArrowRight, MoreHorizontal } from "lucide-react"
import { QuickTaskInput } from "@/app/components/task/QuickTaskInput"

interface Task {
    _id: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    description?: string;
    tags?: string[];
    assignee?: {
        name: string;
        avatar_url: string;
    };
}

interface BacklogListProps {
    tasks: Task[]
    projectKey: string
}

export function BacklogList({ tasks, projectKey }: BacklogListProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task)
        setIsSheetOpen(true)
    }

    const moveToBoard = async (taskId: string) => {
        // Move to Todo column at index 0
        await updateTaskStatus(taskId, "Todo", 0)
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Backlog</h1>
                    <p className="text-muted-foreground text-sm">Tasks that are not yet ready for the board.</p>
                </div>
                <Button variant="outline">Create Issue</Button>
            </div>

            <QuickTaskInput projectKey={projectKey} />

            <div className="flex-1 overflow-auto bg-zinc-900/30 rounded-lg border border-zinc-800/50">
                {tasks.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        No tasks in backlog.
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-800">
                        {tasks.map((task) => (
                            <div
                                key={task._id}
                                className="group flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                                onClick={() => handleTaskClick(task)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "text-[10px] w-12 text-center uppercase font-bold px-1.5 py-0.5 rounded tracking-wider border",
                                        task.type === 'Epic' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            task.type === 'Story' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                task.type === 'Bug' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                    "bg-zinc-800 text-zinc-400 border-zinc-700"
                                    )}>
                                        {task.type}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-zinc-200">{task.title}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-zinc-500 font-mono">
                                                {task._id.toString().substring(task._id.toString().length - 4)}
                                            </span>
                                            {task.tags?.map((tag: string) => (
                                                <span key={tag} className="text-[10px] text-zinc-500 bg-zinc-800/50 px-1 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {task.assignee && (
                                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">
                                            {task.assignee.name.charAt(0)}
                                        </div>
                                    )}
                                    <div
                                        className="text-xs font-medium text-zinc-400 px-2 py-1 bg-zinc-800 rounded hover:bg-zinc-700 hover:text-white transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            moveToBoard(task._id);
                                        }}
                                    >
                                        Move to Board <ArrowRight className="inline w-3 h-3 ml-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <TaskSheet
                task={selectedTask}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </div>
    )
}
