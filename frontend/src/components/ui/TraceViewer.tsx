import React, { useState } from 'react';
import { Terminal, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface TraceViewerProps {
  trace: string[];
  maxInitial?: number;
  title?: string;
}

export const TraceViewer: React.FC<TraceViewerProps> = ({
  trace = [],
  maxInitial = 50,
  title = 'Execution Trace',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('');

  if (!trace || trace.length === 0) {
    return null;
  }

  const filteredTrace = filter
    ? trace.filter((t) => t.toLowerCase().includes(filter.toLowerCase()))
    : trace;

  const displayTrace = isExpanded
    ? filteredTrace
    : filteredTrace.slice(0, maxInitial);

  const handleCopy = () => {
    navigator.clipboard.writeText(trace.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[#2a3a5c] bg-[#0d1526] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between border-b border-[#2a3a5c] px-4 py-3 bg-[#111d36]/50 gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">{title}</span>
          <span className="rounded-full bg-[#1a2744] px-2 py-0.5 text-xs font-mono text-cyan-400 border border-[#2a3a5c]">
            {trace.length} events
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter trace..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded bg-[#0a0f1e] px-2.5 py-1 text-xs text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500 placeholder-slate-500"
          />

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            title="Copy trace log"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-3 max-h-80 overflow-y-auto font-mono text-xs space-y-1 bg-[#090d19]">
        {displayTrace.map((line, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 hover:bg-[#111d36]/70 px-2 py-1 rounded transition-colors"
          >
            <span className="text-slate-600 select-none w-10 text-right shrink-0">
              {idx + 1}
            </span>
            <span className="text-slate-300 break-all">{line}</span>
          </div>
        ))}
        {filteredTrace.length === 0 && (
          <div className="text-slate-500 text-center py-4">
            No matching trace lines found
          </div>
        )}
      </div>

      {filteredTrace.length > maxInitial && (
        <div className="border-t border-[#2a3a5c] p-2 bg-[#0d1526] text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Show less ({maxInitial} events)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show all {filteredTrace.length} events</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TraceViewer;
