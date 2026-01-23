import { DigestItem } from '@/lib/types';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DigestCard: React.FC<{ item: DigestItem; priority?: boolean }> = ({ item, priority = false }) => {
  const score = Math.min(Math.max(item.score || 0, 0), 100);
  const scoreColor = score > 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                     score > 50 ? 'text-amber-600 bg-amber-50 border-amber-100' : 
                     'text-zinc-500 bg-zinc-50 border-zinc-100';

  return (
    <div className={cn(
      "group relative flex flex-col p-5 rounded-2xl transition-all duration-300",
      "bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10",
      "hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/40",
      "hover:bg-white/80 dark:hover:bg-slate-900/60",
      priority ? "md:col-span-2 md:flex-row md:items-center md:gap-8" : ""
    )}>
      
      {/* Header / Meta */}
      <div className={cn("flex justify-between items-start mb-3", priority && "md:hidden")}>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/50 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20">
          {item.topics[0]}
        </span>
        <div className={cn("flex items-center space-x-2 px-2 py-1 rounded-full border text-xs font-medium", scoreColor)}>
          <span className="relative flex h-2 w-2">
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", score > 80 ? "bg-emerald-400" : "bg-slate-400")}></span>
            <span className={cn("relative inline-flex rounded-full h-2 w-2", score > 80 ? "bg-emerald-500" : "bg-slate-500")}></span>
          </span>
          <span>{score}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Priority Badge (Desktop) */}
        {priority && (
          <div className="hidden md:flex items-center gap-3 mb-4">
             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/50 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20">
              {item.topics[0]}
            </span>
            <div className={cn("flex items-center space-x-2 px-2 py-1 rounded-full border text-xs font-medium", scoreColor)}>
              <span>AI Score {score}</span>
            </div>
          </div>
        )}

        <h3 className={cn(
          "font-semibold text-zinc-900 dark:text-slate-100 leading-tight tracking-tight mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors",
          priority ? "text-2xl" : "text-lg"
        )}>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {item.title}
          </a>
        </h3>
        
        <p className={cn(
          "text-zinc-500 dark:text-slate-400 line-clamp-3 mb-4 font-normal",
          priority ? "text-base" : "text-sm"
        )}>
          {item.summary_hint}
        </p>
      </div>

      {/* Footer */}
      <div className={cn(
        "flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5 mt-auto",
        priority && "md:border-none md:pt-0"
      )}>
        <div className="flex items-center text-xs text-zinc-500 dark:text-slate-500 font-medium">
          <div className="relative w-4 h-4 mr-2 overflow-hidden rounded-sm bg-zinc-100 dark:bg-slate-800">
             <Image
              src={`https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=32`}
              alt={`${item.source_name} icon`}
              width={16}
              height={16}
              className="object-cover"
            />
          </div>
          {item.source_name}
          <span className="mx-2 text-zinc-300 dark:text-slate-700">•</span>
          <span className="flex items-center">
            {item.published_at ? formatDistanceToNow(new Date(item.published_at), { addSuffix: true }) : 'Recently'}
          </span>
        </div>
        
        <div className="text-zinc-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors group-hover:translate-x-0.5 transform duration-300">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
