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
public class SatRequest {

    @Min(value = 1, message = "Variables must be at least 1")
    @Max(value = 20, message = "Variables cannot exceed 20 for exhaustive solver")
    private int numVariables;

    @NotNull(message = "Clauses cannot be null")
    private List<List<Integer>> clauses;
}
