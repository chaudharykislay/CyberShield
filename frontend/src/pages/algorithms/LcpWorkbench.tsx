import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, LcpResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Binary } from 'lucide-react';

export const LcpWorkbench: React.FC = () => {
  const [text, setText] = useState<string>('banana$');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<LcpResult> | null>(null);

  const handleRun = async () => {
    if (!text) {
      setError('Text string is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.runLcpKasai({ text });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to construct LCP array via Kasai algorithm.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setText('MALWARE_MUTATION_ALPHA_MALWARE_MUTATION_BETA$');
  };

  const maxLcpValue = response?.result?.lcpArray
    ? Math.max(0, ...response.result.lcpArray)
    : 0;

  return (
    <AlgorithmPanel
      title="Kasai's Linear-Time LCP Array Construction"
      module="M2: Suffix Structures"
      timeComplexity="Strict O(n) via inverse suffix array"
      spaceComplexity="O(n)"
      description="Computes the Longest Common Prefix (LCP) array in linear O(n) time by iterating through suffixes in text order and amortizing common prefix match decrements (h ≥ h - 1). Used to find repeated shellcode and common malware sequences."
      cyberApplication="Longest Repeated Substring (LRS) detection, polymorphic malware family clustering, and differential payload analysis"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Polymorphic Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Analyzed Payload / Sequence
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Evaluating Kasai...' : 'Compute LCP Array'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Constructing rank array & amortizing LCP heights..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Max LCP Length"
                value={maxLcpValue}
                subtext="Length of Longest Repeated Substring"
                highlight
              />
              <MetricCard
                label="Construction Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
              <MetricCard
                label="Linear Step Checks"
                value={response.metrics?.comparisonCount ?? text.length}
                subtext="Kasai amortized linear iterations"
              />
            </div>

            {/* Combined SA + LCP Array Matrix */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] overflow-hidden shadow-md">
              <div className="px-5 py-3 border-b border-[#2a3a5c] flex items-center gap-2 bg-[#111d36]/50">
                <Binary className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Combined Suffix Array (SA) & Kasai LCP Table
                </h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0d1526] text-slate-400 border-b border-[#2a3a5c] uppercase text-[11px] sticky top-0">
                    <tr>
                      <th className="px-5 py-2.5">Rank i</th>
                      <th className="px-5 py-2.5">SA[i]</th>
                      <th className="px-5 py-2.5 text-cyan-400">LCP[i]</th>
                      <th className="px-5 py-2.5">Suffix String</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3a5c]/60 text-slate-300">
                    {(response.result.suffixArray || []).map((saIdx, i) => {
                      const lcpVal = response.result.lcpArray?.[i] ?? 0;
                      const suffix = text.substring(saIdx);
                      const isMax = lcpVal === maxLcpValue && maxLcpValue > 0;

                      return (
                        <tr
                          key={i}
                          className={`hover:bg-[#162244]/40 ${
                            isMax ? 'bg-cyan-500/10' : ''
                          }`}
                        >
                          <td className="px-5 py-2 text-slate-500">{i}</td>
                          <td className="px-5 py-2 text-slate-300">{saIdx}</td>
                          <td
                            className={`px-5 py-2 font-bold ${
                              isMax ? 'text-cyan-300' : 'text-slate-400'
                            }`}
                          >
                            {lcpVal}
                          </td>
                          <td className="px-5 py-2">
                            {isMax ? (
                              <span>
                                <span className="text-cyan-400 font-bold bg-cyan-500/20 px-1 rounded">
                                  {suffix.substring(0, lcpVal)}
                                </span>
                                <span className="text-slate-400">
                                  {suffix.substring(lcpVal)}
                                </span>
                              </span>
                            ) : (
                              suffix
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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

export default LcpWorkbench;
