package com.cybershield.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParallelScanRequest {

    @NotEmpty(message = "Array cannot be empty")
    @Size(max = 1024, message = "Array cannot exceed 1024 elements")
    private List<Integer> array;

    @Builder.Default
    private String operation = "SUM"; // SUM, MAX, MIN, AND, OR
}
