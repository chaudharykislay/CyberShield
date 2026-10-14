# CyberShield — Project Status & Integration Repair Report

**Last Updated:** 2026-10-14  
**Status:** 🟢 ALL MODULES (M1–M6) & DASHBOARD WORKBENCHES FULLY OPERATIONAL  

---

## 1. Executive Summary & Defect Inventory

The CyberShield Enterprise Security Analytics Platform was diagnosed and repaired to resolve API mismatches, runtime contract inconsistencies, and validation errors across all six DSA algorithm modules and auxiliary telemetry explorers.

| # | Component / Route | Symptom Observed | Root Cause | Fix Implemented | Verification Result |
|---|---|---|---|---|---|
| 1 | **Data Explorer** (`/data-explorer`) | `Telemetry Ingestion Error — An unexpected internal error occurred` (HTTP 500) | Column mismatch: JPA entity mapped `timestamp` while PostgreSQL schema defined `event_timestamp`. | Added `@Column(name = "event_timestamp", nullable = false)` in [`SecurityEvent.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/model/SecurityEvent.java). | HTTP 200 with 20 seeded database events; pagination and severity filtering (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) fully operational. |
| 2 | **Network Analysis** (`/network-analysis`) | `Analysis Failed — An unexpected internal error occurred` (HTTP 500) | Alphanumeric node IDs (`"S"`, `"A"`, `"T"`) sent where backend DTO expected 0-indexed integers. Missing min-cut dual partition mapping. | Added bidirectional node name $\leftrightarrow$ contiguous integer index mapping in [`NetworkAnalysis.tsx`](file:///d:/Sem4/dsa3/CyberShield/frontend/src/pages/NetworkAnalysis.tsx); chained min-cut endpoint; mapped bipartite pairs. | Edmonds-Karp, Dinic, Min-Cut dual partition ($S$/$T$), and Bipartite Matching verified. |
| 3 | **Algorithm Benchmarking** (`/benchmarking`) | `Analysis Failed — Request validation failed` (HTTP 400) | Request DTO required single algorithm parameters (`@NotBlank algorithmId`, `text`) when frontend submitted multi-algorithm module suites (`M1`–`M6`). | Updated [`BenchmarkRequest.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/dto/BenchmarkRequest.java), implemented `runModuleBenchmark` in [`BenchmarkService.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/service/BenchmarkService.java) with JVM warmup and repeated measurements. | Recharts bar charts render empirical nanosecond latencies across all modules M1–M6. |
| 4 | **M1 String Matching** (`/algorithm-lab`) | Result cards showed 0 matches in UI for KMP, Z-Function, Rabin-Karp | Frontend components expected `result.matches` and `result.lps`, whereas Java DTOs returned `matchPositions` and `lpsArray`. | Added getter aliases `getMatches()`, `getLps()`, `getBase()`, `getPrime()`, `getHashComparisons()` in [`KmpAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/strings/KmpAlgorithm.java), [`ZFunctionAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/strings/ZFunctionAlgorithm.java), [`RabinKarpAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/strings/RabinKarpAlgorithm.java), and [`AhoCorasickAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/strings/AhoCorasickAlgorithm.java). | Matches, LPS table, rolling hash parameters, and Aho-Corasick trie visualization render live backend results. |
| 5 | **M2 Suffix Structures** (`/algorithm-lab`) | Suffix tables unpopulated for SA-IS, LCP Kasai, Suffix Array | Result field naming differences (`suffixes` vs `sortedSuffixes`, `characterTypes` vs `typeArray`, missing `suffixArray` in `LcpResult`). | Added alias getters in [`SuffixArrayAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/suffix/SuffixArrayAlgorithm.java), [`SaisAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/suffix/SaisAlgorithm.java), [`LcpKasaiAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/suffix/LcpKasaiAlgorithm.java), and populated `result.setSuffixArray(sa)` in [`SuffixAlgorithmService.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/service/SuffixAlgorithmService.java). | Sorted suffix tables, S/L/LMS character type tags, and LCP paired index table render correctly. |
| 6 | **M3 Dynamic Programming** (`/algorithm-lab`) | Edit Distance and Matrix Chain displayed 0 scalar ops / empty matrices | Matrix Chain result had `minOperations`/`costTable` while UI expected `minScalarMultiplications`/`mTable`/`parenthesization`. Edit Distance had `dpMatrix`/`editScript` while UI expected `matrix`/`script`. | Added getter aliases in [`MatrixChainAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/dp/MatrixChainAlgorithm.java) and [`EditDistanceAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/dp/EditDistanceAlgorithm.java). Supported `costs` map in [`EditDistanceRequest.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/dto/EditDistanceRequest.java). | For dimensions `[10, 30, 5, 60, 20]`, min scalar mults = 8500, parenthesization = `((A1 x A2) x (A3 x A4))`, and heatmap cost table render seamlessly. |
| 7 | **M3 Bitmask DP** (`/algorithm-lab`) | Request validation error on `numPolicies` | UI sent `{ rules, requiredPolicies: [0, 1, 2, 3, 4] }` without `numPolicies`. | Updated [`BitmaskDpRequest.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/dto/BitmaskDpRequest.java) to dynamically infer `numPolicies` from rules and required policies. Added `getStatesExplored()` in [`BitmaskDpAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/dp/BitmaskDpAlgorithm.java). | Optimal rule subset selected, cost minimized, and explored states count displayed. |
| 8 | **M5 Vertex Cover Approximation** (`/algorithm-lab`) | Validation and contract failure | UI sent string node names (`A-B`, `Gateway-Router`) while backend expected `vertexCount` and integer edge index pairs. | In [`VertexCoverWorkbench.tsx`](file:///d:/Sem4/dsa3/CyberShield/frontend/src/pages/algorithms/VertexCoverWorkbench.tsx), added string $\leftrightarrow$ index mapping, called backend with integer edge pairs, and mapped resulting vertex cover indices back to node names for UI display. Added `getCoverSize()` in [`ReductionAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/np/ReductionAlgorithm.java). | Minimal vertex cover computed in $O(V + E)$ with $2.0 \times \text{OPT}$ guarantee; host sensor nodes highlighted. |
| 9 | **M6 Miller-Rabin Primality** (`/algorithm-lab`) | Validation error: `Number must be positive` | UI sent `{ n: "1000000007", rounds: 10 }` while DTO expected field `number`. UI expected `result.isPrime` and `result.rounds[].{ round, base, witnessFound }`. | In [`MillerRabinRequest.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/dto/MillerRabinRequest.java), added `@JsonAlias({"n", "candidateNumber"})` and object parser. In [`MillerRabinAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/randomized/MillerRabinAlgorithm.java), added `round`, `getBase()`, `isWitnessFound()`, and `getIsPrime()`. | Primality verified for primes and Carmichael numbers (e.g. 561 caught); round-by-round base witness table populated. |
| 10 | **M6 Randomized QuickSort** (`/algorithm-lab`) | UI showed 0 elements sorted, comparisons undefined | Result field mismatch: backend had `sorted` and `totalComparisons`, UI expected `sortedArray` and `comparisons`. | Added `getSortedArray()` and `getComparisons()` in [`RandomizedQuickSortAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/randomized/RandomizedQuickSortAlgorithm.java). | Sorted array, total comparison count, and Las Vegas pivot partition timeline displayed. |
| 11 | **M6 Reservoir Sampling** (`/algorithm-lab`) | Deserialization error: string tokens to integer list | UI sent string telemetry tokens (`SYN_001`, `PORT_002`) and `k`, while DTO expected integer stream and `reservoirSize`. UI expected `result.sample`. | Updated [`ReservoirSamplingRequest.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/dto/ReservoirSamplingRequest.java) to accept `List<String> stream` and `@JsonAlias({"k", "sampleSize"})`. Updated [`ReservoirSamplingAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/randomized/ReservoirSamplingAlgorithm.java) to handle generic streams and added `getSample()`. | Unbiased $k$-item sample drawn from streaming events in single pass with $k/N$ probability. |
| 12 | **M6 Brent's Scheduling Theorem** (`/algorithm-lab`) | Request validation error | UI sent `{ work, depth, processors }` while DTO expected `{ totalWork, criticalPathDepth, processorCount }`. | Added `@JsonAlias({"work", "totalWork"})`, `@JsonAlias({"depth", "criticalPathDepth"})`, `@JsonAlias({"processors", "processorCount"})` in [`BrentsTheoremRequest.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/dto/BrentsTheoremRequest.java). | Theoretical $T_P \le W/P + D$ scheduling bound, speedup curve, and core efficiency computed. |
| 13 | **M6 Parallel Prefix Scan** (`/algorithm-lab`) | UI showed empty prefix sum array | Backend result returned `result` and `parallelDepth`, UI expected `prefixSums`, `work`, `depth`. | Added `getPrefixSums()`, `getDepth()`, `getWork()` in [`ParallelScanAlgorithm.java`](file:///d:/Sem4/dsa3/CyberShield/backend/src/main/java/com/cybershield/algorithms/randomized/ParallelScanAlgorithm.java). | Blelloch upsweep/downsweep tree stages and prefix scan result array rendered. |

---

## 2. Test Execution & Observed Verification Results

### Automated Backend Tests (JUnit 5)
```text
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.cybershield.AhoCorasickAlgorithmTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.BitmaskDpAlgorithmTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.BrentsTheoremCalculatorTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.CyberShieldApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.EditDistanceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.KmpAlgorithmTest
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.LcpKasaiAlgorithmTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.MatrixChainTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.MaxFlowTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.MillerRabinAlgorithmTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.ParallelScanAlgorithmTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.RabinKarpAlgorithmTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.SaisAlgorithmTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.SatSolverAlgorithmTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.SuffixArrayTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.cybershield.ZFunctionAlgorithmTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] Results:
[INFO] Tests run: 44, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Frontend Production Build
```text
vite v6.4.4 building for production...
✓ 2424 modules transformed.
dist/index.html                   0.83 kB │ gzip:   0.46 kB
dist/assets/index-CmkRMZnG.css   34.42 kB │ gzip:   7.02 kB
dist/assets/index-DmXaTaU4.js   972.24 kB │ gzip: 274.56 kB
✓ built in 7.00s
```

### Live HTTP Integration Matrix
All 21 endpoints were tested directly against `http://localhost:8080/api/v1`:

| Endpoint / Capability | Payload Sample | Status | Output Verified |
|---|---|---|---|
| `GET /health` | None | `HTTP 200` | `{"database": "UP", "status": "UP", "version": "1.0.0"}` |
| `POST /algorithms/kmp` | `{ text, pattern }` | `SUCCESS` | Match index `[10]`, LPS array `[0,0,1,2,0,1,2,3,4]` |
| `POST /algorithms/z-function` | `{ text, pattern }` | `SUCCESS` | Match indices `[0, 8]`, Z-box precomputations |
| `POST /algorithms/rabin-karp` | `{ text, pattern }` | `SUCCESS` | Match index `[3]`, base 31, prime $10^9+7$, 0 spurious hits |
| `POST /algorithms/aho-corasick` | `{ text, patterns }` | `SUCCESS` | 4 matches found, Trie visualization nodes and failure links |
| `POST /algorithms/suffix-array` | `{ text, query }` | `SUCCESS` | Suffix array length 7, sorted suffixes list |
| `POST /algorithms/sa-is` | `{ text }` | `SUCCESS` | S/L/LMS type annotations, induced sorting order |
| `POST /algorithms/lcp-kasai` | `{ text }` | `SUCCESS` | Suffix array + Kasai LCP array populated |
| `POST /algorithms/suffix-automaton`| `{ text, query }` | `SUCCESS` | SAM minimal DFA states and transition links |
| `POST /algorithms/edit-distance` | `{ str1, str2, variant }` | `SUCCESS` | Levenshtein distance 3, $7 \times 8$ cost matrix, edit script |
| `POST /algorithms/matrix-chain` | `{ dimensions: [10,30,5,60,20] }` | `SUCCESS` | Min scalar mults: 8500, `((A1 x A2) x (A3 x A4))` |
| `POST /algorithms/bitmask-dp` | `{ rules, requiredPolicies }` | `SUCCESS` | Min cost security controls selected, explored states tracked |
| `POST /algorithms/max-flow` | 6 nodes, 9 edges, source 0, sink 5 | `SUCCESS` | Max flow = 23 (Edmonds-Karp / Dinic) |
| `POST /algorithms/min-cut` | 6 nodes, 9 edges | `SUCCESS` | Cut capacity = 23, Source: `[0,1,2,4]`, Sink: `[3,5]` |
| `POST /algorithms/bipartite-matching`| 4 analysts $\times$ 4 alerts | `SUCCESS` | Max matching = 4 pairs: `0->1, 1->0, 2->2, 3->3` |
| `POST /algorithms/sat` | 3 vars, 3 clauses | `SUCCESS` | Satisfiable = true, satisfying truth assignment |
| `POST /algorithms/vertex-cover` | 4 vertices, 4 edges | `SUCCESS` | 2-approximation maximal edge matching cover |
| `POST /algorithms/miller-rabin` | `{ n: "1000000007", rounds: 10 }` | `SUCCESS` | Probable prime, 10 random base checks |
| `POST /algorithms/randomized-quicksort`| 12 unsorted integers | `SUCCESS` | Verified sorted array, Las Vegas partition steps |
| `POST /algorithms/reservoir-sampling`| 5 string tokens, $k=3$ | `SUCCESS` | 3 unbiased uniform samples selected |
| `POST /algorithms/brents-theorem` | $W=10000, D=14, P=16$ | `SUCCESS` | Theoretical time $T_P \le 638$ steps, speedup $15.67\times$ |
| `POST /algorithms/parallel-scan` | 8 integers, `ADD` | `SUCCESS` | Exclusive prefix scan, upsweep/downsweep levels |
| `POST /algorithms/benchmark` | `{ module: "M1"..."M6" }` | `SUCCESS` | Empirical JVM nanosecond timing metrics with warmup |
| `GET /events` | `?severity=CRITICAL` | `HTTP 200` | Real PostgreSQL records, pagination, filtering |
| `GET /dashboard/overview` | None | `HTTP 200` | Total events: 20, signatures: 30, executions: 69+ |

---

## 3. Startup & Operating Instructions

All three services are configured and actively running:

### 1. PostgreSQL Database
- **Port:** `5432`  
- **Database:** `cybershield`  
- **Command:**
  ```powershell
  # Start PostgreSQL using your local data directory
  pg_ctl start -D "path/to/postgres/data" -w
  ```

### 2. Spring Boot Backend
- **Port:** `8080` (PID 956)  
- **Command:**
  ```powershell
  cd backend
  $env:DB_PASSWORD = "your_postgres_password"
  .\mvnw.cmd spring-boot:run
  ```

### 3. React Frontend
- **Port:** `5173` (PID 4384)  
- **Command:**
  ```powershell
  cd frontend
  npm run dev -- --host
  ```
