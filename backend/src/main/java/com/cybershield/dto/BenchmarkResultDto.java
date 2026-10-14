package com.cybershield.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BenchmarkResultDto {
    private String algorithmId;
    private String algorithmName;
    private long inputSize;
    private int warmupRounds;
    private int trialRounds;
    private long medianTimeNanos;
    private long minTimeNanos;
    private long maxTimeNanos;
    private double stdDevTimeNanos;
    private long comparisonCount;
    private String methodology;
    private List<Long> trialTimesNanos;
}
