package com.cybershield.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonteCarloRequest {

    @Min(value = 100, message = "Samples must be at least 100")
    @Max(value = 1_000_000, message = "Samples cannot exceed 1,000,000")
    @Builder.Default
    private int samples = 50000;

    private Long seed;
}
