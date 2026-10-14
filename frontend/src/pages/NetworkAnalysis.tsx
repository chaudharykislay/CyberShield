import React, { useState, useCallback } from 'react';
import { api } from '../services/api';
import { AlgorithmResponse, MaxFlowResult, BipartiteMatchingResult } from '../types';
import MetricCard from '../components/ui/MetricCard';
import TraceViewer from '../components/ui/TraceViewer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import {
  Network,
  Play,
  RotateCcw,
  Sparkles,
  Scissors,
  Users,
  ShieldAlert,
  Plus,
  Trash2,
} from 'lucide-react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  { id: 'S', position: { x: 50, y: 150 }, data: { label: 'Source (S)' }, style: { background: '#0d1526', color: '#00d4ff', border: '2px solid #00d4ff', borderRadius: '8px', padding: '8px 16px', fontWeight: 'bold' } },
  { id: 'A', position: { x: 250, y: 50 }, data: { label: 'Node A (Firewall)' }, style: { background: '#0d1526', color: '#e2e8f0', border: '1px solid #2a3a5c', borderRadius: '8px', padding: '8px 16px' } },
  { id: 'B', position: { x: 250, y: 250 }, data: { label: 'Node B (Gateway)' }, style: { background: '#0d1526', color: '#e2e8f0', border: '1px solid #2a3a5c', borderRadius: '8px', padding: '8px 16px' } },
  { id: 'C', position: { x: 450, y: 50 }, data: { label: 'Node C (DMZ Proxy)' }, style: { background: '#0d1526', color: '#e2e8f0', border: '1px solid #2a3a5c', borderRadius: '8px', padding: '8px 16px' } },
  { id: 'D', position: { x: 450, y: 250 }, data: { label: 'Node D (Internal DNS)' }, style: { background: '#0d1526', color: '#e2e8f0', border: '1px solid #2a3a5c', borderRadius: '8px', padding: '8px 16px' } },
  { id: 'T', position: { x: 650, y: 150 }, data: { label: 'Sink (T - Core DB)' }, style: { background: '#0d1526', color: '#10b981', border: '2px solid #10b981', borderRadius: '8px', padding: '8px 16px', fontWeight: 'bold' } },
];

const initialEdges: Edge[] = [
  { id: 'e-S-A', source: 'S', target: 'A', label: 'Cap: 10', data: { capacity: 10, flow: 0 }, style: { stroke: '#00d4ff', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00d4ff' } },
  { id: 'e-S-B', source: 'S', target: 'B', label: 'Cap: 10', data: { capacity: 10, flow: 0 }, style: { stroke: '#00d4ff', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00d4ff' } },
  { id: 'e-A-B', source: 'A', target: 'B', label: 'Cap: 2', data: { capacity: 2, flow: 0 }, style: { stroke: '#00d4ff', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00d4ff' } },
  { id: 'e-A-C', source: 'A', target: 'C', label: 'Cap: 4', data: { capacity: 4, flow: 0 }, style: { stroke: '#00d4ff', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00d4ff' } },
  { id: 'e-A-D', source: 'A', target: 'D', label: 'Cap: 8', data: { capacity: 8, flow: 0 }, style: { stroke: '#00d4ff', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00d4ff' } },
  { id: 'e-B-D', source: 'B', target: 'D', label: 'Cap: 9', data: { capacity: 9, flow: 0 }, style: { stroke: '#00d4ff', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00d4ff' } },
  { id: 'e-D-C', source: 'D', target: 'C', label: 'Cap: 6', data: { capacity: 6, flow: 0 }, style: { stroke: '#00d4ff', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00d4ff' } },
  { id: 'e-C-T', source: 'C', target: 'T', label: 'Cap: 10', data: { capacity: 10, flow: 0 }, style: { stroke: '#00d4ff', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00d4ff' } },
  { id: 'e-D-T', source: 'D', target: 'T', label: 'Cap: 10', data: { capacity: 10, flow: 0 }, style: { stroke: '#00d4ff', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00d4ff' } },
];

export const NetworkAnalysis: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedAlgo, setSelectedAlgo] = useState<'EDMONDS_KARP' | 'DINIC' | 'FORD_FULKERSON'>('EDMONDS_KARP');
  const [sourceNode, setSourceNode] = useState<string>('S');
  const [sinkNode, setSinkNode] = useState<string>('T');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flowResponse, setFlowResponse] = useState<AlgorithmResponse<MaxFlowResult> | null>(null);

  // Bipartite Matching state
  const [bipartiteLoading, setBipartiteLoading] = useState(false);
  const [bipartiteResponse, setBipartiteResponse] = useState<AlgorithmResponse<BipartiteMatchingResult> | null>(null);

  // Node addition state
  const [newNodeName, setNewNodeName] = useState<string>('');

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        id: `e-${params.source}-${params.target}`,
        source: params.source || '',
        target: params.target || '',
        label: 'Cap: 10',
        data: { capacity: 10, flow: 0 },
        style: { stroke: '#00d4ff', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#00d4ff' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const handleRunMaxFlow = async () => {
    setLoading(true);
    setError(null);

    const graphEdges = edges.map((e) => ({
      from: e.source,
      to: e.target,
      capacity: (e.data?.capacity !== undefined) ? e.data.capacity : 10,
    }));

    try {
      // Map string node IDs (e.g. 'S', 'A', 'B'...) to contiguous integer indices 0..N-1
      const nodeIds = nodes.map((n) => n.id);
      const nodeIndexMap = new Map<string, number>();
      nodeIds.forEach((id, idx) => nodeIndexMap.set(id, idx));

      const srcIdx = nodeIndexMap.get(sourceNode);
      const snkIdx = nodeIndexMap.get(sinkNode);

      if (srcIdx === undefined || snkIdx === undefined) {
        setError('Please select valid Source and Sink nodes.');
        setLoading(false);
        return;
      }

      if (srcIdx === snkIdx) {
        setError('Source and Sink must be distinct nodes.');
        setLoading(false);
        return;
      }

      const validEdges = edges
        .map((e) => ({
          from: nodeIndexMap.get(e.source),
          to: nodeIndexMap.get(e.target),
          capacity: (e.data?.capacity !== undefined) ? Number(e.data.capacity) : 10,
        }))
        .filter((e) => e.from !== undefined && e.to !== undefined && e.from !== e.to && e.capacity > 0)
        .map((e) => ({ from: e.from as number, to: e.to as number, capacity: e.capacity }));

      const res = await api.runMaxFlow({
        nodes: nodes.length,
        source: srcIdx,
        sink: snkIdx,
        flowAlgorithm: selectedAlgo,
        edges: validEdges,
      });

      // Also compute Min-Cut to display dual cut partition
      let minCutData: any = null;
      try {
        const cutRes = await api.runMinCut({
          nodes: nodes.length,
          source: srcIdx,
          sink: snkIdx,
          edges: validEdges,
        });
        if (cutRes.data?.result) {
          const cutResult = cutRes.data.result;
          minCutData = {
            cutCapacity: cutResult.cutCapacity,
            sourcePartition: (cutResult.sourcePartition || []).map((idx: number) => nodeIds[idx]),
            sinkPartition: (cutResult.sinkPartition || []).map((idx: number) => nodeIds[idx]),
          };
        }
      } catch (cutErr) {
        // Fallback: Max-Flow already contains flowMatrix
      }

      const responseWithCut = {
        ...res.data,
        result: {
          ...res.data.result,
          minCut: minCutData,
        },
      };

      setFlowResponse(responseWithCut);

      // Update flow labels and styling on edges using flowMatrix
      const flowMatrix: number[][] = res.data?.result?.flowMatrix;
      setEdges((eds) =>
        eds.map((edge) => {
          const u = nodeIndexMap.get(edge.source);
          const v = nodeIndexMap.get(edge.target);
          const flowVal = (flowMatrix && u !== undefined && v !== undefined && flowMatrix[u])
            ? Math.max(0, flowMatrix[u][v] || 0)
            : 0;
          const capVal = (edge.data?.capacity !== undefined) ? edge.data.capacity : 10;
          const isSaturated = flowVal >= capVal && capVal > 0;

          return {
            ...edge,
            label: `${flowVal} / ${capVal}`,
            style: {
              stroke: isSaturated ? '#f43f5e' : (flowVal > 0 ? '#00d4ff' : '#2a3a5c'),
              strokeWidth: isSaturated ? 3 : (flowVal > 0 ? 2 : 1.5),
            },
            animated: flowVal > 0,
          };
        })
      );

      // If min-cut returned, color source and sink partitions
      if (minCutData?.sourcePartition) {
        const sourcePartitionSet = new Set(minCutData.sourcePartition);
        setNodes((nds) =>
          nds.map((node) => {
            const inSource = sourcePartitionSet.has(node.id);
            return {
              ...node,
              style: {
                ...node.style,
                background: inSource ? '#064e3b' : '#311042',
                border: inSource ? '2px solid #10b981' : '2px solid #c084fc',
              },
            };
          })
        );
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to execute Max Flow analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunBipartiteMatching = async () => {
    setBipartiteLoading(true);
    setError(null);
    try {
      const uNodes = ['Host_1', 'Host_2', 'Host_3', 'Host_4'];
      const vNodes = ['Port_80', 'Port_443', 'Port_8080', 'Port_22'];
      // Backend expects integer 0-indexed edges: [[0, 0], [0, 1], [1, 0], [2, 2], [2, 1], [3, 3]]
      const integerEdges = [
        [0, 0], // Host_1 -> Port_80
        [0, 1], // Host_1 -> Port_443
        [1, 0], // Host_2 -> Port_80
        [2, 2], // Host_3 -> Port_8080
        [2, 1], // Host_3 -> Port_443
        [3, 3], // Host_4 -> Port_22
      ];

      const res = await api.runBipartiteMatching({
        leftCount: uNodes.length,
        rightCount: vNodes.length,
        edges: integerEdges,
      });

      // Map integer pairs back to named hosts and ports for display
      const result = res.data?.result;
      const namedPairs = (result?.matchedPairs || []).map((pair: number[]) => ({
        u: uNodes[pair[0]] || `Left_${pair[0]}`,
        v: vNodes[pair[1]] || `Right_${pair[1]}`,
      }));

      setBipartiteResponse({
        ...res.data,
        result: {
          ...result,
          maxMatchingSize: result?.matchingSize ?? 0,
          pairs: namedPairs,
        },
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to solve maximum bipartite matching.');
    } finally {
      setBipartiteLoading(false);
    }
  };

  const handleAddNode = () => {
    if (!newNodeName.trim()) return;
    const id = newNodeName.trim().toUpperCase();
    const newNode: Node = {
      id,
      position: { x: 350 + Math.random() * 50, y: 150 + Math.random() * 50 },
      data: { label: `Node ${id}` },
      style: {
        background: '#0d1526',
        color: '#e2e8f0',
        border: '1px solid #2a3a5c',
        borderRadius: '8px',
        padding: '8px 16px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNewNodeName('');
  };

  const handleResetGraph = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setFlowResponse(null);
    setBipartiteResponse(null);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                Network Flow & Cut Analysis Laboratory (M4)
              </h1>
              <p className="text-xs text-slate-400">
                Augmenting paths, residual graph capacities, and Max-Flow Min-Cut dual bottlenecks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetGraph}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1526] text-xs font-medium text-slate-300 hover:text-white border border-[#2a3a5c] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Graph</span>
            </button>
          </div>
        </div>

        {/* Controls Ribbon */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3 border-t border-[#2a3a5c]/60 pt-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Algorithm Strategy</label>
            <select
              value={selectedAlgo}
              onChange={(e) => setSelectedAlgo(e.target.value as any)}
              className="w-full rounded bg-[#0d1526] px-2.5 py-1.5 text-cyan-300 border border-[#2a3a5c]"
            >
              <option value="EDMONDS_KARP">Edmonds-Karp (BFS: O(V·E²))</option>
              <option value="DINIC">Dinic&apos;s Blocking Flow (O(V²·E))</option>
              <option value="FORD_FULKERSON">Ford-Fulkerson (DFS: O(E·f))</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Source Node</label>
            <select
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              className="w-full rounded bg-[#0d1526] px-2.5 py-1.5 text-white border border-[#2a3a5c]"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.id} ({String(n.data?.label)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Sink Node</label>
            <select
              value={sinkNode}
              onChange={(e) => setSinkNode(e.target.value)}
              className="w-full rounded bg-[#0d1526] px-2.5 py-1.5 text-white border border-[#2a3a5c]"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.id} ({String(n.data?.label)})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunMaxFlow}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 py-2 text-xs font-bold text-navy-900 hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Routing...' : 'Analyze Max Flow & Cut'}</span>
            </button>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={handleRunMaxFlow} />}

      {/* Metrics Row */}
      {flowResponse && flowResponse.result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Maximum Network Flow"
            value={`${flowResponse.result.maxFlow} units`}
            subtext={`Between ${sourceNode} and ${sinkNode}`}
            highlight
          />
          <MetricCard
            label="Min-Cut Capacity"
            value={`${flowResponse.result.minCut?.cutCapacity ?? flowResponse.result.maxFlow} units`}
            subtext="Dual bottle-neck capacity (Max-Flow = Min-Cut)"
          />
          <MetricCard
            label="Execution Latency"
            value={`${((flowResponse.metrics?.executionTimeNanos || 0) / 1_000_000).toFixed(4)} ms`}
            subtext={`${flowResponse.metrics?.executionTimeNanos || 0} nanos`}
          />
        </div>
      )}

      {/* ReactFlow Interactive Canvas */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white">
              Topology Canvas (Drag nodes, connect ports to add links)
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              Label format: [Current Flow / Max Capacity]
            </span>
          </div>

          {/* Quick Node Adder */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Node ID..."
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              className="w-24 rounded bg-[#0d1526] px-2 py-1 text-xs text-white border border-[#2a3a5c]"
            />
            <button
              onClick={handleAddNode}
              className="flex items-center gap-1 rounded bg-[#0d1526] px-2.5 py-1 text-xs text-cyan-400 hover:text-cyan-300 border border-[#2a3a5c]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Node</span>
            </button>
          </div>
        </div>

        <div className="h-[460px] w-full rounded-lg bg-[#090d19] border border-[#2a3a5c] overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background color="#162244" gap={16} />
            <Controls className="bg-[#1a2744] border border-[#2a3a5c] text-white" />
          </ReactFlow>
        </div>

        {flowResponse?.result?.minCut && (
          <div className="p-3 rounded-lg bg-[#0d1526] border border-[#2a3a5c] text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-rose-400" />
              <span className="text-slate-300">Min-Cut Partitioning:</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400">
                S-Partition: [{flowResponse.result.minCut.sourcePartition?.join(', ')}]
              </span>
              <span className="text-purple-400">
                T-Partition: [{flowResponse.result.minCut.sinkPartition?.join(', ')}]
              </span>
            </div>
          </div>
        )}
      </div>

      {flowResponse?.trace && flowResponse.trace.length > 0 && (
        <TraceViewer trace={flowResponse.trace} />
      )}

      {/* Bipartite Matching Sub-section */}
      <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2a3a5c]/60">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white">
                Bipartite Matching (Hopcroft-Karp / Flow Reduction)
              </h2>
              <p className="text-xs text-slate-400">
                Evaluates maximum matchings between client hosts and sensitive network ports
              </p>
            </div>
          </div>

          <button
            onClick={handleRunBipartiteMatching}
            disabled={bipartiteLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0d1526] px-4 py-2 text-xs font-bold text-cyan-400 hover:bg-[#162244] border border-cyan-500/30 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{bipartiteLoading ? 'Matching...' : 'Solve Host-Port Matching'}</span>
          </button>
        </div>

        {bipartiteResponse && bipartiteResponse.result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono p-3 rounded-lg bg-[#0d1526] border border-cyan-500/30">
              <span className="text-slate-300">Maximum Cardinality Matching:</span>
              <span className="text-cyan-400 font-bold text-sm">
                {bipartiteResponse.result.maxMatchingSize} pairs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(bipartiteResponse.result.pairs || []).map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#0d1526] border border-[#2a3a5c] text-xs font-mono flex items-center justify-between"
                >
                  <span className="text-emerald-400 font-semibold">{p.u}</span>
                  <span className="text-slate-500">↔</span>
                  <span className="text-cyan-300 font-semibold">{p.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkAnalysis;
