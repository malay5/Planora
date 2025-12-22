"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Moon, Sun, Monitor, Coffee, Circle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function SettingsDialog() {
    const { theme, setTheme } = useTheme()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-foreground">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background border-border text-foreground">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Customize your workspace appearance and preferences.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                        <h4 className="font-medium leading-none">Appearance</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <ThemeButton
                                currentTheme={theme}
                                setTheme={setTheme}
                                themeKey="dark"
                                icon={<Moon className="h-4 w-4" />}
                                label="Dark"
                            />
                            <ThemeButton
                                currentTheme={theme}
                                setTheme={setTheme}
                                themeKey="light"
                                icon={<Sun className="h-4 w-4" />}
                                label="Light"
                            />
                            <ThemeButton
                                currentTheme={theme}
                                setTheme={setTheme}
                                themeKey="soothing"
                                icon={<Coffee className="h-4 w-4" />}
                                label="Soothing"
                            />
                            <ThemeButton
                                currentTheme={theme}
                                setTheme={setTheme}
                                themeKey="standard"
                                icon={<Circle className="h-4 w-4" />}
                                label="Standard"
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function ThemeButton({ currentTheme, setTheme, themeKey, icon, label }: any) {
    const isActive = currentTheme === themeKey
    return (
        <Button
            variant="outline"
            className={cn(
                "justify-start gap-2 h-auto py-3 px-4",
                isActive ? "border-primary bg-primary/10 text-primary" : "border-input hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => setTheme(themeKey)}
        >
            {icon}
            <div className="flex flex-col items-start">
                <span className="font-medium text-xs">{label}</span>
            </div>
        </Button>
    )
}
