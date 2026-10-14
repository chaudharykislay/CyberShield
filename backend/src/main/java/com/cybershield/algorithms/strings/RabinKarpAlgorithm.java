package com.cybershield.algorithms.strings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RabinKarpAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;
    private static final long BASE = 31L;
    private static final long MOD = 1_000_000_007L;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RabinKarpResult {
        private List<Integer> matchPositions;
        private long spuriousHits;
        private List<String> hashTrace;
        private long comparisonCount;
        private List<String> trace;

        public List<Integer> getMatches() {
            return matchPositions;
        }

        public long getBase() {
            return BASE;
        }

        public long getPrime() {
            return MOD;
        }

        public long getHashComparisons() {
            return comparisonCount;
        }
    }

    public RabinKarpResult search(String text, String pattern) {
        List<String> trace = new ArrayList<>();
        List<String> hashTrace = new ArrayList<>();
        List<Integer> matchPositions = new ArrayList<>();
        long spuriousHits = 0;
        long comparisons = 0;

        if (text == null || pattern == null || pattern.isEmpty()) {
            if (pattern != null && pattern.isEmpty()) {
                trace.add("Pattern is empty: matches at index 0");
                matchPositions.add(0);
            }
            return RabinKarpResult.builder()
                    .matchPositions(matchPositions)
                    .spuriousHits(0)
                    .hashTrace(hashTrace)
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        int n = text.length();
        int m = pattern.length();

        if (m > n) {
            trace.add("Pattern length (" + m + ") exceeds text length (" + n + ").");
            return RabinKarpResult.builder()
                    .matchPositions(Collections.emptyList())
                    .spuriousHits(0)
                    .hashTrace(hashTrace)
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        // Compute h = BASE^(m-1) % MOD
        long h = 1;
        for (int i = 0; i < m - 1; i++) {
            h = (h * BASE) % MOD;
        }

        long patternHash = 0;
        long textHash = 0;

        for (int i = 0; i < m; i++) {
            patternHash = (patternHash * BASE + pattern.charAt(i)) % MOD;
            textHash = (textHash * BASE + text.charAt(i)) % MOD;
        }

        if (hashTrace.size() < MAX_TRACE_SIZE) {
            hashTrace.add(String.format("Pattern hash computed: %d", patternHash));
            hashTrace.add(String.format("Initial window [0..%d] text hash: %d", m - 1, textHash));
        }

        for (int i = 0; i <= n - m; i++) {
            if (patternHash == textHash) {
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Hash match at index %d (hash=%d). Verifying characters...", i, textHash));
                }
                boolean matched = true;
                for (int j = 0; j < m; j++) {
                    comparisons++;
                    if (text.charAt(i + j) != pattern.charAt(j)) {
                        matched = false;
                        spuriousHits++;
                        if (trace.size() < MAX_TRACE_SIZE) {
                            trace.add(String.format("Spurious collision at index %d: text[%d]='%c' != pattern[%d]='%c'",
                                    i, i + j, text.charAt(i + j), j, pattern.charAt(j)));
                        }
                        break;
                    }
                }
                if (matched) {
                    matchPositions.add(i);
                    if (trace.size() < MAX_TRACE_SIZE) {
                        trace.add(String.format("True match verified at index %d", i));
                    }
                }
            } else {
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Hash mismatch at index %d: patternHash=%d != textHash=%d", i, patternHash, textHash));
                }
            }

            // Rolling hash for next window
            if (i < n - m) {
                long outgoing = (text.charAt(i) * h) % MOD;
                textHash = (textHash - outgoing) % MOD;
                if (textHash < 0) {
                    textHash = (textHash + MOD) % MOD;
                }
                textHash = (textHash * BASE + text.charAt(i + m)) % MOD;

                if (hashTrace.size() < MAX_TRACE_SIZE) {
                    hashTrace.add(String.format("Window slide to [%d..%d]: textHash=%d", i + 1, i + m, textHash));
                }
            }
        }

        return RabinKarpResult.builder()
                .matchPositions(matchPositions)
                .spuriousHits(spuriousHits)
                .hashTrace(hashTrace)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }
}
