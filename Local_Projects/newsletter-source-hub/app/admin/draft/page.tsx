'use client';
import { useState } from 'react';
import { Sparkles, Copy, Code } from 'lucide-react';
import { NewsletterDraft, DigestData } from '@/lib/types';

export default function DraftPage() {
  const [draft, setDraft] = useState<NewsletterDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Get current items first
      const resData = await fetch('/api/admin/feed?t=' + Date.now(), {
        credentials: 'include',
      });
      const data: DigestData = await resData.json();

      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ items: data.items })
      });
      
      if (res.status === 401) {
        setError('Session expired. Please sign in again.');
        return;
      }
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate');
      }
      
      const result = await res.json();
      setDraft(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyHtml = () => {
    if (draft) {
      navigator.clipboard.writeText(draft.html_preview);
      alert('HTML copied to clipboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Newsletter Generator</h2>
        <button 
          onClick={generate}
          disabled={loading}
          className="flex items-center bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition shadow-sm"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {loading ? 'Generating with Perplexity...' : 'Generate New Draft'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 mb-6">
          {error}
        </div>
      )}

      {draft && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Side */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="font-semibold text-slate-800">HTML Preview</h3>
              <button onClick={copyHtml} className="text-sm text-blue-600 flex items-center hover:underline">
                <Copy className="w-3 h-3 mr-1" /> Copy Code
              </button>
            </div>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: draft.html_preview }} />
          </div>

          {/* JSON Structure Side */}
          <div className="bg-slate-900 p-6 rounded-xl shadow-inner text-slate-300 overflow-auto max-h-[600px] text-xs font-mono">
            <div className="flex items-center mb-4 text-slate-400">
              <Code className="w-4 h-4 mr-2" />
              <span>Structured Data (JSON)</span>
            </div>
            <pre>{JSON.stringify(draft.sections, null, 2)}</pre>
          </div>
        </div>
      )}
      
      {!draft && !loading && (
        <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-xl text-slate-400">
          <p>Curate your items first, then click Generate to create the newsletter.</p>
        </div>
      )}
    </div>
  );
}
