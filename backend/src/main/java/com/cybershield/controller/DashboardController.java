package com.cybershield.controller;

import com.cybershield.dto.DashboardOverviewDto;
import com.cybershield.model.AnalysisExecution;
import com.cybershield.repository.AnalysisExecutionRepository;
import com.cybershield.repository.SecurityEventRepository;
import com.cybershield.repository.ThreatSignatureRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "System metrics, event counts, execution analytics, and module stats")
public class DashboardController {

    private final SecurityEventRepository eventRepository;
    private final ThreatSignatureRepository signatureRepository;
    private final AnalysisExecutionRepository executionRepository;
    private final DataSource dataSource;

    @Operation(summary = "Dashboard Overview", description = "Aggregated counts, recent execution logs, and algorithm performance stats per module")
    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewDto> getOverview() {
        long totalEvents = eventRepository.count();
        long totalSignatures = signatureRepository.count();
        long totalExecutions = executionRepository.count();
        List<AnalysisExecution> recent = executionRepository.findTop10ByOrderByCreatedAtDesc();

        Map<String, DashboardOverviewDto.ModuleStatDto> moduleStats = new HashMap<>();
        try {
            List<Object[]> rawStats = executionRepository.findModuleStats();
            for (Object[] row : rawStats) {
                String mod = (String) row[0];
                long count = ((Number) row[1]).longValue();
                double avgTime = row[2] != null ? ((Number) row[2]).doubleValue() : 0.0;
                moduleStats.put(mod, new DashboardOverviewDto.ModuleStatDto(mod, count, avgTime));
            }
        } catch (Exception ex) {
            log.warn("Error fetching module stats: {}", ex.getMessage());
        }

        String dbStatus = "DOWN";
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) dbStatus = "UP";
        } catch (Exception ignored) {}

        Map<String, String> sysStatus = new HashMap<>();
        sysStatus.put("database", dbStatus);
        sysStatus.put("backend", "UP");

        DashboardOverviewDto dto = DashboardOverviewDto.builder()
                .totalEvents(totalEvents)
                .totalSignatures(totalSignatures)
                .totalExecutions(totalExecutions)
                .recentExecutions(recent)
                .algorithmStats(moduleStats)
                .systemStatus(sysStatus)
                .build();

        return ResponseEntity.ok(dto);
    }
}
