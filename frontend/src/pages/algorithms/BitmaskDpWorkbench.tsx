import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, BitmaskDpResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Binary, CheckCircle } from 'lucide-react';

export const BitmaskDpWorkbench: React.FC = () => {
  const defaultRules = [
    { id: 1, name: 'WAF Rule: SQLi Filter', cost: 12, coveredPolicies: [0, 1] },
    { id: 2, name: 'IDS Signature: XSS Defense', cost: 18, coveredPolicies: [1, 2] },
    { id: 3, name: 'Zero-Trust Bastion Auth', cost: 25, coveredPolicies: [0, 3] },
    { id: 4, name: 'TLS Decrypt Inspection', cost: 30, coveredPolicies: [2, 3, 4] },
    { id: 5, name: 'Egress Traffic Limiter', cost: 15, coveredPolicies: [4] },
  ];

  const [rulesJson, setRulesJson] = useState<string>(
    JSON.stringify(defaultRules, null, 2)
  );
  const [requiredPoliciesInput, setRequiredPoliciesInput] = useState<string>('0, 1, 2, 3, 4');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<BitmaskDpResult> | null>(null);

  const handleRun = async () => {
    let rules: any[];
    try {
      rules = JSON.parse(rulesJson);
    } catch (e) {
      setError('Invalid JSON format in rules definition.');
      return;
    }

    const requiredPolicies = requiredPoliciesInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    setLoading(true);
    setError(null);
    try {
      const res = await api.runBitmaskDp({ rules, requiredPolicies });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to solve Bitmask DP optimization.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    const enterpriseRules = [
      { id: 1, name: 'Firewall Drop Port 22/3389', cost: 8, coveredPolicies: [0, 2] },
      { id: 2, name: 'SIEM Log Forwarder', cost: 14, coveredPolicies: [1, 3] },
      { id: 3, name: 'EDR Endpoint Isolation', cost: 22, coveredPolicies: [0, 1, 2] },
      { id: 4, name: 'DDoS Anycast Scrubbing', cost: 35, coveredPolicies: [3, 4] },
      { id: 5, name: 'IAM MFA Enforcement', cost: 10, coveredPolicies: [2, 4] },
    ];
    setRulesJson(JSON.stringify(enterpriseRules, null, 2));
    setRequiredPoliciesInput('0, 1, 2, 3, 4');
  };

  return (
    <AlgorithmPanel
      title="Bitmask Dynamic Programming (Exact Subset Cover Optimization)"
      module="M3: Dynamic Programming"
      timeComplexity="O(2ⁿ · m) where n = policies, m = candidate rules"
      spaceComplexity="O(2ⁿ) state table"
      description="Models security policy coverage as exact bitmask state spaces. Evaluates optimal minimum cost security controls covering all mandatory enterprise compliance requirements."
      cyberApplication="Optimal firewall ruleset selection, security control minimization, and cloud compliance budgeting"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Enterprise Rules</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Security Rules & Cost Configurations (JSON Array)
            </label>
            <textarea
              rows={8}
              value={rulesJson}
              onChange={(e) => setRulesJson(e.target.value)}
              className="w-full rounded-lg bg-[#0d1526] p-3 text-xs font-mono text-cyan-300 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Mandatory Policy IDs to Satisfy (comma-separated integers)
              </label>
              <input
                type="text"
                value={requiredPoliciesInput}
                onChange={(e) => setRequiredPoliciesInput(e.target.value)}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Optimizing Mask...' : 'Solve Bitmask DP'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Evaluating 2ⁿ bitmask subproblems..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Minimum Optimized Cost"
                value={response.result.minCost}
                subtext="Total cost of selected controls"
                highlight
              />
              <MetricCard
                label="Bitmask States Explored"
                value={response.result.statesExplored ?? `${1 << 5} states`}
                subtext="Subproblems memoized in DP table"
              />
              <MetricCard
                label="Execution Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
            </div>

            {/* Selected Rules Breakdown */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Selected Minimal Cost Security Controls
              </h3>

              <div className="p-4 rounded-lg bg-[#0d1526] border border-[#2a3a5c]">
                <div className="text-xs text-slate-300 font-mono mb-2">
                  Optimal rule indices:{' '}
                  <span className="text-cyan-400 font-bold">
                    [{ (response.result.selectedRuleIndices || []).join(', ') }]
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  By transitioning across binary states (mask | rule.coveredPolicies), the DP proved no other subset of rules covers policies [{requiredPoliciesInput}] with lower operational overhead than {response.result.minCost}.
                </p>
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

export default BitmaskDpWorkbench;
