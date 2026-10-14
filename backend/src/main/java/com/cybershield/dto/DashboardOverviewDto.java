package com.cybershield.dto;

import com.cybershield.model.AnalysisExecution;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverviewDto {
    private long totalEvents;
    private long totalSignatures;
    private long totalExecutions;
    private List<AnalysisExecution> recentExecutions;
    private Map<String, ModuleStatDto> algorithmStats;
    private Map<String, String> systemStatus;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModuleStatDto {
        private String module;
        private long executionCount;
        private double avgExecutionTimeNanos;
    }
}
