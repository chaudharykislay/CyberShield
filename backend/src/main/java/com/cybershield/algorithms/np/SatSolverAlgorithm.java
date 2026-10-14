package com.cybershield.algorithms.np;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

/**
 * DPLL (Davis-Putnam-Logemann-Loveland) SAT Solver.
 * Provides complete, sound, and exhaustive SAT solving up to 20 variables.
 * Note: Never claims UNSAT from heuristic failure; only proves UNSAT by exhaustive search space refutation.
 */
public class SatSolverAlgorithm {

    private static final int MAX_TRACE_SIZE = 500;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SatResult {
        private boolean satisfiable;
        private Map<Integer, Boolean> assignment;
        private int statesExplored;
        private long comparisonCount;
        private List<String> trace;
    }

    public SatResult solve(int numVariables, List<List<Integer>> clauses) {
        List<String> trace = new ArrayList<>();
        long[] comparisons = new long[]{0};
        int[] statesExplored = new int[]{0};

        if (clauses == null || clauses.isEmpty()) {
            Map<Integer, Boolean> trivial = new HashMap<>();
            for (int i = 1; i <= numVariables; i++) trivial.put(i, true);
            trace.add("No clauses provided: formula is trivially SAT.");
            return SatResult.builder()
                    .satisfiable(true)
                    .assignment(trivial)
                    .statesExplored(1)
                    .comparisonCount(0)
                    .trace(trace)
                    .build();
        }

        if (numVariables > 20) {
            throw new IllegalArgumentException("Variable count cannot exceed 20 for exhaustive SAT solver");
        }

        Map<Integer, Boolean> assignment = new HashMap<>();
        boolean sat = dpll(clauses, assignment, numVariables, statesExplored, comparisons, trace);

        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("DPLL concluded: %s after exploring %d search nodes",
                    sat ? "SATISFIABLE" : "UNSATISFIABLE (exhaustive proof)", statesExplored[0]));
        }

        return SatResult.builder()
                .satisfiable(sat)
                .assignment(sat ? assignment : Collections.emptyMap())
                .statesExplored(statesExplored[0])
                .comparisonCount(comparisons[0])
                .trace(trace)
                .build();
    }

    private boolean dpll(List<List<Integer>> clauses, Map<Integer, Boolean> assignment,
                         int numVars, int[] statesExplored, long[] comparisons, List<String> trace) {
        statesExplored[0]++;

        // Simplify clauses under current assignment
        List<List<Integer>> simplified = new ArrayList<>();
        for (List<Integer> clause : clauses) {
            boolean clauseSatisfied = false;
            List<Integer> remainingLits = new ArrayList<>();

            for (int lit : clause) {
                comparisons[0]++;
                int var = Math.abs(lit);
                boolean sign = lit > 0;

                if (assignment.containsKey(var)) {
                    if (assignment.get(var) == sign) {
                        clauseSatisfied = true;
                        break;
                    }
                } else {
                    remainingLits.add(lit);
                }
            }

            if (!clauseSatisfied) {
                if (remainingLits.isEmpty()) {
                    // Empty clause -> conflict
                    return false;
                }
                simplified.add(remainingLits);
            }
        }

        // If all clauses satisfied
        if (simplified.isEmpty()) {
            // Fill unassigned variables arbitrarily
            for (int i = 1; i <= numVars; i++) {
                assignment.putIfAbsent(i, true);
            }
            return true;
        }

        // Unit propagation
        for (List<Integer> clause : simplified) {
            if (clause.size() == 1) {
                int unitLit = clause.get(0);
                int var = Math.abs(unitLit);
                boolean val = unitLit > 0;
                assignment.put(var, val);

                if (trace.size() < MAX_TRACE_SIZE) {
                    trace.add(String.format("Unit propagation: assigned v%d = %b", var, val));
                }

                boolean ok = dpll(clauses, assignment, numVars, statesExplored, comparisons, trace);
                if (ok) return true;
                assignment.remove(var);
                return false;
            }
        }

        // Branching: pick first unassigned variable
        int branchVar = -1;
        for (int i = 1; i <= numVars; i++) {
            if (!assignment.containsKey(i)) {
                branchVar = i;
                break;
            }
        }

        if (branchVar == -1) return false;

        // Try true branch
        assignment.put(branchVar, true);
        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Branching: trying v%d = true", branchVar));
        }
        if (dpll(clauses, assignment, numVars, statesExplored, comparisons, trace)) {
            return true;
        }

        // Backtrack and try false branch
        assignment.put(branchVar, false);
        if (trace.size() < MAX_TRACE_SIZE) {
            trace.add(String.format("Backtracking: trying v%d = false", branchVar));
        }
        if (dpll(clauses, assignment, numVars, statesExplored, comparisons, trace)) {
            return true;
        }

        // Backtrack
        assignment.remove(branchVar);
        return false;
    }
}
