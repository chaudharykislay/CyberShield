import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Cpu,
  Network,
  BarChart3,
  History,
  FileText,
  Settings,
  Shield,
  Activity,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/overview', label: 'Overview', icon: LayoutDashboard },
    { to: '/data-explorer', label: 'Data Explorer', icon: Database },
    { to: '/algorithm-lab', label: 'Algorithm Lab', icon: Cpu },
    { to: '/network-analysis', label: 'Network Analysis', icon: Network },
    { to: '/benchmarking', label: 'Benchmarking', icon: BarChart3 },
    { to: '/history', label: 'History', icon: History },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex flex-col bg-[#0d1526] border-r border-[#2a3a5c] select-none shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-[#2a3a5c]">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Shield className="w-5 h-5 fill-cyan-400/20" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-wide text-white font-mono">
              Cyber<span className="text-cyan-400">Shield</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            Security Analytics
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Platform Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#1a2744] text-cyan-400 border-l-4 border-cyan-400 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#111d36] border-l-4 border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* SOC Live Monitor Banner */}
      <div className="p-4 border-t border-[#2a3a5c] bg-[#0a0f1e]/60">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Engine Status
          </span>
          <span className="text-[11px] font-mono text-emerald-400">SECURE</span>
        </div>
        <div className="w-full bg-[#1a2744] rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-1.5 rounded-full w-full animate-pulse" />
        </div>
        <p className="text-[10px] text-slate-400 font-mono mt-2">
          CyberShield Core v1.0.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
