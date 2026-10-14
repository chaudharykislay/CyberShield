package com.cybershield.algorithms.strings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ZFunctionAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ZFunctionResult {
        private int[] zArray;
        private List<Integer> matchPositions;
        private long comparisonCount;
        private List<String> trace;

        public List<Integer> getMatches() {
            return matchPositions;
        }
    }

    public ZFunctionResult search(String text, String pattern) {
        List<String> trace = new ArrayList<>();
        List<Integer> matchPositions = new ArrayList<>();
        long[] comparisons = new long[]{0};

        if (text == null || pattern == null || pattern.isEmpty()) {
            if (pattern != null && pattern.isEmpty()) {
                trace.add("Pattern is empty: matches at index 0");
                matchPositions.add(0);
            }
            return ZFunctionResult.builder()
                    .zArray(new int[0])
                    .matchPositions(matchPositions)
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        int m = pattern.length();
        int n = text.length();

        if (m > n) {
            trace.add("Pattern length (" + m + ") exceeds text length (" + n + ").");
            return ZFunctionResult.builder()
                    .zArray(new int[0])
                    .matchPositions(Collections.emptyList())
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        // Concatenate pattern + '$' + text using a delimiter guaranteed not to collide
        char delimiter = '$';
        String concat = pattern + delimiter + text;
        int concatLen = concat.length();
        int[] z = computeZArray(concat, comparisons, trace);

        for (int i = m + 1; i < concatLen; i++) {
            if (z[i] == m) {
                int originalIndex = i - (m + 1);
                matchPositions.add(originalIndex);
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Match verified at text index %d (concat index %d, Z-value=%d)", originalIndex, i, z[i]));
                }
            }
        }

        return ZFunctionResult.builder()
                .zArray(z)
                .matchPositions(matchPositions)
                .comparisonCount(comparisons[0])
                .trace(trace)
                .build();
    }

    public int[] computeZArray(String s, long[] comparisons, List<String> trace) {
        int n = s.length();
        int[] z = new int[n];
        z[0] = n; // by convention or 0, here first character full length

        int l = 0;
        int r = 0;

        for (int i = 1; i < n; i++) {
            if (i <= r) {
                int k = i - l;
                if (z[k] < r - i + 1) {
                    z[i] = z[k];
                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add(String.format("Inside Z-box [%d, %d]: i=%d, using cached z[%d]=%d", l, r, i, k, z[i]));
                    }
                } else {
                    l = i;
                    while (r < n && s.charAt(r) == s.charAt(r - l)) {
                        comparisons[0]++;
                        r++;
                    }
                    if (r < n) {
                        comparisons[0]++; // failed match
                    }
                    z[i] = r - l;
                    r--;
                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add(String.format("Z-box expansion from i=%d: new box [%d, %d], z[%d]=%d", i, l, r, i, z[i]));
                    }
                }
            } else {
                l = i;
                r = i;
                while (r < n && s.charAt(r) == s.charAt(r - l)) {
                    comparisons[0]++;
                    r++;
                }
                if (r < n) {
                    comparisons[0]++; // failed match
                }
                z[i] = r - l;
                r--;
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("New Z-box initialized at i=%d: [%d, %d], z[%d]=%d", i, l, r, i, z[i]));
                }
            }
        }

        return z;
    }
}
