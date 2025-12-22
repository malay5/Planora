'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BacklogReasonDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => void;
}

export function BacklogReasonDialog({ open, onOpenChange, onConfirm }: BacklogReasonDialogProps) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason);
            setReason('');
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle>Move to Backlog</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Please provide a reason for moving this task to the backlog.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g., Deprioritized for now, waiting on external dependency..."
                        className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500 min-h-[100px]"
                    />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-zinc-800 hover:text-zinc-100">Cancel</Button>
                    <Button onClick={handleConfirm} disabled={!reason.trim()} className="bg-amber-600 hover:bg-amber-700 text-white border-none">
                        Move to Backlog
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
