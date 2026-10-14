package com.cybershield.algorithms.randomized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class LasVegasExample {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LasVegasResult {
        private List<Integer> originalArray;
        private List<Integer> sortedArray;
        private boolean isVerifiedSorted;
        private long comparisons;
        private String algorithmParadigm;
        private String correctnessGuarantee;
        private String runtimeGuarantee;
        private List<String> explanation;
    }

    public LasVegasResult runQuicksortDemo(List<Integer> input, Long seed) {
        if (input == null || input.isEmpty()) {
            input = List.of(42, 17, 89, 5, 23, 99, 1, 64, 33, 12, 78);
        }

        RandomizedQuickSortAlgorithm sorter = new RandomizedQuickSortAlgorithm();
        RandomizedQuickSortAlgorithm.RandomizedSortResult sortResult = sorter.sort(input, seed);

        // Verify sorted output
        boolean sorted = true;
        for (int i = 0; i < sortResult.getSorted().size() - 1; i++) {
            if (sortResult.getSorted().get(i) > sortResult.getSorted().get(i + 1)) {
                sorted = false;
                break;
            }
        }

        List<String> explanation = new ArrayList<>();
        explanation.add("Las Vegas Paradigm: Guaranteed 100% exact and correct answer upon completion; probabilistic runtime.");
        explanation.add(String.format("Randomized pivot choices ensure expected time is O(n log n) across all input permutations."));
        explanation.add(String.format("Sorted %d elements with %d comparison operations. Verification passed: %b.",
                input.size(), sortResult.getTotalComparisons(), sorted));

        return LasVegasResult.builder()
                .originalArray(input)
                .sortedArray(sortResult.getSorted())
                .isVerifiedSorted(sorted)
                .comparisons(sortResult.getTotalComparisons())
                .algorithmParadigm("LAS_VEGAS")
                .correctnessGuarantee("DETERMINISTIC / EXACT: 100% correctness strictly guaranteed by algorithm invariants.")
                .runtimeGuarantee("PROBABILISTIC: Expected runtime O(n log n), worst-case O(n^2) with probability 1/n!.")
                .explanation(explanation)
                .build();
    }
}
