package com.cybershield.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RabinKarpRequest {

    @NotNull(message = "Text cannot be null")
    @Size(max = 10000, message = "Text cannot exceed 10000 characters")
    private String text;

    @NotBlank(message = "Pattern cannot be blank")
    @Size(max = 1000, message = "Pattern cannot exceed 1000 characters")
    private String pattern;
}
