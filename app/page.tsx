import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, X, Zap, Layout, BarChart, ArrowRight, Play } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-sm" />
            <span className="font-bold tracking-tight">Startup OS</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-white text-black hover:bg-zinc-200">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.0 Now Available
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-zinc-500 max-w-4xl mx-auto leading-[1.1]">
            Project management that moves as fast as you do.
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Align your engineering, product, and leadership teams in one view.
            Connect daily tasks to high-level company goals without the clutter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 group">
                Get Started for Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/sandbox">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white group">
                <Play className="mr-2 w-4 h-4 fill-current group-hover:text-indigo-400 transition-colors" />
                Explore Sandbox
              </Button>
            </Link>
          </div>

          {/* Hero Product Shot (Placeholder/CSS Art) */}
          <div className="mt-16 sm:mt-24 relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] -z-10 rounded-full mix-blend-screen" />
            <div className="relative rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm shadow-2xl overflow-hidden aspect-[16/9] group">
              {/* Fake UI Header */}
              <div className="h-12 border-b border-white/10 bg-zinc-900 flex items-center px-4 gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="ml-4 h-6 w-64 bg-zinc-800 rounded-md" />
              </div>
              {/* Fake UI Body */}
              <div className="flex h-full">
                <div className="w-64 border-r border-white/5 bg-zinc-900/50 p-4 space-y-4 hidden md:block">
                  <div className="h-8 w-full bg-zinc-800 rounded-md" />
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-zinc-800/50 rounded" />
                    <div className="h-4 w-1/2 bg-zinc-800/50 rounded" />
                    <div className="h-4 w-5/6 bg-zinc-800/50 rounded" />
                  </div>
                </div>
                <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Kanban Columns */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-900/50 rounded-lg p-3 space-y-3 border border-white/5">
                      <div className="h-6 w-24 bg-zinc-800 rounded mb-2" />
                      <div className="bg-zinc-800/80 p-3 rounded border border-white/5 space-y-2 hover:border-indigo-500/50 transition-colors cursor-pointer group/card">
                        <div className="h-4 w-3/4 bg-zinc-700 rounded group-hover/card:bg-indigo-500/20 transition-colors" />
                        <div className="h-3 w-1/2 bg-zinc-700/50 rounded" />
                        <div className="flex justify-between mt-2">
                          <div className="h-5 w-5 rounded-full bg-zinc-600" />
                          <div className="h-5 w-12 rounded bg-zinc-700/30" />
                        </div>
                      </div>
                      <div className="bg-zinc-800/80 p-3 rounded border border-white/5 space-y-2">
                        <div className="h-4 w-5/6 bg-zinc-700 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Overlay Text for "Live Preview" effect */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Link href="/sandbox">
                  <Button size="lg" className="bg-white text-black hover:bg-zinc-200 scale-100 sm:scale-125 transition-transform">
                    Enter Live Playground
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y border-white/5 bg-zinc-900/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-8">Trusted by high-growth teams</p>
            <div className="flex flex-wrap justify-center gap-12 sm:gap-20 opacity-50 contrast-0 grayscale">
              {/* Placeholders for logos (Text for now) */}
              <span className="text-xl font-bold font-mono">ACME</span>
              <span className="text-xl font-bold font-serif">Globex</span>
              <span className="text-xl font-bold font-sans">Soylent</span>
              <span className="text-xl font-bold font-mono">Initech</span>
              <span className="text-xl font-bold font-serif">Umbrella</span>
            </div>
          </div>
        </section>

        {/* Features / Benefits */}
        <section className="py-24 container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Built for Speed</h3>
              <p className="text-zinc-400 leading-relaxed">
                Keyboard shortcuts for everything. Load times under 100ms. No waiting for Jira to spin up.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center text-pink-400 mb-4">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Context Aware</h3>
              <p className="text-zinc-400 leading-relaxed">
                Switch between Team and Org views instantly. Keep your engineering backlog separate from company OKRs.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-4">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Data Driven</h3>
              <p className="text-zinc-400 leading-relaxed">
                Visualize progress with automatic burndown charts and velocity tracking. No plugins required.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Section (Vs Jira) */}
        <section className="py-24 bg-gradient-to-b from-zinc-900/50 to-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why teams switch</h2>
              <p className="text-zinc-400">Stop fighting your tools. Start shipping.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* The Old Way */}
              <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-6">
                <h3 className="text-xl font-bold text-zinc-500">The Other Guys</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-zinc-400">
                    <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Cluttered interface with hundreds of fields</span>
                  </li>
                  <li className="flex items-start gap-3 text-zinc-400">
                    <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Slow load times requiring page refreshes</span>
                  </li>
                  <li className="flex items-start gap-3 text-zinc-400">
                    <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Requires a dedicated administrator</span>
                  </li>
                  <li className="flex items-start gap-3 text-zinc-400">
                    <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Disconnected from company goals</span>
                  </li>
                </ul>
              </div>

              {/* Startup OS */}
              <div className="p-8 rounded-2xl bg-zinc-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <div className="w-32 h-32 bg-indigo-500 blur-[80px] rounded-full" />
                </div>
                <h3 className="text-xl font-bold text-white">Startup OS</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-zinc-200">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Clean, distraction-free Kanban boards</span>
                  </li>
                  <li className="flex items-start gap-3 text-zinc-200">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Instant interactions & Next.js speed</span>
                  </li>
                  <li className="flex items-start gap-3 text-zinc-200">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Zero config - ready in 30 seconds</span>
                  </li>
                  <li className="flex items-start gap-3 text-zinc-200">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Integrated with Identity & Role management</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-8 max-w-2xl mx-auto">
            Ready to ship faster?
          </h2>
          <Link href="/signup">
            <Button size="lg" className="h-14 px-10 text-lg bg-white text-black hover:bg-zinc-200 rounded-full">
              Start Building Now
            </Button>
          </Link>
        </section>
      </main>

      <footer className="py-8 border-t border-white/10 text-center text-zinc-600 text-sm">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Startup OS Inc.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-zinc-400 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-zinc-400 transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-zinc-400 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
