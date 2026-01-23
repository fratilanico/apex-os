import { DigestData } from '@/lib/types';
import { DigestCard } from '@/components/ui/DigestCard';
import { LayoutDashboard, Radio, RefreshCw, Zap, Code, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ThreeBackground } from '@/components/ui/ThreeBackground';

// Error Boundary Component
function ErrorState() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 relative z-10">
      <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20 backdrop-blur-sm">
        <Radio className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Connection Lost</h2>
      <p className="text-slate-400 max-w-md">
        Unable to fetch the latest digest. This might be due to a network issue or missing configuration.
      </p>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-3xl bg-black/20 backdrop-blur-sm relative z-10">
      <div className="w-16 h-16 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
        <RefreshCw className="w-8 h-8 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Generating Digest...</h2>
      <p className="text-slate-400 max-w-md">
        No digest has been published for today yet. Check back in a few minutes or trigger a manual run from the admin panel.
      </p>
    </div>
  );
}

async function getDigest(): Promise<DigestData | null> {
  const baseUrl = process.env.DIGEST_PUBLIC_BASE_URL;
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/digest/latest.json`, { 
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000) 
    } as any);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch digest:", error);
    return null;
  }
}

export default async function Home() {
  const digest = await getDigest();

  return (
    <main className="min-h-screen text-slate-200 selection:bg-indigo-500/30 font-sans relative">
      
      {/* 3D Background Layer */}
      <ThreeBackground />

      {/* Navigation / Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white hidden sm:block">SourceHub</span>
          </div>
          
          <div className="flex items-center gap-4">
             {digest && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Updates
              </div>
            )}
            
            <Link 
              href="/admin" 
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all hover:bg-white/10"
            >
              <LayoutDashboard className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Hero Section */}
        <div className="mb-20 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 mb-4 animate-pulse">
                <Code size={20} />
                <span className="font-mono text-sm tracking-widest uppercase">Developer Intelligence v2.0</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-slate-500 mb-6 tracking-tight leading-tight">
                SOURCE <br /> CODE.
              </h1>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed border-l-2 border-indigo-500/30 pl-6">
                Curated high-signal engineering news. Filtered by AI, refined by experts.
                Stay ahead without the noise.
              </p>
            </div>
          </div>

          {/* Search/Stats Bar (Visual Only for now) */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
             <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                  {digest?.items.length || 0} Stories Today
                </span>
                <span className="hidden sm:inline">Updated {digest ? new Date(digest.generated_at).toLocaleTimeString() : '--:--'}</span>
             </div>
             
             <div className="flex gap-2 w-full lg:w-auto">
               <div className="h-2 w-full lg:w-48 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[75%] animate-pulse"></div>
               </div>
               <span className="text-xs text-slate-500 font-mono">SYSTEM ACTIVE</span>
             </div>
          </div>
        </div>

        {/* Content Grid */}
        {!digest ? (
          <EmptyState />
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {digest.items
                .filter(i => i.status !== 'rejected')
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .map((item, index) => (
                  <DigestCard 
                    key={item.id} 
                    item={item} 
                    priority={index === 0}
                  />
              ))}
            </div>
            
            <div className="flex justify-center pt-8 pb-12">
               <p className="text-slate-500 text-sm font-mono border-t border-white/5 pt-4 px-8">
                 RUN_ID: <span className="text-indigo-400/70">{digest.run_id?.slice(0,8) || 'UNKNOWN'}</span> • {new Date(digest.generated_at).toUTCString()}
               </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-32 border-t border-white/5 pt-8 pb-12 bg-black/20 -mx-6 px-6 backdrop-blur-sm rounded-t-3xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} SourceHub. All rights reserved.</p>
                <div className="flex gap-6">
                    <span className="hover:text-indigo-400 transition-colors cursor-pointer">Privacy</span>
                    <span className="hover:text-indigo-400 transition-colors cursor-pointer">Terms</span>
                    <span className="hover:text-indigo-400 transition-colors cursor-pointer">API</span>
                </div>
            </div>
        </footer>

      </div>
    </main>
  );
}
