import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BenchmarkResult } from '../types';
import MetricCard from '../components/ui/MetricCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import {
  BarChart3,
  Play,
  RotateCcw,
  Sparkles,
  Cpu,
  Info,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const Benchmarking: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>('M1');
  const [inputSize, setInputSize] = useState<number>(10000);
  const [iterations, setIterations] = useState<number>(20);
  const [warmupIterations, setWarmupIterations] = useState<number>(5);

  const [benchmarks, setBenchmarks] = useState<BenchmarkResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExistingBenchmarks = async () => {
    try {
      const res = await api.getBenchmarks();
      if (Array.isArray(res.data) && res.data.length > 0) {
        setBenchmarks(res.data);
      }
    } catch (err: any) {
      // If none exist yet, user can run benchmark suite
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingBenchmarks();
  }, []);

  const handleRunBenchmark = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.runBenchmark({
        module: selectedModule,
        inputSize: Number(inputSize),
        iterations: Number(iterations),
        warmup: Number(warmupIterations),
      });

      if (Array.isArray(res.data)) {
        setBenchmarks(res.data);
      } else if (res.data && (res.data as any).result) {
        // Backend wrapped in AlgorithmResponse
        const result = (res.data as any).result;
        if (Array.isArray(result)) {
          setBenchmarks(result);
        } else if (result.benchmarks) {
          setBenchmarks(result.benchmarks);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to complete JVM benchmark run.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data: convert nanoseconds to microseconds or milliseconds for clean visualization
  const chartData = benchmarks.map((b: any) => {
    const med = b.medianTimeNanos ?? b.medianNanos ?? 0;
    const mn = b.minTimeNanos ?? b.minNanos ?? 0;
    const mx = b.maxTimeNanos ?? b.maxNanos ?? 0;
    return {
      name: b.algorithmName || b.algorithmId,
      medianMs: Number((med / 1_000_000).toFixed(4)),
      minMs: Number((mn / 1_000_000).toFixed(4)),
      maxMs: Number((mx / 1_000_000).toFixed(4)),
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                High-Precision Algorithm Benchmarking
              </h1>
              <p className="text-xs text-slate-400">
                Empirical runtime profiling, comparative nanosecond latency analysis, and JVM JIT warmup harness
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-cyan-500/10 px-2.5 py-1 text-xs font-mono text-cyan-400 border border-cyan-500/20">
              JMH / System.nanoTime Harness
            </span>
          </div>
        </div>

        {/* Benchmark Run Parameters */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3 border-t border-[#2a3a5c]/60 pt-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Target Algorithm Module</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full rounded bg-[#0d1526] px-2.5 py-1.5 text-cyan-300 border border-[#2a3a5c]"
            >
              <option value="M1">M1: String Algorithms (KMP, Z, RK, AC)</option>
              <option value="M2">M2: Suffix Structures (SA, SA-IS, LCP)</option>
              <option value="M3">M3: Dynamic Programming (Edit Dist, Bitmask)</option>
              <option value="M4">M4: Network Flow (Edmonds-Karp, Dinic)</option>
              <option value="M6">M6: Randomized Sorting (QuickSort)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Input Dataset Size (N)</label>
            <input
              type="number"
              min={100}
              max={1000000}
              step={1000}
              value={inputSize}
              onChange={(e) => setInputSize(Number(e.target.value))}
              className="w-full rounded bg-[#0d1526] px-2.5 py-1.5 text-white border border-[#2a3a5c]"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Measurement Iterations</label>
            <input
              type="number"
              min={5}
              max={100}
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="w-full rounded bg-[#0d1526] px-2.5 py-1.5 text-white border border-[#2a3a5c]"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunBenchmark}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Executing Suite...' : 'Execute Benchmark'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* JVM Warmup & Methodology Explainer Banner */}
      <div className="rounded-xl border border-cyan-500/30 bg-[#111d36]/70 p-4 flex items-start gap-3">
        <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <strong className="text-cyan-400 block font-semibold">
            Scientific Methodology & JVM Warmup Note:
          </strong>
          <p>
            Java Virtual Machine (JVM) benchmarks require warm-up iterations prior to timing measurement to ensure the C2 Just-In-Time (JIT) compiler compiles bytecode into optimized machine code and tiered compilation deoptimizations subside.
          </p>
          <p className="text-slate-400">
            Median latencies reflect steady-state operational performance with memory garbage collection outliers separated into min/max bounds.
          </p>
        </div>
      </div>

      {loading && <LoadingSpinner label="Running warmed-up benchmark iterations against backend JVM..." />}
      {error && <ErrorAlert message={error} onRetry={handleRunBenchmark} />}

      {/* Results Chart and Table */}
      {benchmarks.length > 0 && !loading && (
        <div className="space-y-6">
          {/* Recharts Bar Chart of Median Latencies */}
          <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Median Execution Latency Comparison (milliseconds)
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Lower is better | N = {inputSize.toLocaleString()} tokens
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5c" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" ms" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1526',
                      borderColor: '#2a3a5c',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#00d4ff',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="medianMs" name="Median Latency (ms)" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="minMs" name="Min Latency (ms)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maxMs" name="Max Latency (ms)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Statistics Table */}
          <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] overflow-hidden shadow-md">
            <div className="px-5 py-3 border-b border-[#2a3a5c] bg-[#111d36]/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Statistical Summary (Nanosecond Resolution)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0d1526] text-slate-400 border-b border-[#2a3a5c] uppercase text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Algorithm</th>
                    <th className="px-5 py-3 text-right">Input Size (N)</th>
                    <th className="px-5 py-3 text-right">Iterations</th>
                    <th className="px-5 py-3 text-right text-cyan-400">Median Runtime</th>
                    <th className="px-5 py-3 text-right text-emerald-400">Fastest (Min)</th>
                    <th className="px-5 py-3 text-right text-rose-400">Slowest (Max)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a3a5c]/60 text-slate-300">
                  {benchmarks.map((b: any, idx) => {
                    const med = b.medianTimeNanos ?? b.medianNanos ?? 0;
                    const mn = b.minTimeNanos ?? b.minNanos ?? 0;
                    const mx = b.maxTimeNanos ?? b.maxNanos ?? 0;
                    const iters = b.trialRounds ?? b.iterations ?? iterations;
                    return (
                      <tr key={idx} className="hover:bg-[#162244]/40">
                        <td className="px-5 py-3 font-sans font-semibold text-white">
                          {b.algorithmName || b.algorithmId}
                        </td>
                        <td className="px-5 py-3 text-right text-slate-400">
                          {(b.inputSize || inputSize).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-right text-slate-400">
                          {iters}
                        </td>
                        <td className="px-5 py-3 text-right text-cyan-300 font-bold">
                          {((med || 0) / 1_000_000).toFixed(4)} ms
                        </td>
                        <td className="px-5 py-3 text-right text-emerald-400">
                          {((mn || 0) / 1_000_000).toFixed(4)} ms
                        </td>
                        <td className="px-5 py-3 text-right text-rose-400">
                          {((mx || 0) / 1_000_000).toFixed(4)} ms
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {benchmarks.length === 0 && !loading && !initialLoading && (
        <div className="rounded-xl border border-dashed border-[#2a3a5c] bg-[#1a2744]/40 p-12 text-center text-slate-400">
          <BarChart3 className="w-10 h-10 mx-auto text-slate-500 mb-3" />
          <h3 className="text-sm font-semibold text-slate-200">No Benchmark Data Collected</h3>
          <p className="mt-1 text-xs max-w-sm mx-auto">
            Click &quot;Execute Benchmark&quot; above to trigger a warmed-up test run against the CyberShield backend engine.
          </p>
        </div>
      )}
    </div>
  );
};

export default Benchmarking;
