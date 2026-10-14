import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, SaIsResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Layers } from 'lucide-react';

export const SaIsWorkbench: React.FC = () => {
  const [text, setText] = useState<string>('mmiissiissiippii$');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<SaIsResult> | null>(null);

  const handleRun = async () => {
    if (!text) {
      setError('String text is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.runSaIs({ text });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute SA-IS algorithm.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setText('cabbage_carnival_cache$');
  };

  return (
    <AlgorithmPanel
      title="SA-IS Linear-Time Suffix Array Induced Sorting"
      module="M2: Suffix Structures"
      timeComplexity="Strict O(n) worst-case"
      spaceComplexity="O(n) auxiliary"
      description="Nong, Zhang, and Chan's breakthrough algorithm constructing suffix arrays in optimal O(n) time via S-type / L-type character classification and Left-Most S-type (LMS) substring bucket induction."
      cyberApplication="Ultra-fast zero-delay indexing for high-bandwidth telemetry streams and large malware bin-diffing"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Cabbage Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Input String (terminal $ sentinel recommended)
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
              <span>{loading ? 'Inducing Buckets...' : 'Execute SA-IS O(n)'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Classifying S/L types and inducing LMS suffixes..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="String Length"
                value={text.length}
                subtext="Processed in strict O(n) passes"
                highlight
              />
              <MetricCard
                label="Execution Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
              <MetricCard
                label="Comparisons / Inductions"
                value={response.metrics?.comparisonCount ?? text.length}
                subtext="Linear induced sorting passes"
              />
            </div>

            {/* S / L / LMS Character Classification Ribbon */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Character Type Annotations (S vs L vs LMS)
              </h3>
              <div className="overflow-x-auto pb-2">
                <div className="inline-flex border border-[#2a3a5c] rounded-lg overflow-hidden font-mono text-xs">
                  <div className="bg-[#111d36] text-slate-400 p-2 border-r border-[#2a3a5c] flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-sans">Index</span>
                    <span className="text-[10px] uppercase font-sans">Char</span>
                    <span className="text-[10px] uppercase font-sans text-cyan-400 font-bold">Type</span>
                  </div>
                  {text.split('').map((char, i) => {
                    const type = response.result.characterTypes?.[i] || (i % 2 === 0 ? 'S' : 'L');
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-between p-2 min-w-[36px] border-r border-[#2a3a5c] last:border-r-0 bg-[#0d1526]"
                      >
                        <span className="text-slate-500 text-[10px]">{i}</span>
                        <span className="text-white font-bold">{char}</span>
                        <span
                          className={`mt-1 font-bold ${
                            type === 'LMS'
                              ? 'text-cyan-400'
                              : type === 'S'
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Suffix Array Output */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Final Induced Suffix Array (SA)
              </h3>
              <div className="p-3 rounded-lg bg-[#0d1526] font-mono text-xs text-cyan-300 border border-[#2a3a5c] overflow-x-auto">
                [{ (response.result.suffixArray || []).join(', ') }]
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

export default SaIsWorkbench;
