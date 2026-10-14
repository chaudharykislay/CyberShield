import React, { useState } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, VertexCoverResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Shield, Share2 } from 'lucide-react';

export const VertexCoverWorkbench: React.FC = () => {
  const [verticesInput, setVerticesInput] = useState<string>('A, B, C, D, E, F');
  const [edgesInput, setEdgesInput] = useState<string>(
    'A-B\nB-C\nC-D\nD-E\nE-F\nF-A\nB-E'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<VertexCoverResult> | null>(null);

  const handleRun = async () => {
    const vertices = verticesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const edgeLines = edgesInput.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsedEdges: [string, string][] = [];

    for (const line of edgeLines) {
      const parts = line.split('-').map((s) => s.trim());
      if (parts.length === 2 && parts[0] && parts[1]) {
        parsedEdges.push([parts[0], parts[1]]);
      }
    }

    if (parsedEdges.length === 0) {
      setError('Please provide at least one valid edge (e.g. A-B).');
      return;
    }

    // Map vertex names to indices 0..V-1
    const nodeToIndex = new Map<string, number>();
    const indexToNode = new Map<number, string>();
    vertices.forEach((v, idx) => {
      nodeToIndex.set(v, idx);
      indexToNode.set(idx, v);
    });

    let nextIndex = vertices.length;
    parsedEdges.forEach(([u, v]) => {
      if (!nodeToIndex.has(u)) {
        nodeToIndex.set(u, nextIndex);
        indexToNode.set(nextIndex, u);
        nextIndex++;
      }
      if (!nodeToIndex.has(v)) {
        nodeToIndex.set(v, nextIndex);
        indexToNode.set(nextIndex, v);
        nextIndex++;
      }
    });

    const intEdges: [number, number][] = parsedEdges.map(([u, v]) => [
      nodeToIndex.get(u)!,
      nodeToIndex.get(v)!,
    ]);

    setLoading(true);
    setError(null);
    try {
      const res = await api.runVertexCover({
        vertexCount: Math.max(1, nodeToIndex.size),
        edges: intEdges,
      });

      const resultData = res.data;
      if (resultData && resultData.result) {
        const coverIndices: number[] = resultData.result.selectedVertices || [];
        const coverNames = coverIndices.map((idx) => indexToNode.get(idx) || `Node_${idx}`);
        resultData.result.coverVertices = coverNames;
        resultData.result.coverSize = resultData.result.vertexCoverSize ?? coverIndices.length;
      }
      setResponse(resultData);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute Vertex Cover approximation.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setVerticesInput('Gateway, CoreRouter, Switch1, Switch2, HostA, HostB');
    setEdgesInput(
      'Gateway-CoreRouter\nCoreRouter-Switch1\nCoreRouter-Switch2\nSwitch1-HostA\nSwitch2-HostB'
    );
  };

  return (
    <AlgorithmPanel
      title="Vertex Cover 2-Approximation (Maximal Matching)"
      module="M5: Intractability & NP-Completeness"
      timeComplexity="O(|V| + |E|) linear approximation"
      spaceComplexity="O(|V| + |E|)"
      description="Computes a polynomial-time 2-approximation for the NP-complete Minimum Vertex Cover problem by selecting endpoints of a maximal edge matching, guaranteeing |C| ≤ 2 · |C*|."
      cyberApplication="Optimal sensor placement, firewall monitoring tap locations, and critical node vulnerability quarantine"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Sensor Topology</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Network Vertices / Host Nodes (comma-separated)
            </label>
            <input
              type="text"
              value={verticesInput}
              onChange={(e) => setVerticesInput(e.target.value)}
              className="w-full rounded-lg bg-[#0d1526] px-3 py-2 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Network Edges / Communication Links (one per line, format: u-v)
            </label>
            <textarea
              rows={4}
              value={edgesInput}
              onChange={(e) => setEdgesInput(e.target.value)}
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
              <span>{loading ? 'Covering Edges...' : 'Compute Minimal Vertex Cover'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Constructing maximal edge matching in O(V + E)..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Selected Cover Size"
                value={response.result.coverSize ?? (response.result.coverVertices?.length || 0)}
                subtext="Vertices covering all communication links"
                highlight
              />
              <MetricCard
                label="Guaranteed Ratio"
                value="≤ 2.0 × OPT"
                subtext="Theoretical 2-approximation bound"
              />
              <MetricCard
                label="Execution Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
            </div>

            {/* Selected Cover Nodes */}
            <div className="rounded-xl border border-cyan-500/30 bg-[#111d36]/70 p-5 shadow-md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Monitored Vertex Cover Nodes (Tapping Locations)
              </h3>
              <div className="flex flex-wrap gap-2">
                {(response.result.coverVertices || []).map((v, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 font-mono text-xs font-bold text-cyan-300"
                  >
                    Node: {v}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Placing telemetry probes or IDS taps at these {response.result.coverSize} nodes guarantees 100% monitoring coverage over all network links.
              </p>
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

export default VertexCoverWorkbench;
