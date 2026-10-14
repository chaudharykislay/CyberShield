package com.cybershield.algorithms.randomized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class ReservoirSamplingAlgorithm {

    private static final int MAX_CHANGES = 50;
    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservoirChange {
        private int step;
        private String element;
        private int replacedIndex;
        private List<String> reservoirSnapshot;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservoirResult {
        private List<String> finalReservoir;
        private List<ReservoirChange> reservoirChanges;
        private int streamSize;
        private int reservoirCapacity;
        private long comparisonCount;
        private List<String> trace;

        public List<String> getSample() {
            return finalReservoir;
        }
    }

    public ReservoirResult sample(List<?> stream, int reservoirSize, Long seed) {
        List<String> trace = new ArrayList<>();
        List<ReservoirChange> changes = new ArrayList<>();
        long comparisons = 0;

        if (stream == null || stream.isEmpty() || reservoirSize <= 0) {
            return ReservoirResult.builder()
                    .finalReservoir(Collections.emptyList())
                    .reservoirChanges(Collections.emptyList())
                    .streamSize(stream != null ? stream.size() : 0)
                    .reservoirCapacity(reservoirSize)
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        int k = reservoirSize;
        int n = stream.size();
        List<String> reservoir = new ArrayList<>(k);
        Random random = seed != null ? new Random(seed) : new Random();

        // Step 1: Fill first k elements
        int initialFill = Math.min(k, n);
        for (int i = 0; i < initialFill; i++) {
            reservoir.add(String.valueOf(stream.get(i)));
            comparisons++;
        }

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Initial reservoir filled with first %d elements: %s", initialFill, reservoir));
        }

        // Step 2: Stream remaining elements
        for (int i = k; i < n; i++) {
            comparisons++;
            String element = String.valueOf(stream.get(i));
            int j = random.nextInt(i + 1); // 0 <= j <= i

            if (j < k) {
                reservoir.set(j, element);
                if (changes.size() < MAX_CHANGES) {
                    changes.add(new ReservoirChange(i, element, j, new ArrayList<>(reservoir)));
                }
                if (trace.size() < MAX_TRACE_SIZE && changes.size() <= 20) {
                    trace.add(String.format("Step %d: stream element '%s' replaced reservoir index %d (prob %d/%d)",
                            i, element, j, k, i + 1));
                }
            }
        }

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Reservoir sampling completed. Uniform sample of size %d drawn from stream of %d items.",
                    reservoir.size(), n));
        }

        return ReservoirResult.builder()
                .finalReservoir(reservoir)
                .reservoirChanges(changes)
                .streamSize(n)
                .reservoirCapacity(k)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }
}
