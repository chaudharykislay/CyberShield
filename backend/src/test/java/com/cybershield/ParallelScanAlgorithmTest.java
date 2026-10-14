package com.cybershield;

import com.cybershield.algorithms.randomized.ParallelScanAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ParallelScanAlgorithmTest {

    private ParallelScanAlgorithm scan;

    @BeforeEach
    void setUp() {
        scan = new ParallelScanAlgorithm();
    }

    @Test
    void testExclusivePrefixSum() {
        // Input: [3, 1, 7, 0, 4, 1, 6, 3]
        // Exclusive Prefix Sum: [0, 3, 4, 11, 11, 15, 16, 22]
        List<Integer> input = List.of(3, 1, 7, 0, 4, 1, 6, 3);
        ParallelScanAlgorithm.ParallelScanResult result = scan.scan(input, "SUM");

        List<Integer> expected = List.of(0, 3, 4, 11, 11, 15, 16, 22);
        assertEquals(expected, result.getResult());
        assertFalse(result.getUpsweepLevels().isEmpty());
        assertFalse(result.getDownsweepLevels().isEmpty());
    }

    @Test
    void testNonPowerOfTwoSize() {
        List<Integer> input = List.of(1, 2, 3, 4, 5);
        ParallelScanAlgorithm.ParallelScanResult result = scan.scan(input, "SUM");

        // Exclusive prefix sum for [1, 2, 3, 4, 5] is [0, 1, 3, 6, 10]
        List<Integer> expected = List.of(0, 1, 3, 6, 10);
        assertEquals(expected, result.getResult());
    }
}
