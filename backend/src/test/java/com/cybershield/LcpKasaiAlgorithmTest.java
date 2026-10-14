package com.cybershield;

import com.cybershield.algorithms.suffix.LcpKasaiAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class LcpKasaiAlgorithmTest {

    private LcpKasaiAlgorithm kasai;

    @BeforeEach
    void setUp() {
        kasai = new LcpKasaiAlgorithm();
    }

    @Test
    void testKasaiLcpBanana() {
        String text = "banana";
        int[] sa = new int[]{5, 3, 1, 0, 4, 2};
        LcpKasaiAlgorithm.LcpResult result = kasai.compute(text, sa);

        int[] expectedLcp = new int[]{0, 1, 3, 0, 0, 2};
        assertArrayEquals(expectedLcp, result.getLcpArray());
    }
}
