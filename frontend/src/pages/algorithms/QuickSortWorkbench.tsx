import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, QuickSortResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, ArrowDownUp } from 'lucide-react';

export const QuickSortWorkbench: React.FC = () => {
  const [arrayInput, setArrayInput] = useState<string>(
    '88, 14, 92, 45, 12, 67, 33, 5, 78, 29, 61, 4'
  );
  const [seed, setSeed] = useState<string>('42');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<QuickSortResult> | null>(null);

  const handleRun = async () => {
    const arr = arrayInput
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));

    if (arr.length === 0) {
      setError('Please provide at least one number in the array.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload: any = { array: arr };
      if (seed) payload.seed = parseInt(seed, 10);
      const res = await api.runRandomizedQuickSort(payload);
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute Randomized QuickSort.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    // Worst-case sorted input for deterministic quicksort (O(n^2)), but O(n log n) for randomized
    setArrayInput('1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16');
    setSeed('1337');
  };

  return (
    <AlgorithmPanel
      title="Randomized QuickSort (Las Vegas Pivot Selection)"
      module="M6: Randomized & Parallel Algorithms"
      timeComplexity="Expected O(n log n), Worst O(n²)"
      spaceComplexity="O(log n) stack space"
      description="Las Vegas randomized sorting algorithm that always produces the correct sorted output while picking random pivots uniformly. Defeats adversarial input degradation attacks (algorithmic complexity attacks)."
      cyberApplication="Adversary-resistant sorting in network routers, packet reassembly buffers, and telemetry queue management"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Adversarial Sorted Array</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Unsorted Numbers Array (comma-separated)
              </label>
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                RNG Seed (Deterministic Reproducibility)
              </label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-cyan-300 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
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
              <span>{loading ? 'Partitioning...' : 'Sort with Random Pivots'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Partitioning sub-arrays around uniform pivots..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Elements Sorted"
                value={response.result.sortedArray?.length ?? 0}
                subtext="100% verified order"
                highlight
              />
              <MetricCard
                label="Comparisons Recorded"
                value={(response.result.comparisons ?? response.metrics?.comparisonCount ?? 0).toLocaleString()}
                subtext={`Expected: ~${Math.round(1.386 * (response.result.sortedArray?.length || 1) * Math.log2(response.result.sortedArray?.length || 1))} comparisons`}
              />
              <MetricCard
                label="Execution Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
            </div>

            {/* Sorted Result Output */}
            <div className="rounded-xl border border-cyan-500/30 bg-[#111d36]/70 p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4" />
                Sorted Array Result
              </h3>
              <div className="p-4 rounded-lg bg-[#090d19] font-mono text-xs text-emerald-300 border border-[#2a3a5c] break-words overflow-x-auto">
                [{ (response.result.sortedArray || []).join(', ') }]
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

export default QuickSortWorkbench;
