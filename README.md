# CyberShield — Enterprise Security Analytics Platform

> **Educational DSA-Powered Cybersecurity Analytics Application**  
> Implements all 6 DSA modules (M1–M6) aligned with CO1–CO6 course outcomes.

---

## Overview

CyberShield is a full-stack web application that demonstrates enterprise-grade Data Structures and Algorithms in a cybersecurity context. A Java/Spring Boot backend executes real DSA algorithms; a React dashboard lets analysts run, visualize, and evaluate them.

**Modules:**
- **M1 (CO1):** String Algorithms — KMP, Z-Function, Rabin-Karp, Aho-Corasick
- **M2 (CO2):** Suffix Structures — Suffix Array, SA-IS, LCP/Kasai, Suffix Automaton
- **M3 (CO3):** Dynamic Programming — Levenshtein, Damerau-Levenshtein, Weighted Edit, Bitmask DP, Matrix Chain
- **M4 (CO4):** Network Flow — Ford-Fulkerson, Edmonds-Karp, Dinic's, Bipartite Matching, Min-Cut
- **M5 (CO5):** NP-Completeness — SAT/3-SAT, 3-SAT→CLIQUE, CLIQUE→IS, IS→VC, VC 2-Approx
- **M6 (CO6):** Randomized & Parallel — Miller-Rabin, Randomized QuickSort, Reservoir Sampling, Blelloch Scan, Brent's Theorem

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Charts | Recharts |
| Graphs | ReactFlow |
| Backend | Java + Spring Boot 3.4 |
| Algorithms | Pure Java implementations |
| Database | PostgreSQL 18 |
| Testing | JUnit 5 |
| API Docs | SpringDoc / OpenAPI |

---

## Prerequisites

- **Java 17+** (JDK 25 supported)
- **Node.js 18+** (v24 supported)
- **npm 8+** (v11 supported)
- **PostgreSQL 15+** (v18 supported)

---

## Quick Start

### 1. Start PostgreSQL

**Using the installed PostgreSQL service:**
```powershell
# Windows — start via pg_ctl (adjust path to your PostgreSQL data directory)
pg_ctl start -D "C:\Program Files\PostgreSQL\15\data" -w

# Or start the Windows service (if configured)
Start-Service postgresql-x64-18
```

### 2. Create the Database

```bash
# Connect as postgres user (replace password with yours)
psql -U postgres -h localhost -p 5432

# In psql shell:
CREATE DATABASE cybershield;
\q
```

### 3. Configure Environment

Set the database password environment variable before starting the backend:

```powershell
# Windows PowerShell
$env:DB_PASSWORD = "your_postgres_password"
```

Or create `backend/src/main/resources/application-local.properties`:
```properties
spring.datasource.password=your_postgres_password
```

### 4. Start the Backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend will start on **http://localhost:8080**

API docs available at: **http://localhost:8080/swagger-ui.html**

Health check: **http://localhost:8080/api/v1/health**

### 5. Start the Frontend

```powershell
cd frontend
npm install   # First time only
npm run dev
```

Frontend will start on **http://localhost:5173**

---

## Project Structure

```
CyberShield/
├── backend/                          # Spring Boot Java backend
│   ├── src/main/java/com/cybershield/
│   │   ├── CyberShieldApplication.java
│   │   ├── config/                   # CORS, OpenAPI, Web config
│   │   ├── controller/               # REST controllers
│   │   ├── service/                  # Business logic
│   │   ├── algorithms/
│   │   │   ├── strings/              # KMP, Z-Function, Rabin-Karp, Aho-Corasick
│   │   │   ├── suffix/               # Suffix Array, SA-IS, LCP/Kasai, Suffix Automaton
│   │   │   ├── dp/                   # Edit Distance, Bitmask DP, Matrix Chain
│   │   │   ├── graph/                # Ford-Fulkerson, Edmonds-Karp, Dinic's, Min-Cut, Bipartite
│   │   │   ├── np/                   # SAT, Reductions, Vertex Cover
│   │   │   └── randomized/           # Miller-Rabin, QuickSort, Reservoir, Scan, Brent's
│   │   ├── dto/                      # Request/Response DTOs
│   │   ├── model/                    # JPA entities
│   │   ├── repository/               # Spring Data JPA repos
│   │   └── benchmark/                # Benchmarking service
│   └── src/test/java/com/cybershield/  # JUnit 5 tests
│
├── frontend/                         # React+Vite+TypeScript dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/               # Sidebar, TopBar, AppLayout
│   │   │   └── ui/                   # Reusable UI components
│   │   ├── pages/                    # Route pages
│   │   │   └── algorithms/           # Algorithm workbenches
│   │   ├── services/api.ts           # Axios API client
│   │   └── types/index.ts            # TypeScript types
│   └── package.json
│
├── database/
│   └── init.sql                      # Database initialization
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── TESTING.md
│
├── PROJECT_STATUS.md                 # Algorithm implementation status
├── docker-compose.yml                # Optional containerized setup
└── README.md
```

---

## API Reference

Base URL: `http://localhost:8080/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Backend health check |
| GET | `/dashboard/overview` | Dashboard summary |
| GET | `/algorithms` | Algorithm catalogue |
| POST | `/algorithms/kmp` | KMP string search |
| POST | `/algorithms/z-function` | Z-Function search |
| POST | `/algorithms/rabin-karp` | Rabin-Karp hash search |
| POST | `/algorithms/aho-corasick` | Multi-pattern search |
| POST | `/algorithms/suffix-array` | Suffix array construction |
| POST | `/algorithms/sa-is` | SA-IS suffix array |
| POST | `/algorithms/lcp-kasai` | LCP array construction |
| POST | `/algorithms/suffix-automaton` | Suffix automaton |
| POST | `/algorithms/edit-distance` | Edit distance (Levenshtein/Damerau/Weighted) |
| POST | `/algorithms/bitmask-dp` | Bitmask DP security rule optimization |
| POST | `/algorithms/matrix-chain` | Matrix chain multiplication |
| POST | `/algorithms/max-flow` | Max flow (Ford-Fulkerson/Edmonds-Karp/Dinic's) |
| POST | `/algorithms/bipartite-matching` | Bipartite matching |
| POST | `/algorithms/min-cut` | Minimum cut |
| POST | `/algorithms/sat` | SAT/3-SAT solver |
| POST | `/algorithms/reductions` | NP reduction chain |
| POST | `/algorithms/vertex-cover` | Vertex cover approximation |
| POST | `/algorithms/miller-rabin` | Miller-Rabin primality |
| POST | `/algorithms/randomized-quicksort` | Randomized QuickSort |
| POST | `/algorithms/reservoir-sampling` | Reservoir sampling |
| POST | `/algorithms/parallel-scan` | Blelloch scan |
| POST | `/algorithms/brents-theorem` | Brent's theorem calculator |
| POST | `/algorithms/benchmark` | Algorithm benchmarking |
| GET | `/events` | Security events |
| GET | `/executions` | Execution history |
| GET | `/benchmarks` | Benchmark results |

Full interactive docs: **http://localhost:8080/swagger-ui.html**

---

## Running Tests

```powershell
cd backend
.\mvnw.cmd test
```

---

## Important Disclaimers

1. **Sample/Simulated Data:** The seeded security events and threat signatures are synthetic examples for educational demonstration, not real threat intelligence.
2. **Algorithm Outputs:** All outputs originate from real Java algorithm execution. No values are hardcoded or faked.
3. **Brent's Theorem:** Work-depth estimates are theoretical. Not measured CPU speedups.
4. **Miller-Rabin:** Returns "probable prime" — not a deterministic guarantee except for explicitly stated small-number ranges.
5. **SAT Solver:** Limited to ≤20 variables (exhaustive backtracking). Cannot handle production SAT instances.
6. **Signature Matches:** A string match does not prove an attack. Findings require human analyst review.
7. **Blelloch Scan:** The parallel visualization is educational. Not actual multi-core parallelism unless stated.
8. **Damerau-Levenshtein:** Implements the Optimal String Alignment (OSA) variant. OSA ≠ unrestricted DL.

---

## Known Limitations

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for the complete per-algorithm status and known limitations.

---

## Contributing

This is an educational project. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the system design.
