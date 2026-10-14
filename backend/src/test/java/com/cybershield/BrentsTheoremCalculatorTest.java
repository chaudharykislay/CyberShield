package com.cybershield;

import com.cybershield.algorithms.randomized.BrentsTheoremCalculator;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class BrentsTheoremCalculatorTest {

    @Test
    void testBrentsBoundCalculation() {
        BrentsTheoremCalculator calc = new BrentsTheoremCalculator();
        // W = 1000, D = 10, p = 10
        // T_p <= (1000 - 10)/10 + 10 = 99 + 10 = 109
        BrentsTheoremCalculator.BrentsResult result = calc.calculate(1000L, 10L, 10);

        assertEquals(109.0, result.getTheoreticalTime(), 0.001);
        assertEquals(1000.0 / 109.0, result.getTheoreticalSpeedup(), 0.001);
        assertTrue(result.getTheoreticalEfficiency() <= 1.0);
    }
}
