import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, ParallelScanResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, GitCommit, ArrowDown, ArrowUp } from 'lucide-react';

export const ParallelScanWorkbench: React.FC = () => {
  const [arrayInput, setArrayInput] = useState<string>('3, 1, 7, 0, 4, 1, 6, 3');
  const [operation, setOperation] = useState<string>('ADD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<ParallelScanResult> | null>(null);

  const handleRun = async () => {
    const arr = arrayInput
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));

    if (arr.length === 0) {
      setError('Please provide at least one number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.runParallelScan({
        array: arr,
        operation,
      });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute Parallel Prefix Scan.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    // 8 elements (power of 2)
    setArrayInput('2, 1, 4, 6, 8, 3, 5, 7');
    setOperation('ADD');
  };

  const rawElements = arrayInput.split(',').map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
  const n = rawElements.length;
  const theoreticalWork = 2 * n;
  const theoreticalDepth = Math.ceil(2 * Math.log2(n || 1));

  return (
    <AlgorithmPanel
      title="Blelloch Work-Efficient Parallel Prefix Scan"
      module="M6: Randomized & Parallel Algorithms"
      timeComplexity="Work: O(n), Depth (Span): O(log n)"
      spaceComplexity="O(n) auxiliary tree storage"
      description="Two-pass parallel algorithm computing exclusive prefix sums in logarithmic span using an Up-Sweep (reduce) balanced binary tree pass followed by a Down-Sweep distribution pass."
      cyberApplication="Line-rate parallel stream compression, GPU packet classification, and parallel radix sorting"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Power-of-2 Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Input Values Array (comma-separated, preferably power of 2)
              </label>
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-cyan-300 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Associative Operator (⊕)
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              >
                <option value="ADD">Addition (+)</option>
                <option value="MULTIPLY">Multiplication (×)</option>
                <option value="MAX">Maximum (max)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Scanning Tree...' : 'Execute Blelloch Scan'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Executing Up-Sweep (reduce) and Down-Sweep passes..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Total Work T₁"
                value={response.result.work ?? theoreticalWork}
                subtext="Total elementary operations (O(n))"
                highlight
              />
              <MetricCard
                label="Critical Span T∞"
                value={`${response.result.depth ?? theoreticalDepth} steps`}
                subtext="Execution depth with ∞ processors (O(log n))"
              />
              <MetricCard
                label="Execution Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
            </div>

            {/* Output Prefix Sums Array */}
            <div className="rounded-xl border border-cyan-500/30 bg-[#111d36]/70 p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-2">
                <GitCommit className="w-4 h-4" />
                Prefix Sum Result Array (Inclusive / Exclusive)
              </h3>
              <div className="p-4 rounded-lg bg-[#090d19] font-mono text-sm text-cyan-400 border border-[#2a3a5c] text-center overflow-x-auto">
                [{ (response.result.prefixSums || []).join(', ') }]
              </div>
            </div>

            {/* Work-Depth Blelloch Tree Stages Diagram */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Blelloch Parallel Two-Pass Algorithmic Architecture
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-lg bg-[#0d1526] border border-[#2a3a5c]">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
                    <ArrowUp className="w-4 h-4" />
                    <span>Pass 1: Up-Sweep (Reduce Phase)</span>
                  </div>
                  <p className="text-slate-400 font-sans text-xs mb-2">
                    Traverses binary tree from leaves to root in log₂(n) parallel steps, computing partial sums at internal nodes.
                  </p>
                  <div className="p-2.5 rounded bg-[#111d36] text-[11px] text-slate-300">
                    Depth: log₂(n) = {Math.ceil(Math.log2(n || 1))} parallel steps
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#0d1526] border border-[#2a3a5c]">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                    <ArrowDown className="w-4 h-4" />
                    <span>Pass 2: Down-Sweep (Scan Phase)</span>
                  </div>
                  <p className="text-slate-400 font-sans text-xs mb-2">
                    Sets root to identity (0), swaps left child with parent, and computes right child as parent + old left child.
                  </p>
                  <div className="p-2.5 rounded bg-[#111d36] text-[11px] text-slate-300">
                    Depth: log₂(n) = {Math.ceil(Math.log2(n || 1))} parallel steps
                  </div>
                </div>
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

export default ParallelScanWorkbench;
