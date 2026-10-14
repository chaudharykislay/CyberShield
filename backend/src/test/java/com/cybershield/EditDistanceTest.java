package com.cybershield;

import com.cybershield.algorithms.dp.EditDistanceAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EditDistanceTest {

    private EditDistanceAlgorithm ed;

    @BeforeEach
    void setUp() {
        ed = new EditDistanceAlgorithm();
    }

    @Test
    void testLevenshtein_classic() {
        EditDistanceAlgorithm.EditDistanceResult result =
                ed.compute("kitten", "sitting", "LEVENSHTEIN", 1, 1, 1);
        assertEquals(3, result.getDistance());
        assertFalse(result.getEditScript().isEmpty());
    }

    @Test
    void testLevenshtein_empty() {
        EditDistanceAlgorithm.EditDistanceResult result =
                ed.compute("", "cyber", "LEVENSHTEIN", 1, 1, 1);
        assertEquals(5, result.getDistance());

        EditDistanceAlgorithm.EditDistanceResult result2 =
                ed.compute("cyber", "", "LEVENSHTEIN", 1, 1, 1);
        assertEquals(5, result2.getDistance());
    }

    @Test
    void testDamerauOSA_transposition() {
        // Under classic Levenshtein, "CA" to "AC" is 2 operations (substitute or del+ins).
        // Under Damerau OSA transposition, it is 1 operation.
        EditDistanceAlgorithm.EditDistanceResult lev =
                ed.compute("CA", "AC", "LEVENSHTEIN", 1, 1, 1);
        assertEquals(2, lev.getDistance());

        EditDistanceAlgorithm.EditDistanceResult osa =
                ed.compute("CA", "AC", "DAMERAU_OSA", 1, 1, 1);
        assertEquals(1, osa.getDistance());
    }

    @Test
    void testWeightedEditDistance() {
        // With high substitution cost (e.g. 5), delete + insert (1 + 1 = 2) should be favored over substitution
        EditDistanceAlgorithm.EditDistanceResult result =
                ed.compute("a", "b", "WEIGHTED", 1, 1, 5);
        assertEquals(2, result.getDistance());
    }
}
