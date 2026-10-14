package com.cybershield.controller;

import com.cybershield.dto.AlgorithmCatalogItem;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/algorithms")
@Tag(name = "Algorithm Catalog", description = "Metadata registry of all supported DSA algorithms")
public class AlgorithmCatalogController {

    @Operation(summary = "List Algorithm Catalog", description = "Retrieves the complete catalog of algorithms across Modules M1 through M6")
    @GetMapping
    public ResponseEntity<List<AlgorithmCatalogItem>> getCatalog() {
        List<AlgorithmCatalogItem> catalog = new ArrayList<>();

        // M1
        catalog.add(new AlgorithmCatalogItem("kmp", "Knuth-Morris-Pratt (KMP)", "M1", "CO1",
                "Linear-time exact pattern matching with Longest Prefix Suffix (LPS) array transitions",
                "O(n + m)", "O(m)", "/api/v1/algorithms/kmp", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("z-function", "Z-Function String Matching", "M1", "CO1",
                "Linear-time pattern search via Z-box window expansion algorithm",
                "O(n + m)", "O(n + m)", "/api/v1/algorithms/z-function", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("rabin-karp", "Rabin-Karp Rolling Hash", "M1", "CO1",
                "Polynomial rolling hash search with spurious collision verification",
                "O(n + m) avg, O(nm) worst", "O(1)", "/api/v1/algorithms/rabin-karp", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("aho-corasick", "Aho-Corasick Multi-Pattern Automaton", "M1", "CO1",
                "Trie automaton with BFS failure transitions for concurrent dictionary matching",
                "O(n + m + z)", "O(m * alphabet)", "/api/v1/algorithms/aho-corasick", "IMPLEMENTED"));

        // M2
        catalog.add(new AlgorithmCatalogItem("suffix-array", "Suffix Array (Prefix-Doubling)", "M2", "CO2",
                "O(n log^2 n) comparator-based lexicographical suffix array construction",
                "O(n log^2 n)", "O(n)", "/api/v1/algorithms/suffix-array", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("sa-is", "SA-IS Linear Induced Sorting", "M2", "CO2",
                "Linear-time Suffix Array Induced Sorting via S/L type classification and LMS recursion",
                "O(n)", "O(n)", "/api/v1/algorithms/sa-is", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("lcp-kasai", "Kasai LCP Computation", "M2", "CO2",
                "Linear-time Longest Common Prefix calculation using rank inversion",
                "O(n)", "O(n)", "/api/v1/algorithms/lcp-kasai", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("suffix-automaton", "Suffix Automaton (DAWG)", "M2", "CO2",
                "Directed acyclic word graph recognizing all substrings in linear time and space",
                "O(n)", "O(n)", "/api/v1/algorithms/suffix-automaton", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("suffix-tree", "Ukkonen Suffix Tree", "M2", "CO2",
                "Linear-time online suffix tree construction",
                "O(n)", "O(n)", "/api/v1/algorithms/suffix-tree", "PLANNED"));

        // M3
        catalog.add(new AlgorithmCatalogItem("edit-distance", "Edit Distance (Levenshtein & Damerau-OSA)", "M3", "CO3",
                "Dynamic programming string alignment matrix and optimal edit script backtrack",
                "O(mn)", "O(mn)", "/api/v1/algorithms/edit-distance", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("bitmask-dp", "Bitmask DP Security Policy Activation", "M3", "CO3",
                "Exact exponential dynamic programming over subset states for minimum cost rule selection",
                "O(N * 2^M)", "O(2^M)", "/api/v1/algorithms/bitmask-dp", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("matrix-chain", "Matrix Chain Multiplication DP", "M3", "CO3",
                "Optimal parenthesization DP for composite multi-matrix matrix transformations",
                "O(n^3)", "O(n^2)", "/api/v1/algorithms/matrix-chain", "IMPLEMENTED"));

        // M4
        catalog.add(new AlgorithmCatalogItem("max-flow-ford-fulkerson", "Ford-Fulkerson (DFS)", "M4", "CO4",
                "Augmenting path maximum network flow via depth-first search on residual graph",
                "O(E * |f|)", "O(V^2)", "/api/v1/algorithms/max-flow", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("max-flow-edmonds-karp", "Edmonds-Karp (BFS)", "M4", "CO4",
                "Shortest augmenting path maximum network flow via breadth-first search",
                "O(V * E^2)", "O(V^2)", "/api/v1/algorithms/max-flow", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("max-flow-dinic", "Dinic's Algorithm", "M4", "CO4",
                "Level graph BFS with DFS blocking flow and current-edge optimization",
                "O(V^2 * E)", "O(V^2)", "/api/v1/algorithms/max-flow", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("bipartite-matching", "Maximum Bipartite Matching", "M4", "CO4",
                "SecOps analyst-to-alert matching via alternating augmenting paths",
                "O(V * E)", "O(V + E)", "/api/v1/algorithms/bipartite-matching", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("min-cut", "Minimum Cut Computation", "M4", "CO4",
                "Residual graph source-reachability cut separating network boundaries",
                "O(V * E^2)", "O(V^2)", "/api/v1/algorithms/min-cut", "IMPLEMENTED"));

        // M5
        catalog.add(new AlgorithmCatalogItem("sat-solver", "DPLL SAT Solver", "M5", "CO5",
                "Exhaustive backtracking solver with unit propagation proving satisfiability or UNSAT",
                "O(2^n) worst", "O(n)", "/api/v1/algorithms/sat", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("reduction-3sat-clique", "3-SAT to CLIQUE Reduction", "M5", "CO5",
                "Polynomial-time reduction mapping 3-CNF clauses to consistency graphs",
                "O(k^2)", "O(k^2)", "/api/v1/algorithms/reductions", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("reduction-clique-is", "CLIQUE to INDEPENDENT SET", "M5", "CO5",
                "Polynomial-time complement graph reduction",
                "O(V^2)", "O(V^2)", "/api/v1/algorithms/reductions", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("reduction-is-vc", "INDEPENDENT SET to VERTEX COVER", "M5", "CO5",
                "Vertex complement reduction verifying coverage of all graph edges",
                "O(V + E)", "O(V)", "/api/v1/algorithms/reductions", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("vertex-cover-approx", "Vertex Cover 2-Approximation", "M5", "CO5",
                "Greedy edge selection approximation algorithm bounding solution within 2 * OPT",
                "O(E)", "O(V)", "/api/v1/algorithms/vertex-cover", "IMPLEMENTED"));

        // M6
        catalog.add(new AlgorithmCatalogItem("miller-rabin", "Miller-Rabin Primality Test", "M6", "CO6",
                "Randomized Monte Carlo primality testing with quadratic residue witnesses",
                "O(k log^3 n)", "O(log n)", "/api/v1/algorithms/miller-rabin", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("randomized-quicksort", "Randomized QuickSort", "M6", "CO6",
                "Las Vegas randomized sorting algorithm avoiding worst-case pivot degradation",
                "O(n log n) expected", "O(log n)", "/api/v1/algorithms/randomized-quicksort", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("reservoir-sampling", "Reservoir Sampling (Algorithm R)", "M6", "CO6",
                "Single-pass streaming sampling algorithm with uniform selection probability k/n",
                "O(n)", "O(k)", "/api/v1/algorithms/reservoir-sampling", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("parallel-scan", "Blelloch Parallel Prefix Scan", "M6", "CO6",
                "Work-efficient parallel prefix reduction and distribution tree scan",
                "O(n) work, O(log n) span", "O(n)", "/api/v1/algorithms/parallel-scan", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("brents-theorem", "Brent's Theorem Calculator", "M6", "CO6",
                "Theoretical work-time framework calculating parallel execution bounds",
                "O(1)", "O(1)", "/api/v1/algorithms/brents-theorem", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("monte-carlo-demo", "Monte Carlo Paradigm Demo", "M6", "CO6",
                "Probabilistic outcome approximation with deterministic runtime (Pi estimation)",
                "O(n)", "O(1)", "/api/v1/algorithms/monte-carlo-demo", "IMPLEMENTED"));
        catalog.add(new AlgorithmCatalogItem("las-vegas-demo", "Las Vegas Paradigm Demo", "M6", "CO6",
                "Deterministic correct output with probabilistic runtime execution",
                "O(n log n) expected", "O(n)", "/api/v1/algorithms/las-vegas-demo", "IMPLEMENTED"));

        return ResponseEntity.ok(catalog);
    }
}
