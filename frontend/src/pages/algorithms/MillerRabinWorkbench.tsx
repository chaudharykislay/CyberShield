import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, MillerRabinResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Key, CheckCircle2, AlertOctagon } from 'lucide-react';

export const MillerRabinWorkbench: React.FC = () => {
  const [candidateNumber, setCandidateNumber] = useState<string>('1000000007');
  const [rounds, setRounds] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<MillerRabinResult> | null>(null);

  const handleRun = async () => {
    if (!candidateNumber) {
      setError('Please provide a candidate integer to test.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.runMillerRabin({
        n: candidateNumber,
        rounds: Number(rounds),
      });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute Miller-Rabin test.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    // 2^31 - 1 (Mersenne prime M31)
    setCandidateNumber('2147483647');
    setRounds(15);
  };

  const loadComposite = () => {
    // Carmichael number (561 = 3 * 11 * 17) which fools Fermat's test but is caught by Miller-Rabin
    setCandidateNumber('561');
    setRounds(8);
  };

  return (
    <AlgorithmPanel
      title="Miller-Rabin Randomized Monte Carlo Primality Test"
      module="M6: Randomized & Parallel Algorithms"
      timeComplexity="O(k · log³ n) with modular exponentiation"
      spaceComplexity="O(log n)"
      description="Monte Carlo randomized test determining primality via non-trivial square roots of 1 modulo n. With k independent rounds, the false positive probability of declaring a composite number prime is strictly ≤ 4⁻ᵏ."
      cyberApplication="RSA/ECC cryptographic key generation, Diffie-Hellman prime group verification, and zero-knowledge proof setup"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={loadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Mersenne Prime</span>
          </button>
          <button
            onClick={loadComposite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-amber-300 border border-[#2a3a5c] transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Carmichael Number</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Candidate Integer n
              </label>
              <input
                type="text"
                value={candidateNumber}
                onChange={(e) => setCandidateNumber(e.target.value)}
                placeholder="e.g. 1000000007 or 2147483647"
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-cyan-300 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Testing Rounds k (Confidence)
              </label>
              <input
                type="number"
                min={1}
                max={64}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
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
              <span>{loading ? 'Evaluating Bases...' : 'Test Primality'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Testing modular square roots of unity across random bases..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Primality Assessment"
                value={
                  response.result.isPrime
                    ? 'PROBABLY PRIME'
                    : 'DEFINITELY COMPOSITE'
                }
                subtext={
                  response.result.isPrime
                    ? `Confidence ≥ ${(100 * (1 - Math.pow(0.25, rounds))).toFixed(6)}%`
                    : 'Witness found'
                }
                highlight
              />
              <MetricCard
                label="Max Error Bound"
                value={`≤ 4⁻${rounds} (≈ ${(Math.pow(0.25, rounds)).toExponential(2)})`}
                subtext="Monte Carlo false positive bound"
              />
              <MetricCard
                label="Execution Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
            </div>

            {/* Scientific Notice Banner */}
            <div className="rounded-xl border border-cyan-500/30 bg-[#111d36]/70 p-4 text-xs text-slate-300">
              <span className="font-semibold text-cyan-400 block mb-1">
                Formal Cryptographic Verification Interpretation:
              </span>
              {response.result.isPrime ? (
                <>
                  Candidate <code>{candidateNumber}</code> passed all {rounds} independent random base tests.
                  It is <strong>probably prime (not mathematically guaranteed for un-tested bases)</strong>.
                  For industrial cryptographic key pairs (e.g. RSA-2048), k=40 rounds yields an error probability of less than 2⁻⁸⁰, exceeding cosmic ray hardware failure likelihood.
                </>
              ) : (
                <>
                  Candidate <code>{candidateNumber}</code> is <strong>definitely composite</strong>.
                  A non-trivial square root of 1 or Fermat witness was discovered, proving compositeness without needing to compute prime factors.
                </>
              )}
            </div>

            {/* Round by Round Results Table */}
            {response.result.rounds && response.result.rounds.length > 0 && (
              <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] overflow-hidden shadow-md">
                <div className="px-5 py-3 border-b border-[#2a3a5c] flex items-center gap-2 bg-[#111d36]/50">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Round-by-Round Random Base Witness Checks
                  </h3>
                </div>
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#0d1526] text-slate-400 border-b border-[#2a3a5c] uppercase text-[11px]">
                      <tr>
                        <th className="px-5 py-2.5">Round #</th>
                        <th className="px-5 py-2.5">Random Base (a)</th>
                        <th className="px-5 py-2.5">Witness Evaluation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a3a5c]/60 text-slate-300">
                      {response.result.rounds.map((r) => (
                        <tr key={r.round} className="hover:bg-[#162244]/40">
                          <td className="px-5 py-2 text-slate-400">Round {r.round}</td>
                          <td className="px-5 py-2 text-cyan-300 font-bold">a = {r.base}</td>
                          <td className="px-5 py-2">
                            {r.witnessFound ? (
                              <span className="text-rose-400 font-bold">COMPOSITE WITNESS DETECTED</span>
                            ) : (
                              <span className="text-emerald-400 font-medium">Passed (Strong Pseudoprime to base a)</span>
                            )}
                          </td>
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

export default MillerRabinWorkbench;
