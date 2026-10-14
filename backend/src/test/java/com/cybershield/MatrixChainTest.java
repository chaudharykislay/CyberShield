package com.cybershield;

import com.cybershield.algorithms.dp.MatrixChainAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class MatrixChainTest {

    private MatrixChainAlgorithm mca;

    @BeforeEach
    void setUp() {
        mca = new MatrixChainAlgorithm();
    }

    @Test
    void testKnownCLRSExample() {
        // Standard CLRS Matrix Chain Multiplication example:
        // A1: 30x35, A2: 35x15, A3: 15x5, A4: 5x10, A5: 10x20, A6: 20x25
        int[] p = new int[]{30, 35, 15, 5, 10, 20, 25};
        MatrixChainAlgorithm.MatrixChainResult result = mca.compute(p);

        assertEquals(15125L, result.getMinOperations());
        assertNotNull(result.getOptimalParenthesization());
        assertTrue(result.getOptimalParenthesization().contains("A1"));
    }

    @Test
    void testSingleMatrix() {
        int[] p = new int[]{10, 20};
        MatrixChainAlgorithm.MatrixChainResult result = mca.compute(p);
        assertEquals(0L, result.getMinOperations());
    }

    @Test
    void testThreeMatrices() {
        // A1: 10x100, A2: 100x5, A3: 5x50
        // (A1 x A2) x A3 = 10*100*5 + 10*5*50 = 5000 + 2500 = 7500
        // A1 x (A2 x A3) = 100*5*50 + 10*100*50 = 25000 + 50000 = 75000
        int[] p = new int[]{10, 100, 5, 50};
        MatrixChainAlgorithm.MatrixChainResult result = mca.compute(p);
        assertEquals(7500L, result.getMinOperations());
    }
}
