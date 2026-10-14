export interface AlgorithmResponse<T = any> {
  executionId: string;
  algorithmId: string;
  status: 'SUCCESS' | 'ERROR' | 'VALIDATION_ERROR';
  result: T;
  metrics: {
    executionTimeNanos: number;
    comparisonCount: number;
    inputSize: number;
  };
  trace: string[];
  warnings: string[];
  timestamp: string;
  error?: string;
}

export interface SecurityEvent {
  id: number;
  eventId: string;
  source: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: string;
  description: string;
  timestamp: string;
}

export interface ThreatSignature {
  id: number;
  signatureId: string;
  name: string;
  pattern: string;
  category: string;
  severity: string;
}

export interface AnalysisExecution {
  id: number;
  executionId: string;
  algorithmId: string;
  module: string;
  status: string;
  executionTimeNanos: number;
  comparisonCount: number;
  createdAt: string;
}

export interface Algorithm {
  id: string;
  name: string;
  module: string;
  co: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  endpoint: string;
  status: 'IMPLEMENTED' | 'PLANNED';
}

export interface DashboardOverview {
  totalEvents: number;
  totalSignatures: number;
  totalExecutions: number;
  backendStatus: 'UP' | 'DOWN' | 'DEGRADED';
  recentExecutions: AnalysisExecution[];
  moduleStats: {
    module: string;
    totalAlgorithms: number;
    implementedAlgorithms: number;
  }[];
}

// Algorithm Specific Result Types
export interface KmpResult {
  matches: number[];
  matchCount: number;
  lps: number[];
  pattern: string;
  text: string;
}

export interface ZFunctionResult {
  zArray: number[];
  matches: number[];
  matchCount: number;
  pattern?: string;
  text?: string;
}

export interface RabinKarpResult {
  matches: number[];
  matchCount: number;
  spuriousHits: number;
  hashComparisons: number;
  base: number;
  prime: number;
}

export interface AhoCorasickMatch {
  pattern: string;
  position: number;
  patternIndex?: number;
}

export interface AhoCorasickResult {
  matches: AhoCorasickMatch[];
  totalMatches: number;
  trieNodes?: {
    id: number;
    label: string;
    isWord: boolean;
    output?: string[];
  }[];
  trieEdges?: {
    source: number;
    target: number;
    char: string;
    isFailure?: boolean;
  }[];
}

export interface SuffixArrayResult {
  suffixArray: number[];
  suffixes?: string[];
  queryMatches?: number[];
  text: string;
}

export interface SaIsResult {
  suffixArray: number[];
  characterTypes?: ('S' | 'L' | 'LMS')[];
  lmsIndices?: number[];
  text: string;
}

export interface LcpResult {
  lcpArray: number[];
  suffixArray: number[];
  maxLcp?: number;
  text: string;
}

export interface SuffixAutomatonState {
  id: number;
  len: number;
  link: number;
  transitions: Record<string, number>;
  isClone?: boolean;
}

export interface SuffixAutomatonResult {
  stateCount: number;
  transitionCount: number;
  states: SuffixAutomatonState[];
  queryMatches?: boolean;
  longestCommonSubstring?: string;
}

export interface EditDistanceOperation {
  type: 'MATCH' | 'INSERT' | 'DELETE' | 'SUBSTITUTE' | 'TRANSPOSE';
  char1?: string;
  char2?: string;
  cost: number;
}

export interface EditDistanceResult {
  distance: number;
  matrix: number[][];
  str1: string;
  str2: string;
  operations?: EditDistanceOperation[];
  script: string[];
}

export interface BitmaskDpResult {
  minCost: number;
  selectedRuleIndices: number[];
  statesExplored: number;
  rulesApplied?: { id: number; name: string; cost: number; mask: string }[];
}

export interface MatrixChainResult {
  minScalarMultiplications: number;
  parenthesization: string;
  mTable: number[][];
  sTable: number[][];
  dimensions: number[];
}

export interface EdgeFlow {
  from: string;
  to: string;
  flow: number;
  capacity: number;
}

export interface MaxFlowResult {
  maxFlow: number;
  source: string;
  sink: string;
  edgeFlows: EdgeFlow[];
  minCut?: {
    sourcePartition: string[];
    sinkPartition: string[];
    cutCapacity: number;
  };
}

export interface BipartiteMatchingResult {
  maxMatchingSize: number;
  pairs: { u: string; v: string }[];
}

export interface SatResult {
  satisfiable: boolean;
  assignment: Record<string, boolean> | null;
  variableCount: number;
  clauseCount: number;
  unitPropagations?: number;
  decisionCount?: number;
}

export interface VertexCoverResult {
  coverSize: number;
  coverVertices: string[];
  approximationRatio: number;
  coveredEdges: [string, string][];
}

export interface MillerRabinRound {
  round: number;
  base: number;
  witnessFound: boolean;
}

export interface MillerRabinResult {
  number: number | string;
  isPrime: boolean;
  confidence: number;
  rounds: MillerRabinRound[];
}

export interface QuickSortResult {
  sortedArray: number[];
  comparisons: number;
  partitions: number;
  pivotChoices?: number[];
}

export interface ReservoirSamplingResult {
  sample: (string | number)[];
  streamSize: number;
  sampleSize: number;
  replacementEvents?: { item: string | number; index: number; replacedSlot: number }[];
}

export interface ParallelScanResult {
  input: number[];
  prefixSums: number[];
  upsweepTree?: { step: number; values: number[] }[];
  downsweepTree?: { step: number; values: number[] }[];
  work: number;
  depth: number;
}

export interface BrentsTheoremResult {
  work: number;
  depth: number;
  processors: number;
  theoreticalTime: number;
  speedup: number;
  efficiency: number;
}

export interface BenchmarkResult {
  algorithmId: string;
  algorithmName: string;
  inputSize: number;
  iterations: number;
  medianNanos: number;
  meanNanos: number;
  minNanos: number;
  maxNanos: number;
  memoryBytes?: number;
}
