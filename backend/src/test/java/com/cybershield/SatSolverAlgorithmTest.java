package com.cybershield;

import com.cybershield.algorithms.np.SatSolverAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class SatSolverAlgorithmTest {

    private SatSolverAlgorithm solver;

    @BeforeEach
    void setUp() {
        solver = new SatSolverAlgorithm();
    }

    @Test
    void testSatisfiableFormula() {
        // (x1 or x2) and (not x1 or x2)
        List<List<Integer>> clauses = List.of(
                List.of(1, 2),
                List.of(-1, 2)
        );
        SatSolverAlgorithm.SatResult result = solver.solve(2, clauses);
        assertTrue(result.isSatisfiable());
        assertTrue(result.getAssignment().get(2)); // x2 must be true
    }

    @Test
    void testUnsatisfiableFormula() {
        // (x1) and (not x1)
        List<List<Integer>> clauses = List.of(
                List.of(1),
                List.of(-1)
        );
        SatSolverAlgorithm.SatResult result = solver.solve(1, clauses);
        assertFalse(result.isSatisfiable());
        assertTrue(result.getAssignment().isEmpty());
    }

    @Test
    void test3SatSatisfiable() {
        // (x1 or x2 or x3) and (not x1 or not x2 or x3) and (x1 or not x3)
        List<List<Integer>> clauses = List.of(
                List.of(1, 2, 3),
                List.of(-1, -2, 3),
                List.of(1, -3)
        );
        SatSolverAlgorithm.SatResult result = solver.solve(3, clauses);
        assertTrue(result.isSatisfiable());
    }
}
