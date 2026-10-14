package com.cybershield.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class ReservoirSamplingRequest {

    @NotEmpty(message = "Stream cannot be empty")
    @Size(max = 10000, message = "Stream cannot exceed 10000 elements")
    private List<String> stream;

    @JsonAlias({"k", "reservoirSize", "sampleSize"})
    @Min(value = 1, message = "Reservoir size must be at least 1")
    @Max(value = 1000, message = "Reservoir size cannot exceed 1000")
    @Builder.Default
    private int reservoirSize = 10;

    private Long seed;

    @JsonProperty("k")
    public void setK(int k) {
        this.reservoirSize = k;
    }
}
