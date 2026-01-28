import { ToolArsenal } from '../components/artifacts/ToolArsenal';

/**
 * Demo page for the ToolArsenal component
 * Showcases the 12 AI tools as a C-Suite team
 */
export function ToolArsenalDemo() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">
              Vibe Coder Academy - Tool Arsenal
            </h1>
            <div className="flex gap-4 text-sm text-zinc-400">
              <span>12 Tools</span>
              <span className="text-cyan-400">6 Core</span>
              <span className="text-violet-400">6 Asset</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <ToolArsenal />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-zinc-500 text-sm">
          <p>Built with Vite + React 19 + TypeScript + Tailwind + Framer Motion</p>
          <p className="mt-2">
            Data source: <code className="text-cyan-400">data/curriculumData.ts</code>
          </p>
        </div>
      </footer>
    </div>
  );
}
