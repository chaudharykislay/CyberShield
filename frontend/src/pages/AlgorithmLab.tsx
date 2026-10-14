import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/ui/StatusBadge';
import {
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Binary,
  GitBranch,
  Network,
  HelpCircle,
  Dice5,
} from 'lucide-react';

// Import all Algorithm Workbenches
import KmpWorkbench from './algorithms/KmpWorkbench';
import ZFunctionWorkbench from './algorithms/ZFunctionWorkbench';
import RabinKarpWorkbench from './algorithms/RabinKarpWorkbench';
import AhoCorasickWorkbench from './algorithms/AhoCorasickWorkbench';
import SuffixArrayWorkbench from './algorithms/SuffixArrayWorkbench';
import SaIsWorkbench from './algorithms/SaIsWorkbench';
import LcpWorkbench from './algorithms/LcpWorkbench';
import SuffixAutomatonWorkbench from './algorithms/SuffixAutomatonWorkbench';
import EditDistanceWorkbench from './algorithms/EditDistanceWorkbench';
import BitmaskDpWorkbench from './algorithms/BitmaskDpWorkbench';
import MatrixChainWorkbench from './algorithms/MatrixChainWorkbench';
import SatWorkbench from './algorithms/SatWorkbench';
import VertexCoverWorkbench from './algorithms/VertexCoverWorkbench';
import MillerRabinWorkbench from './algorithms/MillerRabinWorkbench';
import QuickSortWorkbench from './algorithms/QuickSortWorkbench';
import ReservoirWorkbench from './algorithms/ReservoirWorkbench';
import ParallelScanWorkbench from './algorithms/ParallelScanWorkbench';
import BrentsTheoremWorkbench from './algorithms/BrentsTheoremWorkbench';

interface AlgoItem {
  id: string;
  name: string;
  category: string;
  time: string;
  space: string;
  description: string;
  cyberUse: string;
}

export const AlgorithmLab: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeModule, setActiveModule] = useState<string>('M1');
  const [selectedAlgo, setSelectedAlgo] = useState<string | null>(null);

  const modules = [
    { id: 'M1', label: 'M1: String Algorithms', icon: Layers },
    { id: 'M2', label: 'M2: Suffix Structures', icon: Binary },
    { id: 'M3', label: 'M3: Dynamic Programming', icon: GitBranch },
    { id: 'M4', label: 'M4: Network Flow', icon: Network },
    { id: 'M5', label: 'M5: NP & Reductions', icon: HelpCircle },
    { id: 'M6', label: 'M6: Randomized & Parallel', icon: Dice5 },
  ];

  const algorithmCatalogue: Record<string, AlgoItem[]> = {
    M1: [
      {
        id: 'kmp',
        name: 'Knuth-Morris-Pratt (KMP)',
        category: 'Exact Single Pattern Matcher',
        time: 'O(n + m)',
        space: 'O(m)',
        description: 'Linear time matching utilizing precomputed failure function π to eliminate text pointer backtracking.',
        cyberUse: 'DPI single-token network signature scanning and line-rate protocol filtering.',
      },
      {
        id: 'z-function',
        name: 'Z-Algorithm Preprocessing',
        category: 'Linear Box Matching',
        time: 'O(n + m)',
        space: 'O(n + m)',
        description: 'Constructs Z-array computing longest common prefix between string and all suffixes in linear time.',
        cyberUse: 'Protocol header anomaly detection and periodic token pattern extraction.',
      },
      {
        id: 'rabin-karp',
        name: 'Rabin-Karp Rolling Hash',
        category: 'Polynomial Hash Matching',
        time: 'Avg O(n + m), Worst O(nm)',
        space: 'O(1)',
        description: 'Sliding polynomial window hashing with modular arithmetic and spurious hit collision detection.',
        cyberUse: 'C2 beacon fingerprinting and sliding window stream matching.',
      },
      {
        id: 'aho-corasick',
        name: 'Aho-Corasick Automaton',
        category: 'Multi-Pattern Trie Automaton',
        time: 'O(n + m + z)',
        space: 'O(m · |Σ|)',
        description: 'Simultaneous multi-string dictionary matching in a single linear pass using failure links.',
        cyberUse: 'Snort/Suricata ruleset matching, WAF regex pre-filters, and malware signature triage.',
      },
    ],
    M2: [
      {
        id: 'suffix-array',
        name: 'Suffix Array Construction',
        category: 'Full-Text Lexicographic Index',
        time: 'O(n log n)',
        space: 'O(n)',
        description: 'Sorts all string suffixes lexicographically to enable binary search queries in logarithmic time.',
        cyberUse: 'Firmware binary indexing and offline memory dump pattern triage.',
      },
      {
        id: 'sa-is',
        name: 'SA-IS Induced Sorting',
        category: 'Optimal Linear Suffix Array',
        time: 'Strict O(n)',
        space: 'O(n)',
        description: 'Optimal linear-time suffix array construction using S/L character classification and LMS bucket induction.',
        cyberUse: 'Ultra-fast indexing for multi-gigabit forensic memory dumps.',
      },
      {
        id: 'lcp-kasai',
        name: "Kasai's LCP Construction",
        category: 'Amortized Linear LCP Array',
        time: 'Strict O(n)',
        space: 'O(n)',
        description: 'Linear time computation of Longest Common Prefix array through inverse suffix rank amortization.',
        cyberUse: 'Longest Repeated Substring (LRS) detection and polymorphic shellcode clustering.',
      },
      {
        id: 'suffix-automaton',
        name: 'Suffix Automaton (SAM)',
        category: 'Minimal Substring DFA',
        time: 'Strict O(n)',
        space: '≤ 2n - 1 states',
        description: 'Most compact directed acyclic word graph encoding all substrings in linear states and transitions.',
        cyberUse: 'Zero-delay O(|query|) exploit verification and distinct payload substring counting.',
      },
    ],
    M3: [
      {
        id: 'edit-distance',
        name: 'DP Edit Distance & Alignment',
        category: 'Sequence Alignment Matrix',
        time: 'O(|s₁| · |s₂|)',
        space: 'O(|s₁| · |s₂|)',
        description: 'Computes Levenshtein, Damerau-OSA (transpositions), and weighted operational penalty models.',
        cyberUse: 'Polymorphic shellcode alignment and typo-squatting domain scoring.',
      },
      {
        id: 'bitmask-dp',
        name: 'Bitmask Subset Cover DP',
        category: 'Exact Exponential State Cover',
        time: 'O(2ⁿ · m)',
        space: 'O(2ⁿ)',
        description: 'Evaluates optimal minimum cost security control set covering all mandatory policy compliance requirements.',
        cyberUse: 'Optimal firewall rule selection and minimal compliance budget allocation.',
      },
      {
        id: 'matrix-chain',
        name: 'Matrix Chain Multiplication',
        category: 'Parenthesization Optimization',
        time: 'O(n³)',
        space: 'O(n²)',
        description: 'Computes global minimum scalar multiplication parenthesization for sequential pipelines.',
        cyberUse: 'Cryptographic cipher transformation chaining and tensor fusion pipelining.',
      },
    ],
    M4: [
      {
        id: 'network-analysis',
        name: 'Network Flow & Min-Cut Suite',
        category: 'Max-Flow / Min-Cut',
        time: 'O(V · E²)',
        space: 'O(V + E)',
        description: 'Computes maximum network throughput and minimum capacity bottleneck cuts via Edmonds-Karp and Dinic.',
        cyberUse: 'DDoS bottleneck resilience and critical infrastructure vulnerability cut modeling.',
      },
    ],
    M5: [
      {
        id: 'sat',
        name: 'DPLL Boolean SAT Solver',
        category: 'Cook-Levin Core Intractability',
        time: 'NP-Complete (DPLL pruned)',
        space: 'O(n + m)',
        description: 'Davis-Putnam-Logemann-Loveland backtracking with unit propagation for 3-CNF formulas.',
        cyberUse: 'Formal software verification, exploit feasibility checks, and protocol reachability.',
      },
      {
        id: 'vertex-cover',
        name: 'Vertex Cover 2-Approximation',
        category: 'Maximal Matching Approximation',
        time: 'O(V + E)',
        space: 'O(V + E)',
        description: 'Polynomial time 2-approximation selecting endpoints of maximal edge matchings.',
        cyberUse: 'Optimal telemetry sensor placement and network choke-point quarantine.',
      },
    ],
    M6: [
      {
        id: 'miller-rabin',
        name: 'Miller-Rabin Primality Test',
        category: 'Monte Carlo Randomized Verification',
        time: 'O(k log³ n)',
        space: 'O(log n)',
        description: 'Randomized square root of unity test guaranteeing composite error probability ≤ 4⁻ᵏ.',
        cyberUse: 'Cryptographic prime keypair generation and ECC curve parameter validation.',
      },
      {
        id: 'randomized-quicksort',
        name: 'Randomized QuickSort',
        category: 'Las Vegas Pivot Sorting',
        time: 'Expected O(n log n)',
        space: 'O(log n)',
        description: 'Adversary-resistant sorting choosing uniform random pivots to prevent worst-case DoS attacks.',
        cyberUse: 'Router packet queue reordering and algorithmic complexity attack defense.',
      },
      {
        id: 'reservoir-sampling',
        name: 'Algorithm R Reservoir Sampling',
        category: 'Single-Pass Stream Sampling',
        time: 'O(N) single pass',
        space: 'O(k) fixed memory',
        description: 'Selects uniform random sample of size k from unbounded streams with exact k/N probability.',
        cyberUse: 'High-throughput packet sampling and unbiased SIEM telemetry auditing.',
      },
      {
        id: 'parallel-scan',
        name: 'Blelloch Parallel Prefix Scan',
        category: 'Work-Efficient Two-Pass Tree',
        time: 'Work O(n), Span O(log n)',
        space: 'O(n)',
        description: 'Two-pass parallel binary tree up-sweep and down-sweep computing prefix sums in logarithmic depth.',
        cyberUse: 'GPU stream filtering and high-speed line-rate packet indexing.',
      },
      {
        id: 'brents-theorem',
        name: "Brent's Scheduling Principle",
        category: 'Theoretical Multicore Bound',
        time: 'T_P ≤ (W - D)/P + D',
        space: 'O(1)',
        description: 'Formal scheduling upper bound quantifying parallel speedup and core allocation efficiency.',
        cyberUse: 'Hardware accelerator core budgeting and GPU thread warp allocation.',
      },
    ],
  };

  const renderWorkbench = () => {
    switch (selectedAlgo) {
      // M1
      case 'kmp':
        return <KmpWorkbench />;
      case 'z-function':
        return <ZFunctionWorkbench />;
      case 'rabin-karp':
        return <RabinKarpWorkbench />;
      case 'aho-corasick':
        return <AhoCorasickWorkbench />;
      // M2
      case 'suffix-array':
        return <SuffixArrayWorkbench />;
      case 'sa-is':
        return <SaIsWorkbench />;
      case 'lcp-kasai':
        return <LcpWorkbench />;
      case 'suffix-automaton':
        return <SuffixAutomatonWorkbench />;
      // M3
      case 'edit-distance':
        return <EditDistanceWorkbench />;
      case 'bitmask-dp':
        return <BitmaskDpWorkbench />;
      case 'matrix-chain':
        return <MatrixChainWorkbench />;
      // M4
      case 'network-analysis':
        navigate('/network-analysis');
        return null;
      // M5
      case 'sat':
        return <SatWorkbench />;
      case 'vertex-cover':
        return <VertexCoverWorkbench />;
      // M6
      case 'miller-rabin':
        return <MillerRabinWorkbench />;
      case 'randomized-quicksort':
        return <QuickSortWorkbench />;
      case 'reservoir-sampling':
        return <ReservoirWorkbench />;
      case 'parallel-scan':
        return <ParallelScanWorkbench />;
      case 'brents-theorem':
        return <BrentsTheoremWorkbench />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* If an algorithm is selected, render header with return button */}
      {selectedAlgo ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedAlgo(null)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a2744] px-3.5 py-2 text-xs font-semibold text-cyan-400 hover:bg-[#162244] border border-[#2a3a5c] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Catalogue</span>
            </button>

            {/* Quick Switch Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Jump to algorithm:</span>
              <select
                value={selectedAlgo}
                onChange={(e) => setSelectedAlgo(e.target.value)}
                className="rounded-lg bg-[#0d1526] px-3 py-1.5 text-xs font-mono text-cyan-300 border border-[#2a3a5c] focus:outline-none focus:border-cyan-500"
              >
                {Object.entries(algorithmCatalogue).flatMap(([mod, list]) =>
                  list.map((a) => (
                    <option key={a.id} value={a.id}>
                      [{mod}] {a.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {renderWorkbench()}
        </div>
      ) : (
        /* Catalogue View */
        <div className="space-y-6">
          {/* Header */}
          <div className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-6 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-wide">
                    Algorithm Analytics Laboratory
                  </h1>
                  <p className="text-xs text-slate-400">
                    Interactive algorithmic workbenches with mathematical execution trace & cybersecurity telemetry mapping
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-mono text-emerald-400 border border-emerald-500/20">
                  18 / 18 Workbenches Online
                </span>
              </div>
            </div>

            {/* Module Tabs */}
            <div className="mt-6 flex flex-wrap gap-2 border-t border-[#2a3a5c]/60 pt-4">
              {modules.map((mod) => {
                const Icon = mod.icon;
                const isActive = activeModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModule(mod.id)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-navy-900 shadow-md shadow-cyan-500/20'
                        : 'bg-[#0d1526] text-slate-300 hover:text-white border border-[#2a3a5c]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{mod.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Algorithm Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {(algorithmCatalogue[activeModule] || []).map((algo) => (
              <div
                key={algo.id}
                className="rounded-xl border border-[#2a3a5c] bg-[#1a2744] p-5 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-400">
                        {algo.category}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                        {algo.name}
                      </h3>
                    </div>
                    <StatusBadge status="IMPLEMENTED" size="sm" />
                  </div>

                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                    {algo.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono bg-[#0d1526] p-2.5 rounded-lg border border-[#2a3a5c]">
                    <div>
                      <span className="text-slate-400 text-[10px] block font-sans">Time Complexity</span>
                      <span className="text-cyan-300 font-bold">{algo.time}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block font-sans">Space Complexity</span>
                      <span className="text-slate-200">{algo.space}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-400">
                    <span className="text-amber-400 font-semibold font-mono">SOC Vector: </span>
                    {algo.cyberUse}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#2a3a5c]/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    ID: {algo.id}
                  </span>
                  <button
                    onClick={() => {
                      if (algo.id === 'network-analysis') {
                        navigate('/network-analysis');
                      } else {
                        setSelectedAlgo(algo.id);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-navy-900 border border-cyan-500/30 transition-all"
                  >
                    <span>Launch Workbench</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmLab;
