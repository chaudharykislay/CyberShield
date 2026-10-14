package com.cybershield.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionMetrics {
    private long executionTimeNanos;
    private long comparisonCount;
    private long inputSize;
}
