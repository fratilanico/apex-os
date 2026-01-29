import { useState } from 'react';
import { Download, Share2, Copy, Check, Terminal, Code, FileJson } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SessionExportProps {
  messages: Message[];
  projectName?: string;
  activeFiles?: string[];
  onClose?: () => void;
}

type ExportFormat = 'claude-code' | 'cursor' | 'opencode' | 'jsonl' | 'markdown';

const FORMAT_INFO: Record<ExportFormat, { name: string; icon: React.ReactNode; desc: string; file: string }> = {
  'claude-code': {
    name: 'Claude Code',
    icon: <Terminal className="w-4 h-4" />,
    desc: 'CLAUDE.md context file',
    file: 'CLAUDE.md'
  },
  'cursor': {
    name: 'Cursor',
    icon: <Code className="w-4 h-4" />,
    desc: 'Cursor Composer JSON',
    file: 'apex-session.cursor.json'
  },
  'opencode': {
    name: 'OpenCode',
    icon: <Terminal className="w-4 h-4" />,
    desc: 'AGENTS.md instruction file',
    file: 'AGENTS.md'
  },
  'jsonl': {
    name: 'Universal JSONL',
    icon: <FileJson className="w-4 h-4" />,
    desc: 'Works with any tool',
    file: 'apex-session.jsonl'
  },
  'markdown': {
    name: 'Markdown',
    icon: <FileJson className="w-4 h-4" />,
    desc: 'Human-readable transcript',
    file: 'apex-session.md'
  }
};

export function SessionExport({ messages, projectName, activeFiles, onClose }: SessionExportProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('claude-code');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExport = async (format: ExportFormat, action: 'download' | 'copy') => {
    setIsExporting(true);
    setSelectedFormat(format);

    try {
      const response = await fetch('/api/session/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          format,
          metadata: { projectName, activeFiles }
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      if (action === 'download') {
        // Create download
        const blob = new Blob([data.content], { type: data.contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Copy to clipboard
        await navigator.clipboard.writeText(data.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-tron-dark/95 border border-tron-cyan/30 rounded-lg p-4 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-tron-cyan font-mono text-sm flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Export Session
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            ×
          </button>
        )}
      </div>

      <p className="text-gray-400 text-xs mb-4">
        Transfer this conversation to another AI coding tool
      </p>

      <div className="space-y-2">
        {(Object.keys(FORMAT_INFO) as ExportFormat[]).map((format) => {
          const info = FORMAT_INFO[format];
          return (
            <div
              key={format}
              className={`flex items-center justify-between p-3 rounded border transition-all ${
                selectedFormat === format
                  ? 'border-tron-cyan bg-tron-cyan/10'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-tron-cyan">{info.icon}</span>
                <div>
                  <div className="text-white text-sm font-mono">{info.name}</div>
                  <div className="text-gray-500 text-xs">{info.desc}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleExport(format, 'copy')}
                  disabled={isExporting}
                  className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copied && selectedFormat === format ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleExport(format, 'download')}
                  disabled={isExporting}
                  className="p-2 rounded bg-tron-cyan/20 hover:bg-tron-cyan/30 text-tron-cyan transition-colors"
                  title={`Download ${info.file}`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          <span className="text-tron-cyan">{messages.length}</span> messages in session
          {projectName && (
            <span className="ml-2">
              • Project: <span className="text-white">{projectName}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default SessionExport;
