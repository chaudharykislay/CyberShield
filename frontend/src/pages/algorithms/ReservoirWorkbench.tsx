import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, ReservoirSamplingResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export const ReservoirWorkbench: React.FC = () => {
  const [streamInput, setStreamInput] = useState<string>(
    'SYN_FLOOD_001, PORT_SCAN_002, SQLI_003, XSS_004, SSH_BRUTE_005, DNS_AMP_006, BEACON_007, EXPLOIT_008, CSRF_009, RANSOMWARE_010, PHISH_011, MITM_012'
  );
  const [sampleSize, setSampleSize] = useState<number>(4);
  const [seed, setSeed] = useState<string>('99');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<ReservoirSamplingResult> | null>(null);

  const handleRun = async () => {
    const stream = streamInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (stream.length === 0) {
      setError('Stream items cannot be empty.');
      return;
    }

    if (sampleSize <= 0 || sampleSize > stream.length) {
      setError(`Sample size k must be between 1 and stream size (${stream.length}).`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        stream,
        k: sampleSize,
      };
      if (seed) payload.seed = parseInt(seed, 10);
      const res = await api.runReservoirSampling(payload);
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute Reservoir Sampling.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    const logs = Array.from({ length: 25 }, (_, i) => `LOG_EVENT_PAYLOAD_${i + 1}`);
    setStreamInput(logs.join(', '));
    setSampleSize(5);
    setSeed('42');
  };

  const streamElements = streamInput.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <AlgorithmPanel
      title="Algorithm R: Reservoir Sampling on Live Data Streams"
      module="M6: Randomized & Parallel Algorithms"
      timeComplexity="Strict O(N) single-pass"
      spaceComplexity="Strict O(k) fixed memory buffer"
      description="Selects k items uniformly at random from an infinite or unknown stream of length N in a single pass. Guarantees that at every step, every seen element has an exact equal selection probability of k/n."
      cyberApplication="High-volume packet sampling, unbiased flow telemetry ingestion, and distributed SIEM rate-limited auditing"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load 25-Event Stream</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Ingested Event Stream (comma-separated tokens)
            </label>
            <textarea
              rows={3}
              value={streamInput}
              onChange={(e) => setStreamInput(e.target.value)}
              className="w-full rounded-lg bg-[#0d1526] p-3 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Reservoir Buffer Size (k)
              </label>
              <input
                type="number"
                min={1}
                max={streamElements.length}
                value={sampleSize}
                onChange={(e) => setSampleSize(Number(e.target.value))}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-cyan-300 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Random Seed (Reproducibility)
              </label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
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
              <span>{loading ? 'Streaming...' : 'Run Algorithm R'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Sampling online stream in single pass..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Sample Size k"
                value={response.result.sample?.length ?? sampleSize}
                subtext={`Selected from ${streamElements.length} items`}
                highlight
              />
              <MetricCard
                label="Uniform Probability"
                value={`${((sampleSize / (streamElements.length || 1)) * 100).toFixed(2)}%`}
                subtext="k/N equal chance per element"
              />
              <MetricCard
                label="Execution Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
            </div>

            {/* Selected Reservoir Items */}
            <div className="rounded-xl border border-cyan-500/30 bg-[#111d36]/70 p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Final Unbiased Reservoir Content
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(response.result.sample || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#0d1526] border border-cyan-500/30 font-mono text-xs flex items-center justify-between"
                  >
                    <span className="text-slate-400 text-[10px]">Slot {idx + 1}:</span>
                    <span className="font-bold text-cyan-300">{item}</span>
                  </div>
                ))}
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

export default ReservoirWorkbench;
