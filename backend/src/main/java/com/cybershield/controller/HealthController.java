package com.cybershield.controller;

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
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
@Tag(name = "System Health", description = "System and database connectivity status check")
public class HealthController {

    private final DataSource dataSource;

    @Operation(summary = "System Health Check", description = "Verifies Spring Boot backend runtime and PostgreSQL database connection")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new HashMap<>();
        String dbStatus = "DOWN";

        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                dbStatus = "UP";
            }
        } catch (Exception ex) {
            log.warn("Database health check failed: {}", ex.getMessage());
            dbStatus = "DOWN";
        }

        response.put("status", "UP".equals(dbStatus) ? "UP" : "DEGRADED");
        response.put("database", dbStatus);
        response.put("timestamp", Instant.now().toString());
        response.put("version", "1.0.0");
        response.put("platform", "CyberShield Enterprise Analytics Platform");

        return ResponseEntity.ok(response);
    }
}
