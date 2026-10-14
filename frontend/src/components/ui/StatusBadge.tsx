import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const norm = (status || '').toUpperCase();

  const colorStyles: Record<string, string> = {
    // Severity
    CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/30',
    HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    MEDIUM: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    LOW: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',

    // Execution / Status
    SUCCESS: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    ERROR: 'bg-red-500/15 text-red-400 border-red-500/30',
    VALIDATION_ERROR: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    RUNNING: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 animate-pulse',

    // Algorithms
    IMPLEMENTED: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    PLANNED: 'bg-slate-500/15 text-slate-400 border-slate-500/30',

    // System
    UP: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    DOWN: 'bg-red-500/15 text-red-400 border-red-500/30',
    DEGRADED: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  };

  const currentStyle =
    colorStyles[norm] || 'bg-slate-700/30 text-slate-300 border-slate-600/30';

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${currentStyle} ${sizeStyles[size]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          norm === 'CRITICAL' || norm === 'ERROR' || norm === 'DOWN'
            ? 'bg-red-400'
            : norm === 'HIGH'
            ? 'bg-orange-400'
            : norm === 'MEDIUM' || norm === 'DEGRADED'
            ? 'bg-yellow-400'
            : norm === 'LOW' || norm === 'SUCCESS' || norm === 'UP'
            ? 'bg-emerald-400'
            : norm === 'IMPLEMENTED' || norm === 'RUNNING'
            ? 'bg-cyan-400'
            : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
