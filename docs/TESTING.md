# CyberShield Automated Testing & Quality Assurance Guide

This document details the testing architecture, validation methodology, and commands for reproducing the test results.

---

## 1. Test Architecture Overview

The testing suite validates all layers of the CyberShield platform:
- **Pure Java Algorithm Tests**: Independent unit tests for all DSA modules (M1–M6) without web server overhead.
- **Spring Boot Context & Integration Tests**: Validates entity mappings, HikariCP connection pooling, and REST controllers.
- **Frontend Type & Build Verification**: Strict TypeScript checking (`tsc -b`) and Vite production bundle generation.

---

## 2. Running Automated Tests

### Java Backend Unit Tests (JUnit 5)

Execute the full suite of 44 unit tests:

```powershell
cd backend
.\mvnw.cmd test
```

#### Run Specific Test Classes

```powershell
# Run only Module M1 (String Algorithms) tests
.\mvnw.cmd test -Dtest=KmpAlgorithmTest,ZFunctionAlgorithmTest,RabinKarpAlgorithmTest,AhoCorasickAlgorithmTest

# Run only Module M4 (Network Flow) tests
.\mvnw.cmd test -Dtest=MaxFlowTest

# Run only Module M5 (NP-Completeness) tests
.\mvnw.cmd test -Dtest=SatSolverAlgorithmTest
```

---

## 3. Test Coverage Matrix

| Test Suite | Module | Cases Tested | Validation Criteria |
|---|---|---|---|
| `KmpAlgorithmTest` | M1 | 7 | Exact LPS construction, overlapping occurrences (`"aa"` in `"aaaa"` $\to [0, 1, 2]$), empty pattern, single character, non-matching text |
| `ZFunctionAlgorithmTest` | M1 | 4 | Z-box boundary traversal, concatenation matching `$`, zero-match inputs |
| `RabinKarpAlgorithmTest` | M1 | 3 | Modulo arithmetic with negative numbers, hash collisions with character verification, spurious hit counting |
| `AhoCorasickAlgorithmTest` | M1 | 2 | Multi-pattern dictionary trie, BFS failure link loops, output link accumulation across sub-patterns |
| `SuffixArrayTest` | M2 | 3 | Lexicographical suffix order verification, binary search pattern queries |
| `SaisAlgorithmTest` | M2 | 2 | SA-IS induced sorting $O(n)$ verified against comparator sort baseline on `"banana"` and `"mississippi"` |
| `LcpKasaiAlgorithmTest` | M2 | 1 | Kasai $O(n)$ linear LCP calculation matching suffix array ordering |
| `EditDistanceTest` | M3 | 4 | Levenshtein matrix (`"kitten"` $\to$ `"sitting"` = 3), Damerau OSA transposition (`"CA"` $\to$ `"AC"` = 1), custom weighted penalties |
| `MatrixChainTest` | M3 | 3 | CLRS 6-matrix multiplication recurrence (verifies 15,125 optimal scalar ops), split table, parenthesization string |
| `BitmaskDpAlgorithmTest` | M3 | 1 | Minimum cost subset security rule coverage across $2^n$ state space |
| `MaxFlowTest` | M4 | 4 | Classic CLRS flow network verifying max flow 23 on Ford-Fulkerson, Edmonds-Karp, Dinic's, and Min-Cut partition |
| `SatSolverAlgorithmTest` | M5 | 3 | DPLL unit propagation, satisfying model assignment, refutation contradiction proof |
| `MillerRabinAlgorithmTest` | M6 | 2 | Prime verification (2, 3, 17, 97, 10007), composite detection, Carmichael number 561 |
| `ParallelScanAlgorithmTest` | M6 | 2 | Blelloch exclusive prefix scan tree: Up-Sweep reduction and Down-Sweep distribution |
| `BrentsTheoremCalculatorTest`| M6 | 2 | PRAM work-depth speedup estimation: $T_p \le (W - D)/p + D$ |
| `CyberShieldApplicationTests`| Full | 1 | Spring context initialization, bean wiring, datasource configuration |

**Total Tests**: 44 | **Pass Rate**: 100% | **Failures**: 0

---

## 4. Frontend Type Checking & Build Verification

The React + Vite frontend is verified using TypeScript compiler and Vite bundler:

```powershell
cd frontend
npm run build
```

This ensures:
1. All TypeScript components adhere strictly to defined types in `src/types/index.ts`.
2. No implicit `any` leaks or unresolved references.
3. Assets and CSS classes are fully bundled into `dist/`.

---

## 5. Live End-to-End Verification

With both servers running, verify integration via HTTP:

```powershell
# 1. Probe health check
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/health"

# 2. Test KMP string algorithm through the API
$body = '{"text": "ADMIN_SESSION_TOKEN_XYZ", "pattern": "SESSION"}'
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/algorithms/kmp" -Method Post -Body $body -ContentType "application/json"

# 3. Test SAT solver
$satBody = '{"numVariables": 2, "clauses": [[1, 2], [-1, 2]]}'
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/algorithms/sat" -Method Post -Body $satBody -ContentType "application/json"

# 4. Verify Vite frontend serves index.html
(Invoke-WebRequest -Uri "http://localhost:5173").StatusCode
```
