package com.cybershield;

import com.cybershield.algorithms.suffix.SaisAlgorithm;
import com.cybershield.algorithms.suffix.SuffixArrayAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SaisAlgorithmTest {

    private SaisAlgorithm sais;
    private SuffixArrayAlgorithm saComparator;

    @BeforeEach
    void setUp() {
        sais = new SaisAlgorithm();
        saComparator = new SuffixArrayAlgorithm();
    }

    @Test
    void testSaisBanana() {
        String text = "banana";
        SaisAlgorithm.SaisResult result = sais.compute(text);
        int[] expected = new int[]{5, 3, 1, 0, 4, 2};
        assertArrayEquals(expected, result.getSuffixArray());
    }

    @Test
    void testSaisMatchesComparator() {
        String text = "mississippi";
        SaisAlgorithm.SaisResult saisResult = sais.compute(text);
        SuffixArrayAlgorithm.SuffixArrayResult compResult = saComparator.buildAndSearch(text, null);

        assertArrayEquals(compResult.getSuffixArray(), saisResult.getSuffixArray());
    }
}
