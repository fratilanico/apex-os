import React, { useState } from 'react';
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
import { modules } from '../data/curriculumData';

type TabId = 'overview' | 'curriculum' | 'components' | 'easter-eggs' | 'tech-stack' | 'roadmap' | 'actions';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: Layers },
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: SECURITY WARNING - Move to backend authentication with proper session management
    // This client-side password check is NOT secure for production
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
                <p className="text-white/50">The Teacher's Bible - Everything you need</p>
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
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {React.createElement(tab.icon as any, { className: "w-4 h-4" })}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
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
                    { label: 'Bundle Size', value: SITE_STATS.bundleSize, icon: Package, color: 'emerald' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`p-4 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}
                    >
                      <stat.icon className={`w-5 h-5 text-${stat.color}-400 mb-2`} />
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

            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
                  <p className="text-cyan-400 text-sm">
                    <strong>{modules.length} modules</strong> • {modules.reduce((acc, m) => acc + m.sections.length, 0)} sections • Full curriculum data in <code className="bg-black/30 px-2 py-0.5 rounded">/data/curriculumData.ts</code>
                  </p>
                </div>

                {modules.map((module, idx) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 items-center justify-center font-bold text-white text-lg shrink-0">
                        {module.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white">{module.title}</h3>
                        <p className="text-white/50 text-sm">{module.subtitle}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs">
                            {module.duration}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 text-xs">
                            {module.sections.length} sections
                          </span>
                        </div>
                        <div className="mt-3 text-sm text-white/60">
                          <strong className="text-white/80">Objective:</strong> {module.objective}
                        </div>
                      </div>
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
                  const IconComponent = ICON_MAP[action.icon] || Zap;
                  
                  if (action.type === 'link') {
                    return (
                      <Link
                        key={action.label}
                        to={action.value}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="inline-flex w-10 h-10 rounded-lg bg-cyan-500/20 items-center justify-center flex-shrink-0">
                            {React.createElement(IconComponent as any, {
                              className: "w-5 h-5 text-cyan-400 flex-shrink-0",
                              strokeWidth: 2
                            })}
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
                          {React.createElement(IconComponent as any, {
                            className: "w-5 h-5 text-emerald-400 flex-shrink-0",
                            strokeWidth: 2
                          })}
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
