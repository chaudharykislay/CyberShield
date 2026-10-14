package com.cybershield;

import com.cybershield.algorithms.dp.BitmaskDpAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class BitmaskDpAlgorithmTest {

    private BitmaskDpAlgorithm bitmaskDp;

    @BeforeEach
    void setUp() {
        bitmaskDp = new BitmaskDpAlgorithm();
    }

    @Test
    void testSecurityRuleCoverage() {
        // 3 policies: 0, 1, 2
        // Rule 1 (cost 10): covers {0, 1}
        // Rule 2 (cost 15): covers {1, 2}
        // Rule 3 (cost 20): covers {0, 2}
        // Rule 4 (cost 30): covers {0, 1, 2}
        // Optimal combination: Rule 1 (cost 10) + Rule 2 (cost 15) = 25 vs Rule 4 (cost 30)
        List<BitmaskDpAlgorithm.SecurityRuleInput> rules = List.of(
                new BitmaskDpAlgorithm.SecurityRuleInput(1, 10L, List.of(0, 1)),
                new BitmaskDpAlgorithm.SecurityRuleInput(2, 15L, List.of(1, 2)),
                new BitmaskDpAlgorithm.SecurityRuleInput(3, 20L, List.of(0, 2)),
                new BitmaskDpAlgorithm.SecurityRuleInput(4, 30L, List.of(0, 1, 2))
        );

        BitmaskDpAlgorithm.BitmaskDpResult result = bitmaskDp.solve(3, rules);

        assertTrue(result.isFullyCovered());
        assertEquals(25L, result.getMinCost());
        assertTrue(result.getSelectedRules().contains(1));
        assertTrue(result.getSelectedRules().contains(2));
    }
}
