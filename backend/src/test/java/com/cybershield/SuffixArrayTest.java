package com.cybershield;

import com.cybershield.algorithms.suffix.SuffixArrayAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class SuffixArrayTest {

    private SuffixArrayAlgorithm sa;

    @BeforeEach
    void setUp() {
        sa = new SuffixArrayAlgorithm();
    }

    @Test
    void testVerifySortedOrder() {
        String text = "banana";
        // Suffixes:
        // 0: banana
        // 1: anana
        // 2: nana
        // 3: ana
        // 4: na
        // 5: a
        // Sorted:
        // 5: a
        // 3: ana
        // 1: anana
        // 0: banana
        // 4: na
        // 2: nana
        SuffixArrayAlgorithm.SuffixArrayResult result = sa.buildAndSearch(text, "an");
        int[] expectedSA = new int[]{5, 3, 1, 0, 4, 2};
        assertArrayEquals(expectedSA, result.getSuffixArray());
    }

    @Test
    void testBinarySearch() {
        String text = "banana";
        SuffixArrayAlgorithm.SuffixArrayResult result = sa.buildAndSearch(text, "an");
        // "an" appears at index 1 ("anana") and index 3 ("ana")
        assertEquals(List.of(1, 3), result.getSearchMatches());
    }

    @Test
    void testSearchNoMatch() {
        String text = "banana";
        SuffixArrayAlgorithm.SuffixArrayResult result = sa.buildAndSearch(text, "xyz");
        assertTrue(result.getSearchMatches().isEmpty());
    }
}
