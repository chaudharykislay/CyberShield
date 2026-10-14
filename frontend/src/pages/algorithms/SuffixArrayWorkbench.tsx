import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, SuffixArrayResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Database } from 'lucide-react';

export const SuffixArrayWorkbench: React.FC = () => {
  const [text, setText] = useState<string>('banana$');
  const [query, setQuery] = useState<string>('nan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<SuffixArrayResult> | null>(null);

  const handleRun = async () => {
    if (!text) {
      setError('Text string is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.runSuffixArray({ text, query: query || undefined });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to construct suffix array.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setText('ATTACK_VECTOR_EXPLOIT_PAYLOAD$');
    setQuery('EXPLOIT');
  };

  return (
    <AlgorithmPanel
      title="Suffix Array Lexicographical Indexing"
      module="M2: Suffix Structures"
      timeComplexity="O(n log n) or O(n log² n)"
      spaceComplexity="O(n)"
      description="Constructs the sorted array of all suffixes of a text string. Enables logarithmic substring searches via binary search and forms the foundation for Burrows-Wheeler Transform (BWT) compression and FM-indices."
      cyberApplication="Binary firmware indexing, memory dump fast pattern triage, and genomic malware clustering"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Exploit Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Corpus String (append $ sentinel recommended)
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Optional Substring Query (Binary Search Lookup)
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Optional query token..."
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Building...' : 'Build Suffix Array'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Sorting suffixes in lexicographic order..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Suffixes Indexed"
                value={response.result.suffixArray?.length ?? 0}
                subtext={`Text length: ${text.length}`}
                highlight
              />
              <MetricCard
                label="Construction Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
              <MetricCard
                label="Query Matches"
                value={response.result.queryMatches?.length ?? (query ? 'Found' : 'N/A')}
                subtext={query ? `Search term: "${query}"` : 'No query entered'}
              />
            </div>

            {/* Suffix Array Table */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] overflow-hidden shadow-md">
              <div className="px-5 py-3 border-b border-[#2a3a5c] flex items-center gap-2 bg-[#111d36]/50">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Sorted Suffix Array Entries (SA[i] → Suffix string)
                </h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0d1526] text-slate-400 border-b border-[#2a3a5c] uppercase text-[11px] sticky top-0">
                    <tr>
                      <th className="px-5 py-2.5">Rank i</th>
                      <th className="px-5 py-2.5">SA[i] (Start Index)</th>
                      <th className="px-5 py-2.5">Suffix String Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3a5c]/60 text-slate-300">
                    {(response.result.suffixArray || []).map((saIdx, i) => {
                      const suffixStr =
                        response.result.suffixes?.[i] ?? text.substring(saIdx);
                      const isMatch = query && suffixStr.startsWith(query);

                      return (
                        <tr
                          key={i}
                          className={`hover:bg-[#162244]/40 ${
                            isMatch ? 'bg-cyan-500/15 text-cyan-300 font-bold' : ''
                          }`}
                        >
                          <td className="px-5 py-2 text-slate-400">{i}</td>
                          <td className="px-5 py-2 text-cyan-400 font-bold">{saIdx}</td>
                          <td className="px-5 py-2 break-all">
                            {isMatch ? (
                              <span>
                                <span className="text-cyan-300 underline font-extrabold">
                                  {suffixStr.substring(0, query.length)}
                                </span>
                                {suffixStr.substring(query.length)}
                              </span>
                            ) : (
                              suffixStr
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

export default SuffixArrayWorkbench;
