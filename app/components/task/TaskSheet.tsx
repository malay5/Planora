'use client';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { updateTask } from '@/app/actions/task';
import { CommentSection } from './CommentSection';

interface Task {
    _id: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    description?: string;
    tags?: string[];
    taskId?: string;
    story_points?: number;
    assignee?: {
        name: string;
        avatar_url: string;
    };
}

interface TaskSheetProps {
    task: Task | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TaskSheet({ task, open, onOpenChange }: TaskSheetProps) {
    if (!task) return null;

    const handleSubmit = async (formData: FormData) => {
        await updateTask(task._id, formData);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-background border-l border-border">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-xl font-bold text-foreground">
                        {task.title}
                    </SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                        Edit the details of your task.
                    </SheetDescription>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-mono text-muted-foreground">
                            {task.taskId || task._id.substring(task._id.length - 8).toUpperCase()}
                        </span>
                    </div>
                </SheetHeader>

                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</Label>
                        <Input
                            name="title"
                            defaultValue={task.title}
                            className="text-lg font-semibold bg-transparent border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground">Status</Label>
                            <Select name="status" defaultValue={task.status}>
                                <SelectTrigger className="bg-muted/50 border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="Backlog">Backlog</SelectItem>
                                    <SelectItem value="Todo">Todo</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Review">Review</SelectItem>
                                    <SelectItem value="Done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground">Priority</Label>
                            <Select name="priority" defaultValue={task.priority}>
                                <SelectTrigger className="bg-muted/50 border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground">Type</Label>
                            <Select name="type" defaultValue={task.type}>
                                <SelectTrigger className="bg-muted/50 border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="Story">Story</SelectItem>
                                    <SelectItem value="Task">Task</SelectItem>
                                    <SelectItem value="Bug">Bug</SelectItem>
                                    <SelectItem value="Epic">Epic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-muted-foreground">Points</Label>
                            <Input
                                name="story_points"
                                type="number"
                                defaultValue={task.story_points}
                                className="bg-muted/50 border-border"
                                placeholder="e.g. 5"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label htmlFor="tags" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</Label>
                        <Input
                            name="tags"
                            defaultValue={task.tags?.join(', ')}
                            className="bg-muted/50 border-border placeholder:text-muted-foreground/50"
                            placeholder="e.g. Design, Backend, Urgent (comma separated)"
                        />
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label htmlFor="description" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</Label>
                        <Textarea
                            name="description"
                            defaultValue={task.description}
                            className="min-h-[200px] bg-muted/30 border-border focus:bg-muted/50 transition-all font-sans"
                            placeholder="Add a more detailed description..."
                        />
                    </div>

                    <div className="pt-6 flex justify-end gap-2">
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Save Changes
                        </Button>
                    </div>
                </form>

                <CommentSection taskId={task._id} />
            </SheetContent>
        </Sheet>
    );
}
