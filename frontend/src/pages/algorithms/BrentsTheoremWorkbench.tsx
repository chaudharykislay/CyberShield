import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, BrentsTheoremResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Cpu, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const BrentsTheoremWorkbench: React.FC = () => {
  const [work, setWork] = useState<number>(10000);
  const [depth, setDepth] = useState<number>(14);
  const [processors, setProcessors] = useState<number>(16);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<BrentsTheoremResult> | null>(null);

  const handleRun = async () => {
    if (work <= 0 || depth <= 0 || processors <= 0) {
      setError('Work, Depth, and Processors must all be positive integers.');
      return;
    }
    if (depth > work) {
      setError('Critical depth D cannot exceed total work W.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.runBrentsTheorem({
        work: Number(work),
        depth: Number(depth),
        processors: Number(processors),
      });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to compute Brent scheduling theorem.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    // 1 million operations, depth 20 (log2(1M)), 64 worker threads
    setWork(1000000);
    setDepth(20);
    setProcessors(64);
  };

  // Generate theoretical scaling curve data for 1..128 processors
  const scalingData = [1, 2, 4, 8, 16, 32, 64, 128].map((p) => {
    const tp = Math.floor((work - depth) / p) + depth;
    const speedup = Number((work / (tp || 1)).toFixed(2));
    return {
      processors: `${p} cores`,
      speedup,
      linearIdeal: p,
      tp,
    };
  });

  return (
    <AlgorithmPanel
      title="Brent's Scheduling Principle (Work-Depth Bound)"
      module="M6: Randomized & Parallel Algorithms"
      timeComplexity="T_P ≤ ⌊(W - D) / P⌋ + D"
      spaceComplexity="O(1) analytical"
      description="Fundamental scheduling theorem establishing that any parallel algorithm with total work W and span D can be executed on P processors in time at most (W - D)/P + D, quantifying the theoretical upper limit on speedup."
      cyberApplication="High-performance firewall multicore core scaling, GPU packet filter thread budget calculation, and cryptographic hash mining thread allocation"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load 64-Core Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Critical Scientific Disclaimer Badge */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs text-amber-200">
            <strong className="block font-semibold">THEORETICAL ESTIMATE NOTICE:</strong>
            All results calculated below represent formal theoretical bounds derived from Brent&apos;s Theorem (1974) — this is <em>not</em> an empirical hardware benchmark measurement.
          </div>
        </div>

        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Total Work W (T₁ = 1 Processor)
              </label>
              <input
                type="number"
                min={1}
                value={work}
                onChange={(e) => setWork(Number(e.target.value))}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-cyan-300 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Critical Path Span D (T∞ Depth)
              </label>
              <input
                type="number"
                min={1}
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Allocated Processors P
              </label>
              <input
                type="number"
                min={1}
                value={processors}
                onChange={(e) => setProcessors(Number(e.target.value))}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Evaluating...' : 'Evaluate Brent Bound'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Applying greedy scheduler step assignment bounds..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <MetricCard
                label="Theoretical Time T_P"
                value={`${response.result.theoreticalTime ?? Math.floor((work - depth) / processors) + depth} steps`}
                subtext={`(W - D)/${processors} + D bound`}
                highlight
              />
              <MetricCard
                label="Theoretical Speedup S"
                value={`${(response.result.speedup ?? (work / (Math.floor((work - depth) / processors) + depth))).toFixed(2)}×`}
                subtext={`Speedup on ${processors} cores`}
              />
              <MetricCard
                label="Processor Efficiency E"
                value={`${((response.result.efficiency ?? (work / (processors * (Math.floor((work - depth) / processors) + depth)))) * 100).toFixed(1)}%`}
                subtext="S / P core utilization ratio"
              />
              <MetricCard
                label="Asymptotic Max Speedup"
                value={`${(work / depth).toFixed(1)}×`}
                subtext="Amdahl/Brent upper limit W/D"
              />
            </div>

            {/* Theoretical Scaling Chart */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Speedup Scaling Across Processors (Brent Bound Curve)
                </h3>
                <span className="text-[11px] font-mono text-cyan-400">
                  Cyan = Brent Bound | Slate = Ideal Linear
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scalingData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5c" opacity={0.5} />
                    <XAxis dataKey="processors" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0d1526',
                        borderColor: '#2a3a5c',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#00d4ff',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="speedup"
                      name="Brent Bound Speedup"
                      stroke="#00d4ff"
                      strokeWidth={3}
                      dot={{ fill: '#00d4ff', r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="linearIdeal"
                      name="Ideal Linear Speedup"
                      stroke="#64748b"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {response.trace && response.trace.length > 0 && (
              <TraceViewer trace={response.trace} />
            )}
          </div>
        )}
      </div>
    </AlgorithmPanel>
  );
};

export default BrentsTheoremWorkbench;
