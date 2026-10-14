package com.cybershield.algorithms.randomized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Parallel Blelloch Exclusive Prefix Scan Algorithm Visualization.
 * Work O(n), Span (Depth) O(log n).
 */
public class ParallelScanAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScanLevel {
        private String phase; // UPSWEEP or DOWNSWEEP
        private int level;
        private int stepStride;
        private int[] arrayState;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParallelScanResult {
        private List<Integer> result;
        private List<ScanLevel> upsweepLevels;
        private List<ScanLevel> downsweepLevels;
        private int parallelDepth;
        private String workEfficiency;
        private String operation;
        private long comparisonCount;
        private List<String> trace;

        public List<Integer> getPrefixSums() {
            return result;
        }

        public int getDepth() {
            return parallelDepth;
        }

        public int getWork() {
            return result != null ? 2 * result.size() : 0;
        }
    }

    public ParallelScanResult scan(List<Integer> array, String operation) {
        List<String> trace = new ArrayList<>();
        List<ScanLevel> upsweep = new ArrayList<>();
        List<ScanLevel> downsweep = new ArrayList<>();
        long comparisons = 0;

        if (array == null || array.isEmpty()) {
            return ParallelScanResult.builder()
                    .result(Collections.emptyList())
                    .upsweepLevels(upsweep)
                    .downsweepLevels(downsweep)
                    .parallelDepth(0)
                    .workEfficiency("O(n) work, O(log n) depth")
                    .operation(operation)
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        String op = operation != null ? operation.toUpperCase() : "SUM";

        // Pad to next power of 2
        int origN = array.size();
        int n = 1;
        while (n < origN) n <<= 1;

        int[] a = new int[n];
        int identity = getIdentity(op);
        Arrays.fill(a, identity);
        for (int i = 0; i < origN; i++) {
            a[i] = array.get(i);
        }

        int depth = (int) (Math.log(n) / Math.log(2));

        // 1. Upsweep (Reduction Phase)
        int levelNum = 0;
        for (int d = 1; d < n; d *= 2) {
            int stride = 2 * d;
            for (int k = 0; k < n; k += stride) {
                int left = k + d - 1;
                int right = k + 2 * d - 1;
                a[right] = applyOp(a[left], a[right], op);
                comparisons++;
            }
            upsweep.add(new ScanLevel("UPSWEEP", levelNum++, d, Arrays.copyOf(a, n)));
            if (trace.size() < MAX_TRACE_SIZE) {
                trace.add(String.format("Upsweep step stride %d: root sums forming at 2^k intervals", d));
            }
        }

        // Set last element to identity
        a[n - 1] = identity;

        // 2. Downsweep Phase
        levelNum = 0;
        for (int d = n / 2; d >= 1; d /= 2) {
            int stride = 2 * d;
            for (int k = 0; k < n; k += stride) {
                int left = k + d - 1;
                int right = k + 2 * d - 1;
                int temp = a[left];
                a[left] = a[right];
                a[right] = applyOp(temp, a[right], op);
                comparisons++;
            }
            downsweep.add(new ScanLevel("DOWNSWEEP", levelNum++, d, Arrays.copyOf(a, n)));
            if (trace.size() < MAX_TRACE_SIZE) {
                trace.add(String.format("Downsweep step stride %d: partial sums distributed downwards", d));
            }
        }

        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < origN; i++) {
            result.add(a[i]);
        }

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Exclusive prefix scan completed for op %s across %d elements (padded to %d).",
                    op, origN, n));
        }

        return ParallelScanResult.builder()
                .result(result)
                .upsweepLevels(upsweep)
                .downsweepLevels(downsweep)
                .parallelDepth(depth)
                .workEfficiency("Work = 2(n-1) ops: O(n) work-efficient; Span = 2 log2(n): O(log n)")
                .operation(op)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }

    private int applyOp(int x, int y, String op) {
        return switch (op) {
            case "MAX" -> Math.max(x, y);
            case "MIN" -> Math.min(x, y);
            case "AND" -> x & y;
            case "OR" -> x | y;
            default -> x + y; // SUM
        };
    }

    private int getIdentity(String op) {
        return switch (op) {
            case "MAX" -> Integer.MIN_VALUE;
            case "MIN" -> Integer.MAX_VALUE;
            case "AND" -> ~0;
            case "OR" -> 0;
            default -> 0;
        };
    }
}
