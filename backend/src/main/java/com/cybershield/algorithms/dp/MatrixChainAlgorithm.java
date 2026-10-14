package com.cybershield.algorithms.dp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Matrix Chain Multiplication Optimization DP Algorithm O(n^3).
 */
public class MatrixChainAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatrixChainResult {
        private long minOperations;
        private long[][] costTable;
        private int[][] splitTable;
        private String optimalParenthesization;
        private long comparisonCount;
        private List<String> trace;

        public long getMinScalarMultiplications() {
            return minOperations;
        }

        public long[][] getMTable() {
            return costTable;
        }

        public int[][] getSTable() {
            return splitTable;
        }

        public String getParenthesization() {
            return optimalParenthesization;
        }
    }

    public MatrixChainResult compute(int[] dimensions) {
        List<String> trace = new ArrayList<>();
        long comparisons = 0;

        if (dimensions == null || dimensions.length < 2) {
            return MatrixChainResult.builder()
                    .minOperations(0)
                    .costTable(new long[0][0])
                    .splitTable(new int[0][0])
                    .optimalParenthesization("")
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        int n = dimensions.length - 1; // number of matrices
        long[][] m = new long[n + 1][n + 1];
        int[][] s = new int[n + 1][n + 1];

        for (int i = 1; i <= n; i++) {
            m[i][i] = 0;
        }

        // L is chain length
        for (int l = 2; l <= n; l++) {
            for (int i = 1; i <= n - l + 1; i++) {
                int j = i + l - 1;
                m[i][j] = Long.MAX_VALUE;

                for (int k = i; k <= j - 1; k++) {
                    comparisons++;
                    long q = m[i][k] + m[k + 1][j] + (long) dimensions[i - 1] * dimensions[k] * dimensions[j];
                    if (q < m[i][j]) {
                        m[i][j] = q;
                        s[i][j] = k;
                    }
                }

                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("m[%d][%d] = %d with split at k=%d", i, j, m[i][j], s[i][j]));
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        buildOptimalParens(s, 1, n, sb);
        String parenthesization = sb.toString();

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add("Optimal order: " + parenthesization + " with min scalar ops: " + m[1][n]);
        }

        return MatrixChainResult.builder()
                .minOperations(m[1][n])
                .costTable(m)
                .splitTable(s)
                .optimalParenthesization(parenthesization)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }

    private void buildOptimalParens(int[][] s, int i, int j, StringBuilder sb) {
        if (i == j) {
            sb.append("A").append(i);
        } else {
            sb.append("(");
            buildOptimalParens(s, i, s[i][j], sb);
            sb.append(" x ");
            buildOptimalParens(s, s[i][j] + 1, j, sb);
            sb.append(")");
        }
    }
}
