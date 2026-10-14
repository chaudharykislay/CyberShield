package com.cybershield.algorithms.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

/**
 * Min-Cut Computation via Max-Flow Min-Cut Theorem.
 * Computes the minimum s-t cut separating source and sink in a flow network.
 */
public class MinCutAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MinCutResult {
        private int maxFlow;
        private int cutCapacity;
        private List<Integer> sourcePartition;
        private List<Integer> sinkPartition;
        private List<int[]> cutEdges; // [u, v, capacity]
        private long comparisonCount;
        private List<String> trace;
    }

    public MinCutResult computeMinCut(FlowGraph graph, int source, int sink) {
        List<String> trace = new ArrayList<>();
        EdmondsKarpAlgorithm ek = new EdmondsKarpAlgorithm();
        EdmondsKarpAlgorithm.EdmondsKarpResult flowResult = ek.solve(graph, source, sink);

        int n = graph.getNodes();
        int[][] residual = flowResult.getResidualGraph();

        // BFS from source in residual graph to find all reachable vertices
        boolean[] reachable = new boolean[n];
        Queue<Integer> queue = new ArrayDeque<>();
        reachable[source] = true;
        queue.add(source);

        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v = 0; v < n; v++) {
                if (!reachable[v] && residual[u][v] > 0) {
                    reachable[v] = true;
                    queue.add(v);
                }
            }
        }

        List<Integer> sourcePartition = new ArrayList<>();
        List<Integer> sinkPartition = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (reachable[i]) {
                sourcePartition.add(i);
            } else {
                sinkPartition.add(i);
            }
        }

        List<int[]> cutEdges = new ArrayList<>();
        int cutCapacity = 0;

        for (int u : sourcePartition) {
            for (int v : sinkPartition) {
                if (graph.getCapacity()[u][v] > 0) {
                    cutEdges.add(new int[]{u, v, graph.getCapacity()[u][v]});
                    cutCapacity += graph.getCapacity()[u][v];
                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add(String.format("Cut edge: %d -> %d with original capacity %d", u, v, graph.getCapacity()[u][v]));
                    }
                }
            }
        }

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Min-cut computed: S-partition=%s, T-partition=%s, total cut capacity=%d (Max-Flow=%d)",
                    sourcePartition, sinkPartition, cutCapacity, flowResult.getMaxFlow()));
        }

        return MinCutResult.builder()
                .maxFlow(flowResult.getMaxFlow())
                .cutCapacity(cutCapacity)
                .sourcePartition(sourcePartition)
                .sinkPartition(sinkPartition)
                .cutEdges(cutEdges)
                .comparisonCount(flowResult.getComparisonCount())
                .trace(trace)
                .build();
    }
}
