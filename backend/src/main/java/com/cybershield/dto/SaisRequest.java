package com.cybershield.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaisRequest {

    @NotBlank(message = "Text cannot be blank")
    @Size(max = 10000, message = "Text cannot exceed 10000 characters")
    private String text;
}
