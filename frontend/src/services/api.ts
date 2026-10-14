import axios, { AxiosResponse } from 'axios';
import {
  AlgorithmResponse,
  DashboardOverview,
  SecurityEvent,
  AnalysisExecution,
  Algorithm,
  BenchmarkResult,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network / Server Error';
    return Promise.reject(new Error(message));
  }
);

// API functions
export const api = {
  // Health
  getHealth: (): Promise<AxiosResponse<{ status: string; uptime: number; timestamp: string }>> =>
    apiClient.get('/health'),

  // Dashboard
  getDashboardOverview: (): Promise<AxiosResponse<DashboardOverview>> =>
    apiClient.get('/dashboard/overview'),

  // Algorithms catalogue
  getAlgorithms: (): Promise<AxiosResponse<Algorithm[]>> =>
    apiClient.get('/algorithms'),

  // M1 String algorithms
  runKmp: (data: { text: string; pattern: string }): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/kmp', data),

  runZFunction: (data: { text: string; pattern: string }): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/z-function', data),

  runRabinKarp: (data: { text: string; pattern: string }): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/rabin-karp', data),

  runAhoCorasick: (data: { text: string; patterns: string[] }): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/aho-corasick', data),

  // M2 Suffix structures
  runSuffixArray: (data: { text: string; query?: string }): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/suffix-array', data),

  runSaIs: (data: { text: string }): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/sa-is', data),

  runLcpKasai: (data: { text: string }): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/lcp-kasai', data),

  runSuffixAutomaton: (data: { text: string; query?: string }): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/suffix-automaton', data),

  // M3 Dynamic Programming
  runEditDistance: (data: { str1: string; str2: string; variant: string; costs?: Record<string, number> }): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/edit-distance', data),

  runBitmaskDp: (data: { rules: any[]; requiredPolicies: number[] }): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/bitmask-dp', data),

  runMatrixChain: (data: { dimensions: number[] }): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/matrix-chain', data),

  // M4 Network Flow & Cuts
  runMaxFlow: (data: any): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/max-flow', data),

  runBipartiteMatching: (data: any): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/bipartite-matching', data),

  runMinCut: (data: any): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/min-cut', data),

  // M5 Intractability & Reductions
  runSat: (data: any): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/sat', data),

  runReductions: (data: any): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/reductions', data),

  runVertexCover: (data: any): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/vertex-cover', data),

  // M6 Randomized & Parallel
  runMillerRabin: (data: any): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/miller-rabin', data),

  runRandomizedQuickSort: (data: any): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/randomized-quicksort', data),

  runReservoirSampling: (data: any): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/reservoir-sampling', data),

  runParallelScan: (data: any): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/parallel-scan', data),

  runBrentsTheorem: (data: any): Promise<AxiosResponse<AlgorithmResponse>> =>
    apiClient.post('/algorithms/brents-theorem', data),

  // Events
  getEvents: (params?: any): Promise<AxiosResponse<{ content: SecurityEvent[]; totalElements: number; totalPages: number } | SecurityEvent[]>> =>
    apiClient.get('/events', { params }),

  getEvent: (id: string): Promise<AxiosResponse<SecurityEvent>> =>
    apiClient.get(`/events/${id}`),

  // Executions history
  getExecutions: (params?: any): Promise<AxiosResponse<{ content: AnalysisExecution[]; totalElements: number; totalPages: number } | AnalysisExecution[]>> =>
    apiClient.get('/executions', { params }),

  getExecution: (id: string): Promise<AxiosResponse<AnalysisExecution>> =>
    apiClient.get(`/executions/${id}`),

  // Benchmark
  runBenchmark: (data: any): Promise<AxiosResponse<BenchmarkResult[] | AlgorithmResponse>> =>
    apiClient.post('/algorithms/benchmark', data),

  getBenchmarks: (): Promise<AxiosResponse<BenchmarkResult[]>> =>
    apiClient.get('/benchmarks'),
};

export default api;
