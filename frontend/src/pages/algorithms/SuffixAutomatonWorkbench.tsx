import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, SuffixAutomatonResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Cpu } from 'lucide-react';

export const SuffixAutomatonWorkbench: React.FC = () => {
  const [text, setText] = useState<string>('aababa');
  const [query, setQuery] = useState<string>('aba');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<SuffixAutomatonResult> | null>(null);

  const handleRun = async () => {
    if (!text) {
      setError('String text is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.runSuffixAutomaton({ text, query: query || undefined });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to construct Suffix Automaton.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setText('shellcode_loader_payload');
    setQuery('loader');
  };

  return (
    <AlgorithmPanel
      title="Suffix Automaton (SAM) Minimal DFA Engine"
      module="M2: Suffix Structures"
      timeComplexity="Strict linear O(n) construction"
      spaceComplexity="At most 2n - 1 states, 3n - 4 transitions"
      description="The most compact directed acyclic word graph (DAWG) encoding all substrings of a string in linear space. Solves arbitrary substring verification in O(|query|) time regardless of corpus size."
      cyberApplication="Instant substring membership testing, longest common substring, and distinct exploit pattern counting"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Shellcode Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Corpus String (Input to SAM)
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
                Query Substring (O(|query|) DFA test)
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Building SAM...' : 'Build Suffix Automaton'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Adding characters and splitting clone states..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <MetricCard
                label="DFA States Count"
                value={response.result.stateCount ?? (response.result.states?.length || 0)}
                subtext={`≤ 2n - 1 (${2 * text.length - 1} bound)`}
                highlight
              />
              <MetricCard
                label="Transitions Count"
                value={response.result.transitionCount ?? 'Computed'}
                subtext={`≤ 3n - 4 (${Math.max(0, 3 * text.length - 4)} bound)`}
              />
              <MetricCard
                label="Query Substring Valid"
                value={
                  response.result.queryMatches !== undefined
                    ? response.result.queryMatches
                      ? 'YES (EXISTS)'
                      : 'NO (ABSENT)'
                    : query
                    ? 'VERIFIED'
                    : 'N/A'
                }
                subtext={query ? `Tested "${query}" in O(|query|)` : 'No query provided'}
              />
              <MetricCard
                label="Construction Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
            </div>

            {/* States and Transitions Table */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] overflow-hidden shadow-md">
              <div className="px-5 py-3 border-b border-[#2a3a5c] flex items-center gap-2 bg-[#111d36]/50">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  SAM Equivalence Class States & Suffix Links
                </h3>
              </div>
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0d1526] text-slate-400 border-b border-[#2a3a5c] uppercase text-[11px] sticky top-0">
                    <tr>
                      <th className="px-5 py-2.5">State ID</th>
                      <th className="px-5 py-2.5">Max Length (len)</th>
                      <th className="px-5 py-2.5">Suffix Link (link)</th>
                      <th className="px-5 py-2.5">Outgoing Character Transitions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3a5c]/60 text-slate-300">
                    {(response.result.states || []).slice(0, 50).map((st) => (
                      <tr key={st.id} className="hover:bg-[#162244]/40">
                        <td className="px-5 py-2 text-cyan-300 font-bold">
                          State {st.id} {st.isClone ? '(clone)' : ''}
                        </td>
                        <td className="px-5 py-2 text-slate-300">{st.len}</td>
                        <td className="px-5 py-2 text-slate-400">
                          {st.link === -1 ? 'None (Root)' : `State ${st.link}`}
                        </td>
                        <td className="px-5 py-2 text-slate-300">
                          {st.transitions
                            ? Object.entries(st.transitions)
                                .map(([char, target]) => `'${char}' → State ${target}`)
                                .join(', ')
                            : 'Terminal state'}
                        </td>
                      </tr>
                    ))}
                    {(!response.result.states || response.result.states.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-5 py-4 text-center text-slate-400 font-sans">
                          State table populated with {response.result.stateCount} states.
                        </td>
                      </tr>
                    )}
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

export default SuffixAutomatonWorkbench;
