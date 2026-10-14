package com.cybershield.algorithms.dp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

/**
 * Bitmask Dynamic Programming for Minimum Cost Security Rule Activation.
 * Given M policies (0..M-1) and N security rules (each covering a subset of policies with a cost),
 * finds the minimum cost subset of rules that covers all required policies.
 */
public class BitmaskDpAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;
    private static final long INF = Long.MAX_VALUE / 4;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SecurityRuleInput {
        @com.fasterxml.jackson.annotation.JsonAlias({"id", "ruleId"})
        private int ruleId;
        private String name;
        private long cost;
        private List<Integer> coveredPolicies; // 0-based policy indices

        public SecurityRuleInput(int ruleId, long cost, List<Integer> coveredPolicies) {
            this(ruleId, "Rule-" + ruleId, cost, coveredPolicies);
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BitmaskDpResult {
        private long minCost;
        private List<Integer> selectedRules;
        private int dpStatesExplored;
        private int targetMask;
        private boolean fullyCovered;
        private long comparisonCount;
        private List<String> trace;

        public int getStatesExplored() {
            return dpStatesExplored;
        }
    }

    public BitmaskDpResult solve(int numPolicies, List<SecurityRuleInput> rules) {
        List<String> trace = new ArrayList<>();
        long comparisons = 0;

        if (numPolicies <= 0 || rules == null || rules.isEmpty()) {
            return BitmaskDpResult.builder()
                    .minCost(0)
                    .selectedRules(Collections.emptyList())
                    .dpStatesExplored(0)
                    .targetMask(0)
                    .fullyCovered(numPolicies == 0)
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        if (numPolicies > 20) {
            throw new IllegalArgumentException("Number of policies cannot exceed 20 for bitmask DP");
        }
        if (rules.size() > 20) {
            throw new IllegalArgumentException("Number of rules cannot exceed 20");
        }

        int targetMask = (1 << numPolicies) - 1;
        int totalStates = 1 << numPolicies;

        long[] dp = new long[totalStates];
        Arrays.fill(dp, INF);
        dp[0] = 0;

        int[] parentMask = new int[totalStates];
        int[] ruleUsed = new int[totalStates];
        Arrays.fill(parentMask, -1);
        Arrays.fill(ruleUsed, -1);

        int statesExplored = 0;

        // Precompute bitmasks for each rule
        int nRules = rules.size();
        int[] ruleMasks = new int[nRules];
        long[] ruleCosts = new long[nRules];

        for (int i = 0; i < nRules; i++) {
            SecurityRuleInput r = rules.get(i);
            ruleCosts[i] = r.getCost();
            int mask = 0;
            if (r.getCoveredPolicies() != null) {
                for (int p : r.getCoveredPolicies()) {
                    if (p >= 0 && p < numPolicies) {
                        mask |= (1 << p);
                    }
                }
            }
            ruleMasks[i] = mask;
            if (trace.size() < MAX_TRACE_SIZE) {
                trace.add(String.format("Rule %d (id=%d) mask=0x%s covers policies %s with cost %d",
                        i, r.getRuleId(), Integer.toBinaryString(mask), r.getCoveredPolicies(), r.getCost()));
            }
        }

        for (int mask = 0; mask < totalStates; mask++) {
            if (dp[mask] == INF) continue;
            statesExplored++;

            for (int r = 0; r < nRules; r++) {
                comparisons++;
                int nextMask = mask | ruleMasks[r];
                long newCost = dp[mask] + ruleCosts[r];

                if (newCost < dp[nextMask]) {
                    dp[nextMask] = newCost;
                    parentMask[nextMask] = mask;
                    ruleUsed[nextMask] = rules.get(r).getRuleId();

                    if (trace.size() < MAX_TRACE_SIZE && statesExplored <= 50) {
                        trace.add(String.format("Updated mask 0x%s -> 0x%s via rule %d, cost: %d",
                                Integer.toBinaryString(mask), Integer.toBinaryString(nextMask), rules.get(r).getRuleId(), newCost));
                    }
                }
            }
        }

        boolean covered = dp[targetMask] < INF;
        long minCost = covered ? dp[targetMask] : -1;

        // Reconstruct solution
        List<Integer> selectedRules = new ArrayList<>();
        if (covered) {
            int curr = targetMask;
            while (curr > 0 && parentMask[curr] != -1) {
                selectedRules.add(ruleUsed[curr]);
                curr = parentMask[curr];
            }
            Collections.reverse(selectedRules);
        }

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Bitmask DP completed. Target mask: 0x%s, minCost: %d, selected rules: %s",
                    Integer.toBinaryString(targetMask), minCost, selectedRules));
        }

        return BitmaskDpResult.builder()
                .minCost(minCost)
                .selectedRules(selectedRules)
                .dpStatesExplored(statesExplored)
                .targetMask(targetMask)
                .fullyCovered(covered)
                .comparisonCount(comparisons)
                .trace(trace)
                .build();
    }
}
