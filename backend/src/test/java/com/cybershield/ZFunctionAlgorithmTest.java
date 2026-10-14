package com.cybershield;

import com.cybershield.algorithms.strings.ZFunctionAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ZFunctionAlgorithmTest {

    private ZFunctionAlgorithm zFunc;

    @BeforeEach
    void setUp() {
        zFunc = new ZFunctionAlgorithm();
    }

    @Test
    void testTypicalMatch() {
        String text = "GEEKS FOR GEEKS";
        String pattern = "GEEKS";
        ZFunctionAlgorithm.ZFunctionResult result = zFunc.search(text, pattern);
        assertEquals(List.of(0, 10), result.getMatchPositions());
    }

    @Test
    void testNoMatch() {
        String text = "ABCDEF";
        String pattern = "XYZ";
        ZFunctionAlgorithm.ZFunctionResult result = zFunc.search(text, pattern);
        assertTrue(result.getMatchPositions().isEmpty());
    }

    @Test
    void testOverlapping() {
        String text = "aaaa";
        String pattern = "aa";
        ZFunctionAlgorithm.ZFunctionResult result = zFunc.search(text, pattern);
        assertEquals(List.of(0, 1, 2), result.getMatchPositions());
    }

    @Test
    void testEmptyAndBoundary() {
        String text = "abc";
        String pattern = "";
        ZFunctionAlgorithm.ZFunctionResult result = zFunc.search(text, pattern);
        assertFalse(result.getMatchPositions().isEmpty());

        ZFunctionAlgorithm.ZFunctionResult longer = zFunc.search("abc", "abcdef");
        assertTrue(longer.getMatchPositions().isEmpty());
    }
}
