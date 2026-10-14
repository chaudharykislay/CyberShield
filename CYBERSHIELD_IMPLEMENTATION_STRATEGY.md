# CyberShield — Complete Implementation Strategy
## Java DSA Engine + React Cybersecurity Analytics Dashboard

**Purpose:** This document is the single source of truth for building CyberShield as an integrated cybersecurity analytics application. It is intended to be placed in the project folder alongside the provided project-description image.

---

# Part I — Project Vision

## 1. What CyberShield must become

CyberShield is an educational, DSA-powered Enterprise Security Analytics Platform. It must be a real web application, not a collection of terminal programs and not a dashboard full of hardcoded demo outputs.

The application must allow a user to:

- Explore security events and sample datasets.
- Run the Data Structures and Algorithms (DSA) specified in the project brief.
- See actual Java algorithm results in the browser.
- Understand execution through suitable visualizations and bounded step-by-step traces.
- Compare algorithms using measured performance data.
- Inspect network graphs, search matches, DP tables, data structures, and randomized/parallel demonstrations.
- Save and revisit selected execution results.
- Understand what each result means in a cybersecurity context, including its limitations.

**Core principle:** Java executes the real algorithms. React presents their real outputs. Never fake algorithm execution or label hardcoded sample values as measured results.

The project description identifies six modules, M1–M6, aligned with CO1–CO6. Implement all listed algorithms or algorithm families in the brief. If a family contains multiple algorithms, track each implementation individually.

## 2. Source materials and working rules

The project folder will contain:
1. This strategy file.
2. An image of the CyberShield project description.

Before coding:
- Inspect the entire repository and all existing source files.
- Read this Markdown file completely.
- Read the provided image and extract the exact project scope, module names, algorithms, and course-outcome mapping.
- Preserve useful existing work where possible.
- Do not assume that a feature exists just because it is described here.
- Do not delete, replace, or restructure existing work without first understanding it.
- If the repository is empty, scaffold the project using the structure below.
- Keep a `PROJECT_STATUS.md` file updated with completed, in-progress, blocked, and not-yet-started work.
- If requirements conflict, identify the conflict in `PROJECT_STATUS.md` and prioritize the supplied project-description image for the official list of algorithms, while using this strategy for implementation architecture and user experience.

---

# Part II — Architecture and Technology

## 3. Recommended technology stack

### Frontend
- React with Vite.
- JavaScript or TypeScript; prefer TypeScript for a new project if setup remains straightforward.
- Tailwind CSS for styling.
- Recharts for metrics and benchmark charts.
- Cytoscape.js or React Flow for interactive graph visualizations.
- A reusable API client layer for communicating with the backend.
- Accessible controls, responsive layouts, loading states, empty states, and error states.

### Backend
- Java with Spring Boot.
- REST APIs returning JSON.
- Maven or Gradle, following the existing repository if one is already configured.
- Dedicated controller, service, algorithm, DTO, repository, and benchmark layers.
- JUnit 5 for automated tests.

### Persistence
- PostgreSQL for security events, saved execution metadata, findings, and benchmark history.
- Use environment variables for database credentials and configuration.
- Provide a documented local-development configuration. Do not commit secrets.
- If PostgreSQL is unavailable during initial development, support a clearly documented development profile only if it does not hide integration failures. The final acceptance target still includes PostgreSQL integration.

### API documentation
- SpringDoc / OpenAPI, if compatible with the selected Spring Boot version.
- Document request schemas, response schemas, validation rules, and error responses.

## 4. High-level architecture

```text
User
  |
  v
React + Vite dashboard
  |  REST / JSON
  v
Spring Boot REST API
  |
  +--> Security event services
  +--> M1 String algorithms
  +--> M2 Suffix structures
  +--> M3 Dynamic programming
  +--> M4 Network flow and matching
  +--> M5 SAT, reductions and approximation
  +--> M6 Randomized and parallel algorithms
  +--> Execution tracing and visualization DTOs
  +--> Benchmarking
  |
  v
PostgreSQL
```

The algorithm engine must remain in Java. Do not implement the required DSA in frontend JavaScript or delegate the algorithms to Python. The frontend may transform returned data for display, but the algorithm result must originate from Java.

## 5. Suggested repository structure

Adapt this to the existing project instead of blindly overwriting it.

```text
cybershield/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── modules/
│   │   │   ├── string-algorithms/
│   │   │   ├── suffix-structures/
│   │   │   ├── dynamic-programming/
│   │   │   ├── network-flow/
│   │   │   ├── np-completeness/
│   │   │   └── randomized-parallel/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── charts/
│   │   └── types/
│   ├── package.json
│   └── README.md
├── backend/
│   ├── src/main/java/com/cybershield/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── algorithms/
│   │   │   ├── strings/
│   │   │   ├── suffix/
│   │   │   ├── dynamicprogramming/
│   │   │   ├── graph/
│   │   │   ├── approximation/
│   │   │   └── randomized/
│   │   ├── benchmark/
│   │   ├── visualization/
│   │   ├── dto/
│   │   ├── model/
│   │   └── repository/
│   ├── src/test/java/com/cybershield/
│   ├── pom.xml
│   └── README.md
├── database/
│   └── (migration scripts or initialization files)
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── TESTING.md
├── PROJECT_STATUS.md
├── docker-compose.yml                 # Optional, if useful and correctly configured
└── README.md
```

Use package names and folder conventions consistent with the actual repository if it already exists.

---

# Part III — User Experience and Dashboard

## 6. Visual design direction

Build a professional Security Operations Center (SOC) interface. Aim for an enterprise product, not a generic admin template.

### Design system
- Dark navy / charcoal background.
- Slate or blue-gray panels.
- Restrained cyan and teal accents for selected states and important data.
- Red or amber only for meaningful severity or warning states.
- Strong visual hierarchy and readable typography.
- Clear spacing and consistent component sizing.
- Subtle borders and restrained shadows; avoid excessive neon glow.
- Use icons consistently and provide labels where icons alone are ambiguous.
- Use monospace styling for technical values such as hashes, event IDs, IP addresses, and algorithm identifiers.
- Ensure accessible contrast, keyboard navigation, visible focus states, and responsive behavior.
- Avoid clutter, giant empty cards, unnecessary animations, and decorative charts that do not communicate useful information.

### Reference image
Use the image in the project folder as the official source for the project’s scope. If it is also a visual reference, inspect it and incorporate relevant visual ideas without copying unrelated content. The image may be a project specification rather than a UI screenshot, so do not assume it defines the exact visual theme.

## 7. Main application navigation

Create a persistent sidebar, a top status bar, and a main content area.

Recommended pages:

1. **Security Overview**
   - Total events processed.
   - Suspicious matches/findings.
   - Recent analysis executions.
   - Network-analysis summary.
   - Algorithm execution and performance summaries.
   - System and backend health.
   - Recent activity with links to details.

2. **Security Data Explorer**
   - Upload supported CSV/text logs with validation and file-size limits.
   - Browse seeded sample events.
   - Search and filter event records.
   - Inspect event details.
   - Choose a dataset as input to supported algorithms.
   - Clearly label simulated/sample data.

3. **DSA Algorithm Laboratory**
   - Six module categories, M1–M6.
   - Searchable algorithm catalogue.
   - Algorithm explanation, pseudocode, complexity, and input form.
   - Run, reset, and step-through controls where supported.
   - Real output, intermediate state, and performance metrics.
   - Contextual explanation of the cybersecurity use case.

4. **Network Analysis**
   - Interactive node-edge graph editor.
   - Node and edge details.
   - Capacities and residual capacities.
   - Maximum-flow and minimum-cut views.
   - Bipartite analyst-alert assignment visualization.
   - Explain graph direction and capacity semantics.

5. **Algorithm Benchmarking**
   - Compare supported algorithms on identical compatible inputs.
   - Show measured runtime, operation counts where instrumented, input size, and memory measurements only when reliably measured.
   - Use charts with clear units and labels.
   - Explain JVM warm-up and measurement limitations.
   - Distinguish theoretical complexity from measured performance.

6. **Execution History**
   - List saved executions.
   - Filter by module, algorithm, status, and date.
   - View input summary, output, metrics, and bounded trace.
   - Allow exports of results where appropriate.

7. **Reports**
   - Summarize findings and algorithm outputs.
   - Export CSV or JSON where appropriate.
   - Provide a print-friendly report or PDF only if implemented and tested.

8. **Settings / About**
   - Backend health.
   - API and database status where safely available.
   - Dataset/sample-data explanation.
   - Version and project information.
   - Configuration must not reveal secrets.

## 8. Common algorithm workbench layout

All algorithm pages should share a common visual pattern, but use algorithm-specific visualizations.

Each workbench should include:
- Algorithm name and module/CO mapping.
- Plain-language purpose.
- Cybersecurity use case and limitations.
- Time and space complexity.
- Input form with validation.
- Optional sample input.
- Run and reset buttons.
- Step-through controls if an execution trace is supported.
- A visualization appropriate to the algorithm.
- Actual output.
- Metrics generated by the backend.
- A bounded execution trace.
- Input-size limits and clear error messages.
- Option to save the execution if persistence is supported.

Do not force every algorithm into the same chart type. Use:
- Highlighted strings and pointers for string matching.
- Trie/failure-link views for Aho–Corasick.
- Suffix arrays, suffix indices, and LCP tables for suffix structures.
- DP matrices and selected transitions for dynamic programming.
- Residual graphs and flow labels for network-flow algorithms.
- Formula/graph transformation views for NP-completeness reductions.
- Partition trees for randomized QuickSort.
- Sample-state views for Reservoir Sampling.
- Work-depth diagrams for parallel algorithms.

---

# Part IV — Complete DSA Scope

Implement every item below as required by the supplied project brief. Track sub-algorithms individually. Do not silently omit a listed algorithm. If an item is too complex to complete in one pass, implement it in a planned phase and record its status rather than substituting a fake result.

## 9. M1 — String Algorithms (CO1)

### KMP
- Implement prefix/LPS preprocessing.
- Search for one pattern in text.
- Return all match start indices, including correct overlap behavior.
- Provide a trace of comparisons and fallback transitions.
- Visualize pattern and text pointers.

### Z-Function
- Build the Z-array correctly.
- Explain the Z-box and index transitions.
- Support a documented pattern-search formulation.
- Return matching positions and bounded trace data.

### Rabin–Karp
- Implement rolling hash and hash updates correctly.
- Compare the hash first, then verify actual characters on hash matches.
- Handle negative modulo values correctly.
- Document hash/base/modulus choices.
- Show hash values, collisions, and verification steps.

### Aho–Corasick
- Build a trie of multiple patterns.
- Build failure links and output links/sets.
- Search text for multiple signatures in one pass.
- Return pattern IDs/names and positions.
- Visualize trie transitions and failure links.

## 10. M2 — Suffix Structures (CO2)

### Suffix Array
- Construct and return suffix indices in sorted order.
- Explain suffix order and index conventions.
- Support substring-search queries where implemented.
- Avoid an inefficient comparator-based implementation being presented as a linear-time algorithm.

### SA-IS
- Implement induced sorting as a real SA-IS algorithm.
- Test edge cases, repeated characters, small strings, and supported character ranges.
- Document alphabet normalization and sentinel conventions.
- Provide complexity claims only when justified by the implementation.

### LCP / Kasai
- Construct the LCP array from text and suffix array.
- Explain the relationship between adjacent suffixes.
- Visualize suffix indices and LCP values.

### Suffix Tree / Suffix Automaton
- Implement both structures as separate options.
- Support documented substring/pattern queries.
- Visualize nodes/transitions where practical.
- If a full suffix tree is staged after the core modules, state this clearly in project status. Do not represent the suffix automaton as a suffix tree.

## 11. M3 — Advanced Dynamic Programming (CO3)

### Levenshtein Distance
- Compute insertion, deletion, and substitution distance.
- Return the DP matrix and an optional edit script.

### Damerau–Levenshtein Distance
- Implement a correctly defined variant, such as optimal string alignment or unrestricted Damerau–Levenshtein.
- Label the chosen variant accurately; they are not interchangeable.

### Weighted Edit Distance
- Support configurable operation costs with validation.
- Return the cost matrix and selected transformation.

### Bitmask DP
- Define an explicit supported problem such as minimum-cost rule selection or a small set-cover instance.
- Document state representation, transition, and complexity.
- Validate the input-size limit because exponential growth is expected.

### Matrix-Chain Multiplication
- Calculate the optimal multiplication cost.
- Return the cost table and split table.
- Display the optimal parenthesization.
- Clearly distinguish scalar multiplication cost from actual matrix multiplication.

## 12. M4 — Network Flow (CO4)

### Ford–Fulkerson
- Implement augmenting paths and residual capacities.
- Use an appropriate supported capacity type.
- Clearly state assumptions, including the implications of integer capacities and path-selection strategy.
- Return flow and trace.

### Edmonds–Karp
- Use BFS to find augmenting paths.
- Return path sequence, bottleneck, residual graph changes, and final maximum flow.

### Dinic's Algorithm
- Build level graphs with BFS.
- Compute blocking flows using a correctly implemented DFS/current-edge strategy.
- Return phase-by-phase flow and residual state.

### Bipartite Matching
- Model left/right partitions explicitly.
- Return assignments and unmatched vertices.
- Support an example such as alerts matched to available analysts.
- Do not imply that matching alone provides optimal analyst skill or workload assignment unless those weights/constraints are modeled.

### Min-Cut
- Return the cut partition and crossing edges.
- Display the cut capacity.
- Validate the maximum-flow/minimum-cut relationship on supported test graphs.

## 13. M5 — NP-Completeness and Approximation (CO5)

### SAT / 3-SAT
- Provide a clear literal/clause input model.
- Implement a documented educational solver or a supported exact method.
- Return SAT/UNSAT and a satisfying assignment when one exists.
- Apply explicit limits to exhaustive search.
- Never claim that a heuristic failure proves UNSAT.

### 3-SAT → CLIQUE
- Implement the documented reduction from a 3-SAT instance to a graph.
- Explain literal vertices, conflict edges, and the target clique size.
- Visualize the generated graph.
- Test the relationship between satisfying assignments and target-size cliques.

### CLIQUE → INDEPENDENT SET
- Construct the complement graph using a clearly defined vertex set.
- Explain and test the relationship between clique and independent-set sizes.

### INDEPENDENT SET → VERTEX COVER
- Implement the complement relationship for the same graph.
- Show the selected independent set and corresponding vertex cover.
- Validate the edge-covering property.

### Vertex-Cover 2-Approximation
- Implement the standard edge-picking approximation with its stated assumptions.
- Return selected vertices and covered edges.
- Compare with an exact optimum only for small graphs where an exact answer is feasible.
- Clearly label the result as approximate and show the approximation ratio guarantee where applicable.

## 14. M6 — Randomized and Parallel Algorithms (CO6)

### Las Vegas and Monte Carlo
- Provide concrete, documented examples of each type.
- Explain which property is always correct and which property is probabilistic.
- Do not treat these as single universal algorithms; the dashboard must name the actual implementation being demonstrated.

### Miller–Rabin
- Implement modular exponentiation and the Miller–Rabin test.
- Support configurable rounds or bases where appropriate.
- Explain probable-prime semantics and deterministic base guarantees for explicitly supported integer ranges.
- Use safe integer arithmetic; avoid overflow-prone naive multiplication.

### Randomized QuickSort
- Implement randomized pivot selection.
- Instrument comparisons/swaps or partitions where practical.
- Support deterministic random seeds for repeatable demonstrations.
- Display partition steps without generating unbounded trace data.

### Reservoir Sampling
- Implement sampling from a stream with a fixed reservoir size.
- Support a reproducible seed where appropriate.
- Show how the reservoir changes as events arrive.
- Do not store the entire stream merely to claim bounded-memory sampling.

### Blelloch Scan / Parallel Reduce
- Implement a correct scan/reduction demonstration with clearly defined inputs and semantics.
- Visualize upsweep and downsweep stages for Blelloch scan.
- Explain inclusive/exclusive scan behavior.
- Distinguish a conceptual parallel visualization from genuinely concurrent execution.
- If actual concurrency is implemented, document its execution model.

### Brent's Theorem
- Provide an educational work-depth model.
- Show work, critical-path depth, processor count, and theoretical bounds using a clearly stated formula.
- Label computed values as theoretical estimates, not measured speedups.

---

# Part V — Backend Contracts and Data

## 15. Java architecture rules

Keep these responsibilities separate:
- **Controller:** HTTP request/response handling only.
- **Service:** validation orchestration, algorithm selection, and application logic.
- **Algorithm implementation:** core DSA logic without web-framework dependencies.
- **DTO:** explicit request and response structures.
- **Repository:** database access.
- **Benchmark service:** controlled measurement and reporting.
- **Trace/visualization model:** bounded, serializable intermediate states.
- **Configuration:** CORS, database, environment, and application settings.

Algorithms should be callable from JUnit tests without starting the web server.

Use interfaces or a registry for algorithm discovery where that makes the system simpler. Avoid building a complicated plugin framework unless it is justified.

## 16. REST API conventions

Use a versioned base path `/api/v1`.

Suggested endpoints (adapt names consistently if the repository already defines an API):

```text
GET    /api/v1/health
GET    /api/v1/dashboard/overview
GET    /api/v1/algorithms
GET    /api/v1/algorithms/{algorithmId}

POST   /api/v1/algorithms/kmp
POST   /api/v1/algorithms/z-function
POST   /api/v1/algorithms/rabin-karp
POST   /api/v1/algorithms/aho-corasick
POST   /api/v1/algorithms/suffix-array
POST   /api/v1/algorithms/sa-is
POST   /api/v1/algorithms/lcp-kasai
POST   /api/v1/algorithms/edit-distance
POST   /api/v1/algorithms/bitmask-dp
POST   /api/v1/algorithms/matrix-chain
POST   /api/v1/algorithms/max-flow
POST   /api/v1/algorithms/bipartite-matching
POST   /api/v1/algorithms/min-cut
POST   /api/v1/algorithms/sat
POST   /api/v1/algorithms/vertex-cover
POST   /api/v1/algorithms/randomized-quicksort
POST   /api/v1/algorithms/reservoir-sampling
POST   /api/v1/algorithms/parallel-scan
POST   /api/v1/algorithms/benchmark

POST   /api/v1/events
POST   /api/v1/events/upload
POST   /api/v1/events/analyze

GET    /api/v1/executions
GET    /api/v1/executions/{executionId}
GET    /api/v1/benchmarks
```

Create corresponding endpoints for every implemented algorithm. Do not leave catalogue entries pointing to nonexistent routes. If an algorithm is not yet implemented, mark it clearly as unavailable or in development and do not let the UI imply it ran successfully.

### Example common response

```json
{
  "executionId": "server-generated-id",
  "algorithmId": "kmp",
  "status": "SUCCESS",
  "result": {
    "matchPositions": [0, 12]
  },
  "metrics": {
    "executionTimeNanos": 0,
    "comparisonCount": 0,
    "inputSize": 0
  },
  "trace": [],
  "warnings": []
}
```

This is a schema example. Actual IDs, values, metrics, and traces must be generated by the application. Do not hardcode the example numbers as output.

Return clear HTTP status codes and a consistent error structure for invalid inputs, unsupported operations, oversized payloads, and internal failures. Do not leak stack traces or secrets to the browser.

## 17. Shared algorithm result model

Design a common result envelope containing:
- Execution ID.
- Algorithm ID and version if useful.
- Status.
- Algorithm-specific result.
- Input-size metadata.
- Measured runtime and instrumented operation counts when supported.
- Optional bounded trace.
- Warnings and validation information.
- Timestamp.
- Optional persistence reference.

The algorithm-specific result should be strongly typed where practical. Do not force every result into a single ambiguous string.

Distinguish:
- `executionTimeNanos`: measured elapsed time, not a theoretical complexity.
- `comparisonCount` or other counters: instrumented algorithm operations, not wall-clock time.
- Memory usage: only include it when measured using a documented and defensible method.
- Complexity: theoretical analysis attached to algorithm metadata.
- Trace: explanatory intermediate states, potentially truncated under an explicit limit.

## 18. Database model

Use PostgreSQL for persistent records such as:
- `security_events`
- `threat_signatures`
- `analysis_executions`
- `analysis_findings`
- `benchmark_results`
- `saved_datasets`

Define appropriate keys, timestamps, indexes, and relationships. Add database migrations or reproducible initialization scripts. Avoid storing large arrays or enormous traces in ordinary relational rows without a reason. Bound and summarize stored traces.

If uploaded files are retained, use safe storage practices and store metadata/reference information rather than trusting a client-supplied path.

## 19. Event and threat-analysis workflow

Create a clear, modestly scoped initial workflow:
1. Ingest sample or uploaded supported log records.
2. Validate the format and required fields.
3. Normalize event records without losing original evidence.
4. Allow a user to select one or more signatures/patterns.
5. Execute the relevant Java algorithms.
6. Store or return matches with source-record references.
7. Show evidence, context, and algorithm metrics in the dashboard.
8. Allow the analyst to inspect the original event.

Do not label an event malicious solely because it contains a matching string. Findings should say what was matched and why it may matter. Do not claim production-grade detection, real-time monitoring, or complete SIEM capabilities unless those functions are actually implemented and tested.

---

# Part VI — Benchmarking, Tests, and Safety

## 20. Benchmarking requirements

- Run algorithms on identical compatible inputs when comparing them.
- Validate outputs before comparing performance.
- Use JVM warm-up and repeated trials.
- Report the measurement method and units.
- Prefer median and spread/distribution to a single unexplained measurement.
- Keep setup, input generation, logging, and trace generation out of the timed region where appropriate.
- Do not compare timings from fundamentally different inputs as if they were equivalent.
- Avoid overly small measurements that are dominated by timer noise.
- Use deterministic seeds for repeatability when applicable.
- Distinguish measured results from theoretical complexity.
- If benchmarking is too small or noisy to be meaningful, explain that in the UI.

## 21. Testing requirements

Use JUnit 5 for backend tests and the existing frontend test framework if one exists.

For every algorithm, test:
- Typical successful input.
- Empty input where supported.
- Single-element or minimum-size input.
- Repeated characters/values.
- No-match/no-solution cases.
- Multiple matches and overlapping matches where applicable.
- Invalid input and documented input limits.
- Boundary cases for numeric operations.
- Regression cases for previously discovered bugs.

For graph algorithms, include disconnected graphs, zero-capacity edges where supported, cycles, multiple maximum flows, and empty/small graphs.

For randomized algorithms, test invariants and distributional properties appropriately; do not require one random run to produce one predetermined answer unless a seed fixes the run.

For API integration:
- Test validation errors.
- Test actual backend execution.
- Test result serialization.
- Test database persistence where applicable.
- Test CORS and frontend connectivity in the local setup.

## 22. Security and resource limits

- Treat log files and all user input as untrusted.
- Never execute commands or scripts found in logs.
- Never render raw log content as trusted HTML.
- Set upload size and text-length limits.
- Set graph node/edge limits.
- Set exponential algorithm input limits.
- Bound execution traces and returned payload sizes.
- Add request timeouts or cancellation where appropriate.
- Do not expose secrets, stack traces, absolute paths, or database credentials.
- Do not expose arbitrary filesystem reads or writes through an API.
- Avoid unbounded memory use in sampling and visualization.
- Clearly label synthetic datasets and simulated events.

---

# Part VII — Phased Execution Plan

## 23. Build in working, testable milestones

### Phase 0 — Repository reconnaissance
- Inspect all files and the supplied project-description image.
- Identify current frameworks, entry points, scripts, and existing implementations.
- Produce a repository assessment and `PROJECT_STATUS.md`.
- Make no destructive changes before understanding the repository.

### Phase 1 — Foundation
- Establish or repair frontend and backend projects.
- Build the shared application shell, sidebar, top bar, routing, and visual design system.
- Configure Spring Boot, API conventions, health endpoint, and database connection.
- Add a reusable frontend API client.
- Verify frontend-to-backend communication.

### Phase 2 — M1 vertical slice
- Implement and test KMP first.
- Connect it to the API.
- Display real output, matches, trace, and metrics.
- Use it as the reference implementation for later algorithm work.
- Then implement Z-Function, Rabin–Karp, and Aho–Corasick.

### Phase 3 — M2 and M3
- Implement suffix structures and dynamic-programming algorithms.
- Add data-structure-specific visualizations.
- Validate against reference examples and tests.

### Phase 4 — M4
- Implement graph model and graph editor.
- Add flow algorithms, matching, residual graph views, and min-cut visualization.
- Verify graph invariants and results.

### Phase 5 — M5
- Implement SAT/3-SAT, reductions, and vertex-cover approximation.
- Make exact/approximate/heuristic distinctions explicit.
- Add educational graph transformations and small-instance limits.

### Phase 6 — M6
- Implement randomized algorithms, sampling, scan/reduce, and work-depth demonstrations.
- Verify reproducibility, correctness properties, and stated limitations.

### Phase 7 — Integration and reporting
- Complete the overview, explorer, history, reports, and benchmark views.
- Connect all implemented algorithms through the shared API client.
- Ensure that all displayed values originate from real backend results or are explicitly labeled static reference data.

### Phase 8 — End-to-end verification
- Run backend unit tests and frontend checks.
- Build the frontend and backend.
- Test each implemented algorithm through the browser and API.
- Verify persistence and error states.
- Fix integration issues and document any outstanding limitations.

Do not mark a phase complete merely because files have been created. Mark it complete only when its acceptance criteria have been tested.

## 24. Definition of done

The project is ready for demonstration when:
- The frontend and Java backend start using documented commands.
- PostgreSQL integration works in the documented configuration.
- Every listed algorithm has an explicit implementation status.
- Implemented algorithms run through the UI and API.
- Outputs match tested algorithm behavior.
- Visualizations show actual returned data.
- Execution traces are bounded and accurate.
- Benchmark methods and metrics are documented.
- History and reports work for supported data.
- Error, empty, and loading states are handled.
- No fake successful execution is shown for unimplemented algorithms.
- A new developer can follow the README to run the application.
- `PROJECT_STATUS.md` lists remaining limitations honestly.

---

# Part VIII — Instructions for Antigravity

## 25. Antigravity master prompt

Copy the prompt below into Antigravity while the project folder containing this Markdown file and the supplied project-description image is open.

---

You are the lead software architect, senior Java/Spring Boot engineer, React frontend engineer, DSA specialist, test engineer, and UI/UX designer responsible for implementing **CyberShield — Enterprise Security Analytics Platform**.

### Mission

Build a complete, professional, working web application that implements the DSA algorithms specified in the supplied CyberShield project-description image. The Java backend must execute the algorithms. The React dashboard must let users understand, visualize, run, and evaluate them.

This is not a request for a static mockup, a terminal-only collection of Java programs, or a frontend with hardcoded outputs. Deliver an integrated application.

### Required first actions

1. Inspect the entire project folder and existing repository before modifying anything.
2. Read `CYBERSHIELD_IMPLEMENTATION_STRATEGY.md` completely.
3. Open and inspect the supplied CyberShield project-description image. Extract and verify the exact M1–M6 algorithm list and CO mapping.
4. Inspect existing package files, source code, environment configuration, tests, and run scripts.
5. Identify what is already working and what is missing.
6. Create or update `PROJECT_STATUS.md` with:
   - Existing project state.
   - Planned architecture.
   - Module-by-module implementation checklist.
   - Current phase.
   - Tests executed and their outcomes.
   - Blockers and known limitations.
7. Do not overwrite useful work or perform destructive refactoring before understanding the repository.
8. If a framework or dependency is already configured correctly, preserve it unless there is a concrete technical reason to change it.

### Required technology

Use:
- Java and Spring Boot for the backend.
- Real Java implementations for the DSA algorithms.
- React with Vite for the frontend.
- Tailwind CSS or the existing compatible styling system.
- PostgreSQL for persistent records.
- Recharts for analytical charts.
- Cytoscape.js or React Flow for interactive graph views.
- JUnit 5 for Java tests.
- REST APIs returning JSON.

Adapt these choices to the repository where appropriate, and document any necessary deviation. Do not use Python as the DSA backend. Do not move algorithm logic into React.

### Required DSA scope

Implement and track every item in the project brief:

**M1 — String Algorithms**
- KMP
- Z-Function
- Rabin–Karp
- Aho–Corasick

**M2 — Suffix Structures**
- Suffix Array
- SA-IS
- LCP/Kasai
- Suffix Tree
- Suffix Automaton

**M3 — Advanced Dynamic Programming**
- Levenshtein Distance
- Damerau–Levenshtein Distance
- Weighted Edit Distance
- Bitmask DP for a clearly defined security-related optimization problem
- Matrix-Chain Multiplication

**M4 — Network Flow**
- Ford–Fulkerson
- Edmonds–Karp
- Dinic's algorithm
- Bipartite Matching
- Min-Cut

**M5 — NP-Completeness and Approximation**
- SAT/3-SAT
- 3-SAT to CLIQUE reduction
- CLIQUE to INDEPENDENT SET reduction
- INDEPENDENT SET to VERTEX-COVER relationship/reduction
- Vertex-Cover 2-approximation

**M6 — Randomized and Parallel Algorithms**
- Las Vegas and Monte Carlo examples with clearly named concrete algorithms
- Miller–Rabin
- Randomized QuickSort
- Reservoir Sampling
- Blelloch Scan/Parallel Reduce
- Brent's theorem work-depth demonstration

Do not silently omit an item. Maintain an individual implementation status for each algorithm. If the full scope cannot be completed in one pass, implement in milestones, keep the application runnable, and report precisely what is done and what remains. Never fake a completed feature.

### Dashboard requirements

Build a polished, responsive, enterprise SOC interface with:
- Dark navy/charcoal background.
- Slate or blue-gray panels.
- Restrained cyan/teal accents.
- Red/amber only for meaningful warnings and severity.
- Clear typography, strong hierarchy, consistent spacing, accessible contrast, and useful empty/loading/error states.
- Persistent sidebar, top status bar, and central content area.
- No excessive neon effects, unnecessary decorative graphics, generic filler cards, or meaningless charts.

Provide the following routes/pages:
1. Security Overview.
2. Security Data Explorer.
3. DSA Algorithm Laboratory.
4. Network Analysis.
5. Algorithm Benchmarking.
6. Execution History.
7. Reports.
8. Settings/About.

Every algorithm must have an appropriate workbench containing:
- Description and cybersecurity application.
- Time and space complexity.
- Validated input controls.
- Run/reset controls.
- Step-through execution where a meaningful trace exists.
- A visualization specific to the algorithm.
- Actual result from the Java backend.
- Measured metrics and operation counters when supported.
- Edge-case/error handling.
- An explanation of result limitations.

Examples of visualizations:
- KMP: text/pattern pointers and LPS array.
- Aho–Corasick: trie, transitions, and failure links.
- Suffix structures: suffix indices, LCP table, and structure visualization.
- Dynamic programming: DP matrix, selected transitions, and solution reconstruction.
- Network flow: nodes, capacities, augmenting paths, residual graph, and minimum cut.
- SAT/reductions: clauses, graph transformation, assignments, and solution verification.
- Randomized QuickSort: pivot and partition steps.
- Reservoir Sampling: bounded reservoir state.
- Parallel scan/reduce: stages, intermediate values, and work-depth explanation.

### Backend requirements

Separate controllers, services, algorithm implementations, DTOs, repositories, benchmarking, and visualization/trace models.

Algorithms must be callable directly from unit tests without starting the web server.

Create versioned REST endpoints under `/api/v1`, including:
- `GET /health`
- `GET /dashboard/overview`
- `GET /algorithms`
- Specific POST endpoints for each implemented algorithm
- Event ingestion and analysis endpoints
- Benchmark endpoints
- Execution history endpoints

Use explicit DTOs and validation. Document the API with OpenAPI/SpringDoc where compatible. Ensure the frontend uses a centralized API client and actual API responses.

Create a shared response envelope containing an execution ID, algorithm ID, status, algorithm-specific result, supported metrics, optional bounded trace, warnings, and timestamp. Keep algorithm-specific results typed and meaningful.

### Data and persistence

Use PostgreSQL to persist supported security events, threat signatures, execution history, findings, and benchmark records.

Provide database migrations or reproducible initialization scripts. Read credentials from environment variables. Do not commit secrets. Clearly document setup and startup commands.

For the initial demonstration, provide clearly labeled seeded sample data. Implement validated file upload only with safe file-size limits and supported formats. Never execute anything contained in a log.

### Algorithm correctness requirements

- Implement the real algorithm, not a superficial approximation disguised as the named algorithm.
- Do not claim SA-IS is linear time if it is implemented using ordinary comparator sorting.
- Correctly handle overlapping string matches.
- Correctly handle hash collisions and negative rolling-hash modulo values.
- Label the exact Damerau–Levenshtein variant.
- Put sensible input-size limits on exponential algorithms.
- Implement graph residual capacities and augmenting paths correctly.
- Distinguish exact solutions, approximations, and heuristics.
- Never infer UNSAT solely from a heuristic failure.
- Use safe modular arithmetic for Miller–Rabin.
- Use reproducible random seeds where appropriate.
- Distinguish an educational parallel visualization from actual concurrent execution.
- Treat Brent's theorem output as theoretical estimates, not measured speedup.
- Do not claim that a signature match proves an attack.

### Execution traces and metrics

Traces must come from the algorithm implementation, be accurate, and be bounded. Large inputs must not create unbounded responses or exhaust browser memory.

For benchmarking:
- Use JVM warm-up.
- Run repeated trials.
- Record units and methodology.
- Separate setup and trace generation from timed work where appropriate.
- Use compatible identical inputs for algorithm comparisons.
- Distinguish runtime, instrumented operation counts, theoretical complexity, and memory estimates.
- Never fabricate performance numbers.

### Testing and quality requirements

For every algorithm:
- Write JUnit 5 tests for normal cases, edge cases, empty/minimum inputs where supported, invalid inputs, no-match/no-solution cases, and regression cases.
- Validate outputs against independently calculated examples or trusted invariants.
- Test graph invariants and max-flow/min-cut consistency.
- Test randomized algorithms using correctness properties and seeded runs where appropriate.
- Test API validation, JSON serialization, persistence, and frontend integration.

Also:
- Build the frontend and backend.
- Resolve compile errors, lint/type errors, failing tests, broken routes, and console errors.
- Verify frontend-to-backend connectivity.
- Verify that the dashboard updates from real responses.
- Document any remaining limitation instead of hiding it.

### Resource and security limits

- Validate input lengths, file sizes, graph sizes, numeric ranges, and algorithm-specific limits.
- Bound trace lengths and API payload sizes.
- Never render untrusted log data as HTML.
- Do not execute shell commands from event content.
- Do not expose secrets, absolute filesystem paths, or stack traces.
- Use safe CORS configuration.
- Avoid arbitrary filesystem access.
- Handle timeouts or cancellation where appropriate.

### Work method: do not try to generate everything blindly in one step

Work in this order:

**Phase 0:** Inspect repository and image, report findings, update `PROJECT_STATUS.md`.

**Phase 1:** Establish a working React shell, Spring Boot backend, PostgreSQL configuration, health endpoint, shared API client, navigation, and design system.

**Phase 2:** Implement KMP end to end as the reference vertical slice. Verify Java implementation, unit tests, API response, real dashboard output, execution trace, and metrics. Then complete the rest of M1.

**Phase 3:** Implement and integrate M2 and M3.

**Phase 4:** Implement and integrate M4 with an interactive graph visualization.

**Phase 5:** Implement and integrate M5, including correct reductions and approximation guarantees.

**Phase 6:** Implement and integrate M6.

**Phase 7:** Complete dashboard overview, event explorer, benchmarking, history, reports, and persistence.

**Phase 8:** Run the complete test suite, build all components, perform end-to-end verification, and update documentation/status.

At the end of each phase:
1. Run the relevant tests/build.
2. Fix discovered errors before moving on.
3. Update `PROJECT_STATUS.md`.
4. Record exact commands and actual outcomes.
5. Keep the project runnable.
6. Identify the next concrete milestone.

Do not claim a build or test passed unless you actually ran it and observed the result. Do not stop after creating a plan or a set of placeholder files. Continue implementing the current phase within the available working session, prioritizing a tested vertical slice over a large amount of nonfunctional scaffolding.

### Required final deliverables

- Working React frontend.
- Working Java/Spring Boot backend.
- PostgreSQL configuration and initialization/migration scripts.
- Real Java DSA implementations for completed modules.
- JUnit tests.
- Interactive visualizations driven by backend results.
- Benchmarking and execution-history support.
- README with exact setup/run commands.
- API and architecture documentation.
- `PROJECT_STATUS.md` with honest per-algorithm completion status.
- A list of known limitations and remaining tasks.

### Final instruction

Begin by inspecting the supplied project folder and image. Then implement the application in the phased order above. Do not merely explain what you would do. Make real repository changes, run the available checks, and leave the project in the most complete, runnable, and verifiable state possible. Never represent an unimplemented algorithm as complete.

---
