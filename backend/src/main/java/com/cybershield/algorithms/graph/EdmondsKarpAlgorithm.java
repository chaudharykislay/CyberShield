package com.cybershield.algorithms.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

public class EdmondsKarpAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EdmondsKarpPhase {
        private List<Integer> path;
        private int bottleneck;
        private int cumulativeFlow;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EdmondsKarpResult {
        private String algorithm;
        private int maxFlow;
        private int[][] flowMatrix;
        private int[][] residualGraph;
        private List<EdmondsKarpPhase> phases;
        private long comparisonCount;
        private List<String> trace;
    }

    public EdmondsKarpResult solve(FlowGraph graph, int source, int sink) {
        List<String> trace = new ArrayList<>();
        List<EdmondsKarpPhase> phases = new ArrayList<>();
        long comparisons = 0;

        int n = graph.getNodes();
        int[][] capacity = new int[n][n];
        int[][] flow = new int[n][n];
        for (int i = 0; i < n; i++) {
            System.arraycopy(graph.getCapacity()[i], 0, capacity[i], 0, n);
            System.arraycopy(graph.getFlow()[i], 0, flow[i], 0, n);
        }

        int totalFlow = 0;

        while (true) {
            int[] parent = new int[n];
            Arrays.fill(parent, -1);
            parent[source] = source;

            Queue<Integer> queue = new ArrayDeque<>();
            queue.add(source);

            while (!queue.isEmpty()) {
                int u = queue.poll();
                if (u == sink) break;

                for (int v : graph.getAdj().get(u)) {
                    comparisons++;
                    if (parent[v] == -1 && capacity[u][v] - flow[u][v] > 0) {
                        parent[v] = u;
                        queue.add(v);
                    }
                }
            }

            if (parent[sink] == -1) {
                break; // No augmenting path found
            }

            // Find bottleneck
            int bottleneck = Integer.MAX_VALUE;
            int curr = sink;
            List<Integer> path = new ArrayList<>();
            while (curr != source) {
                path.add(curr);
                int p = parent[curr];
                bottleneck = Math.min(bottleneck, capacity[p][curr] - flow[p][curr]);
                curr = p;
            }
            path.add(source);
            Collections.reverse(path);

            // Apply augmentation
            curr = sink;
            while (curr != source) {
                int p = parent[curr];
                flow[p][curr] += bottleneck;
                flow[curr][p] -= bottleneck;
                curr = p;
            }

            totalFlow += bottleneck;
            phases.add(new EdmondsKarpPhase(path, bottleneck, totalFlow));

            if (trace.size() < MAX_TRACE_SIZE) {
                trace.add(String.format("BFS shortest path: %s, bottleneck: %d, total flow: %d", path, bottleneck, totalFlow));
            }
        }

        int[][] residual = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                residual[i][j] = capacity[i][j] - flow[i][j];
            }
        }

        return EdmondsKarpResult.builder()
                .algorithm("EDMONDS_KARP_BFS")
                .maxFlow(totalFlow)
                .flowMatrix(flow)
                .residualGraph(residual)
                .phases(phases)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }
}
