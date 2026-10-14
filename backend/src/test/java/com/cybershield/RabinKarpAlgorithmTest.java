package com.cybershield;

import com.cybershield.algorithms.strings.RabinKarpAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class RabinKarpAlgorithmTest {

    private RabinKarpAlgorithm rk;

    @BeforeEach
    void setUp() {
        rk = new RabinKarpAlgorithm();
    }

    @Test
    void testMultipleMatches() {
        String text = "AABAACAADAABAABA";
        String pattern = "AABA";
        RabinKarpAlgorithm.RabinKarpResult result = rk.search(text, pattern);
        assertEquals(List.of(0, 9, 12), result.getMatchPositions());
    }

    @Test
    void testNoMatch() {
        String text = "HELLO WORLD";
        String pattern = "BYE";
        RabinKarpAlgorithm.RabinKarpResult result = rk.search(text, pattern);
        assertTrue(result.getMatchPositions().isEmpty());
    }

    @Test
    void testCollisionHandling() {
        String text = "ABRACADABRA";
        String pattern = "ABRA";
        RabinKarpAlgorithm.RabinKarpResult result = rk.search(text, pattern);
        assertEquals(List.of(0, 7), result.getMatchPositions());
        assertTrue(result.getComparisonCount() > 0);
    }
}
