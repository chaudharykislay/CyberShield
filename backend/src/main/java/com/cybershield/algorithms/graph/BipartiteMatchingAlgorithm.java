package com.cybershield.algorithms.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

/**
 * Maximum Bipartite Matching for Security Operations:
 * Matching Analysts (left partition) to Security Alerts (right partition).
 */
public class BipartiteMatchingAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatchingResult {
        private int matchingSize;
        private List<int[]> matchedPairs; // [left, right]
        private List<Integer> unmatchedLeft;
        private List<Integer> unmatchedRight;
        private long comparisonCount;
        private List<String> trace;
    }

    public MatchingResult match(int leftCount, int rightCount, List<int[]> edges) {
        List<String> trace = new ArrayList<>();
        long comparisons = 0;

        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < leftCount; i++) adj.add(new ArrayList<>());

        if (edges != null) {
            for (int[] edge : edges) {
                if (edge != null && edge.length >= 2) {
                    int u = edge[0];
                    int v = edge[1];
                    if (u >= 0 && u < leftCount && v >= 0 && v < rightCount) {
                        adj.get(u).add(v);
                    }
                }
            }
        }

        int[] matchR = new int[rightCount];
        Arrays.fill(matchR, -1);
        int[] matchL = new int[leftCount];
        Arrays.fill(matchL, -1);

        int matchingSize = 0;

        for (int u = 0; u < leftCount; u++) {
            boolean[] visited = new boolean[rightCount];
            if (findAugmentingPath(u, adj, visited, matchR)) {
                matchingSize++;
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Augmenting path found for analyst %d; matching size now: %d", u, matchingSize));
                }
            }
            comparisons++;
        }

        List<int[]> matchedPairs = new ArrayList<>();
        List<Integer> unmatchedRight = new ArrayList<>();
        for (int v = 0; v < rightCount; v++) {
            if (matchR[v] != -1) {
                matchL[matchR[v]] = v;
                matchedPairs.add(new int[]{matchR[v], v});
            } else {
                unmatchedRight.add(v);
            }
        }

        List<Integer> unmatchedLeft = new ArrayList<>();
        for (int u = 0; u < leftCount; u++) {
            if (matchL[u] == -1) {
                unmatchedLeft.add(u);
            }
        }

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Matching complete: %d pairs matched, %d analysts unmatched, %d alerts unmatched",
                    matchingSize, unmatchedLeft.size(), unmatchedRight.size()));
        }

        return MatchingResult.builder()
                .matchingSize(matchingSize)
                .matchedPairs(matchedPairs)
                .unmatchedLeft(unmatchedLeft)
                .unmatchedRight(unmatchedRight)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }

    private boolean findAugmentingPath(int u, List<List<Integer>> adj, boolean[] visited, int[] matchR) {
        for (int v : adj.get(u)) {
            if (!visited[v]) {
                visited[v] = true;
                if (matchR[v] < 0 || findAugmentingPath(matchR[v], adj, visited, matchR)) {
                    matchR[v] = u;
                    return true;
                }
            }
        }
        return false;
    }
}
