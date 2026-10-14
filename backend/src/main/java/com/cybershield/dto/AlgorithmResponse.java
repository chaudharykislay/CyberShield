package com.cybershield.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AlgorithmResponse<T> {
    private String executionId;
    private String algorithmId;
    private String status; // SUCCESS, ERROR, VALIDATION_ERROR
    private T result;
    private ExecutionMetrics metrics;
    @Builder.Default
    private List<String> trace = new ArrayList<>();
    @Builder.Default
    private List<String> warnings = new ArrayList<>();
    @Builder.Default
    private Instant timestamp = Instant.now();
    private String error;

    public static <T> AlgorithmResponse<T> success(String algorithmId, T result, ExecutionMetrics metrics, List<String> trace) {
        List<String> boundedTrace = trace != null && trace.size() > 500 ? trace.subList(0, 500) : (trace != null ? trace : new ArrayList<>());
        return AlgorithmResponse.<T>builder()
                .executionId(UUID.randomUUID().toString())
                .algorithmId(algorithmId)
                .status("SUCCESS")
                .result(result)
                .metrics(metrics)
                .trace(boundedTrace)
                .warnings(new ArrayList<>())
                .timestamp(Instant.now())
                .error(null)
                .build();
    }

    public static <T> AlgorithmResponse<T> error(String algorithmId, String errorMessage) {
        return AlgorithmResponse.<T>builder()
                .executionId(UUID.randomUUID().toString())
                .algorithmId(algorithmId)
                .status("ERROR")
                .metrics(ExecutionMetrics.builder().executionTimeNanos(0L).comparisonCount(0L).inputSize(0L).build())
                .trace(new ArrayList<>())
                .warnings(new ArrayList<>())
                .timestamp(Instant.now())
                .error(errorMessage)
                .build();
    }

    public static <T> AlgorithmResponse<T> validationError(String algorithmId, String errorMessage) {
        return AlgorithmResponse.<T>builder()
                .executionId(UUID.randomUUID().toString())
                .algorithmId(algorithmId)
                .status("VALIDATION_ERROR")
                .metrics(ExecutionMetrics.builder().executionTimeNanos(0L).comparisonCount(0L).inputSize(0L).build())
                .trace(new ArrayList<>())
                .warnings(new ArrayList<>())
                .timestamp(Instant.now())
                .error(errorMessage)
                .build();
    }
}
