import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  maxHeight?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  maxHeight = 'max-h-64',
  title,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[#2a3a5c] bg-[#0d1526] overflow-hidden">
      {(title || language) && (
        <div className="flex items-center justify-between border-b border-[#2a3a5c] px-4 py-2 bg-[#111d36]/60">
          <span className="text-xs font-mono font-medium text-slate-300">
            {title || language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
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
      )}
      <pre
        className={`p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto ${maxHeight} leading-relaxed selection:bg-cyan-500/30 selection:text-white`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
