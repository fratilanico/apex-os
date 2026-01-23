"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, Calendar, FileText, Layers, RefreshCw, TrendingUp, Zap, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// ... (interfaces stay the same, just keeping them in scope)
interface DigestRunSummary {
  run_id: string;
  generated_at: string;
  window_start: string;
  window_end: string;
  item_count: number;
  approved_count: number;
  pinned_count: number;
  rejected_count: number;
  new_count: number;
}

interface DraftSummary {
  draft_id: string;
  generated_at: string;
  section_count: number;
  item_count: number;
}

interface DashboardData {
  latest: {
    run_id: string;
    generated_at: string;
    window_start: string;
    window_end: string;
  } | null;
  counts: {
    total: number;
    approved: number;
    pinned: number;
    rejected: number;
    new: number;
  };
  topSources: Array<{ name: string; count: number }>;
  runs: DigestRunSummary[];
  drafts: DraftSummary[];
}

export default function AdminIndex() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dashboard', {
        credentials: 'include',
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || 'Failed to load dashboard');
      }
      setData(payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground/50">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
          <RefreshCw className="w-5 h-5 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto mt-20">
        <div className="text-destructive mb-4">{error || 'No data available.'}</div>
        <button
          onClick={fetchDashboard}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition shadow-lg shadow-primary/20"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Items', value: data.counts.total, icon: <Layers className="w-4 h-4" />, color: "text-blue-400" },
    { label: 'Approved', value: data.counts.approved, icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-400" },
    { label: 'Pinned', value: data.counts.pinned, icon: <Zap className="w-4 h-4" />, color: "text-purple-400" },
    { label: 'Rejected', value: data.counts.rejected, icon: <Activity className="w-4 h-4" />, color: "text-red-400" },
    { label: 'New', value: data.counts.new, icon: <Activity className="w-4 h-4" />, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-foreground">Mission Control</h2>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-1">Live Feed Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-all border border-white/10"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-sm font-medium">Sync</span>
          </button>
          <Link
            href="/admin/curate"
            className="relative inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition shadow-lg shadow-indigo-500/20 overflow-hidden"
          >
            <span className="relative z-10 font-medium text-sm">Curate Feed</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-shimmer" />
          </Link>
        </div>
      </div>

      {/* KPI Grid - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>{stat.icon}</span>
              {i === 4 && <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />}
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl group-hover:bg-white/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Run Card */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-1 border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-foreground">Latest Ingest</h3>
          </div>
          {data.latest ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase">Run ID</span>
                <span className="font-mono text-sm text-foreground bg-secondary/50 p-1.5 rounded border border-white/5">{data.latest.run_id.split('-')[0]}...</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase">Timestamp</span>
                <span className="text-sm text-foreground">{new Date(data.latest.generated_at).toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase">Window</span>
                <span className="text-xs text-muted-foreground bg-green-500/10 text-green-400 px-2 py-1 rounded w-fit border border-green-500/20">
                  {new Date(data.latest.window_start).toLocaleDateString()} → {new Date(data.latest.window_end).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No runs recorded.</p>
          )}
        </div>

        {/* Top Sources */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Top Signal Sources
          </h3>
          <div className="space-y-3">
            {data.topSources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No source data yet.</p>
            ) : (
              data.topSources.map((source, i) => (
                <div key={source.name} className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-4">0{i + 1}</span>
                    <span className="text-sm font-medium text-foreground">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(source.count / data.counts.total) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-foreground w-8 text-right">{source.count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-panel p-6 rounded-2xl overflow-hidden">
        <h3 className="font-semibold text-foreground mb-6">Ingestion Timeline</h3>
        {data.runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-white/5">
                  <th className="pb-3 pl-2 font-medium">Date</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Approved</th>
                  <th className="pb-3 font-medium">Pinned</th>
                  <th className="pb-3 font-medium">New</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.runs.map((run) => (
                  <tr key={run.run_id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-3 pl-2 text-foreground font-mono text-xs">{new Date(run.generated_at).toLocaleDateString()}</td>
                    <td className="py-3 text-muted-foreground group-hover:text-foreground">{run.item_count}</td>
                    <td className="py-3 text-emerald-400 font-medium">{run.approved_count}</td>
                    <td className="py-3 text-purple-400 font-medium">{run.pinned_count}</td>
                    <td className="py-3 text-orange-400 font-medium">{run.new_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

