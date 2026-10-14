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
public class FlowEdgeDto {

    @Min(0)
    private int from;

    @Min(0)
    private int to;

    @Min(value = 1, message = "Capacity must be positive")
    @Max(value = 100000, message = "Capacity cannot exceed 100,000")
    private int capacity;
}
