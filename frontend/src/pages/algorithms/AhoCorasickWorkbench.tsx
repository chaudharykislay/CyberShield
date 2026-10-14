import React, { useState, useMemo } from 'react';
import { api } from '../../services/api';
import { AlgorithmResponse, AhoCorasickResult } from '../../types';
import AlgorithmPanel from '../../components/ui/AlgorithmPanel';
import MetricCard from '../../components/ui/MetricCard';
import TraceViewer from '../../components/ui/TraceViewer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Play, Sparkles, Network, ListChecks } from 'lucide-react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

export const AhoCorasickWorkbench: React.FC = () => {
  const [text, setText] = useState<string>(
    'GET /api/v1/search?q=SELECT+password+FROM+users+UNION+SELECT+1,2+-- HTTP/1.1\nUser-Agent: sqlmap/1.5.2#stable\nCookie: session=evil_admin'
  );
  const [patternsInput, setPatternsInput] = useState<string>(
    'SELECT\nUNION\nsqlmap\nadmin\npassword'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AlgorithmResponse<AhoCorasickResult> | null>(null);

  const handleRun = async () => {
    const patterns = patternsInput
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (!text || patterns.length === 0) {
      setError('Please provide log text and at least one pattern signature.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.runAhoCorasick({ text, patterns });
      setResponse(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to execute Aho-Corasick multi-pattern scanner.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setText(
      'ALERT: [1:1000001:1] ATTACK_SQL_INJECTION [Priority: 1] {TCP} 10.0.0.5:48392 -> 192.168.1.10:80 [Payload: exec(xp_cmdshell) OR 1=1]'
    );
    setPatternsInput('ATTACK\nxp_cmdshell\nexec\n1=1');
  };

  // Build ReactFlow nodes & edges representing the trie
  const { flowNodes, flowEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // If backend provided trieNodes & trieEdges, render those
    if (response?.result?.trieNodes && response.result.trieNodes.length > 0) {
      const tNodes = response.result.trieNodes;
      const tEdges = response.result.trieEdges || [];

      // Layout nodes radially or in rows
      tNodes.forEach((node, idx) => {
        const row = Math.floor(idx / 5);
        const col = idx % 5;
        nodes.push({
          id: String(node.id),
          position: { x: col * 150 + 40, y: row * 110 + 40 },
          data: {
            label: (
              <div className="text-center">
                <div className="font-bold text-xs">{node.label || `Node ${node.id}`}</div>
                {node.isWord && (
                  <span className="text-[10px] text-cyan-400 font-mono block">MATCH</span>
                )}
              </div>
            ),
          },
          style: {
            background: node.isWord ? '#162244' : '#0d1526',
            color: node.isWord ? '#00d4ff' : '#e2e8f0',
            border: node.isWord ? '2px solid #00d4ff' : '1px solid #2a3a5c',
            borderRadius: '8px',
            padding: '6px 12px',
          },
        });
      });

      tEdges.forEach((edge, idx) => {
        edges.push({
          id: `e-${idx}`,
          source: String(edge.source),
          target: String(edge.target),
          label: edge.char,
          animated: edge.isFailure,
          style: {
            stroke: edge.isFailure ? '#f43f5e' : '#00d4ff',
            strokeWidth: edge.isFailure ? 1.5 : 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edge.isFailure ? '#f43f5e' : '#00d4ff',
          },
        });
      });

      return { flowNodes: nodes, flowEdges: edges };
    }

    // Default Fallback Trie generation from input patterns for visual inspection
    const patterns = patternsInput
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    // Root
    nodes.push({
      id: '0',
      position: { x: 300, y: 20 },
      data: { label: <span className="font-bold text-xs text-cyan-300">ROOT (0)</span> },
      style: {
        background: '#0d1526',
        color: '#00d4ff',
        border: '2px solid #00d4ff',
        borderRadius: '8px',
        padding: '6px 14px',
      },
    });

    let nodeId = 1;
    const charToNode: Record<string, number> = {};

    patterns.slice(0, 4).forEach((pat, pIdx) => {
      let parentId = 0;
      let pathPrefix = '';
      const letters = pat.substring(0, 4).split('');

      letters.forEach((char, lIdx) => {
        pathPrefix += char;
        let currentId: number;

        if (charToNode[pathPrefix] !== undefined) {
          currentId = charToNode[pathPrefix];
        } else {
          currentId = nodeId++;
          charToNode[pathPrefix] = currentId;
          const isTerminal = lIdx === letters.length - 1;

          nodes.push({
            id: String(currentId),
            position: {
              x: 80 + pIdx * 150 + lIdx * 25,
              y: 100 + lIdx * 80,
            },
            data: {
              label: (
                <div className="text-center font-mono text-xs">
                  <span className="font-bold">{char}</span>
                  {isTerminal && (
                    <div className="text-[10px] text-cyan-400 font-sans">
                      MATCH: {pat}
                    </div>
                  )}
                </div>
              ),
            },
            style: {
              background: isTerminal ? '#162244' : '#0d1526',
              color: isTerminal ? '#00d4ff' : '#e2e8f0',
              border: isTerminal ? '2px solid #00d4ff' : '1px solid #2a3a5c',
              borderRadius: '8px',
              padding: '4px 10px',
            },
          });

          edges.push({
            id: `edge-${parentId}-${currentId}`,
            source: String(parentId),
            target: String(currentId),
            label: char,
            style: { stroke: '#00d4ff', strokeWidth: 1.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#00d4ff' },
          });
        }
        parentId = currentId;
      });
    });

    return { flowNodes: nodes, flowEdges: edges };
  }, [response, patternsInput]);

  return (
    <AlgorithmPanel
      title="Aho-Corasick Automaton Multi-Pattern Matcher"
      module="M1: String Algorithms"
      timeComplexity="O(n + m + z) where z = matches count"
      spaceComplexity="O(m · |Σ|)"
      description="Constructs a Trie automaton enriched with failure link transitions and output dictionaries. Allows simultaneous simultaneous detection of dictionary signatures in a single linear pass over the payload."
      cyberApplication="Snort/Suricata multi-rule inspection, ClamAV antivirus signatures, and web application firewall rulesets"
      actions={
        <button
          onClick={loadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-cyan-300 border border-[#2a3a5c] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load IDS Ruleset</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Ingested Telemetry Stream
            </label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-lg bg-[#0d1526] p-3 text-xs font-mono text-slate-200 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Dictionary Signatures (one pattern per line)
            </label>
            <textarea
              rows={4}
              value={patternsInput}
              onChange={(e) => setPatternsInput(e.target.value)}
              className="w-full rounded-lg bg-[#0d1526] p-3 text-xs font-mono text-cyan-300 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              placeholder="e.g.&#10;SELECT&#10;UNION&#10;admin"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-2.5 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Evaluating Trie...' : 'Run Multi-Pattern Scan'}</span>
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onRetry={handleRun} />}
        {loading && <LoadingSpinner label="Traversing Trie failure transitions..." />}

        {response && response.result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Total Signatures Hit"
                value={response.result.totalMatches ?? response.result.matches?.length ?? 0}
                subtext={`Patterns tested: ${patternsInput.split('\n').filter(Boolean).length}`}
                highlight
              />
              <MetricCard
                label="Scan Latency"
                value={`${((response.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
                subtext={`${response.metrics?.executionTimeNanos || 0} nanos`}
              />
              <MetricCard
                label="State Transitions"
                value={response.metrics?.comparisonCount ?? 0}
                subtext="Deterministic O(1) state transitions"
              />
            </div>

            {/* Matches Table */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] overflow-hidden shadow-md">
              <div className="px-5 py-3 border-b border-[#2a3a5c] flex items-center gap-2 bg-[#111d36]/50">
                <ListChecks className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Detected Malicious Signature Tokens
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0d1526] text-slate-400 border-b border-[#2a3a5c] uppercase text-[11px]">
                    <tr>
                      <th className="px-5 py-2.5">Pattern Match</th>
                      <th className="px-5 py-2.5">Start Position</th>
                      <th className="px-5 py-2.5">Context Snippet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3a5c]/60 text-slate-300">
                    {(response.result.matches || []).map((match, idx) => {
                      const pos = match.position;
                      const pat = match.pattern;
                      const start = Math.max(0, pos - 10);
                      const end = Math.min(text.length, pos + pat.length + 10);
                      const snippet = text.substring(start, end);

                      return (
                        <tr key={idx} className="hover:bg-[#162244]/40">
                          <td className="px-5 py-2.5 text-cyan-300 font-bold">
                            {pat}
                          </td>
                          <td className="px-5 py-2.5 text-slate-400">
                            Index {pos}
                          </td>
                          <td className="px-5 py-2.5 text-slate-300">
                            ...{snippet}...
                          </td>
                        </tr>
                      );
                    })}
                    {(!response.result.matches || response.result.matches.length === 0) && (
                      <tr>
                        <td colSpan={3} className="px-5 py-4 text-center text-slate-500 font-sans">
                          No dictionary signatures matched in the provided text.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ReactFlow Trie Visualization */}
            <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Network className="w-4 h-4 text-cyan-400" />
                  Aho-Corasick Automaton Trie Graph (Interactive)
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Cyan = Transitions | Magenta = Failure Links
                </span>
              </div>
              <div className="h-80 w-full rounded-lg bg-[#090d19] border border-[#2a3a5c] overflow-hidden">
                <ReactFlow
                  nodes={flowNodes}
                  edges={flowEdges}
                  fitView
                  minZoom={0.2}
                  maxZoom={1.5}
                >
                  <Background color="#162244" gap={16} />
                  <Controls className="bg-[#1a2744] border border-[#2a3a5c] text-white" />
                </ReactFlow>
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

export default AhoCorasickWorkbench;
