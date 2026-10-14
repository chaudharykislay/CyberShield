package com.cybershield.algorithms.randomized;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MillerRabinAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MillerRabinRound {
        private int round;
        private long witness;
        private boolean passed;
        private String details;

        public MillerRabinRound(long witness, boolean passed, String details) {
            this(0, witness, passed, details);
        }

        public long getBase() {
            return witness;
        }

        public boolean isWitnessFound() {
            return !passed;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MillerRabinResult {
        private long number;
        private boolean isProbablePrime;
        private double confidence;
        private List<MillerRabinRound> roundResults;
        private long comparisonCount;
        private List<String> trace;

        public boolean getIsPrime() {
            return isProbablePrime;
        }

        public List<MillerRabinRound> getRounds() {
            return roundResults;
        }
    }

    public MillerRabinResult testPrimality(long n, int rounds, Long seed) {
        List<String> trace = new ArrayList<>();
        List<MillerRabinRound> roundResults = new ArrayList<>();
        long comparisons = 0;

        if (n <= 1) {
            trace.add(n + " <= 1 is composite.");
            return MillerRabinResult.builder()
                    .number(n)
                    .isProbablePrime(false)
                    .confidence(1.0)
                    .roundResults(roundResults)
                    .comparisonCount(1)
                    .trace(trace)
                    .build();
        }
        if (n == 2 || n == 3) {
            trace.add(n + " is prime.");
            return MillerRabinResult.builder()
                    .number(n)
                    .isProbablePrime(true)
                    .confidence(1.0)
                    .roundResults(roundResults)
                    .comparisonCount(1)
                    .trace(trace)
                    .build();
        }
        if (n % 2 == 0) {
            trace.add(n + " is even (>2), therefore composite.");
            return MillerRabinResult.builder()
                    .number(n)
                    .isProbablePrime(false)
                    .confidence(1.0)
                    .roundResults(roundResults)
                    .comparisonCount(1)
                    .trace(trace)
                    .build();
        }

        // Write n - 1 as 2^s * d with d odd
        long d = n - 1;
        int s = 0;
        while ((d & 1) == 0) {
            d >>= 1;
            s++;
        }

        trace.add(String.format("Decomposition: %d - 1 = 2^%d * %d", n, s, d));

        Random random = seed != null ? new Random(seed) : new Random();
        BigInteger bigN = BigInteger.valueOf(n);
        BigInteger bigD = BigInteger.valueOf(d);
        BigInteger bigNMinusOne = BigInteger.valueOf(n - 1);

        boolean probablyPrime = true;

        for (int r = 0; r < rounds; r++) {
            comparisons++;
            // Generate random base a in [2, n - 2]
            long a = 2 + (Math.abs(random.nextLong()) % (n - 3));
            BigInteger bigA = BigInteger.valueOf(a);

            BigInteger x = bigA.modPow(bigD, bigN);

            if (x.equals(BigInteger.ONE) || x.equals(bigNMinusOne)) {
                roundResults.add(new MillerRabinRound(r + 1, a, true, String.format("a^d mod n == %s (trivial pass)", x)));
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Round %d: witness a=%d passed (a^d mod n == %s)", r + 1, a, x));
                }
                continue;
            }

            boolean composite = true;
            for (int rExp = 1; rExp < s; rExp++) {
                comparisons++;
                x = x.modPow(BigInteger.valueOf(2), bigN);
                if (x.equals(bigNMinusOne)) {
                    composite = false;
                    break;
                }
            }

            if (composite) {
                probablyPrime = false;
                roundResults.add(new MillerRabinRound(r + 1, a, false, "Witness proved n is composite"));
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Round %d: witness a=%d definitively proved %d is composite", r + 1, a, n));
                }
                break;
            } else {
                roundResults.add(new MillerRabinRound(r + 1, a, true, "x^2 mod n == n - 1 passed"));
                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Round %d: witness a=%d passed via quadratic residue -1", r + 1, a));
                }
            }
        }

        double confidence = probablyPrime ? 1.0 - Math.pow(0.25, rounds) : 1.0;

        return MillerRabinResult.builder()
                .number(n)
                .isProbablePrime(probablyPrime)
                .confidence(confidence)
                .roundResults(roundResults)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }
}
