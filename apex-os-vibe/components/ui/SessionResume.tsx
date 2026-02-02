import { Terminal, RotateCcw, Play } from 'lucide-react';

export interface SessionResumeProps {
  onResume: () => void;
  onStartFresh: () => void;
  lastSaved: Date | null;
  lineCount?: number;
  historyCount?: number;
}

export const SessionResume: React.FC<SessionResumeProps> = ({
  onResume,
  onStartFresh,
  lastSaved,
  lineCount,
  historyCount,
}) => {
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  return (
    <div className="p-4 bg-tron-cyan/10 border border-tron-cyan/30 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-tron-cyan/20 rounded-lg">
          <Terminal className="w-5 h-5 text-tron-cyan" />
        </div>
        <div className="flex-1">
          <h3 className="text-tron-cyan font-bold mb-1">Saved Session Found</h3>
          {lastSaved && (
            <p className="text-gray-400 text-sm mb-2">
              Last active: {formatTime(lastSaved)}
            </p>
          )}
          {(lineCount !== undefined || historyCount !== undefined) && (
            <p className="text-gray-500 text-xs mb-3">
              {lineCount !== undefined && (
                <span>
                  <span className="text-tron-cyan">{lineCount}</span> lines
                </span>
              )}
              {lineCount !== undefined && historyCount !== undefined && (
                <span className="mx-2">•</span>
              )}
              {historyCount !== undefined && (
                <span>
                  <span className="text-tron-cyan">{historyCount}</span> commands
                </span>
              )}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={onResume}
              className="flex items-center gap-2 px-4 py-2 bg-tron-cyan/20 border border-tron-cyan/50 rounded text-tron-cyan text-sm font-mono hover:bg-tron-cyan/30 hover:border-tron-cyan transition-all duration-200"
            >
              <Play className="w-4 h-4" />
              Resume Session
            </button>
            <button
              onClick={onStartFresh}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded text-gray-400 text-sm font-mono hover:bg-gray-700/50 hover:text-gray-300 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Start Fresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionResume;
