package com.cybershield.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MillerRabinRequest {

    @JsonAlias({"n", "candidateNumber", "number"})
    @Min(value = 1, message = "Number must be positive")
    @Max(value = 1_000_000_000_000_000L, message = "Number cannot exceed 10^15")
    private long number;

    @Min(value = 1, message = "Rounds must be at least 1")
    @Max(value = 50, message = "Rounds cannot exceed 50")
    @Builder.Default
    private int rounds = 10;

    private Long seed;

    @JsonProperty("n")
    public void setN(Object val) {
        if (val instanceof Number num) {
            this.number = num.longValue();
        } else if (val != null) {
            try {
                this.number = Long.parseLong(val.toString().trim());
            } catch (Exception ignored) {}
        }
    }
}
