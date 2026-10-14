import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { Server, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export const TopBar: React.FC = () => {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState<'UP' | 'DOWN' | 'CHECKING'>('CHECKING');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Format page path into breadcrumb
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumb = pathParts.length === 0
    ? 'Overview'
    : pathParts
        .map((p) => p.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
        .join(' / ');

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Health check
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const res = await api.getHealth();
        if (isMounted) {
          if (res.data?.status === 'UP' || res.status === 200) {
            setBackendStatus('UP');
          } else {
            setBackendStatus('DOWN');
          }
        }
      } catch (err) {
        if (isMounted) {
          setBackendStatus('DOWN');
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#0d1526] border-b border-[#2a3a5c] shrink-0">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-mono">CyberShield</span>
        <span className="text-xs text-slate-600">/</span>
        <span className="text-sm font-semibold text-white tracking-wide">
          {breadcrumb}
        </span>
      </div>

      {/* Center: Backend Status Indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111d36] border border-[#2a3a5c]">
        <Server className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-300">API Gateway:</span>
        {backendStatus === 'UP' && (
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>ONLINE</span>
          </div>
        )}
        {backendStatus === 'DOWN' && (
          <div className="flex items-center gap-1.5 text-rose-400 font-medium text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>OFFLINE</span>
          </div>
        )}
        {backendStatus === 'CHECKING' && (
          <div className="flex items-center gap-1.5 text-amber-400 font-medium text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>CONNECTING</span>
          </div>
        )}
      </div>

      {/* Right: Timestamp and Version */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime || '00:00:00 UTC'}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1a2744] border border-[#2a3a5c] text-[11px] font-mono text-cyan-300">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>v1.0.0</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
