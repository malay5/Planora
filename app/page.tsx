import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="px-6 h-16 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-sm" />
          <span className="font-bold tracking-tight">Startup OS</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black pointer-events-none" />

        <div className="z-10 max-w-3xl space-y-4">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">
            Build your future. <br /> Manage your chaos.
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            The all-in-one operating system for high-growth startups.
            Track tasks, investors, metrics, and team alignment in one beautiful interface.
          </p>
        </div>

        <div className="z-10 flex flex-col sm:flex-row gap-4">
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8 text-lg bg-indigo-600 hover:bg-indigo-700">
              Start Building
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="h-12 px-8 text-lg border-zinc-700 bg-zinc-900 hover:bg-zinc-800">
              Demo Login
            </Button>
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-zinc-600 text-sm border-t border-zinc-900">
        &copy; {new Date().getFullYear()} Startup OS. Built for speed.
      </footer>
    </div>
  );
}
