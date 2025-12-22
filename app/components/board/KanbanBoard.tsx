'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { updateTaskStatus } from '@/app/actions/task';
import { Button } from '@/components/ui/button';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BacklogReasonDialog } from '@/app/components/task/BacklogReasonDialog';
import { TaskSheet } from '@/app/components/task/TaskSheet';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Task {
    _id: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    order: number;
    description?: string;
    tags?: string[];
    taskId?: string;
    story_points?: number;
    assignee?: {
        name: string;
        avatar_url: string;
    };
}

interface KanbanBoardProps {
    initialColumns: { [key: string]: Task[] };
    projectKey: string;
}

export default function KanbanBoard({ initialColumns, projectKey }: KanbanBoardProps) {
    const [columns, setColumns] = useState(initialColumns);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isBacklogDialogOpen, setIsBacklogDialogOpen] = useState(false);
    const [taskToBacklog, setTaskToBacklog] = useState<Task | null>(null);

    useEffect(() => {
        setColumns(initialColumns);
    }, [initialColumns]);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Optimistic Update
        const startColumn = columns[source.droppableId];
        const finishColumn = columns[destination.droppableId];

        if (startColumn === finishColumn) {
            const newTaskIds = Array.from(startColumn);
            const [movedTask] = newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, movedTask);

            const newColumn = newTaskIds;

            setColumns({
                ...columns,
                [source.droppableId]: newColumn,
            });

            await updateTaskStatus(draggableId, source.droppableId, destination.index);
        } else {
            const startTaskIds = Array.from(startColumn);
            const [movedTask] = startTaskIds.splice(source.index, 1);
            movedTask.status = destination.droppableId; // Optimistically update status
            const finishTaskIds = Array.from(finishColumn);
            finishTaskIds.splice(destination.index, 0, movedTask);

            setColumns({
                ...columns,
                [source.droppableId]: startTaskIds,
                [destination.droppableId]: finishTaskIds,
            });

            await updateTaskStatus(draggableId, destination.droppableId, destination.index);
        }
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsSheetOpen(true);
    };



    const handleBacklogConfirm = async (reason: string) => {
        if (!taskToBacklog) return;

        const formData = new FormData();
        formData.append('title', taskToBacklog.title);
        formData.append('type', taskToBacklog.type);
        formData.append('status', 'Backlog');
        formData.append('priority', taskToBacklog.priority);
        formData.append('backlog_reason', reason);
        // Preserve tags/description if needed, but updateTask usually handles partials or we need to pass them.
        // The updateTask action we wrote rebuilds the object. We need to be careful.
        // ACTUALLY: updateTask action reads specific fields.
        // It reads title, description, type, priority, status, tags, backlog_reason.
        // So we MUST pass all of them or they might be overwritten with empty strings if the action doesn't handle missing fields well.
        // Let's check updateTask in task.ts. 
        // It does: const title = formData.get('title') as string; ... updateData = { title, ... }
        // So yes, we need to pass existing values.

        if (taskToBacklog.description) formData.append('description', taskToBacklog.description);
        if (taskToBacklog.tags) formData.append('tags', taskToBacklog.tags.join(', '));

        const { updateTask } = await import('@/app/actions/task');
        await updateTask(taskToBacklog._id, formData);

        setTaskToBacklog(null);
        window.location.reload();
    };

    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const handleDeleteClick = (taskId: string) => {
        setTaskToDelete(taskId);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;
        const { deleteTask } = await import('@/app/actions/task');
        await deleteTask(taskToDelete);
        setTaskToDelete(null);
        // No reload needed if server action revalidates and we sync state via useEffect
    };



    return (
        <div className="h-full overflow-x-auto">
            <div className="flex gap-4 h-full w-full pb-4 overflow-hidden">
                <DragDropContext onDragEnd={onDragEnd}>
                    {Object.entries(columns)
                        .filter(([columnId]) => columnId !== 'Backlog')
                        .map(([columnId, tasks]) => (
                            <div key={columnId} className="flex flex-col w-80 bg-muted/40 rounded-xl p-3 border border-border/50 backdrop-blur-sm">
                                <div className="flex items-center justify-between px-2 mb-4 mt-1">
                                    <h3 className="font-semibold text-foreground text-sm tracking-wide">{columnId}</h3>
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                        "bg-muted text-muted-foreground"
                                    )}>{tasks.length}</span>
                                </div>

                                <Droppable droppableId={columnId}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={cn(
                                                "flex-1 flex flex-col gap-3 min-h-[100px] transition-colors rounded-lg overflow-y-auto max-h-[calc(100vh-220px)] p-1",
                                                snapshot.isDraggingOver ? "bg-muted/30" : ""
                                            )}
                                        >
                                            {tasks.map((task, index) => (
                                                <Draggable key={task._id.toString()} draggableId={task._id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={provided.draggableProps.style}
                                                            className="group"
                                                        >
                                                            <ContextMenu>
                                                                <ContextMenuTrigger>
                                                                    <motion.div
                                                                        layoutId={task._id}
                                                                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                                                        whileTap={{ scale: 0.98 }}
                                                                        onClick={() => handleTaskClick(task)}
                                                                        className={cn(
                                                                            "bg-card border border-border rounded-lg p-4 shadow-sm transition-all duration-200 cursor-pointer group-hover:border-border/80 group-hover:shadow-md",
                                                                            snapshot.isDragging ? "opacity-90 scale-105 shadow-xl ring-2 ring-primary/50 rotate-2" : ""
                                                                        )}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-3">
                                                                            <span className={cn(
                                                                                "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider",
                                                                                task.type === 'Epic' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                                                                                    task.type === 'Story' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                                                                        task.type === 'Bug' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                                                                            "bg-muted text-muted-foreground border border-border"
                                                                            )}>
                                                                                {task.type}
                                                                            </span>
                                                                        </div>

                                                                        <div className="text-sm font-medium text-card-foreground mb-3 leading-snug">
                                                                            {task.title}
                                                                        </div>

                                                                        {task.tags && task.tags.length > 0 && (
                                                                            <div className="flex flex-wrap gap-1 mb-3">
                                                                                {task.tags.map(tag => (
                                                                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                                                                                        {tag}
                                                                                    </span>
                                                                                ))}
                                                                                {task.tags.map(tag => (
                                                                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                                                                                        {tag}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        )}

                                                                        {task.story_points !== undefined && (
                                                                            <div className="absolute top-4 right-4 flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400 border border-zinc-700 shadow-sm" title="Story Points">
                                                                                {task.story_points}
                                                                            </div>
                                                                        )}

                                                                        <div className="flex items-center justify-between mt-auto">
                                                                            <div className="flex items-center gap-2">
                                                                                {task.assignee ? (
                                                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white shadow-inner" title={task.assignee.name}>
                                                                                        {task.assignee.name.charAt(0)}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center" />
                                                                                )}
                                                                                {task.priority === 'High' && (
                                                                                    <span className="text-xs text-red-400 font-bold" title="High Priority">
                                                                                        !!!
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <span className="text-[10px] text-zinc-600 font-mono group-hover:text-zinc-500 transition-colors">
                                                                                {task._id.toString().substring(task._id.toString().length - 4)}
                                                                            </span>
                                                                        </div>
                                                                    </motion.div>
                                                                </ContextMenuTrigger>
                                                                <ContextMenuContent className="w-64 bg-popover border-border text-popover-foreground">
                                                                    <ContextMenuItem onClick={() => handleTaskClick(task)}>
                                                                        Open in Drawer
                                                                    </ContextMenuItem>
                                                                    <ContextMenuItem>Edit details...</ContextMenuItem>
                                                                    <ContextMenuSeparator className="bg-zinc-800" />
                                                                    <ContextMenuItem>Move to Top</ContextMenuItem>
                                                                    <ContextMenuItem>Move to Bottom</ContextMenuItem>
                                                                    <ContextMenuSeparator className="bg-zinc-800" />
                                                                    <ContextMenuItem className="text-amber-400 focus:text-amber-400" onClick={() => {
                                                                        setTaskToBacklog(task);
                                                                        setIsBacklogDialogOpen(true);
                                                                    }}>
                                                                        Move to Backlog
                                                                    </ContextMenuItem>
                                                                    <ContextMenuSeparator className="bg-border" />
                                                                    <ContextMenuItem className="text-red-400 focus:text-red-400" onClick={() => handleDeleteClick(task._id)}>
                                                                        Delete Task
                                                                    </ContextMenuItem>
                                                                </ContextMenuContent>
                                                            </ContextMenu>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            <div className="mt-2">
                                                <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-dashed border-border hover:border-muted-foreground py-3 text-xs transition-all">
                                                    + Create issue
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                </DragDropContext>
            </div>

            <TaskSheet
                task={selectedTask}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />

            <BacklogReasonDialog
                open={isBacklogDialogOpen}
                onOpenChange={setIsBacklogDialogOpen}
                onConfirm={handleBacklogConfirm}
            />

            <AlertDialog open={!!taskToDelete} onOpenChange={(open: boolean) => !open && setTaskToDelete(null)}>
                <AlertDialogContent className="bg-background border-border text-foreground">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the task.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setTaskToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
