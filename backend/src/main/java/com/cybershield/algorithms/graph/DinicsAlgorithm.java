package com.cybershield.algorithms.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

public class DinicsAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DinicsPhase {
        private int phaseIndex;
        private int[] levelGraph;
        private int blockingFlowPushed;
        private int totalCumulativeFlow;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DinicsResult {
        private String algorithm;
        private int maxFlow;
        private int[][] flowMatrix;
        private int[][] residualGraph;
        private List<DinicsPhase> phases;
        private long comparisonCount;
        private List<String> trace;
    }

    public DinicsResult solve(FlowGraph graph, int source, int sink) {
        List<String> trace = new ArrayList<>();
        List<DinicsPhase> phases = new ArrayList<>();
        long[] comparisons = new long[]{0};

        int n = graph.getNodes();
        int[][] capacity = new int[n][n];
        int[][] flow = new int[n][n];
        for (int i = 0; i < n; i++) {
            System.arraycopy(graph.getCapacity()[i], 0, capacity[i], 0, n);
            System.arraycopy(graph.getFlow()[i], 0, flow[i], 0, n);
        }

        int totalFlow = 0;
        int phaseIdx = 1;

        while (true) {
            int[] level = new int[n];
            Arrays.fill(level, -1);
            level[source] = 0;

            Queue<Integer> queue = new ArrayDeque<>();
            queue.add(source);

            while (!queue.isEmpty()) {
                int u = queue.poll();
                for (int v : graph.getAdj().get(u)) {
                    comparisons[0]++;
                    if (level[v] < 0 && capacity[u][v] - flow[u][v] > 0) {
                        level[v] = level[u] + 1;
                        queue.add(v);
                    }
                }
            }

            if (level[sink] < 0) {
                break; // Sink unreachable in level graph
            }

            int[] ptr = new int[n]; // current-edge optimization
            int phasePushed = 0;

            while (true) {
                int pushed = dfsDinic(source, sink, Integer.MAX_VALUE, level, ptr, capacity, flow, graph.getAdj(), comparisons);
                if (pushed <= 0) break;
                phasePushed += pushed;
                totalFlow += pushed;
            }

            phases.add(new DinicsPhase(phaseIdx++, Arrays.copyOf(level, n), phasePushed, totalFlow));

            if (trace.size() < MAX_TRACE_SIZE) {
                trace.add(String.format("Dinic Phase %d: level[sink]=%d, blocking flow pushed=%d, cumulative maxFlow=%d",
                        phaseIdx - 1, level[sink], phasePushed, totalFlow));
            }
        }

        int[][] residual = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                residual[i][j] = capacity[i][j] - flow[i][j];
            }
        }

        return DinicsResult.builder()
                .algorithm("DINIC_LEVEL_BLOCKING_FLOW")
                .maxFlow(totalFlow)
                .flowMatrix(flow)
                .residualGraph(residual)
                .phases(phases)
                .comparisonCount(comparisons[0])
                .trace(trace)
                .build();
    }

    private int dfsDinic(int u, int sink, int curFlow, int[] level, int[] ptr, int[][] cap, int[][] flow, List<List<Integer>> adj, long[] comparisons) {
        if (u == sink || curFlow == 0) return curFlow;

        List<Integer> neighbors = adj.get(u);
        for (; ptr[u] < neighbors.size(); ptr[u]++) {
            int v = neighbors.get(ptr[u]);
            comparisons[0]++;
            if (level[v] == level[u] + 1 && cap[u][v] - flow[u][v] > 0) {
                int pushed = dfsDinic(v, sink, Math.min(curFlow, cap[u][v] - flow[u][v]), level, ptr, cap, flow, adj, comparisons);
                if (pushed > 0) {
                    flow[u][v] += pushed;
                    flow[v][u] -= pushed;
                    return pushed;
                }
            }
        }
        return 0;
    }
}
