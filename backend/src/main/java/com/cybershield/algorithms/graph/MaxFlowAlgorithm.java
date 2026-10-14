package com.cybershield.algorithms.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class MaxFlowAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MaxFlowResult {
        private String algorithm;
        private int maxFlow;
        private int[][] flowMatrix;
        private int[][] residualGraph;
        private List<List<Integer>> augmentingPaths;
        private long comparisonCount;
        private List<String> trace;
    }

    public MaxFlowResult solve(FlowGraph graph, int source, int sink) {
        List<String> trace = new ArrayList<>();
        List<List<Integer>> paths = new ArrayList<>();
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
            boolean[] visited = new boolean[n];
            List<Integer> path = new ArrayList<>();
            path.add(source);
            visited[source] = true;

            int bottleneck = dfs(source, sink, Integer.MAX_VALUE, visited, capacity, flow, path, graph.getAdj());
            comparisons++;

            if (bottleneck <= 0) {
                break;
            }

            totalFlow += bottleneck;
            paths.add(new ArrayList<>(path));

            if (trace.size() < MAX_TRACE_SIZE) {
                trace.add(String.format("Augmenting path via DFS: %s, bottleneck added: %d, current total: %d",
                        path, bottleneck, totalFlow));
            }
        }

        int[][] residual = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                residual[i][j] = capacity[i][j] - flow[i][j];
            }
        }

        return MaxFlowResult.builder()
                .algorithm("FORD_FULKERSON_DFS")
                .maxFlow(totalFlow)
                .flowMatrix(flow)
                .residualGraph(residual)
                .augmentingPaths(paths)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }

    private int dfs(int u, int sink, int curFlow, boolean[] visited, int[][] cap, int[][] flow, List<Integer> path, List<List<Integer>> adj) {
        if (u == sink) return curFlow;

        for (int v : adj.get(u)) {
            int residual = cap[u][v] - flow[u][v];
            if (!visited[v] && residual > 0) {
                visited[v] = true;
                path.add(v);
                int pushed = dfs(v, sink, Math.min(curFlow, residual), visited, cap, flow, path, adj);
                if (pushed > 0) {
                    flow[u][v] += pushed;
                    flow[v][u] -= pushed;
                    return pushed;
                }
                path.remove(path.size() - 1);
            }
        }
        return 0;
    }
}
