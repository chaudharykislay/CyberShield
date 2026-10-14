package com.cybershield;

import com.cybershield.algorithms.randomized.MillerRabinAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class MillerRabinAlgorithmTest {

    private MillerRabinAlgorithm mr;

    @BeforeEach
    void setUp() {
        mr = new MillerRabinAlgorithm();
    }

    @Test
    void testPrimes() {
        assertTrue(mr.testPrimality(2, 10, 42L).isProbablePrime());
        assertTrue(mr.testPrimality(3, 10, 42L).isProbablePrime());
        assertTrue(mr.testPrimality(17, 10, 42L).isProbablePrime());
        assertTrue(mr.testPrimality(97, 10, 42L).isProbablePrime());
        assertTrue(mr.testPrimality(10007, 10, 42L).isProbablePrime());
    }

    @Test
    void testComposites() {
        assertFalse(mr.testPrimality(1, 10, 42L).isProbablePrime());
        assertFalse(mr.testPrimality(4, 10, 42L).isProbablePrime());
        assertFalse(mr.testPrimality(15, 10, 42L).isProbablePrime());
        assertFalse(mr.testPrimality(100, 10, 42L).isProbablePrime());
        assertFalse(mr.testPrimality(561, 10, 42L).isProbablePrime()); // Carmichael number
    }
}
