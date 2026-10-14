package com.cybershield.algorithms.randomized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Brent's Theorem Work-Time Scheduling Framework Calculator.
 *
 * NOTE: Clearly labeled as a theoretical model estimate:
 * Brent's Theorem states that an algorithm with total work W and span (depth) D
 * executed on p processors completes in time:
 *   T_p <= (W - D) / p + D  (or bounded by W / p + D)
 */
public class BrentsTheoremCalculator {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BrentsResult {
        private long totalWork;
        private long criticalPathDepth;
        private int processorCount;
        private double theoreticalTime;
        private double theoreticalSpeedup;
        private double theoreticalEfficiency;
        private String lowerBoundTime;
        private String modelType;
        private String formulaExplanation;
        private List<String> analysis;
    }

    public BrentsResult calculate(long work, long depth, int processors) {
        if (work <= 0 || depth <= 0 || processors <= 0) {
            throw new IllegalArgumentException("Work, depth, and processor count must all be positive");
        }

        // Brent's upper bound: T_p <= (W - D)/p + D
        double theoreticalTime = (double) (work - depth) / processors + depth;
        double speedup = (double) work / theoreticalTime;
        double efficiency = speedup / processors;
        double lowerBound = Math.max((double) work / processors, (double) depth);

        List<String> analysis = new ArrayList<>();
        analysis.add(String.format("Total computational work W = %d ops", work));
        analysis.add(String.format("Critical path span (depth) D = %d steps", depth));
        analysis.add(String.format("Number of parallel processing units p = %d", processors));
        analysis.add(String.format("Brent's schedule bound T_p <= (W - D)/p + D = (%.0f - %.0f)/%d + %.0f = %.2f steps",
                (double) work, (double) depth, processors, (double) depth, theoreticalTime));
        analysis.add(String.format("Theoretical speedup S_p = W / T_p = %.2fx", speedup));
        analysis.add(String.format("Parallel efficiency E_p = S_p / p = %.2f%%", efficiency * 100));

        return BrentsResult.builder()
                .totalWork(work)
                .criticalPathDepth(depth)
                .processorCount(processors)
                .theoreticalTime(theoreticalTime)
                .theoreticalSpeedup(speedup)
                .theoreticalEfficiency(efficiency)
                .lowerBoundTime(String.format("max(W/p, D) = %.2f", lowerBound))
                .modelType("THEORETICAL ESTIMATE (Brent's Theorem PRAM Model)")
                .formulaExplanation("T_p <= (W - D) / p + D. Represents the worst-case time for greedy scheduling on p processors without scheduling overhead.")
                .analysis(analysis)
                .build();
    }
}
