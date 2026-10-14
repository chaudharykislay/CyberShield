package com.cybershield.algorithms.dp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class EditDistanceAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EditDistanceResult {
        private String mode; // LEVENSHTEIN, DAMERAU_OSA, WEIGHTED
        private int distance;
        private int[][] dpMatrix;
        private List<String> editScript;
        private long comparisonCount;
        private List<String> trace;

        public int[][] getMatrix() {
            return dpMatrix;
        }

        public List<String> getScript() {
            return editScript;
        }
    }

    public EditDistanceResult compute(String s1, String s2, String mode, Integer insertCost, Integer deleteCost, Integer substituteCost) {
        List<String> trace = new ArrayList<>();
        long[] comparisons = new long[]{0};

        if (s1 == null) s1 = "";
        if (s2 == null) s2 = "";
        if (mode == null) mode = "LEVENSHTEIN";
        int ins = insertCost != null ? insertCost : 1;
        int del = deleteCost != null ? deleteCost : 1;
        int sub = substituteCost != null ? substituteCost : 1;

        int m = s1.length();
        int n = s2.length();
        int[][] dp = new int[m + 1][n + 1];

        // Base cases
        dp[0][0] = 0;
        for (int i = 1; i <= m; i++) dp[i][0] = i * del;
        for (int j = 1; j <= n; j++) dp[0][j] = j * ins;

        boolean isDamerau = "DAMERAU_OSA".equalsIgnoreCase(mode);

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                comparisons[0]++;
                int cost = (s1.charAt(i - 1) == s2.charAt(j - 1)) ? 0 : sub;

                int deletion = dp[i - 1][j] + del;
                int insertion = dp[i][j - 1] + ins;
                int substitution = dp[i - 1][j - 1] + cost;

                dp[i][j] = Math.min(deletion, Math.min(insertion, substitution));

                if (isDamerau && i > 1 && j > 1 && s1.charAt(i - 1) == s2.charAt(j - 2) && s1.charAt(i - 2) == s2.charAt(j - 1)) {
                    comparisons[0]++;
                    dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
                }

                if (trace.size() < MAX_TRACE_SIZE && (i <= 5 && j <= 5)) {
                    trace.add(String.format("dp[%d][%d] computed = %d ('%c' vs '%c')",
                            i, j, dp[i][j], s1.charAt(i - 1), s2.charAt(j - 1)));
                }
            }
        }

        // Backtrack edit script
        List<String> script = new ArrayList<>();
        int i = m;
        int j = n;
        while (i > 0 || j > 0) {
            if (isDamerau && i > 1 && j > 1 && s1.charAt(i - 1) == s2.charAt(j - 2) && s1.charAt(i - 2) == s2.charAt(j - 1)
                    && dp[i][j] == dp[i - 2][j - 2] + 1) {
                script.add(String.format("TRANSPOSE '%c%c' -> '%c%c'", s1.charAt(i - 2), s1.charAt(i - 1), s2.charAt(j - 2), s2.charAt(j - 1)));
                i -= 2;
                j -= 2;
            } else if (i > 0 && j > 0 && dp[i][j] == dp[i - 1][j - 1] + ((s1.charAt(i - 1) == s2.charAt(j - 1)) ? 0 : sub)) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    script.add(String.format("MATCH '%c'", s1.charAt(i - 1)));
                } else {
                    script.add(String.format("SUBSTITUTE '%c' -> '%c' (cost %d)", s1.charAt(i - 1), s2.charAt(j - 1), sub));
                }
                i--;
                j--;
            } else if (i > 0 && dp[i][j] == dp[i - 1][j] + del) {
                script.add(String.format("DELETE '%c' (cost %d)", s1.charAt(i - 1), del));
                i--;
            } else if (j > 0) {
                script.add(String.format("INSERT '%c' (cost %d)", s2.charAt(j - 1), ins));
                j--;
            } else {
                break;
            }
        }
        Collections.reverse(script);

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Optimal distance calculated: %d with %d edit operations", dp[m][n], script.size()));
        }

        return EditDistanceResult.builder()
                .mode(mode.toUpperCase())
                .distance(dp[m][n])
                .dpMatrix(dp)
                .editScript(script)
                .comparisonCount(comparisons[0])
                .trace(trace)
                .build();
    }
}
