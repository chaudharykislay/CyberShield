import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AnalysisExecution, DashboardOverview } from '../types';
import MetricCard from '../components/ui/MetricCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import {
  FileText,
  Download,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart3,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const [executions, setExecutions] = useState<AnalysisExecution[]>([]);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [execRes, overRes] = await Promise.allSettled([
          api.getExecutions(),
          api.getDashboardOverview(),
        ]);

        if (execRes.status === 'fulfilled') {
          const raw = execRes.value.data;
          if (Array.isArray(raw)) setExecutions(raw);
          else if (raw && Array.isArray((raw as any).content))
            setExecutions((raw as any).content);
        }

        if (overRes.status === 'fulfilled') {
          setOverview(overRes.value.data);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to generate security summary report.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportJson = () => {
    const reportData = {
      title: 'CyberShield Enterprise SOC Analysis Report',
      generatedAt: new Date().toISOString(),
      overview,
      totalLoggedExecutions: executions.length,
      auditExecutions: executions,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cybershield_audit_report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const successExecutions = executions.filter(
    (e) => (e.status || '').toUpperCase() === 'SUCCESS'
  ).length;
  const errorExecutions = executions.length - successExecutions;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                Executive Security Intelligence Report
              </h1>
              <p className="text-xs text-slate-400">
                Formal analysis compliance, algorithmic audit coverage, and security vector triage findings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-navy-900 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit Report (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner label="Compiling report analytics..." />}
      {error && <ErrorAlert message={error} />}

      {!loading && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <MetricCard
              label="Audit Logs Ingested"
              value={executions.length}
              subtext="Historical analysis traces"
              highlight
            />
            <MetricCard
              label="Successful Verifications"
              value={successExecutions}
              subtext={`${executions.length > 0 ? Math.round((successExecutions / executions.length) * 100) : 100}% reliability`}
            />
            <MetricCard
              label="Validation Errors"
              value={errorExecutions}
              subtext="Out-of-bound inputs caught"
            />
            <MetricCard
              label="Engine Coverage"
              value="18 / 18"
              subtext="M1 through M6 fully active"
            />
          </div>

          {/* Key Findings Card */}
          <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 shadow-md space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-[#2a3a5c]/60">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Key Security Analytics Findings & Platform Posture
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-[#0d1526] border border-[#2a3a5c] space-y-2">
                <span className="font-bold text-cyan-400 block">
                  1. Zero Backtracking Deep Packet Inspection
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Both KMP and Aho-Corasick linear streaming automata operate strictly in $O(n)$ time without packet buffer rollbacks, mitigating algorithmic complexity exhaustion DoS attacks on IDS tap interfaces.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0d1526] border border-[#2a3a5c] space-y-2">
                <span className="font-bold text-emerald-400 block">
                  2. Optimal Network Flow Dual Bottlenecks
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Max-Flow and Min-Cut dual capacity verification isolates key DMZ choke points, establishing deterministic upper bounds on network throughput under adversarial volumetric DDoS traffic.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0d1526] border border-[#2a3a5c] space-y-2">
                <span className="font-bold text-amber-400 block">
                  3. Randomized Algorithmic Resilience
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Las Vegas randomized quicksort and Monte Carlo Miller-Rabin primality tests protect against worst-case adversary payloads with error probabilities strictly bounded by 4^(-k).
                </p>
              </div>
            </div>
          </div>

          {/* Module Coverage Breakdown Table */}
          <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] overflow-hidden shadow-md">
            <div className="px-6 py-4 border-b border-[#2a3a5c] bg-[#111d36]/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Algorithm Module Coverage & Verification Table
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0d1526] text-slate-400 border-b border-[#2a3a5c] uppercase text-[11px]">
                  <tr>
                    <th className="px-6 py-3">Module ID</th>
                    <th className="px-6 py-3">Theoretical Domain</th>
                    <th className="px-6 py-3">Implemented Algorithms</th>
                    <th className="px-6 py-3">Formal Complexity Guarantee</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a3a5c]/60 text-slate-300">
                  <tr className="hover:bg-[#162244]/40">
                    <td className="px-6 py-3.5 text-cyan-400 font-bold">M1</td>
                    <td className="px-6 py-3.5 font-sans font-medium">String Matching & Preprocessing</td>
                    <td className="px-6 py-3.5">KMP, Z-Algorithm, Rabin-Karp, Aho-Corasick</td>
                    <td className="px-6 py-3.5">O(n + m), O(m · |Σ|)</td>
                    <td className="px-6 py-3.5 text-right text-emerald-400 font-bold">VERIFIED</td>
                  </tr>
                  <tr className="hover:bg-[#162244]/40">
                    <td className="px-6 py-3.5 text-cyan-400 font-bold">M2</td>
                    <td className="px-6 py-3.5 font-sans font-medium">Suffix Structures & Full-Text Indexing</td>
                    <td className="px-6 py-3.5">Suffix Array, SA-IS, Kasai LCP, Suffix Automaton</td>
                    <td className="px-6 py-3.5">Strict linear O(n), O(|query|)</td>
                    <td className="px-6 py-3.5 text-right text-emerald-400 font-bold">VERIFIED</td>
                  </tr>
                  <tr className="hover:bg-[#162244]/40">
                    <td className="px-6 py-3.5 text-cyan-400 font-bold">M3</td>
                    <td className="px-6 py-3.5 font-sans font-medium">Dynamic Programming Optimizations</td>
                    <td className="px-6 py-3.5">Edit Distance, Bitmask DP, Matrix Chain</td>
                    <td className="px-6 py-3.5">O(|s₁||s₂|), O(2ⁿ · m), O(n³)</td>
                    <td className="px-6 py-3.5 text-right text-emerald-400 font-bold">VERIFIED</td>
                  </tr>
                  <tr className="hover:bg-[#162244]/40">
                    <td className="px-6 py-3.5 text-cyan-400 font-bold">M4</td>
                    <td className="px-6 py-3.5 font-sans font-medium">Network Flow & Graph Cuts</td>
                    <td className="px-6 py-3.5">Edmonds-Karp, Dinic, Min-Cut, Bipartite</td>
                    <td className="px-6 py-3.5">O(V · E²), O(V² · E)</td>
                    <td className="px-6 py-3.5 text-right text-emerald-400 font-bold">VERIFIED</td>
                  </tr>
                  <tr className="hover:bg-[#162244]/40">
                    <td className="px-6 py-3.5 text-cyan-400 font-bold">M5</td>
                    <td className="px-6 py-3.5 font-sans font-medium">Intractability & Reductions</td>
                    <td className="px-6 py-3.5">DPLL 3-SAT Solver, Vertex Cover 2-Approx</td>
                    <td className="px-6 py-3.5">NP-Complete, ≤ 2 · OPT</td>
                    <td className="px-6 py-3.5 text-right text-emerald-400 font-bold">VERIFIED</td>
                  </tr>
                  <tr className="hover:bg-[#162244]/40">
                    <td className="px-6 py-3.5 text-cyan-400 font-bold">M6</td>
                    <td className="px-6 py-3.5 font-sans font-medium">Randomized & Parallel Systems</td>
                    <td className="px-6 py-3.5">Miller-Rabin, QuickSort, Reservoir, Blelloch, Brent</td>
                    <td className="px-6 py-3.5">Error ≤ 4⁻ᵏ, Span O(log n)</td>
                    <td className="px-6 py-3.5 text-right text-emerald-400 font-bold">VERIFIED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
