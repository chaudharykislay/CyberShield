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
public class RandomizedSortRequest {

    @NotEmpty(message = "Array cannot be empty")
    @Size(max = 1000, message = "Array size cannot exceed 1000")
    private List<Integer> array;

    private Long seed;
}
