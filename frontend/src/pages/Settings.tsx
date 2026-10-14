import React, { useState } from 'react';
import { api } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import {
  Settings as SettingsIcon,
  Server,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Terminal,
  Database,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const backendUrl =
    import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

  const [testingHealth, setTestingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [healthLatency, setHealthLatency] = useState<number | null>(null);

  const testConnection = async () => {
    setTestingHealth(true);
    setHealthStatus(null);
    const start = performance.now();
    try {
      const res = await api.getHealth();
      const elapsed = Math.round(performance.now() - start);
      setHealthLatency(elapsed);
      if (res.status === 200 || res.data?.status === 'UP') {
        setHealthStatus('CONNECTED');
      } else {
        setHealthStatus('DEGRADED');
      }
    } catch (err: any) {
      setHealthStatus('DISCONNECTED');
    } finally {
      setTestingHealth(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Platform Configuration & Gateway Settings
            </h1>
            <p className="text-xs text-slate-400">
              Manage API gateway connections, telemetry seeds, and platform diagnostic telemetry
            </p>
          </div>
        </div>
      </div>

      {/* Backend Gateway Connectivity Panel */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 shadow-md space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-[#2a3a5c]/60">
          <Server className="w-4 h-4 text-cyan-400" />
          API Gateway Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Target Endpoint URL</label>
            <div className="p-3 rounded-lg bg-[#0d1526] text-cyan-300 border border-[#2a3a5c] font-bold">
              {backendUrl}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Connection State</label>
            <div className="p-3 rounded-lg bg-[#0d1526] border border-[#2a3a5c] flex items-center justify-between">
              <span className="text-slate-300">
                {healthStatus ? (
                  healthStatus === 'CONNECTED' ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> CONNECTED ({healthLatency} ms)
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> OFFLINE / UNREACHABLE
                    </span>
                  )
                ) : (
                  <span className="text-slate-400">Not verified this session</span>
                )}
              </span>

              <button
                onClick={testConnection}
                disabled={testingHealth}
                className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#162244] text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 transition-colors"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${testingHealth ? 'animate-spin' : ''}`}
                />
                <span>Test Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Data & Simulation Context */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 shadow-md space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-[#2a3a5c]/60">
          <Database className="w-4 h-4 text-cyan-400" />
          Seeded Telemetry & Simulation Principles
        </h2>

        <div className="p-4 rounded-lg bg-[#0d1526] border border-[#2a3a5c] text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <Info className="w-4 h-4" />
            <span>Ethical Testing & Sample Data Disclosure</span>
          </div>
          <p className="leading-relaxed">
            All security event telemetry displayed across the Data Explorer consists of seeded demonstration vectors modeling common web exploits (SQL injection, XSS, Path Traversal), C2 beacon frequencies, and port scans. No live production credentials or confidential enterprise assets are processed.
          </p>
          <p className="text-slate-400 leading-relaxed">
            The platform executes real, mathematically sound algorithms (KMP, Kasai LCP, SA-IS, Blelloch, Dinic) against this telemetry to evaluate computational performance and time/space complexity guarantees.
          </p>
        </div>
      </div>

      {/* Software Architecture & Versions */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 shadow-md space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-[#2a3a5c]/60">
          <Code2 className="w-4 h-4 text-cyan-400" />
          Platform Version & Technology Stack
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#0d1526] border border-[#2a3a5c]">
            <span className="text-slate-400 text-[10px] block">CyberShield Version</span>
            <span className="text-cyan-400 font-bold">v1.0.0 (Enterprise)</span>
          </div>
          <div className="p-3 rounded-lg bg-[#0d1526] border border-[#2a3a5c]">
            <span className="text-slate-400 text-[10px] block">Frontend Framework</span>
            <span className="text-white font-bold">React 18 + TypeScript 5</span>
          </div>
          <div className="p-3 rounded-lg bg-[#0d1526] border border-[#2a3a5c]">
            <span className="text-slate-400 text-[10px] block">Styling System</span>
            <span className="text-white font-bold">Tailwind CSS 3 (SOC Dark)</span>
          </div>
          <div className="p-3 rounded-lg bg-[#0d1526] border border-[#2a3a5c]">
            <span className="text-slate-400 text-[10px] block">Core DSA Engine</span>
            <span className="text-emerald-400 font-bold">Spring Boot 3 / JVM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
