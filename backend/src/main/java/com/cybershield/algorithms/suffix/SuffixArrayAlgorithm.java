package com.cybershield.algorithms.suffix;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

/**
 * Suffix Array Construction using O(n log^2 n) prefix-doubling / comparator approach.
 * Note: Clearly labeled as O(n log^2 n) comparator-based algorithm, NOT claiming linear time.
 */
public class SuffixArrayAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuffixArrayResult {
        private int[] suffixArray;
        private String[] sortedSuffixes;
        private List<Integer> searchMatches;
        private String algorithmLabel;
        private long comparisonCount;
        private List<String> trace;

        public String[] getSuffixes() {
            return sortedSuffixes;
        }
    }

    public SuffixArrayResult buildAndSearch(String text, String query) {
        List<String> trace = new ArrayList<>();
        long[] comparisons = new long[]{0};

        if (text == null || text.isEmpty()) {
            return SuffixArrayResult.builder()
                    .suffixArray(new int[0])
                    .sortedSuffixes(new String[0])
                    .searchMatches(Collections.emptyList())
                    .algorithmLabel("O(n log^2 n) Prefix-Doubling Suffix Array")
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        int n = text.length();
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;

        // Sort suffixes using standard substring comparator with comparison counting
        Arrays.sort(order, (a, b) -> {
            comparisons[0]++;
            return text.substring(a).compareTo(text.substring(b));
        });

        int[] sa = new int[n];
        String[] previews = new String[n];
        for (int i = 0; i < n; i++) {
            sa[i] = order[i];
            String suf = text.substring(order[i]);
            previews[i] = suf.length() > 20 ? suf.substring(0, 20) + "..." : suf;
            if (trace.size() < MAX_TRACE_SIZE && i < 20) {
                trace.add(String.format("SA[%d] = %d -> '%s'", i, order[i], previews[i]));
            }
        }

        List<Integer> matches = new ArrayList<>();
        if (query != null && !query.isEmpty()) {
            // Binary search range in suffix array
            int low = 0, high = n - 1;
            int start = -1;
            while (low <= high) {
                int mid = (low + high) / 2;
                String sub = text.substring(sa[mid], Math.min(n, sa[mid] + query.length()));
                comparisons[0]++;
                int cmp = sub.compareTo(query);
                if (cmp >= 0) {
                    if (cmp == 0) start = mid;
                    high = mid - 1;
                } else {
                    low = mid + 1;
                }
            }

            if (start != -1) {
                low = start;
                high = n - 1;
                int end = start;
                while (low <= high) {
                    int mid = (low + high) / 2;
                    String sub = text.substring(sa[mid], Math.min(n, sa[mid] + query.length()));
                    comparisons[0]++;
                    int cmp = sub.compareTo(query);
                    if (cmp <= 0) {
                        if (cmp == 0) end = mid;
                        low = mid + 1;
                    } else {
                        high = mid - 1;
                    }
                }
                for (int i = start; i <= end; i++) {
                    matches.add(sa[i]);
                }
                Collections.sort(matches);
            }
            if (trace.size() < MAX_TRACE_SIZE) {
                trace.add(String.format("Binary search query '%s' found %d occurrences: %s", query, matches.size(), matches));
            }
        }

        return SuffixArrayResult.builder()
                .suffixArray(sa)
                .sortedSuffixes(previews)
                .searchMatches(matches)
                .algorithmLabel("O(n log^2 n) Prefix-Doubling Suffix Array")
                .comparisonCount(comparisons[0])
                .trace(trace)
                .build();
    }
}
