import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, MatrixChainResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Hash, Table } from 'lucide-react';

export const MatrixChainWorkbench: React.FC = () => {
  const [dimensionsInput, setDimensionsInput] = useState<string>('10, 30, 5, 60, 20');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<MatrixChainResult> | null>(null);

  const handleRun = async () => {
    const dimensions = dimensionsInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (dimensions.length < 2) {
      setError('At least two dimensions are required (representing at least one matrix).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.runMatrixChain({ dimensions });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to compute Matrix Chain Multiplication DP.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setDimensionsInput('40, 20, 30, 10, 30');
  };

  const mTable = response?.result?.mTable;
  let maxCost = 1;
  if (mTable) {
    mTable.forEach((row) =>
      row.forEach((v) => {
        if (v > maxCost) maxCost = v;
      })
    );
  }

  return (
    <AlgorithmPanel
      title="Matrix Chain Multiplication (Parenthesization DP)"
      module="M3: Dynamic Programming"
      timeComplexity="O(n³)"
      spaceComplexity="O(n²)"
      description="Computes the optimal parenthesization of a chain of matrices to minimize scalar multiplications. Solves the subproblem recurrence m[i, j] = min_{i ≤ k < j} { m[i, k] + m[k+1, j] + p_{i-1}p_k p_j }."
      cyberApplication="Optimal query plan execution, cryptographic cipher chain pipelining, and neural model tensor fusion"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Pipeline Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Matrix Dimension Chain (p₀, p₁, ..., pₙ)
              </label>
              <input
                type="text"
                value={dimensionsInput}
                onChange={(e) => setDimensionsInput(e.target.value)}
                placeholder="e.g. 10, 30, 5, 60"
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-cyan-300 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Optimizing Chain...' : 'Compute Optimal Order'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Evaluating subproblem lengths l = 2..n..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Minimum Scalar Mults"
                value={(response.result.minScalarMultiplications ?? 0).toLocaleString()}
                subtext="Global minimum arithmetic operations"
                highlight
              />
              <MetricCard
                label="Execution Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
              <MetricCard
                label="Matrices in Chain"
                value={
                  dimensionsInput
                    .split(',')
                    .filter((x) => x.trim()).length - 1
                }
                subtext="Sequential linear pipeline stages"
              />
            </div>

            {/* Optimal Parenthesization Display */}
            <div className="rounded-xl border border-cyan-500/30 bg-[#111d36]/70 p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Optimal Parenthesization Structure
              </h3>
              <div className="p-4 rounded-lg bg-[#090d19] font-mono text-base font-bold text-cyan-400 border border-[#2a3a5c] tracking-wider text-center">
                {response.result.parenthesization || 'Optimal Order Computed'}
              </div>
            </div>

            {/* mTable Heatmap Matrix */}
            {mTable && mTable.length > 0 && (
              <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                  <Table className="w-4 h-4 text-cyan-400" />
                  Dynamic Programming m[i, j] Minimum Cost Table
                </h3>
                <div className="overflow-x-auto pb-2">
                  <table className="border-collapse text-xs font-mono">
                    <thead>
                      <tr>
                        <th className="p-2 border border-[#2a3a5c] bg-[#0d1526] text-slate-400">
                          i \ j
                        </th>
                        {mTable.map((_, idx) => (
                          <th
                            key={idx}
                            className="p-2 border border-[#2a3a5c] bg-[#0d1526] text-cyan-400"
                          >
                            j={idx + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mTable.map((row, rIdx) => (
                        <tr key={rIdx}>
                          <th className="p-2 border border-[#2a3a5c] bg-[#0d1526] text-cyan-400">
                            i={rIdx + 1}
                          </th>
                          {row.map((val, cIdx) => (
                            <td
                              key={cIdx}
                              className={`p-2.5 border border-[#2a3a5c] text-center ${
                                rIdx > cIdx
                                  ? 'bg-[#0a0f1e]/40 text-slate-600'
                                  : val === 0
                                  ? 'bg-emerald-950/30 text-emerald-400'
                                  : 'bg-[#111d36] text-slate-200'
                              }`}
                            >
                              {rIdx > cIdx ? '—' : val.toLocaleString()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {response.trace && response.trace.length > 0 && (
              <TraceViewer trace={response.trace} />
            )}
          </div>
        )}
      </div>
    </AlgorithmPanel>
  );
};

export default MatrixChainWorkbench;
