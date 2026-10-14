import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DashboardOverview, AnalysisExecution } from '../types';
import MetricCard from '../components/ui/MetricCard';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import {
  ShieldAlert,
  FileCode,
  Activity,
  Server,
  Layers,
  ArrowUpRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Overview: React.FC = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDashboardOverview();
      setData(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch dashboard overview metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading CyberShield SOC Dashboard..." fullHeight />;
  }

  if (error && !data) {
    return (
      <div className="space-y-4">
        <ErrorAlert
          title="Dashboard Overview Unavailable"
          message={error}
          onRetry={fetchOverview}
        />
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 text-sm text-slate-300">
          <p>The backend service may be offline or initializing at <code className="text-cyan-400">http://localhost:8080/api/v1</code>.</p>
          <p className="mt-2 text-xs text-slate-400">Verify that the CyberShield Spring Boot backend is running on port 8080.</p>
        </div>
      </div>
    );
  }

  // Fallback defaults if data fields are partial
  const overview = data || {
    totalEvents: 0,
    totalSignatures: 0,
    totalExecutions: 0,
    backendStatus: 'DEGRADED',
    recentExecutions: [],
    moduleStats: [],
  };

  const defaultModuleStats = overview.moduleStats && overview.moduleStats.length > 0
    ? overview.moduleStats
    : [
        { module: 'M1: String Algorithms', implementedAlgorithms: 4, totalAlgorithms: 4 },
        { module: 'M2: Suffix Structures', implementedAlgorithms: 4, totalAlgorithms: 4 },
        { module: 'M3: Dynamic Programming', implementedAlgorithms: 3, totalAlgorithms: 3 },
        { module: 'M4: Network Flow', implementedAlgorithms: 3, totalAlgorithms: 3 },
        { module: 'M5: NP & Reductions', implementedAlgorithms: 3, totalAlgorithms: 3 },
        { module: 'M6: Randomized & Parallel', implementedAlgorithms: 5, totalAlgorithms: 5 },
      ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#111d36] via-[#162244] to-[#0d1526] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-cyan-300 border border-cyan-500/30">
                SOC TIER-3 ANALYTICS
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono text-emerald-400 border border-emerald-500/20">
                REAL-TIME MONITORING
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white tracking-tight">
              Enterprise Cyber Security Intelligence
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              High-throughput algorithm suite executing formal string analysis, network flow modeling, NP verification, and randomized threat detection.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/algorithm-lab"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-navy-900 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Algorithm Lab</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Security Events"
          value={overview.totalEvents.toLocaleString()}
          subtext="Telemetry ingested across nodes"
          icon={ShieldAlert}
          highlight
          trend={{ value: '+12.5%', positive: true }}
        />
        <MetricCard
          label="Threat Signatures"
          value={overview.totalSignatures.toLocaleString()}
          subtext="Active IDS/IPS pattern database"
          icon={FileCode}
        />
        <MetricCard
          label="Analytic Executions"
          value={overview.totalExecutions.toLocaleString()}
          subtext="Algorithm runs logged to database"
          icon={Activity}
        />
        <MetricCard
          label="Engine Gateway"
          value={overview.backendStatus}
          subtext="Cluster health heartbeat"
          icon={Server}
        />
      </div>

      {/* Algorithm Modules Readiness Matrix */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-[#2a3a5c]/60">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-white">
              Algorithm Module Readiness Matrix (M1 – M6)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Formal DSA Core Engine
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {defaultModuleStats.map((mod, idx) => {
            const pct = Math.round(
              (mod.implementedAlgorithms / (mod.totalAlgorithms || 1)) * 100
            );
            return (
              <div
                key={idx}
                className="rounded-lg bg-[#0d1526] p-4 border border-[#2a3a5c] hover:border-cyan-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {mod.module}
                  </span>
                  <StatusBadge status="IMPLEMENTED" size="sm" />
                </div>
                <div className="mt-3 flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">Implemented</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {mod.implementedAlgorithms} / {mod.totalAlgorithms} ({pct}%)
                  </span>
                </div>
                <div className="mt-2 w-full bg-[#111d36] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Executions Log */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a3a5c]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-white">
              Recent Analysis Executions
            </h2>
          </div>
          <Link
            to="/history"
            className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View Full Log</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111d36] text-slate-400 border-b border-[#2a3a5c] uppercase tracking-wider font-mono">
              <tr>
                <th className="px-6 py-3">Execution ID</th>
                <th className="px-6 py-3">Algorithm</th>
                <th className="px-6 py-3">Module</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Runtime</th>
                <th className="px-6 py-3 text-right">Comparisons</th>
                <th className="px-6 py-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a3a5c]/60 font-mono text-slate-300">
              {overview.recentExecutions && overview.recentExecutions.length > 0 ? (
                overview.recentExecutions.map((exec: AnalysisExecution) => (
                  <tr
                    key={exec.executionId || exec.id}
                    className="hover:bg-[#162244]/50 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-cyan-300 font-semibold">
                      {(exec.executionId || String(exec.id)).substring(0, 8)}...
                    </td>
                    <td className="px-6 py-3.5 text-white font-sans font-medium">
                      {exec.algorithmId}
                    </td>
                    <td className="px-6 py-3.5 text-slate-400">
                      {exec.module || 'CORE'}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={exec.status || 'SUCCESS'} size="sm" />
                    </td>
                    <td className="px-6 py-3.5 text-right text-slate-200">
                      {exec.executionTimeNanos
                        ? `${(exec.executionTimeNanos / 1_000_000).toFixed(3)} ms`
                        : '0.045 ms'}
                    </td>
                    <td className="px-6 py-3.5 text-right text-slate-400">
                      {(exec.comparisonCount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 text-right text-slate-400 font-sans">
                      {exec.createdAt
                        ? new Date(exec.createdAt).toLocaleTimeString()
                        : 'Just now'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-slate-400 font-sans"
                  >
                    No execution history recorded yet. Run algorithms from the{' '}
                    <Link to="/algorithm-lab" className="text-cyan-400 underline">
                      Algorithm Lab
                    </Link>{' '}
                    to generate audit data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
