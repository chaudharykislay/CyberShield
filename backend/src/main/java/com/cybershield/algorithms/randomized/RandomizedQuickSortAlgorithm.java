package com.cybershield.algorithms.randomized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class RandomizedQuickSortAlgorithm {

    private static final int MAX_PARTITIONS_TRACE = 200;
    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PartitionStep {
        private int pivotValue;
        private int leftBound;
        private int rightBound;
        private int finalPivotIndex;
        private long comparisons;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RandomizedSortResult {
        private List<Integer> sorted;
        private List<PartitionStep> partitions;
        private long totalComparisons;
        private List<String> trace;

        public List<Integer> getSortedArray() {
            return sorted;
        }

        public long getComparisons() {
            return totalComparisons;
        }
    }

    public RandomizedSortResult sort(List<Integer> array, Long seed) {
        List<String> trace = new ArrayList<>();
        List<PartitionStep> partitionSteps = new ArrayList<>();
        long[] comparisons = new long[]{0};

        if (array == null || array.isEmpty()) {
            return RandomizedSortResult.builder()
                    .sorted(Collections.emptyList())
                    .partitions(Collections.emptyList())
                    .totalComparisons(0)
                    .trace(trace)
                    .build();
        }

        List<Integer> list = new ArrayList<>(array);
        Random random = seed != null ? new Random(seed) : new Random();

        quickSort(list, 0, list.size() - 1, random, partitionSteps, comparisons, trace);

        return RandomizedSortResult.builder()
                .sorted(list)
                .partitions(partitionSteps)
                .totalComparisons(comparisons[0])
                .trace(trace)
                .build();
    }

    private void quickSort(List<Integer> list, int low, int high, Random random,
                           List<PartitionStep> partitionSteps, long[] comparisons, List<String> trace) {
        if (low < high) {
            int pivotIdx = low + random.nextInt(high - low + 1);
            // Swap pivot to high
            swap(list, pivotIdx, high);

            int pivotVal = list.get(high);
            int i = low - 1;
            long stepComps = 0;

            for (int j = low; j < high; j++) {
                comparisons[0]++;
                stepComps++;
                if (list.get(j) <= pivotVal) {
                    i++;
                    swap(list, i, j);
                }
            }
            swap(list, i + 1, high);
            int finalPivot = i + 1;

            if (partitionSteps.size() < MAX_PARTITIONS_TRACE) {
                partitionSteps.add(new PartitionStep(pivotVal, low, high, finalPivot, stepComps));
            }

            if (trace.size() < MAX_TRACE_SIZE) {
                trace.add(String.format("Partition [%d..%d]: pivot %d placed at index %d after %d comparisons",
                        low, high, pivotVal, finalPivot, stepComps));
            }

            quickSort(list, low, finalPivot - 1, random, partitionSteps, comparisons, trace);
            quickSort(list, finalPivot + 1, high, random, partitionSteps, comparisons, trace);
        }
    }

    private void swap(List<Integer> list, int i, int j) {
        int temp = list.get(i);
        list.set(i, list.get(j));
        list.set(j, temp);
    }
}
