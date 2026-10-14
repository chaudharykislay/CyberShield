package com.cybershield.algorithms.strings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class KmpAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KmpResult {
        private List<Integer> matchPositions;
        private int[] lpsArray;
        private long comparisonCount;
        private List<String> trace;

        public List<Integer> getMatches() {
            return matchPositions;
        }

        public int[] getLps() {
            return lpsArray;
        }
    }

    public KmpResult search(String text, String pattern) {
        List<String> trace = new ArrayList<>();
        List<Integer> matchPositions = new ArrayList<>();
        long[] comparisons = new long[]{0};

        if (text == null || pattern == null || pattern.isEmpty()) {
            if (pattern != null && pattern.isEmpty()) {
                trace.add("Pattern is empty: matches at index 0");
                matchPositions.add(0);
            }
            return KmpResult.builder()
                    .matchPositions(matchPositions)
                    .lpsArray(new int[0])
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        int n = text.length();
        int m = pattern.length();

        if (m > n) {
            trace.add("Pattern length (" + m + ") exceeds text length (" + n + "). No match possible.");
            return KmpResult.builder()
                    .matchPositions(Collections.emptyList())
                    .lpsArray(buildLPS(pattern, comparisons, trace))
                    .comparisonCount(comparisons[0])
                    .trace(trace)
                    .build();
        }

        int[] lps = buildLPS(pattern, comparisons, trace);

        int i = 0; // index for text
        int j = 0; // index for pattern

        while (i < n) {
            comparisons[0]++;
            char tc = text.charAt(i);
            char pc = pattern.charAt(j);

            if (tc == pc) {
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("i=%d, j=%d, match: text[%d]='%c' == pattern[%d]='%c'", i, j, i, tc, j, pc));
                }
                i++;
                j++;

                if (j == m) {
                    int matchIdx = i - j;
                    matchPositions.add(matchIdx);
                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add("Match found at index " + matchIdx);
                    }
                    j = lps[j - 1];
                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add("Reset pattern pointer j using LPS: j=" + j);
                    }
                }
            } else {
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("i=%d, j=%d, mismatch: text[%d]='%c' != pattern[%d]='%c'", i, j, i, tc, j, pc));
                }
                if (j != 0) {
                    j = lps[j - 1];
                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add("Mismatch: fallback j=" + j);
                    }
                } else {
                    i++;
                }
            }
        }

        return KmpResult.builder()
                .matchPositions(matchPositions)
                .lpsArray(lps)
                .comparisonCount(comparisons[0])
                .trace(trace)
                .build();
    }

    private int[] buildLPS(String pattern, long[] comparisons, List<String> trace) {
        int m = pattern.length();
        int[] lps = new int[m];
        int len = 0;
        int i = 1;
        lps[0] = 0;

        while (i < m) {
            comparisons[0]++;
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                lps[i] = len;
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("LPS compute: i=%d, pattern[%d]=='%c' == pattern[%d]=='%c', lps[%d]=%d",
                            i, i, pattern.charAt(i), len - 1, pattern.charAt(len - 1), i, len));
                }
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1];
                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add(String.format("LPS fallback: i=%d, len fallback to %d", i, len));
                    }
                } else {
                    lps[i] = 0;
                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add(String.format("LPS mismatch: i=%d, lps[%d]=0", i, i));
                    }
                    i++;
                }
            }
        }
        return lps;
    }
}
