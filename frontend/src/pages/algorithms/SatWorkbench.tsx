import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, SatResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export const SatWorkbench: React.FC = () => {
  const [variableCount, setVariableCount] = useState<number>(4);
  const [clausesInput, setClausesInput] = useState<string>(
    '1 2 -3 0\n-1 2 4 0\n1 -2 3 0\n-3 -4 0'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<SatResult> | null>(null);

  const handleRun = async () => {
    // Parse DIMACS lines: each line is numbers ending with 0
    const lines = clausesInput.split('\n').map((l) => l.trim()).filter(Boolean);
    const clauses: number[][] = [];

    for (const line of lines) {
      const literals = line
        .split(/\s+/)
        .map((s) => parseInt(s, 10))
        .filter((n) => !isNaN(n) && n !== 0);
      if (literals.length > 0) {
        clauses.push(literals);
      }
    }

    if (clauses.length === 0) {
      setError('Please provide at least one clause in DIMACS format.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.runSat({
        numVariables: variableCount,
        clauses,
      });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute DPLL SAT solver on backend.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setVariableCount(3);
    setClausesInput('1 2 3 0\n-1 -2 0\n-2 -3 0\n-1 -3 0');
  };

  return (
    <AlgorithmPanel
      title="Boolean Satisfiability (SAT) & DPLL Solver"
      module="M5: Intractability & NP-Completeness"
      timeComplexity="NP-Complete (Worst O(2ⁿ), DPLL pruned)"
      spaceComplexity="O(n + m) clause database"
      description="Executes the Davis-Putnam-Logemann-Loveland (DPLL) backtracking search with unit propagation and pure literal elimination to find a truth assignment for Conjunctive Normal Form (CNF) formulas."
      cyberApplication="Formal vulnerability analysis, automated exploit generation, and cryptographic key constraint verification"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load 3-CNF Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-48">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Variable Count (n)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={variableCount}
                onChange={(e) => setVariableCount(Number(e.target.value))}
                className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex-1 w-full text-xs text-slate-400">
              <span className="text-cyan-400 font-semibold block mb-0.5">DIMACS CNF Standard:</span>
              Positive numbers are positive literals (e.g. 1 is $x_1$), negative numbers are negated (e.g. -2 is $\neg x_2$), terminating with 0.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Clauses (DIMACS CNF lines)
            </label>
            <textarea
              rows={4}
              value={clausesInput}
              onChange={(e) => setClausesInput(e.target.value)}
              className="w-full rounded-lg bg-[#0d1526] p-3 text-xs font-mono text-cyan-300 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Solving DPLL...' : 'Run SAT Verification'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Performing unit propagation & recursive branch splitting..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Formula Satisfiability"
                value={response.result.satisfiable ? 'SATISFIABLE' : 'UNSATISFIABLE'}
                subtext={
                  response.result.satisfiable
                    ? 'Found valid truth assignment'
                    : 'Proved contradictory constraint'
                }
                highlight
              />
              <MetricCard
                label="Execution Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
              <MetricCard
                label="Decision Branches"
                value={response.metrics?.comparisonCount ?? 0}
                subtext="Backtracking nodes traversed"
              />
            </div>

            {/* Truth Assignment Display */}
            {response.result.satisfiable && response.result.assignment && (
              <div className="rounded-xl border border-emerald-500/30 bg-[#111d36]/70 p-5 shadow-md">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Satisfying Variable Assignment
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(response.result.assignment).map(([varName, val]) => (
                    <div
                      key={varName}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 ${
                        val
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      <span className="font-bold">x_{varName} =</span>
                      <span>{val ? 'TRUE (1)' : 'FALSE (0)'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!response.result.satisfiable && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-xs text-rose-300 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <strong className="block text-sm">Constraint Unsatisfiable (UNSAT)</strong>
                  The provided policy constraints create a logical deadlock with no valid assignment possible.
                </div>
              </div>
            )}

            {/* Polynomial Reduction Chain Diagram */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
                Cook-Levin Theorem Polynomial-Time Reduction Chain
              </h3>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg bg-[#0d1526] border border-[#2a3a5c] text-xs font-mono">
                <div className="p-2.5 rounded bg-[#162244] border border-cyan-500/40 text-cyan-300 text-center">
                  <span className="block font-bold">CIRCUIT-SAT</span>
                  <span className="text-[10px] text-slate-400">Cook-Levin Core</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="p-2.5 rounded bg-[#162244] border border-cyan-500/40 text-cyan-300 text-center">
                  <span className="block font-bold">3-SAT</span>
                  <span className="text-[10px] text-slate-400">CNF Canonical Form</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="p-2.5 rounded bg-[#162244] border border-cyan-500/40 text-cyan-300 text-center">
                  <span className="block font-bold">INDEPENDENT SET</span>
                  <span className="text-[10px] text-slate-400">Clause Gadgets</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="p-2.5 rounded bg-[#162244] border border-cyan-500/40 text-cyan-300 text-center">
                  <span className="block font-bold">VERTEX COVER</span>
                  <span className="text-[10px] text-slate-400">V \ S Complement</span>
                </div>
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

export default SatWorkbench;
