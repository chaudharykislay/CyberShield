package com.cybershield.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrentsTheoremRequest {

    @JsonAlias({"work", "totalWork"})
    @Min(value = 1, message = "Total work must be at least 1")
    private long totalWork;

    @JsonAlias({"depth", "criticalPathDepth"})
    @Min(value = 1, message = "Critical path depth must be at least 1")
    private long criticalPathDepth;

    @JsonAlias({"processors", "processorCount"})
    @Min(value = 1, message = "Processor count must be at least 1")
    private int processorCount;
}
