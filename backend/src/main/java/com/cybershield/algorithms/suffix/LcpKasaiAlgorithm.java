package com.cybershield.algorithms.suffix;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Real Kasai et al. Linear-time O(n) LCP (Longest Common Prefix) Algorithm.
 */
public class LcpKasaiAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LcpResult {
        private int[] lcpArray;
        private int[] suffixArray;
        private List<int[]> pairedSuffixIndices;
        private long comparisonCount;
        private List<String> trace;
    }

    public LcpResult compute(String text, int[] suffixArray) {
        List<String> trace = new ArrayList<>();
        List<int[]> pairedIndices = new ArrayList<>();
        long comparisons = 0;

        if (text == null || text.isEmpty() || suffixArray == null || suffixArray.length == 0) {
            return LcpResult.builder()
                    .lcpArray(new int[0])
                    .pairedSuffixIndices(new ArrayList<>())
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        int n = text.length();
        int[] rank = new int[n];
        for (int i = 0; i < n; i++) {
            rank[suffixArray[i]] = i;
        }

        int[] lcp = new int[n];
        int k = 0;

        for (int i = 0; i < n; i++) {
            if (rank[i] == 0) {
                lcp[0] = 0;
                continue;
            }

            int j = suffixArray[rank[i] - 1]; // previous suffix in sorted order
            pairedIndices.add(new int[]{j, i});

            while (i + k < n && j + k < n && text.charAt(i + k) == text.charAt(j + k)) {
                comparisons++;
                k++;
            }
            if (i + k < n && j + k < n) {
                comparisons++;
            }

            lcp[rank[i]] = k;

            if (trace.size() < MAX_TRACE_SIZE) {
                trace.add(String.format("rank[%d]=%d, prev SA=%d, common prefix len=%d ('%s' vs '%s')",
                        i, rank[i], j, k,
                        text.substring(j, Math.min(n, j + Math.min(10, k))),
                        text.substring(i, Math.min(n, i + Math.min(10, k)))));
            }

            if (k > 0) {
                k--;
            }
        }

        return LcpResult.builder()
                .lcpArray(lcp)
                .pairedSuffixIndices(pairedIndices)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }
}
