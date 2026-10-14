import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, ZFunctionResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, RotateCcw } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const ZFunctionWorkbench: React.FC = () => {
  const [text, setText] = useState<string>(
    'HTTP/1.1 200 OK\nServer: nginx/1.24.0\nX-Signature: MALWARE_ALPHA_SIGNATURE_PAYLOAD\nX-Payload: MALWARE_ALPHA_SIGNATURE_EXPLOIT'
  );
  const [pattern, setPattern] = useState<string>('MALWARE_ALPHA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<ZFunctionResult> | null>(null);

  const handleRun = async () => {
    if (!text || !pattern) {
      setError('Please provide both log text and pattern.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.runZFunction({ text, pattern });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute Z-Algorithm.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setText('abacaba_abacaba_malicious_token_abacaba');
    setPattern('abacaba');
  };

  const chartData = (response?.result?.zArray || []).slice(0, 40).map((val, idx) => ({
    index: `z[${idx}]`,
    value: val,
  }));

  return (
    <AlgorithmPanel
      title="Z-Algorithm Linear String Preprocessing"
      module="M1: String Algorithms"
      timeComplexity="O(n + m)"
      spaceComplexity="O(n + m)"
      description="Computes the Z-box array in linear time where Z[i] is the length of the longest substring starting from s[i] that is also a prefix of s. Used for fast exact string matching and periodicity discovery."
      cyberApplication="Protocol header anomaly detection, shellcode repetition verification, and signature matching"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Periodicity Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Form */}
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Log Stream / Ingested Text
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
                Target Pattern ($P + \$ + T$)
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
              <span>Compute Z-Array</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Constructing Z-boxes in O(n+m)..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Matches Identified"
                value={response.result.matches?.length ?? 0}
                subtext={`Indices: [${(response.result.matches || []).join(', ')}]`}
                highlight
              />
              <MetricCard
                label="Execution Latency"
                value={`${(
                  (response.metrics?.executionTimeNanos || 0) / 1_000_000
                ).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
              <MetricCard
                label="Z-Array Length"
                value={response.result.zArray?.length ?? 0}
                subtext={`${response.metrics?.comparisonCount || 0} comparisons`}
              />
            </div>

            {/* Recharts Bar Chart of Z-Array */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
                Z-Box Values Distribution (First 40 positions)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5c" opacity={0.5} />
                    <XAxis
                      dataKey="index"
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0d1526',
                        borderColor: '#2a3a5c',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#38bdf8',
                      }}
                    />
                    <Bar dataKey="value" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trace Viewer */}
            {response.trace && response.trace.length > 0 && (
              <TraceViewer trace={response.trace} />
            )}
          </div>
        )}
      </div>
    </AlgorithmPanel>
  );
};

export default ZFunctionWorkbench;
