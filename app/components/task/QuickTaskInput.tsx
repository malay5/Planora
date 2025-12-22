"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createTask } from "@/app/actions/task"
import { Plus, CornerDownLeft } from "lucide-react"

export function QuickTaskInput({ projectKey }: { projectKey: string }) {
    const [value, setValue] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!value.trim()) return

        setIsSubmitting(true)
        const formData = new FormData()
        formData.append("title", value)
        formData.append("status", "Backlog") // Default to Backlog for Quick Add
        formData.append("type", "Task")
        formData.append("priority", "Medium")

        // Create task
        await createTask(null, formData)

        setValue("")
        setIsSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit} className="relative mb-6 group">
            <div className="relative flex items-center">
                <Plus className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                <Input
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Quick add a task to backlog... (Press Enter)"
                    className="pl-12 pr-12 h-14 bg-zinc-900/50 border-zinc-800 text-lg shadow-sm focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 placeholder:text-zinc-600 rounded-xl transition-all"
                />
                <div className="absolute right-3">
                    <Button
                        size="icon"
                        variant="ghost"
                        type="submit"
                        disabled={!value.trim() || isSubmitting}
                        className="h-9 w-9 text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10"
                    >
                        <CornerDownLeft className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="absolute -bottom-5 left-2 text-[10px] text-zinc-600 opacity-0 group-focus-within:opacity-100 transition-opacity">
                Tasks default to <strong>Backlog</strong> & <strong>Medium Priority</strong>
            </div>
        </form>
    )
}
