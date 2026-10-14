# CyberShield Architecture Document

## System Overview

CyberShield is a layered full-stack web application:

```
Browser (React + Vite)
    ↕ HTTP/JSON REST at /api/v1
Spring Boot Backend (Java)
    ↕ JDBC / JPA
PostgreSQL Database
```

## Backend Layer Responsibilities

| Layer | Package | Responsibility |
|-------|---------|----------------|
| Controller | `com.cybershield.controller` | HTTP request/response only. Delegates to service. |
| Service | `com.cybershield.service` | Validation, orchestration, algorithm selection, persistence. |
| Algorithm | `com.cybershield.algorithms.*` | Pure DSA logic. No framework dependencies. Callable from JUnit. |
| DTO | `com.cybershield.dto` | Typed request/response objects. |
| Model | `com.cybershield.model` | JPA entities matching database tables. |
| Repository | `com.cybershield.repository` | Spring Data JPA interfaces. |
| Benchmark | `com.cybershield.benchmark` | Controlled measurement with JVM warmup. |
| Config | `com.cybershield.config` | CORS, OpenAPI, application configuration. |

## Algorithm Module Structure

### M1 — String Algorithms (package: `algorithms.strings`)
- `KmpAlgorithm` — KMP with LPS computation
- `ZFunctionAlgorithm` — Z-array with Z-box
- `RabinKarpAlgorithm` — Rolling hash with collision verification
- `AhoCorasickAlgorithm` — Trie + failure links + output sets

### M2 — Suffix Structures (package: `algorithms.suffix`)
- `SuffixArrayAlgorithm` — O(n log² n) comparator sort
- `SaisAlgorithm` — SA-IS induced sorting (linear time)
- `LcpKasaiAlgorithm` — Kasai O(n) LCP construction
- `SuffixAutomatonAlgorithm` — DAWG online construction

### M3 — Dynamic Programming (package: `algorithms.dp`)
- `EditDistanceAlgorithm` — Levenshtein + Damerau-OSA + Weighted
- `BitmaskDpAlgorithm` — Security rule activation optimization
- `MatrixChainAlgorithm` — Optimal multiplication ordering

### M4 — Network Flow (package: `algorithms.graph`)
- `MaxFlowAlgorithm` — Ford-Fulkerson (DFS augmentation)
- `EdmondsKarpAlgorithm` — BFS augmentation
- `DinicsAlgorithm` — Level graph + blocking flow
- `BipartiteMatchingAlgorithm` — Augmenting path matching
- `MinCutAlgorithm` — BFS residual reachability

### M5 — NP-Completeness (package: `algorithms.np`)
- `SatSolverAlgorithm` — DPLL/backtracking (≤20 variables)
- `ReductionAlgorithm` — 3-SAT→CLIQUE→IS→VC chain
- `VertexCoverApproximation` — Greedy 2-approximation

### M6 — Randomized (package: `algorithms.randomized`)
- `MillerRabinAlgorithm` — Modular exponentiation, configurable rounds
- `RandomizedQuickSortAlgorithm` — Random pivot, instrumented partitions
- `ReservoirSamplingAlgorithm` — Algorithm R, bounded state changes
- `ParallelScanAlgorithm` — Blelloch scan upsweep/downsweep
- `BrentsTheoremCalculator` — Theoretical work-depth model
- `MonteCarloExample` — Pi estimation (probabilistic result)
- `LasVegasExample` — Randomized QuickSort (always correct output)

## Common Response Envelope

```json
{
  "executionId": "uuid",
  "algorithmId": "kmp",
  "status": "SUCCESS | ERROR | VALIDATION_ERROR",
  "result": { /* algorithm-specific typed result */ },
  "metrics": {
    "executionTimeNanos": 0,
    "comparisonCount": 0,
    "inputSize": 0
  },
  "trace": ["step 1", "step 2"],
  "warnings": [],
  "timestamp": "ISO-8601",
  "error": null
}
```

## Security Constraints

| Constraint | Limit |
|-----------|-------|
| Text input max length | 10,000 characters |
| Pattern max length | 1,000 characters |
| Aho-Corasick patterns | Max 20 patterns |
| Graph nodes | Max 50 |
| Graph edges | Max 200 |
| SAT variables | Max 20 |
| Bitmask DP rules | Max 20 |
| Array size (QuickSort/Scan) | Max 1,000 elements |
| Reservoir size | Max 100 |
| Stream size | Max 10,000 elements |
| Trace entries | Max 500 per response |
| Benchmark iterations | Max 20 trials |

## Database Schema

```sql
security_events      -- Raw security log events (20 seeded samples)
threat_signatures    -- Known malware/attack patterns (15 seeded)
analysis_executions  -- Algorithm execution history
analysis_findings    -- Matches/findings from executions
benchmark_results    -- Benchmark measurement records
```

## Frontend Architecture

```
src/
├── App.tsx                    -- Router root
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx      -- Shell with sidebar + topbar + outlet
│   │   ├── Sidebar.tsx        -- Navigation with active states
│   │   └── TopBar.tsx         -- Health indicator + breadcrumb
│   └── ui/
│       ├── MetricCard.tsx
│       ├── StatusBadge.tsx
│       ├── TraceViewer.tsx
│       ├── AlgorithmPanel.tsx
│       ├── LoadingSpinner.tsx
│       ├── ErrorAlert.tsx
│       └── EmptyState.tsx
├── pages/
│   ├── Overview.tsx           -- Dashboard summary
│   ├── DataExplorer.tsx       -- Security event browser
│   ├── AlgorithmLab.tsx       -- Module tabs + workbench selector
│   ├── NetworkAnalysis.tsx    -- M4 graph editor + flow visualization
│   ├── Benchmarking.tsx       -- Benchmark runner + charts
│   ├── ExecutionHistory.tsx   -- Past execution browser
│   ├── Reports.tsx            -- Summary + export
│   ├── Settings.tsx           -- Config + health + about
│   └── algorithms/
│       ├── KmpWorkbench.tsx
│       ├── ZFunctionWorkbench.tsx
│       ├── RabinKarpWorkbench.tsx
│       ├── AhoCorasickWorkbench.tsx
│       ├── SuffixArrayWorkbench.tsx
│       ├── SaIsWorkbench.tsx
│       ├── LcpWorkbench.tsx
│       ├── SuffixAutomatonWorkbench.tsx
│       ├── EditDistanceWorkbench.tsx
│       ├── BitmaskDpWorkbench.tsx
│       ├── MatrixChainWorkbench.tsx
│       ├── SatWorkbench.tsx
│       ├── VertexCoverWorkbench.tsx
│       ├── MillerRabinWorkbench.tsx
│       ├── QuickSortWorkbench.tsx
│       ├── ReservoirWorkbench.tsx
│       ├── ParallelScanWorkbench.tsx
│       └── BrentsTheoremWorkbench.tsx
├── services/api.ts            -- Axios client + all endpoint functions
└── types/index.ts             -- TypeScript type definitions
```
