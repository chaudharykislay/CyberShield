import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, EditDistanceResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Sliders, Grid } from 'lucide-react';

export const EditDistanceWorkbench: React.FC = () => {
  const [str1, setStr1] = useState<string>('PAYLOAD_V1_INJECT');
  const [str2, setStr2] = useState<string>('PAYLOAD_V2_INSPECT');
  const [variant, setVariant] = useState<string>('LEVENSHTEIN');
  const [insertCost, setInsertCost] = useState<number>(1);
  const [deleteCost, setDeleteCost] = useState<number>(1);
  const [substituteCost, setSubstituteCost] = useState<number>(2);
  const [transposeCost, setTransposeCost] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<EditDistanceResult> | null>(null);

  const handleRun = async () => {
    if (!str1 || !str2) {
      setError('Both comparison strings must be provided.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        str1,
        str2,
        variant,
      };
      if (variant === 'WEIGHTED') {
        payload.costs = {
          insert: insertCost,
          delete: deleteCost,
          substitute: substituteCost,
          transpose: transposeCost,
        };
      }
      const res = await api.runEditDistance(payload);
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to calculate DP edit distance.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setStr1('EXEC_POWERSHELL_OBFUSCATED');
    setStr2('EXEC_POWERSHELL_DEOBFUSCATED');
    setVariant('DAMERAU_OSA');
  };

  // Heatmap color generator based on matrix cell value
  const getCellColor = (val: number, maxVal: number) => {
    if (val === 0) return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
    const ratio = Math.min(1, val / (maxVal || 1));
    if (ratio < 0.3) return 'bg-cyan-950/40 text-cyan-300 border-cyan-500/20';
    if (ratio < 0.6) return 'bg-amber-950/40 text-amber-300 border-amber-500/20';
    return 'bg-rose-950/40 text-rose-300 border-rose-500/30';
  };

  const matrix = response?.result?.matrix;
  let maxMatrixVal = 1;
  if (matrix && matrix.length > 0) {
    matrix.forEach((row) => {
      row.forEach((v) => {
        if (v > maxMatrixVal) maxMatrixVal = v;
      });
    });
  }

  return (
    <AlgorithmPanel
      title="Dynamic Programming Edit Distance & Alignment Matrix"
      module="M3: Dynamic Programming"
      timeComplexity="O(|s₁| · |s₂|)"
      spaceComplexity="O(|s₁| · |s₂|) or O(min(|s₁|, |s₂|))"
      description="Calculates minimum operation transformation distance across Levenshtein, Damerau-Levenshtein (OSA with adjacent character transpositions), and weighted operational penalty models."
      cyberApplication="Polymorphic shellcode alignment, malware mutant distance scoring, and DNS typo-squatting detection"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load PowerShell Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Sequence String A (Source)
              </label>
              <input
                type="text"
                value={str1}
                onChange={(e) => setStr1(e.target.value)}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Sequence String B (Target)
              </label>
              <input
                type="text"
                value={str2}
                onChange={(e) => setStr2(e.target.value)}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Distance Metric Variant
              </label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-cyan-300 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              >
                <option value="LEVENSHTEIN">Levenshtein (Ins, Del, Sub)</option>
                <option value="DAMERAU_OSA">Damerau-Levenshtein (OSA + Transposition)</option>
                <option value="WEIGHTED">Weighted Operations Model</option>
              </select>
            </div>

            {variant === 'WEIGHTED' && (
              <div className="md:col-span-2 grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Insert</label>
                  <input
                    type="number"
                    value={insertCost}
                    onChange={(e) => setInsertCost(Number(e.target.value))}
                    className="w-full rounded bg-[#0d1526] px-2 py-1.5 text-xs text-white border border-[#2a3a5c]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Delete</label>
                  <input
                    type="number"
                    value={deleteCost}
                    onChange={(e) => setDeleteCost(Number(e.target.value))}
                    className="w-full rounded bg-[#0d1526] px-2 py-1.5 text-xs text-white border border-[#2a3a5c]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Subst</label>
                  <input
                    type="number"
                    value={substituteCost}
                    onChange={(e) => setSubstituteCost(Number(e.target.value))}
                    className="w-full rounded bg-[#0d1526] px-2 py-1.5 text-xs text-white border border-[#2a3a5c]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Transp</label>
                  <input
                    type="number"
                    value={transposeCost}
                    onChange={(e) => setTransposeCost(Number(e.target.value))}
                    className="w-full rounded bg-[#0d1526] px-2 py-1.5 text-xs text-white border border-[#2a3a5c]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Filling Table...' : 'Compute DP Alignment'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Constructing 2D recurrence alignment table..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Optimal Distance"
                value={response.result.distance}
                subtext={`Model: ${variant}`}
                highlight
              />
              <MetricCard
                label="Execution Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
              <MetricCard
                label="Table Cells Explored"
                value={`${(str1.length + 1) * (str2.length + 1)} cells`}
                subtext={`Grid: ${str1.length + 1} × ${str2.length + 1}`}
              />
            </div>

            {/* DP Matrix Heatmap Grid */}
            {matrix && matrix.length > 0 && (
              <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Grid className="w-4 h-4 text-cyan-400" />
                    Dynamic Programming Cost Matrix Heatmap
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-500/40 inline-block" /> 0
                    <span className="w-3 h-3 rounded bg-cyan-950 border border-cyan-500/40 inline-block" /> Low
                    <span className="w-3 h-3 rounded bg-amber-950 border border-amber-500/40 inline-block" /> Med
                    <span className="w-3 h-3 rounded bg-rose-950 border border-rose-500/40 inline-block" /> High
                  </div>
                </div>

                <div className="overflow-x-auto max-h-96 pb-2">
                  <table className="border-collapse text-xs font-mono">
                    <thead>
                      <tr>
                        <th className="p-2 border border-[#2a3a5c] bg-[#0d1526] text-slate-500">
                          s₁ \ s₂
                        </th>
                        <th className="p-2 border border-[#2a3a5c] bg-[#0d1526] text-slate-400">
                          ε
                        </th>
                        {str2.split('').map((ch, idx) => (
                          <th
                            key={idx}
                            className="p-2 border border-[#2a3a5c] bg-[#0d1526] text-cyan-300"
                          >
                            {ch}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {matrix.map((row, rIdx) => (
                        <tr key={rIdx}>
                          <th className="p-2 border border-[#2a3a5c] bg-[#0d1526] text-cyan-300">
                            {rIdx === 0 ? 'ε' : str1[rIdx - 1]}
                          </th>
                          {row.map((cellVal, cIdx) => (
                            <td
                              key={cIdx}
                              className={`p-2 border text-center transition-colors font-bold ${getCellColor(
                                cellVal,
                                maxMatrixVal
                              )}`}
                            >
                              {cellVal}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Edit Script Backtrace */}
            {response.result.script && response.result.script.length > 0 && (
              <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                  Optimal Edit Script (Backtrace Alignment)
                </h3>
                <div className="p-3 rounded-lg bg-[#0d1526] font-mono text-xs text-slate-200 border border-[#2a3a5c] space-y-1">
                  {response.result.script.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-slate-500 w-6">{idx + 1}.</span>
                      <span className="text-cyan-300">{step}</span>
                    </div>
                  ))}
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

export default EditDistanceWorkbench;
