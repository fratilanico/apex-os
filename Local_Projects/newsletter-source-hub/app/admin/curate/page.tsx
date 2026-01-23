'use client';
import { useState, useEffect } from 'react';
import { DigestData, DigestItem } from '@/lib/types';
import { Check, X, Pin, RefreshCw, Save, Search, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function CuratePage() {
  const [data, setData] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/feed?t=' + Date.now(), {
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setData(null);
      }
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id: string, status: DigestItem['status']) => {
    if (!data) return;
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, status } : item
    );
    setData({ ...data, items: newItems });
  };

  const saveChanges = async () => {
    if (!data) return;
    setSaving(true);
    setError(null);
    
    try {
      const res = await fetch('/api/admin/curate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (res.status === 401) {
        setError('Session expired. Please sign in again.');
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      
      alert('Saved successfully!');
    } catch (e: any) {
      setError(e.message || 'Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-500">
        <RefreshCw className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
        <p>Loading digest data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6">
          <Search className="w-8 h-8 text-zinc-400" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No Digest Found</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          The cron job hasn&apos;t run yet, or the data feed is empty.
          <br />
          Try triggering the ingestion manually.
        </p>
        <button 
           onClick={() => alert("To trigger manually, visit /api/cron/digest?token=YOUR_CRON_TOKEN")}
           className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition"
        >
          Check Cron Status
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Curate Feed</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            <span className="font-medium text-zinc-900 dark:text-zinc-200">{data.items.length}</span> items fetched • 
            <span className="font-medium text-indigo-600 dark:text-indigo-400 ml-1">{data.items.filter(i => i.status === 'approved' || i.status === 'pinned').length} selected</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={fetchData} 
              className="p-2.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              onClick={saveChanges}
              disabled={saving}
              className="flex-1 sm:flex-none items-center justify-center flex bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Decisions'}
            </button>
          </div>
          {error && (
            <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1.5" />
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {data.items.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "group relative bg-white dark:bg-zinc-900 border rounded-xl p-5 flex flex-col sm:flex-row gap-5 transition-all duration-300",
              item.status === 'rejected' ? "opacity-60 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 grayscale-[0.5]" : 
              item.status === 'approved' ? "border-emerald-200 dark:border-emerald-900/50 shadow-sm ring-1 ring-emerald-100 dark:ring-emerald-900/30" :
              item.status === 'pinned' ? "border-indigo-200 dark:border-indigo-900/50 shadow-md ring-1 ring-indigo-100 dark:ring-indigo-900/30 bg-indigo-50/10" :
              "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {item.source_name}
                </span>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full border",
                  (item.score || 0) > 80 ? "text-emerald-600 border-emerald-100 dark:text-emerald-400 dark:border-emerald-900" : "text-zinc-500 border-zinc-200 dark:border-zinc-700 dark:text-zinc-400"
                )}>
                  Score: {item.score}
                </span>
                {item.status === 'pinned' && (
                  <span className="flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    <Pin className="w-3 h-3 mr-1 fill-current" /> Pinned
                  </span>
                )}
              </div>
              
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 text-lg leading-tight">
                <a href={item.url} target="_blank" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {item.title}
                </a>
              </h3>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {item.summary_hint}
              </p>
            </div>
            
            <div className="flex sm:flex-col gap-2 justify-center border-t sm:border-t-0 sm:border-l border-zinc-100 dark:border-zinc-800 pt-4 sm:pt-0 sm:pl-4">
              <button 
                onClick={() => handleStatusChange(item.id, 'pinned')}
                className={cn(
                  "flex-1 sm:flex-none p-2 rounded-lg transition-colors flex items-center justify-center", 
                  item.status === 'pinned' 
                    ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-200 dark:ring-indigo-800" 
                    : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600"
                )}
                title="Pin to top"
              >
                <Pin className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleStatusChange(item.id, 'approved')}
                className={cn(
                  "flex-1 sm:flex-none p-2 rounded-lg transition-colors flex items-center justify-center", 
                  item.status === 'approved' 
                    ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 ring-1 ring-emerald-200 dark:ring-emerald-800" 
                    : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-emerald-600"
                )}
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleStatusChange(item.id, 'rejected')}
                className={cn(
                  "flex-1 sm:flex-none p-2 rounded-lg transition-colors flex items-center justify-center", 
                  item.status === 'rejected' 
                    ? "text-red-600 bg-red-50 dark:bg-red-900/30 ring-1 ring-red-200 dark:ring-red-800" 
                    : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-600"
                )}
                title="Reject"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
