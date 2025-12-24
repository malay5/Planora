'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { createTask } from '@/app/actions/task';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {pending ? 'Creating...' : 'Create Issue'}
        </Button>
    );
}

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function CreateTaskDialog({ projectId }: { projectId?: string }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        if (projectId) {
            formData.append('projectId', projectId);
        }
        await createTask(null, formData);
        setOpen(false);
        startTransition(() => {
            router.refresh();
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background border-border text-foreground">
                <DialogHeader>
                    <DialogTitle>Create Issue</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Add a new task to your board. It will start in the <strong>Todo</strong> column.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right text-muted-foreground">
                                Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                className="col-span-3 bg-input border-border"
                                placeholder="e.g., Fix login bug"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right text-muted-foreground">
                                Type
                            </Label>
                            <div className="col-span-3">
                                <Select name="type" defaultValue="Task">
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="Epic">Epic</SelectItem>
                                        <SelectItem value="Story">Story</SelectItem>
                                        <SelectItem value="Task">Task</SelectItem>
                                        <SelectItem value="Bug">Bug</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right text-muted-foreground">
                                Priority
                            </Label>
                            <div className="col-span-3">
                                <Select name="priority" defaultValue="Medium">
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="assignee" className="text-right text-muted-foreground">
                                Assignee
                            </Label>
                            <Input
                                id="assignee"
                                name="assignee"
                                className="col-span-3 bg-input border-border"
                                placeholder="Assignee User ID (Optional)"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right text-muted-foreground">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                className="col-span-3 bg-input border-border"
                                placeholder="Add details..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
