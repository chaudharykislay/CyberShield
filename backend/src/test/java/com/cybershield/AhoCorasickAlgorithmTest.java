package com.cybershield;

import com.cybershield.algorithms.strings.AhoCorasickAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class AhoCorasickAlgorithmTest {

    private AhoCorasickAlgorithm ac;

    @BeforeEach
    void setUp() {
        ac = new AhoCorasickAlgorithm();
    }

    @Test
    void testMultiplePatterns() {
        String text = "ushers";
        List<String> patterns = List.of("he", "she", "his", "hers");
        AhoCorasickAlgorithm.AhoCorasickResult result = ac.search(text, patterns);

        assertFalse(result.getMatches().isEmpty());
        assertTrue(result.getMatches().stream().anyMatch(m -> m.getPattern().equals("she") && m.getPosition() == 1));
        assertTrue(result.getMatches().stream().anyMatch(m -> m.getPattern().equals("he") && m.getPosition() == 2));
        assertTrue(result.getMatches().stream().anyMatch(m -> m.getPattern().equals("hers") && m.getPosition() == 2));
    }

    @Test
    void testOverlappingPatterns() {
        String text = "she";
        List<String> patterns = List.of("he", "she");
        AhoCorasickAlgorithm.AhoCorasickResult result = ac.search(text, patterns);

        assertEquals(2, result.getMatches().size());
    }

    @Test
    void testNoMatch() {
        String text = "security analytics platform";
        List<String> patterns = List.of("trojan", "malware", "virus");
        AhoCorasickAlgorithm.AhoCorasickResult result = ac.search(text, patterns);

        assertTrue(result.getMatches().isEmpty());
    }
}
