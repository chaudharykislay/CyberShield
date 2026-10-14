import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, KmpResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

export const KmpWorkbench: React.FC = () => {
  const [text, setText] = useState<string>(
    'GET /admin/dashboard HTTP/1.1\nHost: internal.corp\nUser-Agent: Mozilla/5.0\nCookie: session=xyz; role=admin\nAuthorization: Bearer attack_payload_signature_404\nX-Forwarded-For: 192.168.1.105\n\nSELECT * FROM users WHERE username = \'admin\' AND 1=1 --'
  );
  const [pattern, setPattern] = useState<string>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<KmpResult> | null>(null);

  const handleRun = async () => {
    if (!text || !pattern) {
      setError('Please provide both log text and signature pattern.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.runKmp({ text, pattern });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute KMP algorithm on backend.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setText(
      'POST /login HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin&password=\' OR \'1\'=\'1\' --&submit=Login'
    );
    setPattern("' OR '1'='1'");
  };

  const handleReset = () => {
    setText('');
    setPattern('');
    setResponse(null);
    setError(null);
  };

  // String visualization with highlights
  const renderHighlightedText = () => {
    if (!response || !response.result) return null;
    const matches: number[] = response.result.matches || [];
    const patLen = pattern.length;

    if (matches.length === 0) {
      return (
        <pre className="p-4 bg-[#090d19] rounded-lg font-mono text-xs text-slate-300 whitespace-pre-wrap break-all border border-[#2a3a5c]">
          {text}
        </pre>
      );
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((matchIdx, idx) => {
      // Preceding non-match text
      if (matchIdx > lastIndex) {
        elements.push(
          <span key={`text-${idx}`}>{text.substring(lastIndex, matchIdx)}</span>
        );
      }
      // Matching segment
      elements.push(
        <mark
          key={`match-${idx}`}
          className="bg-cyan-500/30 text-cyan-200 border-b-2 border-cyan-400 font-bold px-0.5 rounded-sm"
          title={`Match index: ${matchIdx}`}
        >
          {text.substring(matchIdx, matchIdx + patLen)}
        </mark>
      );
      lastIndex = matchIdx + patLen;
    });

    if (lastIndex < text.length) {
      elements.push(
        <span key="trailing">{text.substring(lastIndex)}</span>
      );
    }

    return (
      <pre className="p-4 bg-[#090d19] rounded-lg font-mono text-xs text-slate-300 whitespace-pre-wrap break-all border border-[#2a3a5c] leading-relaxed">
        {elements}
      </pre>
    );
  };

  return (
    <AlgorithmPanel
      title="Knuth-Morris-Pratt (KMP) Pattern Matcher"
      module="M1: String Algorithms"
      timeComplexity="O(n + m)"
      spaceComplexity="O(m)"
      description="Linear-time single-pattern exact string matching utilizing the Longest Prefix Suffix (LPS) failure function to prevent backtracking in network streams."
      cyberApplication="Deep Packet Inspection (DPI) & Snort/Suricata single-token signature scanning"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={loadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load SQLi Sample</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-[#0d1526] text-slate-400 hover:text-white border border-[#2a3a5c] transition-colors"
            title="Reset form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Input Form */}
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Raw Network Payload / Security Log Text
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter security log text..."
              className="w-full rounded-lg bg-[#0d1526] p-3 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500 placeholder-slate-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Target Threat Signature / Token Pattern
              </label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g. admin or SELECT or UNION"
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500 placeholder-slate-500"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Running...' : 'Run KMP Analysis'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Evaluating LPS table & streaming text..." />}

        {/* Results Visualizer */}
        {response && response.result && (
          <div className="space-y-6">
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Matches Located"
                value={response.result.matches?.length ?? 0}
                subtext={`Indices: [${(response.result.matches || []).join(', ')}]`}
                highlight
              />
              <MetricCard
                label="Execution Latency"
                value={`${(
                  (response.metrics?.executionTimeNanos || 0) / 1_000_000
                ).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanoseconds`}
              />
              <MetricCard
                label="Comparisons Count"
                value={response.metrics?.comparisonCount ?? 0}
                subtext={`Text size: ${text.length} | Pattern: ${pattern.length}`}
              />
            </div>

            {/* LPS Array Table */}
            {response.result.lps && response.result.lps.length > 0 && (
              <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Precomputed LPS (π) Table (O(m) auxiliary storage)
                </h3>
                <div className="overflow-x-auto pb-2">
                  <div className="inline-flex border border-[#2a3a5c] rounded-lg overflow-hidden font-mono text-xs">
                    <div className="bg-[#111d36] text-slate-400 p-2 border-r border-[#2a3a5c] flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-sans">Pattern [i]</span>
                      <span className="text-[10px] uppercase font-sans text-cyan-400 font-bold">LPS [i]</span>
                    </div>
                    {pattern.split('').map((char, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-between p-2 min-w-[36px] border-r border-[#2a3a5c] last:border-r-0 bg-[#0d1526]"
                      >
                        <span className="text-white font-bold">{char}</span>
                        <span className="text-cyan-400 font-semibold mt-1">
                          {response.result.lps[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">
                  LPS[i] stores the length of the longest proper prefix of pattern[0..i] that is also a suffix of pattern[0..i].
                </p>
              </div>
            )}

            {/* String Highlight Visualization */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Highlighted Match Stream
              </h3>
              {renderHighlightedText()}
            </div>

            {/* Cybersecurity Interpretation */}
            <div className="rounded-xl border border-cyan-500/30 bg-[#111d36]/60 p-4 text-xs text-slate-300">
              <span className="font-semibold text-cyan-400 block mb-1">
                SOC Analyst Interpretation:
              </span>
              The linear scan verified{' '}
              <strong className="text-white">
                {response.result.matches?.length || 0}
              </strong>{' '}
              occurrences of signature token &quot;{pattern}&quot; across{' '}
              {text.length} characters in{' '}
              {(
                (response.metrics?.executionTimeNanos || 0) / 1_000_000
              ).toFixed(4)}{' '}
              ms. Because KMP never rolls back the text pointer, this algorithm enables zero-copy streaming inspection across 10Gbps line-rate network interfaces without buffering stalls.
            </div>

            {/* Execution Trace */}
            {response.trace && response.trace.length > 0 && (
              <TraceViewer trace={response.trace} />
            )}
          </div>
        )}
      </div>
    </AlgorithmPanel>
  );
};

export default KmpWorkbench;
