package com.cybershield.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BipartiteMatchingRequest {

    @Min(value = 1, message = "Left partition count must be at least 1")
    @Max(value = 50, message = "Left partition count cannot exceed 50")
    private int leftCount;

    @Min(value = 1, message = "Right partition count must be at least 1")
    @Max(value = 50, message = "Right partition count cannot exceed 50")
    private int rightCount;

    @NotNull(message = "Edges list cannot be null")
    private List<int[]> edges;
}
