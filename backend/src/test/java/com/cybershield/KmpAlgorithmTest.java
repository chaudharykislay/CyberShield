package com.cybershield;

import com.cybershield.algorithms.strings.KmpAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class KmpAlgorithmTest {

    private KmpAlgorithm kmp;

    @BeforeEach
    void setUp() {
        kmp = new KmpAlgorithm();
    }

    @Test
    void testTypicalMatch() {
        String text = "ABABDABACDABABCABAB";
        String pattern = "ABABCABAB";
        KmpAlgorithm.KmpResult result = kmp.search(text, pattern);
        assertEquals(List.of(10), result.getMatchPositions());
        assertTrue(result.getComparisonCount() > 0);
    }

    @Test
    void testNoMatch() {
        String text = "ABCDEFGHIJ";
        String pattern = "XYZ";
        KmpAlgorithm.KmpResult result = kmp.search(text, pattern);
        assertTrue(result.getMatchPositions().isEmpty());
    }

    @Test
    void testOverlappingMatches() {
        String text = "aaaa";
        String pattern = "aa";
        KmpAlgorithm.KmpResult result = kmp.search(text, pattern);
        assertEquals(List.of(0, 1, 2), result.getMatchPositions());
    }

    @Test
    void testEmptyPattern() {
        String text = "sample";
        String pattern = "";
        KmpAlgorithm.KmpResult result = kmp.search(text, pattern);
        assertFalse(result.getMatchPositions().isEmpty());
    }

    @Test
    void testPatternLongerThanText() {
        String text = "abc";
        String pattern = "abcdefg";
        KmpAlgorithm.KmpResult result = kmp.search(text, pattern);
        assertTrue(result.getMatchPositions().isEmpty());
    }

    @Test
    void testSingleCharPattern() {
        String text = "banana";
        String pattern = "a";
        KmpAlgorithm.KmpResult result = kmp.search(text, pattern);
        assertEquals(List.of(1, 3, 5), result.getMatchPositions());
    }

    @Test
    void testRepeatedCharacters() {
        String text = "ABABABAB";
        String pattern = "ABAB";
        KmpAlgorithm.KmpResult result = kmp.search(text, pattern);
        assertEquals(List.of(0, 2, 4), result.getMatchPositions());
    }
}
