package com.cybershield.algorithms.suffix;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

/**
 * Real SA-IS (Suffix Array Induced Sorting) Algorithm.
 * Linear-time O(n) suffix array construction.
 */
public class SaisAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SaisResult {
        private int[] suffixArray;
        private List<Integer> lmsPositions;
        private String[] typeArray;
        private long comparisonCount;
        private List<String> trace;

        public String[] getCharacterTypes() {
            return typeArray;
        }
    }

    public SaisResult compute(String text) {
        List<String> trace = new ArrayList<>();
        long[] comparisons = new long[]{0};

        if (text == null || text.isEmpty()) {
            return SaisResult.builder()
                    .suffixArray(new int[0])
                    .lmsPositions(Collections.emptyList())
                    .typeArray(new String[0])
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        // Convert string to integer array with 0 as sentinel at the end
        int n = text.length();
        int[] s = new int[n + 1];
        for (int i = 0; i < n; i++) {
            s[i] = text.charAt(i);
        }
        s[n] = 0; // sentinel smaller than any char

        int maxChar = 256;
        for (int ch : s) {
            if (ch > maxChar) maxChar = ch;
        }

        boolean[] isS = new boolean[n + 1];
        // Classify types: true = S-type, false = L-type
        isS[n] = true;
        for (int i = n - 1; i >= 0; i--) {
            comparisons[0]++;
            if (s[i] < s[i + 1]) {
                isS[i] = true;
            } else if (s[i] > s[i + 1]) {
                isS[i] = false;
            } else {
                isS[i] = isS[i + 1];
            }
        }

        // Identify LMS (Leftmost S-type) positions
        List<Integer> lms = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            if (isS[i] && !isS[i - 1]) {
                lms.add(i);
            }
        }

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Input length: %d (with sentinel: %d). Found %d LMS positions.", n, n + 1, lms.size()));
            trace.add("LMS positions: " + lms);
        }

        int[] sa = sais(s, maxChar + 1, isS, comparisons, trace);

        // Exclude sentinel (which will be at index 0)
        int[] finalSa = new int[n];
        for (int i = 1; i <= n; i++) {
            finalSa[i - 1] = sa[i];
        }

        String[] types = new String[n];
        for (int i = 0; i < n; i++) {
            types[i] = isS[i] ? "S" : "L";
        }

        return SaisResult.builder()
                .suffixArray(finalSa)
                .lmsPositions(lms)
                .typeArray(types)
                .comparisonCount(comparisons[0])
                .trace(trace)
                .build();
    }

    private int[] sais(int[] s, int alphabetSize, boolean[] isS, long[] comparisons, List<String> trace) {
        int n = s.length;
        int[] sa = new int[n];
        Arrays.fill(sa, -1);

        int[] bucket = new int[alphabetSize];
        for (int c : s) bucket[c]++;

        int[] lmsMap = new int[n];
        Arrays.fill(lmsMap, -1);
        int m = 0;
        for (int i = 1; i < n; i++) {
            if (isS[i] && !isS[i - 1]) {
                lmsMap[i] = m++;
            }
        }
        int[] lms = new int[m];
        for (int i = 1; i < n; i++) {
            if (lmsMap[i] != -1) {
                lms[lmsMap[i]] = i;
            }
        }

        // Induced sort LMS prefixes
        inducedSort(s, sa, isS, bucket, lms, alphabetSize, comparisons);

        if (m > 0) {
            // Summary string construction
            int[] sortedLms = new int[m];
            int p = 0;
            for (int v : sa) {
                if (v >= 0 && lmsMap[v] != -1) {
                    sortedLms[p++] = v;
                }
            }

            int[] recS = new int[m];
            int name = 0;
            recS[lmsMap[sortedLms[0]]] = 0;
            for (int i = 1; i < m; i++) {
                int prev = sortedLms[i - 1];
                int curr = sortedLms[i];
                boolean diff = false;
                for (int d = 0; d < n; d++) {
                    comparisons[0]++;
                    if (s[prev + d] != s[curr + d] || isS[prev + d] != isS[curr + d]) {
                        diff = true;
                        break;
                    }
                    if (d > 0 && (lmsMap[prev + d] != -1 || lmsMap[curr + d] != -1)) {
                        break;
                    }
                }
                if (diff) name++;
                recS[lmsMap[curr]] = name;
            }

            int[] recSa;
            if (name + 1 < m) {
                boolean[] recIsS = new boolean[m];
                recIsS[m - 1] = true;
                for (int i = m - 2; i >= 0; i--) {
                    if (recS[i] < recS[i + 1]) recIsS[i] = true;
                    else if (recS[i] > recS[i + 1]) recIsS[i] = false;
                    else recIsS[i] = recIsS[i + 1];
                }
                recSa = sais(recS, name + 1, recIsS, comparisons, trace);
            } else {
                recSa = new int[m];
                for (int i = 0; i < m; i++) recSa[recS[i]] = i;
            }

            for (int i = 0; i < m; i++) {
                sortedLms[i] = lms[recSa[i]];
            }
            Arrays.fill(sa, -1);
            inducedSort(s, sa, isS, bucket, sortedLms, alphabetSize, comparisons);
        }

        return sa;
    }

    private void inducedSort(int[] s, int[] sa, boolean[] isS, int[] bucket, int[] lms, int alphabetSize, long[] comparisons) {
        int n = s.length;
        int[] tail = getBucketEnds(bucket, alphabetSize);
        for (int i = lms.length - 1; i >= 0; i--) {
            int j = lms[i];
            sa[tail[s[j]]--] = j;
        }

        int[] head = getBucketStarts(bucket, alphabetSize);
        for (int i = 0; i < n; i++) {
            if (sa[i] > 0) {
                int j = sa[i] - 1;
                comparisons[0]++;
                if (!isS[j]) {
                    sa[head[s[j]]++] = j;
                }
            }
        }

        tail = getBucketEnds(bucket, alphabetSize);
        for (int i = n - 1; i >= 0; i--) {
            if (sa[i] > 0) {
                int j = sa[i] - 1;
                comparisons[0]++;
                if (isS[j]) {
                    sa[tail[s[j]]--] = j;
                }
            }
        }
    }

    private int[] getBucketStarts(int[] bucket, int alphabetSize) {
        int[] head = new int[alphabetSize];
        int sum = 0;
        for (int i = 0; i < alphabetSize; i++) {
            head[i] = sum;
            sum += bucket[i];
        }
        return head;
    }

    private int[] getBucketEnds(int[] bucket, int alphabetSize) {
        int[] tail = new int[alphabetSize];
        int sum = 0;
        for (int i = 0; i < alphabetSize; i++) {
            sum += bucket[i];
            tail[i] = sum - 1;
        }
        return tail;
    }
}
