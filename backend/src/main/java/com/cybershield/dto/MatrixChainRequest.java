package com.cybershield.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatrixChainRequest {

    @NotEmpty(message = "Dimensions cannot be empty")
    @Size(min = 2, max = 50, message = "Dimensions array must have between 2 and 50 entries")
    private int[] dimensions;
}
