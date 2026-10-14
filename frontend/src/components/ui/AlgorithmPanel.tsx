import React from 'react';
import { Clock, HardDrive, ShieldAlert, BookOpen } from 'lucide-react';

interface AlgorithmPanelProps {
  title: string;
  module: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  cyberApplication?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const AlgorithmPanel: React.FC<AlgorithmPanelProps> = ({
  title,
  module,
  timeComplexity,
  spaceComplexity,
  description,
  cyberApplication,
  children,
  actions,
}) => {
  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2a3a5c]/60">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                {module}
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {title}
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-300">{description}</p>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>

        {/* Algorithm Specs & Security Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="flex items-center gap-2 rounded-lg bg-[#0d1526]/80 p-2.5 border border-[#2a3a5c]/40">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400">Time Complexity: </span>
              <span className="font-mono font-semibold text-slate-200">
                {timeComplexity}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-[#0d1526]/80 p-2.5 border border-[#2a3a5c]/40">
            <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400">Space Complexity: </span>
              <span className="font-mono font-semibold text-slate-200">
                {spaceComplexity}
              </span>
            </div>
          </div>

          {cyberApplication ? (
            <div className="flex items-center gap-2 rounded-lg bg-[#0d1526]/80 p-2.5 border border-[#2a3a5c]/40">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">SOC Context: </span>
                <span className="text-slate-200 truncate" title={cyberApplication}>
                  {cyberApplication}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-[#0d1526]/80 p-2.5 border border-[#2a3a5c]/40">
              <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400">Classification: </span>
                <span className="text-slate-200">Deterministic / Optimal</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content / Workbench Interactive Area */}
      <div>{children}</div>
    </div>
  );
};

export default AlgorithmPanel;
