import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive?: boolean;
  };
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  highlight = false,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-200 ${
        highlight
          ? 'bg-gradient-to-br from-[#162244] to-[#1a2744] border-cyan-500/40 shadow-lg shadow-cyan-500/5'
          : 'bg-[#1a2744]/90 border-[#2a3a5c] hover:border-[#3d517d]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trend.positive ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtext && (
            <p className="mt-1 text-xs text-slate-400">{subtext}</p>
          )}
        </div>
        {Icon && (
          <div
            className={`rounded-lg p-2.5 ${
              highlight
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-slate-800/80 text-slate-300 border border-[#2a3a5c]'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {highlight && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
      )}
    </div>
  );
};

export default MetricCard;
