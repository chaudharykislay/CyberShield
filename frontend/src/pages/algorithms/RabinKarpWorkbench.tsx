import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, RabinKarpResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Hash, AlertTriangle, ShieldCheck } from 'lucide-react';

export const RabinKarpWorkbench: React.FC = () => {
  const [text, setText] = useState<string>(
    '2026-10-13 14:22:01 TLSv1.3 Handshake ClientHello SessionId: a9f8e7d6c5b4a321 CipherSuite: TLS_AES_256_GCM_SHA384 ClientHello MaliciousFingerprint: ATTACK_VECTOR_V1_PAYLOAD SessionTicket: e8b7c6'
  );
  const [pattern, setPattern] = useState<string>('ATTACK_VECTOR_V1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<RabinKarpResult> | null>(null);

  const handleRun = async () => {
    if (!text || !pattern) {
      setError('Please provide both log text and pattern.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.runRabinKarp({ text, pattern });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute Rabin-Karp matching.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setText(
      'CONNECT gateway.internal:443 HTTP/1.1\r\nUser-Agent: C2-BEACON-ID-99381\r\nX-Beacon: C2-BEACON-ID-99381\r\n'
    );
    setPattern('C2-BEACON');
  };

  return (
    <AlgorithmPanel
      title="Rabin-Karp Rolling Hash Algorithm"
      module="M1: String Algorithms"
      timeComplexity="Average O(n + m), Worst O(n · m)"
      spaceComplexity="O(1) auxiliary"
      description="Employs Horner's rule rolling polynomial hashing with large prime modulo arithmetic to achieve average linear-time string matching while detecting hash collisions (spurious hits)."
      cyberApplication="Multi-pattern fingerprinting, malware hash sliding windows, and spam filtering"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load C2 Beacon Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Log Buffer / Target Text
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-lg bg-[#0d1526] p-3 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Search Pattern
              </label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Evaluating...' : 'Run Rolling Hash'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Sliding polynomial hash window..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <MetricCard
                label="Matches Confirmed"
                value={response.result.matches?.length ?? 0}
                subtext={`Indices: [${(response.result.matches || []).join(', ')}]`}
                highlight
              />
              <MetricCard
                label="Spurious Hash Hits"
                value={response.result.spuriousHits ?? 0}
                subtext="Hash matched but chars differed"
              />
              <MetricCard
                label="Hash Comparisons"
                value={(response.result.hashComparisons ?? response.metrics?.comparisonCount ?? 0).toLocaleString()}
                subtext={`Window shifts: ${Math.max(0, text.length - pattern.length + 1)}`}
              />
              <MetricCard
                label="Execution Time"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
            </div>

            {/* Rolling Hash Arithmetic Parameter Panel */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4 text-cyan-400" />
                Polynomial Hash Parameters & Modulo Space
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#0d1526] border border-[#2a3a5c]">
                  <span className="text-slate-400 block text-[11px]">Base Radix (b):</span>
                  <span className="text-cyan-400 font-bold text-sm">
                    {response.result.base ?? 256}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#0d1526] border border-[#2a3a5c]">
                  <span className="text-slate-400 block text-[11px]">Prime Modulus (q):</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {response.result.prime ?? 1000000007}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#0d1526] border border-[#2a3a5c]">
                  <span className="text-slate-400 block text-[11px]">Rolling Update Cost:</span>
                  <span className="text-purple-400 font-bold text-sm">O(1) arithmetic</span>
                </div>
              </div>
            </div>

            {/* Cybersecurity Interpretation */}
            <div className="rounded-xl border border-cyan-500/30 bg-[#111d36]/60 p-4 text-xs text-slate-300">
              <span className="font-semibold text-cyan-400 block mb-1">
                Hash Collision Resistance Evaluation:
              </span>
              Rabin-Karp discovered{' '}
              <strong className="text-white">
                {response.result.matches?.length || 0}
              </strong>{' '}
              verified match(es) with{' '}
              <strong className="text-amber-400">
                {response.result.spuriousHits ?? 0}
              </strong>{' '}
              spurious collision(s). In production IDS rule validation, maintaining low spurious hits prevents false alarm cache thrashing.
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

export default RabinKarpWorkbench;
