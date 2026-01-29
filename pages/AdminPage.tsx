import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  Code,
  Sparkles,
  Layers,
  Map,
  Zap,
  Lock,
  Terminal,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  ChevronRight,
  Package,
  Cpu,
  Palette,
  Cloud,
  Play,
  Github,
  GraduationCap,
  MessageSquare,
  CreditCard,
  Rss,
  Activity,
  RefreshCw,
  ToggleLeft as Toggle,
  Box,
  Trash2,
} from 'lucide-react';
import {
  COMPONENT_REGISTRY,
  EASTER_EGGS,
  TECH_STACK,
  ROADMAP_ITEMS,
  QUICK_ACTIONS,
  SITE_STATS,
  CREDENTIALS,
} from '../data/adminData';
import { modules as fallbackModules } from '../data/curriculumData';
import { useCurriculumStore } from '../stores/useCurriculumStore';
import type { Module, Section, ContentBlockType } from '../types/curriculum';
import type { FrontierIntelligence } from '../types/intelligence';
import { useMatrixStore } from '../stores/useMatrixStore';

type TabId = 'overview' | 'curriculum' | 'components' | 'easter-eggs' | 'tech-stack' | 'roadmap' | 'actions' | 'intelligence' | 'analytics';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'intelligence', label: 'Neural Feed', icon: Rss },
  { id: 'analytics', label: 'Analytics', icon: Activity },
  { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
  { id: 'components', label: 'Components', icon: Code },
  { id: 'easter-eggs', label: 'Easter Eggs', icon: Sparkles },
  { id: 'tech-stack', label: 'Tech Stack', icon: Cpu },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'actions', label: 'Quick Actions', icon: Zap },
];

const ICON_MAP: Record<string, React.ElementType> = {
  CreditCard,
  MessageSquare,
  GraduationCap,
  Play,
  Package,
  Github,
  Cloud,
  Palette,
};

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showCredentials, setShowCredentials] = useState(false);
  const [intelligence, setIntelligence] = useState<FrontierIntelligence[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [analyticsSummary, setAnalyticsSummary] = useState<{ profiles: unknown[]; eventCounts: Record<string, number> } | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [analyticsUserId, setAnalyticsUserId] = useState('');
  const [analyticsProfile, setAnalyticsProfile] = useState<string>('');
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [editableModules, setEditableModules] = useState<Module[]>(fallbackModules);
  const [isSavingModules, setIsSavingModules] = useState(false);
  const [modulesMessage, setModulesMessage] = useState('');

  const { addNode, addEdge } = useMatrixStore();
  const { modules, loadModules, setModules } = useCurriculumStore();

  // Fetch intelligence on mount or tab change
  useEffect(() => {
    if (activeTab === 'intelligence') {
      fetchIntelligence();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'analytics') return;
    setIsLoadingAnalytics(true);
    fetch('/api/analytics?action=summary')
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => setAnalyticsSummary(data))
      .catch(() => setAnalyticsSummary(null))
      .finally(() => setIsLoadingAnalytics(false));
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'curriculum') {
      loadModules().catch(() => undefined);
    }
  }, [activeTab, loadModules]);

  useEffect(() => {
    setEditableModules(modules.length > 0 ? modules : fallbackModules);
  }, [modules]);

  const fetchIntelligence = async () => {
    try {
      const res = await fetch('/api/intelligence/items');
      const data = await res.json();
      if (data.items) setIntelligence(data.items);
    } catch (err) {
      console.error('Failed to fetch intelligence:', err);
    }
  };

  const handleSyncHub = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/intelligence/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchIntelligence();
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleIntelligence = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/intelligence/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      });
      if (res.ok) {
        setIntelligence(prev => prev.map(item => 
          item.id === id ? { ...item, is_active: !currentStatus } : item
        ));
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const deleteIntelligence = async (id: string) => {
    if (!confirm('Are you sure you want to delete this intelligence unit?')) return;
    try {
      const res = await fetch(`/api/intelligence/items?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIntelligence(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const manifestIntelligence = async (id: string) => {
    try {
      const res = await fetch('/api/intelligence/manifest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local list
        setIntelligence(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'manifested', is_active: true } : item
        ));

        // Add to Matrix
        const newNode = {
          id: data.nodeProposal.id,
          type: 'oasis' as const,
          position: { x: 600, y: Math.random() * 400 + 100 },
          data: {
            id: data.nodeProposal.id.slice(-2),
            label: data.nodeProposal.label,
            type: 'AGENT_LOGIC' as any,
            status: 'discovered' as any,
            progress: 0,
          }
        };
        addNode(newNode);
        addEdge({
          id: `e-core-${newNode.id}`,
          source: '0',
          target: newNode.id,
          animated: true,
          label: 'MANIFESTED'
        });
        alert('Intelligence manifested in the Matrix.');
      }
    } catch (err) {
      console.error('Manifest failed:', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CREDENTIALS.adminPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Access denied. Invalid credentials.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    setEditableModules((prev) => prev.map((module) => (
      module.id === moduleId ? { ...module, ...updates } : module
    )));
  };

  const updateSection = (moduleId: string, sectionId: string, updates: Partial<Section>) => {
    setEditableModules((prev) => prev.map((module) => {
      if (module.id !== moduleId) return module;
      return {
        ...module,
        sections: module.sections.map((section) => (
          section.id === sectionId ? { ...section, ...updates } : section
        )),
      };
    }));
  };

  const addModule = () => {
    const nextIndex = editableModules.length;
    const moduleNumber = String(nextIndex).padStart(2, '0');
    setEditableModules((prev) => ([
      ...prev,
      {
        id: `module-${moduleNumber}`,
        number: moduleNumber,
        title: 'New Module',
        subtitle: 'New module subtitle',
        duration: '30 min',
        objective: 'Define the learning objective',
        sections: [],
        keyTakeaways: [],
        icon: 'Zap',
      }
    ]));
  };

  const addSection = (moduleId: string) => {
    setEditableModules((prev) => prev.map((module) => {
      if (module.id !== moduleId) return module;
      const nextIndex = module.sections.length + 1;
      const sectionId = `${module.number}.${nextIndex}`;
      return {
        ...module,
        sections: [
          ...module.sections,
          {
            id: sectionId,
            title: 'New Section',
            content: 'Add content here...',
            tools: [],
            duration: '10 min',
            blocks: [],
          }
        ]
      };
    }));
  };

  const addBlock = (moduleId: string, sectionId: string, type: ContentBlockType) => {
    setEditableModules((prev) => prev.map((module) => {
      if (module.id !== moduleId) return module;
      return {
        ...module,
        sections: module.sections.map((section) => {
          if (section.id !== sectionId) return section;
          const blocks = section.blocks ?? [];
          return {
            ...section,
            blocks: [
              ...blocks,
              {
                id: crypto.randomUUID(),
                type,
                content: '',
              }
            ]
          };
        })
      };
    }));
  };

  const updateBlock = (moduleId: string, sectionId: string, blockId: string, updates: { content?: string; type?: ContentBlockType; title?: string }) => {
    setEditableModules((prev) => prev.map((module) => {
      if (module.id !== moduleId) return module;
      return {
        ...module,
        sections: module.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            blocks: (section.blocks ?? []).map((block) => (
              block.id === blockId ? { ...block, ...updates } : block
            )),
          };
        })
      };
    }));
  };

  const handleSaveModules = async () => {
    setIsSavingModules(true);
    setModulesMessage('');
    try {
      const res = await fetch('/api/curriculum/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: password, modules: editableModules }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to save curriculum');
      }
      setModules(editableModules);
      setModulesMessage('Curriculum saved to Supabase.');
    } catch (err) {
      setModulesMessage(err instanceof Error ? err.message : 'Failed to save curriculum');
    } finally {
      setIsSavingModules(false);
    }
  };

  // Password Gate
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-900/90 border border-red-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-red-400 flex-shrink-0" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ADMIN ACCESS</h1>
                <p className="text-xs text-red-400">Restricted Area</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Enter Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50"
                  placeholder="••••••••••••"
                  autoFocus
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-red-500/25 transition-all"
              >
                Access Admin Panel
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-white/30">
              This area is for authorized personnel only.
            </p>
          </div>
        </motion.div>
      </main>
    );
  }

  // Admin Dashboard
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0">
                <Shield className="w-7 h-7 text-white flex-shrink-0" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Command Center</h1>
                <p className="text-white/50">The Teacher&apos;s Bible - Everything you need</p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Lock</span>
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8 p-2 rounded-xl bg-white/5 border border-white/10"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
              {React.createElement(Icon as any, { className: "w-4 h-4" })}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Components', value: SITE_STATS.totalComponents, icon: Code, color: 'cyan' },
                    { label: 'Pages', value: SITE_STATS.totalPages, icon: FileText, color: 'violet' },
                    { label: 'Easter Eggs', value: SITE_STATS.easterEggs, icon: Sparkles, color: 'amber' },
                    { label: 'Intelligence', value: intelligence.length, icon: Rss, color: 'emerald' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`p-4 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}
                    >
                      {React.createElement(stat.icon as any, { className: `w-5 h-5 text-${stat.color}-400 mb-2` })}
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/50">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Credentials Section */}
                <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-red-400" />
                      <h3 className="text-lg font-bold text-white">Credentials</h3>
                    </div>
                    <button
                      onClick={() => setShowCredentials(!showCredentials)}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 text-white/60 hover:text-white transition-all"
                    >
                      {showCredentials ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span className="text-sm">{showCredentials ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>

                  {showCredentials && (
                    <div className="space-y-3">
                      {[
                        { label: 'Site Password', value: CREDENTIALS.sitePassword },
                        { label: 'Academy Username', value: CREDENTIALS.academyLogin.username },
                        { label: 'Academy Password', value: CREDENTIALS.academyLogin.password },
                        { label: 'Admin Password', value: CREDENTIALS.adminPassword },
                        { label: 'Konami Discount', value: CREDENTIALS.konamiCode },
                      ].map((cred) => (
                        <div key={cred.label} className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                          <span className="text-white/60">{cred.label}:</span>
                          <div className="flex items-center gap-2">
                            <code className="text-cyan-400 font-mono break-all">{cred.value}</code>
                            <button
                              onClick={() => copyToClipboard(cred.value)}
                              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Status */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4">Curriculum Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60">Modules</span>
                        <span className="text-emerald-400">{modules.length} complete</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Tools Covered</span>
                        <span className="text-emerald-400">12 tools</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Total Sections</span>
                        <span className="text-white">{modules.reduce((acc, m) => acc + m.sections.length, 0)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4">Build Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60">Last Updated</span>
                        <span className="text-white">{SITE_STATS.lastUpdated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">JS Bundle</span>
                        <span className="text-amber-400">{SITE_STATS.bundleSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">CSS Size</span>
                        <span className="text-emerald-400">{SITE_STATS.cssSize}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Intelligence Tab */}
            {activeTab === 'intelligence' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Rss className="w-5 h-5 text-cyan-400" />
                      Frontier Intelligence Sync
                    </h3>
                    <p className="text-white/50 text-sm mt-1">Auto-detecting tech trends powered by Perplexity Pro</p>
                  </div>
                  <button 
                    onClick={handleSyncHub}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Scouting the Web...' : 'Sync Now'}
                  </button>
                </div>

                <div className="grid gap-4">
                  {intelligence.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-2xl opacity-20">
                      <Box size={48} className="mx-auto mb-4" />
                      <p className="font-mono uppercase tracking-widest">No Intelligence Drafted</p>
                    </div>
                  ) : (
                    intelligence.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        className={`p-5 rounded-2xl border transition-all ${item.is_active ? 'bg-zinc-900/80 border-cyan-500/30' : 'bg-black/40 border-white/5 opacity-60'}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                item.category === 'AI' ? 'bg-purple-500/20 text-purple-400' :
                                item.category === 'Frontend' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {item.category}
                              </span>
                              <h4 className="font-bold text-white text-lg truncate">{item.title}</h4>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed mb-4">{item.description}</p>
                            
                            <div className="p-3 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] text-cyan-400/80 mb-4">
                              <p className="text-[9px] text-white/20 uppercase font-bold mb-1 tracking-widest">Agent_Logic</p>
                              {item.logic}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {item.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-[9px] font-bold">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 shrink-0">
                            <button 
                              onClick={() => toggleIntelligence(item.id, item.is_active)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                                item.is_active 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-white/5 text-white/40 border border-white/10 hover:text-white'
                              }`}
                            >
                              <Toggle className={`w-4 h-4 ${item.is_active ? 'rotate-180' : ''}`} />
                              {item.is_active ? 'ACTIVE' : 'RESTRICTED'}
                            </button>
                            {item.status === 'draft' && (
                              <button 
                                onClick={() => manifestIntelligence(item.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold text-xs hover:bg-cyan-500/30 transition-all"
                              >
                                <Sparkles size={14} />
                                MANIFEST
                              </button>
                            )}
                            <button 
                              onClick={() => deleteIntelligence(item.id)}
                              className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-bold text-white mb-2">Usage Summary</h3>
                  {isLoadingAnalytics && (
                    <p className="text-xs text-white/40">Loading analytics...</p>
                  )}
                  {!isLoadingAnalytics && analyticsSummary && (
                    <div className="space-y-3 text-xs text-white/60">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(analyticsSummary.eventCounts ?? {}).map(([key, value]) => (
                          <span key={key} className="px-2 py-1 rounded-lg bg-black/40 border border-white/10">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                      <div className="text-white/50">
                        Profiles: {analyticsSummary.profiles.length}
                      </div>
                    </div>
                  )}
                  {!isLoadingAnalytics && !analyticsSummary && (
                    <p className="text-xs text-white/40">No analytics data yet.</p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-white">Profile Generator</h3>
                  <div className="flex flex-col md:flex-row gap-2">
                    <input
                      value={analyticsUserId}
                      onChange={(e) => setAnalyticsUserId(e.target.value)}
                      placeholder="User ID"
                      className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                    />
                    <button
                      onClick={async () => {
                        if (!analyticsUserId) return;
                        setIsGeneratingProfile(true);
                        try {
                          const res = await fetch('/api/analytics', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'profile', userId: analyticsUserId }),
                          });
                          const data = await res.json();
                          setAnalyticsProfile(JSON.stringify(data.profile ?? data, null, 2));
                        } catch (error) {
                          setAnalyticsProfile(String(error));
                        } finally {
                          setIsGeneratingProfile(false);
                        }
                      }}
                      disabled={isGeneratingProfile}
                      className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 transition disabled:opacity-60"
                    >
                      {isGeneratingProfile ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                  {analyticsProfile && (
                    <pre className="text-[10px] text-white/70 bg-black/50 border border-white/10 rounded-lg p-3 overflow-x-auto">
                      {analyticsProfile}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-6 flex items-center justify-between gap-4">
                  <p className="text-cyan-400 text-sm">
                    <strong>{editableModules.length} modules</strong> • {editableModules.reduce((acc, m) => acc + m.sections.length, 0)} sections • Stored in Supabase
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={addModule}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 transition"
                    >
                      Add Module
                    </button>
                    <button
                      onClick={handleSaveModules}
                      disabled={isSavingModules}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition disabled:opacity-60"
                    >
                      {isSavingModules ? 'Saving...' : 'Save to Supabase'}
                    </button>
                  </div>
                </div>

                {modulesMessage && (
                  <div className="text-xs text-white/60">{modulesMessage}</div>
                )}

                {editableModules.map((module, idx) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 items-center justify-center font-bold text-white text-lg shrink-0">
                        {module.number}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          value={module.title}
                          onChange={(e) => updateModule(module.id, { title: e.target.value })}
                          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
                          placeholder="Module title"
                        />
                        <input
                          value={module.subtitle}
                          onChange={(e) => updateModule(module.id, { subtitle: e.target.value })}
                          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
                          placeholder="Module subtitle"
                        />
                        <input
                          value={module.duration}
                          onChange={(e) => updateModule(module.id, { duration: e.target.value })}
                          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
                          placeholder="Duration"
                        />
                        <input
                          value={module.icon}
                          onChange={(e) => updateModule(module.id, { icon: e.target.value })}
                          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm"
                          placeholder="Icon name"
                        />
                        <textarea
                          value={module.objective}
                          onChange={(e) => updateModule(module.id, { objective: e.target.value })}
                          className="md:col-span-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm min-h-[80px]"
                          placeholder="Objective"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs uppercase tracking-widest text-cyan-400">Sections</h4>
                        <button
                          onClick={() => addSection(module.id)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs hover:text-white transition"
                        >
                          Add Section
                        </button>
                      </div>
                      {module.sections.map((section) => (
                        <div key={section.id} className="rounded-xl border border-white/10 bg-black/30 p-3 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              value={section.id}
                              onChange={(e) => updateSection(module.id, section.id, { id: e.target.value })}
                              className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                              placeholder="Section ID"
                            />
                            <input
                              value={section.title}
                              onChange={(e) => updateSection(module.id, section.id, { title: e.target.value })}
                              className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs md:col-span-2"
                              placeholder="Section title"
                            />
                          </div>
                          <textarea
                            value={section.content}
                            onChange={(e) => updateSection(module.id, section.id, { content: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs min-h-[120px]"
                            placeholder="Section markdown content"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => addBlock(module.id, section.id, 'markdown')}
                              className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-xs"
                            >
                              Add Markdown Block
                            </button>
                            <button
                              onClick={() => addBlock(module.id, section.id, 'code')}
                              className="px-2 py-1 rounded-lg bg-violet-500/10 text-violet-300 text-xs"
                            >
                              Add Code Block
                            </button>
                          </div>
                          {(section.blocks ?? []).length > 0 && (
                            <div className="space-y-2">
                              {(section.blocks ?? []).map((block) => (
                                <div key={block.id} className="rounded-lg border border-white/10 bg-black/50 p-2 space-y-2">
                                  <div className="flex gap-2">
                                    <select
                                      value={block.type}
                                      onChange={(e) => updateBlock(module.id, section.id, block.id, { type: e.target.value as ContentBlockType })}
                                      className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs"
                                    >
                                      <option value="markdown">markdown</option>
                                      <option value="code">code</option>
                                      <option value="callout">callout</option>
                                      <option value="checklist">checklist</option>
                                      <option value="list">list</option>
                                    </select>
                                    <input
                                      value={block.title ?? ''}
                                      onChange={(e) => updateBlock(module.id, section.id, block.id, { title: e.target.value })}
                                      className="flex-1 px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs"
                                      placeholder="Block title"
                                    />
                                  </div>
                                  <textarea
                                    value={block.content}
                                    onChange={(e) => updateBlock(module.id, section.id, block.id, { content: e.target.value })}
                                    className="w-full px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs min-h-[80px]"
                                    placeholder="Block content"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Components Tab */}
            {activeTab === 'components' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-6">
                  <p className="text-violet-400 text-sm">
                    <strong>{COMPONENT_REGISTRY.length} documented components</strong> • Click path to copy
                  </p>
                </div>

                {COMPONENT_REGISTRY.map((component, idx) => (
                  <motion.div
                    key={component.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white">{component.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            component.status === 'stable' ? 'bg-emerald-500/20 text-emerald-400' :
                            component.status === 'beta' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {component.status}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(component.path)}
                          className="text-cyan-400 text-sm font-mono hover:underline mt-1 break-all text-left"
                        >
                          {component.path}
                        </button>
                        <p className="text-white/50 text-sm mt-2">{component.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {component.features.map((feature) => (
                            <span key={feature} className="px-2 py-0.5 rounded bg-white/5 text-white/40 text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Easter Eggs Tab */}
            {activeTab === 'easter-eggs' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                  <p className="text-amber-400 text-sm">
                    <strong>{EASTER_EGGS.length} hidden easter eggs</strong> • Share wisely!
                  </p>
                </div>

                {EASTER_EGGS.map((egg, idx) => (
                  <motion.div
                    key={egg.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex w-10 h-10 rounded-lg bg-amber-500/20 items-center justify-center text-xl shrink-0">
                        🥚
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{egg.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="px-2 py-0.5 rounded bg-black/30 text-fuchsia-400 font-mono text-sm">
                            {egg.trigger}
                          </code>
                          <span className="text-white/30 text-xs">@</span>
                          <span className="text-white/50 text-xs">{egg.location}</span>
                        </div>
                        <p className="text-white/60 text-sm mt-2">{egg.description}</p>
                        {egg.reward && (
                          <p className="text-emerald-400 text-sm mt-1">
                            <strong>Reward:</strong> {egg.reward}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Tech Stack Tab */}
            {activeTab === 'tech-stack' && (
              <div className="space-y-6">
                {(['frontend', 'styling', 'deployment', 'ai'] as const).map((category) => {
                  const items = TECH_STACK.filter((item) => item.category === category);
                  if (items.length === 0) return null;

                  return (
                    <div key={category}>
                      <h3 className="text-lg font-bold text-white mb-3 capitalize flex items-center gap-2">
                        {category === 'frontend' && <Code className="w-5 h-5 text-cyan-400" />}
                        {category === 'styling' && <Palette className="w-5 h-5 text-violet-400" />}
                        {category === 'deployment' && <Cloud className="w-5 h-5 text-emerald-400" />}
                        {category === 'ai' && <Cpu className="w-5 h-5 text-amber-400" />}
                        {category}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {items.map((tech) => (
                          <div
                            key={tech.name}
                            className="p-4 rounded-xl bg-white/5 border border-white/10"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white">{tech.name}</h4>
                              {tech.version && (
                                <span className="text-xs text-white/40">v{tech.version}</span>
                              )}
                            </div>
                            <p className="text-white/50 text-sm mt-1">{tech.description}</p>
                            <a
                              href={tech.docsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-cyan-400 text-xs mt-2 hover:underline"
                            >
                              Docs <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Roadmap Tab */}
            {activeTab === 'roadmap' && (
              <div className="space-y-6">
                {(['completed', 'in-progress', 'planned'] as const).map((status) => {
                  const items = ROADMAP_ITEMS.filter((item) => item.status === status);
                  if (items.length === 0) return null;

                  return (
                    <div key={status}>
                      <h3 className="text-lg font-bold text-white mb-3 capitalize flex items-center gap-2">
                        {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {status === 'in-progress' && <Clock className="w-5 h-5 text-amber-400" />}
                        {status === 'planned' && <AlertCircle className="w-5 h-5 text-cyan-400" />}
                        {status.replace('-', ' ')} ({items.length})
                      </h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.title}
                            className={`p-4 rounded-xl border ${
                              status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20' :
                              status === 'in-progress' ? 'bg-amber-500/5 border-amber-500/20' :
                              'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-white">{item.title}</h4>
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                    item.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-white/10 text-white/40'
                                  }`}>
                                    {item.priority}
                                  </span>
                                </div>
                                <p className="text-white/50 text-sm mt-1">{item.description}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-white/5 text-white/40 text-xs shrink-0">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Actions Tab */}
            {activeTab === 'actions' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {QUICK_ACTIONS.map((action) => {
                  const IconComponent = (ICON_MAP[action.icon] || Zap) as any;
                  
                  if (action.type === 'link') {
                    return (
                      <Link
                        key={action.label}
                        to={action.value}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="inline-flex w-10 h-10 rounded-lg bg-cyan-500/20 items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-cyan-400 flex-shrink-0" strokeWidth={2} />
                          </div>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {action.label}
                            </h4>
                            <p className="text-white/50 text-xs">{action.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-cyan-400 ml-auto transition-colors" />
                        </div>
                      </Link>
                    );
                  }

                  if (action.type === 'command') {
                    return (
                      <button
                        key={action.label}
                        onClick={() => copyToClipboard(action.value)}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="inline-flex w-10 h-10 rounded-lg bg-violet-500/20 items-center justify-center flex-shrink-0">
                            <Terminal className="w-5 h-5 text-violet-400 flex-shrink-0" strokeWidth={2} />
                          </div>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-violet-400 transition-colors">
                              {action.label}
                            </h4>
                            <code className="text-white/50 text-xs font-mono">{action.value}</code>
                          </div>
                          <Copy className="w-4 h-4 text-white/20 group-hover:text-violet-400 ml-auto transition-colors" />
                        </div>
                      </button>
                    );
                  }

                  return (
                    <a
                      key={action.label}
                      href={action.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="inline-flex w-10 h-10 rounded-lg bg-emerald-500/20 items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-emerald-400 flex-shrink-0" strokeWidth={2} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {action.label}
                          </h4>
                          <p className="text-white/50 text-xs">{action.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-emerald-400 ml-auto transition-colors" />
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};
