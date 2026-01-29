import { useState, useEffect } from 'react';
import {
  Globe,
  Youtube,
  Github,
  FileText,
  BookOpen,
  Upload,
  Trash2,
  RefreshCw,
  Plus,
  Check,
  X,
  Loader2,
  Database
} from 'lucide-react';

interface KnowledgeSource {
  id: string;
  source_type: string;
  source_url: string;
  title: string;
  status: 'processing' | 'completed' | 'failed';
  chunk_count: number;
  created_at: string;
  error_message?: string;
}

type SourceType = 'url' | 'youtube' | 'github' | 'notion' | 'markdown' | 'pdf';

const SOURCE_ICONS: Record<SourceType, React.ReactNode> = {
  url: <Globe className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4 text-red-500" />,
  github: <Github className="w-4 h-4" />,
  notion: <BookOpen className="w-4 h-4" />,
  markdown: <FileText className="w-4 h-4" />,
  pdf: <FileText className="w-4 h-4 text-red-400" />
};

const SOURCE_LABELS: Record<SourceType, string> = {
  url: 'Web Page',
  youtube: 'YouTube Video',
  github: 'GitHub Repo',
  notion: 'Notion Page',
  markdown: 'Markdown',
  pdf: 'PDF Document'
};

export function KnowledgeSources() {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSource, setNewSource] = useState({ type: 'url' as SourceType, source: '' });
  const [ingesting, setIngesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/knowledge/sources');
      const data = await res.json();
      setSources(data.sources || []);
    } catch (err) {
      console.error('Failed to fetch sources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleIngest = async () => {
    if (!newSource.source.trim()) return;

    setIngesting(true);
    setError(null);

    try {
      const res = await fetch('/api/knowledge/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newSource.type,
          source: newSource.source
        })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Ingestion failed');
      }

      setShowAddModal(false);
      setNewSource({ type: 'url', source: '' });
      fetchSources();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ingestion failed');
    } finally {
      setIngesting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this source and all its chunks?')) return;

    try {
      await fetch(`/api/knowledge/sources?id=${id}`, { method: 'DELETE' });
      fetchSources();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1 text-green-400 text-xs"><Check className="w-3 h-3" /> Ready</span>;
      case 'processing':
        return <span className="flex items-center gap-1 text-yellow-400 text-xs"><Loader2 className="w-3 h-3 animate-spin" /> Processing</span>;
      case 'failed':
        return <span className="flex items-center gap-1 text-red-400 text-xs"><X className="w-3 h-3" /> Failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-tron-dark border border-tron-cyan/30 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-tron-cyan/20">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-tron-cyan" />
          <h2 className="font-mono text-white">Knowledge Sources</h2>
          <span className="text-xs text-gray-500 ml-2">({sources.length})</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchSources}
            className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded bg-tron-cyan/20 hover:bg-tron-cyan/30 text-tron-cyan transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Source
          </button>
        </div>
      </div>

      {/* Sources List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 text-tron-cyan animate-spin" />
          </div>
        ) : sources.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No knowledge sources yet</p>
            <p className="text-xs mt-1">Add URLs, YouTube videos, or GitHub repos to build your knowledge base</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {sources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-4 hover:bg-gray-900/50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-gray-400">
                    {SOURCE_ICONS[source.source_type as SourceType] || <Globe className="w-4 h-4" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-mono truncate">
                      {source.title || source.source_url}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        {SOURCE_LABELS[source.source_type as SourceType] || source.source_type}
                      </span>
                      {source.chunk_count > 0 && (
                        <span className="text-xs text-gray-500">
                          {source.chunk_count} chunks
                        </span>
                      )}
                      {getStatusBadge(source.status)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(source.id)}
                  className="p-2 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                  title="Delete source"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-tron-dark border border-tron-cyan/30 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-white font-mono text-lg mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-tron-cyan" />
              Add Knowledge Source
            </h3>

            {/* Source Type Selector */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-2 block">Source Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['url', 'youtube', 'github', 'notion', 'markdown'] as SourceType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewSource({ ...newSource, type })}
                    className={`flex items-center gap-2 p-2 rounded border transition-colors ${
                      newSource.type === type
                        ? 'border-tron-cyan bg-tron-cyan/10 text-tron-cyan'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {SOURCE_ICONS[type]}
                    <span className="text-xs">{SOURCE_LABELS[type].split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Source Input */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-2 block">
                {newSource.type === 'markdown' ? 'Markdown Content' : 'Source URL'}
              </label>
              {newSource.type === 'markdown' ? (
                <textarea
                  value={newSource.source}
                  onChange={(e) => setNewSource({ ...newSource, source: e.target.value })}
                  placeholder="# Your markdown content here..."
                  className="w-full h-32 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm font-mono focus:border-tron-cyan focus:outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={newSource.source}
                  onChange={(e) => setNewSource({ ...newSource, source: e.target.value })}
                  placeholder={
                    newSource.type === 'youtube' ? 'https://youtube.com/watch?v=...' :
                    newSource.type === 'github' ? 'https://github.com/owner/repo' :
                    newSource.type === 'notion' ? 'https://notion.so/...' :
                    'https://...'
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm font-mono focus:border-tron-cyan focus:outline-none"
                />
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setError(null);
                }}
                className="px-4 py-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleIngest}
                disabled={ingesting || !newSource.source.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded bg-tron-cyan/20 text-tron-cyan hover:bg-tron-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {ingesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Ingesting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Ingest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KnowledgeSources;
