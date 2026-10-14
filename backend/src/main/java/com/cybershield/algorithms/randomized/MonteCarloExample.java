package com.cybershield.algorithms.randomized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MonteCarloExample {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonteCarloResult {
        private int totalSamples;
        private int insideCircleCount;
        private double estimatedPi;
        private double actualPi;
        private double absoluteError;
        private String algorithmParadigm;
        private String correctnessGuarantee;
        private String runtimeGuarantee;
        private List<String> explanation;
    }

    public MonteCarloResult estimatePi(int samples, Long seed) {
        if (samples <= 0) samples = 10000;
        if (samples > 1000000) samples = 1000000;

        Random random = seed != null ? new Random(seed) : new Random();
        int inside = 0;

        for (int i = 0; i < samples; i++) {
            double x = random.nextDouble();
            double y = random.nextDouble();
            if (x * x + y * y <= 1.0) {
                inside++;
            }
        }

        double estimated = 4.0 * inside / samples;
        double error = Math.abs(Math.PI - estimated);

        List<String> explanation = new ArrayList<>();
        explanation.add("Monte Carlo Paradigm: Deterministic execution time, probabilistic outcome accuracy.");
        explanation.add(String.format("Generated %d uniformly distributed 2D points in [0, 1]x[0, 1].", samples));
        explanation.add(String.format("%d points fell within the quadrant of the unit circle (x^2 + y^2 <= 1).", inside));
        explanation.add(String.format("Estimated Pi = 4 * (%d / %d) = %.6f (Error: %.6f).", inside, samples, estimated, error));

        return MonteCarloResult.builder()
                .totalSamples(samples)
                .insideCircleCount(inside)
                .estimatedPi(estimated)
                .actualPi(Math.PI)
                .absoluteError(error)
                .algorithmParadigm("MONTE_CARLO")
                .correctnessGuarantee("PROBABILISTIC: Accuracy bounded by law of large numbers / Chebyshev inequality (O(1/sqrt(N))).")
                .runtimeGuarantee("DETERMINISTIC: Guaranteed exactly O(N) operations and fixed termination time.")
                .explanation(explanation)
                .build();
    }
}
