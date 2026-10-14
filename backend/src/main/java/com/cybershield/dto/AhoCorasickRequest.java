package com.cybershield.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class AhoCorasickRequest {

    @NotNull(message = "Text cannot be null")
    @Size(max = 10000, message = "Text cannot exceed 10000 characters")
    private String text;

    @NotEmpty(message = "Patterns list cannot be empty")
    @Size(max = 20, message = "Maximum of 20 patterns allowed")
    private List<@NotBlank(message = "Pattern cannot be blank") @Size(max = 500, message = "Pattern length cannot exceed 500 characters") String> patterns;
}
